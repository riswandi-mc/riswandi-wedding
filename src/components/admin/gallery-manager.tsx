"use client"

import { useDeferredValue, useRef, useState, useTransition } from "react"
import Image from "next/image"
import { Edit3, Image as ImageIcon, Loader2, Plus, Search, Trash2, Video } from "lucide-react"

import {
  createAdminGalleryItem,
  deleteAdminGalleryItem,
  updateAdminGalleryItem,
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
import { Card, CardContent } from "@/components/ui/card"
import { Dialog, DialogFooter, DialogFormContent } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { SidebarTrigger } from "@/components/ui/sidebar"
import type { AdminGalleryItem } from "@/lib/data/admin"

const categories = ["Wedding", "Corporate", "Private", "Undangan Digital"]

const emptyForm = {
  id: "",
  title: "",
  category: "Wedding",
  mediaType: "image" as "image" | "video",
  sortOrder: 0,
  isFeatured: false,
  isActive: true,
}

export function GalleryManager({ initialItems }: { initialItems: AdminGalleryItem[] }) {
  const [items, setItems] = useState(initialItems)
  const [searchTerm, setSearchTerm] = useState("")
  const deferredSearchTerm = useDeferredValue(searchTerm)
  const [categoryFilter, setCategoryFilter] = useState("all")
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [form, setForm] = useState(emptyForm)
  const [formError, setFormError] = useState<string | null>(null)
  const [pendingId, setPendingId] = useState<string | null>(null)
  const [isPending, startTransition] = useTransition()
  const fileInputRef = useRef<HTMLInputElement | null>(null)

  const filteredItems = items.filter((item) => {
    const query = deferredSearchTerm.trim().toLowerCase()
    const matchesSearch = query.length === 0 || item.title.toLowerCase().includes(query)
    const matchesCategory = categoryFilter === "all" || item.category === categoryFilter
    return matchesSearch && matchesCategory
  })

  const openCreateDialog = () => {
    setForm({
      ...emptyForm,
      sortOrder: items.length + 1,
    })
    setFormError(null)
    setIsDialogOpen(true)
  }

  const openEditDialog = (item: AdminGalleryItem) => {
    setForm({
      id: item.id,
      title: item.title,
      category: item.category,
      mediaType: item.media_type,
      sortOrder: item.sort_order,
      isFeatured: item.is_featured,
      isActive: item.is_active,
    })
    setFormError(null)
    setIsDialogOpen(true)
  }

  const handleSubmit = () => {
    setFormError(null)

    startTransition(async () => {
      if (form.id) {
        const result = await updateAdminGalleryItem(form)

        if (!result.ok) {
          setFormError(result.error)
          return
        }

        setItems((current) => current.map((item) => (item.id === result.item.id ? result.item : item)))
        setIsDialogOpen(false)
        return
      }

      const file = fileInputRef.current?.files?.[0]
      const formData = new FormData()
      formData.set("title", form.title)
      formData.set("category", form.category)
      formData.set("mediaType", form.mediaType)
      formData.set("sortOrder", String(form.sortOrder))
      formData.set("isFeatured", String(form.isFeatured))
      formData.set("isActive", String(form.isActive))
      if (file) {
        formData.set("file", file)
      }

      const result = await createAdminGalleryItem(formData)

      if (!result.ok) {
        setFormError(result.error)
        return
      }

      setItems((current) => [result.item, ...current])
      setIsDialogOpen(false)
      setForm(emptyForm)
      if (fileInputRef.current) {
        fileInputRef.current.value = ""
      }
    })
  }

  const handleDelete = (id: string) => {
    if (!window.confirm("Apakah Anda yakin ingin menghapus media ini?")) {
      return
    }

    setPendingId(id)
    startTransition(async () => {
      const result = await deleteAdminGalleryItem({ id })
      setPendingId(null)

      if (!result.ok) {
        alert(result.error)
        return
      }

      setItems((current) => current.filter((item) => item.id !== id))
    })
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
                <BreadcrumbPage>Galeri Dokumentasi</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
      </header>

      <main className="flex-1 space-y-6 bg-muted/20 p-6">
        <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <h1 className="font-heading text-2xl font-bold text-primary">Galeri & Dokumentasi</h1>
            <p className="font-sans text-sm text-muted-foreground">
              Upload foto/video ke Supabase Storage dan kelola metadata galeri publik.
            </p>
          </div>
          <Button onClick={openCreateDialog} className="gap-2 shadow-sm">
            <Plus className="h-4 w-4" /> Tambah Media
          </Button>
        </div>

        <Card className="shadow-sm">
          <CardContent className="flex flex-col gap-4 p-4 sm:flex-row">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Cari judul dokumentasi..."
                className="pl-9 font-sans"
                value={searchTerm}
                onChange={(event) => setSearchTerm(event.target.value)}
              />
            </div>
            <div className="w-full sm:w-[220px]">
              <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Pilih kategori" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Semua Kategori</SelectItem>
                  {categories.map((category) => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {filteredItems.length > 0 ? (
            filteredItems.map((item) => (
              <Card key={item.id} className="group flex flex-col overflow-hidden bg-background shadow-sm transition-shadow hover:shadow-md">
                <div className="relative aspect-video overflow-hidden bg-muted">
                  {item.media_type === "image" ? (
                    <Image
                      src={item.media_url}
                      alt={item.title}
                      fill
                      sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 25vw"
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  ) : (
                    <video src={item.media_url} className="h-full w-full object-cover" muted preload="metadata" />
                  )}
                  <Badge className="absolute left-3 top-3 border-none bg-black/60 px-2 py-0.5 text-xs font-normal text-white backdrop-blur-sm hover:bg-black/60">
                    {item.category}
                  </Badge>
                  {!item.is_active ? (
                    <Badge className="absolute right-3 top-3 border-none bg-zinc-500 px-2 py-0.5 text-xs font-normal text-white hover:bg-zinc-500">
                      Nonaktif
                    </Badge>
                  ) : null}
                  {item.media_type === "video" ? (
                    <div className="absolute inset-0 flex items-center justify-center bg-black/25">
                      <Video className="h-8 w-8 text-white drop-shadow-md" />
                    </div>
                  ) : null}
                </div>
                <CardContent className="flex flex-1 flex-col justify-between gap-3 p-4">
                  <span className="line-clamp-2 font-heading text-sm font-semibold">{item.title}</span>
                  <div className="mt-auto flex items-center justify-between border-t pt-3">
                    <span className="flex items-center gap-1 font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
                      {item.media_type === "video" ? <Video className="h-3.5 w-3.5" /> : <ImageIcon className="h-3.5 w-3.5" />}
                      {item.media_type}
                    </span>
                    <div className="flex gap-1">
                      <Button size="icon-xs" variant="ghost" onClick={() => openEditDialog(item)} title="Edit">
                        <Edit3 className="h-4 w-4 text-primary" />
                      </Button>
                      <Button
                        size="icon-xs"
                        variant="ghost"
                        className="text-red-500 hover:text-red-600"
                        onClick={() => handleDelete(item.id)}
                        disabled={isPending && pendingId === item.id}
                        title="Hapus"
                      >
                        {isPending && pendingId === item.id ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <Trash2 className="h-4 w-4" />
                        )}
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          ) : (
            <div className="col-span-full py-12 text-center font-sans text-muted-foreground">
              Tidak ada dokumentasi media ditemukan.
            </div>
          )}
        </div>
      </main>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogFormContent
          className="sm:max-w-[500px]"
          title={form.id ? "Edit Dokumentasi Galeri" : "Tambah Dokumentasi Galeri"}
          description={form.id ? "Ubah metadata galeri." : "Pilih file dan isi metadata untuk galeri landing page."}
          bodyClassName="grid gap-4"
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
            <Label htmlFor="gallery-title">Judul Dokumentasi</Label>
            <Input id="gallery-title" value={form.title} onChange={(event) => setForm((current) => ({ ...current, title: event.target.value }))} />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="gallery-category">Kategori</Label>
            <Select value={form.category} onValueChange={(value) => setForm((current) => ({ ...current, category: value }))}>
              <SelectTrigger id="gallery-category">
                <SelectValue placeholder="Pilih kategori" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((category) => (
                  <SelectItem key={category} value={category}>
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="grid gap-2">
            <Label htmlFor="gallery-type">Tipe Media</Label>
            <Select value={form.mediaType} onValueChange={(value) => setForm((current) => ({ ...current, mediaType: value as "image" | "video" }))}>
              <SelectTrigger id="gallery-type">
                <SelectValue placeholder="Pilih tipe" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="image">Foto</SelectItem>
                <SelectItem value="video">Video</SelectItem>
              </SelectContent>
            </Select>
          </div>
          {!form.id ? (
            <div className="grid gap-2">
              <Label htmlFor="gallery-file">File Media</Label>
              <Input id="gallery-file" type="file" accept="image/*,video/*" ref={fileInputRef} />
              <p className="text-xs text-muted-foreground">Maksimal 20MB.</p>
            </div>
          ) : null}
          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="gallery-sort">Urutan</Label>
              <Input id="gallery-sort" type="number" min={0} value={form.sortOrder} onChange={(event) => setForm((current) => ({ ...current, sortOrder: Number(event.target.value) }))} />
            </div>
            <div className="grid gap-2 pt-7 text-sm">
              <label className="flex items-center gap-2">
                <input type="checkbox" checked={form.isActive} onChange={(event) => setForm((current) => ({ ...current, isActive: event.target.checked }))} />
                Aktif
              </label>
              <label className="flex items-center gap-2">
                <input type="checkbox" checked={form.isFeatured} onChange={(event) => setForm((current) => ({ ...current, isFeatured: event.target.checked }))} />
                Featured
              </label>
            </div>
          </div>
        </DialogFormContent>
      </Dialog>
    </div>
  )
}
