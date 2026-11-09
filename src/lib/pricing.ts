import {
  APP_STORE_ID,
  APP_STORE_PROVIDER_TOKEN,
  APP_STORE_URL,
  BRAND,
  SITE_URL,
} from "@/lib/site";

// Content of /pricing. The page, its JSON-LD and its Markdown version all read
// from here, so they cannot disagree.

// Hidden on Vercel production until Trace Plus goes on sale. Local and preview
// builds show it.
export const LIVE = process.env.VERCEL_ENV !== "production";

export const PLUS = `${BRAND} Plus`;
export const PATH = "/pricing";
export const TITLE = `${BRAND} pricing`;
export const HEADING = "Keep every day open.";
export const SUBHEADING = `Do more with ${PLUS}.`;
export const DESCRIPTION = `${BRAND} records your day and keeps your whole journal. ${PLUS} opens the days older than 14 days. See the monthly, annual and lifetime prices.`;
export const INTRO = `${BRAND} records your day and keeps your whole journal. ${PLUS} opens the days older than 14 days and gives you more ways to look back.`;

// US prices from App Store Connect, which the app reads through StoreKit, and
// perks from Trace/UI/Settings/TracePlusView.swift in the Trace repo. Change
// them here when the app changes. The introductory offer is not decided, so do
// not add a trial until it is.
export const UPDATED = "2026-11-08";
export const CURRENCY = "USD";

// Purchases happen in the app, so the buttons on this page go to the App Store.
export const GET_URL = `https://apps.apple.com/app/apple-store/id${APP_STORE_ID}?pt=${APP_STORE_PROVIDER_TOKEN}&ct=pricing&mt=8`;
export const GET_NOTE = `Install ${BRAND}, open Settings and tap ${PLUS}.`;

export const PLANS = [
  {
    name: "Annual",
    price: "US$49.99",
    amount: "49.99",
    period: "a year",
    note: "US$4.17 a month. You pay one time each year.",
    // Against 12 Monthly payments of US$7.99.
    badge: "Save 47%",
  },
  {
    name: "Monthly",
    price: "US$7.99",
    amount: "7.99",
    period: "a month",
    note: "Cancel at any time.",
    badge: null,
  },
  {
    name: "Lifetime",
    price: "US$179.99",
    amount: "179.99",
    period: "one payment",
    note: "You do not have a subscription.",
    badge: null,
  },
];

export const PERKS = [
  { title: "All your days.", text: "Open every day older than 14 days." },
  { title: "Search.", text: "Search your whole journal." },
  { title: "Explored map.", text: "See your all-time explored map." },
  {
    title: "Your places.",
    text: "See your usual times and totals at each place.",
  },
  { title: "3D maps.", text: "See your routes and places in 3D." },
  {
    title: "Device labels.",
    text: "See which device recorded each stay and journey.",
  },
];

// A cell is a tick, a dash or a short value.
type Cell = boolean | string;

export const COMPARE: {
  group: string;
  rows: { feature: string; trace: Cell; plus: Cell }[];
}[] = [
  {
    group: "Your journal",
    rows: [
      { feature: "Record your places and routes", trace: true, plus: true },
      { feature: "Encrypted on your iPhone", trace: true, plus: true },
      { feature: "No account", trace: true, plus: true },
      { feature: "Import Google Timeline", trace: true, plus: true },
      { feature: "Export your journal", trace: true, plus: true },
      { feature: "Sync with iCloud", trace: true, plus: true },
      { feature: "Your awards", trace: true, plus: true },
      { feature: "Visits and time at each place", trace: true, plus: true },
    ],
  },
  {
    group: "Look back",
    rows: [
      { feature: "Open your days", trace: "Last 14 days", plus: "All days" },
      {
        feature: "Search your journal",
        trace: "Last 14 days",
        plus: "All days",
      },
    ],
  },
  {
    group: `Only with ${PLUS}`,
    rows: [
      { feature: "All-time explored map", trace: false, plus: true },
      { feature: "Usual times at each place", trace: false, plus: true },
      { feature: "Totals at each place", trace: false, plus: true },
      { feature: "Routes and places in 3D", trace: false, plus: true },
      {
        feature: "The device for each stay and journey",
        trace: false,
        plus: true,
      },
    ],
  },
];

export const FAQ: { question: string; answer: string }[] = [
  {
    question: `What can I do without ${PLUS}?`,
    answer: `You can record, open your last 14 days, import and export. Your older days stay in your journal, with or without ${PLUS}.`,
  },
  {
    question: `What happens to my older days if my ${PLUS} stops?`,
    answer: `${BRAND} keeps them. Days older than 14 days show as locked until you have ${PLUS} again. ${BRAND} does not delete or change your journal.`,
  },
  {
    question: "Do all plans give the same features?",
    answer: "Yes. Monthly, Annual and Lifetime unlock the same features.",
  },
  {
    question: "How do I buy or restore a plan?",
    answer: `Open Settings in ${BRAND} and tap ${PLUS}. You pay through your Apple Account. To get a plan back on a different iPhone, tap Restore Purchases.`,
  },
  {
    question: "How do I cancel?",
    answer:
      "Open Settings on your iPhone, tap your Apple Account, then tap Subscriptions. Cancel at least 24 hours before the period ends. Lifetime is one payment, so you do not have to cancel it.",
  },
  {
    question: "Is the price the same in my country?",
    answer: `The prices on this page are in US dollars. The App Store can show a different price in your country. ${BRAND} shows your price before you pay.`,
  },
];

function mark(cell: Cell) {
  if (typeof cell === "string") return cell;
  return cell ? "✓" : "–";
}

// Served to agents that send Accept: text/markdown.
export const MARKDOWN = `# ${TITLE}

> ${INTRO}

## Plans

| Plan | Price | Note |
| --- | --- | --- |
${PLANS.map((plan) => `| ${plan.name} | ${plan.price} ${plan.period} | ${plan.note} |`).join("\n")}

All plans unlock the same features. Prices are for the United States.

## ${BRAND} and ${PLUS}

| Feature | ${BRAND} | ${PLUS} |
| --- | --- | --- |
${COMPARE.flatMap((group) => group.rows)
  .map((row) => `| ${row.feature} | ${mark(row.trace)} | ${mark(row.plus)} |`)
  .join("\n")}

## Questions

${FAQ.map((item) => `### ${item.question}\n\n${item.answer}`).join("\n\n")}

## Pages

- [Home](${SITE_URL}/): all the features of ${BRAND}
- [App Store](${APP_STORE_URL})
- [Privacy Policy](${SITE_URL}/privacy)
- [llms.txt](${SITE_URL}/llms.txt)
`;
