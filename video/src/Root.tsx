import type React from "react";
import { Composition, Folder } from "remotion";
import { TracePromo } from "./TracePromo";

// Master 1920x1080 and social 1080x1920. Same 52.0 s timeline (3120 frames
// at 60 fps), re-laid-out by the `orientation` prop.
export const RemotionRoot: React.FC = () => {
  return (
    <Folder name="Trace">
      <Composition
        id="TracePromo"
        component={TracePromo}
        durationInFrames={3120}
        fps={60}
        width={1920}
        height={1080}
        defaultProps={{ orientation: "landscape" }}
      />
      <Composition
        id="TracePromoVertical"
        component={TracePromo}
        durationInFrames={3120}
        fps={60}
        width={1080}
        height={1920}
        defaultProps={{ orientation: "portrait" }}
      />
    </Folder>
  );
};
