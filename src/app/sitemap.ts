import type { MetadataRoute } from "next";
import { LIVE as ARC_LIVE } from "@/lib/arc-timeline";
import { SITE_URL } from "@/lib/site";

// Google trusts lastModified only while it stays accurate, so update a page's
// date when its content changes.
export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: `${SITE_URL}/`,
      lastModified: "2026-10-30",
      changeFrequency: "monthly",
      priority: 1,
    },
    {
      url: `${SITE_URL}/about`,
      lastModified: "2026-10-18",
      changeFrequency: "yearly",
      priority: 0.5,
    },
    {
      url: `${SITE_URL}/privacy`,
      lastModified: "2026-10-18",
      changeFrequency: "yearly",
      priority: 0.5,
    },
    {
      url: `${SITE_URL}/support`,
      lastModified: "2026-10-23",
      changeFrequency: "yearly",
      priority: 0.5,
    },
    {
      url: `${SITE_URL}/google-maps-timeline-alternative`,
      lastModified: "2026-10-25",
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
  ];
}
