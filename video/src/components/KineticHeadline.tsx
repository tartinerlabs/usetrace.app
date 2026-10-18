import type React from "react";
import { useCurrentFrame } from "remotion";
import { CALM, enter } from "../motion";
import { C, headline } from "../theme";

type Props = {
  lines: string[];
  start: number; // local frame the first word starts
  size: number;
  color?: string;
  stagger?: number; // frames between words
  duration?: number; // entrance length per word
  align?: "left" | "center";
  exitAt?: number; // local frame the words start to leave
  accent?: { word: string; color: string };
  style?: React.CSSProperties;
};

// Sentence-case headline. Each word rises out of a mask on a calm spring.
export const KineticHeadline: React.FC<Props> = ({
  lines,
  start,
  size,
  color = C.ink,
  stagger = 4,
  duration = 18,
  align = "left",
  exitAt,
  accent,
  style,
}) => {
  const frame = useCurrentFrame();
  let index = 0;
  return (
    <div style={{ ...headline(size, color), textAlign: align, ...style }}>
      {lines.map((line, li) => (
        <div
          key={li}
          style={{
            display: "block",
            overflow: "hidden",
            // room for descenders and the tight leading
            paddingBottom: size * 0.14,
            marginBottom: -size * 0.14,
            whiteSpace: "nowrap",
          }}
        >
          {line.split(" ").map((word, wi) => {
            const i = index++;
            const t = enter(frame, start + i * stagger, duration, CALM);
            const out =
              exitAt === undefined ? 0 : enter(frame, exitAt + i * 2, 14, CALM);
            return (
              <span
                key={wi}
                style={{
                  display: "inline-block",
                  translate: `0 ${(1 - t) * 130 - out * 40}%`,
                  opacity: Math.min(t * 1.6, 1) * (1 - out),
                  marginRight: "0.24em",
                  color:
                    accent && word === accent.word ? accent.color : undefined,
                }}
              >
                {word}
              </span>
            );
          })}
        </div>
      ))}
    </div>
  );
};
