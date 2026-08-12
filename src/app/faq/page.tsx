import type { Metadata } from "next"
import Link from "next/link"
import { ArrowRight, HelpCircle } from "lucide-react"

import { JsonLd } from "@/components/json-ld"
import { EmptyState, PublicPageHero } from "@/components/public-ui"
import { Button } from "@/components/ui/button"
import { getPublicHomepageData } from "@/lib/data/public"
import { createPublicPageMetadata } from "@/lib/seo"
import { getSiteOrigin } from "@/lib/site-url"
import { createFaqPageJsonLd } from "@/lib/structured-data"

export const dynamic = "force-dynamic"

const pageTitle = "FAQ Layanan MC dan Undangan Digital"
const pageDescription =
  "Temukan jawaban tentang script MC, area layanan, pembayaran, revisi, dan waktu pengerjaan undangan digital Riswandi Wedding."

export const metadata: Metadata = createPublicPageMetadata({
  title: pageTitle,
  description: pageDescription,
  path: "/faq",
  keywords: [
    "FAQ MC wedding",
    "pertanyaan MC pernikahan",
    "harga undangan digital",
    "cara booking MC",
    "revisi undangan digital",
    "area layanan MC wedding",
  ],
})

export default async function FaqPage() {
  const data = await getPublicHomepageData()
  const jsonLd = createFaqPageJsonLd(data, getSiteOrigin())

  return (
    <>
      <JsonLd data={jsonLd} />
      <PublicPageHero
        eyebrow="Tanya jawab"
        title={<>Semua yang perlu Anda tahu, <span className="text-[#d98065] italic">sebelum hari H.</span></>}
        description="Dari penyesuaian script hingga alur pembayaran, kami merangkum hal-hal yang paling sering ditanyakan agar Anda dapat mengambil keputusan dengan lebih tenang."
        actions={<Button asChild size="lg"><Link href="/kontak">Tanyakan Langsung <ArrowRight className="size-4" /></Link></Button>}
      />

      <section className="site-container section-shell">
        <div className="grid gap-9 lg:grid-cols-[.55fr_1fr] lg:gap-16">
          <div className="lg:sticky lg:top-36 lg:self-start">
            <span className="section-eyebrow">Informasi penting</span>
            <h2 className="display-title mt-4 text-4xl text-primary sm:text-5xl">Jawaban ringkas untuk langkah yang lebih pasti.</h2>
            <p className="mt-5 leading-7 text-muted-foreground">Temukan jawaban cepat untuk pertanyaan umum seputar layanan MC dan undangan digital kami.</p>
          </div>
          {data.faqs.length > 0 ? (
            <div className="space-y-3">
              {data.faqs.map((faq, index) => (
                <details key={faq.id} className="group rounded-[1.35rem] border border-border bg-card px-5 shadow-[0_10px_28px_rgba(37,68,47,.06)] open:border-[#aebdaa] open:shadow-[0_16px_36px_rgba(37,68,47,.1)] sm:px-6" open={index === 0}>
                  <summary className="cursor-pointer list-none py-5 font-heading text-xl font-semibold text-foreground marker:hidden">
                    <span className="flex items-center justify-between gap-4">
                      <span><span className="mr-2 text-sm font-sans text-[#d98065]">{String(index + 1).padStart(2, "0")}</span>{faq.question}</span>
                      <span aria-hidden="true" className="grid size-8 shrink-0 place-items-center rounded-full bg-secondary font-sans text-primary transition-transform group-open:rotate-45">+</span>
                    </span>
                  </summary>
                  <p className="border-t border-border/70 pb-6 pt-4 leading-7 text-muted-foreground">{faq.answer}</p>
                </details>
              ))}
            </div>
          ) : (
            <EmptyState icon={HelpCircle} title="FAQ sedang diperbarui" description="Silakan hubungi tim kami untuk mendapatkan jawaban langsung mengenai layanan dan pemesanan." />
          )}
        </div>

        <div className="mt-12 rounded-[2rem] bg-secondary p-7 sm:flex sm:items-center sm:justify-between sm:gap-8 sm:p-10">
          <div>
            <h2 className="font-heading text-3xl font-semibold text-primary">Belum menemukan jawaban yang Anda cari?</h2>
            <p className="mt-2 text-muted-foreground">Ceritakan kebutuhan Anda. Kami bantu jelaskan pilihan yang paling relevan, tanpa tekanan untuk langsung memesan.</p>
          </div>
          <div className="mt-6 flex flex-col gap-3 sm:mt-0 sm:shrink-0">
            <Button asChild><Link href="/kontak">Konsultasi Sekarang</Link></Button>
            <Button asChild variant="outline"><Link href="/layanan-mc">Lihat Paket MC</Link></Button>
          </div>
        </div>
      </section>
    </>
  )
}
