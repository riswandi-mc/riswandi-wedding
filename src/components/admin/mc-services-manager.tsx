"use client"

import { useDeferredValue, useMemo, useState, useTransition } from "react"
import { CheckCircle, Edit3, Loader2, Plus, Search, Trash2 } from "lucide-react"

import {
  createAdminMcService,
  deleteAdminMcService,
  updateAdminMcService,
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
import { Checkbox } from "@/components/ui/checkbox"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { DialogFooter } from "@/components/ui/dialog"
import { Popup } from "@/components/ui/popup"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Separator } from "@/components/ui/separator"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { cn } from "@/lib/utils"
import type { AdminMcService } from "@/lib/data/admin"

const emptyForm = {
  id: "",
  title: "",
  badgeLabel: "",
  badgeVariant: "",
  shortDescription: "",
  featuresText: "",
  sortOrder: 0,
  isFeatured: false,
  isActive: true,
}

function getServiceBadgeClass(variant: string | null) {
  switch (variant) {
    case "popular":
      return "bg-primary/10 text-primary border-primary/20"
    case "best_value":
      return "bg-amber-500/10 text-amber-700 border-amber-300"
    case "exclusive":
      return "bg-slate-900/10 text-slate-700 border-slate-300"
    default:
      return "bg-primary/10 text-primary border-primary/20"
  }
}

function sortServices(services: AdminMcService[]) {
  return [...services].sort((a, b) => a.sort_order - b.sort_order || a.title.localeCompare(b.title))
}

function parseFeatures(value: string) {
  return value
    .split(/\r?\n/)
    .map((feature) => feature.trim())
    .filter(Boolean)
}

