import type { Metadata } from "next";
import Link from "next/link";
import type { CSSProperties, ReactNode } from "react";
import { AppStoreBadge } from "@/components/app-store-badge";
import { ChapterRail } from "@/components/chapter-rail";
import {
  DayMap,
  type MapPin,
  type MapRoute,
  type MapView,
} from "@/components/day-map";
import { DayRibbon } from "@/components/day-ribbon";
import { DuoStage } from "@/components/duo-stage";
import { HistoryCalendar } from "@/components/history-calendar";
import { JourneyPlayback } from "@/components/journey-playback";
import {
  ACTIVITIES,
  type Activity,
  BOTANIC_GARDENS,
  DAY_POINTS,
  EAST_COAST_PARK,
  EVENING_DRIVE,
  GARDENS_BY_THE_BAY,
  JEWEL_CHANGI,
  JOURNEYS,
  MARINA_BAY_SANDS,
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
  SUPPORT_EMAIL,
  TAGLINE,
} from "@/lib/site";
import { snapshotUrl } from "@/lib/snapshot";

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

// City and country only: no street address or company name on public pages.
const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
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
    },
    {
      "@type": "Organization",
      name: BRAND,
      url: SITE_URL,
      contactPoint: {
        "@type": "ContactPoint",
        contactType: "customer support",
        email: SUPPORT_EMAIL,
      },
      address: {
        "@type": "PostalAddress",
        addressLocality: "Singapore",
        addressCountry: "SG",
      },
    },
  ],
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

// Each map's box. A snapshot of Apple Maps covers exactly its box.
const HERO_VIEW: MapView = {
  width: 540,
  height: 540,
  fit: DAY_POINTS,
  padding: [90, 60, 60, 100],
};
const STORY_VIEW: MapView = {
  width: 560,
  height: 400,
  fit: DAY_POINTS,
  padding: [56, 56, 56, 90],
};
// The Duo's inner and outer displays crop their maps by under 5 px, so
// Apple's logo stays whole.
const DUO_INNER_VIEW: MapView = {
  width: 350,
  height: 500,
  fit: DAY_POINTS,
  padding: [40, 40, 40, 70],
};
const DUO_OUTER_VIEW: MapView = {
  width: 400,
  height: 256,
  fit: DAY_POINTS,
  padding: 30,
};
const PLAYBACK_VIEW: MapView = {
  width: 560,
  height: 360,
  fit: EVENING_DRIVE,
  padding: 64,
};

const DAY_MAP_LABEL =
  "Map of Monday 5 October in Singapore: a walk from Marina Bay Sands to Gardens by the Bay, a train to the Botanic Gardens, a drive to Jewel Changi, a drive to East Coast Park and a drive back.";

// The western and eastern labels sit inwards, so they stay inside the map.
const DAY_PINS: MapPin[] = [
  { at: MARINA_BAY_SANDS, label: "Marina Bay Sands", side: "l" },
  { at: GARDENS_BY_THE_BAY, label: "Gardens by the Bay", side: "d" },
  { at: BOTANIC_GARDENS, label: "Botanic Gardens", side: "d" },
  { at: JEWEL_CHANGI, label: "Jewel Changi", side: "l" },
  { at: EAST_COAST_PARK, label: "East Coast Park", side: "d" },
];

