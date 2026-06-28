const SUPABASE_PUBLIC_URL = process.env.NEXT_PUBLIC_SUPABASE_URL?.replace(/\/$/, "") ?? null

export function resolvePublicStorageUrl(
  bucket: string,
  value?: string | null
): string | null {
  const rawValue = value?.trim()

  if (!rawValue) {
    return null
  }

  if (!SUPABASE_PUBLIC_URL) {
    return /^https?:\/\//i.test(rawValue) ? rawValue : rawValue.startsWith("/") ? rawValue : null
  }

  const storagePath = rawValue.replace(/^\/+/, "")

  if (storagePath.startsWith("storage/v1/object/public/")) {
    return `${SUPABASE_PUBLIC_URL}/${storagePath}`
  }

  if (/^https?:\/\//i.test(rawValue) || rawValue.startsWith("/")) {
    return rawValue
  }

  return `${SUPABASE_PUBLIC_URL}/storage/v1/object/public/${bucket}/${storagePath}`
}
