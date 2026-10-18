import { Trail } from "@remotion/motion-blur";
import type React from "react";
import {
  AbsoluteFill,
  Easing,
  interpolate,
  Sequence,
  useCurrentFrame,
} from "remotion";
import { NIGHT_IN, waveEdgeY } from "../components/Backdrop";
import { DeviceFrame, deviceSize } from "../components/DeviceFrame";
import { ScreenChrome, ScreenMedia } from "../components/ScreenMedia";
import type { Layout } from "../layout";
import { CALM, EASE_IO, enter, mix, progress, SOFT } from "../motion";
import { SCREEN_TRACK } from "../timing";

// One continuous iPhone from its rise in S2 (bar 3) to its exit at the end
// card (bar 17). Screen content cuts on bar lines with a short dissolve; the
// phone eases into a new pose at each cut and floats a little in between,
// while the backdrop drifts slower behind it (parallax).

export const DEVICE_RISE = 418;
export const DEVICE_EXIT = 2386;
export const DEVICE_ON = 300;
export const DEVICE_OFF = 2440;
const XFADE = 10;
const WAVE_MASK_FEATHER = 60; // px on screen, matches the backdrop wave's edge

type Pose = { at: number; rotY: number; scale: number; dx: number };

const posesFor = (layout: Layout): Pose[] => {
  const land = layout.orientation === "landscape";
  return [
    { at: 0, rotY: -7, scale: 1, dx: 0 },
    { at: 600, rotY: -3, scale: 1, dx: 0 },
    { at: 1050, rotY: 5, scale: 1.0, dx: land ? -12 : 0 },
    { at: 1350, rotY: -4, scale: 1.0, dx: 0 },
    { at: 1650, rotY: 5, scale: 1.0, dx: land ? -12 : 0 },
    { at: 1950, rotY: 0, scale: 1, dx: land ? 150 : 0 },
  ];
};

export const DeviceTrack: React.FC<{ layout: Layout }> = ({ layout }) => {
  const frame = useCurrentFrame();
  if (frame < DEVICE_ON || frame >= DEVICE_OFF) return null;
  // Motion blur only on the fast rise; the rig reads its own frame so each
  // trail layer is drawn at its own moment.
  if (frame >= DEVICE_RISE && frame < DEVICE_RISE + 40) {
    return (
      <Trail layers={6} lagInFrames={0.5} trailOpacity={0.45}>
        <PhoneRig layout={layout} />
      </Trail>
    );
  }
  return <PhoneRig layout={layout} />;
};

