import type { Metadata } from "next";
import Link from "next/link";
import { AppStoreBadge } from "@/components/app-store-badge";
import { ComparisonTable } from "@/components/comparison-table";
import {
  CHECKED,
  DESCRIPTION,
  FAQ,
  GOOGLE_HELP_URL,
  HEADING,
  IMPORT_PRIVACY,
  INTRO,
  KEEP_GOOGLE,
  PATH,
  ROWS,
  STEPS,
  TITLE,
  UPDATED,
} from "@/lib/google-maps-timeline";
import {
  APP_STORE_NAME,
  BRAND,
  MIN_IOS,
  SHARE_IMAGE,
  SITE_URL,
  TWITTER_IMAGE,
} from "@/lib/site";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: PATH },
  openGraph: {
    type: "website",
    siteName: BRAND,
    url: PATH,
    title: TITLE,
    description: DESCRIPTION,
    images: SHARE_IMAGE,
  },
  twitter: { title: TITLE, description: DESCRIPTION, images: TWITTER_IMAGE },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebPage",
      name: TITLE,
      description: DESCRIPTION,
      url: `${SITE_URL}${PATH}`,
      dateModified: UPDATED,
      about: {
        "@type": "SoftwareApplication",
        name: APP_STORE_NAME,
        alternateName: BRAND,
        operatingSystem: `iOS ${MIN_IOS} or later`,
        applicationCategory: "LifestyleApplication",
        url: SITE_URL,
      },
      mentions: { "@type": "SoftwareApplication", name: "Google Maps" },
    },
    {
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: BRAND, item: SITE_URL },
        {
          "@type": "ListItem",
          position: 2,
          name: TITLE,
          item: `${SITE_URL}${PATH}`,
        },
      ],
    },
    {
      "@type": "FAQPage",
      mainEntity: FAQ.map((item) => ({
        "@type": "Question",
        name: item.question,
        acceptedAnswer: { "@type": "Answer", text: item.answer },
      })),
    },
  ],
};

// Same scale and type as the home page.
const wrap = "mx-auto w-full max-w-[1240px] px-[clamp(20px,5vw,56px)]";
const eyebrow = "font-mono text-secondary text-xs tracking-[1.2px]";
const sectionHeading =
  "text-balance font-semibold text-[clamp(34px,4.6vw,60px)] leading-none tracking-[-0.035em]";
const lead =
  "text-pretty text-[clamp(17px,1.6vw,20px)] text-body leading-normal";
const card = "rounded-[32px] border border-line bg-surface";
const underline =
  "underline decoration-[#c9c4b6] underline-offset-[5px] motion-safe:transition-colors hover:decoration-ink";

function Icon({ name, className = "" }: { name: string; className?: string }) {
  return (
    <span aria-hidden="true" className={`icon ${className}`}>
      {name}
    </span>
  );
}

// What the import does, from GoogleTimelineImport.swift in the app.
const IMPORT_RESULTS = [
  { icon: "check_circle", text: "Stays and journeys" },
  { icon: "check_circle", text: "Only days with nothing in your journal" },
  { icon: "lock", text: "Read on your iPhone" },
];

