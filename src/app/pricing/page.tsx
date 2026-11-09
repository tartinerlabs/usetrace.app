import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Faq } from "@/components/faq";
import { PricingPlans } from "@/components/pricing-plans";
import {
  COMPARE,
  CURRENCY,
  DESCRIPTION,
  FAQ,
  GET_NOTE,
  GET_URL,
  HEADING,
  INTRO,
  LIVE,
  PATH,
  PLANS,
  PLUS,
  SUBHEADING,
  TITLE,
  UPDATED,
} from "@/lib/pricing";
import {
  APP_STORE_NAME,
  BRAND,
  SHARE_IMAGE,
  SITE_URL,
  TWITTER_IMAGE,
} from "@/lib/site";

// No metadata when hidden, so the 404 page does not show the pricing copy.
export const metadata: Metadata = LIVE
  ? {
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
      twitter: {
        title: TITLE,
        description: DESCRIPTION,
        images: TWITTER_IMAGE,
      },
    }
  : {};

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
        applicationCategory: "LifestyleApplication",
        url: SITE_URL,
        offers: PLANS.map((plan) => ({
          "@type": "Offer",
          name: `${PLUS} ${plan.name}`,
          price: plan.amount,
          priceCurrency: CURRENCY,
        })),
      },
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

// Same scale as the home page.
const wrap = "mx-auto w-full max-w-[1128px] px-[clamp(16px,5vw,56px)]";
const heading =
  "text-balance font-extrabold text-[clamp(32px,4vw,48px)] leading-none tracking-[-0.03em]";

const FACTS = ["No account", "Encrypted on your iPhone", "No streaks"];

function CompareCell({
  value,
  plus,
}: {
  value: boolean | string;
  plus?: boolean;
}) {
  const color = plus ? "text-peach" : "text-on-night";
  if (typeof value === "string") {
    return (
      <span className="flex items-center gap-2 font-medium text-sm max-sm:flex-col max-sm:items-start max-sm:gap-0">
        <span aria-hidden="true" className={`icon text-2xl ${color}`}>
          check_circle
        </span>
        {value}
      </span>
    );
  }
  return (
    <span
      role="img"
      aria-label={value ? "Yes" : "No"}
      className={`icon text-2xl ${value ? color : "text-night-secondary/60"}`}
    >
      {value ? "check_circle" : "do_not_disturb_on"}
    </span>
  );
}

export default function Page() {
  if (!LIVE) notFound();

  return (
    <div className="page-night">
      <script
        type="application/ld+json"
        // biome-ignore lint/security/noDangerouslySetInnerHtml: JSON-LD, with "<" escaped
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c"),
        }}
      />

      <section
        aria-labelledby="hero-heading"
        className={`${wrap} pt-[clamp(32px,6vw,72px)] pb-20`}
      >
        <div className="mb-10 flex flex-wrap items-end justify-between gap-6">
          <h1
            id="hero-heading"
            className="font-extrabold text-[clamp(40px,6vw,72px)] leading-none tracking-[-0.04em]"
          >
            {HEADING}
            <span className="block text-peach">{SUBHEADING}</span>
          </h1>
          <ul className="flex flex-col gap-1 text-secondary text-sm sm:items-end">
            {FACTS.map((fact) => (
              <li key={fact}>{fact}</li>
            ))}
          </ul>
        </div>
        <p className="sr-only">{INTRO}</p>
        <PricingPlans />
      </section>

      <section aria-labelledby="compare-heading" className={`${wrap} pb-20`}>
        <h2 id="compare-heading" className={`${heading} mb-8`}>
          Compare plans.
        </h2>
        <table className="w-full border-collapse text-left">
          {COMPARE.map((group, index) => (
            <tbody key={group.group}>
              <tr>
                <th
                  scope="colgroup"
                  className={`pb-3 font-bold text-lg ${index ? "pt-10" : ""}`}
                >
                  {group.group}
                </th>
                {index === 0 ? (
                  <>
                    <th
                      scope="col"
                      className="w-1/4 pb-3 font-semibold text-sm"
                    >
                      {BRAND}
                    </th>
                    <th
                      scope="col"
                      className="w-1/4 pb-3 font-semibold text-sm"
                    >
                      {PLUS}
                    </th>
                  </>
                ) : (
                  <td colSpan={2} />
                )}
              </tr>
              {group.rows.map((row) => (
                <tr key={row.feature} className="border-line border-b">
                  <th
                    scope="row"
                    className="py-3.5 pr-4 font-normal text-secondary"
                  >
                    {row.feature}
                  </th>
                  <td className="py-3.5">
                    <CompareCell value={row.trace} />
                  </td>
                  <td className="py-3.5">
                    <CompareCell value={row.plus} plus />
                  </td>
                </tr>
              ))}
            </tbody>
          ))}
        </table>
        <div className="mt-12 flex flex-col items-center gap-3">
          <a
            href={GET_URL}
            data-ph-capture-attribute-cta="app-store"
            className="inline-flex min-h-12 items-center rounded-full bg-peach px-7 font-semibold text-night motion-safe:transition-opacity hover:opacity-85"
          >
            Get {PLUS}
          </a>
          <p className="text-secondary text-sm">{GET_NOTE}</p>
        </div>
      </section>

      <section aria-labelledby="faq-heading" className={`${wrap} pb-24`}>
        <h2 id="faq-heading" className={`${heading} mb-8 text-center`}>
          Questions.
        </h2>
        <Faq items={FAQ} />
      </section>
    </div>
  );
}
