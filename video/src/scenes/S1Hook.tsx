import { cutPath, getLength, getPointAtLength } from "@remotion/paths";
import type React from "react";
import { useMemo } from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { KineticHeadline } from "../components/KineticHeadline";
import {
  ALL_ROUTE_POINTS,
  type Camera,
  fitCamera,
  ISLAND,
  ISLETS,
  LEGS,
  PINS,
  PLACES,
  project,
  smoothPath,
} from "../data/route";
import type { Layout } from "../layout";
import { EASE_IO, enter, mix, POP, progress } from "../motion";
import { ACTIVITY_COLOR, C, MONO } from "../theme";

// S1 · 0-300 · Hook. An abstract Singapore; the camera eases from the whole
// island into the day as the route draws itself and the places pop in.
// The final head dot (Home) flies to centre and becomes the sun of the icon.

export const S1_HANDOFF = 262; // local frame the sun hand-off starts

const toMinutes = (s: string) => {
  const [h, m] = s.split(":").map(Number);
  return h * 60 + m;
};
const fmtClock = (min: number) => {
  const h = Math.floor(min / 60);
  const m = Math.floor(min % 60);
  return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
};

export const S1Hook: React.FC<{
  layout: Layout;
  iconSunTarget: { x: number; y: number; r: number };
}> = ({ layout, iconSunTarget }) => {
  const frame = useCurrentFrame();
  const { width: W, height: H } = layout;
  const portrait = layout.orientation === "portrait";
  const k = portrait ? 1 : 1; // stroke scale

  // Camera: whole island -> the day's route.
  const camStart = useMemo(
    () =>
      fitCamera(
        ISLAND,
        W * (portrait ? 1.25 : 0.86),
        H * 0.8,
        W / 2,
        portrait ? H * 0.56 : H * 0.5,
      ),
    [W, H, portrait],
  );
  const camEnd = useMemo(
    () =>
      fitCamera(
        ALL_ROUTE_POINTS,
        layout.map.routeW,
        layout.map.routeH,
        layout.map.cx,
        layout.map.cy,
      ),
    [layout],
  );
  const t = progress(frame, 4, 230, EASE_IO);
  const zoomOut = progress(frame, S1_HANDOFF, 300, EASE_IO);
  const cam: Camera = {
    lng: mix(camStart.lng, camEnd.lng, t),
    lat: mix(camStart.lat, camEnd.lat, t),
    scale:
      camStart.scale *
      (camEnd.scale / camStart.scale) ** t *
      (1 + zoomOut * 0.08),
    cx: mix(camStart.cx, camEnd.cx, t),
    cy: mix(camStart.cy, camEnd.cy, t),
  };
  const P = (pt: [number, number]) => project(pt, cam);

  const island = smoothPath(ISLAND.map(P), true, 0.45);
  const islets = ISLETS.map((s) => smoothPath(s.map(P), true, 0.5));
  const islandIn = enter(frame, 0, 30);

  // Route legs drawn by time of day.
  const legs = LEGS.map((leg) => {
    const d = smoothPath(leg.points.map(P), false, 0.5);
    const len = getLength(d);
    const pr = progress(frame, leg.draw[0], leg.draw[1], EASE_IO);
    return {
      leg,
      d,
      len,
      pr,
      drawn: pr <= 0 ? "" : pr >= 1 ? d : cutPath(d, len * pr),
    };
  });

  // Head dot + clock.
  let head: [number, number] = P(PLACES.home.at);
  let headColor: string = C.place;
  let clock = toMinutes(LEGS[0].clock[0]);
  for (const l of legs) {
    if (l.pr > 0) {
      const pt = getPointAtLength(l.d, l.len * l.pr);
      if (pt) head = [pt.x, pt.y];
      headColor = ACTIVITY_COLOR[l.leg.kind];
      clock = mix(toMinutes(l.leg.clock[0]), toMinutes(l.leg.clock[1]), l.pr);
    }
  }
  const lastDone = legs[legs.length - 1].pr >= 1;
  if (lastDone) headColor = C.sun;

  const sceneOut = 1 - progress(frame, S1_HANDOFF, S1_HANDOFF + 26, EASE_IO);

  // Sun hand-off: head dot -> icon sun at frame 300.
  const hand = enter(frame, S1_HANDOFF, 38, { damping: 200, stiffness: 90 });
  const sunX = mix(head[0], iconSunTarget.x, hand);
  const sunY = mix(head[1], iconSunTarget.y, hand);
  const sunR = mix(9 * k, iconSunTarget.r, hand);

  const headlineSize = layout.type.hero;
  const lines = portrait
    ? ["Every day", "takes you", "somewhere."]
    : ["Every day takes", "you somewhere."];

  return (
    <AbsoluteFill>
      <AbsoluteFill style={{ opacity: sceneOut }}>
        <svg width={W} height={H} style={{ position: "absolute", inset: 0 }}>
          <defs>
            <pattern
              id="halftone"
              width="13"
              height="13"
              patternUnits="userSpaceOnUse"
            >
              <circle cx="6.5" cy="6.5" r="1.5" fill="#d6d1c4" />
            </pattern>
            <clipPath id="land">
              <path d={island} />
              {islets.map((d, i) => (
                <path key={i} d={d} />
              ))}
            </clipPath>
          </defs>
          <g opacity={islandIn}>
            <path d={island} fill={C.fill} />
            {islets.map((d, i) => (
              <path key={i} d={d} fill={C.fill} />
            ))}
            <rect
              width={W}
              height={H}
              fill="url(#halftone)"
              clipPath="url(#land)"
              opacity={0.9}
            />
            <path
              d={island}
              fill="none"
              stroke="#d9d4c8"
              strokeWidth={1.5}
              pathLength={1}
              strokeDasharray={1}
              strokeDashoffset={1 - progress(frame, 0, 60)}
            />
          </g>

          {/* white casing under every leg, then the coloured line */}
          {legs.map(({ drawn, leg }, i) =>
            drawn ? (
              <path
                key={`c${i}`}
                d={drawn}
                fill="none"
                stroke={C.canvas}
                strokeWidth={(leg.kind === "train" ? 15 : 13) * k}
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            ) : null,
          )}
          {legs.map(({ drawn, leg }, i) =>
            drawn ? (
              <path
                key={`r${i}`}
                d={drawn}
                fill="none"
                stroke={ACTIVITY_COLOR[leg.kind]}
                strokeWidth={
                  (leg.kind === "train" ? 7.5 : leg.kind === "walk" ? 6 : 6.5) *
                  k
                }
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeDasharray={
                  leg.kind === "walk" ? `0 ${11 * k}` : undefined
                }
              />
            ) : null,
          )}

          {/* place pins */}
          {PINS.map((pin) => {
            const s = enter(frame, pin.at, 18, POP);
            if (s <= 0.001) return null;
            const [x, y] = P(PLACES[pin.id].at);
            return (
              <g key={pin.id} transform={`translate(${x} ${y}) scale(${s})`}>
                <circle r={22 * k} fill={C.place} opacity={0.14} />
                <circle r={11.5 * k} fill={C.surface} />
                <circle
                  r={7.5 * k}
                  fill={pin.id === "home" ? C.ink : C.place}
                />
              </g>
            );
          })}

          {/* head dot */}
          {frame >= LEGS[0].draw[0] && frame < S1_HANDOFF ? (
            <g transform={`translate(${head[0]} ${head[1]})`}>
              <circle
                r={24 * k}
                fill={headColor}
                opacity={0.16 + 0.06 * Math.sin(frame / 5)}
              />
              <circle r={10 * k} fill={C.surface} />
              <circle r={7 * k} fill={headColor} />
            </g>
          ) : null}
        </svg>

        {/* pin labels (HTML for crisp type) */}
        {PINS.map((pin) => {
          const s = enter(frame, pin.at + 6, 16);
          if (s <= 0.001) return null;
          const [x, y] = P(PLACES[pin.id].at);
          const above = portrait && pin.portraitLabel === "above";
          const left = pin.label === "left" || above;
          return (
            <div
              key={pin.id}
              style={{
                position: "absolute",
                left: left ? undefined : x + 26,
                right: above ? W - x - 18 : left ? W - x + 26 : undefined,
                top: above ? y - 64 : y - 13,
                fontFamily: MONO,
                fontSize: portrait ? 22 : 19,
                fontWeight: 500,
                letterSpacing: "0.14em",
                textTransform: "uppercase",
                color: C.ink,
                opacity: s,
                translate: above
                  ? `0 ${(1 - s) * 8}px`
                  : `${(1 - s) * (left ? 10 : -10)}px 0`,
                whiteSpace: "nowrap",
                background: "rgba(244,242,236,0.82)",
                padding: "4px 8px",
                borderRadius: 6,
              }}
            >
              {PLACES[pin.id].name}
            </div>
          );
        })}

        {/* day + clock readout */}
        <div
          style={{
            position: "absolute",
            right: portrait ? 96 : 168,
            top: portrait ? 640 : 132,
            textAlign: "right",
            fontFamily: MONO,
            color: C.secondary,
            opacity: enter(frame, 14, 18),
          }}
        >
          <div
            style={{
              fontSize: portrait ? 24 : 20,
              letterSpacing: "0.16em",
              fontWeight: 500,
            }}
          >
            MON 5 OCT · SINGAPORE
          </div>
          <div
            style={{
              fontSize: portrait ? 52 : 46,
              letterSpacing: "0.02em",
              color: C.ink,
              marginTop: 10,
              fontVariantNumeric: "tabular-nums",
            }}
          >
            {fmtClock(clock)}
          </div>
        </div>

        {/* headline */}
        <div
          style={{
            position: "absolute",
            left: layout.copy.x,
            top: portrait ? 250 : undefined,
            bottom: portrait ? undefined : 132,
          }}
        >
          <KineticHeadline
            lines={lines}
            start={30}
            stagger={7}
            duration={20}
            size={headlineSize}
            exitAt={S1_HANDOFF - 8}
          />
        </div>
      </AbsoluteFill>

      {/* the sun hand-off */}
      {frame >= S1_HANDOFF - 1 ? (
        <svg width={W} height={H} style={{ position: "absolute", inset: 0 }}>
          <circle cx={sunX} cy={sunY} r={sunR} fill={C.sun} />
        </svg>
      ) : null}
    </AbsoluteFill>
  );
};
