import type { MetadataRoute } from "next"

import { getSiteOrigin } from "@/lib/site-url"

export default function sitemap(): MetadataRoute.Sitemap {
  const siteOrigin = getSiteOrigin()
  const contentLastModified = "2026-08-11"

  return [
    {
      url: siteOrigin,
      lastModified: contentLastModified,
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: `${siteOrigin}/layanan-mc`,
      lastModified: contentLastModified,
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${siteOrigin}/undangan-digital`,
      lastModified: contentLastModified,
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${siteOrigin}/galeri`,
      lastModified: contentLastModified,
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: `${siteOrigin}/tentang-kami`,
      lastModified: contentLastModified,
      changeFrequency: "yearly",
      priority: 0.6,
    },
    {
      url: `${siteOrigin}/kontak`,
      lastModified: contentLastModified,
      changeFrequency: "yearly",
      priority: 0.7,
    },
    {
      url: `${siteOrigin}/faq`,
      lastModified: contentLastModified,
      changeFrequency: "monthly",
      priority: 0.7,
    },
  ]
}
