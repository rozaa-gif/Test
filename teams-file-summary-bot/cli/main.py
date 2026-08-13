"""Local test harness: exercises the exact same core engine the Teams bot
uses, without needing any chat platform credentials.

Usage:
    python -m cli.main --source sample_files --query "summarize sales trends" --out output/report.docx
"""
from __future__ import annotations

import argparse
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent.parent))

from core.engine import run  # noqa: E402


def main() -> None:
    parser = argparse.ArgumentParser(description="Summarize files into a Word report.")
    parser.add_argument(
        "--source",
        action="append",
        required=True,
        help="File or folder to include. Repeat --source to add more.",
    )
    parser.add_argument("--query", default="", help="What you want summarized/focused on.")
    parser.add_argument("--out", default="output/report.docx", help="Output .docx path.")
    parser.add_argument("--max-sentences", type=int, default=5, help="Summary sentences per file.")
    args = parser.parse_args()

    sources = [Path(s) for s in args.source]
    output_path = Path(args.out)

    result = run(
        sources=sources,
        query=args.query,
        output_path=output_path,
        max_sentences_per_file=args.max_sentences,
    )

    print(f"Report written to: {result.output_path}")
    print(f"Files considered: {result.files_considered}, files used: {result.files_used}")
    if result.warnings:
        print("Warnings:")
        for w in result.warnings:
            print(f"  - {w}")


if __name__ == "__main__":
    main()
