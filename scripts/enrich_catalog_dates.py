#!/usr/bin/env python3
"""Backfill paper dates in catalog.json using TeX metadata and git fallback."""

from __future__ import annotations

import json
import os
import re
import subprocess
from dataclasses import dataclass
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
CATALOG = ROOT / "catalog.json"


@dataclass(frozen=True)
class DateHit:
    value: str
    source: str
    evidence: str


MONTHS = {
    "january": 1,
    "february": 2,
    "march": 3,
    "april": 4,
    "may": 5,
    "june": 6,
    "july": 7,
    "august": 8,
    "september": 9,
    "october": 10,
    "november": 11,
    "december": 12,
}

DATE_CMD_RE = re.compile(r"\\date\{([^}]*)\}", re.IGNORECASE)
ISO_RE = re.compile(r"(?<!\d)(\d{4})-(\d{2})-(\d{2})(?!\d)")
MONTH_DAY_YEAR_RE = re.compile(
    r"\b(January|February|March|April|May|June|July|August|September|October|November|December)\s+(\d{1,2}),\s*(\d{4})\b",
    re.IGNORECASE,
)
DAY_MONTH_YEAR_RE = re.compile(
    r"\b(\d{1,2})\s+(January|February|March|April|May|June|July|August|September|October|November|December)\s+(\d{4})\b",
    re.IGNORECASE,
)
MONTH_YEAR_RE = re.compile(
    r"\b(January|February|March|April|May|June|July|August|September|October|November|December)\s+(\d{4})\b",
    re.IGNORECASE,
)
VERSION_DATE_RE = re.compile(r"(?<!\d)(\d{4})-(\d{2})-(\d{2})-(\d{2}):(\d{2}):(\d{2})")


def find_reports_root() -> Path:
    candidates = [
        os.environ.get("REPORTS_DIR", ""),
        "/Volumes/SynologyScsi1/git/meta-job/reports",
        str((ROOT / ".." / "meta-job" / "reports").resolve()),
    ]
    for c in candidates:
        if not c:
            continue
        p = Path(c)
        if p.is_dir():
            return p
    raise SystemExit(
        "Could not find reports repository. Set REPORTS_DIR to the reports path."
    )


def canonical_day(year: int, month: int, day: int) -> str:
    return f"{year:04d}-{month:02d}-{day:02d}"


def canonical_month(year: int, month: int) -> str:
    return f"{year:04d}-{month:02d}"


def parse_human_date(text: str) -> str | None:
    m = ISO_RE.search(text)
    if m:
        return canonical_day(int(m.group(1)), int(m.group(2)), int(m.group(3)))

    m = MONTH_DAY_YEAR_RE.search(text)
    if m:
        month = MONTHS[m.group(1).lower()]
        return canonical_day(int(m.group(3)), month, int(m.group(2)))

    m = DAY_MONTH_YEAR_RE.search(text)
    if m:
        month = MONTHS[m.group(2).lower()]
        return canonical_day(int(m.group(3)), month, int(m.group(1)))

    m = MONTH_YEAR_RE.search(text)
    if m:
        month = MONTHS[m.group(1).lower()]
        return canonical_month(int(m.group(2)), month)

    return None


def all_tex_files(report_dir: Path) -> list[Path]:
    return sorted(
        p
        for p in report_dir.rglob("*.tex")
        if p.is_file()
        and p.name not in {"references-from-books-partial-list.tex"}
        and "targeted-reports" not in p.parts
    )


def score_main_tex(p: Path, paper: dict) -> int:
    slug = paper["slug"].lower()
    pdf_stem = Path(paper["pdf"]).stem.lower()
    report_dir_name = paper["report_dir"].lower()
    stem = p.stem.lower()

    names = [
        slug,
        slug.replace("-", "_"),
        pdf_stem,
        pdf_stem.replace("-", "_"),
        report_dir_name,
        report_dir_name.replace("-", "_"),
    ]
    for i, n in enumerate(names):
        if stem == n:
            return 100 - i
    return 0


