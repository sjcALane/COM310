#!/bin/bash
# Render one animation into numbered clips for a demo.
# Usage: _anim/render.sh fork.py ForkScene 03-processes/fork
# Writes 03-processes/fork/clips/01.mp4 and 01.webm, 02.mp4 and 02.webm, ... one pair per section.
set -e
cd "$(dirname "$0")"
src="${1:?}"; scene="${2:?}"; dest="../${3:?}/clips"
manim -qm --disable_caching --save_sections -o "$scene" "$src" "$scene"
secdir="media/videos/${src%.py}/720p30/sections"
rm -rf "${dest:?}"; mkdir -p "$dest"
i=1
for f in $(ls "$secdir"/"$scene"_*.mp4 | sort); do
  printf -v n "%02d" $i
  ffmpeg -loglevel error -y -i "$f" -c:v libx264 -pix_fmt yuv420p -crf 26 -preset slow -movflags +faststart -an "$dest/$n.mp4"
  ffmpeg -loglevel error -y -i "$f" -c:v libvpx-vp9 -b:v 0 -crf 42 -row-mt 1 -an "$dest/$n.webm"
  i=$((i+1))
done
ls -la "$dest"
