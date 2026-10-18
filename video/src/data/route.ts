// The sample day, Mon 5 Oct 2026. Coordinates come from the app's demo data
// (Trace/Demo/DemoData.swift), which is what the simulator footage shows:
// Home in Bukit Panjang, the Downtown Line into the city, Office at Marina One,
// a drive to dinner at Dempsey Hill and the drive home. Mock data only.

import type { ActivityKind } from "../theme";

export type LngLat = [number, number]; // [lng, lat]
const p = (lat: number, lng: number): LngLat => [lng, lat];

export const PLACES = {
  home: { name: "Home", at: p(1.3781, 103.7636), time: "07:42" },
  office: { name: "Office", at: p(1.28, 103.8506), time: "08:27" },
  dempsey: { name: "Dempsey Hill", at: p(1.3049, 103.81), time: "18:49" },
} as const;
export type PlaceId = keyof typeof PLACES;

const BUKIT_PANJANG = p(1.3792, 103.7618);
const DOWNTOWN = p(1.2793, 103.852);

const RAIL: LngLat[] = [
  p(1.3792, 103.7618),
  p(1.3698, 103.7645),
  p(1.3623, 103.7674),
  p(1.354, 103.7688),
  p(1.3416, 103.7758),
  p(1.3357, 103.7832),
  p(1.3308, 103.7972),
  p(1.3256, 103.8074),
  p(1.3225, 103.8153),
  p(1.32, 103.826),
  p(1.3129, 103.8384),
  p(1.3068, 103.8496),
  p(1.3038, 103.8527),
  p(1.3004, 103.8559),
  p(1.2934, 103.8609),
  p(1.2818, 103.8591),
  p(1.2793, 103.852),
];

export type Leg = {
  kind: ActivityKind;
  points: LngLat[];
  // When this leg draws in the S1 opener (local frames) and the clock it shows.
  draw: [number, number];
  clock: [string, string];
  arrive?: PlaceId;
};

export const LEGS: Leg[] = [
  {
    kind: "walk",
    points: [
      PLACES.home.at,
      p(1.3778, 103.7625),
      p(1.3785, 103.7617),
      BUKIT_PANJANG,
    ],
    draw: [26, 42],
    clock: ["07:42", "07:48"],
  },
  { kind: "train", points: RAIL, draw: [42, 104], clock: ["07:49", "08:20"] },
  {
    kind: "walk",
    points: [DOWNTOWN, p(1.2791, 103.8509), PLACES.office.at],
    draw: [104, 116],
    clock: ["08:21", "08:27"],
    arrive: "office",
  },
  {
    kind: "drive",
    points: [
      PLACES.office.at,
      p(1.2768, 103.8484),
      p(1.2744, 103.843),
      p(1.276, 103.833),
      p(1.2825, 103.818),
      p(1.291, 103.804),
      p(1.301, 103.799),
      p(1.307, 103.8062),
      PLACES.dempsey.at,
    ],
    draw: [124, 168],
    clock: ["18:15", "18:43"],
    arrive: "dempsey",
  },
  {
    kind: "drive",
    points: [
      PLACES.dempsey.at,
      p(1.309, 103.8104),
      p(1.319, 103.816),
      p(1.33, 103.814),
      p(1.343, 103.803),
      p(1.352, 103.787),
      p(1.365, 103.7765),
      p(1.3781, 103.77),
      PLACES.home.at,
    ],
    draw: [176, 236],
    clock: ["20:12", "20:42"],
    arrive: "home",
  },
];

// Pins: when each pops in (S1 local frames).
export const PINS: {
  id: PlaceId;
  at: number;
  label: "left" | "right";
  portraitLabel?: "above";
}[] = [
  { id: "home", at: 18, label: "left" },
  { id: "office", at: 114, label: "left" },
  { id: "dempsey", at: 166, label: "left" },
];

