import Link from "next/link";
import { APP_STORE_ID, APP_STORE_PROVIDER_TOKEN } from "@/lib/site";

export function SiteHeader() {
  return (
    <header className="mx-auto grid w-full max-w-site grid-cols-[1fr_auto] items-center gap-4 px-gutter-wide py-5 sm:grid-cols-[1fr_auto_1fr]">
      <Link
        href="/"
        className="flex w-fit items-center gap-2.5 rounded-small text-title-1 font-semibold leading-none tracking-[-0.8px]"
      >
        {/* biome-ignore lint/performance/noImgElement: static SVG artwork needs no optimisation */}
        <img src="/brand/logo.svg" alt="" width={30} height={30} />
        trace
      </Link>
      <nav
        aria-label="Primary"
        className="flex items-center gap-[clamp(12px,3vw,28px)] text-subhead max-sm:hidden"
      >
        <Link
          href="/#privacy"
          className="text-secondary motion-safe:transition-colors hover:text-ink"
        >
          Privacy
        </Link>
        <Link
          href="/#faq"
          className="text-secondary motion-safe:transition-colors hover:text-ink"
        >
          Questions
        </Link>
      </nav>
      <a
        href={`https://apps.apple.com/app/apple-store/id${APP_STORE_ID}?pt=${APP_STORE_PROVIDER_TOKEN}&ct=header&mt=8`}
        data-ph-capture-attribute-cta="app-store"
        className="inline-flex min-h-11 items-center justify-self-end rounded-full bg-accent px-4.5 font-semibold text-on-accent motion-safe:transition-opacity hover:opacity-85"
      >
        Download
      </a>
    </header>
  );
}
