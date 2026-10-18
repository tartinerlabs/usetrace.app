import React from "react";
import { C, FONT } from "../theme";

// The Trace icon, rebuilt from Trace/AppIcon.icon (sun.svg + hill.svg) so each
// part can move: the tile forms, the sun rises, the hill sweeps up.
export const HILL_EDGE = "M-2 70 C30 70 44 50 102 48";
export const HILL_PATH = `${HILL_EDGE} L102 102 L-2 102 Z`;

export const TraceIcon: React.FC<{
  size: number;
  tile?: number; // 0..1 tile scale/opacity
  sun?: number; // 0..1 sun rise
  hill?: number; // 0..1 hill sweep
  dark?: boolean;
  shadow?: number; // 0..1
  sunScale?: number;
  hillOpacity?: number;
  style?: React.CSSProperties;
}> = ({
  size,
  tile = 1,
  sun = 1,
  hill = 1,
  dark = false,
  shadow = 1,
  sunScale = 1,
  hillOpacity = 1,
  style,
}) => {
  const id = React.useId().replace(/:/g, "");
  const bg = dark ? C.night : C.canvas;
  const sunC = dark ? C.peach : C.sun;
  const hillC = dark ? C.hillDark : C.ink;
  return (
    <div
      style={{
        width: size,
        height: size,
        borderRadius: size * 0.2237,
        boxShadow: `0 ${size * 0.08}px ${size * 0.2}px -${size * 0.06}px rgba(27,27,25,${0.28 * shadow * tile}), 0 0 0 1px rgba(27,27,25,${0.07 * tile})`,
        scale: `${0.55 + 0.45 * tile}`,
        ...style,
      }}
    >
      <svg
        width={size}
        height={size}
        viewBox="0 0 100 100"
        style={{ display: "block", overflow: "visible" }}
      >
        <defs>
          <clipPath id={`tile-${id}`}>
            <rect width="100" height="100" rx="22.37" />
          </clipPath>
        </defs>
        <g clipPath={`url(#tile-${id})`}>
          <rect width="100" height="100" fill={bg} opacity={tile} />
          <circle
            cx="62"
            cy={50 + (1 - sun) * 42}
            r={15 * sunScale}
            fill={sunC}
          />
          <path
            d={HILL_PATH}
            fill={hillC}
            opacity={hillOpacity}
            style={{ translate: `0 ${(1 - hill) * 56}px` }}
          />
        </g>
      </svg>
    </div>
  );
};

export const Wordmark: React.FC<{
  size: number;
  reveal: number[]; // per-letter 0..1
  color?: string;
}> = ({ size, reveal, color = C.ink }) => (
  <div
    style={{
      fontFamily: FONT,
      fontWeight: 600,
      fontSize: size,
      letterSpacing: "-0.035em",
      lineHeight: 1,
      color,
      display: "flex",
      overflow: "hidden",
      paddingBottom: size * 0.12,
      marginBottom: -size * 0.12,
    }}
  >
    {"trace".split("").map((ch, i) => (
      <span
        key={i}
        style={{
          display: "inline-block",
          translate: `0 ${(1 - (reveal[i] ?? 1)) * 125}%`,
          opacity: Math.min(1, (reveal[i] ?? 1) * 1.6),
        }}
      >
        {ch}
      </span>
    ))}
  </div>
);
