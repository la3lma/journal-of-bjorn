#!/usr/bin/env bash
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
CATALOG="$ROOT/catalog.json"
OUT="$ROOT/docs/assets/thumbs"
TMP="$(mktemp -d)"

cleanup() {
  rm -rf "$TMP"
}
trap cleanup EXIT

rm -rf "$OUT"
mkdir -p "$OUT"

# Extract slug + pdf filename pairs from catalog.
mapfile -t ENTRIES < <(python3 - <<'PY' "$CATALOG"
import json, sys
from pathlib import Path
p = Path(sys.argv[1])
data = json.loads(p.read_text(encoding='utf-8'))
published = [x for x in data.get('papers', []) if x.get('published', True)]
published.sort(key=lambda x: (x.get('order', 10000), x.get('title', '')))
for item in published:
    print(f"{item['slug']}\t{item['pdf']}")
PY
)

if [[ ${#ENTRIES[@]} -eq 0 ]]; then
  echo "No papers in catalog.json"
  exit 0
fi

for entry in "${ENTRIES[@]}"; do
  slug="${entry%%$'\t'*}"
  pdf="${entry#*$'\t'}"

  src="$ROOT/pdf/$pdf"
  out="$OUT/$slug.png"

  if [[ ! -f "$src" ]]; then
    echo "Missing PDF for thumbnail: $src" >&2
    exit 1
  fi

  generated=0

  # Linux/CI path.
  if command -v pdftoppm >/dev/null 2>&1; then
    if pdftoppm -f 1 -singlefile -png "$src" "$TMP/$slug" >/dev/null 2>&1 && [[ -f "$TMP/$slug.png" ]]; then
      mv "$TMP/$slug.png" "$out"
      generated=1
    fi
  fi

  # macOS fallback path.
  if [[ "$generated" -eq 0 ]] && command -v qlmanage >/dev/null 2>&1; then
    rm -f "$TMP"/*.png
    qlmanage -t -s 1000 -o "$TMP" "$src" >/dev/null 2>&1 || true
    candidate="$TMP/$(basename "$src").png"
    if [[ -f "$candidate" ]]; then
      cp "$candidate" "$out"
      generated=1
    fi
  fi

  if [[ "$generated" -eq 0 ]]; then
    echo "Could not generate thumbnail for $src" >&2
    echo "Install poppler (pdftoppm) or use macOS qlmanage." >&2
    exit 1
  fi

  echo "Generated thumbnail: $out"
done
