# Production log — first cut (v1), 18 October 2026

How the first cut of the Trace promo was made: what was decided, what went
wrong, and what to do differently next time. `README.md` covers how to open,
render and deliver the film; this file covers why it looks and sounds the way
it does.

Deliverables (in the site repo):

- `public/videos/trace-promo.mp4`: 16:9 master, 1920x1080, 60 fps, 52.0 s
- `public/videos/trace-promo-9x16.mp4`: 9:16 social cut, 1080x1920, same timeline
- `public/videos/trace-promo-poster.png`: end-card still (frame 3000)
- `video/out/`: working renders, a 720p preview and a contact sheet (git-ignored)

Both films: H.264 High, yuv420p, AAC 48 kHz stereo, -14.0 LUFS integrated,
-1.8 dBTP.

## Brief

"Your day, retraced." A calm, editorial 52-second film in the site's look:
ivory canvas, ink type, the sun accent, activity colours for routes, and the
night palette for privacy. The film must not promise more than Trace 1.0 does:

- "Coming soon on the App Store" as plain text. No Apple badge, no App Store
  link (there is no listing yet).
- No iPhone Duo, iPad, paywall, pricing or analytics claims.
- Mock data only: the app's built-in Singapore sample day (Mon 5 Oct 2026).

## Structure

The edit sits on a 96 BPM grid: 1 bar = 2.5 s = 150 frames. Every cut lands on
a bar line. The table in `src/timing.ts` is the source of truth.

| Scene | Frames | Bars | Screen | Voice-over |
| --- | --- | --- | --- | --- |
| S1 Hook | 0–300 | 1–2 | Route draws over a stylised Singapore | Every day takes you somewhere. |
| S2 Reveal | 300–600 | 3–4 | Icon + wordmark, phone rises with Today | Trace records the places you go, and the routes you take. |
| S3 Today | 600–1050 | 5–7 | Ribbon tap focuses the train; timeline; stat chips | The train to work. An evening across town. The drive home. |
| S4 Journey | 1050–1350 | 8–9 | Journey replay (Downtown Line) | Play back any journey, moment by moment. |
| S5 History | 1350–1650 | 10–11 | Week → Month → Year | Look back on a week, a month, or a year. |
| S6 Places | 1650–1950 | 12–13 | Places list → Botanic Gardens detail | And see the places that matter most. |
| S7 Privacy | 1950–2400 | 14–16 | Night wave, Today in dark | Your journal stays on your iPhone. Encrypted. No account. No streaks. |
| S8 End card | 2400–3120 | 17–20 + tail | Dawn, route folds into the icon, tagline | Trace. Your day, retraced. |

On-screen headlines reuse the site's own lines ("Days worth remembering.",
"The places in your life.", "Your day, retraced.").

## How it was made

Claude Code ran two multi-agent workflows. Producer roles ran in parallel; then
an editor assembled the cut, three independent reviewers checked it, and a
finishing editor fixed what they found.

1. **Produce** (parallel): screen capture, voice-over, score and the Remotion
   scene build.
2. **Assemble**: footage into the device frame, VO on its cues, ducked score,
   both renders.
3. **Review** (two rounds): visual/motion, audio, and claims/copy reviewers,
   each told to refuse anything they could not verify. Round 1 sent back 15
   issues; round 2 passed with minors only.
4. **Relocate and polish**: the project moved from a separate folder into
   `video/`, the remaining visible minors were fixed, and two more verifier
   rounds (frames + repo health + Whisper transcript) checked the result.

### Screen capture

- App: Trace `main`, Debug build, on the iPhone 18 Pro simulator
  (`BA196662-63D7-4B7C-B5FE-B0EC7A336C04`).
- Launch flags from the App Store screenshot test (`TraceIntentTests/TraceScreenshots`):
  `--screenshots -onboarding.completed.v1 YES -appearance light|dark`. These
  open the sample day and hide the "Sample day" banner.
- Status bar: `xcrun simctl status_bar <udid> override --time 9:41 --batteryState charged --batteryLevel 100 --cellularBars 4 --wifiBars 3`.
- Recording: `xcrun simctl io <udid> recordVideo --codec h264`. The simulator
  records at a variable frame rate, so each clip was converted to constant
  60 fps before the in/out points were measured.
- Gestures: a temporary XCUITest with slow drags (70–170 pt/s, no fling) and
  holds of 1.5 s or more around each gesture. The Xcode MCP device session was
  held by another session at the time. The test was deleted afterwards, so it
  must be written again for the next cut.
