export const BRAND = "Trace";
// App Store descriptor; was "Movement Journal" in the first metadata draft.
export const DESCRIPTOR = "Location Timeline";
export const APP_STORE_NAME = `${BRAND}: ${DESCRIPTOR}`;

export const TAGLINE = "Your day, retraced.";
export const SUMMARY =
  "Trace records the places you go and the routes you take. Your journal stays on your iPhone.";
export const DESCRIPTION = `${BRAND} is a private location timeline for iPhone. It records your day automatically. Your journal stays encrypted on your iPhone. ${BRAND} has no streaks and no account.`;

export const SITE_URL = "https://usetrace.app";
export const BUNDLE_ID = "com.tartinerlabs.Trace";
export const COMPANY = "Tartiner Labs";
export const MIN_IOS = "18.0";

// TODO: set once the app has an App Store listing. While null, the Smart App
// Banner is omitted and the badge renders as "Coming soon".
export const APP_STORE_ID: string | null = null;
export const APP_STORE_URL: string | null = APP_STORE_ID
  ? `https://apps.apple.com/app/id${APP_STORE_ID}`
  : null;

// TODO: replace with the real support address.
export const SUPPORT_EMAIL = "[support email]";

// Child pages that set their own openGraph/twitter lose the root
// opengraph-image file, so they reference it explicitly.
export const SHARE_IMAGE = {
  url: "/opengraph-image.png",
  width: 1200,
  height: 630,
  alt: `${BRAND}: The everyday, remembered.`,
};
