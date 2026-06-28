"use client"

import { useDeferredValue, useState, useTransition } from "react"
import { Edit3, EyeOff, Loader2, Plus, Search, Trash2 } from "lucide-react"

import { createAdminFaq, deleteAdminFaq, updateAdminFaq } from "@/app/actions/admin"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogFooter, DialogFormContent } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { SidebarTrigger } from "@/components/ui/sidebar"
import type { AdminFaq } from "@/lib/data/admin"

const emptyForm = {
  id: "",
  question: "",
  answer: "",
  sortOrder: 0,
  isActive: true,
}

export function FaqManager({ initialFaqs }: { initialFaqs: AdminFaq[] }) {
  const [faqs, setFaqs] = useState(initialFaqs)
  const [searchTerm, setSearchTerm] = useState("")
  const deferredSearchTerm = useDeferredValue(searchTerm)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [form, setForm] = useState(emptyForm)
  const [formError, setFormError] = useState<string | null>(null)
  const [pendingId, setPendingId] = useState<string | null>(null)
  const [isPending, startTransition] = useTransition()

  const filteredFaqs = faqs.filter((faq) => {
    const query = deferredSearchTerm.trim().toLowerCase()
    return (
      query.length === 0 ||
      faq.question.toLowerCase().includes(query) ||
      faq.answer.toLowerCase().includes(query)
    )
  })

  const openCreateDialog = () => {
    setForm(emptyForm)
    setFormError(null)
    setIsDialogOpen(true)
  }

  const openEditDialog = (faq: AdminFaq) => {
    setForm({
      id: faq.id,
      question: faq.question,
      answer: faq.answer,
      sortOrder: faq.sort_order,
      isActive: faq.is_active,
    })
    setFormError(null)
    setIsDialogOpen(true)
  }

  const handleSubmit = () => {
    setFormError(null)

    startTransition(async () => {
      const result = form.id
        ? await updateAdminFaq(form)
        : await createAdminFaq({
            question: form.question,
            answer: form.answer,
            sortOrder: form.sortOrder,
            isActive: form.isActive,
          })

      if (!result.ok) {
        setFormError(result.error)
        return
      }

      setFaqs((current) =>
        form.id
          ? current.map((faq) => (faq.id === result.faq.id ? result.faq : faq))
          : [result.faq, ...current]
      )
      setIsDialogOpen(false)
      setForm(emptyForm)
    })
  }

  const handleDelete = (id: string) => {
    if (!window.confirm("Apakah Anda yakin ingin menghapus FAQ ini?")) {
      return
    }

    setPendingId(id)
    startTransition(async () => {
      const result = await deleteAdminFaq({ id })
      setPendingId(null)

      if (!result.ok) {
        alert(result.error)
        return
      }

      setFaqs((current) => current.filter((faq) => faq.id !== id))
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
                <BreadcrumbPage>FAQ</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
      </header>

      <main className="flex-1 space-y-6 bg-muted/20 p-6">
        <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <h1 className="font-heading text-2xl font-bold text-primary">Kelola FAQ</h1>
            <p className="font-sans text-sm text-muted-foreground">
              CRUD FAQ dari Supabase. Item aktif langsung tampil di landing page.
            </p>
          </div>
          <Button onClick={openCreateDialog} className="gap-2 shadow-sm">
            <Plus className="h-4 w-4" /> Tambah FAQ
          </Button>
        </div>

        <Card className="shadow-sm">
          <CardContent className="flex gap-4 p-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Cari pertanyaan atau jawaban..."
                className="pl-9 font-sans"
                value={searchTerm}
                onChange={(event) => setSearchTerm(event.target.value)}
              />
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          <Card className="shadow-sm lg:col-span-2">
            <CardHeader>
              <CardTitle className="font-heading text-lg">Pratinjau Landing Page</CardTitle>
              <CardDescription>Hanya FAQ aktif yang tampil untuk pengunjung.</CardDescription>
            </CardHeader>
            <CardContent>
              {filteredFaqs.filter((faq) => faq.is_active).length > 0 ? (
                <Accordion type="single" collapsible className="w-full rounded-xl border bg-background px-6">
                  {filteredFaqs
                    .filter((faq) => faq.is_active)
                    .map((faq) => (
                      <AccordionItem key={faq.id} value={faq.id} className="border-b last:border-b-0">
                        <AccordionTrigger className="py-4 text-left text-sm font-semibold hover:no-underline">
                          {faq.question}
                        </AccordionTrigger>
                        <AccordionContent className="pb-4 font-sans text-xs leading-relaxed text-muted-foreground">
                          {faq.answer}
                        </AccordionContent>
                      </AccordionItem>
                    ))}
                </Accordion>
              ) : (
                <p className="py-6 text-center font-sans text-sm text-muted-foreground">Belum ada FAQ aktif.</p>
              )}
            </CardContent>
          </Card>

          <Card className="shadow-sm">
            <CardHeader>
              <CardTitle className="font-heading text-lg">Daftar FAQ</CardTitle>
              <CardDescription>{filteredFaqs.length} item ditemukan.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {filteredFaqs.map((faq) => (
                <div key={faq.id} className="rounded-lg border bg-background p-3 transition-colors hover:bg-muted/10">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0 space-y-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <p className="line-clamp-1 font-heading text-xs font-semibold">{faq.question}</p>
                        {!faq.is_active ? (
                          <Badge variant="outline" className="gap-1 text-[10px]">
                            <EyeOff className="h-3 w-3" /> Nonaktif
                          </Badge>
                        ) : null}
                      </div>
                      <p className="line-clamp-2 font-sans text-[10px] text-muted-foreground">{faq.answer}</p>
                    </div>
                    <div className="flex shrink-0 gap-1">
                      <Button size="icon-sm" variant="ghost" onClick={() => openEditDialog(faq)} title="Edit">
                        <Edit3 className="h-3.5 w-3.5 text-primary" />
                      </Button>
                      <Button
                        size="icon-sm"
                        variant="ghost"
                        className="text-red-500 hover:text-red-600"
                        onClick={() => handleDelete(faq.id)}
                        disabled={isPending && pendingId === faq.id}
                        title="Hapus"
                      >
                        {isPending && pendingId === faq.id ? (
                          <Loader2 className="h-3.5 w-3.5 animate-spin" />
                        ) : (
                          <Trash2 className="h-3.5 w-3.5" />
                        )}
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </main>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogFormContent
          className="sm:max-w-[500px]"
          title={form.id ? "Sunting FAQ" : "Tambah FAQ"}
          description="Data disimpan ke tabel `faqs` di Supabase."
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
            <Label htmlFor="faq-question">Pertanyaan</Label>
            <Input
              id="faq-question"
              value={form.question}
              onChange={(event) => setForm((current) => ({ ...current, question: event.target.value }))}
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="faq-answer">Jawaban</Label>
            <textarea
              id="faq-answer"
              rows={5}
              className="flex min-h-[96px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
              value={form.answer}
              onChange={(event) => setForm((current) => ({ ...current, answer: event.target.value }))}
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="faq-sort">Urutan</Label>
              <Input
                id="faq-sort"
                type="number"
                min={0}
                value={form.sortOrder}
                onChange={(event) => setForm((current) => ({ ...current, sortOrder: Number(event.target.value) }))}
              />
            </div>
            <label className="flex items-end gap-2 pb-2 text-sm">
              <input
                type="checkbox"
                checked={form.isActive}
                onChange={(event) => setForm((current) => ({ ...current, isActive: event.target.checked }))}
              />
              Aktif di landing page
            </label>
          </div>
        </DialogFormContent>
      </Dialog>
    </div>
  )
}
