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
        <div className="opacity-60" aria-hidden="true">
          <Badge />
        </div>
        <p className="text-secondary text-sm">
          Available soon on the App Store
        </p>
        <a
          href={TESTFLIGHT_URL}
          className="text-sm font-medium underline underline-offset-4"
        >
          Join the beta on TestFlight
        </a>
      </div>
    );
  }

  return (
    <a href={APP_STORE_URL} className="inline-block rounded-[0.6rem]">
      <Badge />
    </a>
  );
}
