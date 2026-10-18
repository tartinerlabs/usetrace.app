import type { Metadata } from "next";
import Link from "next/link";
import { AppStoreBadge } from "@/components/app-store-badge";
import { Faq, type FaqItem } from "@/components/faq";
import { BRAND, MIN_IOS, SHARE_IMAGE, TWITTER_IMAGE } from "@/lib/site";

const title = "Google Maps Timeline alternative for iPhone";
const description = `Compare ${BRAND} and Google Maps Timeline. ${BRAND} is a private location timeline for iPhone. It has no account, and your journal stays encrypted on your iPhone.`;

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: "/google-maps-timeline-alternative" },
  openGraph: {
    type: "website",
    siteName: BRAND,
    url: "/google-maps-timeline-alternative",
    title,
    description,
    images: SHARE_IMAGE,
  },
  twitter: { title, description, images: TWITTER_IMAGE },
};

// Google facts come from Google Maps Help (answers 6258979 and 14169818).
// Check them again before each change to this page.
const CHECKED = "October 2026";

const rows: { topic: string; trace: string; google: string }[] = [
  {
    topic: "Account",
    trace: "You do not sign in.",
    google:
      "You need a Google Account. Timeline is off by default. You must turn it on.",
  },
  {
    topic: "Where your data is",
    trace: `${BRAND} encrypts your journal on your iPhone. We do not operate servers that receive your journal.`,
    google: "Timeline is on each device that you sign in on.",
  },
  {
    topic: "Cloud copy",
    trace:
      "iCloud sync is optional and off by default. It goes to your own iCloud account. Trace encrypts it before it leaves your iPhone.",
    google:
      "Backup is optional. Google keeps an encrypted copy on Google servers. To use backup, you must turn off auto-delete.",
  },
  {
    topic: "Changes on other devices",
    trace: "With iCloud sync, your journal is the same on each iPhone.",
    google:
      "A change or a deletion on one device does not go to your other devices.",
  },
  {
    topic: "How long data stays",
    trace: "Your journal stays until you erase it.",
    google:
      "Auto-delete can remove data after 3, 18 or 36 months. You can also keep it until you delete it.",
  },
  {
    topic: "Export",
    trace: "Export your journal as a JSON file.",
    google: "Export Timeline as a JSON file (location-history.json).",
  },
  {
    topic: "Devices",
    trace: `iPhone with iOS ${MIN_IOS} or later.`,
    google:
      "The Google Maps app on Android and iPhone. Timeline is not available in Maps on a computer.",
  },
  {
    topic: "Ads and tracking",
    trace:
      "No ads. We do not sell your data or track you across other apps. Analytics are off by default.",
    google: "Controlled by your Google Account settings.",
  },
];

const extras = [
  {
    heading: "A story of your day",
    body: `Each evening, ${BRAND} writes a short story of your day. You can add notes and photos, and you can correct a stop.`,
  },
  {
    heading: "Play back a journey",
    body: "Move the slider to see where you were and when. Open a day, a week, a month or a year.",
  },
  {
    heading: "Private places",
    body: `See how frequently you go to a place. Make a place private, and ${BRAND} keeps only a pin for it.`,
  },
  {
    heading: "Your explored map",
    body: "As you go to new streets, your explored map fills in. There are no streaks and no scores.",
  },
];

const faq: FaqItem[] = [
  {
    question: `Is ${BRAND} a replacement for Google Maps Timeline?`,
    answer: (
      <p>
        Yes, if you use an iPhone. {BRAND} records the places you go and the
        routes you take, automatically. You do not need a Google Account.
      </p>
    ),
  },
  {
    question: `Does ${BRAND} send my locations to a server?`,
    answer: (
      <p>
        No. {BRAND} encrypts your journal on your iPhone. We do not operate
        servers that receive your journal. If you turn on iCloud sync, your
        journal goes to your own iCloud account.
      </p>
    ),
  },
  {
    question: `Can I use ${BRAND} on Android or on a computer?`,
    answer: (
      <p>
        No. {BRAND} is only for iPhone. If you use Android, Google Maps Timeline
        is a better choice for you.
      </p>
    ),
  },
  {
    question: `Can I use ${BRAND} and Google Maps Timeline at the same time?`,
    answer: (
      <p>
        Yes. The two apps record separately. Each app uses its own location
        permission on your iPhone.
      </p>
    ),
  },
];

