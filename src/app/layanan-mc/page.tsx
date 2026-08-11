import type { Metadata } from "next"
import Link from "next/link"
import { ArrowRight, CheckCircle, MessageCircle, Sparkles } from "lucide-react"

import { JsonLd } from "@/components/json-ld"
import { PublicPageShell } from "@/components/public-page-shell"
import { EmptyState, PublicPageHero, SectionHeading } from "@/components/public-ui"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { getPublicHomepageData } from "@/lib/data/public"
import { createPublicPageMetadata } from "@/lib/seo"
import { getSiteOrigin } from "@/lib/site-url"
import { createServicePageJsonLd } from "@/lib/structured-data"
import { cn } from "@/lib/utils"

const pageTitle = "Paket Jasa MC Wedding Jabodetabek"
const pageDescription = "Temukan paket jasa MC wedding profesional dari Riswandi Wedding untuk acara yang hangat, terarah, dan berkesan di Jabodetabek maupun luar kota."

const mcFaqs = [
  { question: "Apakah script bisa disesuaikan?", answer: "Bisa. Gaya bahasa, rundown, dan interaksi dibahas berdasarkan tema acara serta profil tamu." },
  { question: "Apakah melayani luar kota?", answer: "Bisa, dengan pembahasan jadwal serta biaya transportasi dan akomodasi terlebih dahulu." },
  { question: "Kapan sebaiknya booking?", answer: "Hubungi tim sedini mungkin agar jadwal tersedia dan persiapan rundown dapat dilakukan lebih matang." },
]

export const metadata: Metadata = createPublicPageMetadata({ title: pageTitle, description: pageDescription, path: "/layanan-mc" })

function getServiceBadgeClass(variant: string | null, featured: boolean) {
  if (featured) return "border-white/25 bg-white/[0.08] text-[#c8dc9d]"
  if (variant === "best_value") return "border-[#e4bd70] bg-[#f7e7bd] text-[#715720]"
  if (variant === "exclusive") return "border-[#d6a28f] bg-[#f9e6df] text-[#8f4c38]"
  return "border-[#b9c9b4] bg-secondary text-primary"
}

