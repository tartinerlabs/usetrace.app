import type React from "react";
import { SCREEN_ASPECT } from "../layout";

// iPhone 18 Pro-style frame drawn in CSS: brushed titanium band, thin black
// bezel, Dynamic Island, side buttons and a faint glass reflection.
// `night` (0..1) cools the titanium and deepens the shadow for dark scenes.
export const deviceSize = (screenH: number) => {
  const screenW = screenH * SCREEN_ASPECT;
  const band = screenW * 0.024;
  const bezel = screenW * 0.03;
  return {
    screenW,
    screenH,
    band,
    bezel,
    w: screenW + 2 * (band + bezel),
    h: screenH + 2 * (band + bezel),
  };
};

export const DeviceFrame: React.FC<{
  screenH: number;
  night?: number;
  children: React.ReactNode;
  style?: React.CSSProperties;
}> = ({ screenH, night = 0, children, style }) => {
  const d = deviceSize(screenH);
  const screenR = d.screenW * 0.14;
  const innerR = screenR + d.bezel;
  const outerR = innerR + d.band;

  const ti =
    night > 0.5
      ? "linear-gradient(135deg,#6d6f73 0%,#3b3d41 22%,#8a8c90 38%,#2c2e32 58%,#5c5e62 78%,#26282b 100%)"
      : "linear-gradient(135deg,#ebe8e1 0%,#b6b2a8 20%,#f6f4ef 36%,#9c988e 56%,#dcd9d1 76%,#8b877e 100%)";

  const button = (
    side: "left" | "right",
    top: number,
    h: number,
  ): React.CSSProperties => ({
    position: "absolute",
    [side]: -d.band * 0.55,
    top: d.h * top,
    width: d.band * 1.2,
    height: d.h * h,
    borderRadius: d.band,
    background: ti,
    boxShadow: "inset 0 0 0 1px rgba(0,0,0,0.12)",
  });

  return (
    <div style={{ position: "relative", width: d.w, height: d.h, ...style }}>
      {/* contact + ambient shadow */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          borderRadius: outerR,
          boxShadow: `0 ${d.h * 0.07}px ${d.h * 0.12}px -${d.h * 0.035}px rgba(27,27,25,${0.32 + night * 0.3}), 0 ${d.h * 0.02}px ${d.h * 0.04}px -${d.h * 0.01}px rgba(27,27,25,${0.22 + night * 0.2})`,
        }}
      />
      <div style={button("left", 0.19, 0.035)} />
      <div style={button("left", 0.265, 0.065)} />
      <div style={button("left", 0.345, 0.065)} />
      <div style={button("right", 0.285, 0.1)} />
      <div style={button("right", 0.56, 0.07)} />
      {/* titanium band */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          borderRadius: outerR,
          background: ti,
          boxShadow:
            "inset 0 0 0 1px rgba(255,255,255,0.45), inset 0 0 3px rgba(0,0,0,0.35)",
        }}
      />
      {/* black bezel */}
      <div
        style={{
          position: "absolute",
          inset: d.band,
          borderRadius: innerR,
          background: "#050506",
          boxShadow: "0 0 0 1px rgba(0,0,0,0.5)",
        }}
      />
      {/* screen */}
      <div
        style={{
          position: "absolute",
          left: d.band + d.bezel,
          top: d.band + d.bezel,
          width: d.screenW,
          height: d.screenH,
          borderRadius: screenR,
          overflow: "hidden",
          background: "#000",
          // forces a clean clip of video layers on rounded corners
          isolation: "isolate",
        }}
      >
        {children}
        {/* Dynamic Island */}
        <div
          style={{
            position: "absolute",
            left: "50%",
            top: d.screenW * 0.028,
            width: d.screenW * 0.31,
            height: d.screenW * 0.092,
            translate: "-50% 0",
            borderRadius: 999,
            background: "#000",
          }}
        />
        {/* glass */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            background:
              "linear-gradient(118deg, rgba(255,255,255,0.10) 0%, rgba(255,255,255,0.03) 28%, rgba(255,255,255,0) 42%)",
            pointerEvents: "none",
          }}
        />
      </div>
    </div>
  );
};
