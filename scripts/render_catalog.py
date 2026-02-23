#!/usr/bin/env python3
"""Render MkDocs pages from catalog.json."""

from __future__ import annotations

import json
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
CATALOG = ROOT / "catalog.json"
DOCS = ROOT / "docs"
PAPERS_DIR = DOCS / "papers"
PAPERS_MONTHS_DIR = PAPERS_DIR / "by-month"
PAPERS_YEARS_DIR = PAPERS_DIR / "by-year"
THEMES_DIR = DOCS / "themes"

DATE_DAY_RE = re.compile(r"^\d{4}-\d{2}-\d{2}$")
DATE_MONTH_RE = re.compile(r"^\d{4}-\d{2}$")


def slugify(text: str) -> str:
    slug = re.sub(r"[^a-z0-9]+", "-", text.lower()).strip("-")
    return slug or "theme"


def published_papers(data: dict) -> list[dict]:
    papers = [p for p in data.get("papers", []) if p.get("published", True)]
    papers.sort(key=lambda p: (p.get("order", 10_000), p.get("title", "")))
    return papers


def paper_date_value(paper: dict) -> str:
    return str(paper.get("date", "")).strip()


def paper_date_label(paper: dict) -> str:
    d = paper_date_value(paper)
    return d or "undated"


def paper_date_sort_token(paper: dict) -> str:
    d = paper_date_value(paper)
    if DATE_DAY_RE.match(d):
        return d
    if DATE_MONTH_RE.match(d):
        return f"{d}-00"
    return "0000-00-00"


def paper_month_key(paper: dict) -> str:
    d = paper_date_value(paper)
    if DATE_DAY_RE.match(d):
        return d[:7]
    if DATE_MONTH_RE.match(d):
        return d
    return "undated"


def paper_year_key(paper: dict) -> str:
    d = paper_date_value(paper)
    if DATE_DAY_RE.match(d) or DATE_MONTH_RE.match(d):
        return d[:4]
    return "undated"


def papers_alphabetical(papers: list[dict]) -> list[dict]:
    return sorted(papers, key=lambda p: p.get("title", "").lower())


def papers_chronological(papers: list[dict]) -> list[dict]:
    items = sorted(papers, key=lambda p: p.get("title", "").lower())
    return sorted(items, key=paper_date_sort_token, reverse=True)


def paper_month_groups(papers: list[dict]) -> list[tuple[str, list[dict]]]:
    grouped: dict[str, list[dict]] = {}
    for paper in papers:
        grouped.setdefault(paper_month_key(paper), []).append(paper)

    month_keys = sorted((m for m in grouped if m != "undated"), reverse=True)
    if "undated" in grouped:
        month_keys.append("undated")

    out: list[tuple[str, list[dict]]] = []
    for month in month_keys:
        items = sorted(grouped[month], key=lambda p: p.get("title", "").lower())
        items = sorted(items, key=paper_date_sort_token, reverse=True)
        out.append((month, items))
    return out


def paper_year_groups(papers: list[dict]) -> list[tuple[str, list[dict]]]:
    grouped: dict[str, list[dict]] = {}
    for paper in papers:
        grouped.setdefault(paper_year_key(paper), []).append(paper)

    year_keys = sorted((y for y in grouped if y != "undated"), reverse=True)
    if "undated" in grouped:
        year_keys.append("undated")

    out: list[tuple[str, list[dict]]] = []
    for year in year_keys:
        items = sorted(grouped[year], key=lambda p: p.get("title", "").lower())
        items = sorted(items, key=paper_date_sort_token, reverse=True)
        out.append((year, items))
    return out


def chips(themes: list[str], prefix: str = "") -> str:
    # Use Markdown links (with attr_list classes) so MkDocs rewrites .md -> .html.
    links: list[str] = []
    for theme in themes:
        slug = slugify(theme)
        links.append(f"[{theme}]({prefix}themes/{slug}.md){{ .theme-chip }}")
    return " ".join(links)


