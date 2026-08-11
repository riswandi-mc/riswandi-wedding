"use client"

import { useMemo, useRef, useState, useTransition } from "react"
import Image from "next/image"
import { Edit2, Eye, Loader2, Plus, Trash2 } from "lucide-react"

import {
  createAdminInvitationTemplate,
  deleteAdminInvitationTemplate,
  updateAdminInvitationTemplate,
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
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { DialogFooter } from "@/components/ui/dialog"
import { Popup } from "@/components/ui/popup"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { SidebarTrigger } from "@/components/ui/sidebar"
import type { AdminTemplate } from "@/lib/data/admin"
import { resolvePublicStorageUrl } from "@/lib/storage-url"

const emptyForm = {
  id: "",
  name: "",
  theme: "",
  originalPrice: 59000,
  promoPrice: 39000,
  demoUrl: "",
  previewImageUrl: "",
  imgSig: 1,
  minOrderDays: 7,
  sortOrder: 0,
  isActive: true,
  isDemoReady: true,
}

function formatCurrency(value: number) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(value)
}

function getPreviewUrl(template: AdminTemplate) {
  return resolvePublicStorageUrl("invitation-template", template.preview_image_url)
}

export function InvitationTemplatesManager({
  initialTemplates,
}: {
  initialTemplates: AdminTemplate[]
}) {
  const [templates, setTemplates] = useState(initialTemplates)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [form, setForm] = useState(emptyForm)
  const [formError, setFormError] = useState<string | null>(null)
  const [pendingId, setPendingId] = useState<string | null>(null)
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [isPending, startTransition] = useTransition()
  const previewFileInputRef = useRef<HTMLInputElement | null>(null)

  const summary = useMemo(() => {
    const total = templates.length
    const active = templates.filter((template) => template.is_active).length
    const demoReady = templates.filter((template) => template.is_demo_ready).length
    const previewReady = templates.filter((template) => Boolean(template.preview_image_url)).length

    return {
      total,
      active,
      demoReady,
      previewReady,
    }
  }, [templates])

  const openCreateDialog = () => {
    setForm({
      ...emptyForm,
      sortOrder: templates.length + 1,
      imgSig: templates.length + 1,
    })
    setFormError(null)
    setIsDialogOpen(true)
  }

  const openEditDialog = (template: AdminTemplate) => {
    setForm({
      id: template.id,
      name: template.name,
      theme: template.theme ?? "",
      originalPrice: template.original_price,
      promoPrice: template.promo_price,
      demoUrl: template.demo_url ?? "",
      previewImageUrl: template.preview_image_url ?? "",
      imgSig: template.img_sig ?? 1,
      minOrderDays: template.min_order_days,
      sortOrder: template.sort_order,
      isActive: template.is_active,
      isDemoReady: template.is_demo_ready,
    })
    setFormError(null)
    setIsDialogOpen(true)
  }

  const handleSubmit = () => {
    setFormError(null)

    startTransition(async () => {
      const formData = new FormData()
      if (form.id) {
        formData.set("id", form.id)
      }
      formData.set("name", form.name)
      formData.set("theme", form.theme)
      formData.set("originalPrice", String(form.originalPrice))
      formData.set("promoPrice", String(form.promoPrice))
      formData.set("demoUrl", form.demoUrl)
      formData.set("previewImageUrl", form.previewImageUrl)
      formData.set("imgSig", String(form.imgSig))
      formData.set("minOrderDays", String(form.minOrderDays))
      formData.set("sortOrder", String(form.sortOrder))
      formData.set("isActive", String(form.isActive))
      formData.set("isDemoReady", String(form.isDemoReady))

      const previewFile = previewFileInputRef.current?.files?.[0]
      if (previewFile) {
        formData.set("previewFile", previewFile)
      }

      const result = form.id
        ? await updateAdminInvitationTemplate(formData)
        : await createAdminInvitationTemplate(formData)

      if (!result.ok) {
        setFormError(result.error)
        return
      }

      setTemplates((current) =>
        form.id
          ? current.map((template) =>
              template.id === result.template.id ? result.template : template
            )
          : [result.template, ...current]
      )
      setIsDialogOpen(false)
      setForm(emptyForm)
      if (previewFileInputRef.current) {
        previewFileInputRef.current.value = ""
      }
    })
  }

  const confirmDelete = (id: string) => {
    setPendingId(id)
    startTransition(async () => {
      const result = await deleteAdminInvitationTemplate({ id })
      setPendingId(null)
      setDeleteId(null)

      if (!result.ok) {
        alert(result.error)
        return
      }

      setTemplates((current) => current.filter((template) => template.id !== id))
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
                <BreadcrumbPage>Template Undangan</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
      </header>

      <main className="admin-surface flex-1 space-y-6 p-4 sm:p-6 lg:p-8">
        <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <h1 className="font-heading text-2xl font-bold text-primary">Katalog Template Undangan</h1>
            <p className="font-sans text-sm text-muted-foreground">
              Kelola nama, harga, demo, preview, dan status template undangan digital.
            </p>
          </div>
          <Button onClick={openCreateDialog} className="gap-2 shadow-sm">
            <Plus className="h-4 w-4" /> Tambah Template
          </Button>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <Card className="shadow-sm">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Total Template</CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="text-2xl font-bold">{summary.total}</div>
              <p className="text-xs text-muted-foreground">Semua template di Supabase</p>
            </CardContent>
          </Card>
          <Card className="shadow-sm">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Aktif</CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="text-2xl font-bold">{summary.active}</div>
              <p className="text-xs text-muted-foreground">Muncul di landing page</p>
            </CardContent>
          </Card>
          <Card className="shadow-sm">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Demo Siap</CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="text-2xl font-bold">{summary.demoReady}</div>
              <p className="text-xs text-muted-foreground">Bisa dibuka dari tombol demo</p>
            </CardContent>
          </Card>
          <Card className="shadow-sm">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Preview Tersedia</CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="text-2xl font-bold">{summary.previewReady}</div>
              <p className="text-xs text-muted-foreground">Punya gambar preview</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {templates.map((template) => {
            const previewSrc = getPreviewUrl(template)

            return (
              <Card key={template.id} className="group flex flex-col overflow-hidden bg-background shadow-sm transition-shadow hover:shadow-md">
                <div className="relative aspect-[3/4] overflow-hidden bg-muted">
                  {previewSrc ? (
                    <Image
                      src={previewSrc}
                      alt={template.name}
                      fill
                      sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 25vw"
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center px-4 text-center text-xs text-muted-foreground">
                      Preview belum tersedia
                    </div>
                  )}
                  <div className="absolute left-3 top-3 flex flex-wrap gap-2">
                    <Badge className={template.is_active ? "border-none bg-emerald-500 text-white hover:bg-emerald-500" : "border-none bg-zinc-500 text-white hover:bg-zinc-500"}>
                      {template.is_active ? "Aktif" : "Nonaktif"}
                    </Badge>
                    {!template.is_demo_ready ? (
                      <Badge className="border-none bg-amber-500 text-white hover:bg-amber-500">Proses</Badge>
                    ) : null}
                  </div>
                </div>
                <CardContent className="flex flex-1 flex-col justify-between gap-3 p-4">
                  <div className="space-y-1">
                    <span className="line-clamp-2 font-heading text-sm font-semibold">{template.name}</span>
                    {template.theme ? <span className="block text-xs text-muted-foreground">{template.theme}</span> : null}
                    <div className="flex items-baseline gap-2">
                      <span className="text-sm font-bold text-primary">{formatCurrency(template.promo_price)}</span>
                      <span className="text-xs text-muted-foreground line-through">{formatCurrency(template.original_price)}</span>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="grid w-full grid-cols-3 gap-2 p-4 pt-0">
                  <Button variant="outline" size="sm" className="text-xs" onClick={() => openEditDialog(template)}>
                    <Edit2 className="mr-1.5 h-3.5 w-3.5" /> Edit
                  </Button>
                  <Button size="sm" className="text-xs" asChild disabled={!template.demo_url || !template.is_demo_ready}>
                    <a href={template.demo_url ?? "#"} target="_blank" rel="noopener noreferrer">
                      <Eye className="mr-1.5 h-3.5 w-3.5" /> Demo
                    </a>
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-xs text-red-500 hover:text-red-600"
                    onClick={() => handleDelete(template.id)}
                    disabled={isPending && pendingId === template.id}
                  >
                    {isPending && pendingId === template.id ? (
                      <Loader2 className="h-3.5 w-3.5 animate-spin" />
                    ) : (
                      <Trash2 className="h-3.5 w-3.5" />
                    )}
                  </Button>
                </CardFooter>
              </Card>
            )
          })}
        </div>
      </main>

      <Popup
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        className="sm:max-w-[560px]"
        title={form.id ? "Edit Template Undangan" : "Tambah Template Undangan"}
        description="Ubah konfigurasi template yang tampil di landing page."
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
            <Label htmlFor="tpl-name">Nama Template</Label>
            <Input id="tpl-name" value={form.name} onChange={(event) => setForm((current) => ({ ...current, name: event.target.value }))} />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="tpl-theme">Tema</Label>
            <Input id="tpl-theme" value={form.theme} onChange={(event) => setForm((current) => ({ ...current, theme: event.target.value }))} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="tpl-promo">Harga Promo</Label>
              <Input id="tpl-promo" type="number" min={0} value={form.promoPrice} onChange={(event) => setForm((current) => ({ ...current, promoPrice: Number(event.target.value) }))} />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="tpl-original">Harga Coret</Label>
              <Input id="tpl-original" type="number" min={0} value={form.originalPrice} onChange={(event) => setForm((current) => ({ ...current, originalPrice: Number(event.target.value) }))} />
            </div>
          </div>
          <div className="grid gap-2">
            <Label htmlFor="tpl-demo">URL Demo</Label>
            <Input id="tpl-demo" value={form.demoUrl} onChange={(event) => setForm((current) => ({ ...current, demoUrl: event.target.value }))} />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="tpl-preview">URL Preview</Label>
            <Input id="tpl-preview" value={form.previewImageUrl} onChange={(event) => setForm((current) => ({ ...current, previewImageUrl: event.target.value }))} />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="tpl-preview-file">Upload Gambar Preview</Label>
            <Input id="tpl-preview-file" type="file" accept="image/*" ref={previewFileInputRef} />
            <p className="text-xs text-muted-foreground">
              Jika diisi, file diupload ke bucket `invitation-template` dan URL publiknya mengganti URL Preview.
            </p>
          </div>
          <div className="grid grid-cols-3 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="tpl-min-days">Minimal Hari</Label>
              <Input id="tpl-min-days" type="number" min={1} value={form.minOrderDays} onChange={(event) => setForm((current) => ({ ...current, minOrderDays: Number(event.target.value) }))} />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="tpl-sort">Urutan</Label>
              <Input id="tpl-sort" type="number" min={0} value={form.sortOrder} onChange={(event) => setForm((current) => ({ ...current, sortOrder: Number(event.target.value) }))} />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="tpl-img-sig">Image Sig</Label>
              <Input id="tpl-img-sig" type="number" min={1} value={form.imgSig} onChange={(event) => setForm((current) => ({ ...current, imgSig: Number(event.target.value) }))} />
            </div>
          </div>
          <div className="grid gap-2 text-sm">
            <label className="flex items-center gap-2">
              <Checkbox checked={form.isActive} onChange={(event) => setForm((current) => ({ ...current, isActive: event.target.checked }))} />
              Aktif di landing page
            </label>
            <label className="flex items-center gap-2">
              <Checkbox checked={form.isDemoReady} onChange={(event) => setForm((current) => ({ ...current, isDemoReady: event.target.checked }))} />
              Demo siap dibuka
            </label>
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
