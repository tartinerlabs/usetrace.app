import { Easing, interpolate, spring } from "remotion";
import { FPS } from "./timing";

// Motion language: springs only, 12-18 frame entrances, no linear moves.
// `calm` has no overshoot (copy, camera). `pop` has a little life (pins, chips).
export const CALM = { damping: 200, mass: 1, stiffness: 120 } as const;
export const SOFT = { damping: 26, mass: 1, stiffness: 140 } as const;
export const POP = { damping: 14, mass: 0.7, stiffness: 170 } as const;

export const enter = (
  frame: number,
  start: number,
  duration = 16,
  config: { damping: number; mass?: number; stiffness?: number } = CALM,
) =>
  frame < start
    ? 0
    : spring({
        frame: frame - start,
        fps: FPS,
        config,
        durationInFrames: duration,
      });

// 1 -> 0 over `duration` frames, spring-eased.
export const exit = (frame: number, start: number, duration = 14) =>
  1 - enter(frame, start, duration);

// Eased 0..1 over a range, for long camera moves.
export const EASE_IO = Easing.bezier(0.65, 0, 0.35, 1);
export const EASE_OUT = Easing.bezier(0.16, 1, 0.3, 1);

export const progress = (
  frame: number,
  from: number,
  to: number,
  easing: (t: number) => number = EASE_IO,
) =>
  interpolate(frame, [from, to], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing,
  });

export const mix = (a: number, b: number, t: number) => a + (b - a) * t;
