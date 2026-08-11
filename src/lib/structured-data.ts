import type { PublicHomepageData } from "@/lib/data/public"
import { getSecureExternalUrl, normalizeWhatsAppNumber } from "@/lib/public-links"
import { SITE_DESCRIPTION, SITE_NAME, SOCIAL_IMAGE_PATH } from "@/lib/seo"

type BreadcrumbItem = {
  name: string
  path: `/${string}` | "/"
}

function createBusinessEntity(data: PublicHomepageData, siteOrigin: string) {
  const settings = data.settings
  const phone = settings?.phone_whatsapp
    ? normalizeWhatsAppNumber(settings.phone_whatsapp)
    : null
  const instagramUrl = getSecureExternalUrl(settings?.instagram_url)

  return {
    "@type": "ProfessionalService",
    "@id": `${siteOrigin}/#business`,
    name: settings?.brand_name || SITE_NAME,
    url: siteOrigin,
    logo: `${siteOrigin}/logo-no-bg.png`,
    image: `${siteOrigin}${SOCIAL_IMAGE_PATH}`,
    description: SITE_DESCRIPTION,
    areaServed: ["Jakarta", "Bogor", "Depok", "Tangerang", "Bekasi"],
    ...(phone ? { telephone: `+${phone}` } : {}),
    ...(settings?.email ? { email: settings.email } : {}),
    ...(instagramUrl ? { sameAs: [instagramUrl] } : {}),
    ...(settings?.address
      ? {
          address: {
            "@type": "PostalAddress",
            streetAddress: settings.address,
            addressCountry: "ID",
          },
        }
      : {}),
  }
}

function createFaqEntityFromItems(
  items: Array<{ question: string; answer: string }>,
) {
  if (items.length === 0) {
    return null
  }

  return {
    "@type": "FAQPage",
    "@id": "#faq",
    mainEntity: items.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  }
}

function createFaqEntity(data: PublicHomepageData) {
  return createFaqEntityFromItems(data.faqs)
}

export function createBreadcrumbEntity(
  siteOrigin: string,
  items: BreadcrumbItem[],
) {
  return {
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: new URL(item.path, siteOrigin).href,
    })),
  }
}

export function createHomeJsonLd(
  data: PublicHomepageData,
  siteOrigin: string,
) {
  const faq = createFaqEntity(data)

  return {
    "@context": "https://schema.org",
    "@graph": [
      createBusinessEntity(data, siteOrigin),
      {
        "@type": "WebSite",
        "@id": `${siteOrigin}/#website`,
        url: siteOrigin,
        name: data.settings?.brand_name || SITE_NAME,
        description: SITE_DESCRIPTION,
        inLanguage: "id-ID",
        publisher: {
          "@id": `${siteOrigin}/#business`,
        },
      },
      ...(faq ? [faq] : []),
    ],
  }
}

export function createFaqPageJsonLd(
  data: PublicHomepageData,
  siteOrigin: string,
) {
  const faq = createFaqEntity(data)

  return {
    "@context": "https://schema.org",
    "@graph": [
      ...(faq ? [faq] : []),
      createBreadcrumbEntity(siteOrigin, [
        { name: "Beranda", path: "/" },
        { name: "FAQ", path: "/faq" },
      ]),
    ],
  }
}

export function createServicePageJsonLd({
  data,
  siteOrigin,
  name,
  description,
  path,
  breadcrumbs,
  offers,
  faqItems = [],
}: {
  data: PublicHomepageData
  siteOrigin: string
  name: string
  description: string
  path: `/${string}`
  breadcrumbs: BreadcrumbItem[]
  offers?: Array<{ name: string; price?: number }>
  faqItems?: Array<{ question: string; answer: string }>
}) {
  const faq = createFaqEntityFromItems(faqItems)

  return {
    "@context": "https://schema.org",
    "@graph": [
      createBusinessEntity(data, siteOrigin),
      {
        "@type": "Service",
        "@id": `${siteOrigin}${path}#service`,
        name,
        description,
        url: `${siteOrigin}${path}`,
        areaServed: ["Jakarta", "Bogor", "Depok", "Tangerang", "Bekasi"],
        provider: {
          "@id": `${siteOrigin}/#business`,
        },
        ...(offers && offers.length > 0
          ? {
              hasOfferCatalog: {
                "@type": "OfferCatalog",
                name: `Pilihan ${name}`,
                itemListElement: offers.map((offer) => ({
                  "@type": "Offer",
                  itemOffered: {
                    "@type": "Service",
                    name: offer.name,
                  },
                  ...(offer.price !== undefined
                    ? {
                        price: offer.price,
                        priceCurrency: "IDR",
                      }
                    : {}),
                })),
              },
            }
          : {}),
      },
      createBreadcrumbEntity(siteOrigin, breadcrumbs),
      ...(faq ? [faq] : []),
    ],
  }
}

export function createBasicPageJsonLd({
  data,
  siteOrigin,
  type,
  name,
  description,
  path,
}: {
  data: PublicHomepageData
  siteOrigin: string
  type: "AboutPage" | "ContactPage" | "CollectionPage"
  name: string
  description: string
  path: `/${string}`
}) {
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": type,
        "@id": `${siteOrigin}${path}#webpage`,
        url: `${siteOrigin}${path}`,
        name,
        description,
        inLanguage: "id-ID",
        about: {
          "@id": `${siteOrigin}/#business`,
        },
      },
      createBusinessEntity(data, siteOrigin),
      createBreadcrumbEntity(siteOrigin, [
        { name: "Beranda", path: "/" },
        { name, path },
      ]),
    ],
  }
}