def paper_page(paper: dict) -> str:
    slug = paper["slug"]
    title = paper["title"]
    summary = paper["summary"]
    pdf = paper["pdf"]
    themes = paper.get("themes", [])
    date_line = f"**Date:** {paper_date_label(paper)}"

    return f"""# {title}

{summary}

{date_line}

{chips(themes, prefix="../")}

[Open PDF](../pdf/{pdf}) | <a href=\"../pdf/{pdf}\" download>Download PDF</a>

![First page preview](../assets/thumbs/{slug}.png){{ .paper-thumb-large }}

## Inline Reader

<iframe src=\"../pdf/{pdf}#view=FitH\" class=\"pdf-frame\" title=\"{title}\" loading=\"lazy\"></iframe>
"""


def papers_index(papers: list[dict]) -> str:
    lines: list[str] = [
        "# Papers",
        "",
        "Browse papers in both alphabetical and chronological views.",
        "",
        "- [Alphabetical](alphabetical.md)",
        "- [Chronological](chronological.md)",
        "- [By Month](by-month/index.md)",
        "- [By Year](by-year/index.md)",
        "",
        "## Recent Papers",
        "",
    ]
    for paper in papers_chronological(papers)[:10]:
        lines.append(
            f"- **[{paper['title']}]({paper['slug']}.md)** ({paper_date_label(paper)})"
        )
    lines.append("")
    return "\n".join(lines)


def papers_alphabetical_page(papers: list[dict]) -> str:
    lines: list[str] = [
        "# Papers: Alphabetical",
        "",
        "[Papers overview](index.md) · [Chronological](chronological.md) · [By month](by-month/index.md) · [By year](by-year/index.md)",
        "",
    ]
    for paper in papers_alphabetical(papers):
        title = paper["title"]
        slug = paper["slug"]
        summary = paper["summary"]
        lines.extend(
            [
                f"- **[{title}]({slug}.md)** ({paper_date_label(paper)})",
                f"  {summary}",
                "",
            ]
        )
    return "\n".join(lines)


def papers_chronological_page(papers: list[dict]) -> str:
    lines: list[str] = [
        "# Papers: Chronological",
        "",
        "[Papers overview](index.md) · [Alphabetical](alphabetical.md) · [By month](by-month/index.md) · [By year](by-year/index.md)",
        "",
    ]
    for month, items in paper_month_groups(papers):
        lines.extend(
            [
                f"## {month}",
                "",
                f"[Open month page](by-month/{month}.md)",
                "",
            ]
        )
        for paper in items:
            lines.append(
                f"- **[{paper['title']}]({paper['slug']}.md)** ({paper_date_label(paper)})"
            )
        lines.append("")
    return "\n".join(lines)


def papers_by_month_index(papers: list[dict]) -> str:
    lines: list[str] = [
        "# Papers by Month",
        "",
        "[Papers overview](../index.md) · [Alphabetical](../alphabetical.md) · [Chronological](../chronological.md) · [By year](../by-year/index.md)",
        "",
    ]
    for month, items in paper_month_groups(papers):
        lines.append(f"- [{month} ({len(items)})]({month}.md)")
    lines.append("")
    return "\n".join(lines)


def papers_by_month_page(month: str, papers: list[dict]) -> str:
    lines: list[str] = [
        f"# Papers in {month}",
        "",
        "[All months](index.md) · [All years](../by-year/index.md) · [Chronological](../chronological.md) · [Alphabetical](../alphabetical.md)",
        "",
    ]
    for paper in papers:
        title = paper["title"]
        slug = paper["slug"]
        summary = paper["summary"]
        lines.extend(
            [
                f"- **[{title}](../{slug}.md)** ({paper_date_label(paper)})",
                f"  {summary}",
                "",
            ]
        )
    return "\n".join(lines)


def papers_by_year_index(papers: list[dict]) -> str:
    lines: list[str] = [
        "# Papers by Year",
        "",
        "[Papers overview](../index.md) · [Alphabetical](../alphabetical.md) · [Chronological](../chronological.md) · [By month](../by-month/index.md)",
        "",
    ]
    for year, items in paper_year_groups(papers):
        lines.append(f"- [{year} ({len(items)})]({year}.md)")
    lines.append("")
    return "\n".join(lines)


