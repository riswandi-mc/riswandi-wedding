import Image from "next/image"
import Link from "next/link"
import { ArrowUpRight, Menu, MessageCircle } from "lucide-react"

import { GoogleAnalytics } from "@/components/google-analytics"
import { TrackedExternalLink } from "@/components/tracked-external-link"
import { Button } from "@/components/ui/button"
import type { PublicHomepageData } from "@/lib/data/public"
import {
  buildWhatsAppUrl,
  FALLBACK_BRAND_NAME,
  FALLBACK_INSTAGRAM,
  FALLBACK_WHATSAPP,
  getInstagramLabel,
} from "@/lib/public-links"

type Settings = PublicHomepageData["settings"]

type PublicPageShellProps = {
  settings: Settings
  children: React.ReactNode
}

const navigation = [
  { href: "/tentang-kami", label: "Tentang" },
  { href: "/layanan-mc", label: "Layanan MC" },
  { href: "/undangan-digital", label: "Undangan" },
  { href: "/galeri", label: "Galeri" },
  { href: "/faq", label: "FAQ" },
]

function getContactDetails(settings: Settings) {
  const brandName = settings?.brand_name || FALLBACK_BRAND_NAME
  const whatsapp = settings?.phone_whatsapp || FALLBACK_WHATSAPP
  const instagram = settings?.instagram_url || FALLBACK_INSTAGRAM
  const whatsappUrl = buildWhatsAppUrl(
    whatsapp,
    "Halo Kak Riswandi! Saya ingin konsultasi gratis untuk acara saya. Boleh dibantu cek layanan dan jadwalnya?",
  )

  return { brandName, whatsapp, instagram, whatsappUrl }
}

export function PublicHeader({ settings }: { settings: Settings }) {
  const { brandName, whatsappUrl } = getContactDetails(settings)

  return (
    <>
      <div className="bg-[#173e31] text-[#fffdf7]">
        <div className="site-container flex min-h-9 items-center justify-center text-center text-[0.65rem] font-bold tracking-[0.12em] uppercase sm:justify-between">
          <span>MC profesional · undangan digital</span>
          <span className="hidden text-[#c8dc9d] sm:inline">Jabodetabek & luar kota sesuai kesepakatan</span>
        </div>
      </div>
      <header className="sticky top-0 z-40 bg-transparent py-2.5 sm:py-3">
        <div className="site-container relative flex min-h-16 items-center justify-between rounded-full border border-border bg-card/90 py-2 pl-3 pr-2 shadow-[0_8px_28px_rgba(37,68,47,.09)] backdrop-blur-xl">
          <Link href="/" className="flex min-w-0 items-center gap-2.5" aria-label={`${brandName} - beranda`}>
            <span className="grid size-11 shrink-0 place-items-center rounded-full bg-secondary/70">
              <Image src="/logo-no-bg.png" alt="" width={40} height={40} className="size-10 object-contain" priority />
            </span>
            <span className="truncate font-heading text-lg font-semibold tracking-tight sm:text-xl">{brandName}</span>
          </Link>

          <nav aria-label="Navigasi utama" className="hidden items-center gap-5 text-xs font-bold lg:flex xl:gap-7">
            {navigation.map((item) => (
              <Link key={item.href} href={item.href} className="rounded-full px-1 py-2 transition-colors hover:text-[#d98065] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
                {item.label}
              </Link>
            ))}
            <Button asChild size="sm">
              <TrackedExternalLink
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                eventName="whatsapp_click"
                eventLocation="public_header"
              >
                Cek Jadwal <ArrowUpRight className="size-3.5" aria-hidden="true" />
              </TrackedExternalLink>
            </Button>
          </nav>

          <details className="group lg:hidden">
            <summary className="grid size-11 cursor-pointer list-none place-items-center rounded-full border border-border bg-secondary text-primary shadow-[0_3px_0_#adbea8] outline-none transition-transform active:translate-y-0.5 [&::-webkit-details-marker]:hidden" aria-label="Buka menu utama">
              <Menu className="size-5" aria-hidden="true" />
            </summary>
            <div className="absolute left-0 right-0 top-[calc(100%+.65rem)] grid gap-1 rounded-[1.5rem] border border-border bg-card p-3 shadow-[0_24px_60px_rgba(23,62,49,.2)]">
              {navigation.map((item) => (
                <Link key={item.href} href={item.href} className="rounded-xl px-4 py-3 text-sm font-semibold hover:bg-secondary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
                  {item.label}
                </Link>
              ))}
              <Link href="/kontak" className="rounded-xl px-4 py-3 text-sm font-semibold hover:bg-secondary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
                Kontak
              </Link>
              <Button asChild className="mt-2 w-full">
                <TrackedExternalLink
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  eventName="whatsapp_click"
                  eventLocation="public_mobile_menu"
                >
                  Konsultasi via WhatsApp
                </TrackedExternalLink>
              </Button>
            </div>
          </details>
        </div>
      </header>
    </>
  )
}

