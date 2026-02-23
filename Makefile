SHELL := /bin/bash

VENV := .venv
PY := $(VENV)/bin/python
PIP := $(VENV)/bin/pip
MKDOCS := $(VENV)/bin/mkdocs

.PHONY: help venv install enrich-dates render sync-pdfs thumbs prepare serve build ci clean

help:
	@echo "Journal of Bjorn site commands"
	@echo ""
	@echo "  make install     - Create venv and install MkDocs dependencies"
	@echo "  make enrich-dates - Fill catalog dates from TeX version/date fields (git fallback)"
	@echo "  make render      - Generate docs pages from catalog.json"
	@echo "  make sync-pdfs   - Copy PDFs into docs/pdf for site build"
	@echo "  make thumbs      - Generate PDF first-page thumbnails"
	@echo "  make prepare     - render + sync-pdfs + thumbs"
	@echo "  make serve       - Run local dev server (http://127.0.0.1:8000)"
	@echo "  make build       - Build static site into ./site"
	@echo "  make ci          - CI build (no virtualenv usage)"
	@echo "  make clean       - Remove generated and build artifacts"

venv:
	@test -d $(VENV) || python3 -m venv $(VENV)

install: venv
	$(PIP) install --upgrade pip
	$(PIP) install -r requirements.txt

enrich-dates:
	REPORTS_DIR=$${REPORTS_DIR:-/Volumes/SynologyScsi1/git/meta-job/reports} \
	python3 scripts/enrich_catalog_dates.py

render:
	python3 scripts/render_catalog.py

sync-pdfs:
	bash scripts/sync_pdfs.sh

thumbs:
	bash scripts/generate_thumbs.sh

prepare: render sync-pdfs thumbs

serve: install prepare
	$(MKDOCS) serve

build: install prepare
	$(MKDOCS) build --clean

ci:
	python3 scripts/render_catalog.py
	bash scripts/sync_pdfs.sh
	bash scripts/generate_thumbs.sh
	mkdocs build --clean

clean:
	rm -rf site docs/pdf docs/assets/thumbs docs/papers docs/themes