def papers_by_year_page(year: str, papers: list[dict]) -> str:
    lines: list[str] = [
        f"# Papers in {year}",
        "",
        "[All years](index.md) · [All months](../by-month/index.md) · [Chronological](../chronological.md) · [Alphabetical](../alphabetical.md)",
        "",
    ]
    for paper in papers:
        title = paper["title"]
        slug = paper["slug"]
        summary = paper["summary"]
        lines.extend(
            [
                f"- **[{title}](../{slug}.md)** ({paper_date_label(paper)})",
                f"  {summary}",
                "",
            ]
        )
    return "\n".join(lines)


def theme_map(papers: list[dict]) -> dict[str, dict]:
    mapping: dict[str, dict] = {}
    for paper in papers:
        for theme in paper.get("themes", []):
            slug = slugify(theme)
            if slug not in mapping:
                mapping[slug] = {"name": theme, "slug": slug, "papers": []}
            mapping[slug]["papers"].append(paper)
    return mapping


def themes_index(mapping: dict[str, dict]) -> str:
    lines: list[str] = [
        "# Themes",
        "",
        "Click a theme to browse matching papers.",
        "",
    ]
    for item in sorted(mapping.values(), key=lambda x: x["name"].lower()):
        name = item["name"]
        slug = item["slug"]
        count = len(item["papers"])
        lines.append(f"- [{name} ({count})]({slug}.md)")
    lines.append("")
    return "\n".join(lines)


def theme_page(item: dict) -> str:
    name = item["name"]
    papers = sorted(item["papers"], key=lambda p: (p.get("order", 10_000), p.get("title", "")))

    lines: list[str] = [
        f"# Theme: {name}",
        "",
        "[All themes](index.md) · [Home](../index.md)",
        "",
    ]

    for paper in papers:
        title = paper["title"]
        slug = paper["slug"]
        summary = paper["summary"]
        pdf = paper["pdf"]
        themes = paper.get("themes", [])
        lines.extend(
            [
                f"- **[{title}](../papers/{slug}.md)**",
                f"  Date: {paper_date_label(paper)}",
                f"  {summary}",
                f"  {chips(themes, prefix='../')}",
                f"  [Open Page](../papers/{slug}.md) · [Open PDF](../pdf/{pdf}) · <a href=\"../pdf/{pdf}\" download>Download</a>",
                "",
            ]
        )

    return "\n".join(lines)


def home_page(site: dict, papers: list[dict]) -> str:
    title = site.get("title", "Journal of Bjorn")
    tagline = site.get("tagline", "")
    intro = site.get("intro", "")
    welcome = site.get("welcome", {})

    lines: list[str] = [
        f"# {title}",
        "",
        f"> {tagline}",
        "",
        intro,
        "",
    ]

    if welcome:
        lines.extend(
            [
                "<section class=\"journal-intro\" markdown>",
                "",
            ]
        )

        welcome_title = welcome.get("title")
        welcome_subtitle = welcome.get("subtitle")
        disclaimer = welcome.get("disclaimer")
        process_intro = welcome.get("process_intro")
        process_steps = welcome.get("process_steps", [])
        quality_title = welcome.get("quality_title")
        quality_text = welcome.get("quality_text")
        closing = welcome.get("closing")
        note_oe_title = welcome.get("note_oe_title")
        note_oe_text = welcome.get("note_oe_text")

        if welcome_title:
            lines.append(f"### {welcome_title}")
            lines.append("")
        if welcome_subtitle:
            lines.append(f"**{welcome_subtitle}**")
            lines.append("")
        if disclaimer:
            lines.append(disclaimer)
            lines.append("")
        if process_intro:
            lines.append(process_intro)
            lines.append("")
        if process_steps:
            for step in process_steps:
                lines.append(f"- {step}")
            lines.append("")
        if quality_title:
            lines.append(f"**{quality_title}**")
            lines.append("")
        if quality_text:
            lines.append(quality_text)
            lines.append("")
        if closing:
            lines.append(closing)
            lines.append("")
        if note_oe_title:
            lines.append(f"**{note_oe_title}**")
            lines.append("")
        if note_oe_text:
            lines.append(note_oe_text)
            lines.append("")

        lines.extend(
            [
                "</section>",
                "",
            ]
        )

    lines.extend(
        [
            "## Browse Papers",
            "",
            "[Alphabetical](papers/alphabetical.md) · [Chronological](papers/chronological.md) · [By month](papers/by-month/index.md) · [By year](papers/by-year/index.md)",
            "",
            "<div class=\"grid cards\" markdown>",
            "",
        ]
    )

    for paper in papers:
        slug = paper["slug"]
        title = paper["title"]
        summary = paper["summary"]
        pdf = paper["pdf"]
        themes = paper.get("themes", [])

        lines.extend(
            [
                f"-   [![{title} preview](assets/thumbs/{slug}.png)](papers/{slug}.md)",
                f"    **[{title}](papers/{slug}.md)**",
                "",
                f"    {summary}",
                "",
                f"    *Date: {paper_date_label(paper)}*",
                "",
                f"    {chips(themes)}",
                "",
                f"    [Open Page](papers/{slug}.md) · [Open PDF](pdf/{pdf}) · <a href=\"pdf/{pdf}\" download>Download</a>",
                "",
            ]
        )

    lines.extend(
        [
            "</div>",
            "",
            "## Browse by Theme",
            "",
            "[Open themes index](themes/index.md)",
            "",
        ]
    )
    return "\n".join(lines)


