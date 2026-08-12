import type { Metadata } from "next"

import HomePageClient from "@/components/home-page-client"
import { JsonLd } from "@/components/json-ld"
import { getPublicHomepageData } from "@/lib/data/public"
import { createPublicPageMetadata, SITE_DESCRIPTION, SITE_TITLE } from "@/lib/seo"
import { getSiteOrigin } from "@/lib/site-url"
import { createHomeJsonLd } from "@/lib/structured-data"

export const dynamic = "force-dynamic"

export const metadata: Metadata = createPublicPageMetadata({
  title: SITE_TITLE,
  description: SITE_DESCRIPTION,
  path: "/",
  absoluteTitle: true,
  keywords: [
    "jasa MC wedding Jakarta",
    "MC pernikahan profesional Jabodetabek",
    "undangan digital pernikahan elegan",
    "MC resepsi pernikahan",
    "wedding MC Jakarta Bogor Depok Tangerang Bekasi",
    "pembawa acara pernikahan",
  ],
})

export default async function HomePage() {
  const data = await getPublicHomepageData()
  const jsonLd = createHomeJsonLd(data, getSiteOrigin())

  return (
    <>
      <JsonLd data={jsonLd} />
      <HomePageClient data={data} />
    </>
  )
}
