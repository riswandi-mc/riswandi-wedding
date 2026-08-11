export const dynamic = "force-dynamic"

import { format, isAfter, startOfMonth, subDays, addMonths } from "date-fns"
import { id as indonesianLocale } from "date-fns/locale"
import {
  ArrowUpRight,
  Calendar,
  FileSpreadsheet,
  Images,
  MessageCircle,
  Star,
} from "lucide-react"

import { Breadcrumb, BreadcrumbItem, BreadcrumbList, BreadcrumbPage } from "@/components/ui/breadcrumb"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { SidebarTrigger } from "@/components/ui/sidebar"
import {
  getAdminWebsiteSettings,
  getDashboardMetrics,
  listInvitationOrders,
  listMcBookings,
} from "@/lib/data/admin"
import { getPublicHomepageData } from "@/lib/data/public"

const FALLBACK_WHATSAPP = "6287737860657"

type LeadRow = {
  id: string
  source: "Booking MC" | "Pesanan Undangan"
  client: string
  eventDate: string
  type: string
  status: string
  phone: string | null
  createdAt: string
}

function formatDate(value: string) {
  const date = new Date(value)

  if (Number.isNaN(date.getTime())) {
    return value
  }

  return format(date, "dd MMM yyyy", { locale: indonesianLocale })
}

function formatMonthLabel(value: Date) {
  return format(value, "MMM", { locale: indonesianLocale })
}

function normalizePhone(value?: string | null) {
  const digits = value?.replace(/\D/g, "")
  return digits && digits.length > 0 ? digits : FALLBACK_WHATSAPP
}

function buildWhatsAppUrl(phone: string, text: string) {
  return `https://wa.me/${normalizePhone(phone)}?text=${encodeURIComponent(text)}`
}

function getStatusClasses(status: string) {
  const normalized = status.toLowerCase()

  if (normalized.includes("deal") || normalized.includes("done") || normalized.includes("selesai")) {
    return "bg-emerald-100 text-emerald-800 hover:bg-emerald-100 border-none"
  }

  if (normalized.includes("follow") || normalized.includes("in_progress") || normalized.includes("progress")) {
    return "bg-blue-100 text-blue-800 hover:bg-blue-100 border-none"
  }

  if (normalized.includes("canceled") || normalized.includes("cancel")) {
    return "bg-rose-100 text-rose-800 hover:bg-rose-100 border-none"
  }

  return "bg-amber-100 text-amber-800 hover:bg-amber-100 border-none"
}

function getStatusLabel(status: string) {
  return status
    .replaceAll("_", " ")
    .replace(/\b\w/g, (letter) => letter.toUpperCase())
}

function getLeadFollowUpMessage(lead: LeadRow) {
  if (lead.source === "Booking MC") {
    return `Halo ${lead.client}, saya dari Riswandi Wedding ingin menindaklanjuti booking MC Anda dengan ID ${lead.id}.`
  }

  return `Halo ${lead.client}, saya dari Riswandi Wedding ingin menindaklanjuti pesanan undangan Anda dengan ID ${lead.id}.`
}

function buildMonthlySeries(bookings: { created_at: string }[], orders: { created_at: string }[]) {
  const baseMonth = startOfMonth(new Date())
  const months = Array.from({ length: 5 }, (_, index) => addMonths(baseMonth, index - 4))

  return months.map((monthStart) => ({
    label: formatMonthLabel(monthStart),
    mc: bookings.filter((item) => isSameMonthSafe(item.created_at, monthStart)).length,
    inv: orders.filter((item) => isSameMonthSafe(item.created_at, monthStart)).length,
  }))
}

function isSameMonthSafe(value: string, month: Date) {
  const date = new Date(value)
  return date.getFullYear() === month.getFullYear() && date.getMonth() === month.getMonth()
}

