"use client";

import { useState } from "react";

const MARK_COLOURS = [
  "var(--walk)",
  "var(--cycle)",
  "var(--train)",
  "var(--drive)",
];

// January 2024 starts on a Monday.
const WEEKDAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
const weekday = (day: number) => WEEKDAYS[(day + 6) % 7];

const MEMORIES: Record<number, [title: string, icon: string]> = {
  1: ["Evening run in the park", "directions_run"],
  2: ["First visit to a new area", "explore"],
  3: ["Lunch at the food market", "restaurant"],
  4: ["Ferry to the island", "directions_boat"],
  5: ["Drinks by the river", "local_bar"],
  7: ["Walk in the park", "park"],
  9: ["Afternoon at the seaside", "beach_access"],
  10: ["Cycle along the coast", "directions_bike"],
  11: ["Trail walk in the hills", "hiking"],
  13: ["Night walk in the old town", "directions_walk"],
  14: ["Haircut in town", "content_cut"],
  15: ["Lunch with friends", "restaurant"],
};

const DAYS = Array.from({ length: 31 }, (_, index) => {
  const day = index + 1;
  const past = day <= 15;
  const marks = past
    ? MARK_COLOURS.filter(
        (_, j) => (day * 7 + j * 3) % 5 < 2 + (j === 0 ? 1 : 0),
      ).slice(0, 3)
    : [];
  return { day, past, marks };
});

/** January in the History tab. Pick a recorded day to see its memory. */
export function HistoryCalendar() {
  const [selected, setSelected] = useState(9);
  const memory = MEMORIES[selected];
  const photos = selected === 9 ? 1 : (selected % 3) + 1;

  return (
    <div className="flex flex-col gap-5 w-full rounded-[28px] bg-surface p-[clamp(20px,3vw,32px)]">
      <div className="font-semibold text-[26px] tracking-[-0.5px]">January</div>
      <div className="grid grid-cols-7 gap-1.5 text-center">
        {["M", "T", "W", "T", "F", "S", "S"].map((initial, index) => (
          <span
            // biome-ignore lint/suspicious/noArrayIndexKey: weekday initials repeat
            key={index}
            className="font-mono text-[11px] text-secondary"
          >
            {initial}
          </span>
        ))}
        {DAYS.map(({ day, past, marks }) => {
          const isSelected = day === selected;
          return (
            <button
              key={day}
              type="button"
              disabled={!past}
              aria-label={`${weekday(day)} ${day} January`}
              aria-pressed={isSelected}
              onClick={() => setSelected(day)}
              className={`flex min-h-11 flex-col items-center justify-center gap-1 rounded-xl font-semibold text-[15px] motion-safe:transition-colors ${
                isSelected
                  ? "bg-ink text-on-ink"
                  : past
                    ? "cursor-pointer text-ink"
                    : "text-[#b5b2a8]"
              }`}
            >
              {day}
              <span className="flex h-1 justify-center gap-0.5">
                {marks.map((colour, j) => (
                  <span
                    key={colour}
                    className="h-1 w-1.5 rounded-sm unreached:scale-x-0 unreached:opacity-0 motion-safe:transition-[opacity,scale] motion-safe:duration-300"
                    style={{
                      background: isSelected ? "var(--on-ink)" : colour,
                      transitionDelay: `${(day * 0.03 + j * 0.05).toFixed(2)}s`,
                    }}
                  />
                ))}
              </span>
            </button>
          );
        })}
      </div>
      <div className="flex items-center gap-3 border-line border-t pt-[18px]">
        <span
          aria-hidden="true"
          className="icon flex size-11 flex-none items-center justify-center rounded-full bg-fill text-[22px] text-walk"
        >
          {memory ? memory[1] : "calendar_today"}
        </span>
        <div aria-live="polite" className="flex min-w-0 flex-col gap-0.5">
          <span className="font-semibold">
            {memory ? memory[0] : "No memories on this day"}
          </span>
          <span className="text-secondary text-sm">
            {memory
              ? `${weekday(selected)} ${selected} Jan · ${photos} photo${photos > 1 ? "s" : ""} · 1 note`
              : `${weekday(selected)} ${selected} Jan · ${2 + (selected % 3)} places`}
          </span>
        </div>
      </div>
    </div>
  );
}