def main() -> None:
    data = json.loads(CATALOG.read_text(encoding="utf-8"))
    site = data.get("site", {})
    papers = published_papers(data)
    month_groups = paper_month_groups(papers)
    year_groups = paper_year_groups(papers)

    PAPERS_DIR.mkdir(parents=True, exist_ok=True)
    PAPERS_MONTHS_DIR.mkdir(parents=True, exist_ok=True)
    PAPERS_YEARS_DIR.mkdir(parents=True, exist_ok=True)
    THEMES_DIR.mkdir(parents=True, exist_ok=True)
    mapping = theme_map(papers)

    # Remove stale generated pages before re-rendering.
    for old in PAPERS_DIR.glob("*.md"):
        old.unlink()
    for old in PAPERS_MONTHS_DIR.glob("*.md"):
        old.unlink()
    for old in PAPERS_YEARS_DIR.glob("*.md"):
        old.unlink()
    for old in THEMES_DIR.glob("*.md"):
        old.unlink()

    # Generate landing page and index pages.
    (DOCS / "index.md").write_text(home_page(site, papers), encoding="utf-8")
    (PAPERS_DIR / "index.md").write_text(papers_index(papers), encoding="utf-8")
    (PAPERS_DIR / "alphabetical.md").write_text(
        papers_alphabetical_page(papers), encoding="utf-8"
    )
    (PAPERS_DIR / "chronological.md").write_text(
        papers_chronological_page(papers), encoding="utf-8"
    )
    (PAPERS_MONTHS_DIR / "index.md").write_text(
        papers_by_month_index(papers), encoding="utf-8"
    )
    (PAPERS_YEARS_DIR / "index.md").write_text(
        papers_by_year_index(papers), encoding="utf-8"
    )

    for month, items in month_groups:
        (PAPERS_MONTHS_DIR / f"{month}.md").write_text(
            papers_by_month_page(month, items), encoding="utf-8"
        )
    for year, items in year_groups:
        (PAPERS_YEARS_DIR / f"{year}.md").write_text(
            papers_by_year_page(year, items), encoding="utf-8"
        )

    (THEMES_DIR / "index.md").write_text(themes_index(mapping), encoding="utf-8")

    # Generate one page per paper.
    for paper in papers:
        slug = paper["slug"]
        (PAPERS_DIR / f"{slug}.md").write_text(paper_page(paper), encoding="utf-8")

    # Generate one page per theme.
    for item in mapping.values():
        slug = item["slug"]
        (THEMES_DIR / f"{slug}.md").write_text(theme_page(item), encoding="utf-8")


if __name__ == "__main__":
    main()
