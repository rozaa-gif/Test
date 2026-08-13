"""Statistics extraction over parsed files: text stats, keyword frequency,
and numeric summaries pulled from any tables (csv/xlsx/docx/pdf tables)."""
from __future__ import annotations

import re
from collections import Counter
from dataclasses import dataclass, field

import pandas as pd

from core.parsers import ParsedFile

_WORD_RE = re.compile(r"[A-Za-z][A-Za-z'-]{1,}")

STOPWORDS = {
    "the", "a", "an", "and", "or", "but", "if", "of", "to", "in", "on", "for",
    "with", "is", "are", "was", "were", "be", "been", "being", "this", "that",
    "these", "those", "it", "its", "as", "at", "by", "from", "into", "over",
    "under", "we", "you", "they", "he", "she", "them", "our", "your", "their",
    "will", "would", "can", "could", "should", "not", "no", "yes", "so",
    "than", "then", "there", "here", "which", "who", "whom", "what", "when",
    "where", "why", "how", "all", "any", "both", "each", "few", "more",
    "most", "other", "some", "such", "only", "own", "same", "just", "also",
    "have", "has", "had", "do", "does", "did", "i", "us", "about",
}


@dataclass
class NumericColumnStats:
    table_source: str
    column: str
    count: int
    total: float
    mean: float
    minimum: float
    maximum: float


@dataclass
class FileStats:
    file_name: str
    word_count: int
    sentence_count: int
    table_count: int
    top_keywords: list[tuple[str, int]] = field(default_factory=list)
    numeric_columns: list[NumericColumnStats] = field(default_factory=list)


def compute_file_stats(parsed: ParsedFile) -> FileStats:
    words = _WORD_RE.findall(parsed.text.lower())
    keyword_counts = Counter(w for w in words if w not in STOPWORDS and len(w) > 2)
    sentence_count = max(1, len(re.findall(r"[.!?]+(?:\s|$)", parsed.text))) if parsed.text.strip() else 0

    numeric_columns: list[NumericColumnStats] = []
    for idx, df in enumerate(parsed.tables):
        source = f"{parsed.name} - table {idx + 1}"
        for col in df.select_dtypes(include="number").columns:
            series = df[col].dropna()
            if series.empty:
                continue
            numeric_columns.append(
                NumericColumnStats(
                    table_source=source,
                    column=str(col),
                    count=int(series.count()),
                    total=float(series.sum()),
                    mean=float(series.mean()),
                    minimum=float(series.min()),
                    maximum=float(series.max()),
                )
            )

    return FileStats(
        file_name=parsed.name,
        word_count=len(words),
        sentence_count=sentence_count,
        table_count=len(parsed.tables),
        top_keywords=keyword_counts.most_common(10),
        numeric_columns=numeric_columns,
    )


@dataclass
class AggregateStats:
    file_count: int
    total_word_count: int
    total_table_count: int
    top_keywords: list[tuple[str, int]]
    per_file: list[FileStats]


def compute_aggregate_stats(per_file: list[FileStats]) -> AggregateStats:
    combined = Counter()
    for fs in per_file:
        combined.update(dict(fs.top_keywords))
    return AggregateStats(
        file_count=len(per_file),
        total_word_count=sum(fs.word_count for fs in per_file),
        total_table_count=sum(fs.table_count for fs in per_file),
        top_keywords=combined.most_common(15),
        per_file=per_file,
    )


def describe_numeric_columns(columns: list[NumericColumnStats]) -> list[str]:
    """Turn numeric column stats into plain-English sentences, used as the
    'summary' for tabular files (csv/xlsx) instead of dumping raw rows."""
    sentences = []
    for c in columns:
        sentences.append(
            f"{c.column} ranges from {c.minimum:,.2f} to {c.maximum:,.2f} "
            f"(average {c.mean:,.2f}, total {c.total:,.2f}) across {c.count} entries."
        )
    return sentences


def extract_keywords(text: str, limit: int = 20) -> list[str]:
    words = _WORD_RE.findall(text.lower())
    counts = Counter(w for w in words if w not in STOPWORDS and len(w) > 2)
    return [w for w, _ in counts.most_common(limit)]
