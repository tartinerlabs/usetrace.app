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

// A day around Cupertino. Every place is public, so the sample shows no one's
// home or work.
export const SAMPLE_DAY: DayPart[] = [
  { kind: "place", name: "Apple Park", minutes: 485 },
  { kind: "walk", name: "Walk", minutes: 7 },
  { kind: "place", name: "Apple Park Visitor Center", minutes: 78 },
  { kind: "drive", name: "Drive", minutes: 9 },
  { kind: "place", name: "Infinite Loop", minutes: 180 },
  { kind: "drive", name: "Drive", minutes: 12 },
  { kind: "place", name: "Main Street Cupertino", minutes: 280 },
  { kind: "drive", name: "Drive", minutes: 16 },
  { kind: "place", name: "Stevens Creek Reservoir", minutes: 123 },
  { kind: "drive", name: "Drive", minutes: 18 },
  { kind: "place", name: "Apple Park", minutes: 232 },
];

/** The totals of the sample day. The distance is illustrative. */
export const DAY_TOTALS = { km: 18.9, motion: "1h 2m", places: 5 };

/** A map point: 2048 units to a degree of latitude, from 122.2° W and 37.45° N. */
export type Point = [x: number, y: number];
export type Mode = "walk" | "train" | "drive";

// A degree of longitude is shorter at this latitude.
const X_SCALE = 2048 * Math.cos((37.33 * Math.PI) / 180);

const at = (lat: number, lng: number): Point => [
  (lng + 122.2) * X_SCALE,
  (37.45 - lat) * 2048,
];

/** The latitude and longitude of a map point. */
export const toLatLng = ([x, y]: Point): [lat: number, lng: number] => [
  37.45 - y / 2048,
  x / X_SCALE - 122.2,
];

export const APPLE_PARK = at(37.3349, -122.009);
export const VISITOR_CENTER = at(37.3327, -122.0053);
export const INFINITE_LOOP = at(37.3318, -122.0312);
export const MAIN_STREET = at(37.3236, -122.0107);
export const STEVENS_CREEK = at(37.298, -122.079);

// The routes of the day, in order. They are illustrative, not exact roads.
export const JOURNEYS: { mode: Mode; points: Point[]; opacity?: number }[] = [
  {
    mode: "walk",
    points: [APPLE_PARK, at(37.3335, -122.0068), VISITOR_CENTER],
  },
  {
    mode: "drive",
    points: [
      VISITOR_CENTER,
      at(37.3302, -122.008),
      at(37.331, -122.025),
      INFINITE_LOOP,
    ],
  },
  {
    mode: "drive",
    points: [
      INFINITE_LOOP,
      at(37.3235, -122.032),
      at(37.3232, -122.015),
      MAIN_STREET,
    ],
  },
  {
    mode: "drive",
    points: [
      MAIN_STREET,
      at(37.3185, -122.035),
      at(37.312, -122.055),
      at(37.303, -122.068),
      STEVENS_CREEK,
    ],
  },
  {
    mode: "drive",
    points: [
      STEVENS_CREEK,
      at(37.312, -122.075),
      at(37.326, -122.062),
      at(37.335, -122.04),
      at(37.3365, -122.011),
      APPLE_PARK,
    ],
    // The way back sits back, so the day reads first.
    opacity: 0.5,
  },
];

/** The evening drive from Main Street to Stevens Creek Reservoir: 17:31 to 17:47, 7 km. */
export const EVENING_DRIVE = JOURNEYS[3].points;

/** Every point of the day, to fit a map to the whole day. */
export const DAY_POINTS = JOURNEYS.flatMap((journey) => journey.points);

/** Stays sit back at reduced opacity so the movement reads first. */
export const STAY_OPACITY = 0.32;
