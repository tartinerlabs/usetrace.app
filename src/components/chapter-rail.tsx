"use client";

import { useEffect, useRef, useState } from "react";
import { ACTIVITIES, type Activity } from "@/lib/sample-day";

/** Subscribes to scroll and resize, at most once per frame. */
export function onScrollFrame(callback: () => void) {
  let frame = 0;
  const schedule = () => {
    if (frame) return;
    frame = requestAnimationFrame(() => {
      frame = 0;
      callback();
    });
  };
  window.addEventListener("scroll", schedule, { passive: true });
  window.addEventListener("resize", schedule);
  callback();
  return () => {
    cancelAnimationFrame(frame);
    window.removeEventListener("scroll", schedule);
    window.removeEventListener("resize", schedule);
  };
}

/**
 * The route line beside a chapter. It fills in the chapter's route style as the
 * chapter scrolls past 60% of the viewport, and its stop fills when reached.
 */
export function ChapterRail({
  activity,
  last = false,
}: {
  activity: Activity;
  last?: boolean;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [progress, setProgress] = useState(0);
  const [reached, setReached] = useState(false);
  const style = ACTIVITIES[activity];

  useEffect(() => {
    const chapter = ref.current?.closest("article");
    if (!chapter) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setProgress(1);
      setReached(true);
      return;
    }
    return onScrollFrame(() => {
      const line = window.innerHeight * 0.6;
      const rect = chapter.getBoundingClientRect();
      const length = Math.max(1, rect.height - 28);
      setProgress(Math.min(1, Math.max(0, (line - rect.top - 28) / length)));
      setReached(line > rect.top + 12);
    });
  }, []);

  const line = {
    left: "50%",
    top: 28,
    bottom: last ? "auto" : 0,
    height: last ? 0 : "auto",
    marginLeft: -style.width / 2,
    borderLeft: `${style.width}px ${style.border} ${style.color}`,
  } as const;

  return (
    <div ref={ref} aria-hidden="true" className="relative">
      <span className="absolute opacity-20" style={line} />
      <span
        className="absolute"
        style={{
          ...line,
          clipPath: `inset(0 0 ${((1 - progress) * 100).toFixed(2)}% 0)`,
        }}
      />
      <span
        className="absolute top-0.5 left-1/2 -ml-[11px] size-[22px] rounded-full border-4 motion-safe:transition-[background-color,transform] motion-safe:duration-300"
        style={{
          borderColor: style.color,
          background: reached ? style.color : "var(--canvas)",
          transform: reached ? undefined : "scale(0.8)",
        }}
      />
    </div>
  );
}
