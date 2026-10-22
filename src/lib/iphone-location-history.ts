import type { ComparisonRow, Status } from "@/components/comparison-table";
import { BRAND, MIN_IOS, SITE_URL } from "@/lib/site";

// Content of /iphone-location-history. The page, its JSON-LD and its Markdown
// version all read from here, so they cannot disagree.

// Only in `next dev` until we decide to publish it. Preview and production
// builds return 404.
export const LIVE = process.env.NODE_ENV === "development";

export const PATH = "/iphone-location-history";
export const TITLE = "iPhone location history: see where you have been";
export const HEADING = "See where you have been on your iPhone";
export const DESCRIPTION = `How to see your location history on iPhone. Learn what Visited Places and Significant Locations keep, and how ${BRAND} shows your routes on a map.`;
export const INTRO = `Your iPhone keeps a list of some places that you go to. It does not show your full day on a map. ${BRAND} records your stays and your routes, and keeps them on your iPhone.`;

// Apple facts come from the iPhone User Guide (View Visited Places in Maps)
// and Apple's Location Services & Privacy page. Check them again before each
// change, then update both values.
export const CHECKED = "October 2026";
export const UPDATED = "2026-10-23";
export const VISITED_PLACES_URL =
  "https://support.apple.com/guide/iphone/view-visited-places-iph0c2597c4f/ios";
export const LOCATION_PRIVACY_URL =
  "https://www.apple.com/legal/privacy/data/en/location-services/";

export const APPLE_FEATURES = [
  {
    icon: "location_on",
    name: "Visited Places",
    where: "Maps › Places › Visited Places",
    body: "Apple Maps keeps a list of the places that you go to. You can search the list, and filter it by date, category or city. You must turn it on first. It is not available in all countries or regions.",
  },
  {
    icon: "route",
    name: "Significant Locations & Routes",
    where:
      "Settings › Privacy & Security › Location Services › System Services",
    body: "iOS uses it to learn the places and routes that are important to you. Apple features use it, for example Memories in Photos and route suggestions.",
  },
];

export const APPLE_PRIVACY =
  "Apple says that both features are end-to-end encrypted, and that Apple cannot read them.";

export const ROWS: ComparisonRow[] = [
  {
    topic: "Places you go",
    trace: "Each place that you stop at, with the time.",
    traceStatus: "yes",
    other: "A list of the places that you go to.",
    otherStatus: "yes",
  },
  {
    topic: "Routes between places",
    trace: `${BRAND} draws the route of each journey. The colour shows if you walked, took the train or drove.`,
    traceStatus: "yes",
    other: "Apple's guide does not list routes.",
    otherStatus: "no",
  },
  {
    topic: "A map of each day",
    trace: "Open a day. The map shows each place and each route, in order.",
    traceStatus: "yes",
    other: "Filter your visits by date.",
    otherStatus: "partly",
  },
  {
    topic: "Notes",
    trace: "Add notes and photos to a day.",
    traceStatus: "yes",
    other: "Add a note to a place.",
    otherStatus: "yes",
  },
  {
    topic: "How long data stays",
    trace: "Your journal stays until you erase it.",
    traceStatus: "yes",
    other: "Choose how long to keep visits, or keep them forever.",
    otherStatus: "yes",
  },
  {
    topic: "Cloud copy",
    trace: `iCloud sync is optional and off by default. ${BRAND} encrypts it before it leaves your iPhone.`,
    traceStatus: "yes",
    other: "End-to-end encrypted. It shows on all your synced devices.",
    otherStatus: "yes",
  },
  {
    topic: "Export",
    trace: "Export your journal as a JSON file.",
    traceStatus: "yes",
    other: "Share a place. Apple's guide does not list an export.",
    otherStatus: "partly",
  },
  {
    topic: "Where it works",
    trace: `iPhone with iOS ${MIN_IOS} or later.`,
    traceStatus: "yes",
    other: "Not available in all countries or regions.",
    otherStatus: "partly",
  },
];

export const STEPS = [
  {
    heading: "Start your journal",
    body: `Install ${BRAND} and tap Start my journal. ${BRAND} records nothing before you do this.`,
  },
  {
    heading: "Allow Always",
    body: `With the Always permission, ${BRAND} uses the low-power location service of iOS to fill in your full day.`,
  },
  {
    heading: "Open any day",
    body: "The map shows each place that you went to, and the route between them.",
  },
];

export const KEEP_APPLE = [
  "You only want a list of the places that you go to.",
  "You do not want to install a different app.",
];

export const FAQ: { question: string; answer: string }[] = [
  {
    question: "How do I see my location history on iPhone?",
    answer: `Open Apple Maps, tap Places, then tap Visited Places. You must turn on Visited Places first. To see your routes on a map, use ${BRAND}.`,
  },
  {
    question: "Can I see where I was on a past date?",
    answer: `In Visited Places, filter by date. ${BRAND} shows each past day on a map, with your stays and your routes. ${BRAND} records only after you tap Start my journal. To add older days, import a Google Maps Timeline export.`,
  },
  {
    question: "Does my iPhone record my routes?",
    answer: `iOS keeps Significant Locations & Routes to learn the routes that you take. Apple features use it, for example route suggestions. ${BRAND} shows your routes on a map.`,
  },
  {
    question: "Where is Significant Locations on iPhone?",
    answer:
      "Go to Settings > Privacy & Security > Location Services > System Services. Significant Locations & Routes is in this list.",
  },
  {
    question: "Can Apple see my location history?",
    answer: `${APPLE_PRIVACY} ${BRAND} also encrypts your journal on your iPhone. We do not operate servers that receive your journal.`,
  },
];

const MARK: Record<Status, string> = { yes: "✓", partly: "–", no: "✗" };

// Served to agents that send Accept: text/markdown.
export const MARKDOWN = `# ${HEADING}

> ${INTRO}

## What your iPhone keeps

${APPLE_FEATURES.map((feature) => `- **${feature.name}** (${feature.where}). ${feature.body}`).join("\n")}

${APPLE_PRIVACY}

## ${BRAND} and Visited Places

| Topic | ${BRAND} | Visited Places |
| --- | --- | --- |
${ROWS.map((row) => `| ${row.topic} | ${MARK[row.traceStatus]} ${row.trace} | ${MARK[row.otherStatus]} ${row.other} |`).join("\n")}

We checked the facts about Apple in ${CHECKED}, on [View Visited Places in Maps](${VISITED_PLACES_URL}) and [Location Services & Privacy](${LOCATION_PRIVACY_URL}). Apple can change these features at any time.

## See your location history with ${BRAND}

${STEPS.map((step, i) => `${i + 1}. **${step.heading}.** ${step.body}`).join("\n")}

## When Visited Places is enough

${KEEP_APPLE.map((item) => `- ${item}`).join("\n")}

## Questions

${FAQ.map((item) => `### ${item.question}\n\n${item.answer}`).join("\n\n")}

## Pages

- [Home](${SITE_URL}/): all the features of ${BRAND}
- [Google Maps Timeline alternative](${SITE_URL}/google-maps-timeline-alternative)
- [Privacy Policy](${SITE_URL}/privacy)
- [llms.txt](${SITE_URL}/llms.txt)
`;
