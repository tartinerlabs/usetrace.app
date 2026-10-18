import type React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { Eyebrow } from "../components/Eyebrow";
import { KineticHeadline } from "../components/KineticHeadline";
import { TraceIcon, Wordmark } from "../components/TraceIcon";
import type { Layout } from "../layout";
import { CALM, enter, exit, mix, SOFT } from "../motion";

// S2 · 300-600 · Reveal. The sun from S1 lands; the tile forms around it and
// the hill sweeps up. "trace" sets beside it, then the lockup docks into the
// copy column while the iPhone rises in (DeviceTrack).

export const lockupGeometry = (layout: Layout) => {
  const I = layout.lockup.icon;
  const F = I * 0.62; // wordmark size
  const G = I * 0.2; // gap
  const Ww = F * 2.36; // measured width of "trace" in Geist 600 at -0.035em
  const groupW = I + G + Ww;
  return { I, F, G, Ww, groupW };
};

// Where the sun sits at S2 frame 0 (tile at 0.55 scale, centred).
export const iconSunAtStart = (layout: Layout) => {
  const I = layout.lockup.icon;
  return {
    x: layout.width / 2 + 0.12 * I * 0.55,
    y: layout.height / 2,
    r: 0.15 * I * 0.55,
  };
};

export const S2Reveal: React.FC<{ layout: Layout }> = ({ layout }) => {
  const frame = useCurrentFrame();
  const { width: W, height: H } = layout;
  const { I, F, G, groupW } = lockupGeometry(layout);
  const portrait = layout.orientation === "portrait";

  const tile = enter(frame, 0, 22, SOFT);
  const hill = enter(frame, 6, 22, CALM);
  const slide = enter(frame, 26, 24, CALM);
  const dock = enter(frame, 116, 30, CALM);
  const out = exit(frame, 284, 14);

  const s = mix(1, layout.lockup.dockScale, dock);
  const gx = mix(W / 2 - groupW / 2, layout.lockup.dockX, dock);
  const gy = mix(H / 2 - I / 2, layout.lockup.dockY, dock);
  const iconOffset = mix((groupW - I) / 2, 0, slide);

  const dockedTop = layout.lockup.dockY + I * layout.lockup.dockScale;

  return (
    <AbsoluteFill style={{ opacity: out }}>
      <div
        style={{
          position: "absolute",
          left: 0,
          top: 0,
          width: groupW,
          height: I,
          translate: `${gx}px ${gy}px`,
          scale: `${s}`,
          transformOrigin: "0 0",
        }}
      >
        <TraceIcon
          size={I}
          tile={tile}
          hill={hill}
          style={{ position: "absolute", left: iconOffset, top: 0 }}
        />
        <div
          style={{
            position: "absolute",
            left: I + G,
            top: (I - F) / 2 - F * 0.06,
          }}
        >
          <Wordmark
            size={F}
            reveal={[0, 1, 2, 3, 4].map((i) => enter(frame, 34 + i * 3, 18))}
          />
        </div>
      </div>

      {/* centred eyebrow under the lockup */}
      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          top: H / 2 + I / 2 + (portrait ? 64 : 48),
          display: "flex",
          justifyContent: "center",
        }}
      >
        <Eyebrow start={52} exitAt={104} size={layout.type.eyebrow + 2}>
          TRACE · LOCATION TIMELINE
        </Eyebrow>
      </div>

      {/* docked copy */}
      <div
        style={{
          position: "absolute",
          left: layout.copy.x,
          top: dockedTop + (portrait ? 40 : 44),
          display: "flex",
          flexDirection: "column",
          gap: portrait ? 26 : 30,
        }}
      >
        <Eyebrow start={146} size={layout.type.eyebrow}>
          TRACE · LOCATION TIMELINE
        </Eyebrow>
        <KineticHeadline
          lines={["The places you go.", "The routes you take."]}
          start={156}
          stagger={4}
          size={portrait ? 80 : 84}
        />
      </div>
    </AbsoluteFill>
  );
};
