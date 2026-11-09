import type { Metadata } from "next";
import Link from "next/link";
import type { CSSProperties } from "react";
import { AppStoreBadge } from "@/components/app-store-badge";
import { DayMap, type MapPin, type MapView } from "@/components/day-map";
import { DayRibbon } from "@/components/day-ribbon";
import { HistoryCalendar } from "@/components/history-calendar";
import { JourneyPlayback } from "@/components/journey-playback";
import {
  ACTIVITIES,
  APPLE_PARK,
  DAY_POINTS,
  DAY_TOTALS,
  EVENING_DRIVE,
  INFINITE_LOOP,
  JOURNEYS,
  MAIN_STREET,
  SAMPLE_DAY,
  STAY_OPACITY,
  STEVENS_CREEK,
  VISITOR_CENTER,
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
    // Google reads this for the site name shown in search results.
    {
      "@type": "WebSite",
      name: BRAND,
      alternateName: [APP_STORE_NAME, "usetrace.app"],
      url: `${SITE_URL}/`,
    },
    {
      "@type": "SoftwareApplication",
      name: APP_STORE_NAME,
      alternateName: BRAND,
      description: DESCRIPTION,
      operatingSystem: `iOS ${MIN_IOS} or later`,
      applicationCategory: "LifestyleApplication",
      url: SITE_URL,
      image: `${SITE_URL}/images/app-icon.png`,
      downloadUrl: APP_STORE_URL,
      installUrl: APP_STORE_URL,
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

const wrap = "mx-auto w-full max-w-[1128px] px-[clamp(16px,5vw,56px)]";
const heading =
  "text-balance font-extrabold text-[clamp(42px,5.6vw,76px)] leading-none tracking-[-0.04em]";
const lead = "text-pretty text-[clamp(17px,1.6vw,20px)] leading-normal";
const card = "rounded-[28px] bg-surface";
const split =
  "mx-auto flex w-full max-w-[1040px] flex-col items-center justify-center gap-[clamp(40px,7vw,104px)] px-[clamp(16px,5vw,56px)] lg:flex-row";
const section = "py-[clamp(64px,8vw,112px)]";

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
const PHONE_VIEW: MapView = {
  width: 354,
  height: 300,
  fit: DAY_POINTS,
  padding: [52, 44, 44, 44],
};
const PLAYBACK_VIEW: MapView = {
  width: 560,
  height: 360,
  fit: EVENING_DRIVE,
  padding: 64,
};

const DAY_PINS: MapPin[] = [
  { at: APPLE_PARK, label: "Apple Park", side: "u" },
  { at: VISITOR_CENTER, side: "d" },
  { at: INFINITE_LOOP, label: "Infinite Loop", side: "l" },
  { at: MAIN_STREET, label: "Main Street", side: "d" },
  { at: STEVENS_CREEK, label: "Stevens Creek", side: "r" },
];

function RibbonStrip({ className }: { className: string }) {
  return (
    <div aria-hidden="true" className={`flex gap-0.5 ${className}`}>
      {SAMPLE_DAY.map((part, index) => (
        <span
          // biome-ignore lint/suspicious/noArrayIndexKey: fixed order of the day
          key={index}
          className="min-w-[3px] rounded-sm"
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

const TODAY_STATS = [
  [`${DAY_TOTALS.km} km`, "travelled"],
  [DAY_TOTALS.motion, "in motion"],
  [`${DAY_TOTALS.places}`, "places"],
];

const TODAY_TABS = ["Today", "History", "Places", "You"];

/**
 * The Today screen at iPhone 18 Pro size, 402 by 874 points, scaled to fit the
 * opening in Apple's bezel. The bezel is used as is.
 */
async function TodayPhone() {
  const snapshot = await snapshotUrl(PHONE_VIEW);
  return (
    <div
      role="img"
      aria-label={`The Today screen in Trace: a map of the day, with ${DAY_TOTALS.km} km travelled, ${DAY_TOTALS.motion} in motion and ${DAY_TOTALS.places} places.`}
      className="relative aspect-[1350/2760] w-[300px]"
    >
      <div className="absolute top-[2.5%] left-[5.333%] h-[95%] w-[89.333%] overflow-hidden bg-canvas">
        <div className="relative flex h-[874px] w-[402px] origin-top-left scale-[0.6667] flex-col px-6 pt-[18px] text-left">
          <div className="flex h-9 items-center justify-between px-5 font-semibold text-[17px]">
            <span>9:41</span>
            <svg
              viewBox="0 0 66 12"
              className="h-3 w-[66px]"
              fill="currentColor"
              aria-hidden="true"
            >
              <rect x="0" y="8" width="3" height="4" rx="1" />
              <rect x="4.5" y="5.5" width="3" height="6.5" rx="1" />
              <rect x="9" y="3" width="3" height="9" rx="1" />
              <rect x="13.5" y="0" width="3" height="12" rx="1" />
              <path d="M29 2.4c2.2 0 4.2.9 5.7 2.3l1.1-1.2A9.8 9.8 0 0 0 29 .7a9.8 9.8 0 0 0-6.8 2.8l1.1 1.2A8.2 8.2 0 0 1 29 2.4Zm0 3.8c1.2 0 2.3.5 3.1 1.2l1.2-1.2A6.2 6.2 0 0 0 29 4.5a6.2 6.2 0 0 0-4.3 1.7l1.2 1.2A4.5 4.5 0 0 1 29 6.2Zm0 3.8c-.7 0-1.3.3-1.7.7L29 12l1.7-1.3c-.4-.4-1-.7-1.7-.7Z" />
              <rect
                x="41.5"
                y="1"
                width="20"
                height="10"
                rx="3"
                fill="none"
                stroke="currentColor"
                opacity="0.4"
              />
              <rect x="43" y="2.5" width="17" height="7" rx="1.8" />
              <rect
                x="62.5"
                y="4"
                width="1.5"
                height="4"
                rx="0.75"
                opacity="0.5"
              />
            </svg>
          </div>
          <div className="mt-5 flex items-center gap-2 font-semibold text-[24px]">
            {/* biome-ignore lint/performance/noImgElement: static SVG artwork needs no optimisation */}
            <img src="/brand/logo.svg" alt="" width={24} height={24} />
            trace
          </div>
          <span className="mt-5 text-[20px] text-secondary">Monday</span>
          <span className="font-semibold text-[62px] leading-none tracking-[-1.5px]">
            5 Oct
          </span>
          <div className="mt-4 flex items-center justify-between gap-4">
            <span className="text-[17px] text-secondary leading-tight">
              A slow morning. The long way home.
            </span>
            <span className="shrink-0 rounded-full bg-surface px-4 py-2.5 font-semibold text-[15px]">
              Daily story
            </span>
          </div>
          <div className="mt-5 flex gap-8">
            {TODAY_STATS.map(([value, label]) => (
              <span key={label} className="flex flex-col">
                <span className="font-medium text-[26px]">{value}</span>
                <span className="text-[14px] text-secondary">{label}</span>
              </span>
            ))}
          </div>
          <div className="mt-5 overflow-hidden rounded-[28px] bg-surface">
            <div className="relative h-[300px] w-[354px]">
              <DayMap
                {...PHONE_VIEW}
                snapshot={snapshot}
                fontSize={13}
                routes={JOURNEYS}
                pins={DAY_PINS}
              />
            </div>
            <div className="flex flex-col gap-3 px-4 pt-4 pb-5">
              <span className="font-semibold text-[13px] text-secondary uppercase tracking-[1.5px]">
                A day in colour
              </span>
              <RibbonStrip className="h-6" />
            </div>
          </div>
          <div className="absolute inset-x-6 bottom-6 flex h-[62px] items-center justify-around rounded-full bg-surface font-semibold text-[13px] text-secondary shadow-[0_6px_20px_-8px_rgba(27,27,25,0.35)]">
            {TODAY_TABS.map((tab, index) => (
              <span key={tab} className={index === 0 ? "text-ink" : undefined}>
                {tab}
              </span>
            ))}
          </div>
        </div>
      </div>
      {/* biome-ignore lint/performance/noImgElement: fixed bitmap, sized by its parent */}
      <img
        src="/devices/iphone-18-pro-black-portrait.png"
        alt=""
        width={1350}
        height={2760}
        className="pointer-events-none absolute inset-0 size-full"
      />
    </div>
  );
}

/** A route under the last word of the tagline: a walk, then two journeys. */
function RouteLine() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 600 44"
      fill="none"
      className="absolute top-[0.84em] left-0 h-auto w-full overflow-visible"
    >
      <path
        d="M10 30C50 14 95 38 150 24"
        stroke="var(--walk)"
        strokeWidth="8"
        strokeLinecap="round"
        strokeDasharray="0.1 15"
        className="stop-in"
        style={{ "--stop-delay": "0.5s" } as CSSProperties}
      />
      <path
        d="M150 24C230 4 300 42 390 22"
        pathLength="1"
        stroke="var(--train)"
        strokeWidth="9"
        strokeLinecap="round"
        strokeDasharray="1"
        className="route-draw"
        style={
          { "--draw-delay": "0.7s", "--draw-duration": "0.6s" } as CSSProperties
        }
      />
      <path
        d="M390 22C460 6 530 34 590 14"
        pathLength="1"
        stroke="var(--drive)"
        strokeWidth="9"
        strokeLinecap="round"
        strokeDasharray="1"
        className="route-draw"
        style={
          {
            "--draw-delay": "1.25s",
            "--draw-duration": "0.6s",
          } as CSSProperties
        }
      />
      <g
        fill="var(--surface)"
        stroke="var(--ink)"
        strokeWidth="4"
        className="stop-in"
        style={{ "--stop-delay": "0.5s" } as CSSProperties}
      >
        <circle cx="10" cy="30" r="8" />
        <circle cx="150" cy="24" r="8" />
        <circle cx="390" cy="22" r="8" />
        <circle cx="590" cy="14" r="8" />
      </g>
    </svg>
  );
}

/** Paper pieces around the phone. Wide screens only. */
function PaperPieces() {
  return (
    <div aria-hidden="true" className="hidden lg:block">
      <div className="hero-rise absolute top-[30px] left-0 h-[270px] w-[320px] -rotate-[5deg] overflow-hidden rounded-[26px] bg-surface shadow-[0_18px_34px_-16px_rgba(70,55,30,0.5)]">
        <DayMap
          width={320}
          height={270}
          fit={DAY_POINTS}
          padding={40}
          strokeScale={1.8}
          routes={JOURNEYS}
          pins={DAY_PINS.map(({ at }) => ({ at }))}
        />
      </div>
      <div className="hero-rise absolute top-5 left-[206px] flex rotate-6 items-center gap-[7px] rounded-full bg-sun py-2 pr-[15px] pl-[9px] font-bold text-base text-on-sun shadow-[0_0_0_4px_var(--surface),0_8px_16px_-6px_rgba(70,55,30,0.45)]">
        <span className="flex size-6 items-center justify-center rounded-full bg-white/20">
          <Icon name="local_cafe" className="text-sm" />
        </span>
        Visitor Center
      </div>
      <div className="hero-rise absolute top-[236px] left-[18px] flex -rotate-6 items-center gap-[7px] rounded-full bg-ink py-2 pr-[15px] pl-[9px] font-bold text-base text-on-ink shadow-[0_0_0_4px_var(--surface),0_8px_16px_-6px_rgba(70,55,30,0.45)]">
        <span className="flex size-6 items-center justify-center rounded-full bg-white/20">
          <Icon name="location_on" className="text-sm" />
        </span>
        Apple Park
      </div>
      <div className="hero-rise absolute top-[360px] left-11 flex w-[300px] rotate-[4deg] rounded-[15px] bg-ink text-left text-on-night shadow-[0_16px_28px_-14px_rgba(27,27,25,0.6)]">
        <div className="min-w-0 flex-1 px-[15px] py-[13px]">
          <div className="font-extrabold text-[11px] text-night-secondary tracking-[1px]">
            DRIVE
          </div>
          <div className="font-bold text-lg">To the hills</div>
        </div>
        <div className="flex w-[72px] flex-none flex-col items-center justify-center border-[#5a5a55] border-l-2 border-dashed font-bold text-night-secondary text-xs">
          <span>17:31</span>
          <span>16 min</span>
        </div>
      </div>
      <div className="hero-rise absolute top-[70px] right-1.5 w-[300px] rotate-[5deg] rounded-3xl bg-surface px-5 py-[18px] text-left shadow-[0_18px_34px_-16px_rgba(70,55,30,0.5)]">
        <div className="flex items-baseline justify-between font-bold text-[15px] text-secondary">
          <span className="text-sun">Today</span>
          <span>Monday</span>
        </div>
        <div className="mt-1 font-extrabold text-[38px] tracking-[-0.8px]">
          {DAY_TOTALS.km} km
        </div>
        <div className="text-[15px] text-secondary">
          {DAY_TOTALS.motion} moving · {DAY_TOTALS.places} places
        </div>
        <RibbonStrip className="mt-3.5 h-3.5" />
      </div>
      <div className="hero-rise absolute top-[290px] right-[92px] flex size-32 -rotate-[9deg] flex-col items-center justify-center rounded-full border-3 border-sun font-extrabold text-[11px] text-sun tracking-[0.8px] shadow-[inset_0_0_0_4px_var(--canvas),inset_0_0_0_5px_var(--sun)]">
        <span>YOUR</span>
        <span className="text-[32px] leading-9 tracking-normal">1st</span>
        <span>DAY</span>
      </div>
    </div>
  );
}

const PLACES = [
  {
    name: "Apple Park",
    icon: "location_on",
    visits: 64,
    usual: "Usually arrives 20:08",
    private: true,
  },
  {
    name: "Infinite Loop",
    icon: "location_on",
    visits: 41,
    usual: "Usually arrives 09:39",
    private: false,
  },
  {
    name: "Apple Park Visitor Center",
    icon: "local_cafe",
    visits: 29,
    usual: "Usually arrives 08:12",
    private: false,
  },
  {
    name: "Main Street Cupertino",
    icon: "restaurant",
    visits: 18,
    usual: "Usually arrives 12:51",
    private: false,
  },
  {
    name: "Stevens Creek Reservoir",
    icon: "park",
    visits: 12,
    usual: "Usually arrives 17:47",
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
                  <span className="flex items-center gap-1 font-normal text-[13px] text-secondary">
                    <Icon name="lock" className="text-sm" />
                    Private
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

const FAQ = [
  {
    question: "Can you see where I go?",
    answer:
      "No. We do not operate servers that receive your journal. Your journal stays on your iPhone, or in your own iCloud account if you turn on iCloud sync. Trace encrypts it before it leaves your iPhone. Trace sends no analytics.",
  },
  {
    question: "Does Trace use much battery?",
    answer:
      "Trace uses the low-power location service of iOS. With the Always permission, Trace uses this service to fill in your full day.",
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
    question: "Can I bring my Google Maps Timeline history?",
    answer: (
      <>
        Yes. Export your Timeline from the Google Maps app on your phone. Then
        in Trace, open Settings and tap Import Google Timeline.{" "}
        <Link
          href="/google-maps-timeline-alternative"
          className="text-on-night underline underline-offset-4"
        >
          Compare Trace and Google Maps Timeline
        </Link>
        .
      </>
    ),
  },
  {
    question: "Can I erase all my data?",
    answer:
      "Yes. In Settings, tap Erase Journal. This erases every day, place, route, memory and saved place, and the iCloud copy if you use iCloud sync. Your other devices keep the data that they downloaded before. Older backups of your iPhone can also contain earlier data.",
  },
];

const NOTES = [
  ["Once", "Tap Start my journal."],
  ["All day", "Trace notes the places and the routes."],
  ["Each evening", "You get a short story of your day."],
];

const BEFORE = [
  [
    "Try a sample day",
    "Explore a sample day before Trace asks for your location.",
  ],
  [
    "Pick the permission",
    "With Always, Trace fills in your full day. With While Using, Trace records only when the app is open.",
  ],
  ["Battery use", "Trace uses the low-power location service of iOS."],
  [
    "Works with your iPhone",
    `Use the Home Screen widget, Live Activity, and Siri and Shortcuts. Trace requires iOS ${MIN_IOS} or later.`,
  ],
  [
    "Ready for iPhone Duo",
    "Open the phone to see the map and your day side by side. iPhone Duo requires iOS 27.1.",
  ],
  ["iCloud sync", "Optional and encrypted. It is off by default."],
];

async function Playback() {
  return (
    <JourneyPlayback
      view={PLAYBACK_VIEW}
      snapshot={await snapshotUrl(PLAYBACK_VIEW)}
    />
  );
}

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
        <section
          aria-labelledby="hero-heading"
          className="relative flex flex-col items-center gap-[18px] overflow-hidden px-[clamp(16px,5vw,56px)] pt-[clamp(24px,4vw,48px)] pb-28 text-center"
        >
          <p className="tag-drop mb-1.5 inline-flex -rotate-2 rounded-[13px] bg-ink text-left font-bold text-[clamp(15px,1.5vw,18px)] text-on-ink tracking-[-0.1px] shadow-[0_14px_24px_-14px_rgba(27,27,25,0.6)]">
            <span className="px-4 py-2.5">A private location timeline</span>
            <span className="flex items-center border-[#5a5a55] border-l-2 border-dashed px-3.5 py-2.5 font-extrabold text-[0.75em] text-night-secondary uppercase tracking-[1px]">
              for iPhone
            </span>
          </p>
          <h1
            id="hero-heading"
            className="pb-[0.2em] font-extrabold text-[clamp(60px,10vw,148px)] leading-[0.94] tracking-[-0.045em]"
          >
            {TAGLINE.slice(0, accentAt)}
            <span className="relative inline-block whitespace-nowrap text-sun">
              {TAGLINE.slice(accentAt)}
              <RouteLine />
            </span>
          </h1>
          <p className="max-w-[44ch] text-[#3a3a35] text-[clamp(18px,1.7vw,22px)] leading-[1.45]">
            {SUMMARY}
          </p>
          <div
            id="download"
            className="mt-1.5 flex scroll-mt-6 flex-wrap items-center justify-center gap-[18px]"
          >
            <AppStoreBadge campaign="home" />
            <span className="text-[#3a3a35] text-[15px]">
              No account. No ads.
            </span>
          </div>
          <div className="relative mt-7 flex w-full max-w-[1160px] justify-center">
            <TodayPhone />
            <PaperPieces />
          </div>
          <div className="pointer-events-none absolute inset-x-0 bottom-0 z-10 h-24 bg-linear-to-b from-transparent to-fill" />
        </section>

        <section className={`bg-fill ${section}`}>
          <div className={`${wrap} flex flex-col gap-[clamp(28px,4vw,48px)]`}>
            <h2 className={`${heading} max-w-[14ch]`}>
              Your day records itself.
            </h2>
            <ul className="grid grid-cols-[repeat(auto-fit,minmax(min(100%,300px),1fr))] gap-5">
              {NOTES.map(([when, what]) => (
                <li
                  key={when}
                  className="flex flex-col gap-2 rounded-[20px] bg-surface p-6"
                >
                  <span className="font-bold text-[15px] text-secondary">
                    {when}
                  </span>
                  <span className="font-bold text-[23px] leading-7 tracking-[-0.3px]">
                    {what}
                  </span>
                </li>
              ))}
            </ul>
            <div>
              <DayRibbon />
            </div>
          </div>
        </section>

        <section
          id="privacy"
          aria-labelledby="privacy-heading"
          className="bg-sun py-[clamp(72px,9vw,128px)] text-on-sun"
        >
          <div className="mx-auto flex max-w-[880px] flex-col items-center gap-[22px] px-[clamp(16px,5vw,56px)] text-center">
            <div className="flex size-[132px] -rotate-[8deg] flex-col items-center justify-center rounded-full border-3 border-on-sun font-extrabold text-[11px] tracking-[0.8px] shadow-[inset_0_0_0_4px_var(--sun),inset_0_0_0_5px_var(--on-sun)]">
              <span>STAYS ON</span>
              <span className="text-xl tracking-normal">THIS</span>
              <span>IPHONE</span>
            </div>
            <h2
              id="privacy-heading"
              className="text-balance font-extrabold text-[clamp(46px,7vw,100px)] leading-[0.98] tracking-[-0.045em]"
            >
              Your journal stays on your iPhone.
            </h2>
            <p className="max-w-[44ch] text-[clamp(18px,1.7vw,22px)] leading-[1.45]">
              We do not receive your journal, so we cannot read it, sell it or
              lose it in a data breach. Trace records nothing until you tap
              Start my journal.
            </p>
            <Link
              href="/privacy"
              className="inline-flex min-h-11 items-center font-semibold underline underline-offset-[5px]"
            >
              Read the privacy policy
            </Link>
          </div>
        </section>

        <section className={`bg-night text-on-night ${section}`}>
          <div className={split}>
            <div className="w-full max-w-[420px] flex-none text-ink">
              <HistoryCalendar />
            </div>
            <div className="flex min-w-0 flex-col gap-[18px]">
              <p className="font-bold text-base text-peach">History</p>
              <h2 className={heading}>Find any day, months later.</h2>
              <p className={`max-w-[36ch] text-night-secondary ${lead}`}>
                Where was I on that Saturday in March? Open the day. The map
                shows each place in order.
              </p>
            </div>
          </div>
        </section>

        <section className={section}>
          <article className={split}>
            <div className="flex min-w-0 flex-1 flex-col gap-[18px]">
              <p className="font-bold text-base text-sun">Playback</p>
              <h2 className={heading}>Play back a journey.</h2>
              <p className={`max-w-[36ch] text-body ${lead}`}>
                Move the slider to go back in time. The map shows where you were
                and when.
              </p>
            </div>
            <div className="w-full min-w-0 flex-1">
              <Playback />
            </div>
          </article>
        </section>

        <section className={`bg-fill ${section}`}>
          <div className={split}>
            <div className="w-full min-w-0 flex-1">
              <PlacesCard />
            </div>
            <div className="flex min-w-0 flex-1 flex-col gap-[18px]">
              <p className="font-bold text-base text-sun">Places</p>
              <h2 className={heading}>Know the places you go.</h2>
              <p className={`max-w-[36ch] text-body ${lead}`}>
                See how frequently you go and when you usually arrive. Make a
                place private, and Trace keeps only a pin.
              </p>
            </div>
          </div>
        </section>

        <section className={section}>
          <div className={split}>
            <div className="flex min-w-0 flex-1 flex-col gap-[18px]">
              <p className="font-bold text-base text-sun">Explored map</p>
              <h2 className={heading}>No streaks. No scores.</h2>
              <p className={`max-w-[36ch] text-body ${lead}`}>
                A quiet day at home does not remove progress. As you go to new
                streets, your explored map fills in.
              </p>
            </div>
            <div className="w-full min-w-0 flex-1">
              <ExploreCard />
            </div>
          </div>
        </section>

        <section className={`bg-fill ${section}`}>
          <div className="mx-auto flex max-w-[880px] flex-col items-center gap-[18px] px-[clamp(16px,5vw,56px)] text-center">
            <p className="font-bold text-base text-sun">Google Maps Timeline</p>
            <h2 className={heading}>Bring your history with you.</h2>
            <p className={`max-w-[46ch] text-body ${lead}`}>
              Export your Timeline from the Google Maps app on your phone. Then
              in Trace, open Settings and tap Import Google Timeline.
            </p>
            <Link
              href="/google-maps-timeline-alternative"
              className="inline-flex min-h-11 items-center font-semibold underline underline-offset-[5px]"
            >
              Compare Trace and Google Maps Timeline
            </Link>
          </div>
        </section>

        <section className={section}>
          <div className={`${wrap} flex flex-col gap-[clamp(28px,4vw,44px)]`}>
            <h2 className={heading}>Before you start.</h2>
            <ul className="grid grid-cols-[repeat(auto-fit,minmax(min(100%,300px),1fr))] gap-[clamp(24px,4vw,48px)]">
              {BEFORE.map(([title, body]) => (
                <li
                  key={title}
                  className="flex flex-col gap-1.5 border-ink border-t-2 pt-4"
                >
                  <h3 className="font-bold text-[21px]">{title}</h3>
                  <p className="text-base text-body leading-normal">{body}</p>
                </li>
              ))}
            </ul>
            <AppStoreBadge campaign="home" />
          </div>
        </section>

        <section
          id="faq"
          aria-labelledby="faq-heading"
          className="bg-night py-[clamp(64px,8vw,104px)] text-on-night [--line:var(--night-line)] [--secondary:var(--night-secondary)]"
        >
          <div className="mx-auto flex max-w-[1040px] flex-wrap gap-[clamp(24px,5vw,72px)] px-[clamp(16px,5vw,56px)]">
            <h2
              id="faq-heading"
              className="flex-[1_1_220px] font-extrabold text-[clamp(34px,4vw,52px)] leading-none tracking-[-0.03em]"
            >
              Questions
            </h2>
            <div className="min-w-0 flex-[999_1_560px] border-line border-t">
              {FAQ.map((item) => (
                <details
                  key={item.question}
                  className="group border-line border-b"
                >
                  <summary className="flex min-h-16 cursor-pointer list-none items-center justify-between gap-4 font-semibold text-lg [&::-webkit-details-marker]:hidden">
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
          </div>
        </section>

        <section
          aria-labelledby="cta-heading"
          className="py-[clamp(72px,9vw,128px)]"
        >
          <div className="mx-auto flex max-w-[880px] flex-col items-center gap-[22px] px-[clamp(16px,5vw,56px)] text-center">
            {/* biome-ignore lint/performance/noImgElement: static SVG artwork needs no optimisation */}
            <img src="/brand/logo.svg" alt="" width={92} height={92} />
            <h2
              id="cta-heading"
              className="font-extrabold text-[clamp(50px,8vw,112px)] leading-[0.96] tracking-[-0.045em]"
            >
              Start your <span className="text-sun">first day.</span>
            </h2>
            <p className="max-w-[36ch] text-[#3a3a35] text-[clamp(18px,1.7vw,22px)] leading-[1.45]">
              Install Trace and tap Start my journal. Tonight, your day is on
              the map.
            </p>
            <AppStoreBadge campaign="home" />
          </div>
        </section>
      </div>
    </>
  );
}