export default function Page() {
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
          className={`${wrap} grid grid-cols-[repeat(auto-fit,minmax(min(100%,440px),1fr))] items-center gap-[clamp(40px,6vw,80px)] pt-[clamp(32px,6vw,72px)] pb-[clamp(72px,10vw,136px)]`}
        >
          <div className="flex flex-col gap-7">
            <p className={eyebrow}>GOOGLE MAPS TIMELINE ALTERNATIVE</p>
            <h1
              id="hero-heading"
              className="text-balance font-semibold text-[clamp(40px,5.2vw,70px)] leading-[0.95] tracking-[-0.045em]"
            >
              {HEADING}
            </h1>
            <p className="max-w-[34ch] text-pretty text-[#3a3a35] text-[clamp(19px,2vw,23px)] leading-[1.45]">
              {INTRO}
            </p>
            <div className="flex flex-wrap items-center gap-5">
              <AppStoreBadge campaign="google-timeline" />
              <a
                href="#compare"
                className={`font-medium text-[15px] ${underline}`}
              >
                Compare the two apps
              </a>
            </div>
            <ul className="flex flex-wrap gap-x-5 gap-y-2 border-line border-t pt-[18px] font-mono text-secondary text-xs tracking-[1px]">
              <li>NO GOOGLE ACCOUNT</li>
              <li>IMPORTS YOUR TIMELINE</li>
              <li>ENCRYPTED ON YOUR IPHONE</li>
            </ul>
          </div>

          {/* The import at a glance: Google's file goes in, a Trace journal comes out. */}
          <div
            aria-hidden="true"
            className="flex w-full max-w-[480px] flex-col items-center justify-self-center"
          >
            <div className={`${card} flex w-full items-center gap-4 p-5`}>
              <span className="flex size-14 flex-none items-center justify-center rounded-2xl bg-fill font-mono font-semibold text-secondary text-xs">
                JSON
              </span>
              <span className="min-w-0">
                <span className="block truncate font-mono text-[15px]">
                  location-history.json
                </span>
                <span className="block text-secondary text-sm">
                  Exported from Google Maps
                </span>
              </span>
            </div>
            <span className="flex h-16 items-center">
              <span className="h-full w-px bg-line" />
              <Icon
                name="arrow_forward"
                className="absolute rotate-90 rounded-full border border-line bg-canvas p-1.5 text-sun text-xl"
              />
            </span>
            <div className={`${card} w-full overflow-hidden`}>
              <div className="flex items-center gap-4 border-line border-b p-5">
                {/* biome-ignore lint/performance/noImgElement: static SVG artwork needs no optimisation */}
                <img
                  src="/brand/logo.svg"
                  alt=""
                  width={56}
                  height={56}
                  className="size-14 flex-none rounded-[22.37%]"
                />
                <span>
                  <span className="block font-semibold text-[17px]">
                    Import Google Timeline
                  </span>
                  <span className="block text-secondary text-sm">
                    {BRAND} Settings
                  </span>
                </span>
              </div>
              <ul className="flex flex-col gap-3.5 p-5">
                {IMPORT_RESULTS.map((result) => (
                  <li
                    key={result.text}
                    className="flex items-center gap-3 text-[15px]"
                  >
                    <Icon
                      name={result.icon}
                      className="text-[22px] text-walk"
                    />
                    {result.text}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        {/* Comparison */}
        <section
          id="compare"
          aria-labelledby="compare-heading"
          className={`${wrap} scroll-mt-6 pb-[clamp(72px,10vw,136px)]`}
        >
          <div className="mb-[clamp(28px,4vw,44px)] flex flex-col gap-5">
            <p className={eyebrow}>SIDE BY SIDE</p>
            <h2 id="compare-heading" className={sectionHeading}>
              {BRAND} and Google Maps Timeline
            </h2>
          </div>

          <ComparisonTable other="Google Maps Timeline" rows={ROWS} />
          <p className="mt-4 text-secondary text-sm leading-relaxed">
            We checked the facts about Google Maps Timeline in{" "}
            <time dateTime={UPDATED}>{CHECKED}</time>, on{" "}
            <a href={GOOGLE_HELP_URL} className={underline}>
              Google Maps Help
            </a>
            . Google can change Timeline at any time.
          </p>
        </section>

        {/* Switch */}
        <section
          aria-labelledby="switch-heading"
          className={`${wrap} pb-[clamp(96px,12vw,160px)]`}
        >
          <div className="mb-[clamp(28px,4vw,44px)] grid grid-cols-[repeat(auto-fit,minmax(min(100%,380px),1fr))] items-end gap-[clamp(20px,4vw,64px)]">
            <div className="flex flex-col gap-5">
              <p className={eyebrow}>IMPORT GOOGLE TIMELINE</p>
              <h2 id="switch-heading" className={sectionHeading}>
                Move to {BRAND} in three steps.
              </h2>
            </div>
            <p className={`max-w-[40ch] ${lead}`}>{IMPORT_PRIVACY}</p>
          </div>
          <ol className="grid grid-cols-[repeat(auto-fit,minmax(min(100%,280px),1fr))] gap-3">
            {STEPS.map((step, index) => (
              <li
                key={step.heading}
                className={`${card} flex flex-col gap-3 p-[clamp(24px,3vw,32px)]`}
              >
                <span className="font-mono font-semibold text-[clamp(44px,5vw,60px)] text-sun leading-none tracking-[-2px]">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <h3 className="mt-4 font-semibold text-[21px] tracking-[-0.3px]">
                  {step.heading}
                </h3>
                <p className="text-base text-secondary leading-[1.55]">
                  {step.body}
                </p>
              </li>
            ))}
          </ol>
        </section>

        {/* Night: when to keep Google, questions, download. */}
        <div className="bg-night text-on-night [--line:var(--night-line)] [--secondary:var(--night-secondary)]">
          <section
            aria-labelledby="keep-heading"
            className={`${wrap} pt-[clamp(80px,11vw,152px)] pb-[clamp(64px,8vw,112px)]`}
          >
            <div className="grid grid-cols-[repeat(auto-fit,minmax(min(100%,380px),1fr))] items-start gap-[clamp(28px,5vw,72px)]">
              <div className="flex flex-col gap-6">
                <p className={eyebrow}>TO BE FAIR</p>
                <h2
                  id="keep-heading"
                  className="max-w-[14ch] text-balance font-semibold text-[clamp(40px,6vw,80px)] leading-[0.95] tracking-[-0.045em]"
                >
                  When to keep Google Maps Timeline.
                </h2>
              </div>
              <ul className="flex flex-col">
                {KEEP_GOOGLE.map((item) => (
                  <li
                    key={item}
                    className="flex gap-4 border-line border-t py-6 text-[clamp(18px,1.8vw,21px)] leading-normal"
                  >
                    <Icon
                      name="arrow_forward"
                      className="mt-1 flex-none text-peach text-xl"
                    />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
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
                  <summary className="flex min-h-16 cursor-pointer list-none items-center justify-between gap-4 py-3 font-medium text-lg [&::-webkit-details-marker]:hidden">
                    {item.question}
                    <Icon
                      name="add"
                      className="text-2xl text-secondary motion-safe:transition-transform group-open:rotate-45"
                    />
                  </summary>
                  <p className="max-w-[62ch] pb-6 text-base text-secondary leading-relaxed">
                    {item.answer}
                  </p>
                </details>
              ))}
              <p className="mt-5 text-[15px] text-secondary">
                To learn what {BRAND} does with your data, read the{" "}
                <Link
                  href="/privacy"
                  className="text-on-night underline underline-offset-4"
                >
                  Privacy Policy
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
              Bring your days home.
            </h2>
            <p className="max-w-[36ch] text-[19px] text-secondary leading-normal">
              {BRAND} and the import are free. Install {BRAND} and import your
              Google Timeline. Your old days and your new days stay on your
              iPhone.
            </p>
            <AppStoreBadge campaign="google-timeline" />
            <Link
              href="/"
              className="font-medium text-[15px] underline decoration-[#4a4e55] underline-offset-[5px] motion-safe:transition-colors hover:decoration-on-night"
            >
              See all the features of {BRAND}
            </Link>
          </section>
        </div>
      </div>
    </>
  );
}