export default async function DashboardPage() {
  const [metrics, bookings, orders, settings, publicData] = await Promise.all([
    getDashboardMetrics(),
    listMcBookings(),
    listInvitationOrders(),
    getAdminWebsiteSettings(),
    getPublicHomepageData(),
  ])

  const waNumber = settings?.phone_whatsapp ?? FALLBACK_WHATSAPP
  const galleryCount = metrics?.active_gallery_items ?? publicData.gallery.length
  const bookingCount = bookings.length
  const orderCount = orders.length
  const recentWindow = subDays(new Date(), 7)

  const bookingsThisWeek = bookings.filter((item) => isAfter(new Date(item.created_at), recentWindow)).length
  const ordersThisWeek = orders.filter((item) => isAfter(new Date(item.created_at), recentWindow)).length

  const averageRating = publicData.testimonials.length
    ? publicData.testimonials.reduce((sum, item) => sum + item.rating, 0) / publicData.testimonials.length
    : 0

  const ratingValue = averageRating.toLocaleString("id-ID", {
    minimumFractionDigits: 1,
    maximumFractionDigits: 1,
  })

  const leadRows: LeadRow[] = [
    ...bookings.map((item) => ({
      id: item.public_id,
      source: "Booking MC" as const,
      client: item.client_name,
      eventDate: item.event_date,
      type: item.service_name,
      status: item.status,
      phone: item.phone,
      createdAt: item.created_at,
    })),
    ...orders.map((item) => ({
      id: item.public_id,
      source: "Pesanan Undangan" as const,
      client: item.couple_name,
      eventDate: item.event_date,
      type: item.template_name,
      status: item.status,
      phone: item.phone,
      createdAt: item.created_at,
    })),
  ]
    .sort((left, right) => new Date(right.createdAt).getTime() - new Date(left.createdAt).getTime())
    .slice(0, 5)

  const monthlySeries = buildMonthlySeries(bookings, orders)
  const chartPeak = Math.max(
    1,
    ...monthlySeries.map((item) => Math.max(item.mc, item.inv))
  )

  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-20 flex h-16 shrink-0 items-center gap-2 border-b bg-background/90 px-4 backdrop-blur-xl">
        <div className="flex items-center gap-2">
          <SidebarTrigger className="-ml-1" />
          <Separator orientation="vertical" className="mr-2 h-4" />
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbPage>Dashboard Overview</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
      </header>

      <main className="admin-surface flex-1 space-y-6 p-4 sm:p-6 lg:p-8">
        <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <h1 className="text-3xl font-bold font-heading text-primary">Selamat Datang, Riswandi!</h1>
            <p className="mt-0.5 text-sm text-muted-foreground font-sans">
              Kelola data pemesanan MC, order undangan digital, dan galeri dokumentasi Anda secara terpusat.
            </p>
          </div>
          <Button asChild size="sm" className="shadow-sm">
            <a href="/" target="_blank" rel="noopener noreferrer">
              Lihat Live Website <ArrowUpRight className="ml-1 h-4 w-4" />
            </a>
          </Button>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Card className="shadow-sm transition-shadow hover:shadow">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Booking MC</CardTitle>
              <Calendar className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{bookingCount}</div>
              <p className="mt-1 text-xs text-muted-foreground">
                {bookingsThisWeek} booking baru 7 hari terakhir
              </p>
            </CardContent>
          </Card>

          <Card className="shadow-sm transition-shadow hover:shadow">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Order Undangan</CardTitle>
              <FileSpreadsheet className="h-4 w-4 text-emerald-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{orderCount}</div>
              <p className="mt-1 text-xs text-muted-foreground">
                {ordersThisWeek} order baru 7 hari terakhir
              </p>
            </CardContent>
          </Card>

          <Card className="shadow-sm transition-shadow hover:shadow">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Galeri Aktif</CardTitle>
              <Images className="h-4 w-4 text-indigo-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{galleryCount}</div>
              <p className="mt-1 text-xs text-muted-foreground">Media aktif dari Supabase Storage</p>
            </CardContent>
          </Card>

          <Card className="shadow-sm transition-shadow hover:shadow">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Rata-rata Rating</CardTitle>
              <Star className="h-4 w-4 fill-amber-500 text-amber-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{ratingValue} / 5.0</div>
              <p className="mt-1 text-xs text-muted-foreground">
                Berdasarkan {publicData.testimonials.length} testimoni
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          <Card className="lg:col-span-2 shadow-sm">
            <CardHeader>
              <CardTitle className="font-heading text-lg">Grafik Aktivitas Booking</CardTitle>
              <CardDescription>
                Tren booking MC dan order undangan digital 5 bulan terakhir berdasarkan data Supabase.
              </CardDescription>
            </CardHeader>
            <CardContent className="flex h-[280px] items-end justify-between gap-2 pt-6">
              {monthlySeries.map((bar) => (
                <div key={bar.label} className="flex h-full flex-1 flex-col items-center justify-end gap-2">
                  <div className="flex h-[80%] w-full items-end justify-center gap-1">
                    <div
                      className="w-4 rounded-t-sm bg-primary transition-all hover:brightness-95 sm:w-6"
                      style={{ height: `${Math.max((bar.mc / chartPeak) * 100, 4)}%` }}
                      title={`Booking MC: ${bar.mc}`}
                    />
                    <div
                      className="w-4 rounded-t-sm bg-emerald-500 transition-all hover:brightness-95 sm:w-6"
                      style={{ height: `${Math.max((bar.inv / chartPeak) * 100, 4)}%` }}
                      title={`Order Undangan: ${bar.inv}`}
                    />
                  </div>
                  <span className="text-xs font-medium text-muted-foreground font-sans">{bar.label}</span>
                </div>
              ))}
            </CardContent>
            <div className="flex gap-4 border-t px-6 pb-6 pt-4 text-xs text-muted-foreground font-sans">
              <div className="flex items-center gap-1.5">
                <span className="h-3 w-3 rounded-full bg-primary" />
                <span>Booking MC</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="h-3 w-3 rounded-full bg-emerald-500" />
                <span>Order Undangan</span>
              </div>
            </div>
          </Card>

          <Card className="flex flex-col shadow-sm">
            <CardHeader>
              <CardTitle className="font-heading text-lg">Menu Pintasan Cepat</CardTitle>
              <CardDescription>Akses cepat ke data yang sekarang sudah sinkron ke Supabase.</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-1 flex-col justify-center space-y-3">
              <Button asChild variant="outline" className="w-full justify-start text-left font-sans">
                <a href="/dashboard/booking-mc">
                  Kelola Booking MC ({bookingCount})
                </a>
              </Button>
              <Button asChild variant="outline" className="w-full justify-start text-left font-sans">
                <a href="/dashboard/pesanan-undangan">Review Pesanan Undangan ({orderCount})</a>
              </Button>
              <Button asChild variant="outline" className="w-full justify-start text-left font-sans">
                <a href="/dashboard/galeri">Upload Foto Dokumentasi Baru ({galleryCount})</a>
              </Button>
              <Button asChild variant="outline" className="w-full justify-start text-left font-sans">
                <a href="/dashboard/faq">Perbarui Daftar FAQ</a>
              </Button>
            </CardContent>
          </Card>
        </div>

        <Card className="shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="font-heading text-lg">Aktivitas & Leads Terbaru</CardTitle>
              <CardDescription>Daftar kiriman formulir terakhir yang sudah tersimpan di Supabase.</CardDescription>
            </div>
            <Button size="sm" variant="ghost" className="text-xs font-sans" asChild>
              <a href="/dashboard/booking-mc">Lihat Semua Leads</a>
            </Button>
          </CardHeader>
          <CardContent className="overflow-x-auto">
            <table className="w-full border-collapse text-left text-sm font-sans">
              <thead>
                <tr className="border-b bg-muted/30">
                  <th className="px-4 py-3 font-semibold text-muted-foreground">ID</th>
                  <th className="px-4 py-3 font-semibold text-muted-foreground">Nama Klien</th>
                  <th className="px-4 py-3 font-semibold text-muted-foreground">Tanggal Acara</th>
                  <th className="px-4 py-3 font-semibold text-muted-foreground">Sumber</th>
                  <th className="px-4 py-3 font-semibold text-muted-foreground">Status</th>
                  <th className="px-4 py-3 font-semibold text-right text-muted-foreground">Aksi</th>
                </tr>
              </thead>
              <tbody>
                {leadRows.length > 0 ? (
                  leadRows.map((item) => (
                    <tr key={`${item.source}-${item.id}`} className="border-b transition-colors hover:bg-muted/10">
                      <td className="px-4 py-3.5 font-mono text-xs font-medium">{item.id}</td>
                      <td className="px-4 py-3.5">{item.client}</td>
                      <td className="px-4 py-3.5 text-muted-foreground">{formatDate(item.eventDate)}</td>
                      <td className="px-4 py-3.5">
                        <Badge variant="outline" className="text-xs font-normal">
                          {item.source}
                        </Badge>
                      </td>
                      <td className="px-4 py-3.5">
                        <Badge variant="secondary" className={getStatusClasses(item.status)}>
                          {getStatusLabel(item.status)}
                        </Badge>
                      </td>
                      <td className="px-4 py-3.5 text-right">
                        <Button size="icon-sm" variant="ghost" asChild>
                          <a
                            href={buildWhatsAppUrl(
                              item.phone ?? waNumber,
                              getLeadFollowUpMessage(item)
                            )}
                            target="_blank"
                            rel="noopener noreferrer"
                            title="Hubungi via WA"
                          >
                            <MessageCircle className="h-4 w-4 text-emerald-500" />
                          </a>
                        </Button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={6} className="px-4 py-8 text-center text-muted-foreground">
                      Belum ada data booking atau pesanan yang masuk.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
