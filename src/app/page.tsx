import HomePageClient from "@/components/home-page-client"
import { getPublicHomepageData } from "@/lib/data/public"

export default async function HomePage() {
  const data = await getPublicHomepageData()

  return <HomePageClient data={data} />
}
