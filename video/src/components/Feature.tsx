import type React from "react";
import type { Layout } from "../layout";
import { CopyColumn } from "./CopyColumn";
import { Eyebrow } from "./Eyebrow";
import { KineticHeadline } from "./KineticHeadline";

// S4-S6 share one shape: eyebrow, a two-line headline, one small motif.
// Each scene is 300 frames (two bars); copy leaves 14 frames before the cut,
// and the eyebrow lands on the bar line so the column is never empty.

export const Feature: React.FC<{
  layout: Layout;
  eyebrow: string;
  dot: string;
  lines: string[];
  children: React.ReactNode;
}> = ({ layout, eyebrow, dot, lines, children }) => {
  const portrait = layout.orientation === "portrait";
  return (
    <CopyColumn layout={layout} gap={portrait ? 30 : 40}>
      <Eyebrow start={0} exitAt={286} size={layout.type.eyebrow} dot={dot}>
        {eyebrow}
      </Eyebrow>
      <KineticHeadline
        lines={lines}
        start={14}
        stagger={5}
        size={layout.type.headline}
        exitAt={284}
      />
      <div style={{ marginTop: portrait ? 4 : 16 }}>{children}</div>
    </CopyColumn>
  );
};
