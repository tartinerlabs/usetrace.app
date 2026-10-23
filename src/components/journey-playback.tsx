"use client";

import { useEffect, useRef, useState } from "react";
import { onScrollFrame } from "@/components/chapter-rail";
import { DayMap, type MapView } from "@/components/day-map";
import {
  EVENING_DRIVE as DRIVE,
  EAST_COAST_PARK,
  JEWEL_CHANGI,
  type Point,
} from "@/lib/sample-day";

const PLAY_MS = 9000;

/** The part of `points` from the start to fraction `f` of its length. */
function along(points: Point[], f: number) {
  const lengths = points
    .slice(1)
    .map((p, i) => Math.hypot(p[0] - points[i][0], p[1] - points[i][1]));
  let left = f * lengths.reduce((sum, length) => sum + length, 0);
  const out: Point[] = [points[0]];
  for (const [i, length] of lengths.entries()) {
    const [a, b] = [points[i], points[i + 1]];
    if (left <= length) {
      const r = length ? left / length : 0;
      out.push([a[0] + (b[0] - a[0]) * r, a[1] + (b[1] - a[1]) * r]);
      return out;
    }
    out.push(b);
    left -= length;
  }
  return out;
}

/** Plays the drive along the map. It starts once when its chapter scrolls in. */
export function JourneyPlayback({
  view,
  snapshot,
}: {
  view: MapView;
  snapshot?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const frame = useRef(0);
  const [progress, setProgress] = useState(0);
  const [playing, setPlaying] = useState(false);

  const stop = () => {
    cancelAnimationFrame(frame.current);
    setPlaying(false);
  };

  const play = (from: number) => {
    cancelAnimationFrame(frame.current);
    let start = from >= 1 ? 0 : from;
    let last = performance.now();
    setPlaying(true);
    const step = (now: number) => {
      start = Math.min(1, start + (now - last) / PLAY_MS);
      last = now;
      setProgress(start);
      if (start < 1) frame.current = requestAnimationFrame(step);
      else setPlaying(false);
    };
    frame.current = requestAnimationFrame(step);
  };

  // biome-ignore lint/correctness/useExhaustiveDependencies: start once on mount
  useEffect(() => {
    const chapter = ref.current?.closest("article");
    if (!chapter) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setProgress(0.62);
      return;
    }
    let timer = 0;
    const unsubscribe = onScrollFrame(() => {
      const reached =
        window.innerHeight * 0.6 > chapter.getBoundingClientRect().top + 12;
      if (!timer && reached) timer = window.setTimeout(() => play(0), 500);
    });
    return () => {
      unsubscribe();
      clearTimeout(timer);
      cancelAnimationFrame(frame.current);
    };
  }, []);

  const driven = along(DRIVE, Math.max(0.001, progress));
  const minutes = 17 * 60 + 45 + Math.round(20 * progress);
  const label = `${Math.floor(minutes / 60)}:${String(minutes % 60).padStart(2, "0")} · ${(9.5 * progress).toFixed(1)} KM`;

  return (
    <div
      ref={ref}
      className="overflow-hidden rounded-[32px] border border-line bg-surface"
    >
      <div
        role="img"
        aria-label="Playback of the drive from Jewel Changi to East Coast Park, about two thirds of the way along."
        className="relative aspect-[14/9] bg-canvas"
      >
        <DayMap
          {...view}
          snapshot={snapshot}
          fontSize={14}
          strokeScale={1.6}
          routes={[
            { mode: "drive", points: DRIVE, opacity: 0.28 },
            { mode: "drive", points: driven },
          ]}
          pins={[
            { at: JEWEL_CHANGI, label: "Jewel Changi", side: "u" },
            { at: EAST_COAST_PARK, label: "East Coast Park", side: "d" },
            { at: driven[driven.length - 1], radius: 9, fill: "var(--sun)" },
          ]}
        />
      </div>
      <div className="flex flex-col gap-3.5 border-line border-t px-[clamp(20px,3vw,28px)] pt-5 pb-6">
        <div className="flex items-center gap-3.5">
          <button
            type="button"
            aria-label={playing ? "Pause playback" : "Play journey"}
            onClick={() => (playing ? stop() : play(progress))}
            className="icon flex size-11 flex-none cursor-pointer items-center justify-center rounded-full bg-ink text-[26px] text-canvas motion-safe:transition-colors hover:bg-sun"
          >
            {playing ? "pause" : progress >= 1 ? "replay" : "play_arrow"}
          </button>
          <div className="group relative h-1.5 min-w-0 flex-1 rounded-[3px] bg-fill">
            <span
              className="absolute inset-y-0 left-0 rounded-[3px] bg-sun"
              style={{ width: `${(progress * 100).toFixed(2)}%` }}
            />
            <span
              className="pointer-events-none absolute top-1/2 -mt-2.5 -ml-2.5 size-5 rounded-full border-4 border-sun bg-surface group-has-[input:focus-visible]:outline-2 group-has-[input:focus-visible]:outline-sun group-has-[input:focus-visible]:outline-offset-3 group-has-[input:focus-visible]:outline-solid"
              style={{ left: `${(progress * 100).toFixed(2)}%` }}
            />
            <input
              type="range"
              min={0}
              max={1000}
              value={Math.round(progress * 1000)}
              onChange={(event) => {
                stop();
                setProgress(Number(event.target.value) / 1000);
              }}
              aria-label="Journey time"
              aria-valuetext={label}
              className="absolute inset-x-0 -top-[19px] m-0 h-11 w-full cursor-grab opacity-0"
            />
          </div>
        </div>
        <div className="flex justify-between font-mono text-secondary text-xs">
          <span>17:45 JEWEL</span>
          <span className="text-ink tabular-nums">{label}</span>
          <span>18:05 EAST COAST</span>
        </div>
      </div>
    </div>
  );
}
