import type { Metadata } from "next";
import Link from "next/link";
import { BRAND, MIN_IOS, SHARE_IMAGE, TWITTER_IMAGE } from "@/lib/site";

const title = "About";
const description = `${BRAND} is a private location timeline for iPhone. Learn what ${BRAND} does and the rules that we follow.`;

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: "/about" },
  openGraph: {
    type: "website",
    siteName: BRAND,
    url: "/about",
    title,
    description,
    images: SHARE_IMAGE,
  },
  twitter: { title, description, images: TWITTER_IMAGE },
};

const rules = [
  {
    heading: "Your journal is yours",
    body: `${BRAND} encrypts your journal on your iPhone. We do not operate servers that receive your journal. We cannot read it. If you turn on iCloud sync, your journal goes to your own iCloud account. ${BRAND} encrypts it before it leaves your iPhone.`,
  },
  {
    heading: "You control the recording",
    body: `${BRAND} records nothing until you tap Start recording. You can pause it from the app, the Home Screen widget, the Lock Screen or Siri.`,
  },
  {
    heading: "No account and no ads",
    body: "You do not sign in. We do not sell your data or track you across other apps. Analytics are off by default. Analytics never include your locations, routes, places, notes or photos.",
  },
  {
    heading: "No streaks. No scores.",
    body: `A quiet day at home is a normal day. ${BRAND} does not give you goals. A quiet day does not remove progress. As you go to new streets, your explored map fills in.`,
  },
];

const linkClassName =
  "text-ink underline decoration-line underline-offset-4 hover:decoration-sun";

export default function Page() {
  return (
    <div className="mx-auto max-w-2xl px-4 py-12 sm:px-6">
      <h1 className="wrap-break-word font-rounded font-semibold text-[clamp(2rem,1.6rem+2vw,2.75rem)] text-ink leading-tight tracking-tight">
        About {BRAND}
      </h1>
      <p className="mt-4 text-lg text-secondary leading-relaxed">
        {BRAND} is a private location timeline for iPhone. It records the places
        you go and the routes you take. Each evening, {BRAND} writes a short
        story of your day. You can look back at any day and play back a journey.
        You can also see the places that you go to frequently.
      </p>
      <p className="mt-4 text-secondary leading-relaxed">
        A record of the places you go is personal data. We think that this data
        must stay with you. It must not go to our servers. {BRAND} needs an
        iPhone with iOS {MIN_IOS} or later.
      </p>

      <section className="mt-12">
        <h2 className="mb-4 font-rounded font-semibold text-2xl text-ink leading-snug">
          The rules that we follow
        </h2>
        <div className="space-y-6">
          {rules.map((rule) => (
            <div key={rule.heading}>
              <h3 className="font-semibold text-ink">{rule.heading}</h3>
              <p className="mt-2 text-secondary leading-relaxed">{rule.body}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mt-16 rounded-card border border-line bg-fill p-6 sm:p-8">
        <h2 className="font-rounded font-semibold text-ink text-xl">
          Contact us
        </h2>
        <p className="mt-3 text-secondary leading-relaxed">
          For questions and help, go to{" "}
          <Link href="/support" className={linkClassName}>
            Support
          </Link>
          . To learn what {BRAND} does with your data, read the{" "}
          <Link href="/privacy" className={linkClassName}>
            Privacy Policy
          </Link>
          .
        </p>
      </section>
    </div>
  );
}
