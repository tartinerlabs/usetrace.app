import {
  cutPath,
  getLength,
  getPointAtLength,
  interpolatePath,
} from "@remotion/paths";
import type React from "react";
import { useMemo } from "react";
import { AbsoluteFill, Easing, useCurrentFrame } from "remotion";
import { HILL_EDGE, TraceIcon } from "../components/TraceIcon";
import {
  ALL_ROUTE_POINTS,
  fitCamera,
  LEGS,
  project,
  smoothPath,
} from "../data/route";
import type { Layout } from "../layout";
import { EASE_IO, enter, mix, progress } from "../motion";
import { ACTIVITY_COLOR, C, FONT, headline, MONO } from "../theme";
import { END_HOLD, SCENES } from "../timing";

// S8 · 2400-3120 · End card. Dawn comes up from below (Backdrop). The day's
// route from S1 draws once more in its own colours, centred in the frame, then
// rises and folds into the hill line of the Trace icon at the icon's real size while
// the tile condenses from the route's bounds and the day's last dot (Home)
// travels to become the sun. "Your day, retraced." with the site's sun
// highlight sweep. Everything is settled and static from END_HOLD (47.5 s).

const HOLD = END_HOLD - SCENES.S8.from; // 450
// The stroke starts once the dawn sheet's edge has cleared the route (f2430).
const DRAW: [number, number] = [30, 60];
const MORPH: [number, number] = [62, 110]; // 48 frames, cubic-bezier(0.65,0,0.35,1)
// The head dot appears with the stroke (global f2430) and fades in as the
// first segment draws, so it never shows alone as a speck.
const DOT_IN = 30;
const DOT_FADE_PX = 60; // drawn length (px) over which the dot fades in

// Scale the icon's hill edge (viewBox 0..100) into screen space.
const hillEdgeAt = (x: number, y: number, L: number) =>
  HILL_EDGE.replace(/-?\d+(\.\d+)?/g, (n, _g, offset: number, all: string) => {
    // numbers alternate x, y after the command letter
    const before = all.slice(0, offset).match(/-?\d+(\.\d+)?/g)?.length ?? 0;
    const v = Number(n);
    return before % 2 === 0
      ? (x + (v / 100) * L).toFixed(2)
      : (y + (v / 100) * L).toFixed(2);
  });

const hexMix = (a: string, b: string, t: number) => {
  const pa = [1, 3, 5].map((i) => parseInt(a.slice(i, i + 2), 16));
  const pb = [1, 3, 5].map((i) => parseInt(b.slice(i, i + 2), 16));
  return `rgb(${pa.map((v, i) => Math.round(mix(v, pb[i], t))).join(",")})`;
};

