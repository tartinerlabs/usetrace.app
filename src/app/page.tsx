import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";
import { Faq, type FaqItem } from "@/components/faq";
import {
  APP_STORE_NAME,
  APP_STORE_URL,
  BRAND,
  COMPANY,
  DESCRIPTION,
  MIN_IOS,
  SITE_URL,
  SUMMARY,
  TAGLINE,
} from "@/lib/site";
import { AppStoreBadge } from "./components/app-store-badge";
import {
  type Activity,
  DayRibbon,
  type RibbonSegment,
  RouteSwatch,
  RouteThread,
} from "./components/route-motif";

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
  publisher: { "@type": "Organization", name: COMPANY },
  ...(APP_STORE_URL
    ? { downloadUrl: APP_STORE_URL, installUrl: APP_STORE_URL }
    : {}),
};

// An illustrative day: stays in fill, moves in their activity colour.
const sampleDay: RibbonSegment[] = [
  { id: "home", kind: "stay", minutes: 480 },
  { id: "walk-1", kind: "walk", minutes: 25 },
  { id: "cafe", kind: "stay", minutes: 60 },
  { id: "train", kind: "train", minutes: 40 },
  { id: "office", kind: "stay", minutes: 300 },
  { id: "walk-2", kind: "walk", minutes: 15 },
  { id: "lunch", kind: "stay", minutes: 60 },
  { id: "cycle", kind: "cycle", minutes: 35 },
  { id: "park", kind: "stay", minutes: 90 },
  { id: "bus", kind: "bus", minutes: 30 },
  { id: "evening", kind: "stay", minutes: 305 },
];

// Labels match the app's activity names in TraceTheme.swift.
const routeLegend: { activity: Activity; label: string }[] = [
  { activity: "walk", label: "Walking" },
  { activity: "cycle", label: "Cycling" },
  { activity: "train", label: "Train" },
  { activity: "flight", label: "Flight" },
];

// Rows of an illustrative explored map; "#" is a square you've moved through.
const exploredRows = [
  "..##......",
  ".####.....",
  "..#####...",
  "...##.##..",
  "....#..##.",
  "....##.###",
];

const privacyPromises = [
  "Trace records nothing until you tap Start recording. You can pause Trace at any time.",
  "Trace stores your journal on your iPhone and encrypts its sensitive contents.",
  "We do not operate servers that receive your journal. We cannot read your journal.",
  "iCloud sync is optional and is off by default. If you turn it on, Trace encrypts your journal on your iPhone before it sends the journal to your own iCloud account.",
  "Some features use Apple services. For example, Trace uses Apple Maps to name the places that you visit.",
  "Usage analytics are optional and are off by default. They never include your movement history.",
  "We do not sell your data, show ads, or track you across other apps or websites.",
];

const faqItems: FaqItem[] = [
  {
    question: "Does Trace record all the time?",
    answer: (
      <>
        <p>
          No. Trace records nothing until you tap Start recording. With the
          While Using permission, Trace records only when the app is open. With
          the Always permission, Trace uses low-power location to fill in the
          full day.
        </p>
        <p>
          You can pause Trace at any time. You can also pause it from the Lock
          Screen.
        </p>
      </>
    ),
  },
  {
    question: "Where is my data stored?",
    answer: (
      <p>
        Trace stores your journal on your iPhone and encrypts its sensitive
        contents. iCloud sync is optional and is off by default. If you turn it
        on, Trace encrypts your journal on your iPhone before it sends the
        journal to your own iCloud account.
      </p>
    ),
  },
  {
    question: "Do I need an account?",
    answer: <p>No. You do not need an account, and you do not sign in.</p>,
  },
  {
    question: "Does Trace use a lot of battery power?",
    answer: (
      <p>
        With the Always permission, Trace uses low-power location to fill in
        your day.
      </p>
    ),
  },
  {
    question: "Can I delete everything?",
    answer: (
      <p>
        Yes. Erase Journal in Settings erases every day, place, route, memory
        and saved place. One tap erases all of them permanently.
      </p>
    ),
  },
];

