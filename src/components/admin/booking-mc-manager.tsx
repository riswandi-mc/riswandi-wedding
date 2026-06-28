"use client"

import { useDeferredValue, useState, useTransition } from "react"
import { format } from "date-fns"
import { id as localeId } from "date-fns/locale"
import {
  AlertCircle,
  CheckCircle,
  Clock,
  Loader2,
  MessageCircle,
  Plus,
  Search,
  Trash2,
  XCircle,
} from "lucide-react"

import {
  createAdminMcBooking,
  deleteAdminMcBooking,
  updateAdminMcBookingStatus,
} from "@/app/actions/admin"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Dialog, DialogFooter, DialogFormContent } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { Badge } from "@/components/ui/badge"
import type { AdminBooking, AdminBookingStatus, McServiceOption } from "@/lib/data/admin"

const bookingStatusOptions: Array<{
  value: AdminBookingStatus
  label: string
}> = [
  { value: "pending", label: "Pending" },
  { value: "followed_up", label: "Followed Up" },
  { value: "deal", label: "Deal" },
  { value: "canceled", label: "Canceled" },
]

const initialBookingForm = {
  clientName: "",
  phone: "",
  eventDate: "",
  eventLocation: "",
  serviceName: "",
  notes: "",
  status: "pending" as AdminBookingStatus,
}

function formatDisplayDate(value: string) {
  return format(new Date(`${value}T00:00:00`), "dd MMMM yyyy", { locale: localeId })
}

function getBookingStatusMeta(status: AdminBookingStatus) {
  switch (status) {
    case "deal":
      return {
        label: "Deal",
        badge: "bg-emerald-100 text-emerald-800 hover:bg-emerald-100 border-none",
        icon: CheckCircle,
      }
    case "followed_up":
      return {
        label: "Followed Up",
        badge: "bg-blue-100 text-blue-800 hover:bg-blue-100 border-none",
        icon: Clock,
      }
    case "canceled":
      return {
        label: "Canceled",
        badge: "bg-red-100 text-red-800 hover:bg-red-100 border-none",
        icon: XCircle,
      }
    default:
      return {
        label: "Pending",
        badge: "bg-amber-100 text-amber-800 hover:bg-amber-100 border-none",
        icon: AlertCircle,
      }
  }
}

function buildWhatsappLink(booking: AdminBooking) {
  if (!booking.phone) {
    return null
  }

  const phone = booking.phone.replace(/[^\d]/g, "")
  const message = `Halo Kak ${booking.client_name}, saya Riswandi. Saya follow up booking MC untuk acara tanggal ${formatDisplayDate(booking.event_date)}. Mohon kabar lanjutannya ya.`

  return `https://wa.me/${phone}?text=${encodeURIComponent(message)}`
}

