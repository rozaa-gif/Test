"""aiohttp server exposing the /api/messages endpoint that Teams (via Azure
Bot Service) posts activities to.

Run with:
    python -m bot.app
Requires MicrosoftAppId / MicrosoftAppPassword env vars once registered
with Azure Bot Service; without them it still runs and can be exercised
locally with the Bot Framework Emulator (https://github.com/microsoft/BotFramework-Emulator).
"""
from __future__ import annotations

import sys
import traceback
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent.parent))

from aiohttp import web
from aiohttp.web import Request, Response, json_response
from botbuilder.core import BotFrameworkAdapterSettings, TurnContext
from botbuilder.core.integration import aiohttp_error_middleware
from botbuilder.integration.aiohttp import CloudAdapter, ConfigurationBotFrameworkAuthentication
from botbuilder.schema import Activity

from bot.config import Config
from bot.teams_bot import FileSummaryBot

CONFIG = Config()
ADAPTER = CloudAdapter(ConfigurationBotFrameworkAuthentication(CONFIG))
BOT = FileSummaryBot(CONFIG)


async def on_error(context: TurnContext, error: Exception):
    print(f"[on_turn_error] unhandled error: {error}", file=sys.stderr)
    traceback.print_exc()
    await context.send_activity("Sorry, something went wrong processing that request.")


ADAPTER.on_turn_error = on_error


async def messages(req: Request) -> Response:
    if "application/json" not in req.headers.get("Content-Type", ""):
        return Response(status=415)

    body = await req.json()
    activity = Activity().deserialize(body)
    auth_header = req.headers.get("Authorization", "")

    response = await ADAPTER.process_activity(auth_header, activity, BOT.on_turn)
    if response:
        return json_response(data=response.body, status=response.status)
    return Response(status=201)


def create_app() -> web.Application:
    app = web.Application(middlewares=[aiohttp_error_middleware])
    app.router.add_post("/api/messages", messages)
    return app


if __name__ == "__main__":
    web.run_app(create_app(), host="0.0.0.0", port=CONFIG.PORT)
