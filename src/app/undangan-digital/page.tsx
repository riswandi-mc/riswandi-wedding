import type { Metadata } from "next"
import Image from "next/image"
import Link from "next/link"
import { ArrowRight, CheckCircle, ExternalLink, ImageIcon, Smartphone } from "lucide-react"

import { JsonLd } from "@/components/json-ld"
import { EmptyState, PublicPageHero, SectionHeading } from "@/components/public-ui"
import { TrackedExternalLink } from "@/components/tracked-external-link"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { getPublicHomepageData } from "@/lib/data/public"
import { getSecureExternalUrl } from "@/lib/public-links"
import { createPublicPageMetadata } from "@/lib/seo"
import { getSiteOrigin } from "@/lib/site-url"
import { resolvePublicStorageUrl } from "@/lib/storage-url"
import { createServicePageJsonLd } from "@/lib/structured-data"
import { cn } from "@/lib/utils"

export const dynamic = "force-dynamic"

const pageTitle = "Undangan Digital Pernikahan Elegan"
const pageDescription = "Pilih template undangan digital Riswandi Wedding, lihat demo dan harga, lalu pesan dengan proses yang jelas untuk persiapan pernikahan Anda."

export const metadata: Metadata = createPublicPageMetadata({ title: pageTitle, description: pageDescription, path: "/undangan-digital" })

function formatCurrency(value: number) {
  return new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 }).format(value)
}

