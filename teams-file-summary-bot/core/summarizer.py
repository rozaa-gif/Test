"""Extractive summarization: no LLM calls, pure frequency-based sentence
scoring (Luhn-style), optionally weighted toward terms in the user's query
so the summary focuses on what the user actually asked about."""
from __future__ import annotations

import re
from collections import Counter
from dataclasses import dataclass

from core.stats import STOPWORDS, extract_keywords

_SENTENCE_SPLIT_RE = re.compile(r"(?<=[.!?])\s+(?=[A-Z0-9])")
_WORD_RE = re.compile(r"[A-Za-z][A-Za-z'-]{1,}")


@dataclass
class Summary:
    sentences: list[str]
    matched_query_terms: list[str]


def split_sentences(text: str) -> list[str]:
    text = re.sub(r"\s+", " ", text).strip()
    if not text:
        return []
    sentences = _SENTENCE_SPLIT_RE.split(text)
    return [s.strip() for s in sentences if len(s.strip()) > 20]


def summarize(text: str, query: str = "", max_sentences: int = 5) -> Summary:
    sentences = split_sentences(text)
    if not sentences:
        return Summary(sentences=[], matched_query_terms=[])

    word_freq = Counter()
    for sentence in sentences:
        for word in _WORD_RE.findall(sentence.lower()):
            if word not in STOPWORDS and len(word) > 2:
                word_freq[word] += 1
    if word_freq:
        max_freq = max(word_freq.values())
        for word in word_freq:
            word_freq[word] /= max_freq

    query_terms = set(extract_keywords(query, limit=30)) if query.strip() else set()

    scored: list[tuple[float, int, str]] = []
    for position, sentence in enumerate(sentences):
        words = [w for w in _WORD_RE.findall(sentence.lower()) if w not in STOPWORDS and len(w) > 2]
        if not words:
            continue
        base_score = sum(word_freq.get(w, 0) for w in words) / len(words)
        query_overlap = len(query_terms.intersection(words))
        query_boost = query_overlap * 0.5
        position_boost = 0.15 if position == 0 else 0.0
        scored.append((base_score + query_boost + position_boost, position, sentence))

    top = sorted(scored, key=lambda s: s[0], reverse=True)[:max_sentences]
    top_in_order = [s for _, _, s in sorted(top, key=lambda s: s[1])]

    matched_terms = sorted(query_terms) if query_terms else []
    return Summary(sentences=top_in_order, matched_query_terms=matched_terms)
