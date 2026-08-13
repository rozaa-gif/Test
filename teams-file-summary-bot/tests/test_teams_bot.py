"""Exercises FileSummaryBot's message-handling logic with a lightweight
stub TurnContext, so the bot's control flow is verified without needing a
real Bot Framework connection (which requires live Teams/emulator infra)."""
import asyncio
from pathlib import Path
from types import SimpleNamespace

import pytest

from bot.config import Config
from bot.teams_bot import FileSummaryBot

SAMPLE_DIR = Path(__file__).resolve().parent.parent / "sample_files"


class StubTurnContext:
    def __init__(self, text: str, conversation_id: str = "conv1"):
        self.sent = []
        self.activity = SimpleNamespace(
            conversation=SimpleNamespace(id=conversation_id),
            recipient=SimpleNamespace(id="bot1"),
            attachments=[],
            text=text,
            create_reply=lambda: SimpleNamespace(attachments=None, text=None),
        )

    async def send_activity(self, activity_or_text):
        self.sent.append(activity_or_text)


def _make_bot(tmp_path) -> FileSummaryBot:
    config = Config()
    config.KNOWLEDGE_FOLDER = str(SAMPLE_DIR)
    config.WORK_DIR = str(tmp_path / "work")
    return FileSummaryBot(config)


def test_message_without_query_sends_welcome(tmp_path):
    bot = _make_bot(tmp_path)
    ctx = StubTurnContext(text="")
    asyncio.run(bot.on_message_activity(ctx))
    assert len(ctx.sent) == 1
    assert "summarize" in ctx.sent[0].lower()


def test_message_with_query_generates_report_and_offers_file(tmp_path):
    bot = _make_bot(tmp_path)
    ctx = StubTurnContext(text="summarize sales performance by region")
    asyncio.run(bot.on_message_activity(ctx))

    # First message: "working on it", second: done summary + a file-consent reply.
    assert len(ctx.sent) >= 2
    assert any("working on it" in str(m).lower() for m in ctx.sent)
    assert any(getattr(m, "attachments", None) for m in ctx.sent)

    conversation_id = ctx.activity.conversation.id
    state = bot._state_for(conversation_id)
    assert state["pending"], "expected a pending report awaiting file consent"
    (report_path,) = state["pending"].values()
    assert Path(report_path).exists()
