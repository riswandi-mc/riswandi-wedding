import type { Metadata } from "next"
import Link from "next/link"
import { Camera, Mail, MapPin, MessageCircle } from "lucide-react"

import { JsonLd } from "@/components/json-ld"
import { PublicPageShell } from "@/components/public-page-shell"
import { TrackedExternalLink } from "@/components/tracked-external-link"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { getPublicHomepageData } from "@/lib/data/public"
import {
  buildWhatsAppUrl,
  FALLBACK_INSTAGRAM,
  FALLBACK_WHATSAPP,
  getInstagramLabel,
} from "@/lib/public-links"
import { createPublicPageMetadata } from "@/lib/seo"
import { getSiteOrigin } from "@/lib/site-url"
import { createBasicPageJsonLd } from "@/lib/structured-data"

const pageTitle = "Kontak Riswandi Wedding"
const pageDescription =
  "Hubungi Riswandi Wedding melalui WhatsApp, email, atau Instagram untuk konsultasi jasa MC dan undangan digital di Jabodetabek."

export const metadata: Metadata = createPublicPageMetadata({
  title: pageTitle,
  description: pageDescription,
  path: "/kontak",
})

export default async function KontakPage() {
  const data = await getPublicHomepageData()
  const whatsapp = data.settings?.phone_whatsapp || FALLBACK_WHATSAPP
  const instagram = data.settings?.instagram_url || FALLBACK_INSTAGRAM
  const whatsappUrl = buildWhatsAppUrl(
    whatsapp,
    "Halo Kak Riswandi! Saya ingin konsultasi tentang jasa MC atau undangan digital.",
  )
  const jsonLd = createBasicPageJsonLd({
    data,
    siteOrigin: getSiteOrigin(),
    type: "ContactPage",
    name: "Kontak Riswandi Wedding",
    description: pageDescription,
    path: "/kontak",
  })

  return (
    <>
      <JsonLd data={jsonLd} />
      <PublicPageShell settings={data.settings}>
        <section className="border-b bg-muted/30">
          <div className="container mx-auto px-4 py-14 md:py-20">
            <div className="max-w-3xl space-y-5">
              <Badge variant="outline">Kontak</Badge>
              <h1 className="font-heading text-4xl font-bold text-primary md:text-6xl">
                Hubungi Riswandi Wedding
              </h1>
              <p className="text-lg leading-8 text-muted-foreground">
                Sampaikan jenis acara, tanggal, lokasi, dan kebutuhan utama agar
                tim dapat meninjau jadwal serta mengarahkan Anda ke layanan yang sesuai.
              </p>
            </div>
          </div>
        </section>

        <section className="container mx-auto grid gap-6 px-4 py-14 md:grid-cols-2 md:py-20">
          <article className="rounded-2xl border p-6 shadow-sm">
            <MessageCircle className="h-9 w-9 text-primary" aria-hidden="true" />
            <h2 className="mt-5 font-heading text-2xl font-semibold">WhatsApp</h2>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">
              Kanal utama untuk konsultasi jadwal, paket, dan konfirmasi pesanan.
            </p>
            <Button asChild className="mt-5">
              <TrackedExternalLink
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                eventName="whatsapp_click"
                eventLocation="contact_page"
              >
                Chat +{whatsapp}
              </TrackedExternalLink>
            </Button>
          </article>

          <article className="rounded-2xl border p-6 shadow-sm">
            <Camera className="h-9 w-9 text-primary" aria-hidden="true" />
            <h2 className="mt-5 font-heading text-2xl font-semibold">Instagram</h2>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">
              Lihat pembaruan dokumentasi dan informasi layanan melalui profil resmi.
            </p>
            <Button asChild variant="outline" className="mt-5">
              <TrackedExternalLink
                href={instagram}
                target="_blank"
                rel="noopener noreferrer"
                eventName="instagram_click"
                eventLocation="contact_page"
              >
                {getInstagramLabel(instagram)}
              </TrackedExternalLink>
            </Button>
          </article>

          {data.settings?.email ? (
            <article className="rounded-2xl border p-6 shadow-sm">
              <Mail className="h-9 w-9 text-primary" aria-hidden="true" />
              <h2 className="mt-5 font-heading text-2xl font-semibold">Email</h2>
              <p className="mt-2 text-sm leading-6 text-muted-foreground">
                Gunakan email untuk kebutuhan tertulis atau lampiran detail acara.
              </p>
              <Button asChild variant="outline" className="mt-5">
                <TrackedExternalLink
                  href={`mailto:${data.settings.email}`}
                  eventName="email_click"
                  eventLocation="contact_page"
                >
                  {data.settings.email}
                </TrackedExternalLink>
              </Button>
            </article>
          ) : null}

          <article className="rounded-2xl border p-6 shadow-sm">
            <MapPin className="h-9 w-9 text-primary" aria-hidden="true" />
            <h2 className="mt-5 font-heading text-2xl font-semibold">Area Layanan</h2>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">
              {data.settings?.address
                ? data.settings.address
                : "Jakarta, Bogor, Depok, Tangerang, Bekasi, serta luar kota sesuai kesepakatan."}
            </p>
          </article>
        </section>

        <section className="border-y bg-muted/30 py-14">
          <div className="container mx-auto flex flex-col items-start justify-between gap-6 px-4 md:flex-row md:items-center">
            <div>
              <h2 className="font-heading text-3xl font-bold text-primary">Siapkan Informasi Dasar</h2>
              <p className="mt-2 text-muted-foreground">
                Jenis acara, tanggal, lokasi, perkiraan durasi, serta pilihan layanan akan membantu konsultasi lebih cepat.
              </p>
            </div>
            <Button asChild variant="outline"><Link href="/faq">Baca FAQ Sebelum Menghubungi</Link></Button>
          </div>
        </section>
      </PublicPageShell>
    </>
  )
}
