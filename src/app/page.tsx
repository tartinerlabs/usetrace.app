import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import type { CSSProperties, ReactNode } from "react";
import { AppStoreBadge } from "@/components/app-store-badge";
import { ChapterRail } from "@/components/chapter-rail";
import { DayRibbon } from "@/components/day-ribbon";
import { DuoStage } from "@/components/duo-stage";
import {
  ACTIVITIES,
  type Activity,
  SAMPLE_DAY,
  STAY_OPACITY,
} from "@/lib/sample-day";
import {
  APP_STORE_NAME,
  APP_STORE_URL,
  BRAND,
  DESCRIPTION,
  MIN_IOS,
  SITE_URL,
  SUMMARY,
  TAGLINE,
} from "@/lib/site";

export const metadata: Metadata = {
  alternates: { canonical: "/" },
  // openGraph replaces the layout's object, so repeat its fields.
  openGraph: {
    type: "website",
    siteName: BRAND,
    url: "/",
    title: APP_STORE_NAME,
    description: DESCRIPTION,
    locale: "en_US",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  name: APP_STORE_NAME,
  alternateName: BRAND,
  description: DESCRIPTION,
  operatingSystem: `iOS ${MIN_IOS} or later`,
  applicationCategory: "LifestyleApplication",
  url: SITE_URL,
  image: `${SITE_URL}/images/app-icon.png`,
  ...(APP_STORE_URL
    ? { downloadUrl: APP_STORE_URL, installUrl: APP_STORE_URL }
    : {}),
};

const wrap = "mx-auto w-full max-w-[1240px] px-[clamp(20px,5vw,56px)]";
const eyebrow = "font-mono text-secondary text-xs tracking-[1.2px]";
const sectionHeading =
  "text-balance font-semibold text-[clamp(38px,5.2vw,68px)] leading-none tracking-[-0.035em]";
const lead =
  "text-pretty text-[clamp(17px,1.6vw,20px)] text-body leading-normal";
const card = "rounded-[32px] border border-line bg-surface";
const underline =
  "underline decoration-[#c9c4b6] underline-offset-[5px] motion-safe:transition-colors hover:decoration-ink";

function Icon({
  name,
  outline = false,
  className = "",
  style,
}: {
  name: string;
  outline?: boolean;
  className?: string;
  style?: CSSProperties;
}) {
  return (
    <span
      aria-hidden="true"
      className={`icon ${className}`}
      style={outline ? { fontVariationSettings: "'FILL' 0", ...style } : style}
    >
      {name}
    </span>
  );
}

function RibbonStrip({ className }: { className: string }) {
  return (
    <div aria-hidden="true" className={`flex gap-0.5 ${className}`}>
      {SAMPLE_DAY.map((part, index) => (
        <span
          // biome-ignore lint/suspicious/noArrayIndexKey: fixed order of the day
          key={index}
          className="min-w-[3px] rounded-lg"
          style={{
            flex: `${part.minutes} 1 0`,
            background: ACTIVITIES[part.kind].color,
            opacity: part.kind === "place" ? STAY_OPACITY : 1,
          }}
        />
      ))}
    </div>
  );
}

function Stat({ value, label }: { value: string; label: string }) {
  return (
    <span className="flex flex-col gap-[0.5cqw]">
      <span className="font-medium text-[6.2cqw] tracking-[-0.2cqw]">
        {value}
      </span>
      <span className="text-[3.1cqw] text-secondary">{label}</span>
    </span>
  );
}

function MapLabel({
  left,
  top,
  children,
}: {
  left: string;
  top: string;
  children: ReactNode;
}) {
  return (
    <span
      className="absolute whitespace-nowrap rounded-full bg-surface px-[3cqw] py-[1.2cqw] font-semibold text-[3.2cqw] shadow-[0_0.5cqw_2cqw_rgba(0,0,0,0.12)]"
      style={{ left, top }}
    >
      {children}
    </span>
  );
}

function MapStop({ left, top }: { left: string; top: string }) {
  return (
    <span
      className="absolute -mt-[1.4cqw] -ml-[1.4cqw] size-[2.8cqw] rounded-full bg-ink shadow-[0_0_0_0.8cqw_#fff]"
      style={{ left, top }}
    />
  );
}

/** The Today screen, drawn in HTML so it stays sharp at any size. */
function TodayScreen() {
  const tabs = [
    { icon: "route", label: "Today", active: true },
    { icon: "history", label: "History" },
    { icon: "location_on", label: "Places" },
    { icon: "account_circle", label: "You" },
  ];
  const ribbon: [Activity, number][] = [
    ["place", 3],
    ["walk", 0.6],
    ["train", 0.6],
    ["place", 48],
    ["drive", 1.2],
    ["place", 6],
    ["drive", 1.2],
    ["place", 12],
  ];

  return (
    <div className="absolute right-0 bottom-0 w-[44%] rounded-[clamp(30px,5vw,54px)] bg-ink p-[9px] shadow-[0_30px_60px_-20px_rgba(27,27,25,0.45)]">
      <div
        role="img"
        aria-label="The Today screen in Trace. It shows Monday 5 October: 46.0 km travelled, 1 h 41 min in motion and 3 places, with the routes on a map of Singapore."
        className="@container relative aspect-[402/874] w-full overflow-hidden rounded-[clamp(22px,4.2vw,46px)] bg-canvas text-ink"
      >
        <div className="flex items-center justify-between pt-[4cqw] pr-[8cqw] pl-[14cqw] font-semibold text-[4.2cqw]">
          <span>19:38</span>
          <span className="flex items-center gap-[1.5cqw]">
            <Icon name="wifi" className="text-[4.6cqw]" />
            <span className="h-[3cqw] w-[6.5cqw] rounded-[1cqw] bg-ink" />
          </span>
        </div>
        <div className="flex flex-col px-[6cqw] pt-[8cqw]">
          <div className="flex items-center justify-between">
            <span className="flex items-center gap-[1.5cqw]">
              {/* biome-ignore lint/performance/noImgElement: static SVG artwork needs no optimisation */}
              <img src="/brand/logo.svg" alt="" className="w-[4.6cqw]" />
              <span className="font-semibold text-[5cqw] tracking-[-0.2cqw]">
                trace
              </span>
            </span>
            <span className="flex items-center gap-[1.4cqw] rounded-full bg-[#e2e6dc] px-[3.6cqw] py-[2cqw] text-[#2e4a3a] text-[3.3cqw]">
              <Icon name="auto_awesome" className="text-[3.8cqw]" />
              Sample day
            </span>
          </div>
          <span className="mt-[6cqw] text-[5cqw] text-secondary">Monday</span>
          <span className="font-semibold text-[12.4cqw] leading-[1.05] tracking-[-0.6cqw]">
            5 Oct
          </span>
          <span className="mt-[2.5cqw] text-[3.7cqw] text-body">
            City mornings. A slower evening.
          </span>
          <div className="mt-[5cqw] flex gap-[7cqw]">
            <Stat value="46.0 km" label="travelled" />
            <Stat value="1 h 41 m" label="in motion" />
            <Stat value="3" label="places" />
          </div>
          <div className="mt-[5cqw] overflow-hidden rounded-[5cqw] border border-line bg-surface">
            <div className="relative h-[64cqw] overflow-hidden bg-[#e8ebe0]">
              <span className="absolute -right-[10cqw] -bottom-[8cqw] h-[30cqw] w-[56cqw] rounded-[50%] bg-[#c9dce6]" />
              <span className="absolute bottom-[6cqw] -left-[12cqw] h-[14cqw] w-[36cqw] rounded-[50%] bg-[#c9dce6]" />
              <span className="absolute top-[6cqw] left-[52cqw] h-[18cqw] w-[26cqw] rounded-[50%] bg-[#d5e3cf]" />
              <svg
                aria-hidden="true"
                viewBox="0 0 100 64"
                preserveAspectRatio="none"
                className="absolute inset-0 size-full"
              >
                <path
                  d="M27 12 C30 24, 40 28, 47 34 S 64 44, 69 52"
                  pathLength={1}
                  strokeDasharray={1}
                  fill="none"
                  stroke="var(--train)"
                  strokeWidth={1.6}
                  strokeLinecap="round"
                  className="route-draw"
                />
                <path
                  d="M27 12 C38 20, 46 26, 49 33 C 44 40, 44 48, 54 52 S 66 55, 69 52"
                  pathLength={1}
                  strokeDasharray={1}
                  fill="none"
                  stroke="var(--drive)"
                  strokeWidth={1.3}
                  strokeLinecap="round"
                  className="route-draw-late"
                />
              </svg>
              <MapStop left="27%" top="18.75%" />
              <MapLabel left="19%" top="3.9%">
                Home
              </MapLabel>
              <span className="stop-in">
                <MapStop left="49%" top="51.56%" />
                <MapLabel left="33%" top="35.9%">
                  Dempsey Hill
                </MapLabel>
              </span>
              <span className="stop-in-late">
                <MapStop left="69%" top="81.25%" />
                <MapLabel left="61%" top="64%">
                  Office
                </MapLabel>
              </span>
              <span className="absolute top-[3.5cqw] right-[3.5cqw] rounded-full bg-white/85 px-[2.6cqw] py-[1.2cqw] font-mono text-[2.6cqw] tracking-[0.4cqw]">
                SINGAPORE
              </span>
            </div>
            <div className="flex gap-[5cqw] px-[4cqw] py-[3.4cqw] font-medium text-[3.2cqw]">
              {(["walk", "drive", "train"] as const).map((kind) => (
                <span
                  key={kind}
                  className="flex items-center gap-[1cqw]"
                  style={{ color: ACTIVITIES[kind].color }}
                >
                  <Icon name={ACTIVITIES[kind].icon} className="text-[4cqw]" />
                  {{ walk: "Walking", drive: "Driving", train: "Train" }[kind]}
                </span>
              ))}
            </div>
          </div>
          <div className="mt-[6cqw] flex justify-between text-[2.8cqw] text-secondary">
            <span className="font-mono tracking-[0.4cqw]">A DAY IN COLOUR</span>
            <span>Touch to explore</span>
          </div>
          <div className="mt-[3cqw] flex h-[6cqw] gap-[0.6cqw]">
            {ribbon.map(([kind, flex], index) => (
              <span
                // biome-ignore lint/suspicious/noArrayIndexKey: fixed order of the day
                key={index}
                className="rounded-[1.2cqw]"
                style={{
                  flex: `${flex} 1 0`,
                  background: ACTIVITIES[kind].color,
                }}
              />
            ))}
          </div>
        </div>
        <div className="absolute right-[5cqw] bottom-[4cqw] left-[5cqw] flex rounded-full bg-white/80 p-[1.4cqw] shadow-[0_1cqw_5cqw_rgba(27,27,25,0.14)]">
          {tabs.map((tab) => (
            <span
              key={tab.label}
              className={`flex flex-1 flex-col items-center gap-[0.6cqw] rounded-full py-[2cqw] ${tab.active ? "bg-ink/[0.07] text-walk" : ""}`}
            >
              <Icon name={tab.icon} className="text-[6cqw]" />
              <span className="font-semibold text-[2.8cqw]">{tab.label}</span>
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

const MARK_COLOURS = [
  "var(--walk)",
  "var(--cycle)",
  "var(--train)",
  "var(--drive)",
];

function HistoryCard() {
  const days = Array.from({ length: 31 }, (_, index) => {
    const day = index + 1;
    const marks =
      day <= 15
        ? MARK_COLOURS.filter(
            (_, j) => (day * 7 + j * 3) % 5 < 2 + (j === 0 ? 1 : 0),
          ).slice(0, 3)
        : [];
    return { day, marks, past: day <= 15, selected: day === 5 };
  });

  return (
    <div className={`${card} flex flex-col gap-5 p-[clamp(20px,3vw,32px)]`}>
      <div className="grid grid-cols-4 gap-1.5 rounded-[14px] bg-fill p-1 text-center font-semibold text-sm">
        {["Day", "Week", "Month", "Year"].map((view) => (
          <span
            key={view}
            className={`rounded-[10px] py-2 ${view === "Month" ? "bg-sun text-on-sun" : ""}`}
          >
            {view}
          </span>
        ))}
      </div>
      <div className="font-semibold text-[26px] tracking-[-0.5px]">October</div>
      <div className="grid grid-cols-7 gap-1.5 text-center">
        {["M", "T", "W", "T", "F", "S", "S"].map((weekday, index) => (
          <span
            // biome-ignore lint/suspicious/noArrayIndexKey: weekday initials repeat
            key={index}
            className="font-mono text-[11px] text-secondary"
          >
            {weekday}
          </span>
        ))}
        {/* October 2026 starts on a Thursday. */}
        <span className="col-span-3" />
        {days.map(({ day, marks, past, selected }) => (
          <span
            key={day}
            className={`flex min-h-11 flex-col items-center justify-center gap-1 rounded-xl font-semibold text-[15px] ${
              selected
                ? "bg-sun text-on-sun"
                : past
                  ? "text-ink"
                  : "text-[#b5b2a8]"
            }`}
          >
            {day}
            <span className="flex h-1 justify-center gap-0.5">
              {marks.map((colour) => (
                <span
                  key={colour}
                  className="h-1 w-1.5 rounded-sm"
                  style={{ background: selected ? "var(--on-sun)" : colour }}
                />
              ))}
            </span>
          </span>
        ))}
      </div>
      <div className="flex items-center gap-3 border-line border-t pt-[18px]">
        <span className="flex size-11 items-center justify-center rounded-full bg-fill text-walk">
          <Icon name="local_cafe" className="text-[22px]" />
        </span>
        <div className="flex min-w-0 flex-col gap-0.5">
          <span className="font-semibold">Coffee at Dempsey Hill</span>
          <span className="text-secondary text-sm">
            Mon 5 Oct · 1 photo · 1 note
          </span>
        </div>
      </div>
    </div>
  );
}

function JourneyCard() {
  return (
    <div className={`${card} overflow-hidden`}>
      <Image
        src="/images/onboarding-first-day.webp"
        alt="An illustrated route. It goes from a house, past the trees, to the waterfront."
        width={960}
        height={960}
        sizes="(min-width: 860px) 36rem, 100vw"
        className="h-auto w-full"
      />
      <div className="flex flex-col gap-3.5 border-line border-t px-[clamp(20px,3vw,28px)] pt-5 pb-6">
        <div className="flex items-center gap-3.5">
          <span className="flex size-11 flex-none items-center justify-center rounded-full bg-ink text-canvas">
            <Icon name="pause" className="text-[26px]" />
          </span>
          <div className="relative h-1.5 min-w-0 flex-1 rounded-[3px] bg-fill">
            <span className="absolute inset-y-0 left-0 w-[62%] rounded-[3px] bg-cycle" />
            <span className="absolute top-1/2 left-[62%] -mt-2.5 -ml-2.5 size-5 rounded-full border-4 border-cycle bg-surface" />
          </div>
        </div>
        <div className="flex justify-between font-mono text-secondary text-xs">
          <span>16:20 HOME</span>
          <span className="text-ink">16:42 · 4.8 KM</span>
          <span>16:55 BEACH</span>
        </div>
      </div>
    </div>
  );
}

const PLACES = [
  {
    name: "Home",
    icon: "home",
    visits: 31,
    usual: "Usually arrives 18:40",
    private: true,
  },
  {
    name: "Office",
    icon: "work",
    visits: 22,
    usual: "Usually arrives 09:10",
    private: false,
  },
  {
    name: "Dempsey Hill",
    icon: "local_cafe",
    visits: 9,
    usual: "Usually arrives 08:20",
    private: false,
  },
  {
    name: "East Coast Park",
    icon: "park",
    visits: 4,
    usual: "Usually arrives 16:50",
    private: false,
  },
];

function PlacesCard() {
  return (
    <ul className={`${card} px-[clamp(16px,3vw,28px)] py-2`}>
      {PLACES.map((place) => (
        <li
          key={place.name}
          className="flex items-center gap-3.5 border-line py-[18px] not-first:border-t"
        >
          <span className="flex size-11 flex-none items-center justify-center rounded-full bg-fill text-place">
            <Icon name={place.icon} className="text-[22px]" />
          </span>
          <div className="flex min-w-0 flex-1 flex-col gap-1.5">
            <div className="flex items-baseline justify-between gap-3">
              <span className="flex items-center gap-1.5 font-semibold">
                {place.name}
                {place.private && (
                  <span
                    role="img"
                    aria-label="Exact location private"
                    title="Exact location private"
                    className="icon text-base text-secondary"
                  >
                    lock
                  </span>
                )}
              </span>
              <span className="font-semibold text-lg">{place.visits}</span>
            </div>
            <div className="flex justify-between gap-3 text-[13px] text-secondary">
              <span>{place.usual}</span>
              <span>visits</span>
            </div>
            <span className="block h-1 rounded-sm bg-fill">
              <span
                className="block h-1 rounded-sm bg-sun"
                style={{ width: `${Math.round((place.visits / 31) * 100)}%` }}
              />
            </span>
          </div>
        </li>
      ))}
    </ul>
  );
}

// Stops of an illustrative path; squares near the path are explored.
const PATH_POINTS = [
  [2, 7],
  [4, 6],
  [6, 5],
  [7, 3],
  [9, 4],
  [11, 5],
  [13, 3],
  [14, 2],
];

function ExploreCard() {
  const squares = Array.from({ length: 9 * 16 }, (_, index) => {
    const row = Math.floor(index / 16);
    const column = index % 16;
    const distance = Math.min(
      ...PATH_POINTS.map(([x, y]) => Math.hypot(x - column, y - row)),
    );
    const jitter = ((row * 31 + column * 17) % 7) / 7;
    const explored = distance < 1.3 + jitter * 0.9;
    return {
      background: !explored
        ? "var(--fill)"
        : column > 8 && row < 5
          ? "var(--cycle)"
          : "var(--walk)",
      opacity: explored && distance > 1.2 ? 0.7 : 1,
    };
  });

  return (
    <div
      className={`${card} flex flex-col gap-[18px] p-[clamp(20px,3vw,32px)]`}
    >
      <div className="flex flex-wrap items-baseline justify-between gap-3">
        <span className="font-semibold">Explored map</span>
        <span className="font-mono text-secondary text-xs">
          1 SQUARE ≈ 220 M
        </span>
      </div>
      <div aria-hidden="true" className="grid grid-cols-16 gap-[3px]">
        {squares.map((style, index) => (
          <span
            // biome-ignore lint/suspicious/noArrayIndexKey: fixed grid position
            key={index}
            className="aspect-square rounded-[3px]"
            style={style}
          />
        ))}
      </div>
      <div className="flex items-center gap-3 border-line border-t pt-[18px]">
        <span className="rounded-lg bg-sun px-2.5 py-1 font-semibold text-on-sun text-sm">
          First
        </span>
        <span className="text-[15px]">First visit to Tiong Bahru · 2 Oct</span>
      </div>
    </div>
  );
}

const CHAPTERS: {
  id: string;
  activity: Activity;
  time: string;
  title: string;
  body: string;
  note?: string;
  visual: ReactNode;
}[] = [
  {
    id: "map",
    activity: "walk",
    time: "08:00",
    title: "See your whole day on one map.",
    body: "Trace draws each route on the map. The line shows how you moved. Each evening, Trace writes a short story of your day.",
    note: "You can add notes and photos. You can also correct a stop that is not correct.",
    visual: (
      <Image
        src="/images/onboarding-example.webp"
        alt="A sample day on Monday 5 October. A route goes from Home through Dempsey Hill to Office. The story shows “A slow morning at home” and “Coffee at Dempsey Hill”."
        width={960}
        height={960}
        sizes="(min-width: 860px) 36rem, 100vw"
        className="h-auto w-full rounded-[32px] border border-line"
      />
    ),
  },
  {
    id: "history",
    activity: "train",
    time: "09:25",
    title: "Look back at any day.",
    body: "Open a day, a week, a month or a year. Each day keeps its memory card, with its notes and photos.",
    visual: <HistoryCard />,
  },
  {
    id: "journey",
    activity: "cycle",
    time: "16:20",
    title: "Play back a journey.",
    body: "Move the slider to go back in time. The map shows where you were and when.",
    visual: <JourneyCard />,
  },
  {
    id: "places",
    activity: "drive",
    time: "18:25",
    title: "Know your places.",
    body: "Trace finds the places that you go to frequently. See how frequently you go and when you usually arrive.",
    note: "Make a place private, and Trace keeps only a pin for it. Your exact location is not stored, synced or exported.",
    visual: <PlacesCard />,
  },
  {
    id: "explore",
    activity: "place",
    time: "18:55",
    title: "No streaks. No scores.",
    body: "A quiet day at home does not remove progress. As you go to new streets, your explored map fills in.",
    visual: <ExploreCard />,
  },
];

const STORY = [
  {
    icon: "home",
    colour: "var(--place)",
    text: "A slow morning at home",
    time: "07:00",
  },
  {
    icon: "local_cafe",
    colour: "var(--walk)",
    text: "Coffee at Dempsey Hill",
    time: "08:25",
  },
  {
    icon: "work",
    colour: "var(--train)",
    text: "A long day at the office",
    time: "10:05",
  },
];

const bezel = "clamp(8px,1.2vw,14px)";
const outerRadius = "clamp(28px,4vw,52px)";
const innerRadius = "clamp(20px,3.2vw,40px)";
const foldBlur = "blur(calc(var(--duo-fold) * 6px))";
// The right half's hinge corners: rounded while the outer display covers it
// (folded past 90°, open < 0.5), square once the inner display meets it.
const hinge = (radius: string) =>
  `calc(${radius} * clamp(0, (0.5 - var(--duo-open)) * 1000, 1))`;

function DuoPhone() {
  return (
    <div
      className="relative aspect-[1.4/1] w-full"
      style={{ transformStyle: "preserve-3d" }}
    >
      <div
        className="absolute inset-0"
        style={{
          transformStyle: "preserve-3d",
          transform: "translateX(calc(-25% * (1 - var(--duo-open))))",
        }}
      >
        {/* Right half of the inner display: the day. */}
        <div
          className="absolute top-0 left-1/2 h-full w-1/2 bg-ink shadow-[0_40px_80px_-30px_rgba(27,27,25,0.5)]"
          style={{
            padding: `${bezel} ${bezel} ${bezel} 0`,
            borderRadius: `${hinge(outerRadius)} ${outerRadius} ${outerRadius} ${hinge(outerRadius)}`,
          }}
        >
          <div
            className="relative size-full overflow-hidden bg-canvas"
            style={{
              borderRadius: `${hinge(innerRadius)} ${innerRadius} ${innerRadius} ${hinge(innerRadius)}`,
            }}
          >
            <div className="flex min-w-0 flex-col gap-[clamp(8px,1.6vw,20px)] overflow-hidden p-[clamp(14px,3.4vw,44px)]">
              <div className="flex flex-col gap-[clamp(0px,0.4vw,4px)]">
                <span className="text-[clamp(11px,1.7vw,22px)] text-secondary">
                  Monday
                </span>
                <span className="font-semibold text-[clamp(26px,5.4vw,68px)] leading-none tracking-[-0.04em]">
                  5 Oct
                </span>
              </div>
              <span className="text-[clamp(10px,1.4vw,17px)] text-body">
                City mornings. A slower evening.
              </span>
              <div className="flex gap-[clamp(10px,2.6vw,32px)]">
                {[
                  ["46.0 km", "travelled"],
                  ["1 h 41 m", "in motion"],
                  ["3", "places"],
                ].map(([value, label]) => (
                  <div key={label} className="flex flex-col">
                    <span className="font-semibold text-[clamp(14px,2.4vw,30px)] tracking-[-0.5px]">
                      {value}
                    </span>
                    <span className="text-[clamp(9px,1.1vw,13px)] text-secondary">
                      {label}
                    </span>
                  </div>
                ))}
              </div>
              <RibbonStrip className="h-[clamp(10px,1.8vw,22px)]" />
              <ul className="flex flex-col border-line border-t">
                {STORY.map((item) => (
                  <li
                    key={item.text}
                    className="flex min-w-0 items-center gap-[clamp(6px,1.2vw,14px)] border-line border-b py-[clamp(5px,1.1vw,14px)]"
                  >
                    <span
                      className="flex size-[clamp(18px,2.8vw,36px)] flex-none items-center justify-center rounded-full bg-fill"
                      style={{ color: item.colour }}
                    >
                      <Icon
                        name={item.icon}
                        className="text-[clamp(11px,1.6vw,20px)]"
                      />
                    </span>
                    <span className="min-w-0 flex-1 truncate font-medium text-[clamp(10px,1.4vw,17px)]">
                      {item.text}
                    </span>
                    <span className="font-mono text-[clamp(8px,1vw,12px)] text-secondary">
                      {item.time}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
            <span
              aria-hidden="true"
              className="absolute inset-y-0 left-0 w-px bg-[linear-gradient(rgba(27,27,25,0),rgba(27,27,25,0.12)_20%,rgba(27,27,25,0.12)_80%,rgba(27,27,25,0))]"
            />
          </div>
        </div>

        {/* Left half: the map inside, the outer display on its back. */}
        <div
          className="absolute top-0 left-0 h-full w-1/2"
          style={{ transformStyle: "preserve-3d" }}
        >
          <div
            className="absolute inset-0 origin-right"
            style={{
              transformStyle: "preserve-3d",
              transform:
                "translateZ(2px) rotateY(calc(180deg * (1 - var(--duo-open))))",
            }}
          >
            <div
              className="absolute inset-0 bg-ink backface-hidden"
              style={{
                padding: `${bezel} 0 ${bezel} ${bezel}`,
                borderRadius: `${outerRadius} 0 0 ${outerRadius}`,
              }}
            >
              <div
                className="relative size-full overflow-hidden bg-canvas"
                style={{ borderRadius: `${innerRadius} 0 0 ${innerRadius}` }}
              >
                <Image
                  src="/images/onboarding-everyday.webp"
                  alt="The map of Monday 5 October on the left half of the inner display."
                  width={960}
                  height={960}
                  sizes="(min-width: 1040px) 32rem, 50vw"
                  className="size-full object-cover"
                />
                <span
                  className="pointer-events-none absolute inset-0"
                  style={{
                    background: "rgb(14 16 20 / calc(var(--duo-fold) * 0.45))",
                    backdropFilter: foldBlur,
                    WebkitBackdropFilter: foldBlur,
                  }}
                />
              </div>
            </div>
            <div
              aria-hidden="true"
              className="absolute inset-0 rotate-y-180 bg-ink backface-hidden"
              style={{ padding: bezel, borderRadius: outerRadius }}
            >
              <div
                className="relative flex size-full flex-col overflow-hidden bg-canvas"
                style={{ borderRadius: innerRadius }}
              >
                <span
                  className="pointer-events-none absolute inset-0 z-[2]"
                  style={{
                    backdropFilter: foldBlur,
                    WebkitBackdropFilter: foldBlur,
                  }}
                />
                <Image
                  src="/images/onboarding-everyday.webp"
                  alt=""
                  width={960}
                  height={960}
                  sizes="(min-width: 1040px) 32rem, 50vw"
                  className="h-[44%] w-full object-cover"
                />
                <div className="flex min-h-0 flex-1 flex-col gap-[clamp(6px,1.2vw,14px)] p-[clamp(12px,2.6vw,32px)]">
                  <div className="flex items-baseline justify-between gap-2">
                    <span className="font-semibold text-[clamp(20px,4vw,50px)] leading-none tracking-[-0.04em]">
                      5 Oct
                    </span>
                    <span className="font-mono text-[clamp(8px,1vw,12px)] text-secondary tracking-[1px]">
                      OUTER DISPLAY
                    </span>
                  </div>
                  <div className="flex gap-[clamp(10px,2.4vw,28px)]">
                    {[
                      ["46.0 km", "travelled"],
                      ["3", "places"],
                    ].map(([value, label]) => (
                      <div key={label} className="flex flex-col">
                        <span className="font-semibold text-[clamp(13px,2.2vw,26px)] tracking-[-0.5px]">
                          {value}
                        </span>
                        <span className="text-[clamp(9px,1.1vw,13px)] text-secondary">
                          {label}
                        </span>
                      </div>
                    ))}
                  </div>
                  <RibbonStrip className="h-[clamp(8px,1.4vw,18px)]" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

const PRIVACY_POINTS = [
  {
    icon: "lock",
    title: "Encrypted on your iPhone",
    body: "Trace encrypts your journal on your device. We do not operate servers that receive your journal. We cannot read it.",
  },
  {
    icon: "pause_circle",
    title: "You control the recording",
    body: "Trace records nothing until you tap Start recording. You can pause it from the app, the widget, the Lock Screen or Siri.",
  },
  {
    icon: "block",
    title: "No account and no ads",
    body: "You do not sign in. We do not sell your data or track you across other apps. iCloud sync and analytics are off by default.",
  },
];

const IPHONE_FEATURES = [
  {
    icon: "widgets",
    title: "Home Screen widget",
    body: "Pause or start the recording from your Home Screen.",
  },
  {
    icon: "screen_lock_portrait",
    title: "Live Activity",
    body: "See on your Lock Screen when the recording is paused.",
  },
  {
    icon: "graphic_eq",
    title: "Siri and Shortcuts",
    body: "Say “Get my day summary in Trace”.",
  },
  {
    icon: "cloud_lock",
    title: "iCloud sync",
    body: "Optional and encrypted. It is off by default.",
  },
];

const FAQ = [
  {
    question: "Can you see where I go?",
    answer:
      "No. We do not operate servers that receive your journal. Your journal stays on your iPhone, or in your own iCloud account if you turn on iCloud sync. Trace encrypts it before it leaves your iPhone. Optional analytics never include your locations, routes, places, notes or photos.",
  },
  {
    question: "Does Trace use much battery?",
    answer:
      "No. Trace uses the low-power location service of iOS. With the Always permission, Trace uses this service to fill in your full day.",
  },
  {
    question: "Does Trace record all the time?",
    answer:
      "No. Trace records nothing until you tap Start recording. With the While Using permission, Trace records only when the app is open. You can pause Trace at any time, also from the Lock Screen.",
  },
  {
    question: "Do I need an account?",
    answer: "No. You do not need an account, and you do not sign in.",
  },
  {
    question: "Can I erase all my data?",
    answer:
      "Yes. In Settings, tap Erase Journal. This erases every day, place, route, memory and saved place.",
  },
];

export default function Home() {
  const accentAt = TAGLINE.lastIndexOf(" ") + 1;

  return (
    <>
      <script
        type="application/ld+json"
        // biome-ignore lint/security/noDangerouslySetInnerHtml: JSON-LD, with "<" escaped
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c"),
        }}
      />

      <div className="overflow-x-clip">
        {/* Hero */}
        <section
          aria-labelledby="hero-heading"
          className={`${wrap} grid grid-cols-[repeat(auto-fit,minmax(min(100%,460px),1fr))] items-center gap-[clamp(40px,6vw,80px)] pt-[clamp(32px,6vw,72px)] pb-[clamp(48px,7vw,96px)]`}
        >
          <div className="flex flex-col gap-7">
            <div className="flex flex-col items-start gap-3.5">
              <a
                href="#duo"
                className="inline-flex min-h-9 items-center gap-2.5 rounded-full border border-line bg-surface py-1 pr-3.5 pl-[5px] font-medium text-sm motion-safe:transition-colors hover:border-ink"
              >
                <span className="rounded-full bg-sun px-2.5 py-[3px] font-semibold text-on-sun text-xs">
                  New
                </span>
                Ready for iPhone Duo
                <Icon name="arrow_forward" className="text-lg" />
              </a>
              <p className={eyebrow}>A MOVEMENT JOURNAL FOR IPHONE</p>
            </div>
            <h1
              id="hero-heading"
              className="font-semibold text-[clamp(60px,9.5vw,132px)] leading-[0.9] tracking-[-0.05em]"
            >
              {TAGLINE.slice(0, accentAt)}
              <span className="relative isolate mt-[0.08em] inline-block px-[0.12em] pb-[0.06em]">
                <span
                  aria-hidden="true"
                  className="hero-highlight absolute inset-0 -z-10 origin-left rounded-[0.16em] bg-sun"
                />
                <span className="hero-highlight-text text-on-sun">
                  {TAGLINE.slice(accentAt)}
                </span>
              </span>
            </h1>
            <p className="max-w-[30ch] text-pretty text-[#3a3a35] text-[clamp(19px,2vw,23px)] leading-[1.45]">
              {SUMMARY}
            </p>
            <div
              id="download"
              className="flex scroll-mt-6 flex-wrap items-center gap-5"
            >
              <AppStoreBadge location="hero" />
              <a
                href="#privacy"
                className={`font-medium text-[15px] ${underline}`}
              >
                How we keep your data private
              </a>
            </div>
            <ul className="flex flex-wrap gap-x-5 gap-y-2 border-line border-t pt-[18px] font-mono text-secondary text-xs tracking-[1px]">
              <li>NO ACCOUNT</li>
              <li>NO ADS</li>
              <li>ENCRYPTED ON YOUR IPHONE</li>
              <li>
                <a
                  href="#duo"
                  className="underline decoration-[#c9c4b6] underline-offset-4 hover:text-ink hover:decoration-ink"
                >
                  READY FOR IPHONE DUO
                </a>
              </li>
            </ul>
          </div>
          <div className="relative aspect-[1/1.08] w-full max-w-[620px] justify-self-center">
            <Image
              src="/images/onboarding-everyday.webp"
              alt="An illustrated map of a day. A route goes from a house, past a café, to a park at the waterfront."
              width={960}
              height={960}
              sizes="(min-width: 1040px) 32rem, 84vw"
              loading="eager"
              fetchPriority="high"
              className="absolute top-0 left-0 h-auto w-[84%] rounded-[32px]"
            />
            <TodayScreen />
          </div>
        </section>

        {/* A day in colour */}
        <section
          aria-labelledby="ribbon-heading"
          className={`${wrap} pb-[clamp(56px,8vw,112px)]`}
        >
          <div className="mb-4 flex flex-wrap items-baseline justify-between gap-4">
            <h2 id="ribbon-heading" className={`${eyebrow} font-normal`}>
              A DAY IN COLOUR · MONDAY 5 OCT
            </h2>
            <ul className="flex flex-wrap gap-x-[18px] gap-y-1.5 text-sm">
              {(["walk", "cycle", "train", "drive", "place"] as const).map(
                (kind) => {
                  const style = ACTIVITIES[kind];
                  return (
                    <li key={kind} className="flex items-center gap-2">
                      <span
                        aria-hidden="true"
                        className="w-[26px]"
                        style={{
                          borderTop: `${style.width}px ${style.border} ${style.color}`,
                          opacity: kind === "place" ? 0.5 : 1,
                        }}
                      />
                      {style.name}
                    </li>
                  );
                },
              )}
            </ul>
          </div>
          <DayRibbon />
          <div
            aria-hidden="true"
            className="mt-2.5 flex justify-between font-mono text-secondary text-xs"
          >
            <span>00:00</span>
            <span>06:00</span>
            <span>12:00</span>
            <span>18:00</span>
            <span>24:00</span>
          </div>
          <p className="mt-5 max-w-[52ch] text-base text-secondary leading-normal">
            Each colour is one way that you moved. Each part shows its time in
            the day. This page follows the same day, from the first walk to the
            evening at home.
          </p>
        </section>

        {/* Chapters of the day */}
        <div className={wrap}>
          {CHAPTERS.map((chapter, index) => {
            const style = ACTIVITIES[chapter.activity];
            const headingId = `${chapter.id}-heading`;
            return (
              <article
                key={chapter.id}
                id={chapter.id}
                aria-labelledby={headingId}
                className="grid grid-cols-[clamp(28px,5vw,64px)_minmax(0,1fr)] gap-x-[clamp(16px,3vw,40px)]"
              >
                <ChapterRail
                  activity={chapter.activity}
                  last={index === CHAPTERS.length - 1}
                />
                <div className="grid grid-cols-[repeat(auto-fit,minmax(min(100%,380px),1fr))] items-center gap-[clamp(32px,5vw,72px)] pb-[clamp(72px,10vw,140px)]">
                  <div className="flex flex-col gap-5 self-start">
                    <div className="flex flex-wrap items-center gap-3">
                      <span className="font-mono text-sm tracking-[0.5px]">
                        {chapter.time}
                      </span>
                      <span
                        className="inline-flex items-center gap-1.5 rounded-full py-[5px] pr-3 pl-[9px] font-semibold text-canvas text-sm"
                        style={{ background: style.color }}
                      >
                        <Icon name={style.icon} className="text-lg" />
                        {style.name}
                      </span>
                    </div>
                    <h2 id={headingId} className={sectionHeading}>
                      {chapter.title}
                    </h2>
                    <p className={`max-w-[36ch] ${lead}`}>{chapter.body}</p>
                    {chapter.note && (
                      <p className="max-w-[40ch] border-line border-t pt-4 text-[15px] text-secondary leading-normal">
                        {chapter.note}
                      </p>
                    )}
                  </div>
                  <div className="min-w-0">{chapter.visual}</div>
                </div>
              </article>
            );
          })}
        </div>

        {/* iPhone Duo */}
        <section
          id="duo"
          aria-labelledby="duo-heading"
          className={`${wrap} flex flex-col gap-[clamp(36px,5vw,56px)] pt-[clamp(24px,4vw,48px)] pb-[clamp(96px,12vw,160px)]`}
        >
          <div className="grid grid-cols-[repeat(auto-fit,minmax(min(100%,380px),1fr))] items-end gap-[clamp(24px,5vw,72px)]">
            <div className="flex flex-col gap-5">
              <div className="flex items-center gap-3">
                <span className="rounded-full bg-sun px-3 py-[5px] font-semibold text-on-sun text-sm">
                  New
                </span>
                <span className={eyebrow}>IPHONE DUO</span>
              </div>
              <h2 id="duo-heading" className={sectionHeading}>
                Unfold your day.
              </h2>
            </div>
            <p className={`max-w-[40ch] ${lead}`}>
              On iPhone Duo, open the phone to see the map and your day side by
              side. Close it, and Trace shows one column on the outer display.
            </p>
          </div>
          <DuoStage>
            <DuoPhone />
          </DuoStage>
          <p className="self-center font-mono text-secondary text-xs tracking-[1px]">
            IPHONE DUO REQUIRES iOS 27
          </p>
        </section>

        {/* Night: privacy, iPhone features, questions, download. */}
        <div className="bg-night text-on-night [--line:var(--night-line)] [--secondary:var(--night-secondary)]">
          <section
            id="privacy"
            aria-labelledby="privacy-heading"
            className={`${wrap} flex flex-col gap-[clamp(40px,6vw,72px)] pt-[clamp(80px,11vw,152px)] pb-[clamp(64px,8vw,112px)]`}
          >
            <div className="flex flex-col gap-6">
              <p className={eyebrow}>23:00 · RECORDING PAUSED</p>
              <h2
                id="privacy-heading"
                className="max-w-[14ch] text-balance font-semibold text-[clamp(48px,8vw,112px)] leading-[0.92] tracking-[-0.05em]"
              >
                Your journal stays on your iPhone.
              </h2>
              <p className="max-w-[46ch] text-pretty text-[clamp(19px,2vw,23px)] text-secondary leading-[1.45]">
                You should not have to trust a company with your location
                history. With Trace, you do not have to. We do not receive your
                journal, so we cannot read it, sell it or lose it in a data
                breach.
              </p>
            </div>
            <ul className="grid grid-cols-[repeat(auto-fit,minmax(min(100%,280px),1fr))] gap-[clamp(28px,4vw,56px)]">
              {PRIVACY_POINTS.map((point) => (
                <li
                  key={point.title}
                  className="flex flex-col gap-3 border-line border-t pt-6"
                >
                  <Icon name={point.icon} className="text-[30px] text-peach" />
                  <h3 className="font-semibold text-[21px] tracking-[-0.3px]">
                    {point.title}
                  </h3>
                  <p className="text-base text-secondary leading-[1.55]">
                    {point.body}
                  </p>
                </li>
              ))}
            </ul>
            <Link
              href="/privacy"
              className="self-start font-medium text-base underline decoration-[#4a4e55] underline-offset-[5px] motion-safe:transition-colors hover:decoration-on-night"
            >
              Read the privacy policy
            </Link>
          </section>

          <section
            aria-labelledby="iphone-heading"
            className={`${wrap} pb-[clamp(64px,8vw,112px)]`}
          >
            <div className="mb-5 flex flex-wrap items-baseline justify-between gap-4">
              <h2
                id="iphone-heading"
                className="font-semibold text-[clamp(26px,3vw,34px)] tracking-[-0.6px]"
              >
                Works with your iPhone
              </h2>
              <p className="font-mono text-secondary text-xs tracking-[1px]">
                REQUIRES iOS {MIN_IOS} OR LATER
              </p>
            </div>
            <ul className="grid grid-cols-[repeat(auto-fit,minmax(min(100%,230px),1fr))] gap-3">
              {IPHONE_FEATURES.map((feature) => (
                <li
                  key={feature.title}
                  className="flex flex-col gap-2.5 rounded-3xl border border-line bg-night-surface p-6"
                >
                  <Icon name={feature.icon} outline className="text-[26px]" />
                  <h3 className="font-semibold text-[17px]">{feature.title}</h3>
                  <p className="text-[15px] text-secondary leading-normal">
                    {feature.body}
                  </p>
                </li>
              ))}
            </ul>
          </section>

          <section
            id="faq"
            aria-labelledby="faq-heading"
            className={`${wrap} grid grid-cols-1 gap-[clamp(24px,5vw,72px)] pb-[clamp(80px,10vw,144px)] md:grid-cols-3`}
          >
            <h2
              id="faq-heading"
              className="font-semibold text-[clamp(26px,3vw,34px)] tracking-[-0.6px]"
            >
              Questions
            </h2>
            <div className="min-w-0 border-line border-t md:col-span-2">
              {FAQ.map((item) => (
                <details
                  key={item.question}
                  className="group border-line border-b"
                >
                  <summary className="flex min-h-16 cursor-pointer list-none items-center justify-between gap-4 font-medium text-lg [&::-webkit-details-marker]:hidden">
                    {item.question}
                    <Icon
                      name="add"
                      outline
                      className="text-2xl text-secondary motion-safe:transition-transform group-open:rotate-45"
                    />
                  </summary>
                  <p className="max-w-[62ch] pb-6 text-base text-secondary leading-relaxed">
                    {item.answer}
                  </p>
                </details>
              ))}
              <p className="mt-5 text-[15px] text-secondary">
                More answers are on the{" "}
                <Link
                  href="/support"
                  className="text-on-night underline underline-offset-4"
                >
                  support page
                </Link>
                .
              </p>
            </div>
          </section>

          <section
            aria-labelledby="cta-heading"
            className={`${wrap} flex flex-col items-center gap-7 pb-[clamp(80px,10vw,128px)] text-center`}
          >
            {/* biome-ignore lint/performance/noImgElement: static SVG artwork needs no optimisation */}
            <img
              src="/brand/logo-dark.svg"
              alt=""
              width={96}
              height={96}
              className="rounded-[22.37%] shadow-[0_0_0_1px_var(--night-line)]"
            />
            <h2
              id="cta-heading"
              className="font-semibold text-[clamp(44px,7vw,96px)] leading-[0.95] tracking-[-0.05em]"
            >
              Start your first day.
            </h2>
            <p className="max-w-[36ch] text-[19px] text-secondary leading-normal">
              Install Trace and tap Start recording. Tonight, your day is on the
              map.
            </p>
            <AppStoreBadge location="footer-cta" />
          </section>
        </div>
      </div>
    </>
  );
}
