import type { MetadataRoute } from "next";
import { LIVE as ARC_LIVE } from "@/lib/arc-timeline";
import { LIVE as LOCATION_HISTORY_LIVE } from "@/lib/iphone-location-history";
import { SITE_URL } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: `${SITE_URL}/`, changeFrequency: "monthly", priority: 1 },
    { url: `${SITE_URL}/about`, changeFrequency: "yearly", priority: 0.5 },
    { url: `${SITE_URL}/privacy`, changeFrequency: "yearly", priority: 0.5 },
    { url: `${SITE_URL}/support`, changeFrequency: "yearly", priority: 0.5 },
    {
      url: `${SITE_URL}/google-maps-timeline-alternative`,
      changeFrequency: "monthly",
      priority: 0.7,
    },
    ...(ARC_LIVE
      ? [
          {
            url: `${SITE_URL}/arc-timeline-alternative`,
            changeFrequency: "monthly" as const,
            priority: 0.7,
          },
        ]
      : []),
    ...(LOCATION_HISTORY_LIVE
      ? [
          {
            url: `${SITE_URL}/iphone-location-history`,
            changeFrequency: "monthly" as const,
            priority: 0.7,
          },
        ]
      : []),
  ];
}
