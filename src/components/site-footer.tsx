import Link from "next/link";
import { COMPANY } from "@/lib/site";

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
              <Link href="/privacy" className="hover:text-on-night">
                Privacy
              </Link>
            </li>
            <li>
              <Link href="/support" className="hover:text-on-night">
                Support
              </Link>
            </li>
            {/* Literal year: new Date() is not allowed during prerender with cacheComponents. */}
            <li>© 2026 {COMPANY}</li>
          </ul>
        </nav>
      </div>
    </footer>
  );
}
