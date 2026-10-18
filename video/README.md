# Trace promo — "Your day, retraced."

A 52-second promo film for Trace: Location Timeline (iPhone, iOS 18+), built with
[Remotion](https://www.remotion.dev). One timeline, two layouts:

| Composition          | Size      | Rate   | Length              |
| -------------------- | --------- | ------ | ------------------- |
| `TracePromo`         | 1920x1080 | 60 fps | 3120 frames (52.0 s) |
| `TracePromoVertical` | 1080x1920 | 60 fps | 3120 frames (52.0 s) |

This folder is a standalone pnpm package (`trace-promo`, with its own
`pnpm-workspace.yaml` and lockfile), so the site's installs and Vercel deploys
never pull in Remotion. It is not part of the Next.js build: the root
`tsconfig.json` excludes it, and renders in `out/` are git-ignored. Footage,
voice-over, music and delivered videos (`*.mp4`, `*.wav`) are stored with Git
LFS; run `git lfs pull` after cloning. The
16:9 master, 9:16 cut and poster are delivered to the site as
`public/videos/trace-promo.mp4`, `public/videos/trace-promo-9x16.mp4` and
`public/videos/trace-promo-poster.png`.

How the first cut was made, what changed from the brief, and what is still
open: see [`PRODUCTION.md`](PRODUCTION.md).

## Studio

From `video/`:

```console
pnpm install
pnpm exec remotion studio
```

## Render

From `video/`:

```console
pnpm exec remotion render TracePromo out/trace-promo-16x9.mp4 --codec=h264 --crf=16 --pixel-format=yuv420p --audio-codec=aac --audio-bitrate=320k
pnpm exec remotion render TracePromoVertical out/trace-promo-9x16.mp4 --codec=h264 --crf=16 --pixel-format=yuv420p --audio-codec=aac --audio-bitrate=320k
pnpm exec remotion still TracePromo out/poster.png --frame=3000
```

Then master the audio of each render (video stream copied; +1 dB into a
-1.8 dBFS limiter, 4x oversampled), which lands the mix at -14 LUFS integrated,
-1.8 dBTP:

```console
for r in 16x9 9x16; do
  ffmpeg -i out/trace-promo-$r.mp4 -c:v copy -af "volume=1.0dB,aresample=192000,alimiter=limit=0.8128:attack=2:release=40:level=0,aresample=48000" -c:a aac -b:a 320k out/trace-promo-$r.mastered.mp4
  mv out/trace-promo-$r.mastered.mp4 out/trace-promo-$r.mp4
done
```

Then deliver the renders and poster to the site:

```console
cp out/trace-promo-16x9.mp4 ../public/videos/trace-promo.mp4
cp out/trace-promo-9x16.mp4 ../public/videos/trace-promo-9x16.mp4
cp out/poster.png ../public/videos/trace-promo-poster.png
```

Lint and type-check: `pnpm lint` here (ESLint + tsc, Remotion rules). The repo
root's `pnpm lint` (Biome) also checks this folder.

## Structure

- `src/timing.ts` — scene and VO cue frames (bar = 150 frames at 96 BPM).
- `src/scenes/` — S1 hook to S8 end card.
- `src/theme.ts` — palette and type, taken from usetrace.app.
- `src/assets.ts` — asset manifest (missing assets render a placeholder).
- `public/` — screen recordings, VO, score and brand files.
- `tools/` — scripts that made the audio.

## Asset provenance

- **Screen recordings** (`public/sim/`): the real Trace app on the iPhone 18 Pro
  simulator, with the built-in Singapore sample day (Mon 5 Oct 2026). All
  places and routes are mock data. No real location data is in this film.
  The stills are frames of the recordings: `today.png` (today.mp4 @ 0.30 s),
  `today-dark.png` (today-dark.mp4 @ 1.0 s), and `places.png` (places.mp4 @
  8.5 s, with the tab bar taken from @ 6.33 s, where nothing shows through it).
- **Voice-over** (`public/vo/`): made locally with
  [Kokoro-82M](https://huggingface.co/hexgrad/Kokoro-82M) (`kokoro` 0.9.4),
  voice `af_heart`. `tools/vo/render.py` speaks the lines. `tools/vo/post.py`
  trims, compresses and normalises them into `public/vo/` at -16 LUFS. Run both
  from `tools/vo/`. `tools/vo/kfix.py` points espeak-ng at a short data path:
  set `ESPEAK_DATA_PARENT` (default `/tmp/espkp`, see the file for setup).
- **Music** (`public/music/`): an original score, synthesised from scratch
  (96 BPM, D major, no samples) by `tools/music/score.py`, which writes
  `public/music/score.wav` (`cd tools/music && uv run score.py`). That file is
git-ignored, as it can be rebuilt; run `score.py` before `duck.py`.
  `uv run duck.py` (also in `tools/music/`) reads the VO cues from
  `src/timing.ts` and writes `public/music/score_ducked.wav`, the bed the film
  uses (-4.5 dB under each line, -6.5 dB under VO6 and VO8).
- **Brand** (`public/brand/`): the Trace app icon and logo.
