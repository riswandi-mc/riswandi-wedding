"use client";

import {
  useDeferredValue,
  useMemo,
  useRef,
  useState,
  useTransition,
} from "react";
import Image from "next/image";
import {
  Edit3,
  EyeOff,
  Loader2,
  Plus,
  Search,
  Star,
  Trash2,
  UserRound,
} from "lucide-react";

import {
  createAdminTestimonial,
  deleteAdminTestimonial,
  updateAdminTestimonial,
} from "@/app/actions/admin";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogFooter,
  DialogFormContent,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/ui/sidebar";
import type { AdminTestimonial } from "@/lib/data/admin";
import { resolvePublicStorageUrl } from "@/lib/storage-url";

type TestimonialFormState = {
  id: string;
  clientName: string;
  eventType: string;
  quote: string;
  rating: number;
  photoUrl: string;
  sortOrder: number;
  isVerified: boolean;
  isActive: boolean;
};

const emptyForm: TestimonialFormState = {
  id: "",
  clientName: "",
  eventType: "",
  quote: "",
  rating: 5,
  photoUrl: "",
  sortOrder: 0,
  isVerified: true,
  isActive: true,
};

function getInitials(value: string) {
  return value
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");
}

function renderStars(rating: number) {
  return Array.from({ length: 5 }).map((_, index) => (
    <Star
      key={index}
      className={`h-4 w-4 ${index < rating ? "fill-amber-400 text-amber-400" : "text-white/25"}`}
    />
  ));
}