export function PublicFooter({ settings }: { settings: Settings }) {
  const { brandName, whatsapp, instagram, whatsappUrl } = getContactDetails(settings)

  return (
    <footer className="mt-auto rounded-t-[2.5rem] border-t border-[#b9c8b4] bg-[#dce6d6] pb-7 pt-16 sm:rounded-t-[3.5rem] sm:pt-20">
      <div className="site-container grid gap-10 md:grid-cols-[1.35fr_.65fr_.8fr] md:gap-12">
        <div>
          <p className="display-title text-5xl text-primary sm:text-6xl">{brandName}.</p>
          <p className="mt-5 max-w-md text-sm leading-7 text-[#58675d] sm:text-base">
            MC yang menjaga alur tetap rapi, suasana tetap hangat, dan undangan digital yang membuat kabar bahagia terasa lebih personal.
          </p>
          <Button asChild className="mt-6">
            <TrackedExternalLink href={whatsappUrl} target="_blank" rel="noopener noreferrer" eventName="whatsapp_click" eventLocation="public_footer">
              Ceritakan Acara Anda <ArrowUpRight className="size-4" />
            </TrackedExternalLink>
          </Button>
        </div>
        <nav aria-label="Tautan footer">
          <h2 className="text-[0.68rem] font-bold tracking-[0.14em] text-[#315c46] uppercase">Jelajahi</h2>
          <div className="mt-5 grid gap-3 text-sm text-[#556158]">
            {navigation.map((item) => (
              <Link key={item.href} href={item.href} className="w-fit transition-colors hover:text-primary">{item.label}</Link>
            ))}
            <Link href="/kontak" className="w-fit transition-colors hover:text-primary">Kontak</Link>
          </div>
        </nav>
        <div>
          <h2 className="text-[0.68rem] font-bold tracking-[0.14em] text-[#315c46] uppercase">Hubungi Kami</h2>
          <div className="mt-5 grid gap-3 text-sm text-[#556158]">
            <TrackedExternalLink href={whatsappUrl} target="_blank" rel="noopener noreferrer" eventName="whatsapp_click" eventLocation="public_footer_contact" className="w-fit hover:text-primary">
              WhatsApp +{whatsapp}
            </TrackedExternalLink>
            {settings?.email ? (
              <TrackedExternalLink href={`mailto:${settings.email}`} eventName="email_click" eventLocation="public_footer" className="w-fit break-all hover:text-primary">
                {settings.email}
              </TrackedExternalLink>
            ) : null}
            <TrackedExternalLink href={instagram} target="_blank" rel="noopener noreferrer" eventName="instagram_click" eventLocation="public_footer" className="w-fit hover:text-primary">
              {getInstagramLabel(instagram)}
            </TrackedExternalLink>
            <span className="leading-6">{settings?.address || "Jabodetabek dan luar kota sesuai kesepakatan."}</span>
          </div>
        </div>
      </div>
      <div className="site-container mt-12 flex flex-col gap-2 border-t border-[#b9c8b4] pt-6 text-xs text-[#69756c] sm:flex-row sm:items-center sm:justify-between">
        <span>© {new Date().getFullYear()} {brandName}. Seluruh hak dilindungi.</span>
        <span>Warm · joyful · memorable</span>
      </div>
    </footer>
  )
}

export function FloatingWhatsappButton({ settings }: { settings: Settings }) {
  const { whatsappUrl } = getContactDetails(settings)

  return (
    <TrackedExternalLink
      href={whatsappUrl}
      target="_blank"
      rel="noopener noreferrer"
      eventName="whatsapp_click"
      eventLocation="floating_button"
      aria-label="Konsultasi melalui WhatsApp"
      className="fixed bottom-4 right-4 z-40 flex h-13 items-center gap-2 rounded-full border border-[#1b9c4a] bg-[#25d366] px-4 font-bold text-white shadow-[inset_0_1px_0_rgba(255,255,255,.35),inset_0_-2px_0_rgba(11,101,43,.3),0_5px_0_#16843c,0_10px_28px_rgba(23,62,49,.28)] transition-all hover:-translate-y-0.5 hover:bg-[#2bdd70] focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-[#173e31] active:translate-y-1 active:shadow-[inset_0_2px_4px_rgba(11,101,43,.25),0_1px_0_#16843c] sm:bottom-6 sm:right-6 sm:px-5"
    >
      <MessageCircle className="size-5" aria-hidden="true" />
      <span className="hidden text-sm sm:inline">Konsultasi WhatsApp</span>
    </TrackedExternalLink>
  )
}

export function PublicPageShell({ settings, children }: PublicPageShellProps) {
  return (
    <div className="site-public flex min-h-screen flex-col bg-background">
      <GoogleAnalytics />
      <PublicHeader settings={settings} />
      <main className="flex-1">{children}</main>
      <PublicFooter settings={settings} />
      <FloatingWhatsappButton settings={settings} />
    </div>
  )
}
