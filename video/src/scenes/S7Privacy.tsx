import type React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { Eyebrow } from "../components/Eyebrow";
import type { Layout } from "../layout";
import { CALM, enter, POP } from "../motion";
import { C, headline } from "../theme";

// S7 · 1950-2400 · Privacy (the breakdown). Night palette. Once the night
// wave has passed the copy column (local 22), a small lock closes beside the
// eyebrow (the same lockup as S4-S6: small mark, label centred on it), then
// three lines arrive one by one; each earlier line steps back so the newest
// one leads. Timed to VO7 (starts at local 20; sentences at +0, +136, +210
// and +278 frames).

const LOCKUP_IN = 22;

const LINES = [
  { text: "Stays on your iPhone.", at: 46 },
  { text: "Encrypted.", at: 152 },
  { text: "No account. No streaks.", at: 226 },
];

const Lock: React.FC<{ size: number; close: number; appear: number }> = ({
  size,
  close,
  appear,
}) => (
  <svg
    width={size}
    height={size * 1.15}
    viewBox="0 0 48 56"
    style={{
      overflow: "visible",
      opacity: appear,
      scale: `${0.8 + 0.2 * appear}`,
      transformOrigin: "center",
    }}
  >
    {/* shackle drops 7 units as it closes */}
    <path
      d="M14 26V17a10 10 0 0 1 20 0v9"
      fill="none"
      stroke={C.peach}
      strokeWidth="4.5"
      strokeLinecap="round"
      style={{ translate: `0 ${(1 - close) * -7}px` }}
    />
    <rect x="6" y="24" width="36" height="28" rx="8" fill={C.peach} />
    <circle cx="24" cy="36" r="3.4" fill={C.night} />
    <rect x="22.4" y="37" width="3.2" height="7" rx="1.6" fill={C.night} />
  </svg>
);

export const S7Privacy: React.FC<{ layout: Layout }> = ({ layout }) => {
  const frame = useCurrentFrame();
  const portrait = layout.orientation === "portrait";
  const size = layout.type.privacy;
  const out = enter(frame, 432, 14);
  const es = layout.type.eyebrow;
  const lock = es * 0.95;
  const appear = enter(frame, LOCKUP_IN, 18);
  const close = enter(frame, LOCKUP_IN + 14, 14, POP);
  // A soft pulse of light as the lock closes.
  const ring = interpolate(frame, [LOCKUP_IN + 16, LOCKUP_IN + 54], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill style={{ opacity: 1 - out }}>
      <div
        style={{
          position: "absolute",
          left: layout.copy.x,
          top: portrait ? layout.copy.y : 0,
          height: portrait ? undefined : layout.height,
          display: "flex",
          flexDirection: "column",
          justifyContent: portrait ? "flex-start" : "center",
          gap: portrait ? 22 : 30,
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: es * 0.6,
            marginBottom: portrait ? 8 : 10,
          }}
        >
          <div style={{ position: "relative", display: "flex" }}>
            <div
              style={{
                position: "absolute",
                left: "50%",
                top: "56%",
                width: lock * 2.2,
                height: lock * 2.2,
                translate: "-50% -50%",
                borderRadius: 999,
                border: `1.5px solid ${C.peach}`,
                opacity: (1 - ring) * 0.6 * (ring > 0 ? 1 : 0),
                scale: `${0.5 + ring * 0.9}`,
              }}
            />
            <Lock size={lock} close={close} appear={appear} />
          </div>
          <Eyebrow start={LOCKUP_IN} size={es} color={C.nightSecondary}>
            Privacy
          </Eyebrow>
        </div>
        {LINES.map((l, i) => {
          const t = enter(frame, l.at, 18, CALM);
          const next = LINES[i + 1];
          const dim = next ? enter(frame, next.at, 20) : 0;
          return (
            <div
              key={l.text}
              style={{
                overflow: "hidden",
                paddingBottom: size * 0.14,
                marginBottom: -size * 0.14,
              }}
            >
              <div
                style={{
                  ...headline(size, C.onNight),
                  whiteSpace: "nowrap",
                  translate: `0 ${(1 - t) * 130}%`,
                  opacity: Math.min(1, t * 1.6) * (1 - dim * 0.55),
                }}
              >
                {l.text}
              </div>
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};
