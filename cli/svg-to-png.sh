#!/bin/bash
set -euo pipefail

# Convert SVG to PNG (transparent background, parallel) and pack into a zip

IN_DIR=./dist/fonts/icons
OUT_DIR=./dist/fonts/png
OUT_ARCHIVE=./dist/fonts/png.zip
PNG_HEIGHT=512
HEIGHT_MARKER="$OUT_DIR/.meta-height"

mkdir -p "$OUT_DIR"

if [ "$(cat "$HEIGHT_MARKER" 2>/dev/null)" != "$PNG_HEIGHT" ]; then
  rm -f "$OUT_DIR"/*.png
  echo "$PNG_HEIGHT" >"$HEIGHT_MARKER"
fi

if command -v rsvg-convert >/dev/null 2>&1; then
  CONVERTER=rsvg
elif command -v magick >/dev/null 2>&1; then
  CONVERTER=magick
elif command -v convert >/dev/null 2>&1; then
  CONVERTER=convert
else
  echo "Error: install librsvg (rsvg-convert) or ImageMagick" >&2
  exit 1
fi

CPUS=$(sysctl -n hw.ncpu 2>/dev/null || nproc)
JOBS="${SVG_CONVERT_JOBS:-$((CPUS * 2))}"
COUNT=$(find "$IN_DIR" -maxdepth 1 -name '*.svg' | wc -l | tr -d ' ')

format_duration() {
  local total=$1
  local mins=$((total / 60))
  local secs=$((total % 60))
  if [ "$mins" -gt 0 ]; then
    printf '%dm %ds' "$mins" "$secs"
  else
    printf '%ds' "$secs"
  fi
}

export OUT_DIR CONVERTER PNG_HEIGHT
echo "SVG → PNG ${PNG_HEIGHT}px height ($JOBS jobs, $CONVERTER)..."
TODO_LIST=$(mktemp)
trap 'rm -f "$TODO_LIST"' EXIT

find "$IN_DIR" -maxdepth 1 -name '*.svg' -print0 |
  while IFS= read -r -d '' svg; do
    png="$OUT_DIR/$(basename "$svg" .svg).png"
    if [ ! -f "$png" ] || [ "$svg" -nt "$png" ]; then
      printf '%s\0' "$svg" >>"$TODO_LIST"
    fi
  done

TODO_COUNT=0
if [ -s "$TODO_LIST" ]; then
  TODO_COUNT=$(tr -cd '\0' <"$TODO_LIST" | wc -c | tr -d ' ')
fi

SECONDS=0
if [ "$TODO_COUNT" -gt 0 ]; then
  echo "Converting $TODO_COUNT of $COUNT icons..."
  xargs -0 -n 1 -P "$JOBS" sh -c '
    out="$OUT_DIR/$(basename "$1" .svg).png"
    case "$CONVERTER" in
      rsvg) rsvg-convert -h "$PNG_HEIGHT" -o "$out" "$1" ;;
      magick) magick -background none "$1" -resize "x${PNG_HEIGHT}" "$out" ;;
      convert) convert -background none "$1" -resize "x${PNG_HEIGHT}" "$out" ;;
    esac
  ' sh <"$TODO_LIST"
else
  echo "All $COUNT icons are up to date."
fi
CONVERT_SECONDS=$SECONDS

echo "Archiving to $OUT_ARCHIVE..."
rm -f "$OUT_ARCHIVE"
SECONDS=0
# PNGs are already compressed; -0 = store only (fast). Flat layout like icons.zip.
(
  cd "$OUT_DIR"
  zip -0 -q -r "../$(basename "$OUT_ARCHIVE")" .
)
ARCHIVE_SECONDS=$SECONDS
TOTAL_SECONDS=$((CONVERT_SECONDS + ARCHIVE_SECONDS))

if [ "$TODO_COUNT" -eq 0 ]; then
  echo "Done: $OUT_ARCHIVE (up to date, $(format_duration "$TOTAL_SECONDS"))"
else
  echo "Done: converted $TODO_COUNT, $OUT_ARCHIVE ($(format_duration "$CONVERT_SECONDS") + $(format_duration "$ARCHIVE_SECONDS") = $(format_duration "$TOTAL_SECONDS"))"
fi
