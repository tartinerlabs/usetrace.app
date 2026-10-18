import type React from "react";
import { interpolate, useCurrentFrame } from "remotion";
import { enter, SOFT } from "../motion";
import { C, FONT } from "../theme";

export type ChipIcon = "route" | "clock" | "pin";

const Icon: React.FC<{
  kind: ChipIcon;
  size: number;
  color: string;
  draw: number;
}> = ({ kind, size, color, draw }) => {
  const common = {
    fill: "none",
    stroke: color,
    strokeWidth: 2.2,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    pathLength: 1,
    strokeDasharray: 1,
    strokeDashoffset: 1 - draw,
  };
  return (
    <svg width={size} height={size} viewBox="0 0 24 24">
      {kind === "route" ? (
        <>
          <path d="M5 18c4 0 3-6 7-6s3-6 7-6" {...common} />
          <circle cx="5" cy="18" r="2.2" fill={color} opacity={draw} />
          <circle cx="19" cy="6" r="2.2" fill={color} opacity={draw} />
        </>
      ) : kind === "clock" ? (
        <>
          <circle cx="12" cy="12" r="8.5" {...common} />
          <path d="M12 7.5V12l3 2" {...common} />
        </>
      ) : (
        <>
          <path
            d="M12 21s-6.5-6.2-6.5-11a6.5 6.5 0 0 1 13 0c0 4.8-6.5 11-6.5 11z"
            {...common}
          />
          <circle cx="12" cy="10" r="2.3" fill={color} opacity={draw} />
        </>
      )}
    </svg>
  );
};

// White surface pill with a tinted icon, a big value and a quiet label.
// The value counts up to its final number as the chip settles.
export const Chip: React.FC<{
  icon: ChipIcon;
  color: string;
  value: number;
  format: (n: number) => string;
  label: string;
  start: number;
  size: number;
  exitAt?: number;
  style?: React.CSSProperties;
}> = ({ icon, color, value, format, label, start, size, exitAt, style }) => {
  const frame = useCurrentFrame();
  const t = enter(frame, start, 18, SOFT);
  const count = interpolate(frame, [start + 2, start + 40], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: (x) => 1 - (1 - x) ** 4,
  });
  const out = exitAt === undefined ? 0 : enter(frame, exitAt, 14);
  const pad = size * 0.42;
  return (
    <div
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: size * 0.38,
        padding: `${pad * 0.72}px ${pad * 1.15}px ${pad * 0.72}px ${pad * 0.72}px`,
        background: C.surface,
        borderRadius: 999,
        border: `1px solid ${C.line}`,
        boxShadow:
          "0 1px 2px rgba(27,27,25,0.06), 0 12px 32px -12px rgba(27,27,25,0.18)",
        opacity: Math.min(1, t * 1.5) * (1 - out),
        translate: `${(1 - t) * -28}px ${out * -16}px`,
        scale: `${0.94 + 0.06 * t}`,
        transformOrigin: "left center",
        whiteSpace: "nowrap",
        ...style,
      }}
    >
      <div
        style={{
          width: size * 1.3,
          height: size * 1.3,
          borderRadius: 999,
          background: `${color}1a`,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Icon
          kind={icon}
          size={size * 0.8}
          color={color}
          draw={enter(frame, start + 6, 24)}
        />
      </div>
      <div
        style={{
          fontFamily: FONT,
          fontSize: size,
          fontWeight: 600,
          letterSpacing: "-0.035em",
          color: C.ink,
          fontVariantNumeric: "tabular-nums",
          lineHeight: 1,
        }}
      >
        {/* Final value sets the width; the counting value sits on top, so the pill never jitters. */}
        <span style={{ position: "relative", display: "inline-block" }}>
          <span style={{ visibility: "hidden" }}>{format(value)}</span>
          <span style={{ position: "absolute", left: 0, top: 0 }}>
            {format(value * count)}
          </span>
        </span>
        <span
          style={{
            fontWeight: 400,
            color: C.secondary,
            marginLeft: "0.3em",
            letterSpacing: "-0.02em",
          }}
        >
          {label}
        </span>
      </div>
    </div>
  );
};
