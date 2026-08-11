import type { Metadata } from "next"
import Link from "next/link"
import { ArrowRight, HeartHandshake, ListChecks, MapPin, MessageCircle } from "lucide-react"

import { JsonLd } from "@/components/json-ld"
import { PublicPageHero, SectionHeading } from "@/components/public-ui"
import { Button } from "@/components/ui/button"
import { getPublicHomepageData } from "@/lib/data/public"
import { createPublicPageMetadata } from "@/lib/seo"
import { getSiteOrigin } from "@/lib/site-url"
import { createBasicPageJsonLd } from "@/lib/structured-data"

export const dynamic = "force-dynamic"

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
    title: "Didengar sebelum diarahkan",
    description: "Konsep, profil tamu, preferensi keluarga, dan momen penting dibahas agar acara terasa benar-benar milik Anda.",
    icon: MessageCircle,
    number: "01",
  },
  {
    title: "Rapi tanpa terasa kaku",
    description: "Rundown dan transisi dijaga dengan terarah, sambil tetap memberi ruang untuk interaksi yang hangat dan natural.",
    icon: ListChecks,
    number: "02",
  },
  {
    title: "Hadir sebagai partner",
    description: "Komunikasi dibangun sejak konsultasi hingga hari H agar Anda tidak merasa menjalani persiapan sendirian.",
    icon: HeartHandshake,
    number: "03",
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
      <PublicPageHero
        eyebrow="Tentang Kami"
        title={<>Bekerja rapi.<br /><span className="text-[#d98065] italic">Membawakan dengan hati.</span></>}
        description={<>Di {brandName}, kami percaya acara yang berkesan lahir dari persiapan yang matang dan pembawaan yang terasa dekat—bukan sekadar ramai.</>}
        actions={
          <>
            <Button asChild size="lg"><Link href="/layanan-mc">Temukan Paket MC <ArrowRight className="size-4" /></Link></Button>
            <Button asChild size="lg" variant="outline"><Link href="/kontak">Kenalan & Konsultasi</Link></Button>
          </>
        }
        aside={
          <div>
            <span className="grid size-12 place-items-center rounded-2xl bg-secondary text-primary"><MapPin className="size-5" /></span>
            <h2 className="mt-5 font-heading text-3xl font-semibold text-primary">Dekat untuk Jabodetabek, siap melangkah lebih jauh.</h2>
            <p className="mt-3 leading-7 text-muted-foreground">Layanan reguler mencakup Jakarta, Bogor, Depok, Tangerang, dan Bekasi. Acara luar kota atau luar pulau dapat dibahas dengan penyesuaian jadwal, transportasi, dan akomodasi.</p>
          </div>
        }
      />

      <section className="site-container section-shell" aria-labelledby="nilai-layanan">
        <SectionHeading
          eyebrow="Nilai layanan"
          title={<>Yang kami jaga di<br />setiap acara.</>}
          description="Tiga prinsip sederhana yang membantu proses terasa jelas bagi Anda dan nyaman bagi setiap tamu."
        />
        <div className="grid gap-5 md:grid-cols-3">
          {values.map((value, index) => {
            const Icon = value.icon
            return (
              <article key={value.title} className={`relative overflow-hidden rounded-[1.75rem] border p-7 ${index === 1 ? "border-[#d98065] bg-[#d98065] text-white md:translate-y-4" : index === 2 ? "border-primary bg-primary text-white" : "border-border bg-card"}`}>
                <div className="flex items-center justify-between">
                  <span className={`grid size-13 place-items-center rounded-2xl ${index === 1 ? "bg-white/15" : index === 2 ? "bg-[#c8dc9d] text-primary" : "bg-secondary text-primary"}`}><Icon className="size-6" aria-hidden="true" /></span>
                  <span className="font-heading text-2xl opacity-55">{value.number}</span>
                </div>
                <h3 className="mt-7 font-heading text-3xl font-semibold leading-none">{value.title}</h3>
                <p className={`mt-4 text-sm leading-7 ${index > 0 ? "text-white/70" : "text-muted-foreground"}`}>{value.description}</p>
              </article>
            )
          })}
        </div>
      </section>

      <section className="bg-[#f1c875] py-14 sm:py-18">
        <div className="site-container flex flex-col items-start justify-between gap-7 md:flex-row md:items-center">
          <div className="max-w-2xl">
            <span className="section-eyebrow">Mari mulai</span>
            <h2 className="display-title mt-4 text-4xl text-primary sm:text-5xl">Acara Anda punya cerita. Mari bawakan dengan cara yang tepat.</h2>
          </div>
          <Button asChild size="lg"><Link href="/kontak">Ceritakan Rencana Anda <ArrowRight className="size-4" /></Link></Button>
        </div>
      </section>
    </>
  )
}
