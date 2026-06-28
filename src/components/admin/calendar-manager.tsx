"use client"

import { useMemo, useState, useTransition } from "react"
import { format } from "date-fns"
import { id as localeId } from "date-fns/locale"
import {
  CalendarDays,
  ChevronLeft,
  ChevronRight,
  Clock,
  Loader2,
  Plus,
  Trash2,
} from "lucide-react"

import {
  createAdminManualCalendarEvent,
  deleteAdminManualCalendarEvent,
} from "@/app/actions/admin"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogFooter, DialogFormContent } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { SidebarTrigger } from "@/components/ui/sidebar"
import type { AdminCalendarItem } from "@/lib/data/admin"

const emptyForm = {
  title: "",
  eventDate: "",
  eventTime: "",
  status: "",
  notes: "",
}

function toDateKey(date: Date) {
  return format(date, "yyyy-MM-dd")
}

function getKindMeta(kind: string) {
  switch (kind) {
    case "mc_booking":
      return {
        label: "Booking MC",
        className: "bg-primary/10 text-primary border-primary/20",
      }
    case "invitation_order":
      return {
        label: "Undangan",
        className: "bg-emerald-100 text-emerald-800 border-emerald-200",
      }
    default:
      return {
        label: "Manual",
        className: "bg-zinc-100 text-zinc-800 border-zinc-200",
      }
  }
}