export function TestimonialManager({
  initialTestimonials,
}: {
  initialTestimonials: AdminTestimonial[];
}) {
  const [testimonials, setTestimonials] = useState(initialTestimonials);
  const [searchTerm, setSearchTerm] = useState("");
  const deferredSearchTerm = useDeferredValue(searchTerm);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [formError, setFormError] = useState<string | null>(null);
  const [pendingId, setPendingId] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const photoFileInputRef = useRef<HTMLInputElement | null>(null);

  const summary = useMemo(() => {
    const total = testimonials.length;
    const active = testimonials.filter(
      (testimonial) => testimonial.is_active,
    ).length;
    const verified = testimonials.filter(
      (testimonial) => testimonial.is_verified,
    ).length;
    const averageRating = total
      ? testimonials.reduce((sum, testimonial) => sum + testimonial.rating, 0) /
        total
      : 0;

    return {
      total,
      active,
      verified,
      averageRating,
    };
  }, [testimonials]);

  const filteredTestimonials = testimonials.filter((testimonial) => {
    const query = deferredSearchTerm.trim().toLowerCase();

    return (
      query.length === 0 ||
      testimonial.client_name.toLowerCase().includes(query) ||
      (testimonial.event_type ?? "").toLowerCase().includes(query) ||
      testimonial.quote.toLowerCase().includes(query)
    );
  });

  const previewTestimonials = filteredTestimonials
    .filter((testimonial) => testimonial.is_active)
    .slice(0, 4);
  const formPhotoSrc = resolvePublicStorageUrl("gallery", form.photoUrl);

  const openCreateDialog = () => {
    setForm({
      ...emptyForm,
      sortOrder: testimonials.length + 1,
    });
    setFormError(null);
    if (photoFileInputRef.current) {
      photoFileInputRef.current.value = "";
    }
    setIsDialogOpen(true);
  };

  const openEditDialog = (testimonial: AdminTestimonial) => {
    setForm({
      id: testimonial.id,
      clientName: testimonial.client_name,
      eventType: testimonial.event_type ?? "",
      quote: testimonial.quote,
      rating: testimonial.rating,
      photoUrl: testimonial.photo_url ?? "",
      sortOrder: testimonial.sort_order,
      isVerified: testimonial.is_verified,
      isActive: testimonial.is_active,
    });
    setFormError(null);
    if (photoFileInputRef.current) {
      photoFileInputRef.current.value = "";
    }
    setIsDialogOpen(true);
  };

  const handleSubmit = () => {
    setFormError(null);

    startTransition(async () => {
      const formData = new FormData();

      if (form.id) {
        formData.set("id", form.id);
      }

      formData.set("clientName", form.clientName);
      formData.set("eventType", form.eventType);
      formData.set("quote", form.quote);
      formData.set("rating", String(form.rating));
      formData.set("photoUrl", form.photoUrl);
      formData.set("sortOrder", String(form.sortOrder));
      formData.set("isVerified", String(form.isVerified));
      formData.set("isActive", String(form.isActive));

      const photoFile = photoFileInputRef.current?.files?.[0];
      if (photoFile) {
        formData.set("photoFile", photoFile);
      }

      const result = form.id
        ? await updateAdminTestimonial(formData)
        : await createAdminTestimonial(formData);

      if (!result.ok) {
        setFormError(result.error);
        return;
      }

      setTestimonials((current) =>
        form.id
          ? current.map((testimonial) =>
              testimonial.id === result.testimonial.id
                ? result.testimonial
                : testimonial,
            )
          : [result.testimonial, ...current],
      );
      setIsDialogOpen(false);
      setForm(emptyForm);
      if (photoFileInputRef.current) {
        photoFileInputRef.current.value = "";
      }
    });
  };

  const handleDelete = (id: string) => {
    if (!window.confirm("Apakah Anda yakin ingin menghapus testimoni ini?")) {
      return;
    }

    setPendingId(id);
    startTransition(async () => {
      const result = await deleteAdminTestimonial({ id });
      setPendingId(null);

      if (!result.ok) {
        alert(result.error);
        return;
      }

      setTestimonials((current) =>
        current.filter((testimonial) => testimonial.id !== id),
      );
    });
  };

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
                <BreadcrumbPage>Testimoni</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
      </header>

      <main className="flex-1 space-y-6 bg-muted/20 p-6">
        <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <h1 className="font-heading text-2xl font-bold text-primary">
              Kelola Testimoni
            </h1>
            <p className="font-sans text-sm text-muted-foreground">
              CRUD testimoni dari Supabase. Item aktif langsung tampil di
              section `#testimoni`.
            </p>
          </div>
          <Button onClick={openCreateDialog} className="gap-2 shadow-sm">
            <Plus className="h-4 w-4" /> Tambah Testimoni
          </Button>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <Card className="shadow-sm">
            <CardContent className="py-5">
              <div className="text-sm font-medium text-muted-foreground">
                Total Testimoni
              </div>
              <div className="mt-1 text-2xl font-bold">{summary.total}</div>
              <p className="text-xs text-muted-foreground">
                Semua item di tabel `testimonials`
              </p>
            </CardContent>
          </Card>
          <Card className="shadow-sm">
            <CardContent className="py-5">
              <div className="text-sm font-medium text-muted-foreground">
                Aktif
              </div>
              <div className="mt-1 text-2xl font-bold">{summary.active}</div>
              <p className="text-xs text-muted-foreground">
                Tampil di landing page
              </p>
            </CardContent>
          </Card>
          <Card className="shadow-sm">
            <CardContent className="py-5">
              <div className="text-sm font-medium text-muted-foreground">
                Verified
              </div>
              <div className="mt-1 text-2xl font-bold">{summary.verified}</div>
              <p className="text-xs text-muted-foreground">
                Menandai testimoni yang terverifikasi
              </p>
            </CardContent>
          </Card>
          <Card className="shadow-sm">
            <CardContent className="py-5">
              <div className="text-sm font-medium text-muted-foreground">
                Rata-rata Rating
              </div>
              <div className="mt-1 text-2xl font-bold">
                {summary.averageRating.toFixed(1)} / 5.0
              </div>
              <p className="text-xs text-muted-foreground">
                Berdasarkan seluruh testimoni
              </p>
            </CardContent>
          </Card>
        </div>

        <Card className="shadow-sm">
          <CardContent className="flex gap-4 p-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Cari nama, tipe acara, atau kutipan..."
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
              <CardTitle className="font-heading text-lg">
                Pratinjau Landing Page
              </CardTitle>
              <CardDescription>
                Hanya testimoni aktif yang tampil ke pengunjung.
              </CardDescription>
            </CardHeader>
            <CardContent>
              {previewTestimonials.length > 0 ? (
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  {previewTestimonials.map((testimonial) => (
                    <Card
                      key={testimonial.id}
                      className="border-none bg-primary/95 text-primary-foreground shadow-md"
                    >
                      <CardHeader className="pb-4">
                        <div className="mb-3 flex gap-1">
                          {renderStars(testimonial.rating)}
                        </div>
                        <div className="flex items-center gap-3">
                          <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-full border border-white/15 bg-white/10">
                            {testimonial.photo_url ? (
                              <Image
                                src={
                                  resolvePublicStorageUrl(
                                    "gallery",
                                    testimonial.photo_url,
                                  ) ?? testimonial.photo_url
                                }
                                alt={testimonial.client_name}
                                fill
                                sizes="64px"
                                className="object-cover"
                              />
                            ) : (
                              <div className="flex h-full w-full items-center justify-center text-xs font-semibold">
                                {getInitials(testimonial.client_name) || (
                                  <UserRound className="h-5 w-5" />
                                )}
                              </div>
                            )}
                          </div>
                          <div className="min-w-0">
                            <CardTitle className="font-heading text-xl">
                              {testimonial.client_name}
                            </CardTitle>
                            <CardDescription className="mt-1 flex flex-wrap items-center gap-2 text-primary-foreground/75">
                              <span>{testimonial.event_type ?? "Klien"}</span>
                              {testimonial.is_verified ? (
                                <Badge className="h-5 border-none bg-white/10 px-2 py-0 text-[10px] font-normal uppercase tracking-wider text-white hover:bg-white/10">
                                  Verified
                                </Badge>
                              ) : null}
                              {testimonial.photo_url ? (
                                <Badge className="h-5 border-none bg-white/10 px-2 py-0 text-[10px] font-normal uppercase tracking-wider text-white hover:bg-white/10">
                                  Foto tersimpan
                                </Badge>
                              ) : null}
                            </CardDescription>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent className="flex flex-1 items-start">
                        <p className="leading-relaxed text-primary-foreground/90 italic">
                          &ldquo;{testimonial.quote}&rdquo;
                        </p>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <p className="py-8 text-center font-sans text-sm text-muted-foreground">
                  Belum ada testimoni aktif.
                </p>
              )}
            </CardContent>
          </Card>

          <Card className="shadow-sm">
            <CardHeader>
              <CardTitle className="font-heading text-lg">
                Daftar Testimoni
              </CardTitle>
              <CardDescription>
                {filteredTestimonials.length} item ditemukan.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {filteredTestimonials.map((testimonial) => (
                <div
                  key={testimonial.id}
                  className="rounded-lg border bg-background p-3 transition-colors hover:bg-muted/10"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0 space-y-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <p className="line-clamp-1 font-heading text-xs font-semibold">
                          {testimonial.client_name}
                        </p>
                        {!testimonial.is_active ? (
                          <Badge
                            variant="outline"
                            className="gap-1 text-[10px]"
                          >
                            <EyeOff className="h-3 w-3" /> Nonaktif
                          </Badge>
                        ) : null}
                        {testimonial.is_verified ? (
                          <Badge className="border-none bg-emerald-100 px-2 py-0 text-[10px] font-normal text-emerald-800 hover:bg-emerald-100">
                            Verified
                          </Badge>
                        ) : null}
                      </div>
                      <p className="line-clamp-1 font-sans text-[10px] text-muted-foreground">
                        {testimonial.event_type ?? "Klien"} - Rating{" "}
                        {testimonial.rating}/5
                      </p>
                      <p className="line-clamp-2 font-sans text-[10px] text-muted-foreground">
                        {testimonial.quote}
                      </p>
                    </div>
                    <div className="flex shrink-0 gap-1">
                      <Button
                        size="icon-sm"
                        variant="ghost"
                        onClick={() => openEditDialog(testimonial)}
                        title="Edit"
                      >
                        <Edit3 className="h-3.5 w-3.5 text-primary" />
                      </Button>
                      <Button
                        size="icon-sm"
                        variant="ghost"
                        className="text-red-500 hover:text-red-600"
                        onClick={() => handleDelete(testimonial.id)}
                        disabled={isPending && pendingId === testimonial.id}
                        title="Hapus"
                      >
                        {isPending && pendingId === testimonial.id ? (
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
          className="sm:max-w-[560px]"
          title={form.id ? "Sunting Testimoni" : "Tambah Testimoni"}
          description="Data disimpan ke tabel `testimonials` di Supabase."
          bodyClassName="grid gap-4"
          footer={
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setIsDialogOpen(false)}
                disabled={isPending}
              >
                Batal
              </Button>
              <Button onClick={handleSubmit} disabled={isPending}>
                {isPending ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : null}
                Simpan
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
            <Label htmlFor="testimonial-name">Nama Klien</Label>
            <Input
              id="testimonial-name"
              value={form.clientName}
              onChange={(event) =>
                setForm((current) => ({
                  ...current,
                  clientName: event.target.value,
                }))
              }
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="testimonial-type">Tipe Acara</Label>
            <Input
              id="testimonial-type"
              value={form.eventType}
              onChange={(event) =>
                setForm((current) => ({
                  ...current,
                  eventType: event.target.value,
                }))
              }
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="testimonial-photo-file">
              Upload Foto Testimoni
            </Label>
            <Input
              id="testimonial-photo-file"
              type="file"
              accept="image/*"
              ref={photoFileInputRef}
            />
            <p className="text-xs text-muted-foreground">
              Upload file gambar untuk foto klien. Jika diisi, file ini akan
              dipakai dan foto lama diganti.
            </p>
          </div>
          {formPhotoSrc ? (
            <div className="overflow-hidden rounded-lg border bg-muted">
              <div className="relative aspect-[16/9] w-full">
                <Image
                  src={formPhotoSrc}
                  alt={form.clientName || "Foto testimoni"}
                  fill
                  sizes="(max-width: 768px) 100vw, 50vw"
                  className="object-cover"
                />
              </div>
            </div>
          ) : null}
          <div className="grid gap-2">
            <Label htmlFor="testimonial-photo">URL Foto Cadangan</Label>
            <Input
              id="testimonial-photo"
              value={form.photoUrl}
              onChange={(event) =>
                setForm((current) => ({
                  ...current,
                  photoUrl: event.target.value,
                }))
              }
            />
            <p className="text-xs text-muted-foreground">
              Opsional. Dipakai jika Anda belum upload file baru.
            </p>
          </div>
          <div className="grid gap-2">
            <Label htmlFor="testimonial-quote">Kutipan Testimoni</Label>
            <textarea
              id="testimonial-quote"
              rows={5}
              className="flex min-h-[112px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
              value={form.quote}
              onChange={(event) =>
                setForm((current) => ({
                  ...current,
                  quote: event.target.value,
                }))
              }
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="testimonial-rating">Rating</Label>
              <Input
                id="testimonial-rating"
                type="number"
                min={1}
                max={5}
                value={form.rating}
                onChange={(event) =>
                  setForm((current) => ({
                    ...current,
                    rating: Number(event.target.value),
                  }))
                }
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="testimonial-sort">Urutan</Label>
              <Input
                id="testimonial-sort"
                type="number"
                min={0}
                value={form.sortOrder}
                onChange={(event) =>
                  setForm((current) => ({
                    ...current,
                    sortOrder: Number(event.target.value),
                  }))
                }
              />
            </div>
          </div>
          <div className="grid gap-2 text-sm">
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={form.isActive}
                onChange={(event) =>
                  setForm((current) => ({
                    ...current,
                    isActive: event.target.checked,
                  }))
                }
              />
              Aktif di landing page
            </label>
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={form.isVerified}
                onChange={(event) =>
                  setForm((current) => ({
                    ...current,
                    isVerified: event.target.checked,
                  }))
                }
              />
              Verified
            </label>
          </div>
        </DialogFormContent>
      </Dialog>
    </div>
  );
}
