import type { Metadata } from "next"
import Link from "next/link"
import { ArrowLeft, CheckCircle } from "lucide-react"

import { JsonLd } from "@/components/json-ld"
import { PublicPageShell } from "@/components/public-page-shell"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { getPublicHomepageData } from "@/lib/data/public"
import { createPublicPageMetadata } from "@/lib/seo"
import { getSiteOrigin } from "@/lib/site-url"
import { createServicePageJsonLd } from "@/lib/structured-data"
import { cn } from "@/lib/utils"

const pageTitle = "Paket Jasa MC Wedding Jabodetabek"
const pageDescription =
  "Temukan paket jasa MC wedding profesional dari Riswandi Wedding untuk acara yang hangat, terarah, dan berkesan di Jabodetabek maupun luar kota."

const mcFaqs = [
  {
    question: "Apakah bisa menyesuaikan script?",
    answer:
      "Bisa. Gaya bahasa, rundown, dan interaksi dapat disesuaikan dengan tema serta profil tamu.",
  },
  {
    question: "Apakah melayani luar kota?",
    answer:
      "Bisa, dengan pembahasan jadwal serta biaya transportasi dan akomodasi terlebih dahulu.",
  },
  {
    question: "Kapan sebaiknya booking?",
    answer:
      "Hubungi tim sedini mungkin agar jadwal tersedia dan persiapan rundown dapat dilakukan lebih matang.",
  },
]

export const metadata: Metadata = createPublicPageMetadata({
  title: pageTitle,
  description: pageDescription,
  path: "/layanan-mc",
})

function getServiceBadgeClass(variant: string | null) {
  switch (variant) {
    case "popular":
      return "bg-primary/10 text-primary border-primary/20"
    case "best_value":
      return "bg-amber-500/10 text-amber-700 border-amber-300"
    case "exclusive":
      return "bg-slate-900/10 text-slate-700 border-slate-300"
    default:
      return "bg-primary/10 text-primary border-primary/20"
  }
}