- Clips in `public/sim/`: `today`, `today-focus`, `journey`, `history`,
  `places`, `today-dark` (all 1206x2622). Stills are frames of those clips.

### Voice-over

- Kokoro-82M (`kokoro` 0.9.4), run locally, voice `af_heart`. Auditioned
  against `af_bella`, `bf_emma` and `am_michael` on lines 2 and 8; chosen on
  warmth and low sibilance (measured, see Open items).
- Speed 0.88–0.95. Lines 3, 7 and 8 are rendered one sentence at a time and
  joined with 0.3–0.45 s pauses.
- "Trace." alone at 0.88 was heard as "A trace" by Whisper, so it renders at
  0.95.
- Post: trim, 80 Hz high-pass, light compression, -16 LUFS per line.
- Every line was checked against the script with local Whisper (`whisper-small.en`).
- Scripts: `tools/vo/render.py`, `tools/vo/post.py`, `tools/vo/kfix.py` (an
  espeak-ng data-path workaround; see README).

### Score

- Original, synthesised in Python (`tools/music/score.py`), no samples. D major,
  96 BPM, 20 bars plus a 2 s ring-out.
- Felt piano motif, detuned pad with a filter sweep, round bass, soft kick, hats,
  bells, noise swells that end on scene cuts, and synthesised reverbs.
- Sections follow the scenes: intro (bars 1–2), bass and kick enter (3–4),
  groove (5–13), breakdown for the privacy scene (14–16), lift (17–19), final
  chord (20).
- `tools/music/duck.py` reads the VO cues from `src/timing.ts` and bakes the
  ducked bed: -4.5 dB under each line, -6.5 dB under VO6 and VO8.
- The ACE-Step model in the local Hugging Face cache was only a stub (no
  weights), so no AI music model was used.

## What changed from the brief

- **Sample day.** The brief took its places from the site's
  `src/lib/sample-day.ts` (lunch walk, Marina Bay Sands, Jewel). The app's
  sample day is different: walk, train to Downtown, walk to the Office, drive to
  Dempsey Hill for dinner, drive home. VO3 became "An evening across town", and
  VO4 became "moment by moment".
- **You tab.** Year in Motion is Debug-only and not in 1.0, so it was dropped.
  The You clip was recorded but not used.
- **S6 → S7.** The phone screen turns over under the night wave instead of
  dissolving (the dissolve showed two screens at once).
- **iOS chrome.** Clean status-bar and tab-bar stills are laid over the
  footage, so scrolled content never runs under "09:41" or shows through the
  tab bar.

## Known issues in this cut

Reviewers passed these as minor:

- The dawn transition into S8 (f2412–2424) still shows a narrow warm band at
  its edge for about 6–8 frames.
- The S8 route's start point shows as a small dot for a few frames at f2432
  before the stroke draws.
- The phone slides about 130 px during the S6 → S7 night wave.
- The status bar reads 09:41 while the Today screen says "Settled in since
  8:42 PM" (Apple's 9:41 convention).
- "Stays on your iPhone" leaves out the optional iCloud sync, which is off by
  default. This matches the site copy.

## Open items for the next cut

- **Listen.** No person has listened to the voice-over or the score. The voice
  and the mix were chosen and checked by measurement only (loudness,
  spectrum, onsets, Whisper). A listening pass on real speakers and phone
  speakers comes first.
- **Site sample day.** The site's sample day does not match the app's. Either
  the site or the film should change so both tell the same day.
- **Repo weight.** About 58 MB of media (footage, VO, score, renders) would go
  into plain git. Decide on Git LFS or keeping media out of the repo before the
  first commit.
- **Workspace.** `pnpm-workspace.yaml` lists `video`, so every root install,
  Vercel's included, also installs Remotion. A standalone package would avoid
  this.
- **App Store.** When `APP_STORE_ID` is set, replace "Coming soon on the App
  Store" with the official badge and link, and re-render.
- **Capture script.** Keep the XCUITest capture script in the app repo (or in
  `tools/`), so the footage can be shot again without writing it from scratch.

## Lessons

- Read the app's sample data before you write the script. The site and the app
  disagree, and the app is the source of truth.
- Lock the music grid first. A fixed BPM made it possible to compose, record
  and edit in parallel and still have every cut land on a beat.
- Share the simulator. Other sessions use `BA196662` too. Check with them
  before you take it, and say when it is free.
- Keep every output in this repo: renders in `video/out/`, deliverables in
  `public/videos/`. Nothing goes in `~/Movies`.
