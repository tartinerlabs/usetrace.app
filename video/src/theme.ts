import { loadFont as loadGeist } from "@remotion/google-fonts/Geist";
import { loadFont as loadGeistMono } from "@remotion/google-fonts/GeistMono";

// The site's typefaces (usetrace.app/src/app/layout.tsx loads Geist + Geist Mono).
const geist = loadGeist("normal", {
  weights: ["400", "500", "600"],
  subsets: ["latin"],
});
const geistMono = loadGeistMono("normal", {
  weights: ["400", "500"],
  subsets: ["latin"],
});

export const FONT = geist.fontFamily;
export const MONO = geistMono.fontFamily;

// Colour tokens, mirrored from usetrace.app/src/app/globals.css.
export const C = {
  canvas: "#f4f2ec",
  surface: "#ffffff",
  fill: "#ece9e1",
  line: "#e2dfd6",
  ink: "#1b1b19",
  onInk: "#f7f6f2",
  secondary: "#63635c",
  body: "#4a4a44",
  sun: "#a4542f",
  onSun: "#f4f2ec",
  walk: "#257856",
  cycle: "#187687",
  train: "#6953a3",
  bus: "#5f658f",
  drive: "#a4542f",
  flight: "#346eaa",
  place: "#5f7161",
  night: "#0e1014",
  nightSurface: "#191c21",
  nightLine: "#2a2e35",
  onNight: "#f1efe9",
  nightSecondary: "#a3a49e",
  peach: "#edb48c",
  hillDark: "#7a808a",
} as const;

export type ActivityKind = "walk" | "train" | "drive" | "cycle" | "place";

export const ACTIVITY_COLOR: Record<ActivityKind, string> = {
  walk: C.walk,
  train: C.train,
  drive: C.drive,
  cycle: C.cycle,
  place: C.place,
};

// Headline type, after the site's h1: semibold, leading 0.9, tracking -0.05em.
export const headline = (size: number, color: string = C.ink) =>
  ({
    fontFamily: FONT,
    fontWeight: 600,
    fontSize: size,
    lineHeight: 0.98,
    letterSpacing: "-0.045em",
    color,
  }) as const;

// Mono eyebrow: caps, wide tracking, secondary colour.
export const eyebrow = (size: number, color: string = C.secondary) =>
  ({
    fontFamily: MONO,
    fontWeight: 500,
    fontSize: size,
    letterSpacing: "0.16em",
    textTransform: "uppercase",
    color,
    lineHeight: 1,
  }) as const;
