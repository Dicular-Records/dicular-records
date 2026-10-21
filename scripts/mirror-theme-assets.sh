#!/usr/bin/env bash
# Spiegelt die Original-Theme-Assets (CSS/JS/Fonts/Bilder) der Live-WordPress-Seite
# nach public/ — Pfadstruktur bleibt erhalten, damit relative url() in den CSS-Dateien funktionieren.
# Aufruf: bash scripts/mirror-theme-assets.sh   (aus dem Repo-Root)
set -euo pipefail

SITE="https://dicular-records.com"
OUT="public"
UA="Mozilla/5.0"
TMP="$(mktemp -d)"
trap 'rm -rf "$TMP"' EXIT

curl -sL -A "$UA" -o "$TMP/home.html" "$SITE/"

# Asset-URLs aus <link>/<script> der Startseite (ohne Tracking: stats.wp.com, google jsapi, maps)
grep -oE "(href|src)=['\"][^'\"]+\.(css|js)(\?[^'\"]*)?['\"]" "$TMP/home.html" \
  | sed -E "s/^(href|src)=['\"]//; s/['\"]$//; s/\?.*$//" \
  | grep -E "^https://(dicular-records\.com|c0\.wp\.com)/" \
  | sort -u > "$TMP/assets.txt"

# Ziel-Pfad: dicular-records.com/<pfad> -> <pfad>, c0.wp.com/c/<ver>/<pfad> -> <pfad>
local_path() { sed -E 's#^https://dicular-records\.com/##; s#^https://c0\.wp\.com/c/[^/]+/##' <<<"$1"; }

fetch() {
  local url="$1" dest="$OUT/$(local_path "$1")"
  [ -f "$dest" ] && return 0
  mkdir -p "$(dirname "$dest")"
  curl -sfL -A "$UA" -o "$dest" "$url" || { echo "FEHLT: $url" >&2; rm -f "$dest"; }
}

while read -r u; do fetch "$u"; done < "$TMP/assets.txt"

# url(...) aus den CSS-Dateien nachladen (Fonts, Hintergrundbilder)
find "$OUT" -name '*.css' | while read -r css; do
  base_url="$SITE/${css#"$OUT"/}"; base_url="${base_url%/*}"
  { grep -oE "url\(['\"]?[^)'\"]+['\"]?\)" "$css" || true; } | sed -E "s/^url\(['\"]?//; s/['\"]?\)$//; s/[?#].*$//" \
    | { grep -vE '^(data:|https?:|//)' || true; } | sort -u | while read -r rel; do
      fetch "$(python -c 'import sys,posixpath,urllib.parse as u;print(u.urljoin(sys.argv[1]+"/",sys.argv[2]))' "$base_url" "$rel" 2>/dev/null \
        || echo "$base_url/$rel")"
    done
done

echo "Fertig: $(find "$OUT" -type f | wc -l) Dateien in $OUT"
