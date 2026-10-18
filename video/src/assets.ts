import { staticFile } from "remotion";

// Asset manifest. Flip a flag to `true` once the file is in public/.
// While a flag is false, the film renders a tasteful placeholder instead, so
// Studio and still renders always work.
export const ASSETS = {
  sim: {
    today: { mp4: true, png: true },
    "today-focus": { mp4: true, png: false },
    journey: { mp4: true, png: false },
    history: { mp4: true, png: false },
    places: { mp4: true, png: true },
    you: { mp4: false, png: false },
    "today-dark": { mp4: true, png: true },
  },
  vo: {
    vo1: true,
    vo2: true,
    vo3: true,
    vo4: true,
    vo5: true,
    vo6: true,
    vo7: true,
    vo8: true,
  },
  music: true,
};

export type SimClip = keyof typeof ASSETS.sim;
export type VoId = keyof typeof ASSETS.vo;

export const simSrc = (clip: SimClip, kind: "mp4" | "png") =>
  staticFile(`sim/${clip}.${kind}`);
export const voSrc = (id: VoId) => staticFile(`vo/${id}_48k.wav`);
export const musicSrc = () => staticFile("music/score_ducked.wav");

export const hasSim = (clip: SimClip, kind: "mp4" | "png") =>
  ASSETS.sim[clip][kind];
