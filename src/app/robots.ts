import type { MetadataRoute } from "next"

import { getSiteOrigin } from "@/lib/site-url"

export default function robots(): MetadataRoute.Robots {
  const siteOrigin = getSiteOrigin()

  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: [
        "/dashboard/",
        "/login",
        "/api/",
        "/preview/",
        "/debug/",
        "/internal/",
      ],
    },
    sitemap: `${siteOrigin}/sitemap.xml`,
  }
}
