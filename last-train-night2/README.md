# LAST TRAIN – Night 2

Fully procedural claymation-style 3D horror short (vertical 2160×3840 / 30 fps, ~87 s), rendered with
Three.js r160 in headless Chromium (SwiftShader), voices with Kokoro TTS, sound designed in numpy.

## Pipeline
1. `audio/gen_voice.py` / `audio/process_voice.py MODELS WORK audio/out` – Kokoro voices (narrator: am_onyx + 25 % am_michael;
   sister: af_nicole whispered, +2.5 st, long echo; speaker: radio filter + gong), timeline and faster-whisper word timestamps → `audio/out/timing.json`.
2. `web/` – the film: `js/world.js` (car, tunnel, stations, trains), `js/figure.js` (clay rigs, 3D leg IK, instancing),
   `js/main.js` (scene state + 47 shots cut on word times, `renderFrame(t)`), `js/hud.js` (clock, counter, captions, cards),
   `js/post.js` (bloom, half-res DOF/tilt-shift, motion blur, CA, grain, vignette).
3. `render/plan.js QUEUE` → jobs; `render/render.js QUEUE CLIPS` workers (env: `RW RH DPR STEP PORT`), one MP4 per job.
   4K: `STEP=1 DPR=2 RW=2160 RH=3840 node render.js q4k clips4k`.
4. `render/export_audio.js` → speed/light curves; `audio/sound.py events.json curves.json audio/out mix.wav`; two-pass loudnorm to −14 LUFS.
5. `render/finish.sh` – concat (`-c copy`), mux, 4K master + 1080×1920 + ~60 MB phone version.

Tools for checking: `render/snap.js` (test frames, `FRAC=0.1,0.5,0.9` = 3 frames per shot), `render/sheet.py` (contact sheets), `render/bench.js`, `render/prof.js`.

## Deliverables (`out/`)
| File | Format | Size |
|---|---|---|
| `last_train_night2_4k_2160x3840.mp4` | native 4K master, 2160×3840, 30 fps, H.264 CRF 16 + AAC 256k | ~1.9 GB (not in git) |
| `last_train_night2_4k_upload.mp4` | 4K upload version, ~39 Mbit/s | ~430 MB (not in git) |
| `last_train_night2_1080x1920.mp4` | 1080×1920, downscaled from the 4K master | ~420 MB (not in git) |
| `last_train_night2_phone.mp4` | 1080×1920, two-pass ~5.6 Mbit/s | ~63 MB |

All versions: 87.13 s, 2614 frames, audio mastered to −14 LUFS / −1.5 dBTP.
Every frame is rendered natively (no frame stepping); the 3D layer is rendered at 2160×3840.