const headingClass =
  "wrap-break-word font-rounded font-semibold text-[clamp(1.75rem,4vw,2.75rem)] leading-tight tracking-tight";
const containerClass = "mx-auto w-full max-w-6xl px-4 sm:px-6";

function Eyebrow({ children }: { children: ReactNode }) {
  return (
    <p className="font-rounded font-semibold text-sun text-sm uppercase tracking-[0.12em]">
      {children}
    </p>
  );
}

function TabSection({
  id,
  tab,
  title,
  visual,
  reverse = false,
  children,
}: {
  id: string;
  tab: string;
  title: string;
  visual: ReactNode;
  reverse?: boolean;
  children: ReactNode;
}) {
  const headingId = `${id}-heading`;
  return (
    <section
      id={id}
      aria-labelledby={headingId}
      className={`${containerClass} grid grid-cols-1 items-center gap-10 py-12 md:grid-cols-2 md:gap-16 md:py-16`}
    >
      <div className={`space-y-5 ${reverse ? "md:order-2" : ""}`}>
        <Eyebrow>{tab}</Eyebrow>
        <h2 id={headingId} className={headingClass}>
          {title}
        </h2>
        <div className="space-y-4 text-lg text-secondary leading-relaxed">
          {children}
        </div>
      </div>
      <div className={reverse ? "md:order-1" : ""}>{visual}</div>
    </section>
  );
}

function Illustration({ src, alt }: { src: string; alt: string }) {
  return (
    <Image
      src={src}
      alt={alt}
      width={960}
      height={960}
      sizes="(min-width: 768px) 32rem, 100vw"
      className="h-auto w-full rounded-card border border-line"
    />
  );
}

function Card({ children }: { children: ReactNode }) {
  return (
    <div className="rounded-card border border-line bg-surface p-6 sm:p-8">
      {children}
    </div>
  );
}

