import type { Metadata } from "next"

export const SITE_NAME = "Riswandi Wedding"
export const SITE_TITLE =
  "Riswandi Wedding | MC & Undangan Digital Profesional"
export const SITE_DESCRIPTION =
  "Riswandi Wedding menyediakan jasa MC wedding profesional di Jabodetabek dan undangan digital elegan agar acara berjalan hangat, rapi, dan berkesan."
export const SOCIAL_IMAGE_PATH = "/opengraph-image"

type PublicPageMetadataInput = {
  title: string
  description: string
  path: `/${string}` | "/"
  absoluteTitle?: boolean
}

export function createPublicPageMetadata({
  title,
  description,
  path,
  absoluteTitle = false,
}: PublicPageMetadataInput): Metadata {
  return {
    title: absoluteTitle ? { absolute: title } : title,
    description,
    alternates: {
      canonical: path,
    },
    robots: {
      index: true,
      follow: true,
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
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [SOCIAL_IMAGE_PATH],
    },
  }
}
