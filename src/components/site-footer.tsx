import Link from "next/link";
import { BRAND, COMPANY, TAGLINE } from "@/lib/site";

export function SiteFooter() {
  return (
    <footer className="border-line border-t">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-4 px-4 py-8 text-secondary text-sm sm:flex-row sm:items-center sm:justify-between sm:px-6">
        <p>
          <span className="font-rounded font-semibold text-ink">{BRAND}</span> —{" "}
          {TAGLINE}
        </p>
        <nav aria-label="Footer">
          <ul className="flex flex-wrap gap-x-6 gap-y-2">
            <li>
              <Link href="/privacy" className="hover:text-ink">
                Privacy Policy
              </Link>
            </li>
            <li>
              <Link href="/support" className="hover:text-ink">
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
