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

// The same day as the app's sample: places are named by what they are, not by landmark.
export const SAMPLE_DAY: DayPart[] = [
  { kind: "place", name: "Home", minutes: 462 },
  { kind: "walk", name: "Walk", minutes: 6 },
  { kind: "train", name: "The morning train", minutes: 32 },
  { kind: "walk", name: "Walk", minutes: 7 },
  { kind: "place", name: "Office", minutes: 588 },
  { kind: "drive", name: "Drive", minutes: 28 },
  { kind: "place", name: "Restaurant", minutes: 89 },
  { kind: "drive", name: "Drive", minutes: 30 },
  { kind: "place", name: "Home", minutes: 198 },
];

/** A point on the made-up city of the map, in its 1024 × 1024 space. */
export type Point = [x: number, y: number];
export type Mode = "walk" | "train" | "drive";

// The city is made up, so the map shows no real places.
export const HOME: Point = [250, 250];
export const OFFICE: Point = [700, 330];
export const RESTAURANT: Point = [860, 560];
const HOME_STATION: Point = [290, 398];
const OFFICE_STATION: Point = [640, 432];

// The routes of the day, in order. They follow the streets and the rail line of the map.
export const JOURNEYS: { mode: Mode; points: Point[]; opacity?: number }[] = [
  {
    mode: "walk",
    points: [HOME, [262, 280], [272, 320], [282, 360], HOME_STATION],
  },
  {
    mode: "train",
    points: [
      HOME_STATION,
      [350, 399],
      [400, 401],
      [460, 413],
      [520, 428],
      [580, 435],
      OFFICE_STATION,
    ],
  },
  {
    mode: "walk",
    points: [OFFICE_STATION, [655, 405], [670, 375], [685, 350], OFFICE],
  },
  {
    mode: "drive",
    points: [
      OFFICE,
      [735, 334],
      [758, 355],
      [768, 420],
      [778, 500],
      [800, 550],
      [830, 566],
      RESTAURANT,
    ],
  },
  {
    mode: "drive",
    points: [
      RESTAURANT,
      [890, 515],
      [918, 460],
      [925, 380],
      [930, 302],
      [850, 310],
      [760, 322],
      [640, 318],
      [450, 300],
      [300, 288],
      [270, 272],
      HOME,
    ],
    // The way home sits back, so the morning reads first.
    opacity: 0.5,
  },
];

/** Every point of the day, to fit a map to the whole day. */
export const DAY_POINTS = JOURNEYS.flatMap((journey) => journey.points);

/** Stays sit back at reduced opacity so the movement reads first. */
export const STAY_OPACITY = 0.32;
