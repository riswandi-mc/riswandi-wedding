import type { Metadata } from "next"

export const SITE_NAME = "Riswandi Wedding"
export const SITE_TITLE =
  "Riswandi Wedding - MC Profesional & Undangan Digital"
export const SITE_DESCRIPTION =
  "Riswandi Wedding menyediakan layanan pembuatan undangan pernikahan online yang modern dan hemat waktu, serta jasa MC profesional untuk momen tak terlupakan."
export const SOCIAL_IMAGE_PATH = "/opengraph-image"

export const DEFAULT_KEYWORDS = [
  "MC wedding",
  "MC pernikahan",
  "MC wedding Jakarta",
  "MC wedding Jabodetabek",
  "MC profesional",
  "jasa MC acara",
  "undangan digital",
  "undangan digital pernikahan",
  "undangan digital elegan",
  "Riswandi Wedding",
  "wedding organizer Jakarta",
  "MC resepsi pernikahan",
]

type PublicPageMetadataInput = {
  title: string
  description: string
  path: `/${string}` | "/"
  absoluteTitle?: boolean
  keywords?: string[]
}

export function createPublicPageMetadata({
  title,
  description,
  path,
  absoluteTitle = false,
  keywords,
}: PublicPageMetadataInput): Metadata {
  const mergedKeywords = keywords
    ? [...new Set([...keywords, ...DEFAULT_KEYWORDS])]
    : DEFAULT_KEYWORDS

  return {
    title: absoluteTitle ? { absolute: title } : title,
    description,
    keywords: mergedKeywords,
    alternates: {
      canonical: path,
      languages: {
        "id-ID": path,
      },
    },
    robots: {
      index: true,
      follow: true,
      "max-image-preview": "large" as const,
      "max-snippet": -1,
      "max-video-preview": -1,
    },
    openGraph: {
      type: "website",
      locale: "id_ID",
      siteName: SITE_NAME,
      title,
      description,
      url: path,
      images: [
        {
          url: SOCIAL_IMAGE_PATH,
          width: 1200,
          height: 630,
          alt: `${SITE_NAME} - jasa MC dan undangan digital`,
          type: "image/png",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [SOCIAL_IMAGE_PATH],
      creator: "@riswandiwedding",
    },
  }
}