export function CalendarManager({ initialItems }: { initialItems: AdminCalendarItem[] }) {
  const [items, setItems] = useState(initialItems)
  const [currentMonth, setCurrentMonth] = useState(() => {
    const today = new Date()
    return new Date(today.getFullYear(), today.getMonth(), 1)
  })
  const [selectedDate, setSelectedDate] = useState(() => toDateKey(new Date()))
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [form, setForm] = useState(emptyForm)
  const [formError, setFormError] = useState<string | null>(null)
  const [pendingId, setPendingId] = useState<string | null>(null)
  const [isPending, startTransition] = useTransition()

  const monthItems = useMemo(() => {
    const year = currentMonth.getFullYear()
    const month = currentMonth.getMonth()

    return items.filter((item) => {
      const itemDate = new Date(`${item.event_date}T00:00:00`)
      return itemDate.getFullYear() === year && itemDate.getMonth() === month
    })
  }, [currentMonth, items])

  const itemsByDate = useMemo(() => {
    return monthItems.reduce<Record<string, AdminCalendarItem[]>>((acc, item) => {
      acc[item.event_date] = acc[item.event_date] ?? []
      acc[item.event_date].push(item)
      return acc
    }, {})
  }, [monthItems])

  const daysInMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 0).getDate()
  const startDay = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1).getDay()
  const mondayOffset = (startDay + 6) % 7
  const selectedItems = itemsByDate[selectedDate] ?? []
  const summary = useMemo(() => {
    const bookingCount = monthItems.filter((item) => item.event_kind === "mc_booking").length
    const invitationCount = monthItems.filter((item) => item.event_kind === "invitation_order").length
    const manualCount = monthItems.filter((item) => item.event_kind === "manual").length

    return {
      total: monthItems.length,
      bookingCount,
      invitationCount,
      manualCount,
    }
  }, [monthItems])

  const openCreateDialog = () => {
    setForm({
      ...emptyForm,
      eventDate: selectedDate,
    })
    setFormError(null)
    setIsDialogOpen(true)
  }

  const handleSubmit = () => {
    setFormError(null)

    startTransition(async () => {
      const result = await createAdminManualCalendarEvent(form)

      if (!result.ok) {
        setFormError(result.error)
        return
      }

      setItems((current) => [...current, result.event])
      setSelectedDate(result.event.event_date)
      setIsDialogOpen(false)
      setForm(emptyForm)
    })
  }

  const handleDeleteManual = (id: string) => {
    if (!window.confirm("Apakah Anda yakin ingin menghapus event manual ini?")) {
      return
    }

    setPendingId(id)
    startTransition(async () => {
      const result = await deleteAdminManualCalendarEvent({ id })
      setPendingId(null)

      if (!result.ok) {
        alert(result.error)
        return
      }

      setItems((current) => current.filter((item) => item.id !== id))
    })
  }

  const moveMonth = (offset: number) => {
    setCurrentMonth((current) => new Date(current.getFullYear(), current.getMonth() + offset, 1))
  }

  return (
    <div className="flex min-h-screen flex-col">
      <header className="flex h-16 shrink-0 items-center gap-2 border-b bg-background px-4">
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
                <BreadcrumbPage>Kalender Acara</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
      </header>

      <main className="flex-1 space-y-6 bg-muted/20 p-6">
        <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <h1 className="font-heading text-2xl font-bold text-primary">Jadwal Kalender</h1>
            <p className="font-sans text-sm text-muted-foreground">
              Booking MC, order undangan, dan event manual dalam satu kalender.
            </p>
          </div>
          <Button size="sm" className="gap-2 shadow-sm" onClick={openCreateDialog}>
            <Plus className="h-4 w-4" /> Tambah Event Manual
          </Button>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <Card className="bg-background shadow-sm">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Agenda Bulan Ini</CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="text-2xl font-bold">{summary.total}</div>
              <p className="text-xs text-muted-foreground">Semua agenda dari Supabase</p>
            </CardContent>
          </Card>
          <Card className="bg-background shadow-sm">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Booking MC</CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="text-2xl font-bold">{summary.bookingCount}</div>
              <p className="text-xs text-muted-foreground">Agenda booking MC</p>
            </CardContent>
          </Card>
          <Card className="bg-background shadow-sm">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Order Undangan</CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="text-2xl font-bold">{summary.invitationCount}</div>
              <p className="text-xs text-muted-foreground">Agenda order undangan</p>
            </CardContent>
          </Card>
          <Card className="bg-background shadow-sm">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Event Manual</CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="text-2xl font-bold">{summary.manualCount}</div>
              <p className="text-xs text-muted-foreground">Agenda tambahan admin</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          <Card className="bg-background shadow-sm lg:col-span-2">
            <CardHeader className="flex flex-row items-center justify-between border-b pb-4">
              <div>
                <CardTitle className="font-heading text-lg">
                  {format(currentMonth, "MMMM yyyy", { locale: localeId })}
                </CardTitle>
                <CardDescription>{monthItems.length} agenda bulan ini</CardDescription>
              </div>
              <div className="flex gap-2">
                <Button size="icon" variant="outline" className="h-8 w-8" onClick={() => moveMonth(-1)}>
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <Button size="icon" variant="outline" className="h-8 w-8" onClick={() => moveMonth(1)}>
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent className="pt-6 font-sans">
              <div className="mb-4 grid grid-cols-7 gap-2 text-center text-xs font-semibold text-muted-foreground">
                <span>Sen</span>
                <span>Sel</span>
                <span>Rab</span>
                <span>Kam</span>
                <span>Jum</span>
                <span>Sab</span>
                <span>Min</span>
              </div>

              <div className="grid grid-cols-7 gap-2">
                {Array.from({ length: mondayOffset }).map((_, index) => (
                  <div key={`offset-${index}`} className="aspect-square rounded-lg border border-transparent bg-muted/20" />
                ))}

                {Array.from({ length: daysInMonth }).map((_, index) => {
                  const day = index + 1
                  const date = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day)
                  const dateKey = toDateKey(date)
                  const dayItems = itemsByDate[dateKey] ?? []
                  const isSelected = selectedDate === dateKey

                  return (
                    <button
                      key={dateKey}
                      onClick={() => setSelectedDate(dateKey)}
                      className={`relative flex aspect-square flex-col justify-between rounded-lg border p-2 text-left transition-all hover:bg-muted/10 ${
                        isSelected
                          ? "border-primary bg-primary/5 text-primary ring-2 ring-primary/20"
                          : dayItems.length > 0
                            ? "border-emerald-200 bg-emerald-50/30 text-emerald-800"
                            : "border-border bg-background"
                      }`}
                    >
                      <span className="text-xs font-bold">{day}</span>
                      {dayItems.length > 0 ? (
                        <div className="flex w-full items-center justify-end gap-1">
                          <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                          <span className="hidden text-[9px] font-bold text-emerald-700 sm:inline">
                            {dayItems.length}
                          </span>
                        </div>
                      ) : null}
                    </button>
                  )
                })}
              </div>
            </CardContent>
          </Card>

          <Card className="flex h-full flex-col border bg-background shadow-sm">
            <CardHeader className="border-b pb-4">
              <CardTitle className="flex items-center gap-2 font-heading text-base">
                <CalendarDays className="h-4 w-4 text-primary" /> Detail Tanggal
              </CardTitle>
              <CardDescription>
                {format(new Date(`${selectedDate}T00:00:00`), "dd MMMM yyyy", { locale: localeId })}
              </CardDescription>
            </CardHeader>
            <CardContent className="flex-1 space-y-4 pt-6 font-sans">
              {selectedItems.length > 0 ? (
                selectedItems.map((item) => {
                  const meta = getKindMeta(item.event_kind)
                  const isManual = item.event_kind === "manual"
                  const isDeleting = isPending && pendingId === item.id

                  return (
                    <div key={`${item.event_kind}-${item.id}`} className="space-y-3 rounded-xl border bg-muted/10 p-4">
                      <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0">
                          <p className="line-clamp-2 text-sm font-bold text-foreground">{item.title}</p>
                          <Badge variant="outline" className={`mt-1 px-2 py-0 text-[10px] font-normal ${meta.className}`}>
                            {meta.label}
                          </Badge>
                        </div>
                        {isManual ? (
                          <Button
                            size="icon-sm"
                            variant="ghost"
                            className="text-red-500 hover:text-red-600"
                            onClick={() => handleDeleteManual(item.id)}
                            disabled={isDeleting}
                            title="Hapus event manual"
                          >
                            {isDeleting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}
                          </Button>
                        ) : null}
                      </div>

                      <div className="space-y-1.5 border-t pt-3 text-xs text-muted-foreground">
                        {item.event_time ? (
                          <div className="flex items-center gap-2">
                            <Clock className="h-3.5 w-3.5" />
                            <span>{item.event_time.slice(0, 5)}</span>
                          </div>
                        ) : null}
                        {item.description ? <p className="leading-relaxed">{item.description}</p> : null}
                        {item.status ? <p>Status: {item.status}</p> : null}
                        {item.public_id ? <p className="font-mono">{item.public_id}</p> : null}
                      </div>
                    </div>
                  )
                })
              ) : (
                <div className="flex h-full flex-col items-center justify-center space-y-2 py-12 text-center text-muted-foreground">
                  <CalendarDays className="h-8 w-8 text-muted-foreground/50" />
                  <div>
                    <p className="text-xs font-semibold text-foreground">Tidak Ada Jadwal Acara</p>
                    <p className="text-[10px]">Tanggal ini masih kosong.</p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </main>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogFormContent
          className="sm:max-w-[480px]"
          title="Tambah Event Manual"
          description="Event manual akan muncul bersama booking dan order."
          bodyClassName="grid gap-4"
          footer={
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsDialogOpen(false)} disabled={isPending}>
                Batal
              </Button>
              <Button onClick={handleSubmit} disabled={isPending}>
                {isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                Simpan Event
              </Button>
            </DialogFooter>
          }
        >
          {formError ? <div className="rounded-md bg-destructive/15 p-3 text-sm text-destructive">{formError}</div> : null}
          <div className="grid gap-2">
            <Label htmlFor="event-title">Judul Event</Label>
            <Input id="event-title" value={form.title} onChange={(event) => setForm((current) => ({ ...current, title: event.target.value }))} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="event-date">Tanggal</Label>
              <Input id="event-date" type="date" value={form.eventDate} onChange={(event) => setForm((current) => ({ ...current, eventDate: event.target.value }))} />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="event-time">Jam</Label>
              <Input id="event-time" type="time" value={form.eventTime} onChange={(event) => setForm((current) => ({ ...current, eventTime: event.target.value }))} />
            </div>
          </div>
          <div className="grid gap-2">
            <Label htmlFor="event-status">Status</Label>
            <Input id="event-status" value={form.status} onChange={(event) => setForm((current) => ({ ...current, status: event.target.value }))} />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="event-notes">Catatan</Label>
            <textarea
              id="event-notes"
              rows={4}
              className="flex min-h-[96px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
              value={form.notes}
              onChange={(event) => setForm((current) => ({ ...current, notes: event.target.value }))}
            />
          </div>
        </DialogFormContent>
      </Dialog>
    </div>
  )
}
