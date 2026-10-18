import type React from "react";
import { useMemo } from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import {
  ALL_ROUTE_POINTS,
  fitCamera,
  LEGS,
  project,
  smoothPath,
} from "../data/route";
import type { Layout } from "../layout";
import { CALM, EASE_IO, enter, progress } from "../motion";
import { C } from "../theme";

// Global canvas. Ivory by day. At bar 14 (S7) night rises as the hill of the
// Trace icon, sweeping up from the bottom of frame. At bar 17 (S8) dawn comes
// up from below as a feathered ivory sheet, with a peach glow that stays low
// on the horizon and fades as the day fills in. Behind the device scenes the
// day's route sits huge and faint and drifts slower than the phone, for depth.

export const NIGHT_IN = 1950;
export const DAWN_IN = 2392;
const DAWN_LEN = 46;
// Night wave edge feather (Gaussian sigma, px): a 40-80 px soft leading edge.
const WAVE_FEATHER = 15;

// The night wave's edge: the icon's hill curve, stretched to the frame,
// translated by `hillY` as it rises.
const waveCurve = (W: number, H: number) =>
  [
    [-0.02 * W, 0.24 * H],
    [0.3 * W, 0.24 * H],
    [0.44 * W, 0.02 * H],
    [1.02 * W, 0],
  ] as const;

const waveHillY = (frame: number, H: number) =>
  interpolate(enter(frame, NIGHT_IN, 46, CALM), [0, 1], [H * 1.04, -H * 0.3]);

// Global y of the night wave's edge at global x (frame space). The curve's x
// grows monotonically with t, so a short bisection finds the point.
export const waveEdgeY = (frame: number, W: number, H: number, x: number) => {
  const [p0, p1, p2, p3] = waveCurve(W, H);
  const at = (t: number, k: 0 | 1) =>
    (1 - t) ** 3 * p0[k] +
    3 * (1 - t) ** 2 * t * p1[k] +
    3 * (1 - t) * t ** 2 * p2[k] +
    t ** 3 * p3[k];
  let lo = 0;
  let hi = 1;
  for (let i = 0; i < 24; i++) {
    const mid = (lo + hi) / 2;
    if (at(mid, 0) < x) lo = mid;
    else hi = mid;
  }
  return at((lo + hi) / 2, 1) + waveHillY(frame, H);
};

const RouteLines: React.FC<{
  W: number;
  H: number;
  color: string;
  opacity: number;
}> = ({ W, H, color, opacity }) => {
  const frame = useCurrentFrame();
  const routes = useMemo(() => {
    const cam = fitCamera(
      ALL_ROUTE_POINTS,
      W * 1.9,
      H * 1.9,
      W * 0.52,
      H * 0.5,
    );
    return LEGS.map((l) => smoothPath(l.points.map((pt) => project(pt, cam))));
  }, [W, H]);
  if (opacity <= 0) return null;
  return (
    <svg
      width={W}
      height={H}
      style={{
        position: "absolute",
        inset: 0,
        opacity,
        translate: `${-frame * 0.12}px ${Math.sin(frame / 140) * 6}px`,
      }}
    >
      {routes.map((d, i) => (
        <path
          key={i}
          d={d}
          fill="none"
          stroke={color}
          strokeWidth={3}
          strokeLinecap="round"
          strokeDasharray={LEGS[i].kind === "walk" ? "0 12" : undefined}
        />
      ))}
    </svg>
  );
};

