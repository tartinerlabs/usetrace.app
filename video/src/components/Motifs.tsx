import type React from "react";
import { interpolate, useCurrentFrame } from "remotion";
import { EASE_IO, enter, POP, progress } from "../motion";
import { C, MONO } from "../theme";

// Small graphic motifs that sit under a feature headline.

// S4: a playback scrubber along the Downtown Line, ticking stop by stop.
export const PlaybackScrubber: React.FC<{
  start: number;
  width: number;
  exitAt: number;
}> = ({ start, width, exitAt }) => {
  const frame = useCurrentFrame();
  const t = enter(frame, start, 18);
  const out = enter(frame, exitAt, 12);
  const stops = 9;
  const play = progress(frame, start + 20, start + 220, EASE_IO);
  const x = play * width;
  return (
    <div
      style={{
        opacity: t * (1 - out),
        translate: `0 ${(1 - t) * 16}px`,
        display: "flex",
        alignItems: "center",
        gap: 26,
      }}
    >
      <div
        style={{
          width: 64,
          height: 64,
          borderRadius: 99,
          background: C.ink,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexShrink: 0,
        }}
      >
        <svg width="26" height="26" viewBox="0 0 24 24">
          <path
            d="M7 4.5v15l12.5-7.5z"
            fill={C.canvas}
            strokeLinejoin="round"
          />
        </svg>
      </div>
      <div style={{ position: "relative", width, height: 44 }}>
        <div
          style={{
            position: "absolute",
            left: 0,
            right: 0,
            top: 20,
            height: 4,
            borderRadius: 99,
            background: C.line,
          }}
        />
        <div
          style={{
            position: "absolute",
            left: 0,
            width: x,
            top: 20,
            height: 4,
            borderRadius: 99,
            background: C.train,
          }}
        />
        {Array.from({ length: stops }).map((_, i) => {
          const sx = (i / (stops - 1)) * width;
          const passed = x >= sx - 0.5;
          return (
            <div
              key={i}
              style={{
                position: "absolute",
                left: sx - 7,
                top: 15,
                width: 14,
                height: 14,
                borderRadius: 99,
                background: passed ? C.train : C.surface,
                border: `3px solid ${passed ? C.surface : C.line}`,
                boxSizing: "border-box",
                scale: passed
                  ? `${1 + 0.25 * Math.max(0, 1 - (x - sx) / 30)}`
                  : "1",
              }}
            />
          );
        })}
        <div
          style={{
            position: "absolute",
            left: x - 13,
            top: 9,
            width: 26,
            height: 26,
            borderRadius: 99,
            background: C.surface,
            boxShadow: "0 2px 8px rgba(27,27,25,0.25)",
            border: `6px solid ${C.train}`,
            boxSizing: "border-box",
          }}
        />
      </div>
    </div>
  );
};

// S5: a week of days as ribbons of colour, growing up like the site's ribbon.
const WEEK: { label: string; parts: [string, number][] }[] = [
  {
    label: "M",
    parts: [
      [C.train, 0.34],
      [C.walk, 0.1],
      [C.drive, 0.28],
    ],
  },
  {
    label: "T",
    parts: [
      [C.train, 0.36],
      [C.walk, 0.14],
    ],
  },
  {
    label: "W",
    parts: [
      [C.train, 0.33],
      [C.walk, 0.22],
      [C.train, 0.2],
    ],
  },
  {
    label: "T",
    parts: [
      [C.train, 0.35],
      [C.walk, 0.09],
    ],
  },
  {
    label: "F",
    parts: [
      [C.train, 0.3],
      [C.drive, 0.42],
    ],
  },
  {
    label: "S",
    parts: [
      [C.cycle, 0.52],
      [C.walk, 0.2],
    ],
  },
  {
    label: "S",
    parts: [
      [C.walk, 0.4],
      [C.cycle, 0.18],
    ],
  },
];

export const WeekRibbon: React.FC<{
  start: number;
  height: number;
  exitAt: number;
}> = ({ start, height, exitAt }) => {
  const frame = useCurrentFrame();
  const out = enter(frame, exitAt, 12);
  return (
    <div
      style={{
        display: "flex",
        gap: 18,
        alignItems: "flex-end",
        opacity: 1 - out,
      }}
    >
      {WEEK.map((d, i) => {
        const g = enter(frame, start + i * 5, 22, {
          damping: 18,
          stiffness: 140,
        });
        const total = d.parts.reduce((a, p) => a + p[1], 0);
        return (
          <div
            key={i}
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 12,
            }}
          >
            <div
              style={{
                width: 48,
                height: height,
                borderRadius: 12,
                background: C.fill,
                display: "flex",
                flexDirection: "column-reverse",
                overflow: "hidden",
              }}
            >
              <div
                style={{
                  height: height * total * g,
                  display: "flex",
                  flexDirection: "column-reverse",
                }}
              >
                {d.parts.map(([color, h], j) => (
                  <div
                    key={j}
                    style={{
                      flex: h,
                      background: color,
                      borderTop: j ? `3px solid ${C.fill}` : undefined,
                    }}
                  />
                ))}
              </div>
            </div>
            <div
              style={{
                fontFamily: MONO,
                fontSize: 20,
                color: C.secondary,
                opacity: interpolate(g, [0, 1], [0, 1]),
              }}
            >
              {d.label}
            </div>
          </div>
        );
      })}
    </div>
  );
};

// S6: the places of your life as pins that pop in.
export const PlacePins: React.FC<{
  start: number;
  size: number;
  exitAt: number;
}> = ({ start, size, exitAt }) => {
  const frame = useCurrentFrame();
  const out = enter(frame, exitAt, 12);
  const items = [
    { name: "Home", color: C.ink },
    { name: "Office", color: C.place },
    { name: "Botanic Gardens", color: C.walk },
  ];
  return (
    <div
      style={{ display: "flex", gap: 14, flexWrap: "wrap", opacity: 1 - out }}
    >
      {items.map((it, i) => {
        const s = enter(frame, start + i * 8, 18, POP);
        return (
          <div
            key={it.name}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 12,
              padding: "12px 22px 12px 14px",
              borderRadius: 99,
              background: C.surface,
              border: `1px solid ${C.line}`,
              fontFamily: MONO,
              fontSize: size,
              letterSpacing: "0.12em",
              textTransform: "uppercase",
              color: C.ink,
              scale: `${0.7 + 0.3 * s}`,
              opacity: Math.min(1, s * 1.5),
              transformOrigin: "left center",
            }}
          >
            <span
              style={{
                width: size * 0.9,
                height: size * 0.9,
                borderRadius: 99,
                background: it.color,
                boxShadow: `0 0 0 4px ${it.color}22`,
              }}
            />
            {it.name}
          </div>
        );
      })}
    </div>
  );
};
