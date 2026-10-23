import { APP_STORE_URL } from "@/lib/site";

export function AppStoreBadge() {
  return (
    <a
      href={APP_STORE_URL}
      data-ph-capture-attribute-cta="app-store"
      className="inline-block rounded-[0.6rem]"
    >
      {/* Apple's official black badge artwork. */}
      {/* biome-ignore lint/performance/noImgElement: static SVG artwork needs no optimisation */}
      <img
        src="/badges/app-store-black.svg"
        alt="Download on the App Store"
        width={150}
        height={50}
        className="h-[3.125rem] w-auto"
      />
    </a>
  );
}
