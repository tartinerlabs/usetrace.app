import type { CSSProperties } from "react";
import type { LatLng, Mode } from "@/lib/sample-day";

// A simplified Singapore: coastline, parks, reservoirs, the airport and expressways.
const COAST: LatLng[] = [
  [1.3, 103.64],
  [1.35, 103.64],
  [1.39, 103.68],
  [1.43, 103.7],
  [1.445, 103.76],
  [1.45, 103.8],
  [1.46, 103.82],
  [1.44, 103.86],
  [1.42, 103.88],
  [1.415, 103.91],
  [1.395, 103.95],
  [1.39, 103.985],
  [1.37, 104.0],
  [1.345, 104.03],
  [1.32, 104.0],
  [1.31, 103.96],
  [1.3, 103.93],
  [1.3, 103.9],
  [1.292, 103.875],
  [1.278, 103.866],
  [1.272, 103.848],
  [1.265, 103.82],
  [1.28, 103.79],
  [1.285, 103.76],
  [1.3, 103.72],
  [1.29, 103.68],
];

const FEATURES: Record<
  "land" | "green" | "water" | "airport" | "runway" | "coastGreen" | "roads",
  LatLng[][]
> = {
  land: [
    [
      [1.462, 103.58],
      [1.466, 103.7],
      [1.47, 103.77],
      [1.472, 103.82],
      [1.458, 103.88],
      [1.446, 103.93],
      [1.436, 103.99],
      [1.432, 104.08],
      [1.75, 104.08],
      [1.75, 103.58],
    ],
    [
      [1.405, 103.93],
      [1.418, 103.95],
      [1.421, 103.98],
      [1.411, 104.005],
      [1.4, 103.985],
      [1.398, 103.952],
    ],
    [
      [1.248, 103.808],
      [1.256, 103.828],
      [1.253, 103.846],
      [1.245, 103.838],
      [1.241, 103.82],
    ],
    [
      [1.258, 103.69],
      [1.272, 103.71],
      [1.268, 103.75],
      [1.255, 103.74],
    ],
  ],
  green: [
    [
      [1.338, 103.775],
      [1.362, 103.778],
      [1.385, 103.786],
      [1.405, 103.805],
      [1.402, 103.826],
      [1.381, 103.836],
      [1.356, 103.834],
      [1.34, 103.818],
    ],
    [
      [1.309, 103.811],
      [1.323, 103.812],
      [1.323, 103.821],
      [1.309, 103.82],
    ],
    [
      [1.346, 103.77],
      [1.356, 103.772],
      [1.356, 103.781],
      [1.346, 103.78],
    ],
    [
      [1.282, 103.862],
      [1.288, 103.864],
      [1.286, 103.872],
      [1.279, 103.869],
    ],
    [
      [1.372, 103.95],
      [1.388, 103.952],
      [1.392, 103.965],
      [1.378, 103.966],
    ],
  ],
  water: [
    [
      [1.342, 103.816],
      [1.351, 103.821],
      [1.349, 103.832],
      [1.34, 103.828],
    ],
    [
      [1.394, 103.795],
      [1.405, 103.808],
      [1.4, 103.82],
      [1.391, 103.807],
    ],
    [
      [1.372, 103.818],
      [1.38, 103.822],
      [1.377, 103.829],
      [1.37, 103.826],
    ],
    [
      [1.279, 103.853],
      [1.29, 103.855],
      [1.288, 103.862],
      [1.28, 103.862],
    ],
  ],
  airport: [
    [
      [1.33, 103.975],
      [1.372, 103.968],
      [1.392, 103.99],
      [1.378, 104.008],
      [1.338, 104.005],
    ],
  ],
  runway: [
    [
      [1.334, 103.985],
      [1.382, 103.978],
    ],
    [
      [1.338, 103.995],
      [1.386, 103.988],
    ],
  ],
  coastGreen: [
    [
      [1.293, 103.88],
      [1.3, 103.905],
      [1.308, 103.935],
      [1.318, 103.96],
    ],
  ],
  roads: [
    [
      [1.335, 103.7],
      [1.341, 103.75],
      [1.337, 103.79],
      [1.326, 103.82],
      [1.331, 103.86],
      [1.336, 103.9],
      [1.346, 103.94],
      [1.356, 103.97],
    ],
    [
      [1.288, 103.842],
      [1.31, 103.846],
      [1.34, 103.846],
      [1.372, 103.842],
      [1.405, 103.836],
    ],
    [
      [1.29, 103.866],
      [1.3, 103.9],
      [1.31, 103.938],
      [1.33, 103.978],
    ],
    [
      [1.36, 103.77],
      [1.4, 103.77],
      [1.44, 103.772],
    ],
    [
      [1.29, 103.68],
      [1.302, 103.75],
      [1.287, 103.8],
      [1.276, 103.84],
    ],
    [
      [1.405, 103.836],
      [1.396, 103.89],
      [1.376, 103.94],
      [1.362, 103.978],
    ],
    [
      [1.336, 103.86],
      [1.36, 103.88],
      [1.395, 103.905],
    ],
    [
      [1.38, 103.7],
      [1.372, 103.745],
      [1.36, 103.77],
    ],
  ],
};

