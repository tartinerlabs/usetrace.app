import type React from "react";
import { Feature } from "../components/Feature";
import { PlaybackScrubber } from "../components/Motifs";
import type { Layout } from "../layout";
import { C } from "../theme";

// S4 · 1050-1350
export const S4Journey: React.FC<{ layout: Layout }> = ({ layout }) => (
  <Feature
    layout={layout}
    eyebrow="Journey playback"
    dot={C.train}
    lines={["Play back", "any journey."]}
  >
    <PlaybackScrubber
      start={40}
      width={layout.orientation === "portrait" ? 560 : 520}
      exitAt={284}
    />
  </Feature>
);
