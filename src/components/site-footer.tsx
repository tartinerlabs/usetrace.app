import Link from "next/link";
import { BRAND, TESTFLIGHT_URL } from "@/lib/site";

export function SiteFooter() {
  return (
    <footer className="border-night-line border-t bg-night text-night-secondary">
      <div className="mx-auto flex w-full max-w-[1240px] flex-wrap items-center justify-between gap-4 px-[clamp(20px,5vw,56px)] py-7 text-sm">
        <p className="flex items-center gap-2 text-on-night">
          {/* biome-ignore lint/performance/noImgElement: static SVG artwork needs no optimisation */}
          <img src="/brand/logo-dark.svg" alt="" width={20} height={20} />
          <span className="font-semibold text-lg tracking-[-0.4px]">trace</span>
        </p>
        <nav aria-label="Footer">
          <ul className="flex flex-wrap gap-x-6 gap-y-2">
            <li>
              <Link href="/about" className="hover:text-on-night">
                About
              </Link>
            </li>
            <li>
              <Link href="/privacy" className="hover:text-on-night">
                Privacy Policy
              </Link>
            </li>
            <li>
              <Link href="/support" className="hover:text-on-night">
                Support
              </Link>
            </li>
            <li>
              <Link
                href="/google-maps-timeline-alternative"
                className="hover:text-on-night"
              >
                Google Maps Timeline alternative
              </Link>
            </li>
            <li>
              <a
                href={TESTFLIGHT_URL}
                target="_blank"
                rel="noopener noreferrer"
                data-ph-capture-attribute-cta="testflight"
                className="hover:text-on-night"
              >
                TestFlight beta
              </a>
            </li>
            {/* Literal year: new Date() is not allowed during prerender with cacheComponents. */}
            <li>© 2026 {BRAND}</li>
          </ul>
        </nav>
      </div>
    </footer>
  );
}