export default async function LayananMcPage() {
  const data = await getPublicHomepageData()
  const services = data.services
  const jsonLd = createServicePageJsonLd({
    data,
    siteOrigin: getSiteOrigin(),
    name: "Jasa MC Wedding Profesional",
    description: pageDescription,
    path: "/layanan-mc",
    breadcrumbs: [
      { name: "Beranda", path: "/" },
      { name: "Layanan MC", path: "/layanan-mc" },
    ],
    offers: services.map((service) => ({ name: service.title })),
    faqItems: mcFaqs,
  })

  return (
    <>
      <JsonLd data={jsonLd} />
      <PublicPageShell settings={data.settings}>
      <section className="border-b bg-muted/30">
        <div className="container mx-auto px-4 py-10 md:py-14">
          <Button variant="ghost" asChild className="mb-8 -ml-3 gap-2">
            <Link href="/">
              <ArrowLeft className="h-4 w-4" />
              Kembali ke beranda Riswandi Wedding
            </Link>
          </Button>
          <div className="max-w-3xl space-y-4">
            <Badge variant="outline">Layanan MC</Badge>
            <h1 className="font-heading text-3xl font-bold text-primary md:text-5xl">
              Paket Jasa MC Wedding Profesional di Jabodetabek
            </h1>
            <p className="text-base leading-7 text-muted-foreground md:text-lg">
              Pilih MC tunggal, duo MC, atau paket all event yang sesuai dengan
              konsep, skala, dan kebutuhan interaksi acara Anda.
            </p>
          </div>
        </div>
      </section>

      <section className="container mx-auto px-4 py-12 md:py-16">
        {services.length > 0 ? (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
            {services.map((service) => (
              <Card
                key={service.slug}
                className={cn(
                  "flex flex-col shadow-sm transition-colors hover:border-primary hover:shadow-md",
                  service.is_featured ? "relative overflow-hidden border-primary/40 shadow-md" : "border-primary/20"
                )}
              >
                {service.badge_variant === "best_value" ? (
                  <div className="absolute right-0 top-0 z-10 rounded-bl-lg bg-primary px-4 py-1 text-xs font-bold uppercase text-primary-foreground shadow-sm">
                    Best Value
                  </div>
                ) : null}
                <CardHeader>
                  {service.badge_label ? (
                    <div className="mb-2 flex justify-between">
                      <Badge variant="outline" className={getServiceBadgeClass(service.badge_variant)}>
                        {service.badge_label}
                      </Badge>
                    </div>
                  ) : null}
                  <CardTitle>
                    <h2 className="font-heading text-2xl">{service.title}</h2>
                  </CardTitle>
                  <CardDescription>{service.short_description}</CardDescription>
                </CardHeader>
                <CardContent className="flex-1">
                  <ul className="space-y-3 text-sm text-muted-foreground">
                    {service.features.map((feature) => (
                      <li key={feature} className="flex items-start gap-2">
                        <CheckCircle className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
                <CardFooter>
                  <Button className="w-full" asChild>
                    <Link href="/#layanan">Booking {service.title} di Beranda</Link>
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        ) : (
          <div className="rounded-lg border border-dashed p-10 text-center text-muted-foreground">
            Daftar paket dinamis sedang tidak tersedia. Anda tetap dapat
            membaca cakupan layanan dan menghubungi kami melalui beranda.
          </div>
        )}
      </section>

      <section className="border-y bg-muted/30 py-12 md:py-16" aria-labelledby="cakupan-layanan-mc">
        <div className="container mx-auto grid gap-10 px-4 lg:grid-cols-2">
          <div className="space-y-4">
            <h2 id="cakupan-layanan-mc" className="font-heading text-3xl font-bold text-primary">
              Cakupan Layanan MC Riswandi Wedding
            </h2>
            <p className="leading-7 text-muted-foreground">
              Setiap acara diawali dengan pembahasan konsep, profil tamu, susunan
              acara, dan gaya komunikasi yang diinginkan. MC membantu menjaga
              transisi antaragenda, membangun interaksi dengan tamu, serta
              berkoordinasi dengan keluarga dan vendor saat hari H.
            </p>
            <p className="leading-7 text-muted-foreground">
              Layanan reguler mencakup Jabodetabek dan sekitarnya. Acara di luar
              kota atau luar pulau dapat dibahas lebih lanjut dengan penyesuaian
              transportasi dan akomodasi.
            </p>
          </div>
          <div className="space-y-5">
            <h2 className="font-heading text-3xl font-bold text-primary">Proses Booking MC</h2>
            <ol className="space-y-4 text-muted-foreground">
              <li><strong className="text-foreground">1. Pilih paket.</strong> Sesuaikan format MC dengan jenis dan skala acara.</li>
              <li><strong className="text-foreground">2. Kirim detail acara.</strong> Sampaikan tanggal, lokasi, konsep, dan kebutuhan khusus.</li>
              <li><strong className="text-foreground">3. Konfirmasi jadwal.</strong> Tim meninjau ketersediaan lalu mengonfirmasi booking dan persiapan.</li>
            </ol>
          </div>
        </div>
      </section>

      <section className="container mx-auto px-4 py-12 md:py-16" aria-labelledby="faq-layanan-mc">
        <div className="mx-auto max-w-4xl space-y-8">
          <div className="space-y-3 text-center">
            <h2 id="faq-layanan-mc" className="font-heading text-3xl font-bold text-primary">
              Pertanyaan tentang Layanan MC
            </h2>
            <p className="text-muted-foreground">
              Informasi singkat sebelum Anda mengirim detail acara.
            </p>
          </div>
          <div className="grid gap-4 md:grid-cols-3">
            {mcFaqs.map((faq) => (
              <article key={faq.question} className="rounded-xl border p-5">
                <h3 className="font-heading text-lg font-semibold">{faq.question}</h3>
                <p className="mt-2 text-sm leading-6 text-muted-foreground">{faq.answer}</p>
              </article>
            ))}
          </div>
          <div className="flex flex-col justify-center gap-3 sm:flex-row">
            <Button asChild size="lg">
              <Link href="/#layanan">Pilih Paket dan Booking MC</Link>
            </Button>
            <Button asChild size="lg" variant="outline">
              <Link href="/kontak">Hubungi Riswandi Wedding</Link>
            </Button>
          </div>
        </div>
      </section>
      </PublicPageShell>
    </>
  )
}