def pick_main_tex(report_dir: Path, paper: dict) -> Path | None:
    tex_files = all_tex_files(report_dir)
    if not tex_files:
        return None

    scored = sorted(((score_main_tex(p, paper), p) for p in tex_files), reverse=True)
    if scored[0][0] > 0:
        return scored[0][1]

    # Fall back to report-level TeX file if no direct match is found.
    root_tex = report_dir / f"{paper['report_dir']}.tex"
    if root_tex.exists():
        return root_tex
    return tex_files[0]


def parse_explicit_date_from_tex(tex_path: Path) -> DateHit | None:
    try:
        content = tex_path.read_text(encoding="utf-8", errors="ignore")
    except OSError:
        return None

    for m in DATE_CMD_RE.finditer(content):
        raw = m.group(1).strip()
        raw = re.sub(r"\\textbf\{([^}]*)\}", r"\1", raw)
        if not raw or r"\today" in raw.lower():
            continue
        parsed = parse_human_date(raw)
        if parsed:
            return DateHit(
                value=parsed,
                source="latex_date_command",
                evidence=f"{tex_path.name}: \\date{{{raw}}}",
            )
    return None


def parse_version_date(version_path: Path) -> DateHit | None:
    try:
        text = version_path.read_text(encoding="utf-8", errors="ignore")
    except OSError:
        return None

    m = VERSION_DATE_RE.search(text)
    if m:
        d = canonical_day(int(m.group(1)), int(m.group(2)), int(m.group(3)))
        return DateHit(
            value=d,
            source="latex_version_file",
            evidence=f"{version_path.name}: {m.group(0)}",
        )

    # Secondary fallback: some version strings only include YYYY-MM-DD.
    m = ISO_RE.search(text)
    if m:
        d = canonical_day(int(m.group(1)), int(m.group(2)), int(m.group(3)))
        return DateHit(
            value=d,
            source="latex_version_file",
            evidence=f"{version_path.name}: {m.group(0)}",
        )
    return None


def version_candidates(report_dir: Path, main_tex: Path | None) -> list[Path]:
    candidates: list[Path] = []
    if main_tex is not None:
        local = main_tex.with_name("version.tex")
        if local.exists():
            candidates.append(local)
    root = report_dir / "version.tex"
    if root.exists() and root not in candidates:
        candidates.append(root)
    for p in sorted(report_dir.rglob("version.tex")):
        if p not in candidates:
            candidates.append(p)
    return candidates


def git_first_commit_date(repo_root: Path, report_subdir: str) -> DateHit | None:
    try:
        cp = subprocess.run(
            [
                "git",
                "-C",
                str(repo_root),
                "log",
                "--reverse",
                "--format=%aI",
                "--",
                report_subdir,
            ],
            check=True,
            capture_output=True,
            text=True,
        )
    except subprocess.CalledProcessError:
        return None

    lines = [ln.strip() for ln in cp.stdout.splitlines() if ln.strip()]
    if not lines:
        return None
    day = lines[0][:10]
    return DateHit(
        value=day,
        source="git_first_commit",
        evidence=f"git log --reverse -- {report_subdir}",
    )


def infer_date_for_paper(reports_root: Path, paper: dict) -> DateHit | None:
    report_dir = reports_root / paper["report_dir"]
    if not report_dir.exists():
        return None

    main_tex = pick_main_tex(report_dir, paper)
    if main_tex is not None:
        hit = parse_explicit_date_from_tex(main_tex)
        if hit:
            return hit

    for v in version_candidates(report_dir, main_tex):
        hit = parse_version_date(v)
        if hit:
            return hit

    return git_first_commit_date(reports_root, paper["report_dir"])


def main() -> None:
    reports_root = find_reports_root()
    data = json.loads(CATALOG.read_text(encoding="utf-8"))
    updated = 0
    missing: list[str] = []

    for paper in data.get("papers", []):
        hit = infer_date_for_paper(reports_root, paper)
        if not hit:
            missing.append(paper.get("slug", "<unknown>"))
            continue

        paper["date"] = hit.value
        paper["date_source"] = hit.source
        paper["date_evidence"] = hit.evidence
        updated += 1

    CATALOG.write_text(json.dumps(data, indent=2, ensure_ascii=False) + "\n", encoding="utf-8")

    print(f"Reports root: {reports_root}")
    print(f"Updated papers with dates: {updated}")
    if missing:
        print("Missing dates for:")
        for slug in missing:
            print(f"  - {slug}")


if __name__ == "__main__":
    main()