export default async function LayananMcPage() {
  const data = await getPublicHomepageData()
  const services = data.services
  const jsonLd = createServicePageJsonLd({ data, siteOrigin: getSiteOrigin(), name: "Jasa MC Wedding Profesional", description: pageDescription, path: "/layanan-mc", breadcrumbs: [{ name: "Beranda", path: "/" }, { name: "Layanan MC", path: "/layanan-mc" }], offers: services.map((service) => ({ name: service.title })), faqItems: mcFaqs })

  return (
    <>
      <JsonLd data={jsonLd} />
      <PublicPageShell settings={data.settings}>
        <PublicPageHero
          eyebrow="Layanan MC"
          title={<>Acara terarah.<br /><span className="text-[#d98065] italic">Suasana tetap hidup.</span></>}
          description="MC bukan hanya membacakan susunan acara. Ia membaca ruangan, menjaga energi, dan memastikan setiap momen penting mendapat tempatnya."
          actions={<><Button asChild size="lg"><Link href="#paket-mc">Bandingkan Paket <ArrowRight className="size-4" /></Link></Button><Button asChild size="lg" variant="outline"><Link href="/kontak">Cek Jadwal Acara</Link></Button></>}
          aside={<div><span className="grid size-12 place-items-center rounded-2xl bg-[#c8dc9d] text-primary"><Sparkles className="size-5" /></span><h2 className="mt-5 font-heading text-3xl font-semibold text-primary">Hangat, adaptif, dan tetap profesional.</h2><p className="mt-3 leading-7 text-muted-foreground">Gaya pembawaan disesuaikan dengan konsep, keluarga, profil tamu, dan ritme acara—dari pernikahan intim hingga gathering berskala besar.</p></div>}
        />

        <section id="paket-mc" className="site-container section-shell scroll-mt-28">
          <SectionHeading eyebrow="Pilih format" title={<>Paket yang mengikuti<br />karakter acara Anda.</>} description="Bandingkan cakupan tiap paket, lalu lanjutkan ke beranda untuk mengirim detail booking yang tersimpan langsung ke sistem kami." />
          {services.length > 0 ? (
            <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
              {services.map((service, index) => (
                <Card key={service.slug} className={cn("flex flex-col p-1 hover:-translate-y-1.5 hover:shadow-[0_24px_50px_rgba(37,68,47,.14)]", service.is_featured ? "border-primary bg-primary text-white xl:rotate-1 xl:hover:rotate-0" : "bg-card")}>
                  <CardHeader>
                    <div className="flex items-center justify-between gap-3"><span className={cn("grid size-13 place-items-center rounded-2xl bg-secondary font-heading text-xl text-primary", service.is_featured && "bg-[#c8dc9d]")}>{String(index + 1).padStart(2, "0")}</span>{service.badge_label ? <Badge variant="outline" className={getServiceBadgeClass(service.badge_variant, service.is_featured)}>{service.badge_label}</Badge> : null}</div>
                    <CardTitle className="mt-5 font-heading text-3xl leading-none">{service.title}</CardTitle>
                    <CardDescription className={cn("leading-6", service.is_featured && "text-white/70")}>{service.short_description}</CardDescription>
                  </CardHeader>
                  <CardContent className="flex-1"><ul className={cn("space-y-3 border-t border-border pt-5 text-sm text-muted-foreground", service.is_featured && "border-white/15 text-white/75")}>{service.features.map((feature) => <li key={feature} className="flex items-start gap-2.5"><CheckCircle className={cn("mt-0.5 size-4 shrink-0 text-primary", service.is_featured && "text-[#c8dc9d]")} /><span>{feature}</span></li>)}</ul></CardContent>
                  <CardFooter><Button className={cn("w-full", service.is_featured && "border-[#91a96e] bg-gradient-to-b from-[#e0edbf] via-[#c8dc9d] to-[#a8c477] text-primary shadow-[inset_0_1px_0_rgba(255,255,255,.7),inset_0_-2px_0_rgba(49,92,70,.18),0_5px_0_#789652]")} asChild><Link href="/#layanan">Pilih {service.title}</Link></Button></CardFooter>
                </Card>
              ))}
            </div>
          ) : <EmptyState icon={MessageCircle} title="Paket sedang diperbarui" description="Form booking dan konsultasi tetap tersedia. Hubungi kami agar tim dapat merekomendasikan format yang sesuai." action={<Button asChild><Link href="/kontak">Konsultasi Paket</Link></Button>} />}
        </section>

        <section className="section-shell bg-[#f1c875]" aria-labelledby="proses-booking-mc">
          <div className="site-container">
            <SectionHeading eyebrow="Cara kerja" title={<>Dari cerita Anda,<br />menjadi alur yang matang.</>} description="Persiapan dibuat jelas sejak awal agar koordinasi pada hari acara terasa lebih ringan." />
            <div className="grid gap-4 md:grid-cols-3">
              {[{ title: "Ceritakan acaranya", text: "Sampaikan tanggal, lokasi, konsep, jumlah tamu, dan suasana yang ingin dibangun." }, { title: "Susun kebutuhan", text: "Pilih format MC lalu bahas rundown, gaya komunikasi, serta detail interaksi penting." }, { title: "Konfirmasi & persiapan", text: "Setelah jadwal dan DP terkonfirmasi, persiapan dilanjutkan hingga siap untuk hari H." }].map((step, index) => <article key={step.title} className={cn("rounded-[1.75rem] p-7", index === 0 ? "bg-[#fff9e7]" : index === 1 ? "bg-[#d98065] text-white md:translate-y-4" : "bg-primary text-white")}><span className={cn("grid size-12 place-items-center rounded-full font-heading text-xl", index === 0 ? "border border-[#d8ac56] bg-[#f1c875]" : index === 1 ? "bg-[#fff2e7] text-[#d98065]" : "bg-[#c8dc9d] text-primary")}>0{index + 1}</span><h3 className="mt-6 font-heading text-3xl font-semibold">{step.title}</h3><p className={cn("mt-3 text-sm leading-7", index === 0 ? "text-[#65572f]" : "text-white/70")}>{step.text}</p></article>)}
            </div>
          </div>
        </section>

        <section className="site-container section-shell" aria-labelledby="faq-layanan-mc">
          <div className="mx-auto max-w-5xl">
            <SectionHeading eyebrow="Sebelum booking" title="Pertanyaan tentang layanan MC." description="Tiga jawaban singkat sebelum Anda mengirim detail acara." />
            <div className="grid gap-4 md:grid-cols-3">{mcFaqs.map((faq, index) => <article key={faq.question} className="rounded-[1.5rem] border border-border bg-card p-6"><span className="text-xs font-bold tracking-[.12em] text-[#d98065]">0{index + 1}</span><h3 className="mt-3 font-heading text-2xl font-semibold">{faq.question}</h3><p className="mt-3 text-sm leading-7 text-muted-foreground">{faq.answer}</p></article>)}</div>
            <div className="mt-10 flex flex-col justify-center gap-3 sm:flex-row"><Button asChild size="lg"><Link href="/#layanan">Pilih Paket & Booking</Link></Button><Button asChild size="lg" variant="outline"><Link href="/kontak">Tanya Kebutuhan Anda</Link></Button></div>
          </div>
        </section>
      </PublicPageShell>
    </>
  )
}
