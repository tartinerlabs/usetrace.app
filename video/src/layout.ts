// One timeline, two frames. Every scene reads its geometry from here.
// Portrait keeps all text between y=220 and y=1600 (social safe area).

export type Orientation = "landscape" | "portrait";

export type Layout = {
  orientation: Orientation;
  width: number;
  height: number;
  // iPhone screen (device frame is built around it).
  screenH: number;
  // Device centre when docked beside the copy.
  device: { x: number; y: number };
  // Copy column (left column in landscape, top band in portrait).
  copy: { x: number; y: number; w: number; align: "left" | "center" };
  type: {
    headline: number;
    eyebrow: number;
    sub: number;
    chip: number;
    hero: number;
    privacy: number;
  };
  // S1 map framing: route box and centre.
  map: {
    routeW: number;
    routeH: number;
    cx: number;
    cy: number;
    headlineY: number;
  };
  // S2 lockup size (icon) and where it docks.
  lockup: { icon: number; dockX: number; dockY: number; dockScale: number };
  // S8 end card.
  end: { logoY: number; logo: number; headlineY: number; headline: number };
};

export const LANDSCAPE: Layout = {
  orientation: "landscape",
  width: 1920,
  height: 1080,
  screenH: 820,
  device: { x: 1330, y: 540 },
  copy: { x: 168, y: 540, w: 800, align: "left" },
  type: {
    headline: 112,
    eyebrow: 22,
    sub: 36,
    chip: 52,
    hero: 128,
    privacy: 92,
  },
  map: { routeW: 700, routeH: 640, cx: 1250, cy: 540, headlineY: 812 },
  lockup: { icon: 220, dockX: 168, dockY: 330, dockScale: 0.5 },
  end: { logoY: 330, logo: 168, headlineY: 570, headline: 156 },
};

export const PORTRAIT: Layout = {
  orientation: "portrait",
  width: 1080,
  height: 1920,
  // Device bottom stays at or above y=1590 even at the S3 push-in (x1.05),
  // clear of the bottom 320 px where social captions and CTAs sit.
  screenH: 860,
  device: { x: 540, y: 1106 },
  copy: { x: 96, y: 250, w: 888, align: "left" },
  type: {
    headline: 100,
    eyebrow: 24,
    sub: 38,
    chip: 40,
    hero: 112,
    privacy: 76,
  },
  map: { routeW: 640, routeH: 800, cx: 566, cy: 1110, headlineY: 250 },
  lockup: { icon: 200, dockX: 96, dockY: 270, dockScale: 0.5 },
  end: { logoY: 620, logo: 210, headlineY: 900, headline: 140 },
};

export const getLayout = (o: Orientation): Layout =>
  o === "portrait" ? PORTRAIT : LANDSCAPE;

// iPhone 18 Pro screen aspect (402 x 874 pt).
export const SCREEN_ASPECT = 402 / 874;
