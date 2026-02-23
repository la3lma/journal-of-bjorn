#!/usr/bin/env bash
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
CATALOG="$ROOT/catalog.json"
OUT_DIR="$ROOT/docs/pdf"

rm -rf "$OUT_DIR"
mkdir -p "$OUT_DIR"

mapfile -t PDFS < <(python3 - <<'PY' "$CATALOG"
import json, sys
from pathlib import Path
p = Path(sys.argv[1])
data = json.loads(p.read_text(encoding='utf-8'))
published = [x for x in data.get('papers', []) if x.get('published', True)]
published.sort(key=lambda x: (x.get('order', 10000), x.get('title', '')))
for item in published:
    print(item['pdf'])
PY
)

if [[ ${#PDFS[@]} -eq 0 ]]; then
  echo "No published PDFs in catalog.json; docs/pdf left empty."
  exit 0
fi

for pdf in "${PDFS[@]}"; do
  src="$ROOT/pdf/$pdf"
  if [[ ! -f "$src" ]]; then
    echo "Missing PDF referenced in catalog.json: $src" >&2
    exit 1
  fi
  cp "$src" "$OUT_DIR/"
done

echo "Synced ${#PDFS[@]} published PDFs to $OUT_DIR"
