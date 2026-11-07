import type { CSSProperties } from "react";
import type { Mode, Point } from "@/lib/sample-day";

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
  points: Point[];
  opacity?: number;
  /** Draws the route in once, after `delay` seconds over `duration` seconds. */
  draw?: { delay: number; duration: number };
};

export type MapPin = {
  at: Point;
  label?: string;
  side?: "l" | "r" | "u" | "d";
  radius?: number;
  fill?: string;
  /** Fades the pin in after `delay` seconds. */
  delay?: number;
};

/** A map's box, and the points it fits inside its padding. */
export type MapView = {
  width: number;
  height: number;
  fit: Point[];
  padding: number | [number, number, number, number];
};

/** How a view maps sample-day points into its box: x' = ox + x × scale. */
export function fitView({ width, height, fit, padding }: MapView) {
  const xs = fit.map((p) => p[0]);
  const ys = fit.map((p) => p[1]);
  const left = Math.min(...xs);
  const right = Math.max(...xs);
  const top = Math.min(...ys);
  const bottom = Math.max(...ys);
  const [pt, pr, pb, pl] =
    typeof padding === "number"
      ? [padding, padding, padding, padding]
      : padding;
  const innerWidth = width - pl - pr;
  const innerHeight = height - pt - pb;
  const scale = Math.min(
    innerWidth / (right - left),
    innerHeight / (bottom - top),
  );
  const ox = pl + (innerWidth - (right - left) * scale) / 2 - left * scale;
  const oy = pt + (innerHeight - (bottom - top) * scale) / 2 - top * scale;
  return { scale, ox, oy };
}

/**
 * The sample day, fitted to `fit` and cropped to fill its box. With `snapshot`,
 * an Apple Maps image of exactly the box sits behind the routes.
 */
export function DayMap({
  fontSize = 13,
  strokeScale = 1,
  routes = [],
  pins = [],
  snapshot,
  ...view
}: MapView & {
  fontSize?: number;
  strokeScale?: number;
  routes?: MapRoute[];
  pins?: MapPin[];
  snapshot?: string;
}) {
  const { width, height } = view;
  const fs = fontSize;
  const { scale, ox, oy } = fitView(view);
  const project = (p: Point) => [ox + p[0] * scale, oy + p[1] * scale];
  const path = (points: Point[]) =>
    points
      .map(
        (p, i) =>
          (i ? "L" : "M") +
          project(p)
            .map((v) => v.toFixed(1))
            .join(" "),
      )
      .join("");

  return (
    <svg
      viewBox={`0 0 ${width} ${height}`}
      preserveAspectRatio="xMidYMid slice"
      aria-hidden="true"
      className="absolute inset-0 block size-full"
    >
      {snapshot ? (
        <image
          href={snapshot}
          width={width}
          height={height}
          preserveAspectRatio="none"
        />
      ) : (
        <rect width={width} height={height} fill="#e8f2f4" />
      )}
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
          <g
            // biome-ignore lint/suspicious/noArrayIndexKey: fixed order of the day
            key={i}
            className={pin.delay === undefined ? undefined : "stop-in"}
            style={
              pin.delay === undefined
                ? undefined
                : ({ "--stop-delay": `${pin.delay}s` } as CSSProperties)
            }
          >
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
                    fontFamily: "inherit",
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
