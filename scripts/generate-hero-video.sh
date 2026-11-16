#!/usr/bin/env bash
set -euo pipefail
mkdir -p public/demo
if ! command -v ffmpeg >/dev/null 2>&1; then
  echo "ffmpeg is required to build the silent before/after hero video" >&2
  exit 1
fi
before=public/catalog/dress/demo-before.webp
after=public/catalog/dress/demo-after.webp
for file in "$before" "$after"; do
  test -s "$file" || { echo "Missing reference: $file" >&2; exit 1; }
done
# Generate a seamless silent loop from the product's real same-person before/after.
# Both fades use the original photos (no synthetic face, no AI animation).
ffmpeg -hide_banner -loglevel error -y \
  -loop 1 -framerate 24 -t 3.2 -i "$before" \
  -loop 1 -framerate 24 -t 3.2 -i "$after" \
  -loop 1 -framerate 24 -t 3.2 -i "$before" \
  -filter_complex "[0:v]fps=24,scale=480:720:force_original_aspect_ratio=decrease,pad=480:720:(ow-iw)/2:(oh-ih)/2,setsar=1,format=yuv420p[v0];[1:v]fps=24,scale=480:720:force_original_aspect_ratio=decrease,pad=480:720:(ow-iw)/2:(oh-ih)/2,setsar=1,format=yuv420p[v1];[2:v]fps=24,scale=480:720:force_original_aspect_ratio=decrease,pad=480:720:(ow-iw)/2:(oh-ih)/2,setsar=1,format=yuv420p[v2];[v0][v1]xfade=transition=fade:duration=0.6:offset=2.6[v01];[v01][v2]xfade=transition=fade:duration=0.6:offset=5.2,format=yuv420p[v]" \
  -map "[v]" -t 8.4 -an -r 24 -c:v libx264 -preset veryfast -crf 22 -pix_fmt yuv420p -movflags +faststart public/demo/hero-tryon.mp4
test -s public/demo/hero-tryon.mp4
echo "Built silent hero-tryon.mp4"
