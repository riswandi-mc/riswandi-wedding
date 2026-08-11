const LOCAL_SITE_URL = "http://localhost:3000"

function isLocalHostname(hostname: string) {
  return hostname === "localhost" || hostname === "127.0.0.1" || hostname === "[::1]"
}

export function getSiteUrl() {
  const configuredUrl = process.env.NEXT_PUBLIC_SITE_URL?.trim() || LOCAL_SITE_URL

  let siteUrl: URL

  try {
    siteUrl = new URL(configuredUrl)
  } catch {
    throw new Error(
      "NEXT_PUBLIC_SITE_URL harus berupa origin URL yang valid, misalnya https://riswandiwedding.com.",
    )
  }

  if (!isLocalHostname(siteUrl.hostname) && siteUrl.protocol !== "https:") {
    throw new Error("NEXT_PUBLIC_SITE_URL non-lokal wajib menggunakan HTTPS.")
  }

  if (
    siteUrl.username ||
    siteUrl.password ||
    siteUrl.pathname !== "/" ||
    siteUrl.search ||
    siteUrl.hash
  ) {
    throw new Error(
      "NEXT_PUBLIC_SITE_URL harus berupa origin tanpa path, query, hash, atau kredensial.",
    )
  }

  if (process.env.VERCEL_ENV === "production" && isLocalHostname(siteUrl.hostname)) {
    throw new Error(
      "NEXT_PUBLIC_SITE_URL production wajib diisi dengan domain final HTTPS.",
    )
  }

  return siteUrl
}

export function getSiteOrigin() {
  return getSiteUrl().origin
}
