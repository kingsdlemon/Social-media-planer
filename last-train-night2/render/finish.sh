#!/bin/bash
# concat shot clips, mux mastered audio, export 1080x1920 master, 2160x3840 upscale, ~60MB phone version
set -e
cd "$(dirname "$0")/.."
ls render/clips/shot_*.mp4 | grep -v tmp | sort | sed "s#^#file '$PWD/#; s#\$#'#" > render/concat.txt
ffmpeg -y -loglevel error -f concat -safe 0 -i render/concat.txt -c copy out/video_only.mp4
ffmpeg -y -loglevel error -i out/video_only.mp4 -i audio/out/master.wav -map 0:v -map 1:a -c:v copy -c:a aac -b:a 192k -shortest -movflags +faststart out/last_train_night2_1080x1920.mp4
ffmpeg -y -loglevel error -i out/last_train_night2_1080x1920.mp4 -vf "scale=2160:3840:flags=lanczos" -c:v libx264 -preset veryfast -crf 18 -pix_fmt yuv420p -c:a copy -movflags +faststart out/last_train_night2_2160x3840_upscaled.mp4 &
ffmpeg -y -loglevel error -i out/last_train_night2_1080x1920.mp4 -c:v libx264 -preset veryfast -b:v 5200k -maxrate 6500k -bufsize 10M -pix_fmt yuv420p -c:a aac -b:a 160k -movflags +faststart out/last_train_night2_phone.mp4 &
wait
ls -la out
