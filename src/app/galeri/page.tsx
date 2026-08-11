import type { Metadata } from "next"
import Image from "next/image"
import Link from "next/link"
import { Camera, Video } from "lucide-react"

import { JsonLd } from "@/components/json-ld"
import { PublicPageShell } from "@/components/public-page-shell"
import { TrackedExternalLink } from "@/components/tracked-external-link"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { getPublicHomepageData } from "@/lib/data/public"
import { FALLBACK_INSTAGRAM } from "@/lib/public-links"
import { createPublicPageMetadata } from "@/lib/seo"
import { getSiteOrigin } from "@/lib/site-url"
import { resolvePublicStorageUrl } from "@/lib/storage-url"
import { createBasicPageJsonLd } from "@/lib/structured-data"

const pageTitle = "Galeri Acara dan Undangan Digital"
const pageDescription =
  "Lihat galeri kategori wedding, acara formal, private event, dan undangan digital yang ditampilkan Riswandi Wedding."

export const metadata: Metadata = createPublicPageMetadata({
  title: pageTitle,
  description: pageDescription,
  path: "/galeri",
})

function getGalleryPreview(item: {
  media_type: "image" | "video"
  media_url: string
  thumbnail_url: string | null
}) {
  if (item.thumbnail_url) {
    return resolvePublicStorageUrl("gallery", item.thumbnail_url) || item.thumbnail_url
  }

  if (
    item.media_type === "image" ||
    /images\.unsplash\.com|\.(avif|gif|jpe?g|png|webp)(?:\?|$)/i.test(item.media_url)
  ) {
    return resolvePublicStorageUrl("gallery", item.media_url) || item.media_url
  }

  return null
}

export default async function GaleriPage() {
  const data = await getPublicHomepageData()
  const instagramUrl = data.settings?.instagram_url || FALLBACK_INSTAGRAM
  const jsonLd = createBasicPageJsonLd({
    data,
    siteOrigin: getSiteOrigin(),
    type: "CollectionPage",
    name: "Galeri Riswandi Wedding",
    description: pageDescription,
    path: "/galeri",
  })

  return (
    <>
      <JsonLd data={jsonLd} />
      <PublicPageShell settings={data.settings}>
        <section className="border-b bg-muted/30">
          <div className="container mx-auto px-4 py-14 md:py-20">
            <div className="max-w-3xl space-y-5">
              <Badge variant="outline">Galeri</Badge>
              <h1 className="font-heading text-4xl font-bold text-primary md:text-6xl">
                Galeri Acara dan Undangan Digital
              </h1>
              <p className="text-lg leading-8 text-muted-foreground">
                Jelajahi dokumentasi aktif berdasarkan kategori acara. Setiap
                item menampilkan judul dan konteks kategori yang dikelola dari
                dashboard Riswandi Wedding.
              </p>
            </div>
          </div>
        </section>

        <section className="container mx-auto px-4 py-14 md:py-20">
          {data.gallery.length > 0 ? (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {data.gallery.map((item) => {
                const preview = getGalleryPreview(item)

                return (
                  <article key={item.id} className="overflow-hidden rounded-2xl border bg-card shadow-sm">
                    <div className="relative aspect-[4/3] bg-muted">
                      {preview ? (
                        <Image
                          src={preview}
                          alt={`Dokumentasi ${item.category}: ${item.title}`}
                          fill
                          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                          className="object-cover"
                        />
                      ) : (
                        <div className="flex h-full items-center justify-center text-muted-foreground">
                          {item.media_type === "video" ? (
                            <Video className="h-12 w-12" aria-hidden="true" />
                          ) : (
                            <Camera className="h-12 w-12" aria-hidden="true" />
                          )}
                        </div>
                      )}
                      <Badge className="absolute left-4 top-4" variant="secondary">
                        {item.media_type === "video" ? "Pratinjau video" : "Foto"}
                      </Badge>
                    </div>
                    <div className="space-y-2 p-5">
                      <h2 className="font-heading text-xl font-semibold">{item.title}</h2>
                      <p className="text-sm leading-6 text-muted-foreground">
                        Dokumentasi kategori {item.category} yang ditampilkan
                        dalam koleksi Riswandi Wedding.
                      </p>
                    </div>
                  </article>
                )
              })}
            </div>
          ) : (
            <div className="rounded-xl border border-dashed p-12 text-center text-muted-foreground">
              Dokumentasi belum tersedia saat ini. Silakan lihat pembaruan
              terbaru melalui Instagram resmi.
            </div>
          )}

          <div className="mt-12 flex flex-col justify-center gap-3 sm:flex-row">
            <Button asChild size="lg">
              <TrackedExternalLink
                href={instagramUrl}
                target="_blank"
                rel="noopener noreferrer"
                eventName="instagram_click"
                eventLocation="gallery_page"
              >
                Lihat Dokumentasi di Instagram
              </TrackedExternalLink>
            </Button>
            <Button asChild size="lg" variant="outline">
              <Link href="/kontak">Diskusikan Acara Anda</Link>
            </Button>
          </div>
        </section>
      </PublicPageShell>
    </>
  )
}
