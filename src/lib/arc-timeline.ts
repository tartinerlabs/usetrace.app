import type { ComparisonRow, Status } from "@/components/comparison-table";
import { BRAND, MIN_IOS, SITE_URL } from "@/lib/site";

// Content of /arc-timeline-alternative. The page, its JSON-LD and its
// Markdown version all read from here, so they cannot disagree.

// Hidden on Vercel production until we decide to publish it. Local and
// preview builds show it.
export const LIVE = process.env.VERCEL_ENV !== "production";

export const PATH = "/arc-timeline-alternative";
export const TITLE = `${BRAND} vs Arc Timeline`;
export const HEADING = `${BRAND} vs Arc Timeline`;
export const DESCRIPTION = `Compare ${BRAND} and Arc Timeline, two private location timelines for iPhone. ${BRAND} syncs between your iPhones, imports Google Timeline and works on iOS ${MIN_IOS}.`;
export const INTRO = `${BRAND} and Arc Timeline both record the places you go and the routes you take, with no account. Here is how they are different.`;

// Arc facts come from the Arc Timeline 4 App Store listing (id6740688708) and
// the Big Paua announcement of 12 April 2026. Check them again before each
// change, then update both values. Do not add prices.
export const CHECKED = "October 2026";
export const UPDATED = "2026-10-18";
export const ARC_LISTING_URL =
  "https://apps.apple.com/us/app/arc-timeline-4/id6740688708";

export const ROWS: ComparisonRow[] = [
  {
    topic: "Account",
    trace: "You do not sign in.",
    traceStatus: "yes",
    other: "No account and no sign-up.",
    otherStatus: "yes",
  },
  {
    topic: "Where your data is",
    trace: `${BRAND} encrypts your journal on your iPhone. We do not operate servers that receive your journal.`,
    traceStatus: "yes",
    other: "All data is stored on your iPhone.",
    otherStatus: "yes",
  },
  {
    topic: "Cloud copy",
    trace: `iCloud sync is optional and off by default. It goes to your own iCloud account. ${BRAND} encrypts it before it leaves your iPhone.`,
    traceStatus: "yes",
    other: "Optional backup to your own iCloud account.",
    otherStatus: "yes",
  },
  {
    topic: "Same journal on each iPhone",
    trace: "With iCloud sync, your journal is the same on each iPhone.",
    traceStatus: "yes",
    other: "Arc lists iCloud backup. It does not list sync between devices.",
    otherStatus: "partly",
  },
  {
    topic: "Import Google Timeline",
    trace: `Import your Google Maps Timeline export. ${BRAND} adds only the days that have nothing in your journal.`,
    traceStatus: "yes",
    other: "Not in the list of imports.",
    otherStatus: "no",
  },
  {
    topic: "Other imports",
    trace: `${BRAND} imports only Google Timeline files.`,
    traceStatus: "no",
    other: "Arc backups, GPX files and Apple Health workouts.",
    otherStatus: "yes",
  },
  {
    topic: "Export",
    trace: "Export your journal as a JSON file.",
    traceStatus: "yes",
    other: "JSON and GPX files. Automatic exports to iCloud Drive.",
    otherStatus: "yes",
  },
  {
    topic: "iPhones",
    trace: `iPhone with iOS ${MIN_IOS} or later.`,
    traceStatus: "yes",
    other: "iPhone with iOS 26 or later.",
    otherStatus: "partly",
  },
];

// The three rows that matter most, for the summary card in the hero.
export const HIGHLIGHTS = [
  "Same journal on each iPhone",
  "Import Google Timeline",
  "iPhones",
];

export const KEEP_ARC = [
  `You have years of Arc history. ${BRAND} cannot import Arc files.`,
  "You want to search your history with AI, or ask it questions.",
  "You want GPX export, or imports from Apple Health workouts.",
];

export const FAQ: { question: string; answer: string }[] = [
  {
    question: `Is ${BRAND} a replacement for Arc Timeline?`,
    answer: `For many people, yes. Both apps record the places you go and the routes you take, automatically, with no account. ${BRAND} also syncs your journal between your iPhones, imports Google Timeline and works on iOS ${MIN_IOS} or later.`,
  },
  {
    question: `Can I bring my Arc history to ${BRAND}?`,
    answer: `No. ${BRAND} imports only Google Timeline files. If your history is in Arc, keep Arc to look back at those days.`,
  },
  {
    question: `Can I bring my Google Maps Timeline history to ${BRAND}?`,
    answer: `Yes. Export your Timeline from the Google Maps app on your phone. Then in ${BRAND}, open Settings and tap Import Google Timeline.`,
  },
  {
    question: `Does ${BRAND} send my locations to a server?`,
    answer: `No. ${BRAND} encrypts your journal on your iPhone. We do not operate servers that receive your journal. If you turn on iCloud sync, your journal goes to your own iCloud account.`,
  },
  {
    question: `Can I use ${BRAND} and Arc Timeline at the same time?`,
    answer:
      "Yes. The two apps record separately. Each app uses its own location permission on your iPhone.",
  },
];

const MARK: Record<Status, string> = { yes: "✓", partly: "–", no: "✗" };

// Served to agents that send Accept: text/markdown.
export const MARKDOWN = `# ${HEADING}

> ${INTRO}

## ${BRAND} and Arc Timeline

| Topic | ${BRAND} | Arc Timeline |
| --- | --- | --- |
${ROWS.map((row) => `| ${row.topic} | ${MARK[row.traceStatus]} ${row.trace} | ${MARK[row.otherStatus]} ${row.other} |`).join("\n")}

We checked the facts about Arc Timeline in ${CHECKED}, on its [App Store page](${ARC_LISTING_URL}). Arc can change at any time.

## When to keep Arc Timeline

${KEEP_ARC.map((item) => `- ${item}`).join("\n")}

## Questions

${FAQ.map((item) => `### ${item.question}\n\n${item.answer}`).join("\n\n")}

## Pages

- [Home](${SITE_URL}/): all the features of ${BRAND}
- [Google Maps Timeline alternative](${SITE_URL}/google-maps-timeline-alternative)
- [Privacy Policy](${SITE_URL}/privacy)
- [llms.txt](${SITE_URL}/llms.txt)
`;
