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

// A day out in Singapore. Every place is a public landmark, so the sample
// shows no one's home or work.
export const SAMPLE_DAY: DayPart[] = [
  { kind: "place", name: "Marina Bay Sands", minutes: 485 },
  { kind: "walk", name: "Walk", minutes: 7 },
  { kind: "place", name: "Gardens by the Bay", minutes: 78 },
  { kind: "walk", name: "Walk", minutes: 7 },
  { kind: "train", name: "The morning train", minutes: 19 },
  { kind: "walk", name: "Walk", minutes: 8 },
  { kind: "place", name: "Botanic Gardens", minutes: 156 },
  { kind: "drive", name: "Drive", minutes: 30 },
  { kind: "place", name: "Jewel Changi", minutes: 275 },
  { kind: "drive", name: "Drive", minutes: 20 },
  { kind: "place", name: "East Coast Park", minutes: 125 },
  { kind: "drive", name: "Drive", minutes: 20 },
  { kind: "place", name: "Marina Bay Sands", minutes: 210 },
];

/** A point on the map of Singapore: 2048 units to a degree, from 103.6° E and 1.48° N. */
export type Point = [x: number, y: number];
export type Mode = "walk" | "train" | "drive";

const at = (lat: number, lng: number): Point => [
  (lng - 103.6) * 2048,
  (1.48 - lat) * 2048,
];

/** The latitude and longitude of a map point. */
export const toLatLng = ([x, y]: Point): [lat: number, lng: number] => [
  1.48 - y / 2048,
  103.6 + x / 2048,
];

export const MARINA_BAY_SANDS = at(1.284, 103.8603);
export const GARDENS_BY_THE_BAY = at(1.2816, 103.864);
export const BOTANIC_GARDENS = at(1.3175, 103.8155);
export const JEWEL_CHANGI = at(1.3602, 103.9898);
export const EAST_COAST_PARK = at(1.3048, 103.923);
const BAYFRONT = at(1.2818, 103.859);
const BOTANIC_GARDENS_STATION = at(1.3224, 103.8153);

// The routes of the day, in order. The train follows the Downtown Line.
export const JOURNEYS: { mode: Mode; points: Point[]; opacity?: number }[] = [
  {
    mode: "walk",
    points: [
      MARINA_BAY_SANDS,
      at(1.2832, 103.8618),
      at(1.2824, 103.863),
      GARDENS_BY_THE_BAY,
    ],
  },
  {
    mode: "walk",
    points: [GARDENS_BY_THE_BAY, at(1.2817, 103.862), BAYFRONT],
  },
  {
    mode: "train",
    points: [
      BAYFRONT,
      at(1.2934, 103.861),
      at(1.3006, 103.8559),
      at(1.3039, 103.8526),
      at(1.3066, 103.8494),
      at(1.3138, 103.838),
      at(1.32, 103.8259),
      BOTANIC_GARDENS_STATION,
    ],
  },
  {
    mode: "walk",
    points: [BOTANIC_GARDENS_STATION, at(1.3198, 103.8157), BOTANIC_GARDENS],
  },
  {
    mode: "drive",
    points: [
      BOTANIC_GARDENS,
      at(1.3205, 103.814),
      at(1.3235, 103.816),
      at(1.3262, 103.833),
      at(1.328, 103.848),
      at(1.33, 103.865),
      at(1.333, 103.885),
      at(1.3365, 103.91),
      at(1.3395, 103.935),
      at(1.343, 103.96),
      at(1.348, 103.978),
      at(1.355, 103.986),
      JEWEL_CHANGI,
    ],
  },
  {
    mode: "drive",
    points: [
      JEWEL_CHANGI,
      at(1.354, 103.988),
      at(1.343, 103.984),
      at(1.332, 103.979),
      at(1.321, 103.964),
      at(1.313, 103.946),
      at(1.308, 103.933),
      EAST_COAST_PARK,
    ],
  },
  {
    mode: "drive",
    points: [
      EAST_COAST_PARK,
      at(1.3015, 103.91),
      at(1.299, 103.892),
      at(1.296, 103.878),
      at(1.2915, 103.87),
      at(1.2875, 103.865),
      MARINA_BAY_SANDS,
    ],
    // The way back sits back, so the day reads first.
    opacity: 0.5,
  },
];

/** The evening drive from Jewel Changi to East Coast Park: 17:45 to 18:05, 9.5 km. */
export const EVENING_DRIVE = JOURNEYS[5].points;

/** Every point of the day, to fit a map to the whole day. */
export const DAY_POINTS = JOURNEYS.flatMap((journey) => journey.points);

/** Stays sit back at reduced opacity so the movement reads first. */
export const STAY_OPACITY = 0.32;