export const Backdrop: React.FC<{ layout: Layout }> = ({ layout }) => {
  const frame = useCurrentFrame();
  const { width: W, height: H } = layout;
  const dx = (layout.device.x / W) * 100;
  const dy = (layout.device.y / H) * 100;

  // Night: the icon's hill edge, stretched to the frame, rises to cover it.
  const rise = enter(frame, NIGHT_IN, 46, CALM);
  const [p0, p1, p2, p3] = waveCurve(W, H);
  const hillTop = `M${p0[0]} ${p0[1]} C${p1[0]} ${p1[1]} ${p2[0]} ${p2[1]} ${p3[0]} ${p3[1]}`;
  // Filled well past the frame's sides so the feather only softens the top.
  const hill = `${hillTop} L${1.1 * W} 0 L${1.1 * W} ${2 * H} L${-0.1 * W} ${2 * H} L${-0.1 * W} ${p0[1]} Z`;
  const hillY = waveHillY(frame, H);

  // Dawn: an ivory sheet rises from below with a narrow feather tinted peach,
  // so its edge reads as warm light and not as a grey band, until it fills
  // the frame. The peach light stays low on the horizon (its top never
  // passes ~70% of the frame height) and fades out as the sheet settles.
  const dawn = progress(frame, DAWN_IN, DAWN_IN + DAWN_LEN, EASE_IO);
  const SHEET_FEATHER = 10; // % of frame height
  const sheetEdge = interpolate(dawn, [0, 1], [-SHEET_FEATHER, 100]);
  const glow = Math.sin(Math.PI * dawn);
  const glowY = H * (1.06 - 0.08 * dawn);

  const dayLines = interpolate(
    frame,
    [330, 420, NIGHT_IN - 10, NIGHT_IN + 10],
    [0, 0.6, 0.6, 0],
    {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    },
  );
  const nightLines = interpolate(
    frame,
    [NIGHT_IN + 30, NIGHT_IN + 80, DAWN_IN - 10, DAWN_IN + 10],
    [0, 0.7, 0.7, 0],
    {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    },
  );

  return (
    <AbsoluteFill style={{ background: C.canvas }}>
      <AbsoluteFill
        style={{
          background: `radial-gradient(ellipse ${W * 0.55}px ${H * 0.55}px at ${dx}% ${dy}%, rgba(255,255,255,0.55), rgba(255,255,255,0) 70%)`,
        }}
      />
      <RouteLines W={W} H={H} color={C.line} opacity={dayLines} />

      {frame >= NIGHT_IN && dawn < 1 ? (
        <AbsoluteFill>
          <svg width={W} height={H} style={{ position: "absolute", inset: 0 }}>
            <defs>
              <filter
                id="wave-feather"
                x="-20%"
                y="-20%"
                width="140%"
                height="140%"
              >
                <feGaussianBlur stdDeviation={WAVE_FEATHER} />
              </filter>
            </defs>
            <g style={{ translate: `0 ${hillY}px` }}>
              <g filter="url(#wave-feather)">
                <path d={hill} fill={C.night} />
                <path
                  d={hillTop}
                  fill="none"
                  stroke={C.peach}
                  strokeWidth={10}
                  opacity={0.45 * (1 - rise)}
                />
              </g>
            </g>
          </svg>
          <AbsoluteFill
            style={{
              opacity: rise,
              background: `radial-gradient(ellipse ${W * 0.45}px ${H * 0.5}px at ${dx}% ${dy}%, rgba(237,180,140,0.11), rgba(237,180,140,0) 70%)`,
            }}
          />
          <RouteLines W={W} H={H} color={C.nightLine} opacity={nightLines} />
        </AbsoluteFill>
      ) : null}

      {dawn > 0 ? (
        <>
          <AbsoluteFill
            style={{
              background: `linear-gradient(0deg, ${C.canvas} ${sheetEdge}%, ${C.peach} ${sheetEdge + SHEET_FEATHER * 0.3}%)`,
              // eased ramp: no visible kink where the feather meets the sheet;
              // holds most of its opacity into the feather, so little night shows
              // through the peach and the edge does not go brown
              maskImage: `linear-gradient(0deg, #000 ${sheetEdge}%, rgba(0,0,0,0.96) ${sheetEdge + SHEET_FEATHER * 0.35}%, rgba(0,0,0,0.8) ${sheetEdge + SHEET_FEATHER * 0.6}%, rgba(0,0,0,0.4) ${sheetEdge + SHEET_FEATHER * 0.85}%, transparent ${sheetEdge + SHEET_FEATHER}%)`,
            }}
          />
          {/* the light itself: a wide, soft glow sitting low on the horizon */}
          <AbsoluteFill
            style={{
              background: `radial-gradient(ellipse ${W * 0.62}px ${H * 0.28}px at 50% ${glowY}px, rgba(255,236,214,${0.9 * glow}) 0%, rgba(237,180,140,${0.6 * glow}) 45%, rgba(237,180,140,0) 100%)`,
            }}
          />
        </>
      ) : null}
    </AbsoluteFill>
  );
};
