export const FALLBACK_BRAND_NAME = "Riswandi Wedding"
export const FALLBACK_WHATSAPP = "6287737860657"
export const FALLBACK_INSTAGRAM =
  "https://www.instagram.com/mriswandiwedding__/"

export function normalizeWhatsAppNumber(value: string) {
  return value.replace(/\D/g, "")
}

export function buildWhatsAppUrl(phone: string, text: string) {
  return `https://wa.me/${normalizeWhatsAppNumber(phone)}?text=${encodeURIComponent(text)}`
}

export function getInstagramLabel(instagramUrl: string | null | undefined) {
  if (!instagramUrl) {
    return "@mriswandiwedding__"
  }

  const match = instagramUrl.match(/instagram\.com\/([^/?#]+)/i)
  return match ? `@${match[1]}` : "Instagram Riswandi Wedding"
}

export function getSecureExternalUrl(value: string | null | undefined) {
  if (!value) {
    return null
  }

  try {
    const url = new URL(value)
    return url.protocol === "https:" ? url.href : null
  } catch {
    return null
  }
}