// w: water, g: green, l: land.
const LABELS: [string, number, number, "w" | "g" | "l"][] = [
  ["JOHOR STRAIT", 1.457, 103.8, "w"],
  ["SINGAPORE STRAIT", 1.235, 103.9, "w"],
  ["CENTRAL CATCHMENT", 1.372, 103.805, "g"],
  ["PULAU UBIN", 1.411, 103.968, "l"],
  ["SENTOSA", 1.249, 103.827, "l"],
  ["BUKIT TIMAH", 1.336, 103.795, "l"],
  ["TOA PAYOH", 1.334, 103.85, "l"],
  ["JURONG", 1.335, 103.72, "l"],
  ["WOODLANDS", 1.436, 103.787, "l"],
  ["CHANGI", 1.358, 104.01, "l"],
];

// Route styles mirror the app's map: dotted walking, a heavier train line.
const ROUTE_STYLE: Record<
  Mode,
  { color: string; width: number; dash?: string }
> = {
  walk: { color: "var(--walk)", width: 3, dash: "0.1 6" },
  train: { color: "var(--train)", width: 4.5 },
  drive: { color: "var(--drive)", width: 3.5 },
};

export type MapRoute = {
  mode: Mode;
  points: LatLng[];
  opacity?: number;
  /** Draws the route in once, after `delay` seconds over `duration` seconds. */
  draw?: { delay: number; duration: number };
};

export type MapPin = {
  at: LatLng;
  label?: string;
  side?: "l" | "r" | "u" | "d";
  radius?: number;
  fill?: string;
  className?: string;
};

