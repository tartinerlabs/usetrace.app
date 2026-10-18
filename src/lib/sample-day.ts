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
  { kind: "place", name: "Home", minutes: 462 },
  { kind: "walk", name: "Walk", minutes: 6 },
  { kind: "train", name: "Downtown Line", minutes: 32 },
  { kind: "walk", name: "Walk", minutes: 7 },
  { kind: "place", name: "Work", minutes: 238 },
  { kind: "walk", name: "Walk", minutes: 14 },
  { kind: "place", name: "Marina Bay Sands", minutes: 45 },
  { kind: "walk", name: "Walk", minutes: 14 },
  { kind: "place", name: "Work", minutes: 277 },
  { kind: "drive", name: "Drive", minutes: 28 },
  { kind: "place", name: "Jewel Changi Airport", minutes: 89 },
  { kind: "drive", name: "Drive", minutes: 30 },
  { kind: "place", name: "Home", minutes: 198 },
];

/** Totals of the sample day, as the Today screen shows them. */
export const DAY_TOTALS = { km: 54.8, minutesInMotion: 129, places: 4 };

export type LatLng = [number, number];
export type Mode = "walk" | "train" | "drive";

export const HOME: LatLng = [1.353, 103.948];
export const WORK: LatLng = [1.279, 103.8505];
export const MARINA_BAY_SANDS: LatLng = [1.2834, 103.8607];
export const JEWEL: LatLng = [1.3602, 103.9894];
const BEDOK: LatLng = [1.3546, 103.9453];
const DOWNTOWN: LatLng = [1.2793, 103.8528];

// The routes of the day, in order.
export const JOURNEYS: { mode: Mode; points: LatLng[] }[] = [
  { mode: "walk", points: [HOME, [1.3536, 103.947], BEDOK] },
  {
    mode: "train",
    points: [
      BEDOK,
      [1.3456, 103.9384],
      [1.3365, 103.933],
      [1.3348, 103.918],
      [1.3349, 103.9089],
      [1.33, 103.899],
      [1.3263, 103.89],
      [1.3268, 103.8835],
      [1.3214, 103.8716],
      [1.3139, 103.863],
      [1.3054, 103.8556],
      [1.2985, 103.8505],
      [1.2925, 103.8445],
      [1.2843, 103.8436],
      [1.2821, 103.8485],
      DOWNTOWN,
    ],
  },
  { mode: "walk", points: [DOWNTOWN, [1.2791, 103.8515], WORK] },
  {
    mode: "walk",
    points: [WORK, [1.28, 103.856], [1.2815, 103.859], MARINA_BAY_SANDS],
  },
  {
    mode: "walk",
    points: [MARINA_BAY_SANDS, [1.2815, 103.859], [1.28, 103.856], WORK],
  },
  {
    mode: "drive",
    points: [
      WORK,
      MARINA_BAY_SANDS,
      [1.29, 103.87],
      [1.296, 103.885],
      [1.302, 103.905],
      [1.313, 103.93],
      [1.326, 103.955],
      [1.34, 103.978],
      [1.353, 103.988],
      JEWEL,
    ],
  },
  {
    mode: "drive",
    points: [JEWEL, [1.358, 103.98], [1.356, 103.965], [1.354, 103.955], HOME],
  },
];

/** Every point of the day, to fit a map to the whole day. */
export const DAY_POINTS = JOURNEYS.flatMap((journey) => journey.points);

/** Stays sit back at reduced opacity so the movement reads first. */
export const STAY_OPACITY = 0.32;
