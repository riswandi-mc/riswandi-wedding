import type { Metadata } from "next"
import Image from "next/image"
import Link from "next/link"
import { CheckCircle, ExternalLink, ImageIcon } from "lucide-react"

import { JsonLd } from "@/components/json-ld"
import { PublicPageShell } from "@/components/public-page-shell"
import { TrackedExternalLink } from "@/components/tracked-external-link"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { getPublicHomepageData } from "@/lib/data/public"
import { getSecureExternalUrl } from "@/lib/public-links"
import { createPublicPageMetadata } from "@/lib/seo"
import { getSiteOrigin } from "@/lib/site-url"
import { resolvePublicStorageUrl } from "@/lib/storage-url"
import { createServicePageJsonLd } from "@/lib/structured-data"

const pageTitle = "Undangan Digital Pernikahan Elegan"
const pageDescription =
  "Pilih template undangan digital Riswandi Wedding, lihat demo dan harga, lalu pesan dengan proses yang jelas untuk persiapan pernikahan Anda."

export const metadata: Metadata = createPublicPageMetadata({
  title: pageTitle,
  description: pageDescription,
  path: "/undangan-digital",
})

function formatCurrency(value: number) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(value)
}

export default async function UndanganDigitalPage() {
  const data = await getPublicHomepageData()
  const jsonLd = createServicePageJsonLd({
    data,
    siteOrigin: getSiteOrigin(),
    name: "Undangan Digital Pernikahan",
    description: pageDescription,
    path: "/undangan-digital",
    breadcrumbs: [
      { name: "Beranda", path: "/" },
      { name: "Undangan Digital", path: "/undangan-digital" },
    ],
    offers: data.templates.map((template) => ({
      name: template.name,
      price: template.promo_price,
    })),
  })

  return (
    <>
      <JsonLd data={jsonLd} />
      <PublicPageShell settings={data.settings}>
        <section className="border-b bg-muted/30">
          <div className="container mx-auto px-4 py-14 md:py-20">
            <div className="max-w-3xl space-y-5">
              <Badge variant="outline">Undangan Digital</Badge>
              <h1 className="font-heading text-4xl font-bold text-primary md:text-6xl">
                Undangan Digital Pernikahan yang Praktis dan Elegan
              </h1>
              <p className="text-lg leading-8 text-muted-foreground">
                Bandingkan tema, harga, dan demo yang tersedia. Setelah memilih
                desain, kirim data acara melalui formulir agar pesanan dapat
                dikonfirmasi oleh tim Riswandi Wedding.
              </p>
              <Button asChild size="lg">
                <Link href="/#undangan">Buka Form Pemesanan Undangan</Link>
              </Button>
            </div>
          </div>
        </section>

        <section className="container mx-auto px-4 py-14 md:py-20" aria-labelledby="katalog-undangan">
          <div className="mb-10 max-w-3xl space-y-3">
            <h2 id="katalog-undangan" className="font-heading text-3xl font-bold text-primary">
              Katalog Template dan Harga
            </h2>
            <p className="leading-7 text-muted-foreground">
              Demo hanya ditampilkan untuk URL HTTPS yang telah ditandai siap.
              Harga dan batas waktu pemesanan mengikuti data katalog aktif.
            </p>
          </div>

          {data.templates.length > 0 ? (
            <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
              {data.templates.map((template) => {
                const preview = resolvePublicStorageUrl(
                  "invitation-template",
                  template.preview_image_url,
                )
                const demoUrl = template.is_demo_ready
                  ? getSecureExternalUrl(template.demo_url)
                  : null

                return (
                  <Card key={template.slug} className="overflow-hidden">
                    <div className="relative aspect-[4/3] bg-muted">
                      {preview ? (
                        <Image
                          src={preview}
                          alt={`Pratinjau desain undangan digital ${template.name}`}
                          fill
                          sizes="(max-width: 640px) 100vw, (max-width: 1280px) 50vw, 33vw"
                          className="object-cover"
                        />
                      ) : (
                        <div className="flex h-full flex-col items-center justify-center gap-3 bg-gradient-to-br from-primary/5 to-primary/15 text-muted-foreground">
                          <ImageIcon className="h-10 w-10" aria-hidden="true" />
                          <span className="text-sm">Pratinjau belum tersedia</span>
                        </div>
                      )}
                    </div>
                    <CardHeader>
                      <CardTitle className="font-heading text-xl">{template.name}</CardTitle>
                      <p className="text-sm text-muted-foreground">
                        Tema: {template.theme || "Sesuai katalog"}
                      </p>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="flex items-baseline gap-2">
                        <span className="text-sm text-muted-foreground line-through">
                          {formatCurrency(template.original_price)}
                        </span>
                        <strong className="text-xl text-primary">
                          {formatCurrency(template.promo_price)}
                        </strong>
                      </div>
                      <p className="text-sm leading-6 text-muted-foreground">
                        Pesan minimal {template.min_order_days} hari sebelum
                        tanggal acara agar data dan revisi dapat diproses.
                      </p>
                    </CardContent>
                    <CardFooter className="flex gap-2">
                      {demoUrl ? (
                        <Button asChild variant="outline" className="flex-1">
                          <TrackedExternalLink
                            href={demoUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            eventName="invitation_demo_click"
                            eventLocation="invitation_catalog"
                          >
                            Lihat Demo <ExternalLink className="ml-2 h-4 w-4" />
                          </TrackedExternalLink>
                        </Button>
                      ) : (
                        <Button variant="outline" className="flex-1" disabled>
                          Demo belum siap
                        </Button>
                      )}
                      <Button asChild className="flex-1">
                        <Link href="/#undangan">Pilih Template</Link>
                      </Button>
                    </CardFooter>
                  </Card>
                )
              })}
            </div>
          ) : (
            <div className="rounded-xl border border-dashed p-10 text-center text-muted-foreground">
              Katalog dinamis sedang tidak tersedia. Form pemesanan dan kontak
              WhatsApp tetap dapat digunakan dari beranda.
            </div>
          )}
        </section>

        <section className="border-y bg-muted/30 py-14 md:py-20">
          <div className="container mx-auto grid gap-10 px-4 lg:grid-cols-2">
            <div className="space-y-5">
              <h2 className="font-heading text-3xl font-bold text-primary">Yang Anda Dapatkan</h2>
              <ul className="space-y-4 text-muted-foreground">
                {[
                  "Pilihan desain dengan tema yang dapat dibandingkan sebelum memesan.",
                  "Tautan undangan yang praktis untuk dibagikan kepada tamu.",
                  "Revisi minor maksimal dua kali sebelum hari acara sesuai ketentuan FAQ.",
                  "Konfirmasi pesanan langsung dengan admin melalui WhatsApp.",
                ].map((feature) => (
                  <li key={feature} className="flex gap-3">
                    <CheckCircle className="mt-1 h-5 w-5 shrink-0 text-primary" aria-hidden="true" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="space-y-5">
              <h2 className="font-heading text-3xl font-bold text-primary">Proses Pemesanan</h2>
              <ol className="space-y-4 text-muted-foreground">
                <li><strong className="text-foreground">1. Pilih template.</strong> Bandingkan tema, demo, dan harga yang tersedia.</li>
                <li><strong className="text-foreground">2. Isi data acara.</strong> Masukkan nama mempelai, tanggal, lokasi, serta target selesai.</li>
                <li><strong className="text-foreground">3. Konfirmasi.</strong> Lanjutkan ke WhatsApp untuk pemeriksaan data dan pembayaran.</li>
              </ol>
              <Link href="/faq" className="inline-flex font-medium text-primary underline-offset-4 hover:underline">
                Baca ketentuan pemesanan di halaman FAQ
              </Link>
            </div>
          </div>
        </section>
      </PublicPageShell>
    </>
  )
}