export default async function UndanganDigitalPage() {
  const data = await getPublicHomepageData()
  const jsonLd = createServicePageJsonLd({ data, siteOrigin: getSiteOrigin(), name: "Undangan Digital Pernikahan", description: pageDescription, path: "/undangan-digital", breadcrumbs: [{ name: "Beranda", path: "/" }, { name: "Undangan Digital", path: "/undangan-digital" }], offers: data.templates.map((template) => ({ name: template.name, price: template.promo_price })) })

  return (
    <>
      <JsonLd data={jsonLd} />
      <PublicPageHero
        eyebrow="Undangan Digital"
        title={<>Kabar bahagia,<br /><span className="text-[#d98065] italic">dibuka dengan kesan indah.</span></>}
        description="Pilih desain yang terasa seperti Anda, bagikan dengan mudah, dan biarkan tamu mendapat pengalaman yang hangat bahkan sebelum hari acara tiba."
        actions={<><Button asChild size="lg"><Link href="#katalog-undangan">Lihat Koleksi <ArrowRight className="size-4" /></Link></Button><Button asChild size="lg" variant="outline"><Link href="/#undangan">Mulai Pesan</Link></Button></>}
        aside={<div><span className="grid size-12 place-items-center rounded-2xl bg-[#c8dc9d] text-primary"><Smartphone className="size-5" /></span><h2 className="mt-5 font-heading text-3xl font-semibold text-primary">Cantik di layar, praktis saat dibagikan.</h2><p className="mt-3 leading-7 text-muted-foreground">Bandingkan tema, lihat demo aktif, cek harga, lalu kirim data acara melalui form yang terhubung langsung ke sistem pemesanan.</p></div>}
      />

      <section id="katalog-undangan" className="section-shell scroll-mt-28 bg-card">
        <div className="site-container">
          <SectionHeading eyebrow="Koleksi aktif" title={<>Pilih desain yang<br />mewakili cerita Anda.</>} description="Harga, demo, dan batas waktu pemesanan mengikuti katalog aktif yang dikelola langsung oleh tim." />
          {data.templates.length > 0 ? (
            <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
              {data.templates.map((template, index) => {
                const preview = resolvePublicStorageUrl("invitation-template", template.preview_image_url)
                const demoUrl = template.is_demo_ready ? getSecureExternalUrl(template.demo_url) : null
                return (
                  <Card key={template.slug} className="group gap-0 overflow-hidden bg-background p-0 hover:-translate-y-1.5 hover:shadow-[0_22px_44px_rgba(37,68,47,.14)]">
                    <div className="relative m-2 mb-0 aspect-[3/4] overflow-hidden rounded-[1.25rem] bg-secondary/45">
                      {preview ? <Image src={preview} alt={`Pratinjau desain undangan digital ${template.name}`} fill sizes="(max-width: 640px) 100vw, (max-width: 1280px) 50vw, 25vw" priority={index < 2} className="object-cover transition-transform duration-500 group-hover:scale-105" /> : <div className="flex h-full flex-col items-center justify-center gap-3 px-5 text-center text-muted-foreground"><ImageIcon className="size-10" aria-hidden="true" /><span className="text-sm">Pratinjau sedang disiapkan</span></div>}
                      {template.theme ? <Badge className="absolute left-3 top-3 bg-card/90 text-primary backdrop-blur" variant="secondary">{template.theme}</Badge> : null}
                    </div>
                    <CardContent className="flex flex-1 flex-col p-5">
                      <span className="text-[.68rem] font-bold tracking-[.12em] text-[#d98065] uppercase">Desain {String(index + 1).padStart(2, "0")}</span>
                      <h2 className="mt-2 font-heading text-2xl font-semibold leading-none">{template.name}</h2>
                      <div className="mt-4 flex flex-wrap items-baseline gap-2"><span className="text-xs text-muted-foreground line-through">{formatCurrency(template.original_price)}</span><strong className="text-lg text-primary">{formatCurrency(template.promo_price)}</strong></div>
                      <p className="mt-3 text-xs leading-6 text-muted-foreground">Pesan minimal {template.min_order_days} hari sebelum acara agar data dan revisi dapat diproses dengan nyaman.</p>
                    </CardContent>
                    <CardFooter className="grid grid-cols-2 gap-2 p-4 pt-0">
                      {demoUrl ? <Button asChild variant="outline" className="min-w-0 px-2 text-xs"><TrackedExternalLink href={demoUrl} target="_blank" rel="noopener noreferrer" eventName="invitation_demo_click" eventLocation="invitation_catalog">Demo <ExternalLink className="size-3.5" /></TrackedExternalLink></Button> : <Button variant="outline" className="min-w-0 px-2 text-xs" disabled>Segera hadir</Button>}
                      <Button asChild className="min-w-0 px-2 text-xs"><Link href="/#undangan">Pilih Desain</Link></Button>
                    </CardFooter>
                  </Card>
                )
              })}
            </div>
          ) : <EmptyState icon={ImageIcon} title="Koleksi sedang diperbarui" description="Form pemesanan dan konsultasi tetap tersedia. Hubungi tim untuk melihat pilihan desain terbaru." action={<Button asChild><Link href="/kontak">Tanya Koleksi Terbaru</Link></Button>} />}
        </div>
      </section>

      <section className="site-container section-shell">
        <div className="grid gap-6 lg:grid-cols-2">
          <article className="rounded-[2rem] bg-secondary p-7 sm:p-10">
            <span className="section-eyebrow">Yang Anda dapatkan</span>
            <h2 className="display-title mt-4 text-4xl text-primary sm:text-5xl">Praktis untuk Anda, nyaman untuk tamu.</h2>
            <ul className="mt-7 space-y-4 text-muted-foreground">{["Pilihan tema yang dapat dibandingkan sebelum memesan.", "Tautan undangan praktis untuk dibagikan kepada tamu.", "Revisi minor maksimal dua kali sesuai ketentuan FAQ.", "Konfirmasi pesanan langsung dengan admin melalui WhatsApp."].map((feature) => <li key={feature} className="flex gap-3"><span className="grid size-6 shrink-0 place-items-center rounded-full bg-card text-primary"><CheckCircle className="size-3.5" /></span><span>{feature}</span></li>)}</ul>
          </article>
          <article className="rounded-[2rem] bg-primary p-7 text-white sm:p-10">
            <span className="section-eyebrow text-[#c8dc9d]">Proses pemesanan</span>
            <h2 className="display-title mt-4 text-4xl sm:text-5xl">Tiga langkah, lalu kami lanjutkan.</h2>
            <ol className="mt-7 space-y-3">{[{ t: "Pilih template", d: "Bandingkan tema, demo, dan harga yang tersedia." }, { t: "Isi data acara", d: "Masukkan nama mempelai, tanggal, lokasi, dan target selesai." }, { t: "Konfirmasi", d: "Lanjut ke WhatsApp untuk pemeriksaan data dan pembayaran." }].map((step, index) => <li key={step.t} className="flex gap-4 rounded-2xl bg-white/[0.08] p-4"><span className="grid size-9 shrink-0 place-items-center rounded-full bg-[#c8dc9d] font-heading text-lg text-primary">{index + 1}</span><span><strong className="block">{step.t}</strong><span className="mt-1 block text-sm leading-6 text-white/65">{step.d}</span></span></li>)}</ol>
            <Button asChild className={cn("mt-7 border-[#91a96e] bg-gradient-to-b from-[#e0edbf] via-[#c8dc9d] to-[#a8c477] text-primary shadow-[inset_0_1px_0_rgba(255,255,255,.7),inset_0_-2px_0_rgba(49,92,70,.18),0_5px_0_#789652]")}><Link href="/#undangan">Mulai Pesan Sekarang <ArrowRight className="size-4" /></Link></Button>
          </article>
        </div>
      </section>
    </>
  )
}