/** The routes of the day, drawn in one after another. */
function drawnRoutes(timings: [delay: number, duration: number][]): MapRoute[] {
  return JOURNEYS.map((journey, i) => ({
    ...journey,
    // The routes start to draw 0.9 s after the page loads.
    draw: { delay: 0.9 + timings[i][0], duration: timings[i][1] },
  }));
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

async function DayStoryCard() {
  const snapshot = await snapshotUrl(STORY_VIEW);
  return (
    <div className={`${card} overflow-hidden`}>
      <div
        role="img"
        aria-label={DAY_MAP_LABEL}
        className="relative aspect-[7/5] bg-canvas"
      >
        <DayMap
          {...STORY_VIEW}
          snapshot={snapshot}
          fontSize={14}
          strokeScale={1.2}
          routes={JOURNEYS}
          pins={DAY_PINS}
        />
      </div>
      <div className="flex flex-col gap-2 border-line border-t px-[clamp(20px,3vw,28px)] pt-5 pb-6">
        <span className="font-mono text-secondary text-xs tracking-[1px]">
          DAILY STORY · MONDAY 5 OCT
        </span>
        <span className="font-semibold text-[22px] tracking-[-0.3px]">
          Garden mornings. A slower evening.
        </span>
        <p className="text-pretty text-[15px] text-secondary leading-normal">
          You left Marina Bay Sands at 8:05 and walked to Gardens by the Bay. A
          train took you to the Botanic Gardens. In the afternoon you had coffee
          at Jewel Changi. In the evening you drove to East Coast Park, and were
          back by 8:30.
        </p>
      </div>
    </div>
  );
}

const PLACES = [
  {
    name: "Marina Bay Sands",
    icon: "hotel",
    visits: 64,
    usual: "Usually arrives 20:30",
    private: true,
  },
  {
    name: "Botanic Gardens",
    icon: "park",
    visits: 41,
    usual: "Usually arrives 10:04",
    private: false,
  },
  {
    name: "Gardens by the Bay",
    icon: "local_florist",
    visits: 29,
    usual: "Usually arrives 08:12",
    private: false,
  },
  {
    name: "Jewel Changi",
    icon: "local_cafe",
    visits: 18,
    usual: "Usually arrives 13:10",
    private: false,
  },
  {
    name: "East Coast Park",
    icon: "waves",
    visits: 12,
    usual: "Usually arrives 18:05",
    private: false,
  },
];
const MOST_VISITS = Math.max(...PLACES.map((place) => place.visits));

function PlacesCard() {
  return (
    <ul className={`${card} px-[clamp(16px,3vw,28px)] py-2`}>
      {PLACES.map((place, index) => (
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
                className="block h-1 rounded-sm bg-sun unreached:w-0! motion-safe:transition-[width] motion-safe:duration-[1.1s] motion-safe:ease-[cubic-bezier(0.2,0.7,0.2,1)]"
                style={{
                  width: `${Math.max(2, Math.round((place.visits / MOST_VISITS) * 100))}%`,
                  transitionDelay: `${(0.3 + index * 0.15).toFixed(2)}s`,
                }}
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
      explored,
      style: {
        background: !explored
          ? "var(--fill)"
          : column > 8 && row < 5
            ? "var(--cycle)"
            : "var(--walk)",
        opacity: explored && distance > 1.2 ? 0.7 : 1,
        transitionDelay: `${(0.3 + column * 0.07 + row * 0.02).toFixed(2)}s`,
      },
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
        {squares.map(({ explored, style }, index) => (
          <span
            // biome-ignore lint/suspicious/noArrayIndexKey: fixed grid position
            key={index}
            className={`aspect-square rounded-[3px] motion-safe:transition-[background-color] motion-safe:duration-400 ${explored ? "unreached:bg-fill!" : ""}`}
            style={style}
          />
        ))}
      </div>
      <div className="flex items-center gap-3 border-line border-t pt-[18px]">
        <span className="rounded-lg bg-sun px-2.5 py-1 font-semibold text-on-sun text-sm">
          First
        </span>
        <span className="text-[15px]">First visit to a new area · 2 Oct</span>
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
    time: "08:05",
    title: "See your whole day on one map.",
    body: "Trace draws each route on the map. The line shows how you moved. Each evening, Trace writes a short story of your day.",
    note: "You can add notes and photos. You can also correct a stop that is not correct.",
    visual: <DayStoryCard />,
  },
  {
    id: "history",
    activity: "train",
    time: "09:37",
    title: "Look back at any day.",
    body: "Open a day, a week, a month or a year. Each day keeps its memory card, with its notes and photos.",
    visual: <HistoryCalendar />,
  },
  {
    id: "journey",
    activity: "drive",
    time: "17:45",
    title: "Play back a journey.",
    body: "Move the slider to go back in time. The map shows where you were and when.",
    visual: <Playback />,
  },
  {
    id: "places",
    activity: "place",
    time: "18:05",
    title: "Know your places.",
    body: "Trace finds the places that you go to frequently. See how frequently you go and when you usually arrive.",
    note: "Make a place private, and Trace keeps only a pin for it. Your exact location is not stored, synced or exported.",
    visual: <PlacesCard />,
  },
  {
    id: "explore",
    activity: "place",
    time: "20:30",
    title: "No streaks. No scores.",
    body: "A quiet day at home does not remove progress. As you go to new streets, your explored map fills in.",
    visual: <ExploreCard />,
  },
];

const STORY = [
  {
    icon: "train",
    colour: "var(--train)",
    text: "The morning train",
    time: "09:37",
  },
  {
    icon: "local_cafe",
    colour: "var(--drive)",
    text: "Coffee at Jewel",
    time: "13:10",
  },
  {
    icon: "waves",
    colour: "var(--drive)",
    text: "Out to the water",
    time: "18:05",
  },
];

const bezel = "clamp(8px,1.2vw,14px)";
const outerRadius = "clamp(28px,4vw,52px)";
const innerRadius = "clamp(20px,3.2vw,40px)";
const foldBlur = "blur(calc(var(--duo-fold) * 6px))";
// Corners on the hinge side stay square, open or folded, as on the device.
const awayFromHinge = (radius: string) => `0 ${radius} ${radius} 0`;

async function DuoPhone() {
  const [innerSnapshot, outerSnapshot] = await Promise.all([
    snapshotUrl(DUO_INNER_VIEW),
    snapshotUrl(DUO_OUTER_VIEW),
  ]);
  return (
    <div
      className="relative aspect-[1.4/1] w-full"
      style={{ transformStyle: "preserve-3d" }}
    >
      {/* The right half stays still; only the left half swings open. */}
      <div
        className="absolute inset-0"
        style={{ transformStyle: "preserve-3d" }}
      >
        {/* Right half of the inner display: the day. */}
        <div
          className="absolute top-0 left-1/2 h-full w-1/2 bg-ink shadow-[0_40px_80px_-30px_rgba(27,27,25,0.5)]"
          style={{
            padding: `${bezel} ${bezel} ${bezel} 0`,
            borderRadius: awayFromHinge(outerRadius),
          }}
        >
          <div
            className="relative size-full overflow-hidden bg-canvas"
            style={{
              borderRadius: awayFromHinge(innerRadius),
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
                Garden mornings. A slower evening.
              </span>
              <div className="flex gap-[clamp(10px,2.6vw,32px)]">
                {[
                  ["52.3 km", "travelled"],
                  ["1 h 51 m", "in motion"],
                  ["5", "places"],
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
            {/* Open, the status bar sits at the top of the same rail. */}
            <div
              aria-hidden="true"
              className="absolute inset-y-0 right-0 w-[17.7%]"
            >
              <span className="absolute inset-x-0 top-[5.5%] -translate-y-1/2 text-center font-semibold text-[clamp(8px,1.3vw,16px)] tracking-[-0.3px]">
                9:41
              </span>
              <Icon
                name="wifi"
                className="absolute inset-x-0 top-[11%] -translate-y-1/2 text-center text-[clamp(10px,1.8vw,24px)]"
              />
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
                <div
                  role="img"
                  aria-label="The map of Monday 5 October on the left half of the inner display."
                  className="absolute inset-0 bg-canvas"
                >
                  <DayMap
                    {...DUO_INNER_VIEW}
                    snapshot={innerSnapshot}
                    fontSize={12}
                    routes={JOURNEYS}
                    pins={DAY_PINS}
                  />
                </div>
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
              style={{
                padding: bezel,
                borderRadius: awayFromHinge(outerRadius),
              }}
            >
              <div
                className="relative flex size-full overflow-hidden bg-canvas"
                style={{ borderRadius: awayFromHinge(innerRadius) }}
              >
                <span
                  className="pointer-events-none absolute inset-0 z-[2]"
                  style={{
                    backdropFilter: foldBlur,
                    WebkitBackdropFilter: foldBlur,
                  }}
                />
                <div className="flex min-w-0 flex-1 flex-col">
                  <div className="relative h-[44%] w-full flex-none bg-canvas">
                    <DayMap
                      {...DUO_OUTER_VIEW}
                      snapshot={outerSnapshot}
                      fontSize={12}
                      labels={false}
                      routes={JOURNEYS}
                      pins={DAY_PINS.map(({ at }) => ({ at }))}
                    />
                  </div>
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
                        ["52.3 km", "travelled"],
                        ["5", "places"],
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
                {/* Folded, the camera and status bar sit in a rail away from the hinge. */}
                <div className="relative w-[18%] flex-none">
                  <span className="absolute top-[4%] left-1/2 aspect-square h-[5.8%] -translate-x-1/2 rounded-full bg-ink" />
                  <span className="absolute inset-x-0 top-[13%] -translate-y-1/2 text-center font-semibold text-[clamp(8px,1.3vw,16px)] tracking-[-0.3px]">
                    9:41
                  </span>
                  <Icon
                    name="wifi"
                    className="absolute inset-x-0 top-[18.5%] -translate-y-1/2 text-center text-[clamp(10px,1.8vw,24px)]"
                  />
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
    body: "Trace records nothing until you tap Start my journal. You can pause it from the app, the widget, the Lock Screen or Siri.",
  },
  {
    icon: "block",
    title: "No account and no ads",
    body: "You do not sign in. We do not sell your data or track you across other apps. iCloud sync is off by default. Trace sends no analytics.",
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
      "No. We do not operate servers that receive your journal. Your journal stays on your iPhone, or in your own iCloud account if you turn on iCloud sync. Trace encrypts it before it leaves your iPhone. Trace sends no analytics.",
  },
  {
    question: "Does Trace use much battery?",
    answer:
      "No. Trace uses the low-power location service of iOS. With the Always permission, Trace uses this service to fill in your full day.",
  },
  {
    question: "Does Trace record all the time?",
    answer:
      "No. Trace records nothing until you tap Start my journal. With the While Using permission, Trace records only when the app is open. You can pause Trace at any time, also from the Lock Screen.",
  },
  {
    question: "Do I need an account?",
    answer: "No. You do not need an account, and you do not sign in.",
  },
  {
    question: "Can I erase all my data?",
    answer:
      "Yes. In Settings, tap Erase Journal. This erases every day, place, route, memory and saved place, and the iCloud copy if you use iCloud sync. Your other devices keep the data that they downloaded before. Older backups of your iPhone can also contain earlier data.",
  },
];

async function Playback() {
  return (
    <JourneyPlayback
      view={PLAYBACK_VIEW}
      snapshot={await snapshotUrl(PLAYBACK_VIEW)}
    />
  );
}

export default async function Home() {
  const heroSnapshot = await snapshotUrl(HERO_VIEW);
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
              <AppStoreBadge />
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
          <div
            role="img"
            aria-label={DAY_MAP_LABEL}
            className="relative aspect-square w-full max-w-[560px] justify-self-center overflow-hidden rounded-[36px] bg-canvas"
          >
            <DayMap
              {...HERO_VIEW}
              snapshot={heroSnapshot}
              fontSize={16}
              strokeScale={1.6}
              routes={drawnRoutes([
                [0.1, 0.15],
                [0.3, 0.15],
                [0.5, 0.6],
                [1.15, 0.12],
                [1.35, 0.9],
                [2.3, 0.45],
                [2.8, 0.7],
              ])}
              // Each stop appears as its route arrives.
              pins={DAY_PINS.map((pin, i) =>
                i ? { ...pin, delay: [1.15, 2.2, 3.2, 3.7][i - 1] } : pin,
              )}
            />
            {/* The drawn map's credit; Apple Maps images carry their own. */}
            {!heroSnapshot && (
              <span className="absolute right-4 bottom-3 font-mono text-[10px] text-secondary">
                Map data: URA, geoBoundaries (ODbL)
              </span>
            )}
            <span className="absolute top-5 left-5 rounded-full bg-white/85 px-3 py-1.5 font-mono text-xs tracking-[1px]">
              MONDAY 5 OCT
            </span>
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
              {(["walk", "train", "drive", "place"] as const).map((kind) => {
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
              })}
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
            the day. This page follows the same day in Singapore, from the first
            walk to the evening back at Marina Bay Sands.
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
                  <div className="min-w-0 unreached:translate-y-10 unreached:opacity-0 motion-safe:[transition:opacity_0.7s_ease_0.1s,translate_0.9s_cubic-bezier(0.2,0.7,0.2,1)_0.1s]">
                    {chapter.visual}
                  </div>
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
            IPHONE DUO REQUIRES iOS 27.1
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
              Install Trace and tap Start my journal. Tonight, your day is on
              the map.
            </p>
            <AppStoreBadge />
          </section>
        </div>
      </div>
    </>
  );
}
