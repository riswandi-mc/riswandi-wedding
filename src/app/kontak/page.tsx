import type { Metadata } from "next"
import Link from "next/link"
import { ArrowRight, Camera, Clock3, Mail, MapPin, MessageCircle } from "lucide-react"

import { JsonLd } from "@/components/json-ld"
import { PublicPageShell } from "@/components/public-page-shell"
import { PublicPageHero, SectionHeading } from "@/components/public-ui"
import { TrackedExternalLink } from "@/components/tracked-external-link"
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

export const metadata: Metadata = createPublicPageMetadata({ title: pageTitle, description: pageDescription, path: "/kontak" })

export default async function KontakPage() {
  const data = await getPublicHomepageData()
  const whatsapp = data.settings?.phone_whatsapp || FALLBACK_WHATSAPP
  const instagram = data.settings?.instagram_url || FALLBACK_INSTAGRAM
  const whatsappUrl = buildWhatsAppUrl(whatsapp, "Halo Kak Riswandi! Saya ingin konsultasi gratis. Jenis acara saya: ..., tanggal: ..., lokasi: ...")
  const jsonLd = createBasicPageJsonLd({ data, siteOrigin: getSiteOrigin(), type: "ContactPage", name: "Kontak Riswandi Wedding", description: pageDescription, path: "/kontak" })

  return (
    <>
      <JsonLd data={jsonLd} />
      <PublicPageShell settings={data.settings}>
        <PublicPageHero
          eyebrow="Mari berbincang"
          title={<>Ceritakan acaranya.<br /><span className="text-[#d98065] italic">Kami bantu menyiapkannya.</span></>}
          description="Mulai dengan cerita singkat tentang tanggal, lokasi, dan suasana yang Anda inginkan. Kami akan membantu mengarahkan pilihan layanan dengan jelas dan nyaman."
          actions={
            <>
              <Button asChild size="lg"><TrackedExternalLink href={whatsappUrl} target="_blank" rel="noopener noreferrer" eventName="whatsapp_click" eventLocation="contact_hero">Mulai Konsultasi Gratis <ArrowRight className="size-4" /></TrackedExternalLink></Button>
              <Button asChild size="lg" variant="outline"><Link href="/faq">Baca FAQ Dulu</Link></Button>
            </>
          }
          aside={
            <div>
              <span className="grid size-12 place-items-center rounded-2xl bg-[#c8dc9d] text-primary"><Clock3 className="size-5" /></span>
              <h2 className="mt-5 font-heading text-3xl font-semibold text-primary">Konsultasi awal, tanpa komitmen.</h2>
              <p className="mt-3 leading-7 text-muted-foreground">Sampaikan kebutuhan dasar Anda. Tim akan mengecek ketersediaan dan memberi arahan langkah berikutnya sebelum Anda memutuskan.</p>
            </div>
          }
        />

        <section className="site-container section-shell">
          <SectionHeading eyebrow="Pilih kanal" title={<>Hubungi dengan cara<br />yang paling nyaman.</>} description="WhatsApp adalah kanal tercepat untuk cek jadwal. Email cocok untuk detail tertulis, sementara Instagram menyimpan dokumentasi terbaru kami." />
          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-4">
            <article className="rounded-[1.75rem] border border-primary bg-primary p-7 text-white lg:col-span-2">
              <span className="grid size-13 place-items-center rounded-2xl bg-[#c8dc9d] text-primary"><MessageCircle className="size-6" /></span>
              <h2 className="mt-7 font-heading text-4xl font-semibold">WhatsApp</h2>
              <p className="mt-3 max-w-md leading-7 text-white/70">Pilihan terbaik untuk cek jadwal, konsultasi paket, dan konfirmasi kebutuhan acara secara langsung.</p>
              <Button asChild className="mt-7 border-[#91a96e] bg-gradient-to-b from-[#e0edbf] via-[#c8dc9d] to-[#a8c477] text-primary shadow-[inset_0_1px_0_rgba(255,255,255,.7),inset_0_-2px_0_rgba(49,92,70,.18),0_5px_0_#789652,0_9px_20px_rgba(0,0,0,.2)]">
                <TrackedExternalLink href={whatsappUrl} target="_blank" rel="noopener noreferrer" eventName="whatsapp_click" eventLocation="contact_card">Chat +{whatsapp}</TrackedExternalLink>
              </Button>
            </article>

            <article className="rounded-[1.75rem] border border-border bg-card p-7">
              <Camera className="size-7 text-[#d98065]" aria-hidden="true" />
              <h2 className="mt-6 font-heading text-3xl font-semibold">Instagram</h2>
              <p className="mt-3 text-sm leading-7 text-muted-foreground">Lihat dokumentasi, gaya pembawaan, dan pembaruan layanan terbaru.</p>
              <Button asChild variant="outline" className="mt-6 w-full"><TrackedExternalLink href={instagram} target="_blank" rel="noopener noreferrer" eventName="instagram_click" eventLocation="contact_card">{getInstagramLabel(instagram)}</TrackedExternalLink></Button>
            </article>

            <article className="rounded-[1.75rem] border border-border bg-secondary p-7">
              <MapPin className="size-7 text-primary" aria-hidden="true" />
              <h2 className="mt-6 font-heading text-3xl font-semibold">Area Layanan</h2>
              <p className="mt-3 text-sm leading-7 text-muted-foreground">{data.settings?.address || "Jakarta, Bogor, Depok, Tangerang, Bekasi, serta luar kota sesuai kesepakatan."}</p>
            </article>

            {data.settings?.email ? (
              <article className="rounded-[1.75rem] border border-border bg-card p-7 md:col-span-2 lg:col-span-4">
                <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-center">
                  <div className="flex items-start gap-4"><span className="grid size-12 shrink-0 place-items-center rounded-2xl bg-secondary text-primary"><Mail className="size-5" /></span><div><h2 className="font-heading text-2xl font-semibold">Kebutuhan tertulis & lampiran</h2><p className="mt-1 text-sm text-muted-foreground">Kirim brief atau detail vendor melalui email.</p></div></div>
                  <Button asChild variant="outline"><TrackedExternalLink href={`mailto:${data.settings.email}`} eventName="email_click" eventLocation="contact_card">{data.settings.email}</TrackedExternalLink></Button>
                </div>
              </article>
            ) : null}
          </div>
        </section>

        <section className="bg-[#f1c875] py-14 sm:py-18">
          <div className="site-container grid gap-8 md:grid-cols-[.7fr_1.3fr] md:items-start">
            <div><span className="section-eyebrow">Agar lebih cepat</span><h2 className="display-title mt-4 text-4xl text-primary sm:text-5xl">Siapkan empat informasi ini.</h2></div>
            <ol className="grid gap-3 sm:grid-cols-2">
              {["Jenis dan konsep acara", "Tanggal serta perkiraan durasi", "Lokasi atau venue", "Pilihan layanan yang diminati"].map((item, index) => <li key={item} className="flex items-center gap-3 rounded-2xl bg-[#fff9e7] p-4 text-sm font-semibold"><span className="grid size-8 shrink-0 place-items-center rounded-full bg-primary font-heading text-white">{index + 1}</span>{item}</li>)}
            </ol>
          </div>
        </section>
      </PublicPageShell>
    </>
  )
}
