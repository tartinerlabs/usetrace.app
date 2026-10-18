import type { ComparisonRow, Status } from "@/components/comparison-table";
import { BRAND, MIN_IOS, SITE_URL } from "@/lib/site";

// Content of /google-maps-timeline-alternative. The page, its JSON-LD and its
// Markdown version all read from here, so they cannot disagree.

export const PATH = "/google-maps-timeline-alternative";
export const TITLE = "Google Maps Timeline alternative for iPhone";
export const HEADING = "A private Google Maps Timeline alternative for iPhone";
export const DESCRIPTION = `Compare ${BRAND} and Google Maps Timeline. ${BRAND} is a private location timeline for iPhone. It has no account, and it can import your Google Timeline.`;
export const INTRO = `${BRAND} records the places you go and the routes you take. You do not sign in. Your journal stays encrypted on your iPhone.`;

// Google facts come from Google Maps Help (answers 6258979 and 14169818).
// Check them again before each change, then update both values.
export const CHECKED = "October 2026";
export const UPDATED = "2026-10-18";
export const GOOGLE_HELP_URL =
  "https://support.google.com/maps/answer/6258979?co=GENIE.Platform%3DiOS";

export const ROWS: ComparisonRow[] = [
  {
    topic: "Account",
    trace: "You do not sign in.",
    traceStatus: "yes",
    other:
      "You need a Google Account. Timeline is off by default. You must turn it on.",
    otherStatus: "no",
  },
  {
    topic: "Where your data is",
    trace: `${BRAND} encrypts your journal on your iPhone. We do not operate servers that receive your journal.`,
    traceStatus: "yes",
    other: "Timeline is on each device that you sign in on.",
    otherStatus: "yes",
  },
  {
    topic: "Cloud copy",
    trace:
      "iCloud sync is optional and off by default. It goes to your own iCloud account. Trace encrypts it before it leaves your iPhone.",
    traceStatus: "yes",
    other:
      "Backup is optional. Google keeps an encrypted copy on Google servers. To use backup, you must turn off auto-delete.",
    otherStatus: "yes",
  },
  {
    topic: "Changes on other devices",
    trace: "With iCloud sync, your journal is the same on each iPhone.",
    traceStatus: "yes",
    other:
      "A change or a deletion on one device does not go to your other devices.",
    otherStatus: "no",
  },
  {
    topic: "How long data stays",
    trace: "Your journal stays until you erase it.",
    traceStatus: "yes",
    other:
      "Auto-delete can remove data after 3, 18 or 36 months. You can also keep it until you delete it.",
    otherStatus: "yes",
  },
  {
    topic: "Import",
    trace:
      "Import your Google Maps Timeline export. Trace adds only the days that have nothing in your journal.",
    traceStatus: "yes",
    other: "Not available.",
    otherStatus: "no",
  },
  {
    topic: "Export",
    trace: "Export your journal as a JSON file.",
    traceStatus: "yes",
    other: "Export Timeline as a JSON file (location-history.json).",
    otherStatus: "yes",
  },
  {
    topic: "Devices",
    trace: `iPhone with iOS ${MIN_IOS} or later.`,
    traceStatus: "partly",
    other:
      "The Google Maps app on Android and iPhone. Timeline is not available in Maps on a computer.",
    otherStatus: "yes",
  },
  {
    topic: "Ads and tracking",
    trace:
      "No ads. We do not sell your data or track you across other apps. Trace sends no analytics.",
    traceStatus: "yes",
    other: "Controlled by your Google Account settings.",
    otherStatus: "partly",
  },
];

export const STEPS = [
  {
    heading: "Export from Google Maps",
    body: "In the Google Maps app, open Settings and tap Export Timeline data. Save the file to Files.",
  },
  {
    heading: `Import into ${BRAND}`,
    body: `In ${BRAND}, open Settings and tap Import Google Timeline. Select the file. Files from Google Takeout also work.`,
  },
  {
    heading: "See your old days",
    body: `${BRAND} adds only the days that have nothing in your journal. Your recorded days do not change.`,
  },
];

export const IMPORT_PRIVACY = `${BRAND} reads the file on your iPhone. It does not keep Google place IDs or addresses.`;

export const KEEP_GOOGLE = [
  "You use Android, or you use Android and iPhone together.",
  "You want your location history in your Google Account.",
];

export const FAQ: { question: string; answer: string }[] = [
  {
    question: `Is ${BRAND} a replacement for Google Maps Timeline?`,
    answer: `Yes, if you use an iPhone. ${BRAND} records the places you go and the routes you take, automatically. You do not need a Google Account.`,
  },
  {
    question: `Does ${BRAND} send my locations to a server?`,
    answer: `No. ${BRAND} encrypts your journal on your iPhone. We do not operate servers that receive your journal. If you turn on iCloud sync, your journal goes to your own iCloud account.`,
  },
  {
    question: `Can I bring my Google Maps Timeline history to ${BRAND}?`,
    answer: `Yes. Export your Timeline from the Google Maps app on your phone. Then in ${BRAND}, open Settings and tap Import Google Timeline. ${BRAND} adds only the days that have nothing in your journal.`,
  },
  {
    question: "Why is Google Maps Timeline not on my computer?",
    answer: `Google moved Timeline to the Google Maps app on your phone. Timeline is not available in Maps on a computer. ${BRAND} also keeps your journal on your phone.`,
  },
  {
    question: `Can I use ${BRAND} on Android or on a computer?`,
    answer: `No. ${BRAND} is only for iPhone. If you use Android, Google Maps Timeline is a better choice for you.`,
  },
  {
    question: `Can I use ${BRAND} and Google Maps Timeline at the same time?`,
    answer:
      "Yes. The two apps record separately. Each app uses its own location permission on your iPhone.",
  },
];

const MARK: Record<Status, string> = { yes: "✓", partly: "–", no: "✗" };

// Served to agents that send Accept: text/markdown.
export const MARKDOWN = `# ${HEADING}

> ${INTRO}

## ${BRAND} and Google Maps Timeline

| Topic | ${BRAND} | Google Maps Timeline |
| --- | --- | --- |
${ROWS.map((row) => `| ${row.topic} | ${MARK[row.traceStatus]} ${row.trace} | ${MARK[row.otherStatus]} ${row.other} |`).join("\n")}

We checked the facts about Google Maps Timeline in ${CHECKED}, on [Google Maps Help](${GOOGLE_HELP_URL}). Google can change Timeline at any time.

## Move to ${BRAND} in three steps

${STEPS.map((step, i) => `${i + 1}. **${step.heading}.** ${step.body}`).join("\n")}

${IMPORT_PRIVACY}

## When to keep Google Maps Timeline

${KEEP_GOOGLE.map((item) => `- ${item}`).join("\n")}

## Questions

${FAQ.map((item) => `### ${item.question}\n\n${item.answer}`).join("\n\n")}

## Pages

- [Home](${SITE_URL}/): all the features of ${BRAND}
- [Privacy Policy](${SITE_URL}/privacy)
- [llms.txt](${SITE_URL}/llms.txt)
`;