const PhoneRig: React.FC<{ layout: Layout }> = ({ layout }) => {
  const frame = useCurrentFrame();
  const d = deviceSize(layout.screenH);
  const { height: H } = layout;

  let pose = posesFor(layout)[0];
  for (const next of posesFor(layout).slice(1)) {
    const t = enter(frame, next.at, 40, CALM);
    if (t <= 0) break;
    pose = {
      at: next.at,
      rotY: mix(pose.rotY, next.rotY, t),
      scale: mix(pose.scale, next.scale, t),
      dx: mix(pose.dx, next.dx, t),
    };
  }
  // S3 gentle push-in, eased out again into S4.
  const push =
    0.05 *
    progress(frame, 600, 1050, EASE_IO) *
    (1 - enter(frame, 1050, 40, CALM));

  const rise = enter(frame, DEVICE_RISE, 44, SOFT);
  const out = enter(frame, DEVICE_EXIT, 28, CALM);
  const y =
    mix(H + d.h / 2 + 80, layout.device.y, rise) +
    Math.sin((frame - DEVICE_RISE) / 75) * 5 * rise +
    out * (H * 0.7);
  const rotX = 2.2 * Math.sin(frame / 120) + (1 - rise) * 14;

  // S7: the night wave turns the screen over where its edge crosses the
  // phone. Work out that edge in the screen's own (unscaled) coordinates; the
  // small 3D tilt is ignored, the feather hides the difference.
  const scale = pose.scale + push;
  const sw = d.screenW * scale;
  const sh = d.screenH * scale;
  const sLeft = layout.device.x + pose.dx - sw / 2;
  const sTop = y - sh / 2;
  const edge = (gx: number) =>
    (waveEdgeY(frame, layout.width, layout.height, gx) - sTop) / scale;
  const yl = edge(sLeft);
  const yr = edge(sLeft + sw);
  const covered = interpolate(
    (yl + yr) / 2,
    [-WAVE_MASK_FEATHER, d.screenH + WAVE_MASK_FEATHER],
    [1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
  );
  const waveMask = waveRevealMask(
    d.screenW,
    d.screenH,
    yl,
    yr,
    WAVE_MASK_FEATHER / scale,
  );
  const night =
    frame < NIGHT_IN
      ? 0
      : covered *
        interpolate(frame, [2400, 2440], [1, 0], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
        });

  const phone = (
    <DeviceFrame screenH={layout.screenH} night={night}>
      {SCREEN_TRACK.map((s) => (
        <Sequence
          key={`${s.clip}-${s.kind}-${s.from}`}
          name={`screen: ${s.clip}.${s.kind}${s.trim !== undefined ? ` @${s.trim}s` : ""}`}
          from={s.from}
          durationInFrames={s.to - s.from}
          layout="absolute-fill"
        >
          <ScreenFade
            fade={Boolean(s.fade)}
            push={s.push ?? 0}
            length={s.to - s.from}
            mask={s.wave && frame < NIGHT_IN + 120 ? waveMask : undefined}
            chrome={
              s.chrome ? (
                <ScreenChrome {...s.chrome} screenW={d.screenW} />
              ) : null
            }
          >
            <ScreenMedia
              clip={s.clip}
              kind={s.kind}
              trim={s.trim}
              playbackRate={s.rate}
            />
          </ScreenFade>
        </Sequence>
      ))}
    </DeviceFrame>
  );

  return (
    <AbsoluteFill style={{ opacity: 1 - Math.min(1, out * 1.4) }}>
      <div
        style={{
          position: "absolute",
          left: layout.device.x + pose.dx - d.w / 2,
          top: y - d.h / 2,
          width: d.w,
          height: d.h,
          transform: `perspective(2600px) rotateY(${pose.rotY}deg) rotateX(${rotX}deg) scale(${pose.scale + push})`,
        }}
      >
        {phone}
      </div>
    </AbsoluteFill>
  );
};

// An alpha mask (SVG data URL) that shows the screen below a straight line
// from (0, yl) to (w, yr), feathered by `feather` across the line.
const waveRevealMask = (
  w: number,
  h: number,
  yl: number,
  yr: number,
  feather: number,
) => {
  const len = Math.hypot(w, yr - yl);
  const nx = -(yr - yl) / len; // unit normal, pointing down into the night
  const ny = w / len;
  const mx = w / 2;
  const my = (yl + yr) / 2;
  const f = feather / 2;
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}"><defs><linearGradient id="g" gradientUnits="userSpaceOnUse" x1="${mx - nx * f}" y1="${my - ny * f}" x2="${mx + nx * f}" y2="${my + ny * f}"><stop offset="0" stop-color="#fff" stop-opacity="0"/><stop offset="1" stop-color="#fff"/></linearGradient></defs><rect width="${w}" height="${h}" fill="url(#g)"/></svg>`;
  return `url("data:image/svg+xml;utf8,${encodeURIComponent(svg)}")`;
};

// Dissolve-in, optional push-in and optional wave mask for one screen clip.
// The chrome (status bar, tab bar) sits above the push, so it never moves.
const ScreenFade: React.FC<{
  fade: boolean;
  push: number;
  length: number;
  mask?: string;
  chrome?: React.ReactNode;
  children: React.ReactNode;
}> = ({ fade, push, length, mask, chrome, children }) => {
  const f = useCurrentFrame();
  const o = fade ? progress(f, 0, XFADE, EASE_IO) : 1;
  const s = 1 + push * progress(f, 0, length, Easing.bezier(0.33, 0, 0.67, 1));
  return (
    <AbsoluteFill
      style={{
        opacity: o,
        maskImage: mask,
        maskSize: mask ? "100% 100%" : undefined,
      }}
    >
      <AbsoluteFill
        style={{
          scale: push ? `${s}` : undefined,
          transformOrigin:
            "50% 4%" /* anchored on the status bar so it stays level with the island */,
        }}
      >
        {children}
      </AbsoluteFill>
      {chrome}
    </AbsoluteFill>
  );
};