export const S8EndCard: React.FC<{ layout: Layout }> = ({ layout }) => {
  const frame = useCurrentFrame();
  const f = Math.min(frame, HOLD); // hold a clean, static end frame
  const { width: W, height: H } = layout;
  const portrait = layout.orientation === "portrait";
  const L = layout.end.logo;
  const logoX = W / 2 - L / 2;
  const logoY = layout.end.logoY - L / 2;

  // S1's route, same projection and colours, drawn at the frame's centre.
  // The morph then carries it up and down in size into the icon slot.
  const route = useMemo(() => {
    const box = L * (portrait ? 3 : 2.6);
    const cam = fitCamera(ALL_ROUTE_POINTS, box, box, W / 2, H / 2);
    const pts = ALL_ROUTE_POINTS.map((pt) => project(pt, cam));
    const xs = pts.map((q) => q[0]);
    const ys = pts.map((q) => q[1]);
    const bbox = {
      x: Math.min(...xs),
      y: Math.min(...ys),
      w: Math.max(...xs) - Math.min(...xs),
      h: Math.max(...ys) - Math.min(...ys),
    };
    const legs = LEGS.map((l) =>
      smoothPath(
        l.points.map((pt) => project(pt, cam)),
        false,
        0.5,
      ),
    );
    const lens = legs.map((d) => getLength(d));
    const total = lens.reduce((a, b) => a + b, 0);
    // Each leg folds into its share of the hill edge, in order along the day.
    const hill = hillEdgeAt(logoX, logoY, L);
    const hillLen = getLength(hill);
    let acc = 0;
    const targets = lens.map((len) => {
      const a = (acc / total) * hillLen;
      acc += len;
      const b = (acc / total) * hillLen;
      const samples = Array.from({ length: 16 }, (_, i) => {
        const pt = getPointAtLength(hill, a + ((b - a) * i) / 15);
        return [pt?.x ?? 0, pt?.y ?? 0] as [number, number];
      });
      return smoothPath(samples, false, 0.5);
    });
    const home = project(ALL_ROUTE_POINTS[ALL_ROUTE_POINTS.length - 1], cam);
    return { legs, lens, total, targets, bbox, home };
  }, [L, W, H, logoX, logoY, portrait]);

  const draw = progress(f, DRAW[0], DRAW[1], EASE_IO) * route.total;
  const morph = progress(f, MORPH[0], MORPH[1], EASE_IO);
  const lineOut = 1 - progress(f, MORPH[1] - 4, MORPH[1] + 14, EASE_IO);
  const hillIn = progress(f, MORPH[1] - 12, MORPH[1] + 8, EASE_IO);
  const sunHere = f >= MORPH[1];
  // The first stroke segment (a short walk, drawn as dots) and the head dot
  // fade in together over the first DOT_FADE_PX of the draw.
  const startIn = Math.min(1, draw / DOT_FADE_PX);

  // The tile condenses from the route's bounding box to the icon.
  const pad = L * 0.12;
  const box = {
    x: mix(route.bbox.x - pad, logoX, morph),
    y: mix(route.bbox.y - pad, logoY, morph),
    w: mix(route.bbox.w + 2 * pad, L, morph),
    h: mix(route.bbox.h + 2 * pad, L, morph),
  };
  const tileIn = progress(f, MORPH[0], MORPH[0] + 30, EASE_IO);
  const tileR = Math.min(box.w, box.h) * 0.2237;

  // Head dot: hidden until the stroke starts drawing, follows the draw,
  // waits at Home, then becomes the sun.
  let head: [number, number] = route.home;
  let headColor: string = C.sun;
  {
    let rem = draw;
    for (let i = 0; i < route.legs.length; i++) {
      if (rem <= route.lens[i] + 0.001) {
        const pt = getPointAtLength(
          route.legs[i],
          Math.max(0, Math.min(route.lens[i], rem)),
        );
        if (pt) head = [pt.x, pt.y];
        headColor =
          draw >= route.total - 0.5 ? C.sun : ACTIVITY_COLOR[LEGS[i].kind];
        break;
      }
      rem -= route.lens[i];
    }
  }
  const sunC = { x: logoX + 0.62 * L, y: logoY + 0.5 * L, r: 0.15 * L };
  const dotX = mix(head[0], sunC.x, morph);
  const dotY = mix(head[1], sunC.y, morph);
  const dotR = mix(7, sunC.r, morph);

  const words = ["Your", "day,"];
  const hlStart = 134;
  const sweep = progress(
    f,
    hlStart,
    hlStart + 45,
    Easing.bezier(0.65, 0, 0.35, 1),
  );
  const push =
    1 + 0.018 * progress(f, 100, HOLD, Easing.bezier(0.33, 0, 0.2, 1));
  const size = layout.end.headline;

  return (
    <AbsoluteFill style={{ scale: `${push}` }}>
      {/* the tile, condensing from the route's bounds */}
      <div
        style={{
          position: "absolute",
          left: box.x,
          top: box.y,
          width: box.w,
          height: box.h,
          borderRadius: tileR,
          background: C.canvas,
          opacity: tileIn,
          boxShadow: `0 ${L * 0.08}px ${L * 0.2}px -${L * 0.06}px rgba(27,27,25,${0.28 * morph}), 0 0 0 1px rgba(27,27,25,${0.07 * tileIn})`,
        }}
      />
      {morph > 0 ? (
        <div style={{ position: "absolute", left: logoX, top: logoY }}>
          <TraceIcon
            size={L}
            tile={1}
            shadow={0}
            sun={1}
            sunScale={sunHere ? 1 : 0}
            hill={1}
            hillOpacity={hillIn}
            style={{ boxShadow: "none" }}
          />
        </div>
      ) : null}
      <svg
        width={W}
        height={layout.height}
        style={{ position: "absolute", inset: 0 }}
      >
        <g opacity={lineOut * startIn}>
          {route.legs.map((d, i) => {
            const before = route.lens.slice(0, i).reduce((a, b) => a + b, 0);
            const shown = Math.max(0, Math.min(route.lens[i], draw - before));
            if (shown <= 0) return null;
            const kind = LEGS[i].kind;
            const pathD =
              morph > 0
                ? interpolatePath(morph, d, route.targets[i])
                : shown >= route.lens[i]
                  ? d
                  : cutPath(d, shown);
            const walk = kind === "walk";
            return (
              <path
                key={i}
                d={pathD}
                fill="none"
                stroke={hexMix(ACTIVITY_COLOR[kind], C.ink, morph)}
                strokeWidth={mix(kind === "train" ? 6.5 : 5.5, 3, morph)}
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeDasharray={
                  walk && morph < 1
                    ? `${morph * 24} ${10 * (1 - morph) + 0.01}`
                    : undefined
                }
              />
            );
          })}
        </g>
        {f >= DOT_IN && !sunHere ? (
          <g opacity={startIn}>
            <circle
              cx={dotX}
              cy={dotY}
              r={dotR * (1 + 1.6 * (1 - morph))}
              fill={headColor}
              opacity={0.16 * (1 - morph)}
            />
            <circle cx={dotX} cy={dotY} r={dotR} fill={headColor} />
          </g>
        ) : null}
      </svg>

      {/* headline */}
      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          top: layout.end.headlineY,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <div
          style={{
            ...headline(size),
            lineHeight: 0.9,
            letterSpacing: "-0.05em",
            display: "flex",
            flexDirection: portrait ? "column" : "row",
            alignItems: "center",
            gap: portrait ? 0 : "0.18em",
          }}
        >
          <div
            style={{
              display: "flex",
              gap: "0.18em",
              overflow: "hidden",
              paddingBottom: size * 0.14,
            }}
          >
            {words.map((w, i) => {
              const t = enter(f, 104 + i * 7, 20);
              return (
                <span
                  key={w}
                  style={{
                    display: "inline-block",
                    translate: `0 ${(1 - t) * 130}%`,
                    opacity: Math.min(1, t * 1.6),
                  }}
                >
                  {w}
                </span>
              );
            })}
          </div>
          <div
            style={{
              overflow: "hidden",
              paddingBottom: size * 0.14,
              paddingTop: size * 0.02,
            }}
          >
            {(() => {
              const t = enter(f, 118, 20);
              return (
                <span
                  style={{
                    position: "relative",
                    isolation: "isolate",
                    display: "inline-block",
                    padding: "0 0.12em 0.06em",
                    translate: `0 ${(1 - t) * 130}%`,
                    opacity: Math.min(1, t * 1.6),
                    color: C.ink,
                  }}
                >
                  <span
                    style={{
                      position: "absolute",
                      inset: 0,
                      zIndex: -1,
                      borderRadius: "0.16em",
                      background: C.sun,
                      scale: `${sweep} 1`,
                      transformOrigin: "left center",
                    }}
                  />
                  retraced.
                  {/* ivory copy of the word, revealed exactly where the sun block has passed */}
                  <span
                    aria-hidden
                    style={{
                      position: "absolute",
                      inset: 0,
                      padding: "0 0.12em 0.06em",
                      color: C.onSun,
                      clipPath: `inset(0 ${(1 - sweep) * 100}% 0 0)`,
                    }}
                  >
                    retraced.
                  </span>
                </span>
              );
            })()}
          </div>
        </div>

        <div
          style={{
            marginTop: portrait ? 44 : 34,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: portrait ? 22 : 18,
          }}
        >
          <div
            style={{
              fontFamily: FONT,
              fontSize: layout.type.sub + (portrait ? 4 : 2),
              fontWeight: 500,
              letterSpacing: "-0.02em",
              color: C.ink,
              opacity: enter(f, 168, 18),
              translate: `0 ${(1 - enter(f, 168, 18)) * 14}px`,
            }}
          >
            Coming soon on the App Store
          </div>
          <div
            style={{
              fontFamily: MONO,
              fontSize: layout.type.sub - (portrait ? 6 : 8),
              fontWeight: 500,
              letterSpacing: "0.08em",
              color: C.secondary,
              opacity: enter(f, 180, 18),
              translate: `0 ${(1 - enter(f, 180, 18)) * 14}px`,
            }}
          >
            usetrace.app
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
};
