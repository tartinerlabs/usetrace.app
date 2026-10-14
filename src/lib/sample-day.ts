// The illustrative day that the home page follows: Monday 5 October.

export type Activity = "walk" | "cycle" | "train" | "drive" | "place";

// Route styles mirror the app: dotted walking, dashed cycling, a heavier train line.
export const ACTIVITIES: Record<
  Activity,
  {
    color: string;
    width: number;
    border: "dotted" | "dashed" | "solid";
    icon: string;
    name: string;
  }
> = {
  walk: {
    color: "var(--walk)",
    width: 4,
    border: "dotted",
    icon: "directions_walk",
    name: "Walk",
  },
  cycle: {
    color: "var(--cycle)",
    width: 4,
    border: "dashed",
    icon: "directions_bike",
    name: "Cycle",
  },
  train: {
    color: "var(--train)",
    width: 5,
    border: "solid",
    icon: "train",
    name: "Train",
  },
  drive: {
    color: "var(--drive)",
    width: 4,
    border: "solid",
    icon: "directions_car",
    name: "Drive",
  },
  place: {
    color: "var(--place)",
    width: 4,
    border: "solid",
    icon: "location_on",
    name: "At a place",
  },
};

export type DayPart = { kind: Activity; name: string; minutes: number };

export const SAMPLE_DAY: DayPart[] = [
  { kind: "place", name: "Home", minutes: 480 },
  { kind: "walk", name: "Walk", minutes: 25 },
  { kind: "place", name: "Dempsey Hill", minutes: 60 },
  { kind: "train", name: "Train", minutes: 40 },
  { kind: "place", name: "Office", minutes: 300 },
  { kind: "walk", name: "Walk", minutes: 15 },
  { kind: "place", name: "Home", minutes: 60 },
  { kind: "cycle", name: "Cycle", minutes: 35 },
  { kind: "place", name: "East Coast Park", minutes: 90 },
  { kind: "drive", name: "Drive", minutes: 30 },
  { kind: "place", name: "Home", minutes: 305 },
];

/** Stays sit back at reduced opacity so the movement reads first. */
export const STAY_OPACITY = 0.32;
