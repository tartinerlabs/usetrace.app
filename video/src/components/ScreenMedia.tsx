import { Video } from "@remotion/media";
import type React from "react";
import { AbsoluteFill, Img, useCurrentFrame } from "remotion";
import { hasSim, type SimClip, simSrc } from "../assets";
import { C, MONO } from "../theme";
import type { ChromeStill } from "../timing";

// Screen background of each still, sampled from the footage.
const CHROME_BG: Record<ChromeStill, string> = {
  today: "#f0efe8",
  "today-dark": "#0b0d11",
  places: "#eeede6",
};

// Geometry in source pixels (1206 x 2622 screen recordings).
const SRC_W = 1206;
const SRC_H = 2622;
const STATUS = { solid: 150, fade: 205 }; // status bar ends ~125
const TABS = { left: 59, right: 1146, top: 2369, bottom: 2548, r: 97 };
const TAB_FADE = { from: 2352, to: 2400 }; // soft fade into the screen background

const fill: React.CSSProperties = {
  position: "absolute",
  inset: 0,
  width: "100%",
  height: "100%",
  objectFit: "cover",
};

// Static status bar and tab bar, re-drawn from a clean still over the moving
// footage (or over a push-in) so scrolled content never runs under 09:41,
// shows through the glass tab bar, or peeks out below it.
export const ScreenChrome: React.FC<{
  top?: ChromeStill;
  tabs?: ChromeStill;
  screenW: number;
}> = ({ top, tabs, screenW }) => {
  const pct = (v: number) => `${(v / SRC_H) * 100}%`;
  return (
    <AbsoluteFill>
      {top && hasSim(top, "png") ? (
        <Img
          src={simSrc(top, "png")}
          style={{
            ...fill,
            maskImage: `linear-gradient(180deg, #000 ${pct(STATUS.solid)}, transparent ${pct(STATUS.fade)})`,
          }}
        />
      ) : null}
      {tabs && hasSim(tabs, "png") ? (
        <>
          <AbsoluteFill
            style={{
              background: `linear-gradient(180deg, transparent ${pct(TAB_FADE.from)}, ${CHROME_BG[tabs]} ${pct(TAB_FADE.to)})`,
            }}
          />
          <Img
            src={simSrc(tabs, "png")}
            style={{
              ...fill,
              clipPath: `inset(${pct(TABS.top)} ${((SRC_W - TABS.right) / SRC_W) * 100}% ${((SRC_H - TABS.bottom) / SRC_H) * 100}% ${(TABS.left / SRC_W) * 100}% round ${(TABS.r / SRC_W) * screenW}px)`,
            }}
          />
        </>
      ) : null}
    </AbsoluteFill>
  );
};

// Simulator footage (or its still) filling the iPhone screen. When the file
// is not in the manifest yet, a quiet skeleton of the app stands in.
export const ScreenMedia: React.FC<{
  clip: SimClip;
  kind: "mp4" | "png";
  trim?: number; // source seconds at the start of the sequence
  playbackRate?: number;
}> = ({ clip, kind, trim = 0, playbackRate = 1 }) => {
  if (hasSim(clip, kind)) {
    return kind === "mp4" ? (
      <Video
        src={simSrc(clip, kind)}
        muted
        trimBefore={Math.round(trim * 60)}
        playbackRate={playbackRate}
        objectFit="cover"
        style={{
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
        }}
      />
    ) : (
      <Img
        src={simSrc(clip, kind)}
        style={{
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
          objectFit: "cover",
        }}
      />
    );
  }
  return <ScreenPlaceholder clip={clip} kind={kind} />;
};

const ScreenPlaceholder: React.FC<{ clip: SimClip; kind: string }> = ({
  clip,
  kind,
}) => {
  const frame = useCurrentFrame();
  const dark = clip === "today-dark";
  const bg = dark ? C.night : C.canvas;
  const card = dark ? C.nightSurface : C.surface;
  const bar = dark ? C.nightLine : C.fill;
  const ink = dark ? C.onNight : C.ink;
  const shimmer = 0.55 + 0.15 * Math.sin(frame / 18);
  const isMap = clip === "journey" || clip === "you" || clip === "places";
  return (
    <AbsoluteFill
      style={{
        background: bg,
        padding: "16% 7% 0",
        gap: "3.2%",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <div
        style={{
          width: "34%",
          height: "1.6%",
          borderRadius: 99,
          background: bar,
          opacity: shimmer,
        }}
      />
      <div
        style={{
          width: "62%",
          height: "3.6%",
          borderRadius: 99,
          background: ink,
          opacity: 0.85,
        }}
      />
      <div
        style={{
          height: isMap ? "38%" : "26%",
          borderRadius: 28,
          background: card,
          position: "relative",
          overflow: "hidden",
          border: `1px solid ${dark ? C.nightLine : C.line}`,
        }}
      >
        <svg
          viewBox="0 0 100 60"
          preserveAspectRatio="none"
          style={{
            position: "absolute",
            inset: 0,
            width: "100%",
            height: "100%",
          }}
        >
          <path
            d="M8 50 C 25 48, 30 20, 50 24 S 78 12, 92 10"
            fill="none"
            stroke={C.train}
            strokeWidth="2.2"
            strokeLinecap="round"
          />
          <path
            d="M8 50 C 20 56, 40 58, 60 50"
            fill="none"
            stroke={C.drive}
            strokeWidth="1.8"
            strokeLinecap="round"
            opacity="0.8"
          />
          <circle cx="8" cy="50" r="2.6" fill={C.place} />
          <circle cx="92" cy="10" r="2.6" fill={C.place} />
        </svg>
      </div>
      {[0.82, 0.64, 0.74, 0.5].map((w, i) => (
        <div
          key={i}
          style={{ display: "flex", alignItems: "center", gap: "4%" }}
        >
          <div
            style={{
              width: "9%",
              aspectRatio: "1",
              borderRadius: 99,
              background: [C.walk, C.train, C.walk, C.drive][i],
              opacity: 0.85,
            }}
          />
          <div
            style={{
              flex: 1,
              display: "flex",
              flexDirection: "column",
              gap: 8,
            }}
          >
            <div
              style={{
                width: `${w * 100}%`,
                height: 12,
                borderRadius: 99,
                background: bar,
                opacity: shimmer,
              }}
            />
            <div
              style={{
                width: `${w * 60}%`,
                height: 10,
                borderRadius: 99,
                background: bar,
                opacity: shimmer * 0.7,
              }}
            />
          </div>
        </div>
      ))}
      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          bottom: "4%",
          textAlign: "center",
          fontFamily: MONO,
          fontSize: 13,
          letterSpacing: "0.14em",
          color: dark ? C.nightSecondary : C.secondary,
          textTransform: "uppercase",
          opacity: 0.8,
        }}
      >
        placeholder · sim/{clip}.{kind}
      </div>
    </AbsoluteFill>
  );
};
