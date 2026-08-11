import type { Metadata } from "next"
import Image from "next/image"
import Link from "next/link"
import { ArrowRight, Camera, Video } from "lucide-react"

import { JsonLd } from "@/components/json-ld"
import { EmptyState, PublicPageHero, SectionHeading } from "@/components/public-ui"
import { TrackedExternalLink } from "@/components/tracked-external-link"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { getPublicHomepageData } from "@/lib/data/public"
import { FALLBACK_INSTAGRAM } from "@/lib/public-links"
import { createPublicPageMetadata } from "@/lib/seo"
import { getSiteOrigin } from "@/lib/site-url"
import { resolvePublicStorageUrl } from "@/lib/storage-url"
import { createBasicPageJsonLd } from "@/lib/structured-data"
import { cn } from "@/lib/utils"

export const dynamic = "force-dynamic"

const pageTitle = "Galeri Acara dan Undangan Digital"
const pageDescription = "Lihat galeri kategori wedding, acara formal, private event, dan undangan digital yang ditampilkan Riswandi Wedding."

export const metadata: Metadata = createPublicPageMetadata({ title: pageTitle, description: pageDescription, path: "/galeri" })

function getGalleryPreview(item: { media_type: "image" | "video"; media_url: string; thumbnail_url: string | null }) {
  if (item.thumbnail_url) return resolvePublicStorageUrl("gallery", item.thumbnail_url) || item.thumbnail_url
  if (item.media_type === "image" || /images\.unsplash\.com|\.(avif|gif|jpe?g|png|webp)(?:\?|$)/i.test(item.media_url)) return resolvePublicStorageUrl("gallery", item.media_url) || item.media_url
  return null
}

export default async function GaleriPage() {
  const data = await getPublicHomepageData()
  const instagramUrl = data.settings?.instagram_url || FALLBACK_INSTAGRAM
  const jsonLd = createBasicPageJsonLd({ data, siteOrigin: getSiteOrigin(), type: "CollectionPage", name: "Galeri Riswandi Wedding", description: pageDescription, path: "/galeri" })

  return (
    <>
      <JsonLd data={jsonLd} />
      <PublicPageHero
        eyebrow="Galeri"
        title={<>Momen yang terasa.<br /><span className="text-[#d98065] italic">Cerita yang tersimpan.</span></>}
        description="Setiap senyum, tepuk tangan, dan transisi kecil membentuk pengalaman sebuah acara. Berikut beberapa momen yang pernah kami dampingi."
        actions={<><Button asChild size="lg"><TrackedExternalLink href={instagramUrl} target="_blank" rel="noopener noreferrer" eventName="instagram_click" eventLocation="gallery_hero">Lihat Instagram <ArrowRight className="size-4" /></TrackedExternalLink></Button><Button asChild size="lg" variant="outline"><Link href="/kontak">Diskusikan Acara Anda</Link></Button></>}
      />

      <section className="section-shell bg-primary text-white">
        <div className="site-container">
          <SectionHeading inverse eyebrow="Dokumentasi pilihan" title={<>Lihat suasana,<br />bayangkan acaranya.</>} description="Galeri ini ditarik langsung dari koleksi aktif yang dikelola tim Riswandi Wedding." />
          {data.gallery.length > 0 ? (
            <div className="grid auto-rows-[13rem] grid-cols-2 gap-3 sm:auto-rows-[17rem] lg:grid-cols-4">
              {data.gallery.map((item, index) => {
                const preview = getGalleryPreview(item)
                return (
                  <article key={item.id} className={cn("group relative overflow-hidden rounded-[1.5rem] bg-white/[0.08]", index === 0 && "col-span-2 row-span-2", index === 3 && "col-span-2")}>
                    {preview ? <Image src={preview} alt={`Dokumentasi ${item.category}: ${item.title}`} fill sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw" className="object-cover transition-transform duration-500 group-hover:scale-105" /> : <div className="grid h-full place-items-center text-white/55">{item.media_type === "video" ? <Video className="size-12" /> : <Camera className="size-12" />}</div>}
                    <div className="absolute inset-0 flex items-end bg-gradient-to-t from-black/60 via-transparent to-transparent p-3 sm:p-5">
                      <div className="w-full rounded-2xl bg-[#fffdf7]/90 p-3 text-primary backdrop-blur sm:p-4">
                        <div className="flex items-start justify-between gap-3"><div><h2 className="font-heading text-lg font-semibold sm:text-xl">{item.title}</h2><p className="mt-1 text-xs text-muted-foreground">{item.category}</p></div><Badge variant="secondary">{item.media_type === "video" ? "Video" : "Foto"}</Badge></div>
                      </div>
                    </div>
                  </article>
                )
              })}
            </div>
          ) : (
            <EmptyState icon={Camera} title="Galeri sedang disiapkan" description="Dokumentasi terbaru dapat dilihat melalui Instagram resmi kami." className="border-white/25 bg-white/5 text-white/65 [&_h3]:text-white" action={<Button asChild variant="outline"><TrackedExternalLink href={instagramUrl} target="_blank" rel="noopener noreferrer" eventName="instagram_click" eventLocation="gallery_empty">Buka Instagram</TrackedExternalLink></Button>} />
          )}
          <div className="mt-10 flex flex-col justify-center gap-3 sm:flex-row">
            <Button asChild size="lg" variant="outline"><TrackedExternalLink href={instagramUrl} target="_blank" rel="noopener noreferrer" eventName="instagram_click" eventLocation="gallery_page">Lihat Dokumentasi Lain</TrackedExternalLink></Button>
            <Button asChild size="lg" className="border-[#91a96e] bg-gradient-to-b from-[#e0edbf] via-[#c8dc9d] to-[#a8c477] text-primary shadow-[inset_0_1px_0_rgba(255,255,255,.7),inset_0_-2px_0_rgba(49,92,70,.18),0_5px_0_#789652]"><Link href="/kontak">Rencanakan Acara Anda</Link></Button>
          </div>
        </div>
      </section>
    </>
  )
}
