"use client"

import { useDeferredValue, useMemo, useState, useTransition } from "react"
import { format } from "date-fns"
import { id as localeId } from "date-fns/locale"
import {
  CheckCircle2,
  Eye,
  Hourglass,
  Loader2,
  MessageCircle,
  Plus,
  Search,
  Sparkles,
  Trash2,
  XCircle,
} from "lucide-react"

import {
  createAdminInvitationOrder,
  deleteAdminInvitationOrder,
  updateAdminInvitationOrderStatus,
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
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { Badge } from "@/components/ui/badge"
import { CardHeader, CardTitle } from "@/components/ui/card"
import type {
  AdminInvitationOrder,
  AdminInvitationOrderStatus,
  InvitationTemplateOption,
} from "@/lib/data/admin"

const invitationStatusOptions: Array<{
  value: AdminInvitationOrderStatus
  label: string
}> = [
  { value: "new", label: "Baru" },
  { value: "in_progress", label: "In Progress" },
  { value: "review", label: "Review" },
  { value: "done", label: "Selesai" },
  { value: "canceled", label: "Canceled" },
]

const initialOrderForm = {
  coupleName: "",
  phone: "",
  eventDate: "",
  targetCompletionDate: "",
  eventLocation: "",
  templateName: "",
  notes: "",
  status: "new" as AdminInvitationOrderStatus,
}

function formatDisplayDate(value: string | null) {
  if (!value) {
    return "-"
  }

  return format(new Date(`${value}T00:00:00`), "dd MMMM yyyy", { locale: localeId })
}

function getInvitationStatusMeta(status: AdminInvitationOrderStatus) {
  switch (status) {
    case "done":
      return {
        label: "Selesai",
        badge: "bg-emerald-100 text-emerald-800 hover:bg-emerald-100 border-none",
        icon: CheckCircle2,
      }
    case "review":
      return {
        label: "Review",
        badge: "bg-indigo-100 text-indigo-800 hover:bg-indigo-100 border-none",
        icon: Eye,
      }
    case "in_progress":
      return {
        label: "In Progress",
        badge: "bg-amber-100 text-amber-800 hover:bg-amber-100 border-none",
        icon: Hourglass,
      }
    case "canceled":
      return {
        label: "Canceled",
        badge: "bg-red-100 text-red-800 hover:bg-red-100 border-none",
        icon: XCircle,
      }
    default:
      return {
        label: "Baru",
        badge: "bg-blue-100 text-blue-800 hover:bg-blue-100 border-none",
        icon: Sparkles,
      }
  }
}

function buildWhatsappLink(order: AdminInvitationOrder) {
  if (!order.phone) {
    return null
  }

  const phone = order.phone.replace(/[^\d]/g, "")
  const message = `Halo Kak ${order.couple_name}, saya Riswandi. Saya follow up pesanan undangan digital untuk acara tanggal ${formatDisplayDate(order.event_date)}. Kalau ada materi atau revisi, silakan kirim ya.`

  return `https://wa.me/${phone}?text=${encodeURIComponent(message)}`
}

export function InvitationOrdersManager({
  initialOrders,
  templateOptions,
}: {
  initialOrders: AdminInvitationOrder[]
  templateOptions: InvitationTemplateOption[]
}) {
  const [orders, setOrders] = useState(initialOrders)
  const [searchTerm, setSearchTerm] = useState("")
  const deferredSearchTerm = useDeferredValue(searchTerm)
  const [templateFilter, setTemplateFilter] = useState("all")
  const [statusFilter, setStatusFilter] = useState("all")
  const [isAddOpen, setIsAddOpen] = useState(false)
  const [formError, setFormError] = useState<string | null>(null)
  const [newOrder, setNewOrder] = useState(() => ({
    ...initialOrderForm,
    templateName: templateOptions[0]?.name ?? "",
  }))
  const [isAddPending, startAddTransition] = useTransition()
  const [isRowPending, startRowTransition] = useTransition()
  const [pendingRowId, setPendingRowId] = useState<string | null>(null)

  const summary = useMemo(() => {
    const newCount = orders.filter((order) => order.status === "new").length
    const inProgressCount = orders.filter((order) => order.status === "in_progress").length
    const reviewCount = orders.filter((order) => order.status === "review").length
    const doneCount = orders.filter((order) => order.status === "done").length

    return {
      total: orders.length,
      newCount,
      inProgressCount,
      reviewCount,
      doneCount,
    }
  }, [orders])

  const availableTemplates =
    templateOptions.length > 0
      ? templateOptions
      : Array.from(new Set(orders.map((order) => order.template_name))).map((name, index) => ({
          id: `${name}-${index}`,
          name,
          is_active: true,
          sort_order: index,
        }))

  const filteredOrders = orders.filter((order) => {
    const query = deferredSearchTerm.trim().toLowerCase()
    const matchesSearch =
      query.length === 0 ||
      order.couple_name.toLowerCase().includes(query) ||
      order.public_id.toLowerCase().includes(query) ||
      order.template_name.toLowerCase().includes(query) ||
      order.event_location.toLowerCase().includes(query)
    const matchesTemplate = templateFilter === "all" || order.template_name === templateFilter
    const matchesStatus = statusFilter === "all" || order.status === statusFilter

    return matchesSearch && matchesTemplate && matchesStatus
  })

  const handleAddSubmit = () => {
    setFormError(null)

    startAddTransition(async () => {
      const result = await createAdminInvitationOrder(newOrder)

      if (!result.ok) {
        setFormError(result.error)
        return
      }

      setOrders((current) => [result.order, ...current])
      setIsAddOpen(false)
      setNewOrder({
        ...initialOrderForm,
        templateName: templateOptions[0]?.name ?? "",
      })
      setFormError(null)
    })
  }

  const handleStatusChange = (id: string, status: AdminInvitationOrderStatus) => {
    setPendingRowId(id)

    startRowTransition(async () => {
      const result = await updateAdminInvitationOrderStatus({ id, status })
      setPendingRowId(null)

      if (!result.ok) {
        alert(result.error)
        return
      }

      setOrders((current) => current.map((order) => (order.id === id ? result.order : order)))
    })
  }

  const handleDelete = (id: string) => {
    if (!window.confirm("Apakah Anda yakin ingin menghapus data pesanan ini?")) {
      return
    }

    setPendingRowId(id)

    startRowTransition(async () => {
      const result = await deleteAdminInvitationOrder({ id })
      setPendingRowId(null)

      if (!result.ok) {
        alert(result.error)
        return
      }

      setOrders((current) => current.filter((order) => order.id !== id))
    })
  }

  return (
    <div className="flex flex-col min-h-screen">
      <header className="sticky top-0 z-20 flex h-16 shrink-0 items-center gap-2 border-b bg-background/90 px-4 backdrop-blur-xl">
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
                <BreadcrumbPage>Pesanan Undangan</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
      </header>

      <main className="admin-surface flex-1 space-y-6 p-4 sm:p-6 lg:p-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold font-heading text-primary">Pesanan Undangan Digital</h1>
            <p className="text-muted-foreground text-sm font-sans">
              Kelola order undangan digital dari landing page dan input manual admin pada tabel Supabase yang sama.
            </p>
          </div>
          <Button onClick={() => setIsAddOpen(true)} className="shadow-sm gap-2">
            <Plus className="w-4 h-4" /> Tambah Pesanan
          </Button>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-5">
          <Card className="shadow-sm">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Total Pesanan</CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="text-2xl font-bold">{summary.total}</div>
              <p className="text-xs text-muted-foreground">Semua order dari Supabase</p>
            </CardContent>
          </Card>
          <Card className="shadow-sm">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Baru</CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="text-2xl font-bold">{summary.newCount}</div>
              <p className="text-xs text-muted-foreground">Menunggu proses awal</p>
            </CardContent>
          </Card>
          <Card className="shadow-sm">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">In Progress</CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="text-2xl font-bold">{summary.inProgressCount}</div>
              <p className="text-xs text-muted-foreground">Sedang dikerjakan</p>
            </CardContent>
          </Card>
          <Card className="shadow-sm">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Review</CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="text-2xl font-bold">{summary.reviewCount}</div>
              <p className="text-xs text-muted-foreground">Menunggu cek akhir</p>
            </CardContent>
          </Card>
          <Card className="shadow-sm">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Selesai</CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="text-2xl font-bold">{summary.doneCount}</div>
              <p className="text-xs text-muted-foreground">Order yang sudah final</p>
            </CardContent>
          </Card>
        </div>

        <Card className="shadow-sm">
          <CardContent className="p-4 flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Cari nama mempelai, ID, template, atau lokasi..."
                className="pl-9 font-sans"
                value={searchTerm}
                onChange={(event) => setSearchTerm(event.target.value)}
              />
            </div>
            <div className="w-full md:w-[260px]">
              <Select value={templateFilter} onValueChange={setTemplateFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Pilih template" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Semua Template</SelectItem>
                  {availableTemplates.map((template) => (
                    <SelectItem key={template.id} value={template.name}>
                      {template.name}
                      {!template.is_active ? " (Nonaktif)" : ""}
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
                  {invitationStatusOptions.map((status) => (
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
                  <th className="py-3.5 px-6 font-semibold text-muted-foreground">Nama Mempelai</th>
                  <th className="py-3.5 px-6 font-semibold text-muted-foreground">Template</th>
                  <th className="py-3.5 px-6 font-semibold text-muted-foreground">Tanggal Acara</th>
                  <th className="py-3.5 px-6 font-semibold text-muted-foreground">Target</th>
                  <th className="py-3.5 px-6 font-semibold text-muted-foreground">Lokasi</th>
                  <th className="py-3.5 px-6 font-semibold text-muted-foreground">Status</th>
                  <th className="py-3.5 px-6 font-semibold text-muted-foreground text-center">Aksi</th>
                </tr>
              </thead>
              <tbody>
                {filteredOrders.length > 0 ? (
                  filteredOrders.map((order) => {
                    const statusMeta = getInvitationStatusMeta(order.status)
                    const StatusIcon = statusMeta.icon
                    const whatsappLink = buildWhatsappLink(order)
                    const isPendingRow = isRowPending && pendingRowId === order.id

                    return (
                      <tr key={order.id} className="border-b hover:bg-muted/10 transition-colors">
                        <td className="py-4 px-6 font-medium font-mono text-xs">{order.public_id}</td>
                        <td className="py-4 px-6 font-semibold">{order.couple_name}</td>
                        <td className="py-4 px-6">
                          <Badge variant="outline" className="font-normal text-xs">
                            {order.template_name}
                          </Badge>
                        </td>
                        <td className="py-4 px-6 text-muted-foreground">
                          {formatDisplayDate(order.event_date)}
                        </td>
                        <td className="py-4 px-6 text-muted-foreground">
                          {formatDisplayDate(order.target_completion_date)}
                        </td>
                        <td
                          className="py-4 px-6 text-muted-foreground text-xs max-w-[220px] truncate"
                          title={order.event_location}
                        >
                          {order.event_location}
                        </td>
                        <td className="py-4 px-6">
                          <Select
                            value={order.status}
                            onValueChange={(value) =>
                              handleStatusChange(order.id, value as AdminInvitationOrderStatus)
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
                              {invitationStatusOptions.map((status) => (
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
                              onClick={() => handleDelete(order.id)}
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
                    <td colSpan={8} className="py-8 text-center text-muted-foreground">
                      {orders.length === 0
                        ? "Belum ada pesanan undangan. Submit dari landing page dan input manual admin akan muncul di sini."
                        : "Tidak ada pesanan ditemukan dengan filter ini."}
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
          className="sm:max-w-[540px]"
          title="Tambah Pesanan Undangan"
          description="Input manual ini langsung tersimpan ke Supabase dan memakai sumber data yang sama dengan order publik."
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
                  "Simpan Pesanan"
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
            <Label htmlFor="order-couple-name">Nama Mempelai</Label>
            <Input
              id="order-couple-name"
              placeholder="Nama mempelai"
              value={newOrder.coupleName}
              onChange={(event) =>
                setNewOrder((current) => ({
                  ...current,
                  coupleName: event.target.value,
                }))
              }
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="order-phone">Nomor WhatsApp</Label>
            <Input
              id="order-phone"
              placeholder="Nomor WA aktif, mis. 6281234567890"
              value={newOrder.phone}
              onChange={(event) =>
                setNewOrder((current) => ({
                  ...current,
                  phone: event.target.value,
                }))
              }
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="order-event-date">Tanggal Acara</Label>
            <Input
              id="order-event-date"
              type="date"
              value={newOrder.eventDate}
              onChange={(event) =>
                setNewOrder((current) => ({
                  ...current,
                  eventDate: event.target.value,
                }))
              }
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="order-target-date">Target Selesai</Label>
            <Input
              id="order-target-date"
              type="date"
              value={newOrder.targetCompletionDate}
              onChange={(event) =>
                setNewOrder((current) => ({
                  ...current,
                  targetCompletionDate: event.target.value,
                }))
              }
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="order-location">Lokasi Acara</Label>
            <Input
              id="order-location"
              placeholder="Nama gedung atau lokasi acara"
              value={newOrder.eventLocation}
              onChange={(event) =>
                setNewOrder((current) => ({
                  ...current,
                  eventLocation: event.target.value,
                }))
              }
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="order-template">Template Pilihan</Label>
            {availableTemplates.length > 0 ? (
              <Select
                value={newOrder.templateName}
                onValueChange={(value) =>
                  setNewOrder((current) => ({
                    ...current,
                    templateName: value,
                  }))
                }
              >
                <SelectTrigger id="order-template">
                  <SelectValue placeholder="Pilih template" />
                </SelectTrigger>
                <SelectContent>
                  {availableTemplates.map((template) => (
                    <SelectItem key={template.id} value={template.name}>
                      {template.name}
                      {!template.is_active ? " (Nonaktif)" : ""}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            ) : (
              <Input
                id="order-template"
                placeholder="Nama template yang digunakan"
                value={newOrder.templateName}
                onChange={(event) =>
                  setNewOrder((current) => ({
                    ...current,
                    templateName: event.target.value,
                  }))
                }
              />
            )}
          </div>
          <div className="grid gap-2">
            <Label htmlFor="order-status">Status Awal</Label>
            <Select
              value={newOrder.status}
              onValueChange={(value) =>
                setNewOrder((current) => ({
                  ...current,
                  status: value as AdminInvitationOrderStatus,
                }))
              }
            >
              <SelectTrigger id="order-status">
                <SelectValue placeholder="Pilih status" />
              </SelectTrigger>
              <SelectContent>
                {invitationStatusOptions.map((status) => (
                  <SelectItem key={status.value} value={status.value}>
                    {status.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="grid gap-2">
            <Label htmlFor="order-notes">Catatan</Label>
            <Textarea
              id="order-notes"
              rows={4}
              placeholder="Opsional"
              className="flex min-h-[96px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
              value={newOrder.notes}
              onChange={(event) =>
                setNewOrder((current) => ({
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
