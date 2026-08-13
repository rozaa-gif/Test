"""Microsoft Teams bot: user sends a request (optionally with file
attachments), the bot runs the core engine (parse -> stats -> summarize ->
charts -> docx) against the attached files plus a default knowledge folder,
then offers the generated Word report back via Teams' file-consent flow.
"""
from __future__ import annotations

import uuid
from pathlib import Path

import requests
from botbuilder.core import TurnContext
from botbuilder.core.teams import TeamsActivityHandler
from botbuilder.schema import Attachment, ChannelAccount
from botbuilder.schema.teams import (
    FileConsentCard,
    FileConsentCardResponse,
    FileDownloadInfo,
    FileInfoCard,
)

from bot.config import Config
from core.engine import run as run_engine

WELCOME_TEXT = (
    "Hi! I summarize files into a Word report with statistics and diagrams.\n\n"
    "Attach one or more files (txt, docx, pdf, csv, xlsx) and tell me what "
    "you want summarized, e.g. *\"summarize revenue trends by region\"*. "
    "If you don't attach anything, I'll use the shared knowledge folder."
)


class FileSummaryBot(TeamsActivityHandler):
    def __init__(self, config: Config):
        self._config = config
        # conversation_id -> {"dir": Path, "pending": {filename: Path}}
        self._conversation_state: dict[str, dict] = {}

    def _state_for(self, conversation_id: str) -> dict:
        if conversation_id not in self._conversation_state:
            conv_dir = Path(self._config.WORK_DIR) / conversation_id
            conv_dir.mkdir(parents=True, exist_ok=True)
            self._conversation_state[conversation_id] = {"dir": conv_dir, "pending": {}}
        return self._conversation_state[conversation_id]

    async def on_members_added_activity(
        self, members_added: list[ChannelAccount], turn_context: TurnContext
    ):
        for member in members_added:
            if member.id != turn_context.activity.recipient.id:
                await turn_context.send_activity(WELCOME_TEXT)

    async def on_message_activity(self, turn_context: TurnContext):
        conversation_id = turn_context.activity.conversation.id
        state = self._state_for(conversation_id)

        incoming_files = [
            a
            for a in (turn_context.activity.attachments or [])
            if a.content_type == "application/vnd.microsoft.teams.file.download.info"
        ]
        for attachment in incoming_files:
            await self._download_attachment(state, attachment)

        query = (turn_context.activity.text or "").strip()
        if incoming_files and not query:
            names = ", ".join(a.name for a in incoming_files)
            await turn_context.send_activity(f"Got it — received {names}. What should I summarize or focus on?")
            return

        if not query:
            await turn_context.send_activity(WELCOME_TEXT)
            return

        await turn_context.send_activity("Working on it — parsing files and building your report...")
        await self._generate_and_offer_report(turn_context, state, query)

    async def _download_attachment(self, state: dict, attachment: Attachment) -> None:
        file_download = FileDownloadInfo().deserialize(attachment.content)
        response = requests.get(file_download.download_url, timeout=60)
        response.raise_for_status()
        dest = state["dir"] / attachment.name
        dest.write_bytes(response.content)

    async def _generate_and_offer_report(self, turn_context: TurnContext, state: dict, query: str) -> None:
        sources = [state["dir"]]
        if self._config.KNOWLEDGE_FOLDER and Path(self._config.KNOWLEDGE_FOLDER).exists():
            sources.append(Path(self._config.KNOWLEDGE_FOLDER))

        report_name = f"summary-{uuid.uuid4().hex[:8]}.docx"
        report_path = state["dir"] / report_name

        try:
            result = run_engine(sources=sources, query=query, output_path=report_path)
        except ValueError as exc:
            await turn_context.send_activity(f"I couldn't generate a report: {exc}")
            return

        state["pending"][report_name] = report_path
        summary_line = (
            f"Done. Used {result.files_used} of {result.files_considered} file(s) considered."
        )
        if result.warnings:
            summary_line += f" ({len(result.warnings)} file(s) skipped due to parse errors.)"
        await turn_context.send_activity(summary_line)
        await self._send_file_consent_card(turn_context, report_name, report_path.stat().st_size)

    async def _send_file_consent_card(self, turn_context: TurnContext, filename: str, size_in_bytes: int) -> None:
        consent_context = {"filename": filename}
        file_card = FileConsentCard(
            description="Your generated summary report",
            size_in_bytes=size_in_bytes,
            accept_context=consent_context,
            decline_context=consent_context,
        )
        attachment = Attachment(
            content=file_card.serialize(),
            content_type="application/vnd.microsoft.teams.card.file.consent",
            name=filename,
        )
        reply = turn_context.activity.create_reply()
        reply.attachments = [attachment]
        await turn_context.send_activity(reply)

    async def on_teams_file_consent_accept(
        self, turn_context: TurnContext, file_consent_card_response: FileConsentCardResponse
    ):
        conversation_id = turn_context.activity.conversation.id
        state = self._state_for(conversation_id)
        filename = file_consent_card_response.context["filename"]
        file_path = state["pending"].get(filename)

        if not file_path or not file_path.exists():
            await turn_context.send_activity("Sorry, I couldn't find that report anymore.")
            return

        data = file_path.read_bytes()
        headers = {
            "Content-Length": str(len(data)),
            "Content-Range": f"bytes 0-{len(data) - 1}/{len(data)}",
            "Content-Type": "application/octet-stream",
        }
        upload_response = requests.put(
            file_consent_card_response.upload_info.upload_url, data=data, headers=headers, timeout=120
        )

        if upload_response.status_code not in (200, 201):
            await turn_context.send_activity(f"Upload failed (status {upload_response.status_code}).")
            return

        upload_info = file_consent_card_response.upload_info
        info_card = FileInfoCard(unique_id=upload_info.unique_id, file_type=upload_info.file_type)
        attachment = Attachment(
            content=info_card.serialize(),
            content_type="application/vnd.microsoft.teams.card.file.info",
            name=upload_info.name,
            content_url=upload_info.content_url,
        )
        reply = turn_context.activity.create_reply()
        reply.text = f"Here's your report: {upload_info.name}"
        reply.attachments = [attachment]
        await turn_context.send_activity(reply)

    async def on_teams_file_consent_decline(
        self, turn_context: TurnContext, file_consent_card_response: FileConsentCardResponse
    ):
        filename = file_consent_card_response.context["filename"]
        await turn_context.send_activity(f"No problem, I won't send {filename}.")
