import { type NextRequest, NextResponse } from "next/server"

import { getSiteUrl } from "@/lib/site-url"
import { updateSession } from "@/lib/supabase/middleware"

export async function proxy(request: NextRequest) {
  const siteUrl = getSiteUrl()
  const isProductionDeployment = process.env.VERCEL_ENV
    ? process.env.VERCEL_ENV === "production"
    : process.env.NODE_ENV === "production"

  if (isProductionDeployment && siteUrl.protocol === "https:") {
    const forwardedProtocol = request.headers
      .get("x-forwarded-proto")
      ?.split(",")[0]
      .trim()
    const forwardedHost = request.headers
      .get("x-forwarded-host")
      ?.split(",")[0]
      .trim()
    const requestProtocol = forwardedProtocol
      ? `${forwardedProtocol}:`
      : request.nextUrl.protocol
    const requestHost = forwardedHost || request.headers.get("host") || request.nextUrl.host

    if (requestProtocol !== siteUrl.protocol || requestHost !== siteUrl.host) {
      const canonicalUrl = new URL(request.nextUrl.pathname + request.nextUrl.search, siteUrl)

      return NextResponse.redirect(canonicalUrl, 308)
    }
  }

  if (
    request.nextUrl.pathname === "/robots.txt" ||
    request.nextUrl.pathname === "/sitemap.xml"
  ) {
    return NextResponse.next()
  }

  return updateSession(request)
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
}
