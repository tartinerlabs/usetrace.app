// Every number here is in frames at 60 fps. The score is 96 BPM in 4/4,
// so one bar = 4 beats * 0.625 s = 2.5 s = 150 frames. Cuts land on bar lines.

export const FPS = 60;
export const BEAT = 37.5;
export const BAR = 150;
export const DURATION = 3120; // 52.0 s

export const bar = (n: number) => (n - 1) * BAR; // bar 1 starts at frame 0

export type SceneId = "S1" | "S2" | "S3" | "S4" | "S5" | "S6" | "S7" | "S8";

export const SCENES: Record<
  SceneId,
  { name: string; from: number; to: number; bars: string }
> = {
  S1: { name: "Hook", from: 0, to: 300, bars: "1-2" },
  S2: { name: "Reveal", from: 300, to: 600, bars: "3-4" },
  S3: { name: "Today", from: 600, to: 1050, bars: "5-7" },
  S4: { name: "Journey", from: 1050, to: 1350, bars: "8-9" },
  S5: { name: "History", from: 1350, to: 1650, bars: "10-11" },
  S6: { name: "Places", from: 1650, to: 1950, bars: "12-13" },
  S7: { name: "Privacy", from: 1950, to: 2400, bars: "14-16" },
  S8: { name: "End card", from: 2400, to: 3120, bars: "17-20 + tail" },
};

export const sceneLength = (id: SceneId) => SCENES[id].to - SCENES[id].from;

// Music sections, for reference and for anything that pulses with the score.
export const MUSIC = {
  intro: [0, 300], // bars 1-2: motif + pad
  build: [300, 600], // bars 3-4: bass + soft kick
  groove: [600, 1950], // bars 5-13: full groove
  breakdown: [1950, 2400], // bars 14-16: filter down, kick out
  lift: [2400, 2850], // bars 17-19: shimmer
  resolve: [2850, 3000], // bar 20: final chord
  tail: [3000, 3120], // rings out to silence
} as const;

// Frame the end card is fully settled and held static.
export const END_HOLD = 2850;

// Voice-over cues. `from` is the global frame the line starts (VO2-VO7 land
// 20 frames after their scene's downbeat, so each section arrival sounds
// before the music ducks; VO1 lands with the S1 headline, VO8 with the
// end-card logo). `maxFrames` is the measured length of each Kokoro line.
export const VO_CUES = [
  {
    id: "vo1",
    from: 36,
    maxFrames: 105,
    text: "Every day takes you somewhere.",
  },
  {
    id: "vo2",
    from: 320,
    maxFrames: 193,
    text: "Trace records the places you go, and the routes you take.",
  },
  {
    id: "vo3",
    from: 620,
    maxFrames: 268,
    text: "The train to work. An evening across town. The drive home.",
  },
  {
    id: "vo4",
    from: 1070,
    maxFrames: 144,
    text: "Play back any journey, moment by moment.",
  },
  {
    id: "vo5",
    from: 1370,
    maxFrames: 147,
    text: "Look back on a week, a month, or a year.",
  },
  {
    id: "vo6",
    from: 1670,
    maxFrames: 127,
    text: "And see the places that matter most.",
  },
  {
    id: "vo7",
    from: 1970,
    maxFrames: 340,
    text: "Your journal stays on your iPhone. Encrypted. No account. No streaks.",
  },
  { id: "vo8", from: 2440, maxFrames: 153, text: "Trace. Your day, retraced." },
] as const;

// What plays on the iPhone screen (the edit decision list). `from`/`to` are
// global frames of the clip's own sequence; `trim` is the source time in
// seconds at `from`; `rate` stays within 0.85-1.15. `fade` dissolves the clip
// in over the first 10 frames (it starts 10 frames before the previous clip
// ends); without it the clip hard-cuts on an identical frame (seamless).
export type ScreenClip = {
  clip:
    | "today"
    | "today-focus"
    | "journey"
    | "history"
    | "places"
    | "you"
    | "today-dark";
  kind: "mp4" | "png";
  from: number;
  to: number;
  trim?: number;
  rate?: number;
  fade?: boolean;
  push?: number; // slow screen push-in over the clip (0.03 = 1.00 -> 1.03)
  // Revealed by the night wave (S7) instead of a dissolve: the screen turns
  // over exactly where the wave's edge crosses the phone.
  wave?: boolean;
  // Static iOS chrome laid over the footage from a clean still of the same
  // screen: `top` re-draws the status bar on the screen background so scrolled
  // content never runs under 09:41; `tabs` re-draws the tab bar on a soft
  // fade so nothing shows through or below the glass.
  chrome?: { top?: ChromeStill; tabs?: ChromeStill };
};

export type ChromeStill = "today" | "today-dark" | "places";

export const SCREEN_TRACK: ScreenClip[] = [
  // S2: still = today.mp4 @ 0.30 s (identical to the next clip's first frame)
  {
    clip: "today",
    kind: "png",
    from: 300,
    to: 600,
    chrome: { tabs: "today" },
  },
  // S3a: tap the train on the ribbon, the map focuses on the Downtown Line
  {
    clip: "today-focus",
    kind: "mp4",
    from: 590,
    to: 700,
    trim: 0.9,
    rate: 1.15,
    fade: true,
    chrome: { tabs: "today" },
  },
  // S3b: ribbon, then scroll into the timeline rows (dinner, the drive home)
  {
    clip: "today",
    kind: "mp4",
    from: 690,
    to: 1050,
    trim: 6.8,
    rate: 1.1,
    fade: true,
    chrome: { top: "today", tabs: "today" },
  },
  // S4: hard cut on the push into Journey detail (source frame 144), Replay plays
  { clip: "journey", kind: "mp4", from: 1050, to: 1350, trim: 2.4, rate: 1.15 },
  // S5: Week -> Month -> Year; holds are cut out on identical frames
  {
    clip: "history",
    kind: "mp4",
    from: 1340,
    to: 1426,
    trim: 1.75,
    rate: 1.15,
    fade: true,
  },
  {
    clip: "history",
    kind: "mp4",
    from: 1426,
    to: 1512,
    trim: 4.55,
    rate: 1.15,
  },
  { clip: "history", kind: "mp4", from: 1512, to: 1650, trim: 7.3, rate: 1.15 },
  // S6: Places list, cut (source 2.58 s) before the large title scrolls up
  // into the status bar, then the Botanic Gardens detail at rest (places.png =
  // places.mp4 @ 8.5 s with a clean tab bar from @ 6.33 s). The detail stays
  // under the S7 night wave until the wave has passed the phone. A slow push
  // keeps the list alive through its hold before the dissolve.
  {
    clip: "places",
    kind: "mp4",
    from: 1640,
    to: 1772,
    trim: 0.2,
    rate: 1.1,
    fade: true,
    push: 0.04,
    chrome: { top: "today", tabs: "places" },
  },
  {
    clip: "places",
    kind: "png",
    from: 1762,
    to: 2010,
    fade: true,
    chrome: { tabs: "places" },
  },
  // S7: Today in dark appearance, held at rest (today-dark.png = today-dark.mp4
  // @ 1.0 s), revealed by the night wave, then a slow 1.00 -> 1.03 push. The
  // chrome stays fixed above the push, so nothing drifts under the status bar.
  {
    clip: "today-dark",
    kind: "png",
    from: 1950,
    to: 2440,
    wave: true,
    push: 0.03,
    chrome: { top: "today-dark", tabs: "today-dark" },
  },
];
