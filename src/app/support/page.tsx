import type { Metadata } from "next";
import Link from "next/link";
import { Faq, type FaqItem } from "@/components/faq";
import { BRAND, SHARE_IMAGE, SUPPORT_EMAIL } from "@/lib/site";

const title = "Support";
const description = `Get answers about how to record, pause, sync with iCloud, export and delete your data in ${BRAND}, and about notifications.`;

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: "/support" },
  openGraph: { url: "/support", title, description, images: SHARE_IMAGE },
  twitter: { title, description, images: SHARE_IMAGE },
};

const sections: { heading: string; items: FaqItem[] }[] = [
  {
    heading: "Permissions",
    items: [
      {
        question: "When does Trace start to record?",
        answer: (
          <p>
            Trace records nothing until you tap <strong>Start recording</strong>
            . If you only give permissions, Trace never starts to record.
          </p>
        ),
      },
      {
        question:
          "Which location access do I choose: “While Using” or “Always”?",
        answer: (
          <>
            <p>
              With <strong>While Using</strong>, Trace records only when the app
              is open. With <strong>Always</strong>, Trace can record each
              journey, also when your iPhone is in your pocket. iOS starts Trace
              again so that Trace continues to record in the background.
            </p>
            <p>
              Trace uses low-power location. You can change this setting at any
              time in Settings &gt; Trace &gt; Location.
            </p>
          </>
        ),
      },
      {
        question: "Do I need to allow Motion & Fitness?",
        answer: (
          <p>
            No, Motion &amp; Fitness is optional. It helps Trace to know if you
            walk, cycle or drive. Without it, Trace continues to work, but the
            movement types have less detail.
          </p>
        ),
      },
      {
        question: "Which iPhones does Trace support?",
        answer: (
          <p>
            Trace needs an iPhone with iOS 18 or later. The daily story uses
            Apple Intelligence on supported iPhones with iOS 26 or later. On
            other iPhones, you get a factual summary of your day.
          </p>
        ),
      },
    ],
  },
  {
    heading: "Pause",
    items: [
      {
        question: "How do I pause Trace?",
        answer: (
          <>
            <p>You can pause Trace at any time:</p>
            <ul className="list-disc space-y-1 pl-6">
              <li>in the app</li>
              <li>from the Home Screen widget, with Pause and Continue</li>
              <li>
                from the Live Activity that shows on the Lock Screen after you
                pause Trace
              </li>
              <li>with Siri: “Pause recording in Trace”</li>
            </ul>
            <p>
              The Lock Screen Live Activity is optional. To turn it on or off,
              use <strong>Show pause reminder on Lock Screen</strong> in
              Settings.
            </p>
          </>
        ),
      },
    ],
  },
  {
    heading: "iCloud sync",
    items: [
      {
        question: "How does iCloud sync work?",
        answer: (
          <>
            <p>
              iCloud sync is optional and off by default. It syncs your journal
              and routes to your own iCloud account. Trace encrypts sensitive
              content on your iPhone before it uploads that content. iCloud sync
              uses your iCloud storage.
            </p>
            <p>
              Trace does not sync raw location and motion readings. Each device
              keeps its own permissions to record.
            </p>
          </>
        ),
      },
      {
        question: "How do I restore my journal on a new iPhone?",
        answer: (
          <p>
            Trace uses iCloud Passwords &amp; Keychain to restore your journal
            on a replacement iPhone.
          </p>
        ),
      },
    ],
  },
  {
    heading: "Export",
    items: [
      {
        question: "How do I export my journal?",
        answer: (
          <p>
            Use <strong>Export journal…</strong> to save a JSON file with
            readable places and routes. Trace does not encrypt the file. The
            file is separate from iCloud sync. Choose a destination that you
            trust.
          </p>
        ),
      },
    ],
  },
  {
    heading: "Delete your data",
    items: [
      {
        question: "Can I delete part of my journal?",
        answer: (
          <p>
            Yes. You can delete individual visits, journeys, days, memories and
            photos.
          </p>
        ),
      },
      {
        question: "How do I erase everything?",
        answer: (
          <>
            <p>
              <strong>Erase Journal…</strong> deletes every day, place, route,
              memory and saved place from this iPhone. If you set up iCloud
              sync, Trace also deletes the iCloud copy and removes its sync key
              from iCloud Keychain. Your other devices keep the data that they
              downloaded before. After that, they do not sync.
            </p>
            <p>
              To erase only this iPhone, choose{" "}
              <strong>Erase This iPhone Only</strong>. If you want a copy,
              export your journal first.
            </p>
          </>
        ),
      },
    ],
  },
  {
    heading: "Notifications",
    items: [
      {
        question: "What notifications does Trace send?",
        answer: (
          <>
            <p>
              All notifications are optional. Trace can send reminders to
              record, a weekly recap on Sunday evening and a daily story
              notification at approximately 9 PM.
            </p>
            <p>
              Trace creates the reminders on your iPhone. Trace does not send
              information about your journal to other locations.
            </p>
          </>
        ),
      },
    ],
  },
];

const linkClassName =
  "text-ink underline decoration-line underline-offset-4 hover:decoration-sun";

export default function Page() {
  return (
    <div className="mx-auto max-w-2xl px-4 py-12 sm:px-6">
      <h1 className="wrap-break-word font-rounded font-semibold text-[clamp(2rem,1.6rem+2vw,2.75rem)] text-ink leading-tight tracking-tight">
        Support
      </h1>
      <p className="mt-4 text-lg text-secondary leading-relaxed">
        This page gives answers to common questions about {BRAND}. Learn how to
        record and pause, and how to sync, export and erase your journal.
      </p>

      {sections.map((section) => (
        <section key={section.heading} className="mt-12">
          <h2 className="mb-4 font-rounded font-semibold text-2xl text-ink leading-snug">
            {section.heading}
          </h2>
          <Faq items={section.items} />
        </section>
      ))}

      <section className="mt-16 rounded-card border border-line bg-fill p-6 sm:p-8">
        <h2 className="font-rounded font-semibold text-ink text-xl">
          Do you need more help?
        </h2>
        <p className="mt-3 text-secondary leading-relaxed">
          Send an email to{" "}
          {SUPPORT_EMAIL.startsWith("[") ? (
            <mark className="rounded bg-sun/20 px-1 text-ink ring-1 ring-sun/50">
              {SUPPORT_EMAIL}
            </mark>
          ) : (
            <a href={`mailto:${SUPPORT_EMAIL}`} className={linkClassName}>
              {SUPPORT_EMAIL}
            </a>
          )}
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
