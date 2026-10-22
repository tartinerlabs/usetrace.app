import { APP_STORE_URL, TESTFLIGHT_URL } from "@/lib/site";

// Apple's official black badge artwork.
function Badge() {
  return (
    // biome-ignore lint/performance/noImgElement: static SVG artwork needs no optimisation
    <img
      src="/badges/app-store-black.svg"
      alt="Download on the App Store"
      width={150}
      height={50}
      className="h-[3.125rem] w-auto"
    />
  );
}

export function AppStoreBadge() {
  if (!APP_STORE_URL) {
    return (
      <div className="inline-flex flex-col items-center gap-2">
        <div className="flex flex-wrap items-center justify-center gap-3">
          <div className="opacity-60" aria-hidden="true">
            <Badge />
          </div>
          {/* Same height and radius as the badge. */}
          <a
            href={TESTFLIGHT_URL}
            target="_blank"
            rel="noopener noreferrer"
            data-ph-capture-attribute-cta="testflight"
            className="inline-flex h-[3.125rem] items-center whitespace-nowrap rounded-[0.6rem] border border-line bg-surface px-6 font-semibold text-[15px] text-ink shadow-sm motion-safe:transition-colors hover:border-sun hover:text-sun"
          >
            Join TestFlight
          </a>
        </div>
        <p className="text-secondary text-sm">
          Available soon on the App Store
        </p>
      </div>
    );
  }

  return (
    <a
      href={APP_STORE_URL}
      data-ph-capture-attribute-cta="app-store"
      className="inline-block rounded-[0.6rem]"
    >
      <Badge />
    </a>
  );
}