function Thread({ activity }: { activity: Activity }) {
  return (
    <div className={`${containerClass} opacity-80`}>
      <RouteThread activity={activity} />
    </div>
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

      {/* Hero */}
      <section
        aria-labelledby="hero-heading"
        className={`${containerClass} grid grid-cols-1 items-center gap-10 pt-10 pb-12 md:grid-cols-2 md:gap-16 md:pt-16 md:pb-20`}
      >
        <div className="space-y-6">
          <h1
            id="hero-heading"
            className="wrap-break-word font-rounded font-semibold text-[clamp(2.5rem,7vw,4.5rem)] leading-[1.05] tracking-tight"
          >
            {TAGLINE.slice(0, accentAt)}
            <span className="text-sun">{TAGLINE.slice(accentAt)}</span>
          </h1>
          <p className="max-w-xl text-[clamp(1.125rem,2.2vw,1.375rem)] leading-relaxed">
            {SUMMARY}
          </p>
          <p className="text-secondary">
            Trace is a private, automatic location timeline for iPhone.
          </p>
          <AppStoreBadge location="hero" />
        </div>
        <Image
          src="/images/onboarding-everyday.webp"
          alt="An illustrated map of a day. A route goes from a house, past a café, to a park at the waterfront."
          width={960}
          height={960}
          sizes="(min-width: 768px) 32rem, 100vw"
          loading="eager"
          fetchPriority="high"
          className="h-auto w-full rounded-card border border-line"
        />
      </section>

      <div className={containerClass}>
        <DayRibbon segments={sampleDay} />
      </div>

      {/* Today */}
      <TabSection
        id="today"
        tab="Today"
        title="Your full day, on one map."
        visual={
          <Illustration
            src="/images/onboarding-example.webp"
            alt="A sample day on Monday 5 October. A route goes from Home through Dempsey Hill to Office. The story shows “A slow morning at home” and “Coffee at Dempsey Hill”."
          />
        }
      >
        <p>
          The map shows the route of your full day. The style of each line shows
          how you moved. A ribbon shows each part of the day in proportion to
          its time. A story tells the day in chronological order.
        </p>
        <ul className="flex flex-wrap gap-x-5 gap-y-2 text-base">
          {routeLegend.map(({ activity, label }) => (
            <li key={activity} className="flex items-center gap-2">
              <RouteSwatch activity={activity} />
              {label}
            </li>
          ))}
        </ul>
        <p>
          You can correct the times of a stay. You can also split a stay, or
          join it with a different stay. You can add notes and photos. You can
          also add a moment that Trace did not record.
        </p>
        <p>
          Trace writes the story of each day on your device. On supported
          devices with iOS 26 or later, Trace uses Apple Intelligence. On other
          devices, the story is a factual summary.
        </p>
      </TabSection>

      <Thread activity="walk" />

      {/* Journey */}
      <TabSection
        id="journey"
        tab="Journey"
        title="Replay the way you went."
        reverse
        visual={<Illustration src="/images/onboarding-first-day.webp" alt="" />}
      >
        <p>
          Replay the route of the day. A scrubber controls the replay. The
          replay shows the time and each station in sequence.
        </p>
      </TabSection>

      <Thread activity="cycle" />

      {/* History */}
      <TabSection
        id="history"
        tab="History"
        title="Every day, kept in order."
        visual={
          <Card>
            <ul className="grid grid-cols-2 gap-3 sm:grid-cols-4">
              {["Day", "Week", "Month", "Year"].map((view, index) => (
                <li
                  key={view}
                  className={`rounded-small px-3 py-2 text-center font-medium ${
                    index === 0 ? "bg-ink text-on-ink" : "bg-fill"
                  }`}
                >
                  {view}
                </li>
              ))}
            </ul>
            <DayRibbon segments={sampleDay} className="mt-8" />
            <DayRibbon
              segments={[...sampleDay].reverse()}
              className="mt-3 opacity-70"
            />
            <DayRibbon
              segments={sampleDay.slice(2)}
              className="mt-3 opacity-50"
            />
          </Card>
        }
      >
        <p>
          Look at past days in the Day, Week, Month and Year views. Move through
          the calendar, and look again at the memory card for each day.
        </p>
      </TabSection>

      <Thread activity="train" />

      {/* Places */}
      <TabSection
        id="places"
        tab="Places"
        title="The places that are yours."
        reverse
        visual={
          <Card>
            <h3 className="font-rounded font-semibold text-xl">
              Keep a place private
            </h3>
            <p className="mt-3 text-secondary leading-relaxed">
              You can keep the exact location of a saved place private. Trace
              stores each location fix within approximately 100 m of the place
              as the pin of the place. Thus, the exact location never goes into
              storage, sync or export.
            </p>
          </Card>
        }
      >
        <p>
          Search the places that you go to frequently. For each place, see how
          frequently you go there, the pattern of your arrival times and your
          recent visits.
        </p>
      </TabSection>

      <Thread activity="flight" />

      {/* You */}
      <TabSection
        id="you"
        tab="You"
        title="Explore, with no scores."
        visual={
          <Card>
            <div aria-hidden="true" className="grid grid-cols-10 gap-1">
              {exploredRows.flatMap((row, y) =>
                [...row].map((cell, x) => (
                  <span
                    // biome-ignore lint/suspicious/noArrayIndexKey: fixed grid position
                    key={`${x}-${y}`}
                    className={`aspect-square rounded-[0.2rem] ${
                      cell === "#" ? "bg-walk" : "bg-fill"
                    }`}
                  />
                )),
              )}
            </div>
            <p className="mt-6 text-secondary text-sm">
              Each square is approximately 220 m wide.
            </p>
          </Card>
        }
      >
        <p>
          Your explored map fills in each square of approximately 220 m that you
          moved through. The map does not include flights. Milestones and dated
          firsts mark your path. On foot &amp; by bike shows your last 7 days.
        </p>
        <p>Trace has no streaks. A quiet day never removes progress.</p>
      </TabSection>

      {/* Works with iPhone */}
      <section
        aria-labelledby="iphone-heading"
        className={`${containerClass} py-12 md:py-16`}
      >
        <h2 id="iphone-heading" className={headingClass}>
          Works with iPhone
        </h2>
        <ul className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <li className="rounded-card border border-line bg-surface p-6">
            <h3 className="font-rounded font-semibold">iCloud sync</h3>
            <p className="mt-2 text-secondary leading-relaxed">
              iCloud sync is optional and encrypted. It is off by default.
            </p>
          </li>
          <li className="rounded-card border border-line bg-surface p-6">
            <h3 className="font-rounded font-semibold">Home Screen widget</h3>
            <p className="mt-2 text-secondary leading-relaxed">
              Pause Trace, or make it record again.
            </p>
          </li>
          <li className="rounded-card border border-line bg-surface p-6">
            <h3 className="font-rounded font-semibold">Live Activity</h3>
            <p className="mt-2 text-secondary leading-relaxed">
              Shows when you pause Trace.
            </p>
          </li>
          <li className="rounded-card border border-line bg-surface p-6">
            <h3 className="font-rounded font-semibold">Siri</h3>
            <ul className="mt-2 space-y-1 text-secondary leading-relaxed">
              <li>“Show today in Trace”</li>
              <li>“Get my day summary in Trace”</li>
              <li>“Pause recording in Trace”</li>
            </ul>
          </li>
        </ul>
        <p className="mt-6 text-secondary">
          You must use iOS {MIN_IOS} or later.
        </p>
      </section>

      {/* Privacy */}
      <section
        aria-labelledby="privacy-heading"
        className={`${containerClass} py-12 md:py-16`}
      >
        <div className="rounded-card border border-line bg-surface p-6 sm:p-10">
          <Eyebrow>Privacy</Eyebrow>
          <h2 id="privacy-heading" className={`${headingClass} mt-3`}>
            Yours, and only yours.
          </h2>
          <ul className="mt-8 grid grid-cols-1 gap-x-10 gap-y-4 md:grid-cols-2">
            {privacyPromises.map((promise) => (
              <li key={promise} className="flex gap-3 leading-relaxed">
                <span
                  aria-hidden="true"
                  className="mt-[0.6em] size-2 shrink-0 rounded-full bg-walk"
                />
                {promise}
              </li>
            ))}
          </ul>
          <p className="mt-8 font-rounded font-semibold text-lg">
            You do not need an account, and you do not sign in.
          </p>
          <Link
            href="/privacy"
            className="mt-4 inline-block font-medium underline decoration-line underline-offset-4 motion-safe:transition-colors hover:decoration-ink"
          >
            Read the privacy policy
          </Link>
        </div>
      </section>

      {/* FAQ */}
      <section
        aria-labelledby="faq-heading"
        className={`${containerClass} py-12 md:py-16`}
      >
        <div className="mx-auto max-w-3xl">
          <h2 id="faq-heading" className={headingClass}>
            Questions
          </h2>
          <div className="mt-8">
            <Faq items={faqItems} />
          </div>
          <p className="mt-6 text-secondary">
            The{" "}
            <Link
              href="/support"
              className="font-medium text-ink underline decoration-line underline-offset-4 motion-safe:transition-colors hover:decoration-ink"
            >
              support page
            </Link>{" "}
            has more answers.
          </p>
        </div>
      </section>

      {/* Closing CTA */}
      <section
        aria-labelledby="cta-heading"
        className={`${containerClass} pt-4 pb-20 md:pb-28`}
      >
        <div className="flex flex-col items-center gap-6 text-center">
          <RouteThread activity="walk" className="max-w-xs" />
          <h2
            id="cta-heading"
            className="wrap-break-word font-rounded font-semibold text-[clamp(2rem,5vw,3.5rem)] leading-tight tracking-tight"
          >
            {TAGLINE}
          </h2>
          <AppStoreBadge location="footer-cta" />
        </div>
      </section>
    </>
  );
}
