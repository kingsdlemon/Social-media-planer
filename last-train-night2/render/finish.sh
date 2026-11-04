#!/bin/bash
# Assemble final deliverables from per-job 4K clips:
#  out/last_train_night2_4k_2160x3840.mp4  (native 4K master)
#  out/last_train_night2_1080x1920.mp4     (downscaled from 4K)
#  out/last_train_night2_phone.mp4         (~60 MB)
set -e
cd "$(dirname "$0")/.."
CLIPS=${1:-render/clips4k}
ls $CLIPS/shot_*.mp4 | grep -v tmp | sort | sed "s#^#file '$PWD/#; s#\$#'#" > render/concat.txt
ffmpeg -y -loglevel error -f concat -safe 0 -i render/concat.txt -c copy out/video_only.mp4
ffmpeg -y -loglevel error -i out/video_only.mp4 -i audio/out/master.wav -map 0:v -map 1:a -c:v copy -c:a aac -b:a 256k -shortest -movflags +faststart out/last_train_night2_4k_2160x3840.mp4
ffmpeg -y -loglevel error -i out/last_train_night2_4k_2160x3840.mp4 -vf "scale=1080:1920:flags=lanczos" -c:v libx264 -preset slow -crf 16 -pix_fmt yuv420p -c:a copy -movflags +faststart out/last_train_night2_1080x1920.mp4
# phone version: two-pass ABR targeting ~60 MB
DUR=$(ffprobe -v error -show_entries format=duration -of csv=p=0 out/last_train_night2_4k_2160x3840.mp4)
VB=$(python3 -c "print(int((60*8*1024*1024/$DUR - 160000)/1000))")
ffmpeg -y -loglevel error -i out/last_train_night2_4k_2160x3840.mp4 -vf "scale=1080:1920:flags=lanczos" -c:v libx264 -preset slow -b:v ${VB}k -pass 1 -an -f mp4 -passlogfile out/p2 /dev/null
ffmpeg -y -loglevel error -i out/last_train_night2_4k_2160x3840.mp4 -vf "scale=1080:1920:flags=lanczos" -c:v libx264 -preset slow -b:v ${VB}k -pass 2 -passlogfile out/p2 -pix_fmt yuv420p -c:a aac -b:a 160k -movflags +faststart out/last_train_night2_phone.mp4
rm -f out/video_only.mp4 out/p2*
ls -la out