const linkClassName =
  "text-ink underline decoration-line underline-offset-4 hover:decoration-sun";

export default function Page() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
      <h1 className="wrap-break-word font-rounded font-semibold text-[clamp(2rem,1.6rem+2vw,2.75rem)] text-ink leading-tight tracking-tight">
        A private Google Maps Timeline alternative for iPhone
      </h1>
      <p className="mt-4 text-lg text-secondary leading-relaxed">
        {BRAND} records the places you go and the routes you take. You do not
        sign in. Your journal stays encrypted on your iPhone.
      </p>
      <div className="mt-8">
        <AppStoreBadge />
      </div>

      <section className="mt-16">
        <h2 className="mb-4 font-rounded font-semibold text-2xl text-ink leading-snug">
          {BRAND} and Google Maps Timeline
        </h2>
        {/* Below sm, each row stacks into a card and the cells carry their own labels. */}
        <div className="overflow-hidden rounded-card border border-line bg-surface">
          <table className="w-full text-left text-sm leading-relaxed">
            <thead className="max-sm:sr-only">
              <tr className="border-line border-b text-ink">
                <th scope="col" className="w-1/5 px-4 py-3 font-semibold">
                  <span className="sr-only">Topic</span>
                </th>
                <th scope="col" className="px-4 py-3 font-semibold">
                  {BRAND}
                </th>
                <th scope="col" className="px-4 py-3 font-semibold">
                  Google Maps Timeline
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line">
              {rows.map((row) => (
                <tr
                  key={row.topic}
                  className="align-top max-sm:block max-sm:py-2"
                >
                  <th
                    scope="row"
                    className="px-4 py-3 font-medium text-ink max-sm:block max-sm:pb-1"
                  >
                    {row.topic}
                  </th>
                  <td className="px-4 py-3 text-ink max-sm:block max-sm:py-1">
                    <span className="block font-semibold text-xs sm:hidden">
                      {BRAND}
                    </span>
                    {row.trace}
                  </td>
                  <td className="px-4 py-3 text-secondary max-sm:block max-sm:py-1">
                    <span className="block font-semibold text-ink text-xs sm:hidden">
                      Google Maps Timeline
                    </span>
                    {row.google}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="mt-3 text-secondary text-sm leading-relaxed">
          We checked the facts about Google Maps Timeline in {CHECKED}, on{" "}
          <a
            href="https://support.google.com/maps/answer/6258979?co=GENIE.Platform%3DiOS"
            className={linkClassName}
          >
            Google Maps Help
          </a>
          . Google can change Timeline at any time.
        </p>
      </section>

      <section className="mt-16">
        <h2 className="mb-4 font-rounded font-semibold text-2xl text-ink leading-snug">
          More in {BRAND}
        </h2>
        <div className="grid gap-6 sm:grid-cols-2">
          {extras.map((extra) => (
            <div key={extra.heading}>
              <h3 className="font-semibold text-ink">{extra.heading}</h3>
              <p className="mt-2 text-secondary leading-relaxed">
                {extra.body}
              </p>
            </div>
          ))}
        </div>
      </section>

      <section className="mt-16">
        <h2 className="mb-4 font-rounded font-semibold text-2xl text-ink leading-snug">
          When to keep Google Maps Timeline
        </h2>
        <ul className="list-disc space-y-2 pl-6 text-secondary leading-relaxed">
          <li>You use Android, or you use Android and iPhone together.</li>
          <li>You want your location history in your Google Account.</li>
        </ul>
      </section>

      <section className="mt-16">
        <h2 className="mb-4 font-rounded font-semibold text-2xl text-ink leading-snug">
          Questions
        </h2>
        <Faq items={faq} />
      </section>

      <section className="mt-16 rounded-card border border-line bg-fill p-6 text-center sm:p-8">
        <h2 className="font-rounded font-semibold text-ink text-xl">
          Keep your day on your iPhone
        </h2>
        <p className="mt-3 text-secondary leading-relaxed">
          To learn what {BRAND} does with your data, read the{" "}
          <Link href="/privacy" className={linkClassName}>
            Privacy Policy
          </Link>
          .
        </p>
        <div className="mt-6">
          <AppStoreBadge />
        </div>
      </section>
    </div>
  );
}