// A stylised, hand-simplified outline of Singapore and a few islands.
// Abstract on purpose: smoothed with Catmull-Rom, no labels or roads.
export const ISLAND: LngLat[] = [
  [103.605, 1.315],
  [103.618, 1.338],
  [103.64, 1.352],
  [103.662, 1.372],
  [103.682, 1.402],
  [103.703, 1.426],
  [103.724, 1.443],
  [103.748, 1.447],
  [103.771, 1.451],
  [103.792, 1.454],
  [103.812, 1.459],
  [103.832, 1.462],
  [103.851, 1.451],
  [103.866, 1.437],
  [103.881, 1.424],
  [103.897, 1.423],
  [103.914, 1.417],
  [103.933, 1.405],
  [103.951, 1.392],
  [103.971, 1.389],
  [103.991, 1.389],
  [104.011, 1.379],
  [104.03, 1.364],
  [104.034, 1.344],
  [104.019, 1.326],
  [103.994, 1.318],
  [103.968, 1.311],
  [103.94, 1.305],
  [103.914, 1.3],
  [103.889, 1.295],
  [103.872, 1.287],
  [103.866, 1.274],
  [103.854, 1.266],
  [103.839, 1.263],
  [103.824, 1.267],
  [103.809, 1.271],
  [103.789, 1.276],
  [103.769, 1.282],
  [103.751, 1.29],
  [103.735, 1.299],
  [103.718, 1.305],
  [103.7, 1.3],
  [103.68, 1.31],
  [103.66, 1.306],
  [103.64, 1.301],
  [103.62, 1.302],
];
export const ISLETS: LngLat[][] = [
  // Sentosa
  [
    [103.8, 1.251],
    [103.815, 1.245],
    [103.834, 1.247],
    [103.841, 1.255],
    [103.825, 1.259],
    [103.806, 1.258],
  ],
  // Jurong Island
  [
    [103.668, 1.272],
    [103.69, 1.256],
    [103.718, 1.259],
    [103.727, 1.274],
    [103.703, 1.286],
    [103.676, 1.285],
  ],
  // Pulau Ubin
  [
    [103.932, 1.418],
    [103.958, 1.409],
    [103.988, 1.405],
    [104.001, 1.414],
    [103.972, 1.424],
    [103.943, 1.427],
  ],
];

// --- Projection & path helpers -------------------------------------------

export type Camera = {
  lng: number;
  lat: number;
  scale: number;
  cx: number;
  cy: number;
};
const COS = Math.cos((1.33 * Math.PI) / 180);

export const project = (pt: LngLat, cam: Camera): [number, number] => [
  cam.cx + (pt[0] - cam.lng) * COS * cam.scale,
  cam.cy - (pt[1] - cam.lat) * cam.scale,
];

const fmt = (n: number) => n.toFixed(2);

// Smooth path through points (Catmull-Rom -> cubic Bezier).
export const smoothPath = (
  pts: [number, number][],
  closed = false,
  tension = 0.5,
): string => {
  if (pts.length < 2) return "";
  if (pts.length === 2 && !closed) {
    return `M${fmt(pts[0][0])} ${fmt(pts[0][1])} L${fmt(pts[1][0])} ${fmt(pts[1][1])}`;
  }
  const n = pts.length;
  const get = (i: number) =>
    closed ? pts[(i + n) % n] : pts[Math.max(0, Math.min(n - 1, i))];
  let d = `M${fmt(pts[0][0])} ${fmt(pts[0][1])}`;
  const segs = closed ? n : n - 1;
  const k = tension / 3;
  for (let i = 0; i < segs; i++) {
    const p0 = get(i - 1);
    const p1 = get(i);
    const p2 = get(i + 1);
    const p3 = get(i + 2);
    const c1 = [p1[0] + (p2[0] - p0[0]) * k, p1[1] + (p2[1] - p0[1]) * k];
    const c2 = [p2[0] - (p3[0] - p1[0]) * k, p2[1] - (p3[1] - p1[1]) * k];
    d += ` C${fmt(c1[0])} ${fmt(c1[1])} ${fmt(c2[0])} ${fmt(c2[1])} ${fmt(p2[0])} ${fmt(p2[1])}`;
  }
  return closed ? `${d} Z` : d;
};

export const bounds = (pts: LngLat[]) => {
  const lngs = pts.map((q) => q[0]);
  const lats = pts.map((q) => q[1]);
  return {
    minLng: Math.min(...lngs),
    maxLng: Math.max(...lngs),
    minLat: Math.min(...lats),
    maxLat: Math.max(...lats),
  };
};

// A camera that fits `pts` into a box of w x h centred at (cx, cy).
export const fitCamera = (
  pts: LngLat[],
  w: number,
  h: number,
  cx: number,
  cy: number,
): Camera => {
  const b = bounds(pts);
  const scale = Math.min(
    w / ((b.maxLng - b.minLng) * COS),
    h / (b.maxLat - b.minLat),
  );
  return {
    lng: (b.minLng + b.maxLng) / 2,
    lat: (b.minLat + b.maxLat) / 2,
    scale,
    cx,
    cy,
  };
};

export const ALL_ROUTE_POINTS = LEGS.flatMap((l) => l.points);
