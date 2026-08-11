import Link from "next/link"

import { GoogleAnalytics } from "@/components/google-analytics"
import { TrackedExternalLink } from "@/components/tracked-external-link"
import type { PublicHomepageData } from "@/lib/data/public"
import {
  buildWhatsAppUrl,
  FALLBACK_BRAND_NAME,
  FALLBACK_INSTAGRAM,
  FALLBACK_WHATSAPP,
  getInstagramLabel,
} from "@/lib/public-links"

type PublicPageShellProps = {
  settings: PublicHomepageData["settings"]
  children: React.ReactNode
}

const navigation = [
  { href: "/layanan-mc", label: "Layanan MC" },
  { href: "/undangan-digital", label: "Undangan Digital" },
  { href: "/galeri", label: "Galeri" },
  { href: "/tentang-kami", label: "Tentang Kami" },
  { href: "/faq", label: "FAQ" },
  { href: "/kontak", label: "Kontak" },
]

export function PublicPageShell({ settings, children }: PublicPageShellProps) {
  const brandName = settings?.brand_name || FALLBACK_BRAND_NAME
  const whatsapp = settings?.phone_whatsapp || FALLBACK_WHATSAPP
  const instagram = settings?.instagram_url || FALLBACK_INSTAGRAM
  const whatsappUrl = buildWhatsAppUrl(
    whatsapp,
    "Halo Kak Riswandi! Saya ingin bertanya tentang layanan Riswandi Wedding.",
  )

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <GoogleAnalytics />
      <header className="sticky top-0 z-40 border-b bg-background/95 backdrop-blur">
        <div className="container mx-auto flex min-h-16 flex-wrap items-center justify-between gap-3 px-4 py-3">
          <Link
            href="/"
            className="font-heading text-xl font-bold tracking-tight"
            aria-label={`${brandName} - beranda`}
          >
            {brandName}
          </Link>
          <nav
            aria-label="Navigasi utama"
            className="flex flex-wrap items-center justify-end gap-x-4 gap-y-2 text-sm font-medium"
          >
            {navigation.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="transition-colors hover:text-primary"
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </div>
      </header>

      <main className="flex-1">{children}</main>

      <footer className="bg-[#1a1a1a] py-12 text-white">
        <div className="container mx-auto grid gap-8 px-4 md:grid-cols-3">
          <div className="space-y-3">
            <p className="font-heading text-2xl font-bold">{brandName}</p>
            <p className="max-w-sm text-sm leading-6 text-white/65">
              Jasa MC profesional dan undangan digital untuk acara di
              Jabodetabek serta kebutuhan luar kota sesuai kesepakatan.
            </p>
          </div>
          <nav aria-label="Tautan footer" className="grid gap-2 text-sm text-white/70">
            {navigation.map((item) => (
              <Link key={item.href} href={item.href} className="w-fit hover:text-white">
                {item.label}
              </Link>
            ))}
          </nav>
          <div className="grid content-start gap-3 text-sm text-white/70">
            <TrackedExternalLink
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              eventName="whatsapp_click"
              eventLocation="public_page_footer"
              className="w-fit hover:text-white"
            >
              WhatsApp +{whatsapp}
            </TrackedExternalLink>
            {settings?.email ? (
              <TrackedExternalLink
                href={`mailto:${settings.email}`}
                eventName="email_click"
                eventLocation="public_page_footer"
                className="w-fit hover:text-white"
              >
                {settings.email}
              </TrackedExternalLink>
            ) : null}
            <TrackedExternalLink
              href={instagram}
              target="_blank"
              rel="noopener noreferrer"
              eventName="instagram_click"
              eventLocation="public_page_footer"
              className="w-fit hover:text-white"
            >
              {getInstagramLabel(instagram)}
            </TrackedExternalLink>
          </div>
        </div>
        <p className="container mx-auto mt-10 border-t border-white/10 px-4 pt-6 text-sm text-white/45">
          © {new Date().getFullYear()} {brandName}. Seluruh hak dilindungi.
        </p>
      </footer>
    </div>
  )
}
