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
