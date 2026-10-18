import type React from "react";
import { Feature } from "../components/Feature";
import { WeekRibbon } from "../components/Motifs";
import type { Layout } from "../layout";
import { C } from "../theme";

// S5 · 1350-1650
export const S5History: React.FC<{ layout: Layout }> = ({ layout }) => (
  <Feature
    layout={layout}
    eyebrow="History"
    dot={C.walk}
    lines={["Days worth", "remembering."]}
  >
    <WeekRibbon
      start={36}
      height={layout.orientation === "portrait" ? 84 : 180}
      exitAt={284}
    />
  </Feature>
);
