import { APP_STORE_ID, APP_STORE_PROVIDER_TOKEN } from "@/lib/site";

// `campaign` names the page in App Store Connect campaigns (max 30 characters).
export function AppStoreBadge({ campaign }: { campaign: string }) {
  return (
    <a
      href={`https://apps.apple.com/app/apple-store/id${APP_STORE_ID}?pt=${APP_STORE_PROVIDER_TOKEN}&ct=${campaign}&mt=8`}
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
