import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { AppStoreBadge } from "@/components/app-store-badge";
import { ComparisonTable, StatusMark } from "@/components/comparison-table";
import {
  ARC_LISTING_URL,
  CHECKED,
  DESCRIPTION,
  FAQ,
  HEADING,
  HIGHLIGHTS,
  INTRO,
  KEEP_ARC,
  LIVE,
  PATH,
  ROWS,
  TITLE,
  UPDATED,
} from "@/lib/arc-timeline";
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
      mentions: { "@type": "SoftwareApplication", name: "Arc Timeline" },
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

const highlightRows = ROWS.filter((row) => HIGHLIGHTS.includes(row.topic));

export default function Page() {
  if (!LIVE) notFound();

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
            <p className={eyebrow}>ARC TIMELINE ALTERNATIVE</p>
            <h1
              id="hero-heading"
              className="text-balance font-semibold text-[clamp(44px,6vw,84px)] leading-[0.95] tracking-[-0.045em]"
            >
              {HEADING}
            </h1>
            <p className="max-w-[34ch] text-pretty text-[#3a3a35] text-[clamp(19px,2vw,23px)] leading-[1.45]">
              {INTRO}
            </p>
            <div className="flex flex-wrap items-center gap-5">
              <AppStoreBadge campaign="arc-timeline" />
              <a
                href="#compare"
                className={`font-medium text-[15px] ${underline}`}
              >
                See all the differences
              </a>
            </div>
          </div>

          {/* The three main differences at a glance. The table below has the detail. */}
          <div
            className={`${card} w-full max-w-[480px] justify-self-center overflow-hidden`}
          >
            <div className="grid grid-cols-[1fr_72px_72px] items-center border-line border-b px-5 py-4 font-semibold text-sm">
              <span className={`${eyebrow} font-normal`}>AT A GLANCE</span>
              <span className="flex justify-center">
                {/* biome-ignore lint/performance/noImgElement: static SVG artwork needs no optimisation */}
                <img
                  src="/brand/logo.svg"
                  alt={BRAND}
                  width={28}
                  height={28}
                  className="rounded-[22.37%]"
                />
              </span>
              <span className="text-center">Arc</span>
            </div>
            <ul className="divide-y divide-line">
              {highlightRows.map((row) => (
                <li
                  key={row.topic}
                  className="grid grid-cols-[1fr_72px_72px] items-center px-5 py-4 text-[15px]"
                >
                  <span className="font-medium">{row.topic}</span>
                  <span className="flex justify-center">
                    <StatusMark status={row.traceStatus} />
                  </span>
                  <span className="flex justify-center">
                    <StatusMark status={row.otherStatus} />
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* Comparison */}
        <section
          id="compare"
          aria-labelledby="compare-heading"
          className={`${wrap} scroll-mt-6 pb-[clamp(96px,12vw,160px)]`}
        >
          <div className="mb-[clamp(28px,4vw,44px)] flex flex-col gap-5">
            <p className={eyebrow}>SIDE BY SIDE</p>
            <h2 id="compare-heading" className={sectionHeading}>
              {BRAND} and Arc Timeline
            </h2>
          </div>

          <ComparisonTable other="Arc Timeline" rows={ROWS} />
          <p className="mt-4 text-secondary text-sm leading-relaxed">
            We checked the facts about Arc Timeline in{" "}
            <time dateTime={UPDATED}>{CHECKED}</time>, on its{" "}
            <a href={ARC_LISTING_URL} className={underline}>
              App Store page
            </a>
            . Arc can change at any time.
          </p>
        </section>

        {/* Night: when to keep Arc, questions, download. */}
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
                  When to keep Arc Timeline.
                </h2>
              </div>
              <ul className="flex flex-col">
                {KEEP_ARC.map((item) => (
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
              Start your first day.
            </h2>
            <p className="max-w-[36ch] text-[19px] text-secondary leading-normal">
              Install {BRAND} and tap Start my journal. Tonight, your day is on
              the map.
            </p>
            <AppStoreBadge campaign="arc-timeline" />
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
