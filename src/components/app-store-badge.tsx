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
          {/* Styled like the badge, without Apple's marks: Apple publishes no
              TestFlight badge. */}
          <a
            href={TESTFLIGHT_URL}
            target="_blank"
            rel="noopener noreferrer"
            data-ph-capture-attribute-cta="testflight"
            className="inline-flex h-[3.125rem] flex-col items-start justify-center whitespace-nowrap rounded-[0.6rem] border border-[#a6a6a6] bg-black px-5 text-white leading-none motion-safe:transition-opacity hover:opacity-85"
          >
            <span className="text-[11px]">Join the beta on</span>
            <span className="mt-0.5 font-semibold text-[21px] tracking-tight">
              TestFlight
            </span>
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
