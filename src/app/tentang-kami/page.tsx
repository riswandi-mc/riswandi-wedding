import type { Metadata } from "next"
import Link from "next/link"
import { HeartHandshake, ListChecks, MessageCircle } from "lucide-react"

import { JsonLd } from "@/components/json-ld"
import { PublicPageShell } from "@/components/public-page-shell"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { getPublicHomepageData } from "@/lib/data/public"
import { createPublicPageMetadata } from "@/lib/seo"
import { getSiteOrigin } from "@/lib/site-url"
import { createBasicPageJsonLd } from "@/lib/structured-data"

const pageTitle = "Tentang Riswandi Wedding"
const pageDescription =
  "Kenali identitas, cara kerja, nilai layanan, dan area pelayanan Riswandi Wedding untuk jasa MC serta undangan digital."

export const metadata: Metadata = createPublicPageMetadata({
  title: pageTitle,
  description: pageDescription,
  path: "/tentang-kami",
})

const values = [
  {
    title: "Komunikasi yang jelas",
    description:
      "Kebutuhan acara, susunan agenda, dan preferensi gaya dibahas sebelum hari H.",
    icon: MessageCircle,
  },
  {
    title: "Alur yang terarah",
    description:
      "Persiapan berfokus pada transisi acara, koordinasi, dan pengalaman tamu.",
    icon: ListChecks,
  },
  {
    title: "Pendekatan yang hangat",
    description:
      "Pembawaan disesuaikan agar acara tetap rapi tanpa kehilangan suasana akrab.",
    icon: HeartHandshake,
  },
]

export default async function TentangKamiPage() {
  const data = await getPublicHomepageData()
  const brandName = data.settings?.brand_name || "Riswandi Wedding"
  const jsonLd = createBasicPageJsonLd({
    data,
    siteOrigin: getSiteOrigin(),
    type: "AboutPage",
    name: `Tentang ${brandName}`,
    description: pageDescription,
    path: "/tentang-kami",
  })

  return (
    <>
      <JsonLd data={jsonLd} />
      <PublicPageShell settings={data.settings}>
        <section className="border-b bg-muted/30">
          <div className="container mx-auto grid gap-10 px-4 py-14 md:py-20 lg:grid-cols-[1fr_0.8fr] lg:items-center">
            <div className="space-y-5">
              <Badge variant="outline">Tentang Kami</Badge>
              <h1 className="font-heading text-4xl font-bold text-primary md:text-6xl">
                Pendamping Acara yang Hangat dan Terarah
              </h1>
              <p className="text-lg leading-8 text-muted-foreground">
                {brandName} menyediakan jasa MC wedding, MC all event, dan
                undangan digital. Fokus kami adalah membantu calon klien
                memahami pilihan layanan, menyiapkan detail, dan menjaga
                komunikasi hingga kebutuhan acara terkonfirmasi.
              </p>
            </div>
            <div className="rounded-3xl border bg-background p-8 shadow-sm">
              <h2 className="font-heading text-2xl font-semibold">Area Pelayanan</h2>
              <p className="mt-3 leading-7 text-muted-foreground">
                Layanan reguler mencakup Jakarta, Bogor, Depok, Tangerang, dan
                Bekasi. Kebutuhan luar kota atau luar pulau dapat dibahas dengan
                penyesuaian jadwal, transportasi, dan akomodasi.
              </p>
            </div>
          </div>
        </section>

        <section className="container mx-auto px-4 py-14 md:py-20" aria-labelledby="nilai-layanan">
          <div className="mx-auto max-w-3xl text-center">
            <h2 id="nilai-layanan" className="font-heading text-3xl font-bold text-primary">
              Nilai dalam Setiap Layanan
            </h2>
            <p className="mt-3 leading-7 text-muted-foreground">
              Tiga prinsip ini menjadi dasar proses konsultasi dan persiapan acara.
            </p>
          </div>
          <div className="mt-10 grid gap-6 md:grid-cols-3">
            {values.map((value) => {
              const Icon = value.icon
              return (
                <article key={value.title} className="rounded-2xl border p-6">
                  <Icon className="h-8 w-8 text-primary" aria-hidden="true" />
                  <h3 className="mt-5 font-heading text-xl font-semibold">{value.title}</h3>
                  <p className="mt-2 text-sm leading-6 text-muted-foreground">{value.description}</p>
                </article>
              )
            })}
          </div>
        </section>

        <section className="border-y bg-muted/30 py-14">
          <div className="container mx-auto flex flex-col items-start justify-between gap-6 px-4 md:flex-row md:items-center">
            <div className="max-w-2xl">
              <h2 className="font-heading text-3xl font-bold text-primary">Siap Membahas Acara Anda?</h2>
              <p className="mt-2 text-muted-foreground">
                Pelajari paket MC atau hubungi tim untuk menyampaikan tanggal, lokasi, dan konsep acara.
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <Button asChild><Link href="/layanan-mc">Lihat Layanan MC</Link></Button>
              <Button asChild variant="outline"><Link href="/kontak">Hubungi Kami</Link></Button>
            </div>
          </div>
        </section>
      </PublicPageShell>
    </>
  )
}
