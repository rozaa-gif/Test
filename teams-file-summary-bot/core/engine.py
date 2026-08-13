"""Orchestrates the end-to-end pipeline: discover files -> parse -> filter by
user query -> compute stats -> summarize -> build charts -> write .docx.

This is the single entry point shared by both the CLI harness and the Teams
bot, so behavior is identical regardless of how the request came in.
"""
from __future__ import annotations

from dataclasses import dataclass
from pathlib import Path

from core import charts as charts_mod
from core import doc_builder
from core.parsers import ParsedFile, discover_files, parse_file
from core.stats import (
    AggregateStats,
    compute_aggregate_stats,
    compute_file_stats,
    describe_numeric_columns,
    extract_keywords,
)
from core.summarizer import summarize


@dataclass
class EngineResult:
    output_path: Path
    files_considered: int
    files_used: int
    warnings: list[str]


def run(
    *,
    sources: list[Path],
    query: str,
    output_path: Path,
    max_sentences_per_file: int = 5,
) -> EngineResult:
    warnings: list[str] = []

    all_files: list[Path] = []
    for source in sources:
        all_files.extend(discover_files(source))
    all_files = sorted(set(all_files))

    if not all_files:
        raise ValueError("No supported files found in the given source(s).")

    parsed_files = [parse_file(p) for p in all_files]
    for pf in parsed_files:
        if pf.error:
            warnings.append(f"{pf.name}: {pf.error}")
    parsed_files = [pf for pf in parsed_files if not pf.error]

    if not parsed_files:
        raise ValueError("None of the discovered files could be parsed.")

    selected = _filter_by_query(parsed_files, query)

    file_stats = [compute_file_stats(pf) for pf in selected]
    aggregate: AggregateStats = compute_aggregate_stats(file_stats)

    file_summaries: dict[str, list[str]] = {}
    for pf, fs in zip(selected, file_stats):
        if pf.is_tabular:
            file_summaries[pf.name] = describe_numeric_columns(fs.numeric_columns) or [
                "No numeric columns were found to summarize in this file."
            ]
        else:
            result = summarize(pf.text, query=query, max_sentences=max_sentences_per_file)
            file_summaries[pf.name] = result.sentences

    chart_images = charts_mod.build_charts(aggregate)

    doc_builder.build_report(
        output_path=output_path,
        query=query,
        aggregate=aggregate,
        file_summaries=file_summaries,
        charts=chart_images,
    )

    return EngineResult(
        output_path=output_path,
        files_considered=len(parsed_files),
        files_used=len(selected),
        warnings=warnings,
    )


def _filter_by_query(parsed_files: list[ParsedFile], query: str) -> list[ParsedFile]:
    """If the user's request names specific topics/files, narrow to files that
    actually match; otherwise (or if nothing matches) fall back to all files
    so the report is never empty."""
    query = query.strip()
    if not query:
        return parsed_files

    terms = set(extract_keywords(query, limit=30))
    if not terms:
        return parsed_files

    scored = []
    for pf in parsed_files:
        haystack = f"{pf.name.lower()} {pf.text.lower()}"
        score = sum(haystack.count(term) for term in terms)
        scored.append((score, pf))

    matched = [pf for score, pf in scored if score > 0]
    return matched if matched else parsed_files
