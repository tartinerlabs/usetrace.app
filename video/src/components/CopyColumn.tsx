import type React from "react";
import { AbsoluteFill } from "remotion";
import type { Layout } from "../layout";

// Where scene copy lives: a left column centred on copy.y in landscape, a top
// band starting at copy.y in portrait (clear of the 220px social top area).
export const CopyColumn: React.FC<{
  layout: Layout;
  gap?: number;
  width?: number;
  children: React.ReactNode;
}> = ({ layout, gap = 28, width, children }) => {
  const landscape = layout.orientation === "landscape";
  return (
    <AbsoluteFill style={{ pointerEvents: "none" }}>
      <div
        style={{
          position: "absolute",
          left: layout.copy.x,
          width: width ?? layout.copy.w,
          top: landscape ? 0 : layout.copy.y,
          height: landscape ? layout.height : undefined,
          display: "flex",
          flexDirection: "column",
          justifyContent: landscape ? "center" : "flex-start",
          alignItems: "flex-start",
          gap,
        }}
      >
        {children}
      </div>
    </AbsoluteFill>
  );
};
