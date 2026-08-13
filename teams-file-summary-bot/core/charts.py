"""Chart generation with matplotlib. Charts are rendered to PNG bytes so
doc_builder can embed them directly into the Word document."""
from __future__ import annotations

import io

import matplotlib

matplotlib.use("Agg")  # headless, no display needed
import matplotlib.pyplot as plt

from core.stats import AggregateStats, NumericColumnStats

_COLORS = ["#2E5EAA", "#5DA271", "#D68C45", "#B24C63", "#7A5195", "#3A7CA5"]


def _fig_to_png_bytes(fig) -> bytes:
    buf = io.BytesIO()
    fig.savefig(buf, format="png", dpi=150, bbox_inches="tight")
    plt.close(fig)
    buf.seek(0)
    return buf.read()


def keyword_bar_chart(top_keywords: list[tuple[str, int]], title: str = "Top Keywords") -> bytes | None:
    if not top_keywords:
        return None
    words = [w for w, _ in top_keywords][:10][::-1]
    counts = [c for _, c in top_keywords][:10][::-1]
    fig, ax = plt.subplots(figsize=(6, 4))
    ax.barh(words, counts, color=_COLORS[0])
    ax.set_xlabel("Occurrences")
    ax.set_title(title)
    fig.tight_layout()
    return _fig_to_png_bytes(fig)


def file_size_bar_chart(per_file_word_counts: list[tuple[str, int]]) -> bytes | None:
    if not per_file_word_counts:
        return None
    names = [n for n, _ in per_file_word_counts]
    counts = [c for _, c in per_file_word_counts]
    fig, ax = plt.subplots(figsize=(6, max(3, 0.4 * len(names))))
    ax.barh(names, counts, color=_COLORS[1])
    ax.set_xlabel("Word count")
    ax.set_title("Content Volume by File")
    fig.tight_layout()
    return _fig_to_png_bytes(fig)


def numeric_column_chart(columns: list[NumericColumnStats]) -> bytes | None:
    """One grouped bar chart comparing mean/min/max for up to 6 numeric columns."""
    if not columns:
        return None
    subset = columns[:6]
    labels = [f"{c.table_source}\n{c.column}" for c in subset]
    means = [c.mean for c in subset]
    mins = [c.minimum for c in subset]
    maxs = [c.maximum for c in subset]

    fig, ax = plt.subplots(figsize=(max(6, 1.6 * len(subset)), 4.5))
    x = range(len(subset))
    width = 0.25
    ax.bar([i - width for i in x], mins, width=width, label="Min", color=_COLORS[2])
    ax.bar(list(x), means, width=width, label="Mean", color=_COLORS[0])
    ax.bar([i + width for i in x], maxs, width=width, label="Max", color=_COLORS[3])
    ax.set_xticks(list(x))
    ax.set_xticklabels(labels, rotation=30, ha="right", fontsize=8)
    ax.set_title("Numeric Column Summary")
    ax.legend()
    fig.tight_layout()
    return _fig_to_png_bytes(fig)


def build_charts(aggregate: AggregateStats) -> dict[str, bytes]:
    charts: dict[str, bytes] = {}

    keyword_png = keyword_bar_chart(aggregate.top_keywords)
    if keyword_png:
        charts["keywords"] = keyword_png

    per_file_counts = [(fs.file_name, fs.word_count) for fs in aggregate.per_file]
    volume_png = file_size_bar_chart(per_file_counts)
    if volume_png:
        charts["volume"] = volume_png

    all_numeric = [nc for fs in aggregate.per_file for nc in fs.numeric_columns]
    numeric_png = numeric_column_chart(all_numeric)
    if numeric_png:
        charts["numeric"] = numeric_png

    return charts
