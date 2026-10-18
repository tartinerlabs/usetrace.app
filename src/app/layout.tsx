import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import {
  APP_STORE_ID,
  APP_STORE_NAME,
  BRAND,
  DESCRIPTION,
  SITE_URL,
  TAGLINE,
} from "@/lib/site";
import "./globals.css";

const geist = Geist({ subsets: ["latin"], variable: "--font-geist" });
const geistMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-geist-mono",
});

// Only the glyphs the site uses, in alphabetical order as Google Fonts requires.
const ICON_NAMES = [
  "account_circle",
  "add",
  "arrow_forward",
  "auto_awesome",
  "block",
  "calendar_today",
  "cloud_lock",
  "content_cut",
  "directions_bike",
  "directions_boat",
  "directions_car",
  "directions_run",
  "directions_walk",
  "explore",
  "graphic_eq",
  "hiking",
  "history",
  "home",
  "local_bar",
  "location_on",
  "lock",
  "park",
  "pause",
  "pause_circle",
  "play_arrow",
  "replay",
  "restaurant",
  "route",
  "screen_lock_portrait",
  "train",
  "widgets",
  "wifi",
  "work",
];
const ICON_FONT_URL = `https://fonts.googleapis.com/css2?family=Material+Symbols+Rounded:opsz,wght,FILL,GRAD@20..48,300..700,0..1,0&icon_names=${ICON_NAMES.join(",")}&display=block`;

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: `${APP_STORE_NAME} · ${TAGLINE}`,
    template: `%s · ${BRAND}`,
  },
  description: DESCRIPTION,
  applicationName: BRAND,
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    siteName: BRAND,
    url: "/",
    title: APP_STORE_NAME,
    description: DESCRIPTION,
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: APP_STORE_NAME,
    description: DESCRIPTION,
  },
  // Smart App Banner, only once the app is on the App Store.
  itunes: APP_STORE_ID ? { appId: APP_STORE_ID } : null,
};

export const viewport: Viewport = {
  themeColor: "#f4f2ec",
  colorScheme: "light",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${geist.variable} ${geistMono.variable} antialiased`}
    >
      <head>
        <link rel="stylesheet" href={ICON_FONT_URL} precedence="default" />
      </head>
      <body className="flex min-h-dvh flex-col">
        <a
          href="#main"
          className="sr-only rounded-small bg-ink px-4 py-2 text-on-ink focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50"
        >
          Skip to content
        </a>
        <SiteHeader />
        <main id="main" className="flex-1">
          {children}
        </main>
        <SiteFooter />
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
