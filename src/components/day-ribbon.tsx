"use client";

import { useState } from "react";
import { ACTIVITIES, SAMPLE_DAY, STAY_OPACITY } from "@/lib/sample-day";

const clock = (minutes: number) =>
  `${String(Math.floor(minutes / 60) % 24).padStart(2, "0")}:${String(minutes % 60).padStart(2, "0")}`;

const duration = (minutes: number) =>
  minutes >= 60
    ? `${Math.floor(minutes / 60)} h${minutes % 60 ? ` ${minutes % 60} min` : ""}`
    : `${minutes} min`;

const parts = SAMPLE_DAY.reduce<
  {
    label: string;
    kind: (typeof SAMPLE_DAY)[number]["kind"];
    minutes: number;
    start: number;
  }[]
>((acc, part) => {
  const start = acc.length
    ? acc[acc.length - 1].start + acc[acc.length - 1].minutes
    : 0;
  acc.push({
    kind: part.kind,
    minutes: part.minutes,
    start,
    label: `${part.name} · ${clock(start)}–${clock(start + part.minutes)} · ${duration(part.minutes)}`,
  });
  return acc;
}, []);

/** The day as time-proportional colours. Touch, hover or focus a part to name it. */
export function DayRibbon() {
  const [active, setActive] = useState(-1);
  const current = active >= 0 ? parts[active] : null;

  return (
    <>
      <p
        aria-live="polite"
        className="mb-3 flex min-h-7 items-center gap-2.5 font-medium text-[17px]"
      >
        {current && (
          <span
            className="size-3 flex-none rounded-full"
            style={{ background: ACTIVITIES[current.kind].color }}
          />
        )}
        {current
          ? current.label
          : "Touch a colour to see that part of the day."}
      </p>
      <fieldset
        aria-label="Parts of the day"
        className="flex h-[clamp(44px,6vw,64px)] gap-[3px]"
        onMouseLeave={() => setActive(-1)}
      >
        {parts.map((part, index) => (
          <button
            // biome-ignore lint/suspicious/noArrayIndexKey: fixed order of the day
            key={index}
            type="button"
            aria-label={part.label}
            onMouseEnter={() => setActive(index)}
            onFocus={() => setActive(index)}
            onClick={() => setActive(index)}
            className="min-w-[3px] cursor-pointer rounded-lg outline-offset-2 motion-safe:transition-[opacity,transform] motion-safe:duration-200"
            style={{
              flex: `${part.minutes} 1 0`,
              background: ACTIVITIES[part.kind].color,
              opacity:
                (part.kind === "place" ? STAY_OPACITY : 1) *
                (active < 0 || active === index ? 1 : 0.35),
              transform: active === index ? "scaleY(1.12)" : undefined,
            }}
          />
        ))}
      </fieldset>
    </>
  );
}
