// The illustrative day that the home page follows: Tuesday 9 January.

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

// A day out from the city to the sea. The places have everyday names, so the
// sample shows no real home or work.
export const SAMPLE_DAY: DayPart[] = [
  { kind: "place", name: "Home", minutes: 520 },
  { kind: "walk", name: "Walk", minutes: 25 },
  { kind: "train", name: "Train", minutes: 11 },
  { kind: "place", name: "Museum", minutes: 194 },
  { kind: "drive", name: "Drive", minutes: 35 },
  { kind: "place", name: "Seaside", minutes: 155 },
  { kind: "drive", name: "Drive", minutes: 30 },
  { kind: "place", name: "Hilltop gardens", minutes: 130 },
  { kind: "drive", name: "Drive", minutes: 45 },
  { kind: "place", name: "Home", minutes: 295 },
];

/** The totals of the sample day. The distance is illustrative. */
export const DAY_TOTALS = { km: 79.1, motion: "2h 26m", places: 4 };

/** A map point: 2048 units to a degree of latitude, from 9.5° W and 38.85° N. */
export type Point = [x: number, y: number];
export type Mode = "walk" | "train" | "drive";

// A degree of longitude is shorter at this latitude.
const X_SCALE = 2048 * Math.cos((38.72 * Math.PI) / 180);

const at = (lat: number, lng: number): Point => [
  (lng + 9.5) * X_SCALE,
  (38.85 - lat) * 2048,
];

/** The latitude and longitude of a map point. */
export const toLatLng = ([x, y]: Point): [lat: number, lng: number] => [
  38.85 - y / 2048,
  x / X_SCALE - 9.5,
];

export const HOME = at(38.7115, -9.13);
export const STATION = at(38.7062, -9.1447);
export const MUSEUM = at(38.699, -9.2003);
export const SEASIDE = at(38.697, -9.421);
export const GARDENS = at(38.7876, -9.3906);

// The routes of the day, in order. They are illustrative, not exact roads.
export const JOURNEYS: { mode: Mode; points: Point[]; opacity?: number }[] = [
  {
    mode: "walk",
    points: [HOME, at(38.7085, -9.137), STATION],
  },
  {
    mode: "train",
    points: [STATION, at(38.7052, -9.156), at(38.7032, -9.1799), MUSEUM],
  },
  {
    mode: "drive",
    points: [
      MUSEUM,
      at(38.698, -9.23),
      at(38.699, -9.275),
      at(38.688, -9.315),
      at(38.682, -9.335),
      at(38.688, -9.355),
      at(38.703, -9.398),
      SEASIDE,
    ],
  },
  {
    mode: "drive",
    points: [SEASIDE, at(38.725, -9.425), at(38.76, -9.41), GARDENS],
  },
  {
    mode: "drive",
    points: [
      GARDENS,
      at(38.785, -9.34),
      at(38.765, -9.28),
      at(38.752, -9.225),
      at(38.742, -9.17),
      at(38.72, -9.14),
      HOME,
    ],
    // The way back sits back, so the day reads first.
    opacity: 0.5,
  },
];

/** The drive from the seaside up to the hilltop gardens: 15:40 to 16:10, 17.8 km. */
export const HILLS_DRIVE = JOURNEYS[3].points;

/** Every point of the day, to fit a map to the whole day. */
export const DAY_POINTS = JOURNEYS.flatMap((journey) => journey.points);

/** Stays sit back at reduced opacity so the movement reads first. */
export const STAY_OPACITY = 0.32;
