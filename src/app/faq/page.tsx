import type { Metadata } from "next"
import Link from "next/link"

import { JsonLd } from "@/components/json-ld"
import { PublicPageShell } from "@/components/public-page-shell"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { getPublicHomepageData } from "@/lib/data/public"
import { createPublicPageMetadata } from "@/lib/seo"
import { getSiteOrigin } from "@/lib/site-url"
import { createFaqPageJsonLd } from "@/lib/structured-data"

const pageTitle = "FAQ Layanan MC dan Undangan Digital"
const pageDescription =
  "Temukan jawaban tentang script MC, area layanan, pembayaran, revisi, dan waktu pengerjaan undangan digital Riswandi Wedding."

export const metadata: Metadata = createPublicPageMetadata({
  title: pageTitle,
  description: pageDescription,
  path: "/faq",
})

export default async function FaqPage() {
  const data = await getPublicHomepageData()
  const jsonLd = createFaqPageJsonLd(data, getSiteOrigin())

  return (
    <>
      <JsonLd data={jsonLd} />
      <PublicPageShell settings={data.settings}>
        <section className="border-b bg-muted/30">
          <div className="container mx-auto px-4 py-14 md:py-20">
            <div className="max-w-3xl space-y-5">
              <Badge variant="outline">FAQ</Badge>
              <h1 className="font-heading text-4xl font-bold text-primary md:text-6xl">
                Pertanyaan tentang MC dan Undangan Digital
              </h1>
              <p className="text-lg leading-8 text-muted-foreground">
                Jawaban berikut berasal dari FAQ aktif yang juga ditampilkan di
                beranda, sehingga informasi tetap konsisten saat dikelola admin.
              </p>
            </div>
          </div>
        </section>

        <section className="container mx-auto max-w-4xl px-4 py-14 md:py-20">
          {data.faqs.length > 0 ? (
            <div className="space-y-4">
              {data.faqs.map((faq) => (
                <details key={faq.id} className="group rounded-xl border bg-card p-5 open:shadow-sm">
                  <summary className="cursor-pointer list-none font-heading text-lg font-semibold text-foreground marker:hidden">
                    <span className="flex items-center justify-between gap-4">
                      {faq.question}
                      <span aria-hidden="true" className="text-primary transition-transform group-open:rotate-45">+</span>
                    </span>
                  </summary>
                  <p className="mt-4 border-t pt-4 leading-7 text-muted-foreground">{faq.answer}</p>
                </details>
              ))}
            </div>
          ) : (
            <div className="rounded-xl border border-dashed p-10 text-center text-muted-foreground">
              FAQ dinamis sedang tidak tersedia. Hubungi tim untuk memperoleh jawaban langsung.
            </div>
          )}

          <div className="mt-12 flex flex-col justify-center gap-3 sm:flex-row">
            <Button asChild><Link href="/kontak">Tanyakan Kebutuhan Anda</Link></Button>
            <Button asChild variant="outline"><Link href="/layanan-mc">Lihat Paket MC</Link></Button>
            <Button asChild variant="outline"><Link href="/undangan-digital">Lihat Undangan Digital</Link></Button>
          </div>
        </section>
      </PublicPageShell>
    </>
  )
}
