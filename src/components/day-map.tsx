import type { CSSProperties } from "react";
import type { Mode, Point } from "@/lib/sample-day";

// A made-up city, the same as the app's welcome art: no real places.
// Drawn in the art's 1024 × 1024 space; the sample day uses the same space.
const LABEL_FONT =
  "-apple-system, BlinkMacSystemFont, 'SF Pro Text', Geist, system-ui, sans-serif";

function City({ labels }: { labels: boolean }) {
  return (
    <g>
      <defs>
        {/* Building footprints, two grains so blocks don't read as a tile */}
        <pattern
          id="city-bld"
          width="64"
          height="64"
          patternUnits="userSpaceOnUse"
        >
          <g fill="#EAE6DC" stroke="#DED9CD" strokeWidth="1">
            <rect x="5" y="5" width="22" height="15" rx="2" />
            <rect x="31" y="5" width="27" height="21" rx="2" />
            <rect x="5" y="25" width="15" height="28" rx="2" />
            <rect x="24" y="31" width="13" height="22" rx="2" />
            <rect x="41" y="31" width="17" height="12" rx="2" />
            <rect x="41" y="47" width="17" height="10" rx="2" />
          </g>
        </pattern>
        <pattern
          id="city-bld2"
          width="48"
          height="48"
          patternUnits="userSpaceOnUse"
          patternTransform="rotate(14)"
        >
          <g fill="#EAE6DC" stroke="#DED9CD" strokeWidth="1">
            <rect x="4" y="4" width="18" height="18" rx="2" />
            <rect x="26" y="4" width="18" height="10" rx="2" />
            <rect x="26" y="18" width="18" height="26" rx="2" />
            <rect x="4" y="26" width="18" height="18" rx="2" />
          </g>
        </pattern>
        <pattern
          id="city-trees"
          width="22"
          height="22"
          patternUnits="userSpaceOnUse"
        >
          <circle cx="6" cy="6" r="4" fill="#CFE0C4" />
          <circle cx="17" cy="15" r="3.5" fill="#CFE0C4" />
        </pattern>
      </defs>

      {/* City fabric */}
      <rect x="-1024" y="-1024" width="3072" height="3072" fill="#F4F2EC" />
      <rect
        x="-1024"
        y="-1024"
        width="3072"
        height="3072"
        fill="url(#city-bld)"
      />
      <path
        d="M-1024 560 L0 560 C 200 600, 380 680, 560 640 C 700 610, 820 640, 1024 600 L 2048 600 L 2048 2048 L -1024 2048 Z"
        fill="url(#city-bld2)"
      />
      <path
        d="M-1024 560 L0 560 C 200 600, 380 680, 560 640 C 700 610, 820 640, 1024 600 L 2048 600 L 2048 2048 L -1024 2048 Z"
        fill="#F4F2EC"
        fillOpacity="0.45"
      />

      {/* Parks */}
      {[
        "M400 90 C 480 60, 620 70, 650 140 C 680 210, 600 250, 520 240 C 440 230, 360 160, 400 90 Z",
        "M560 760 C 640 720, 760 740, 800 800 C 840 870, 760 930, 660 920 C 560 910, 500 820, 560 760 Z",
        "M40 760 C 110 730, 200 760, 210 830 C 220 900, 140 930, 80 910 C 20 890, -10 790, 40 760 Z",
      ].map((d) => (
        <g key={d}>
          <path d={d} fill="#DDE8D3" />
          <path d={d} fill="url(#city-trees)" />
        </g>
      ))}
      <path
        d="M610 820 C 640 800, 700 806, 712 836 C 724 866, 680 884, 646 878 C 610 872, 590 840, 610 820 Z"
        fill="#C9DCEB"
      />

      {/* River */}
      <g fill="none" strokeLinecap="round">
        <path
          d="M-1024 600 L-30 520 C 180 450, 380 600, 560 540 S 860 430, 1054 500 L 2048 560"
          stroke="#C9DCEB"
          strokeWidth="78"
        />
        <path
          d="M-1024 600 L-30 520 C 180 450, 380 600, 560 540 S 860 430, 1054 500 L 2048 560"
          stroke="#D5E4F0"
          strokeWidth="40"
        />
      </g>

      {/* Minor streets */}
      <g fill="none" stroke="#FFFFFF" strokeWidth="7" strokeLinecap="round">
        {[
          "M-20 140 C 200 130, 360 160, 400 170",
          "M650 180 C 780 170, 900 190, 1044 170",
          "M-20 380 C 120 370, 200 360, 270 362",
          "M330 220 C 520 250, 620 260, 740 240",
          "M820 230 C 900 260, 960 250, 1044 260",
          "M120 -20 C 140 120, 110 260, 130 470",
          "M520 250 C 530 340, 500 420, 520 520",
          "M640 260 C 650 340, 630 400, 640 480",
          "M920 -20 C 900 140, 940 300, 920 460",
          "M-20 660 C 140 650, 300 690, 420 700",
          "M420 600 C 440 700, 400 820, 430 1044",
          "M140 600 C 160 700, 230 760, 220 1044",
          "M860 560 C 880 680, 860 820, 900 1044",
          "M300 860 C 420 880, 500 860, 560 850",
          "M820 960 C 900 950, 960 960, 1044 950",
        ].map((d) => (
          <path key={d} d={d} />
        ))}
      </g>

      {/* Arterials, cased; where they meet the river they read as bridges */}
      {["#E2DDD1", "#FFFFFF"].map((stroke, i) => (
        <g
          key={stroke}
          fill="none"
          stroke={stroke}
          strokeWidth={i ? 16 : 22}
          strokeLinecap="round"
        >
          <path d="M-1024 300 L-20 300 C 300 260, 640 360, 1044 290 L 2048 290" />
          <path d="M-1024 720 L-20 720 C 340 760, 700 670, 1044 740 L 2048 740" />
          <path d="M300 -1024 L300 -20 C 330 300, 250 700, 320 1044 L 320 2048" />
          <path d="M760 -1024 L760 -20 C 730 300, 820 700, 760 1044 L 760 2048" />
        </g>
      ))}

      {/* Rail line */}
      <g fill="none">
        <path
          d="M-1024 410 L-20 406 C 120 400, 200 398, 290 398 C 400 400, 520 440, 640 432 C 780 422, 900 390, 1044 380 L 2048 370"
          stroke="#FFFFFF"
          strokeWidth="9"
        />
        <path
          d="M-1024 410 L-20 406 C 120 400, 200 398, 290 398 C 400 400, 520 440, 640 432 C 780 422, 900 390, 1044 380 L 2048 370"
          stroke="#B9B4A8"
          strokeWidth="3"
          strokeDasharray="10 6"
        />
      </g>

      {/* Points of interest */}
      <g fill="#BDB8AC">
        {[
          [210, 180],
          [440, 330],
          [580, 300],
          [860, 330],
          [200, 640],
          [500, 700],
          [880, 660],
          [380, 900],
          [960, 880],
        ].map(([cx, cy]) => (
          <circle key={`${cx},${cy}`} cx={cx} cy={cy} r="5" />
        ))}
      </g>

      {labels && (
        <>
          <g
            fontFamily={LABEL_FONT}
            fontSize="15"
            fontWeight="500"
            letterSpacing="3.5"
            fill="#1B1B19"
            fillOpacity="0.32"
          >
            <text x="520" y="120">
              NORTH PARK
            </text>
            <text x="70" y="600">
              OLD TOWN
            </text>
            <text x="840" y="140">
              HILLSIDE
            </text>
            <text x="600" y="980">
              SOUTH GARDENS
            </text>
          </g>
          <text
            fontFamily={LABEL_FONT}
            fontSize="14"
            fontStyle="italic"
            letterSpacing="2"
            fill="#5D88AA"
            fillOpacity="0.75"
            x="380"
            y="568"
            transform="rotate(-6 380 568)"
          >
            River
          </text>
        </>
      )}
    </g>
  );
}

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
  className?: string;
};

/** The sample day on the made-up city, fitted to `fit` and cropped to fill its box. */
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
  fit: Point[];
  padding: number | [number, number, number, number];
  fontSize?: number;
  strokeScale?: number;
  labels?: boolean;
  routes?: MapRoute[];
  pins?: MapPin[];
}) {
  const fs = fontSize;
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
      <g
        transform={`translate(${ox.toFixed(1)} ${oy.toFixed(1)}) scale(${scale.toFixed(4)})`}
      >
        <City labels={labels} />
      </g>
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
