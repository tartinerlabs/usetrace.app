import Link from "next/link";

export function SiteHeader() {
  return (
    <header className="mx-auto flex w-full max-w-[1240px] flex-wrap items-center justify-between gap-4 px-[clamp(20px,5vw,56px)] py-5">
      <Link
        href="/"
        className="flex items-center gap-2.5 rounded-small text-[26px] font-semibold leading-none tracking-[-0.8px]"
      >
        {/* biome-ignore lint/performance/noImgElement: static SVG artwork needs no optimisation */}
        <img src="/brand/logo.svg" alt="" width={30} height={30} />
        trace
      </Link>
      <nav
        aria-label="Primary"
        className="flex items-center gap-[clamp(12px,3vw,28px)] text-[15px]"
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
        <Link
          href="/#download"
          className="inline-flex min-h-11 items-center rounded-full bg-ink px-[18px] font-semibold text-canvas motion-safe:transition-opacity hover:opacity-85"
        >
          Download
        </Link>
      </nav>
    </header>
  );
}
