// Decorative route lines drawn with the app's map styles. All aria-hidden.

export type Activity = "walk" | "cycle" | "train" | "bus" | "drive" | "flight";

// Mirrors the app's route rendering: dotted walking, dashed cycling,
// a heavier solid train line, long-dash flights, other modes solid.
const ROUTE_STYLES: Record<
  Activity,
  { className: string; width: number; dash?: string }
> = {
  walk: { className: "text-walk", width: 4, dash: "1 7" },
  cycle: { className: "text-cycle", width: 4, dash: "8 6" },
  train: { className: "text-train", width: 5 },
  bus: { className: "text-bus", width: 4 },
  drive: { className: "text-drive", width: 4 },
  flight: { className: "text-flight", width: 4, dash: "12 8" },
};

function strokeProps(activity: Activity) {
  const style = ROUTE_STYLES[activity];
  return {
    stroke: "currentColor",
    strokeWidth: style.width,
    strokeDasharray: style.dash,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    fill: "none",
    vectorEffect: "non-scaling-stroke" as const,
  };
}

/** A gently curving route between two stops, used to thread sections together. */
export function RouteThread({
  activity,
  className = "",
}: {
  activity: Activity;
  className?: string;
}) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 960 64"
      className={`h-auto w-full ${ROUTE_STYLES[activity].className} ${className}`}
    >
      <path
        d="M12 32 C 180 -8, 300 72, 480 32 S 780 -8, 948 32"
        {...strokeProps(activity)}
      />
      <circle
        cx="12"
        cy="32"
        r="6"
        className="fill-canvas"
        stroke="currentColor"
        strokeWidth="3"
      />
      <circle cx="948" cy="32" r="6" fill="currentColor" />
    </svg>
  );
}

/** A short straight sample of a route style, for legends. */
export function RouteSwatch({
  activity,
  className = "",
}: {
  activity: Activity;
  className?: string;
}) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 40 8"
      className={`h-2 w-10 shrink-0 ${ROUTE_STYLES[activity].className} ${className}`}
    >
      <path d="M4 4 H 36" {...strokeProps(activity)} />
    </svg>
  );
}

export type RibbonSegment = {
  id: string;
  kind: Activity | "stay";
  minutes: number;
};

const RIBBON_COLORS: Record<RibbonSegment["kind"], string> = {
  stay: "bg-fill",
  walk: "bg-walk",
  cycle: "bg-cycle",
  train: "bg-train",
  bus: "bg-bus",
  drive: "bg-drive",
  flight: "bg-flight",
};

/** A time-proportional bar of the day, like the Today screen's ribbon. */
export function DayRibbon({
  segments,
  className = "",
}: {
  segments: RibbonSegment[];
  className?: string;
}) {
  return (
    <div aria-hidden="true" className={`flex h-3 w-full gap-0.5 ${className}`}>
      {segments.map((segment) => (
        <span
          key={segment.id}
          className={`min-w-0.5 rounded-full ${RIBBON_COLORS[segment.kind]}`}
          style={{ flexGrow: segment.minutes, flexBasis: 0 }}
        />
      ))}
    </div>
  );
}
