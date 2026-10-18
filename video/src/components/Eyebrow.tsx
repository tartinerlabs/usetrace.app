import type React from "react";
import { useCurrentFrame } from "remotion";
import { enter } from "../motion";
import { C, eyebrow } from "../theme";

// Mono caps label. Tracking settles from wide to its resting value as it fades in.
export const Eyebrow: React.FC<{
  children: string;
  start: number;
  size: number;
  color?: string;
  exitAt?: number;
  dot?: string; // optional activity-colour dot before the label
  style?: React.CSSProperties;
}> = ({ children, start, size, color = C.secondary, exitAt, dot, style }) => {
  const frame = useCurrentFrame();
  const t = enter(frame, start, 18);
  const out = exitAt === undefined ? 0 : enter(frame, exitAt, 12);
  return (
    <div
      style={{
        ...eyebrow(size, color),
        letterSpacing: `${0.16 + (1 - t) * 0.22}em`,
        opacity: t * (1 - out),
        translate: `0 ${-out * 10}px`,
        display: "flex",
        alignItems: "center",
        gap: size * 0.6,
        whiteSpace: "nowrap",
        ...style,
      }}
    >
      {dot ? (
        <span
          style={{
            width: size * 0.5,
            height: size * 0.5,
            borderRadius: 999,
            background: dot,
            scale: `${t}`,
          }}
        />
      ) : null}
      {children}
    </div>
  );
};
