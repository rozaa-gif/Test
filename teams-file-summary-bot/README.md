# Teams File Summary Bot

A Microsoft Teams chatbot that reads files (its own knowledge folder and/or
whatever you attach in the chat), and turns them into a Word (`.docx`)
report containing:

- An executive summary and per-file extractive summaries, focused on what
  you asked for
- A statistics section (word counts, sentence counts, table counts,
  top keywords, numeric column summaries)
- Diagrams (bar charts) for keyword frequency, content volume per file,
  and numeric data found in tables

No LLM is used — summarization is done with local, rule-based extractive
techniques (frequency-weighted sentence scoring, keyword extraction, and
statistical description of tabular data), so the bot runs fully offline
with no API key required.

## How it works

```
core/
  parsers.py      # txt/md, docx, pdf, csv, xlsx -> ParsedFile(text, tables)
  stats.py         # word/sentence counts, keyword frequency, numeric column stats
  summarizer.py    # extractive summarization, weighted toward the user's query
  charts.py        # matplotlib bar charts -> PNG bytes
  doc_builder.py   # assembles the final .docx with python-docx
  engine.py         # orchestrates the pipeline; the ONE entry point used by
                     # both the CLI and the Teams bot, so behavior is identical
bot/
  app.py           # aiohttp server exposing POST /api/messages for Teams
  teams_bot.py     # ActivityHandler: receives attachments + query, runs the
                     # engine, offers the report back via Teams' file-consent flow
  config.py        # env-var configuration
cli/
  main.py          # local test harness — runs the same engine with no
                     # chat platform or credentials required
```

Because the bot and the CLI both call `core.engine.run(...)`, you can fully
exercise the summarization/statistics/chart/doc-generation pipeline locally
without ever touching Teams or Azure.

## User input drives the report

- **Files**: the bot always has access to `KNOWLEDGE_FOLDER` (defaults to
  `sample_files/`), plus any files attached in the conversation.
- **Query**: whatever you type (e.g. *"summarize revenue trends by
  region"*) is used to (a) filter to files that actually mention those
  topics, when there's a match, and (b) bias sentence selection in the
  summarizer toward sentences containing those terms.
- Ask with no attachment and it summarizes the knowledge folder; attach
  files and ask, and it summarizes those (plus the knowledge folder).

## Quickstart: local CLI (no credentials needed)

```bash
pip install -r requirements.txt
python -m cli.main --source sample_files --query "summarize sales performance by region" --out output/report.docx
```

This is the fastest way to see the pipeline work end-to-end — point
`--source` at any folder or file (repeatable flag) and open the resulting
`.docx`.

## Running the Teams bot

1. Install dependencies: `pip install -r requirements.txt`
2. Copy `.env.example` to `.env` and fill in `MicrosoftAppId` /
   `MicrosoftAppPassword` from an [Azure Bot Service registration](https://learn.microsoft.com/microsoftteams/platform/bots/how-to/create-a-bot-for-teams).
   Leave them blank to test locally with the
   [Bot Framework Emulator](https://github.com/microsoft/BotFramework-Emulator)
   (auth disabled).
3. Start the server: `python -m bot.app` (listens on `PORT`, default 3978,
   at `POST /api/messages`).
4. Point the Bot Framework Emulator (local) or your Azure Bot's messaging
   endpoint (`https://<your-tunnel>/api/messages`, e.g. via `ngrok` for local
   dev) at that URL, then chat with it from Teams or the emulator.
5. Attach a file and/or type your request. The bot downloads any
   attachments, runs the engine, and offers the generated `.docx` back
   through Teams' file-consent card (accept to receive the download).

## Tests

```bash
pip install -r requirements.txt pytest
python -m pytest tests/ -v
```

`tests/test_engine.py` runs the full parse → stats → summarize → chart →
docx pipeline against the sample files and asserts on the resulting
document's structure. `tests/test_teams_bot.py` exercises the bot's
message-handling logic (welcome message, report generation, file-consent
offer) against a lightweight stub `TurnContext`, without requiring a live
Bot Framework connection.

## Supported file types

`.txt`, `.md`, `.docx`, `.pdf`, `.csv`, `.xlsx`, `.xls`. Unsupported or
unparsable files are skipped with a warning rather than failing the whole
report.
