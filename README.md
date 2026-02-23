# Journal of Bjorn

This repository now contains both:
- the source PDFs in `pdf/`
- a static site scaffold (MkDocs Material) for browsing and reading them

## Quick start

```bash
cd /Users/rmz/git/journal-of-bjorn
make install
make serve
```

Open: `http://127.0.0.1:8000`

## Dependency policy (MkDocs warning)

`mkdocs-material` versions from `9.7.x` print an upstream warning about future
`MkDocs 2.0` compatibility and suggest migrating to a new generator.

For this project, we currently pin:

- `mkdocs==1.6.1`
- `mkdocs-material==9.6.23`

Reason: this combination is stable, warning-free, and keeps the workflow low
effort (`make prepare && make build`).

If we later want to move to a different generator (including Zensical), we can
do it as a separate migration without blocking publishing now.

## Typical publishing flow

```bash
# 1) Add/update PDFs in pdf/
# 2) Update metadata in catalog.json
# 3) Regenerate pages + thumbs + local PDF copies
make prepare

# 4) Preview
make serve

# 5) Commit + push
git add .
git commit -m "Add/update papers"
git push
```

On push to `main`, GitHub Actions builds and deploys the static site to GitHub Pages.

## Files you will usually touch

- `catalog.json` - Titles, summaries, themes, and which PDFs to feature
- `pdf/*.pdf` - Your published documents

Everything else can stay mostly automatic.

## Control which docs are published

Publishing is controlled by `catalog.json`.

Each paper entry supports:

- `pdf` (required): filename in `pdf/`
- `title` (required)
- `slug` (required): URL/page name
- `summary` (required)
- `themes` (optional): list of tags/chips
- `arxiv_url` (optional): link to the arXiv abstract page
- `date` (optional, recommended): `YYYY-MM-DD` or `YYYY-MM`
- `date_source` (optional): where the date came from (`latex_version_file`, `latex_date_command`, `git_first_commit`)
- `date_evidence` (optional): source snippet used for extraction
- `order` (optional): lower number appears earlier
- `published` (optional, default `true`)

### Publish / unpublish

- Set `"published": true` to include a paper in the site.
- Set `"published": false` to hide it from the site.

Important: hidden papers are not copied to `docs/pdf/` during `make prepare`,
so they are not publicly reachable on the generated site.

### Theme tags (clickable filters)

- Theme chips on cards and paper pages now link to generated theme pages:
  - `themes/<theme>.md`
- These pages list all published papers with that theme.
- Theme pages are built automatically from each paper's `themes` array.

### Minimal edit example

```json
{
  "slug": "my-paper",
  "title": "My Paper",
  "pdf": "my-paper.pdf",
  "summary": "One paragraph summary.",
  "themes": ["Theme A", "Theme B"],
  "order": 220,
  "published": true
}
```

After editing `catalog.json`, run:

```bash
make prepare
make serve
```

### Back-dating / chronology support

To auto-fill paper dates from report LaTeX files:

```bash
make enrich-dates
```

How it works:

- First priority: parse version strings like `version: 2025-11-20-10:19:36-CET-...` from `version.tex`.
- Second priority: parse explicit LaTeX date commands (e.g., `\date{September 14, 2025}`).
- Fallback: first git commit date for the corresponding report directory.

The site then renders:

- `Papers -> Alphabetical`
- `Papers -> Chronological` (grouped by month)
- `Papers -> By Month`
- `Papers -> By Year`

## Useful targets

```bash
make help
make enrich-dates
make build
make clean
```

## About the project

This repository contains what amounts to my journal entries: Things
I for some reason found interesting and decided to pursue a bit.
My process is typically:

- Find something interesting somewhere. Hacker news, mainstream news,
  SoMe, something mentioned in passing in conversation, whatever.
- Formulate, either by typing or dictating, a set of impressions and questions
  that intrigued me about the interesting thing. Then ask one of
  several AIs (Claude, Chatgpt, Kimi2, Perplexity, Gemini is a non-exhaustive
  list of the AIs I regularly use) to expand on this. Usually in a
  dialogue form. I ask something, the AI answers, I ask some more,
  etc.
- At some point I stop the dialogue, collect the results from it,
  put it in a latex document, ask one or more AIs to formulate it
  as prose that will make it readable.
- Ask the AIs to generate illustrations when that makes sense.
  The information for the illustrations is either available in the
  text itself or in the references.
- Ask the AIs to scrutinize use of references. References should be
  real, so I make an effort to check that they actually exist,
  and that whatever they are claimed to support/ground in the note
  is actually something the article says something about.

... so then I get a note, a few to a few tens of pages long, in a
style that is fit for me to remember why I found this thing
intriguing. If this helps others to do the same then I am happy. If
not, then I would of course like to hear about possible
improvements. I will take every suggestion very seriously and try to
implement every reasonable suggestion. But also: This may not be for
everyone, and I am fine with that too.
