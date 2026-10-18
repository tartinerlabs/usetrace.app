import type React from "react";
import { Feature } from "../components/Feature";
import { PlacePins } from "../components/Motifs";
import type { Layout } from "../layout";
import { C } from "../theme";

// S6 · 1650-1950
export const S6Places: React.FC<{ layout: Layout }> = ({ layout }) => (
  <Feature
    layout={layout}
    eyebrow="Places"
    dot={C.place}
    lines={["The places", "in your life."]}
  >
    <PlacePins
      start={40}
      size={layout.orientation === "portrait" ? 24 : 22}
      exitAt={284}
    />
  </Feature>
);
