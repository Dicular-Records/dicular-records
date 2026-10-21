#!/usr/bin/env bash
# Lädt Original-Dateien der Live-Seite (Uploads, Fonts) unter identischem Pfad nach public/.
# i0.wp.com-Proxy-URLs werden auf die Originaldatei zurückgeführt (ohne Resize-Parameter).
# Aufruf: bash scripts/fetch-original.sh <url> [<url> ...]   oder   ... < urls.txt
set -euo pipefail
OUT="public"
fetch() {
  local url; url="$(sed -E 's#^https://i[0-9]\.wp\.com/#https://#; s#[?].*$##; s#^https://www\.#https://#' <<<"$1")"
  local dest="$OUT/${url#https://dicular-records.com/}"
  [ -f "$dest" ] && return 0
  mkdir -p "$(dirname "$dest")"
  curl -sfL -A "Mozilla/5.0" -o "$dest" "$url" && echo "OK   $dest" || { echo "FEHLT $url" >&2; rm -f "$dest"; }
}
if [ $# -gt 0 ]; then for u in "$@"; do fetch "$u"; done; else while read -r u; do [ -n "$u" ] && fetch "$u"; done; fi