export function BookingMcManager({
  initialBookings,
  serviceOptions,
}: {
  initialBookings: AdminBooking[]
  serviceOptions: McServiceOption[]
}) {
  const [bookings, setBookings] = useState(initialBookings)
  const [searchTerm, setSearchTerm] = useState("")
  const deferredSearchTerm = useDeferredValue(searchTerm)
  const [serviceFilter, setServiceFilter] = useState("all")
  const [statusFilter, setStatusFilter] = useState("all")
  const [isAddOpen, setIsAddOpen] = useState(false)
  const [formError, setFormError] = useState<string | null>(null)
  const [newBooking, setNewBooking] = useState(() => ({
    ...initialBookingForm,
    serviceName: serviceOptions[0]?.title ?? "",
  }))
  const [isAddPending, startAddTransition] = useTransition()
  const [isRowPending, startRowTransition] = useTransition()
  const [pendingRowId, setPendingRowId] = useState<string | null>(null)

  const availableServices =
    serviceOptions.length > 0
      ? serviceOptions
      : Array.from(new Set(bookings.map((booking) => booking.service_name))).map((title, index) => ({
          id: `${title}-${index}`,
          title,
          is_active: true,
          sort_order: index,
        }))

  const filteredBookings = bookings.filter((booking) => {
    const query = deferredSearchTerm.trim().toLowerCase()
    const matchesSearch =
      query.length === 0 ||
      booking.client_name.toLowerCase().includes(query) ||
      booking.public_id.toLowerCase().includes(query) ||
      (booking.phone ?? "").toLowerCase().includes(query)
    const matchesService = serviceFilter === "all" || booking.service_name === serviceFilter
    const matchesStatus = statusFilter === "all" || booking.status === statusFilter

    return matchesSearch && matchesService && matchesStatus
  })

  const handleAddSubmit = () => {
    setFormError(null)

    startAddTransition(async () => {
      const result = await createAdminMcBooking(newBooking)

      if (!result.ok) {
        setFormError(result.error)
        return
      }

      setBookings((current) => [result.booking, ...current])
      setIsAddOpen(false)
      setNewBooking({
        ...initialBookingForm,
        serviceName: serviceOptions[0]?.title ?? "",
      })
      setFormError(null)
    })
  }

  const handleStatusChange = (id: string, status: AdminBookingStatus) => {
    setPendingRowId(id)

    startRowTransition(async () => {
      const result = await updateAdminMcBookingStatus({ id, status })
      setPendingRowId(null)

      if (!result.ok) {
        alert(result.error)
        return
      }

      setBookings((current) =>
        current.map((booking) => (booking.id === id ? result.booking : booking))
      )
    })
  }

  const handleDelete = (id: string) => {
    if (!window.confirm("Apakah Anda yakin ingin menghapus data booking ini?")) {
      return
    }

    setPendingRowId(id)

    startRowTransition(async () => {
      const result = await deleteAdminMcBooking({ id })
      setPendingRowId(null)

      if (!result.ok) {
        alert(result.error)
        return
      }

      setBookings((current) => current.filter((booking) => booking.id !== id))
    })
  }

  return (
    <div className="flex flex-col min-h-screen">
      <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4 bg-background">
        <div className="flex items-center gap-2">
          <SidebarTrigger className="-ml-1" />
          <Separator orientation="vertical" className="mr-2 h-4" />
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink href="/dashboard">Dashboard</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>Booking MC</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
      </header>

      <main className="flex-1 p-6 space-y-6 bg-muted/20">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold font-heading text-primary">Data Booking MC</h1>
            <p className="text-muted-foreground text-sm font-sans">
              Kelola lead booking MC dari landing page dan input manual admin dari sumber data Supabase yang sama.
            </p>
          </div>
          <Button onClick={() => setIsAddOpen(true)} className="shadow-sm gap-2">
            <Plus className="w-4 h-4" /> Tambah Booking
          </Button>
        </div>

        <Card className="shadow-sm">
          <CardContent className="p-4 flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Cari nama klien, ID, atau nomor WhatsApp..."
                className="pl-9 font-sans"
                value={searchTerm}
                onChange={(event) => setSearchTerm(event.target.value)}
              />
            </div>
            <div className="w-full md:w-[220px]">
              <Select value={serviceFilter} onValueChange={setServiceFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Pilih layanan" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Semua Layanan</SelectItem>
                  {availableServices.map((service) => (
                    <SelectItem key={service.id} value={service.title}>
                      {service.title}
                      {!service.is_active ? " (Nonaktif)" : ""}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="w-full md:w-[200px]">
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Pilih status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Semua Status</SelectItem>
                  {bookingStatusOptions.map((status) => (
                    <SelectItem key={status.value} value={status.value}>
                      {status.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-sm">
          <CardContent className="p-0 overflow-x-auto">
            <table className="w-full border-collapse text-left text-sm font-sans">
              <thead>
                <tr className="border-b bg-muted/30">
                  <th className="py-3.5 px-6 font-semibold text-muted-foreground">ID</th>
                  <th className="py-3.5 px-6 font-semibold text-muted-foreground">Nama Klien</th>
                  <th className="py-3.5 px-6 font-semibold text-muted-foreground">Tanggal Acara</th>
                  <th className="py-3.5 px-6 font-semibold text-muted-foreground">Layanan</th>
                  <th className="py-3.5 px-6 font-semibold text-muted-foreground">Telepon</th>
                  <th className="py-3.5 px-6 font-semibold text-muted-foreground">Status</th>
                  <th className="py-3.5 px-6 font-semibold text-muted-foreground text-center">Aksi</th>
                </tr>
              </thead>
              <tbody>
                {filteredBookings.length > 0 ? (
                  filteredBookings.map((booking) => {
                    const statusMeta = getBookingStatusMeta(booking.status)
                    const StatusIcon = statusMeta.icon
                    const whatsappLink = buildWhatsappLink(booking)
                    const isPendingRow = isRowPending && pendingRowId === booking.id

                    return (
                      <tr key={booking.id} className="border-b hover:bg-muted/10 transition-colors">
                        <td className="py-4 px-6 font-medium font-mono text-xs">{booking.public_id}</td>
                        <td className="py-4 px-6 font-semibold">{booking.client_name}</td>
                        <td className="py-4 px-6 text-muted-foreground">
                          {formatDisplayDate(booking.event_date)}
                        </td>
                        <td className="py-4 px-6">
                          <Badge variant="outline" className="font-normal text-xs">
                            {booking.service_name}
                          </Badge>
                        </td>
                        <td className="py-4 px-6 text-muted-foreground font-mono text-xs">
                          {booking.phone ?? "-"}
                        </td>
                        <td className="py-4 px-6">
                          <Select
                            value={booking.status}
                            onValueChange={(value) =>
                              handleStatusChange(booking.id, value as AdminBookingStatus)
                            }
                            disabled={isPendingRow}
                          >
                            <SelectTrigger className="w-[150px] h-9 text-xs">
                              <div className="flex items-center gap-2">
                                {isPendingRow ? (
                                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                                ) : (
                                  <StatusIcon className="h-3.5 w-3.5" />
                                )}
                                <span>{statusMeta.label}</span>
                              </div>
                            </SelectTrigger>
                            <SelectContent>
                              {bookingStatusOptions.map((status) => (
                                <SelectItem key={status.value} value={status.value}>
                                  {status.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </td>
                        <td className="py-4 px-6 text-center">
                          <div className="flex justify-center gap-2">
                            {whatsappLink ? (
                              <Button size="icon-sm" variant="ghost" asChild>
                                <a
                                  href={whatsappLink}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  title="Chat WhatsApp"
                                >
                                  <MessageCircle className="h-4 w-4 text-emerald-500" />
                                </a>
                              </Button>
                            ) : null}
                            <Button
                              size="icon-sm"
                              variant="ghost"
                              className="text-red-500 hover:text-red-600"
                              onClick={() => handleDelete(booking.id)}
                              disabled={isPendingRow}
                              title="Hapus"
                            >
                              {isPendingRow ? (
                                <Loader2 className="h-4 w-4 animate-spin" />
                              ) : (
                                <Trash2 className="h-4 w-4" />
                              )}
                            </Button>
                          </div>
                        </td>
                      </tr>
                    )
                  })
                ) : (
                  <tr>
                    <td colSpan={7} className="py-8 text-center text-muted-foreground">
                      {bookings.length === 0
                        ? "Belum ada data booking. Submit dari landing page dan input manual admin akan muncul di sini."
                        : "Tidak ada data booking ditemukan dengan filter ini."}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </CardContent>
        </Card>
      </main>

      <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
        <DialogFormContent
          className="sm:max-w-[520px]"
          title="Tambah Data Booking MC"
          description="Input manual ini langsung disimpan ke Supabase dan memakai tabel yang sama dengan form publik."
          bodyClassName="grid gap-4"
          footer={
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsAddOpen(false)} disabled={isAddPending}>
                Batal
              </Button>
              <Button onClick={handleAddSubmit} disabled={isAddPending}>
                {isAddPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Menyimpan...
                  </>
                ) : (
                  "Simpan Booking"
                )}
              </Button>
            </DialogFooter>
          }
        >
          {formError ? (
            <div className="rounded-md bg-destructive/15 p-3 text-sm text-destructive">
              {formError}
            </div>
          ) : null}
          <div className="grid gap-2">
            <Label htmlFor="booking-client-name">Nama Klien</Label>
            <Input
              id="booking-client-name"
              placeholder="Cth: Budi & Rina"
              value={newBooking.clientName}
              onChange={(event) =>
                setNewBooking((current) => ({
                  ...current,
                  clientName: event.target.value,
                }))
              }
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="booking-phone">Nomor WhatsApp</Label>
            <Input
              id="booking-phone"
              placeholder="Cth: 6281234567890"
              value={newBooking.phone}
              onChange={(event) =>
                setNewBooking((current) => ({
                  ...current,
                  phone: event.target.value,
                }))
              }
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="booking-event-date">Tanggal Acara</Label>
            <Input
              id="booking-event-date"
              type="date"
              value={newBooking.eventDate}
              onChange={(event) =>
                setNewBooking((current) => ({
                  ...current,
                  eventDate: event.target.value,
                }))
              }
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="booking-service">Pilihan Layanan</Label>
            {availableServices.length > 0 ? (
              <Select
                value={newBooking.serviceName}
                onValueChange={(value) =>
                  setNewBooking((current) => ({
                    ...current,
                    serviceName: value,
                  }))
                }
              >
                <SelectTrigger id="booking-service">
                  <SelectValue placeholder="Pilih layanan" />
                </SelectTrigger>
                <SelectContent>
                  {availableServices.map((service) => (
                    <SelectItem key={service.id} value={service.title}>
                      {service.title}
                      {!service.is_active ? " (Nonaktif)" : ""}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            ) : (
              <Input
                id="booking-service"
                placeholder="Cth: MC Wedding Private"
                value={newBooking.serviceName}
                onChange={(event) =>
                  setNewBooking((current) => ({
                    ...current,
                    serviceName: event.target.value,
                  }))
                }
              />
            )}
          </div>
          <div className="grid gap-2">
            <Label htmlFor="booking-location">Lokasi Acara</Label>
            <Input
              id="booking-location"
              placeholder="Opsional"
              value={newBooking.eventLocation}
              onChange={(event) =>
                setNewBooking((current) => ({
                  ...current,
                  eventLocation: event.target.value,
                }))
              }
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="booking-status">Status Awal</Label>
            <Select
              value={newBooking.status}
              onValueChange={(value) =>
                setNewBooking((current) => ({
                  ...current,
                  status: value as AdminBookingStatus,
                }))
              }
            >
              <SelectTrigger id="booking-status">
                <SelectValue placeholder="Pilih status" />
              </SelectTrigger>
              <SelectContent>
                {bookingStatusOptions.map((status) => (
                  <SelectItem key={status.value} value={status.value}>
                    {status.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="grid gap-2">
            <Label htmlFor="booking-notes">Catatan</Label>
            <textarea
              id="booking-notes"
              rows={4}
              placeholder="Opsional"
              className="flex min-h-[96px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
              value={newBooking.notes}
              onChange={(event) =>
                setNewBooking((current) => ({
                  ...current,
                  notes: event.target.value,
                }))
              }
            />
          </div>
        </DialogFormContent>
      </Dialog>
    </div>
  )
}
