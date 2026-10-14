import type { Metadata, Viewport } from "next";
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
    <html lang="en" className="antialiased">
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
      </body>
    </html>
  );
}