/** The sample day on a map of Singapore, fitted to `fit` and cropped to fill its box. */
export function DayMap({
  width,
  height,
  fit,
  padding,
  fontSize = 13,
  strokeScale = 1,
  labels = true,
  routes = [],
  pins = [],
}: {
  width: number;
  height: number;
  fit: LatLng[];
  padding: number | [number, number, number, number];
  fontSize?: number;
  strokeScale?: number;
  labels?: boolean;
  routes?: MapRoute[];
  pins?: MapPin[];
}) {
  const fs = fontSize;
  const lats = fit.map((p) => p[0]);
  const lngs = fit.map((p) => p[1]);
  const south = Math.min(...lats);
  const north = Math.max(...lats);
  const west = Math.min(...lngs);
  const east = Math.max(...lngs);
  const [pt, pr, pb, pl] =
    typeof padding === "number"
      ? [padding, padding, padding, padding]
      : padding;
  const innerWidth = width - pl - pr;
  const innerHeight = height - pt - pb;
  const scale = Math.min(
    innerWidth / (east - west),
    innerHeight / (north - south),
  );
  const ox = pl + (innerWidth - (east - west) * scale) / 2;
  const oy = pt + (innerHeight - (north - south) * scale) / 2;
  const project = (p: LatLng) => [
    ox + (p[1] - west) * scale,
    oy + (north - p[0]) * scale,
  ];
  const path = (points: LatLng[], closed = false) =>
    points
      .map(
        (p, i) =>
          (i ? "L" : "M") +
          project(p)
            .map((v) => v.toFixed(1))
            .join(" "),
      )
      .join("") + (closed ? "Z" : "");

  const areas = (
    name: string,
    shapes: LatLng[][],
    style: CSSProperties,
    closed = true,
  ) =>
    shapes.map((shape, i) => (
      <path
        // biome-ignore lint/suspicious/noArrayIndexKey: fixed map features
        key={`${name}${i}`}
        d={path(shape, closed)}
        style={style}
      />
    ));
  const lines = (name: string, shapes: LatLng[][], style: CSSProperties) =>
    areas(
      name,
      shapes,
      {
        fill: "none",
        strokeLinecap: "round",
        strokeLinejoin: "round",
        ...style,
      },
      false,
    );

  return (
    <svg
      viewBox={`0 0 ${width} ${height}`}
      preserveAspectRatio="xMidYMid slice"
      aria-hidden="true"
      className="absolute inset-0 block size-full"
    >
      <rect
        x={-width}
        y={-height}
        width={width * 3}
        height={height * 3}
        fill="#86c3f2"
      />
      <path d={path(COAST, true)} fill="#f7f3ea" />
      {areas("land", FEATURES.land, { fill: "#f0ece2" })}
      {areas("airport", FEATURES.airport, { fill: "#e6ddf3" })}
      {areas("green", FEATURES.green, { fill: "#aee29a" })}
      {areas("water", FEATURES.water, { fill: "#86c3f2" })}
      {lines("coast", FEATURES.coastGreen, {
        stroke: "#aee29a",
        strokeWidth: fs * 0.6,
      })}
      {lines("runway", FEATURES.runway, {
        stroke: "#cfc4e2",
        strokeWidth: fs * 0.22,
      })}
      {lines("casing", FEATURES.roads, {
        stroke: "#e5a72e",
        strokeWidth: fs * 0.42,
      })}
      {lines("road", FEATURES.roads, {
        stroke: "#ffcc4d",
        strokeWidth: fs * 0.28,
      })}
      {labels &&
        LABELS.map(([text, lat, lng, type]) => {
          const [x, y] = project([lat, lng]);
          return (
            <text
              key={text}
              x={x}
              y={y}
              textAnchor="middle"
              dominantBaseline="central"
              style={{
                fontFamily:
                  "-apple-system, BlinkMacSystemFont, 'SF Pro Text', 'Helvetica Neue', sans-serif",
                fontSize: fs * 0.66,
                fontWeight: type === "l" ? 600 : 500,
                letterSpacing: fs * 0.06,
                fill:
                  type === "w"
                    ? "#2d78c2"
                    : type === "g"
                      ? "#2e7a2b"
                      : "#76767b",
                paintOrder: "stroke",
                stroke: type === "w" ? "none" : "rgba(255,255,255,0.8)",
                strokeWidth: fs * 0.18,
              }}
            >
              {text}
            </text>
          );
        })}
      {routes.map((route, i) => {
        const style = ROUTE_STYLE[route.mode];
        const d = path(route.points);
        const drawn = route.draw
          ? ({
              pathLength: 1,
              strokeDasharray: 1,
              className: "route-draw",
              style: {
                "--draw-delay": `${route.draw.delay}s`,
                "--draw-duration": `${route.draw.duration}s`,
              } as CSSProperties,
            } as const)
          : null;
        return (
          // biome-ignore lint/suspicious/noArrayIndexKey: fixed order of the day
          <g key={i} fill="none" strokeLinecap="round" strokeLinejoin="round">
            <path
              d={d}
              stroke="#ffffff"
              strokeWidth={(style.width + 3) * strokeScale}
              opacity={route.opacity ?? 0.9}
              {...drawn}
            />
            <path
              d={d}
              stroke={style.color}
              strokeWidth={style.width * strokeScale}
              strokeDasharray={style.dash}
              opacity={route.opacity ?? 1}
              {...drawn}
            />
          </g>
        );
      })}
      {pins.map((pin, i) => {
        const [x, y] = project(pin.at);
        const labelWidth = pin.label
          ? pin.label.length * fs * 0.56 + fs * 1.5
          : 0;
        const labelHeight = fs * 1.9;
        const labelX =
          pin.side === "u" || pin.side === "d"
            ? x - labelWidth / 2
            : pin.side === "l"
              ? x - fs * 0.9 - labelWidth
              : x + fs * 0.9;
        const labelY =
          pin.side === "u"
            ? y - labelHeight - fs * 0.8
            : pin.side === "d"
              ? y + fs * 0.8
              : y - labelHeight / 2;
        return (
          // biome-ignore lint/suspicious/noArrayIndexKey: fixed order of the day
          <g key={i} className={pin.className}>
            <circle
              cx={x}
              cy={y}
              r={pin.radius ?? fs * 0.42}
              fill={pin.fill ?? "var(--ink)"}
              stroke="#ffffff"
              strokeWidth={fs * 0.22}
            />
            {pin.label && (
              <>
                <rect
                  x={labelX}
                  y={labelY}
                  width={labelWidth}
                  height={labelHeight}
                  rx={labelHeight / 2}
                  fill="#ffffff"
                  style={{ filter: "drop-shadow(0 1px 3px rgba(0,0,0,0.14))" }}
                />
                <text
                  x={labelX + labelWidth / 2}
                  y={labelY + labelHeight / 2}
                  textAnchor="middle"
                  dominantBaseline="central"
                  fontSize={fs}
                  fontWeight={600}
                  fill="var(--ink)"
                  style={{
                    fontFamily: "var(--font-geist), system-ui, sans-serif",
                  }}
                >
                  {pin.label}
                </text>
              </>
            )}
          </g>
        );
      })}
    </svg>
  );
}