export function McServicesManager({ initialServices }: { initialServices: AdminMcService[] }) {
  const [services, setServices] = useState(sortServices(initialServices))
  const [searchTerm, setSearchTerm] = useState("")
  const deferredSearchTerm = useDeferredValue(searchTerm)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [form, setForm] = useState(emptyForm)
  const [formError, setFormError] = useState<string | null>(null)
  const [pendingId, setPendingId] = useState<string | null>(null)
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [isPending, startTransition] = useTransition()

  const summary = useMemo(() => {
    const total = services.length
    const active = services.filter((service) => service.is_active).length
    const featured = services.filter((service) => service.is_active && service.is_featured).length
    const visibleLanding = services.filter((service) => service.is_active).slice(0, 3).length

    return {
      total,
      active,
      featured,
      visibleLanding,
    }
  }, [services])

  const filteredServices = services.filter((service) => {
    const query = deferredSearchTerm.trim().toLowerCase()

    return (
      query.length === 0 ||
      service.title.toLowerCase().includes(query) ||
      service.short_description.toLowerCase().includes(query) ||
      service.features.some((feature) => feature.toLowerCase().includes(query))
    )
  })

  const activePreviewServices = filteredServices.filter((service) => service.is_active)

  const openCreateDialog = () => {
    setForm({
      ...emptyForm,
      sortOrder: services.length + 1,
    })
    setFormError(null)
    setIsDialogOpen(true)
  }

  const openEditDialog = (service: AdminMcService) => {
    setForm({
      id: service.id,
      title: service.title,
      badgeLabel: service.badge_label ?? "",
      badgeVariant: service.badge_variant ?? "",
      shortDescription: service.short_description,
      featuresText: service.features.join("\n"),
      sortOrder: service.sort_order,
      isFeatured: service.is_featured,
      isActive: service.is_active,
    })
    setFormError(null)
    setIsDialogOpen(true)
  }

  const handleSubmit = () => {
    setFormError(null)

    const payload = {
      title: form.title,
      badgeLabel: form.badgeLabel,
      badgeVariant: form.badgeVariant,
      shortDescription: form.shortDescription,
      features: parseFeatures(form.featuresText),
      sortOrder: form.sortOrder,
      isFeatured: form.isFeatured,
      isActive: form.isActive,
    }

    startTransition(async () => {
      const result = form.id
        ? await updateAdminMcService({ id: form.id, ...payload })
        : await createAdminMcService(payload)

      if (!result.ok) {
        setFormError(result.error)
        return
      }

      setServices((current) =>
        sortServices(
          form.id
            ? current.map((service) => (service.id === result.service.id ? result.service : service))
            : [result.service, ...current]
        )
      )
      setIsDialogOpen(false)
      setForm(emptyForm)
    })
  }

  const confirmDelete = (id: string) => {
    setPendingId(id)
    startTransition(async () => {
      const result = await deleteAdminMcService({ id })
      setPendingId(null)
      setDeleteId(null)

      if (!result.ok) {
        alert(result.error)
        return
      }

      setServices((current) => current.filter((service) => service.id !== id))
    })
  }

  const handleDelete = (id: string) => {
    setDeleteId(id)
  }

  return (
    <div className="flex min-h-screen flex-col">
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
                <BreadcrumbPage>Layanan MC</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
      </header>

      <main className="admin-surface flex-1 space-y-6 p-4 sm:p-6 lg:p-8">
        <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <h1 className="font-heading text-2xl font-bold text-primary">Manajemen Konten Layanan MC</h1>
            <p className="font-sans text-sm text-muted-foreground">
              Kelola layanan yang tampil di section `/#layanan` dan halaman `/layanan-mc`.
            </p>
          </div>
          <Button onClick={openCreateDialog} className="gap-2 shadow-sm">
            <Plus className="h-4 w-4" /> Tambah Layanan
          </Button>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <Card className="shadow-sm">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Total Layanan</CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="text-2xl font-bold">{summary.total}</div>
              <p className="text-xs text-muted-foreground">Semua layanan di Supabase</p>
            </CardContent>
          </Card>
          <Card className="shadow-sm">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Aktif</CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="text-2xl font-bold">{summary.active}</div>
              <p className="text-xs text-muted-foreground">Tampil di landing page</p>
            </CardContent>
          </Card>
          <Card className="shadow-sm">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Featured</CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="text-2xl font-bold">{summary.featured}</div>
              <p className="text-xs text-muted-foreground">Layanan unggulan aktif</p>
            </CardContent>
          </Card>
          <Card className="shadow-sm">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Landing Preview</CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="text-2xl font-bold">{summary.visibleLanding}</div>
              <p className="text-xs text-muted-foreground">Top 3 aktif teratas</p>
            </CardContent>
          </Card>
        </div>

        <Card className="shadow-sm">
          <CardContent className="flex gap-4 p-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Cari judul, deskripsi, atau fitur layanan..."
                className="pl-9 font-sans"
                value={searchTerm}
                onChange={(event) => setSearchTerm(event.target.value)}
              />
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 gap-6 xl:grid-cols-[minmax(0,1.5fr)_minmax(320px,0.8fr)]">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            {filteredServices.length > 0 ? (
              filteredServices.map((service) => (
                <Card
                  key={service.id}
                  className={cn(
                    "flex flex-col shadow-sm",
                    service.is_featured ? "border-primary/40" : "border-border"
                  )}
                >
                  <CardHeader className="space-y-3">
                    <div className="flex flex-wrap items-center gap-2">
                      {service.badge_label ? (
                        <Badge variant="outline" className={getServiceBadgeClass(service.badge_variant)}>
                          {service.badge_label}
                        </Badge>
                      ) : null}
                      <Badge variant={service.is_active ? "default" : "secondary"}>
                        {service.is_active ? "Aktif" : "Nonaktif"}
                      </Badge>
                      {service.is_featured ? <Badge variant="outline">Featured</Badge> : null}
                    </div>
                    <div>
                      <CardTitle className="font-heading text-lg">{service.title}</CardTitle>
                      <CardDescription className="mt-1 line-clamp-2">
                        {service.short_description}
                      </CardDescription>
                    </div>
                  </CardHeader>
                  <CardContent className="flex-1">
                    <ul className="space-y-2 text-sm text-muted-foreground">
                      {service.features.map((feature) => (
                        <li key={feature} className="flex items-start gap-2">
                          <CheckCircle className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                  <CardFooter className="grid grid-cols-2 gap-2">
                    <Button variant="outline" size="sm" className="gap-2" onClick={() => openEditDialog(service)}>
                      <Edit3 className="h-3.5 w-3.5" /> Edit
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="gap-2 text-destructive hover:bg-destructive/10 hover:text-destructive"
                      onClick={() => handleDelete(service.id)}
                      disabled={isPending && pendingId === service.id}
                    >
                      {isPending && pendingId === service.id ? (
                        <Loader2 className="h-3.5 w-3.5 animate-spin" />
                      ) : (
                        <Trash2 className="h-3.5 w-3.5" />
                      )}
                      Hapus
                    </Button>
                  </CardFooter>
                </Card>
              ))
            ) : (
              <Card className="border-dashed md:col-span-2">
                <CardContent className="flex min-h-40 items-center justify-center text-center text-sm text-muted-foreground">
                  Tidak ada layanan MC ditemukan.
                </CardContent>
              </Card>
            )}
          </div>

          <Card className="h-fit shadow-sm">
            <CardHeader>
              <CardTitle className="font-heading text-lg">Pratinjau `/#layanan`</CardTitle>
              <CardDescription>Landing page hanya mengambil 3 layanan aktif teratas.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {activePreviewServices.slice(0, 3).map((service) => (
                <div key={service.id} className="rounded-lg border bg-background p-4">
                  <div className="mb-2 flex items-center justify-between gap-2">
                    <span className="font-heading text-sm font-semibold">{service.title}</span>
                    <span className="text-xs text-muted-foreground">#{service.sort_order}</span>
                  </div>
                  <p className="line-clamp-2 text-xs text-muted-foreground">{service.short_description}</p>
                </div>
              ))}
              {activePreviewServices.length === 0 ? (
                <div className="rounded-lg border border-dashed p-6 text-center text-sm text-muted-foreground">
                  Belum ada layanan aktif.
                </div>
              ) : null}
              {activePreviewServices.length > 3 ? (
                <p className="text-xs text-muted-foreground">
                  {activePreviewServices.length - 3} layanan aktif lainnya tampil di halaman `/layanan-mc`.
                </p>
              ) : null}
            </CardContent>
          </Card>
        </div>
      </main>

      <Popup
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        className="sm:max-w-[560px]"
        title={form.id ? "Edit Layanan MC" : "Tambah Layanan MC"}
        description="Konten aktif akan tampil di halaman publik sesuai urutan."
        footer={
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsDialogOpen(false)} disabled={isPending}>
                Batal
              </Button>
              <Button onClick={handleSubmit} disabled={isPending}>
                {isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                Simpan
              </Button>
            </DialogFooter>
          }
        >
          {formError ? <div className="rounded-md bg-destructive/15 p-3 text-sm text-destructive">{formError}</div> : null}
          <div className="grid gap-2">
            <Label htmlFor="service-title">Nama Layanan</Label>
            <Input id="service-title" value={form.title} onChange={(event) => setForm((current) => ({ ...current, title: event.target.value }))} />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="service-description">Deskripsi Singkat</Label>
            <Textarea
              id="service-description"
              rows={3}
              className="flex min-h-[88px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
              value={form.shortDescription}
              onChange={(event) => setForm((current) => ({ ...current, shortDescription: event.target.value }))}
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="service-features">Fitur Layanan</Label>
            <Textarea
              id="service-features"
              rows={5}
              placeholder="Tulis satu fitur per baris"
              className="flex min-h-[120px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
              value={form.featuresText}
              onChange={(event) => setForm((current) => ({ ...current, featuresText: event.target.value }))}
            />
          </div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="grid gap-2">
              <Label htmlFor="service-badge-label">Label Badge</Label>
              <Input id="service-badge-label" placeholder="Label sorotan, mis. Populer" value={form.badgeLabel} onChange={(event) => setForm((current) => ({ ...current, badgeLabel: event.target.value }))} />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="service-badge-variant">Variant Badge</Label>
              <Input id="service-badge-variant" placeholder="popular / best_value / exclusive" value={form.badgeVariant} onChange={(event) => setForm((current) => ({ ...current, badgeVariant: event.target.value }))} />
            </div>
          </div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="grid gap-2">
              <Label htmlFor="service-sort">Urutan</Label>
              <Input id="service-sort" type="number" min={0} value={form.sortOrder} onChange={(event) => setForm((current) => ({ ...current, sortOrder: Number(event.target.value) }))} />
            </div>
            <div className="grid gap-2 pt-1 text-sm sm:pt-7">
              <label className="flex items-center gap-2">
                <Checkbox checked={form.isActive} onChange={(event) => setForm((current) => ({ ...current, isActive: event.target.checked }))} />
                Aktif di halaman publik
              </label>
              <label className="flex items-center gap-2">
                <Checkbox checked={form.isFeatured} onChange={(event) => setForm((current) => ({ ...current, isFeatured: event.target.checked }))} />
                Featured
              </label>
            </div>
          </div>
        </Popup>

      <Popup
        open={!!deleteId}
        onOpenChange={(open) => !open && setDeleteId(null)}
        className="sm:max-w-[420px]"
        title="Konfirmasi Hapus"
        description="Apakah Anda yakin ingin menghapus data ini? Tindakan ini tidak dapat dibatalkan."
        footer={
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteId(null)} disabled={isPending}>
              Batal
            </Button>
            <Button variant="destructive" onClick={() => deleteId && confirmDelete(deleteId)} disabled={isPending}>
              {isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
              Hapus
            </Button>
          </DialogFooter>
        }
      />
    </div>
  )
}
