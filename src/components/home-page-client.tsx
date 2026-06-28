"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { differenceInCalendarDays, format, startOfDay } from "date-fns";
import { id as indonesianLocale } from "date-fns/locale";
import {
  ArrowRight,
  Calendar as CalendarIcon,
  Camera,
  CheckCircle,
  ExternalLink,
  Info,
  Mail,
  Menu,
  MessageCircle,
  Phone,
  Star,
  Video,
} from "lucide-react";

import {
  submitInvitationOrder,
  submitMcBooking,
} from "@/app/actions/public-booking";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import {
  Dialog,
  DialogFooter,
  DialogFormContent,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { cn } from "@/lib/utils";
import { resolvePublicStorageUrl } from "@/lib/storage-url";

type HomepageSettings = {
  brand_name: string;
  phone_whatsapp: string;
  email: string | null;
  instagram_url: string | null;
  address: string | null;
  mc_whatsapp_template: string;
  invitation_whatsapp_template: string;
} | null;

type HomepageService = {
  slug: string;
  title: string;
  badge_label: string | null;
  badge_variant: string | null;
  short_description: string;
  features: string[];
  sort_order: number;
  is_featured: boolean;
};

type HomepageTemplate = {
  slug: string;
  name: string;
  theme: string | null;
  original_price: number;
  promo_price: number;
  demo_url: string | null;
  preview_image_url: string | null;
  img_sig: number | null;
  min_order_days: number;
  sort_order: number;
  is_demo_ready: boolean;
};

type HomepageGalleryItem = {
  id: string;
  title: string;
  category: string;
  media_type: "image" | "video";
  media_url: string;
  thumbnail_url: string | null;
  sort_order: number;
  is_featured: boolean;
};

type HomepageFaq = {
  id: string;
  question: string;
  answer: string;
  sort_order: number;
};

type HomepageTestimonial = {
  id: string;
  client_name: string;
  event_type: string | null;
  quote: string;
  rating: number;
  photo_url: string | null;
  is_verified: boolean;
  sort_order: number;
};

type HomePageClientProps = {
  data: {
    settings: HomepageSettings;
    services: HomepageService[];
    templates: HomepageTemplate[];
    gallery: HomepageGalleryItem[];
    faqs: HomepageFaq[];
    testimonials: HomepageTestimonial[];
  };
};

type McFormState = {
  clientName: string;
  phone: string;
  eventDate: Date | undefined;
  serviceName: string;
  eventLocation: string;
  notes: string;
};

type InvitationFormState = {
  coupleName: string;
  phone: string;
  eventDate: Date | undefined;
  targetCompletionDate: Date | undefined;
  eventLocation: string;
  templateName: string;
  notes: string;
};

type ConfirmationState = {
  title: string;
  description: string;
  whatsappMessage: string;
};

const FALLBACK_BRAND = "Riswandi Wedding";
const FALLBACK_WHATSAPP = "6287737860657";
const FALLBACK_INSTAGRAM = "https://www.instagram.com/mriswandiwedding__/";

const emptyMcForm: McFormState = {
  clientName: "",
  phone: "",
  eventDate: undefined,
  serviceName: "",
  eventLocation: "",
  notes: "",
};

const emptyInvitationForm: InvitationFormState = {
  coupleName: "",
  phone: "",
  eventDate: undefined,
  targetCompletionDate: undefined,
  eventLocation: "",
  templateName: "",
  notes: "",
};

function formatCurrency(value: number) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(value);
}

function toIsoDate(date: Date) {
  return format(date, "yyyy-MM-dd");
}

function toDisplayDate(date: Date) {
  return format(date, "dd MMMM yyyy", { locale: indonesianLocale });
}

function normalizeWhatsAppNumber(value: string) {
  return value.replace(/\D/g, "");
}

function buildWhatsAppUrl(phone: string, text: string) {
  return `https://wa.me/${normalizeWhatsAppNumber(phone)}?text=${encodeURIComponent(text)}`;
}

function getConsultationMessage() {
  return "Halo Kak Riswandi! Saya ingin konsultasi seputar layanan MC dan undangan digital.";
}

function getGeneralQuestionMessage() {
  return "Halo Kak Riswandi! Saya ingin bertanya seputar layanan yang tersedia.";
}

function getInstagramLabel(instagramUrl: string | null) {
  if (!instagramUrl) {
    return "@mriswandiwedding__";
  }

  const match = instagramUrl.match(/instagram\.com\/([^/?#]+)/i);
  return match ? `@${match[1]}` : "@mriswandiwedding__";
}

function getServiceBadgeClass(variant: string | null) {
  switch (variant) {
    case "popular":
      return "bg-primary/10 text-primary border-primary/20";
    case "best_value":
      return "bg-amber-500/10 text-amber-700 border-amber-300";
    case "exclusive":
      return "bg-slate-900/10 text-slate-700 border-slate-300";
    default:
      return "bg-primary/10 text-primary border-primary/20";
  }
}

function getTemplatePreview(template: HomepageTemplate) {
  return resolvePublicStorageUrl(
    "invitation-template",
    template.preview_image_url,
  );
}

function getGalleryPreview(item: HomepageGalleryItem) {
  return item.thumbnail_url ?? item.media_url;
}

export default function HomePageClient({ data }: HomePageClientProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isMCOpen, setIsMCOpen] = useState(false);
  const [isUndanganOpen, setIsUndanganOpen] = useState(false);
  const [confirmation, setConfirmation] = useState<ConfirmationState | null>(
    null,
  );

  const [mcForm, setMcForm] = useState<McFormState>(emptyMcForm);
  const [invitationForm, setInvitationForm] =
    useState<InvitationFormState>(emptyInvitationForm);

  const [isMCSubmitting, setIsMCSubmitting] = useState(false);
  const [isInvitationSubmitting, setIsInvitationSubmitting] = useState(false);
  const [mcError, setMcError] = useState<string | null>(null);
  const [invitationError, setInvitationError] = useState<string | null>(null);

  const [mcDateOpen, setMcDateOpen] = useState(false);
  const [invitationDateOpen, setInvitationDateOpen] = useState(false);
  const [invitationTargetDateOpen, setInvitationTargetDateOpen] =
    useState(false);

  const brandName = data.settings?.brand_name ?? FALLBACK_BRAND;
  const waNumber = data.settings?.phone_whatsapp ?? FALLBACK_WHATSAPP;
  const email = data.settings?.email;
  const instagramUrl = data.settings?.instagram_url ?? FALLBACK_INSTAGRAM;
  const address = data.settings?.address;

  const openMcDialog = (serviceName = "") => {
    setMcError(null);
    setMcForm({
      ...emptyMcForm,
      serviceName,
    });
    setIsMCOpen(true);
  };

  const openInvitationDialog = (templateName = "") => {
    setInvitationError(null);
    setInvitationForm({
      ...emptyInvitationForm,
      templateName,
    });
    setIsUndanganOpen(true);
  };

  const handleMcSubmit = async () => {
    if (
      !mcForm.clientName ||
      !mcForm.phone ||
      !mcForm.eventDate ||
      !mcForm.serviceName
    ) {
      setMcError(
        "Mohon lengkapi nama, nomor WhatsApp, tanggal acara, dan layanan.",
      );
      return;
    }

    setIsMCSubmitting(true);
    setMcError(null);

    const result = await submitMcBooking({
      clientName: mcForm.clientName,
      phone: mcForm.phone,
      eventDate: toIsoDate(mcForm.eventDate),
      serviceName: mcForm.serviceName,
      eventLocation: mcForm.eventLocation,
      notes: mcForm.notes,
    });

    setIsMCSubmitting(false);

    if (!result.ok) {
      setMcError(result.error);
      return;
    }

    setIsMCOpen(false);
    setMcForm(emptyMcForm);
    setConfirmation({
      title: "Booking Berhasil Dicatat",
      description:
        "Data booking Anda sudah tersimpan. Lanjutkan ke WhatsApp agar tim kami bisa segera melakukan follow up.",
      whatsappMessage: result.whatsappMessage,
    });
  };

  const handleInvitationSubmit = async () => {
    if (
      !invitationForm.coupleName ||
      !invitationForm.phone ||
      !invitationForm.eventDate ||
      !invitationForm.eventLocation ||
      !invitationForm.templateName
    ) {
      setInvitationError("Mohon lengkapi semua data wajib terlebih dahulu.");
      return;
    }

    const selectedTemplate = data.templates.find(
      (template) => template.name === invitationForm.templateName,
    );
    const minOrderDays = selectedTemplate?.min_order_days ?? 7;
    const eventDistance = differenceInCalendarDays(
      startOfDay(invitationForm.eventDate),
      startOfDay(new Date()),
    );

    if (eventDistance < minOrderDays) {
      setInvitationError(
        `Pemesanan undangan minimal ${minOrderDays} hari sebelum tanggal acara.`,
      );
      return;
    }

    setIsInvitationSubmitting(true);
    setInvitationError(null);

    const result = await submitInvitationOrder({
      coupleName: invitationForm.coupleName,
      phone: invitationForm.phone,
      eventDate: toIsoDate(invitationForm.eventDate),
      targetCompletionDate: invitationForm.targetCompletionDate
        ? toIsoDate(invitationForm.targetCompletionDate)
        : undefined,
      eventLocation: invitationForm.eventLocation,
      templateName: invitationForm.templateName,
      notes: invitationForm.notes,
    });

    setIsInvitationSubmitting(false);

    if (!result.ok) {
      setInvitationError(result.error);
      return;
    }

    setIsUndanganOpen(false);
    setInvitationForm(emptyInvitationForm);
    setConfirmation({
      title: "Pesanan Berhasil Dicatat",
      description:
        "Data pesanan undangan Anda sudah tersimpan. Lanjutkan ke WhatsApp untuk konfirmasi langsung dengan admin.",
      whatsappMessage: result.whatsappMessage,
    });
  };

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <div className="flex items-center gap-2">
            <span className="font-heading text-xl font-bold tracking-tight">
              {brandName}
            </span>
          </div>

          <nav className="hidden gap-6 text-sm font-medium md:flex">
            <a href="#layanan" className="transition-colors hover:text-primary">
              Layanan
            </a>
            <a
              href="#undangan"
              className="transition-colors hover:text-primary"
            >
              Undangan
            </a>
            <a
              href="#testimoni"
              className="transition-colors hover:text-primary"
            >
              Testimoni
            </a>
            <a href="#galeri" className="transition-colors hover:text-primary">
              Galeri
            </a>
            <a href="#faq" className="transition-colors hover:text-primary">
              FAQ
            </a>
          </nav>

          <div className="flex items-center gap-2">
            <Button asChild size="sm" className="hidden sm:inline-flex">
              <a
                href={buildWhatsAppUrl(waNumber, getConsultationMessage())}
                target="_blank"
                rel="noopener noreferrer"
              >
                Hubungi Kami
              </a>
            </Button>

            <Sheet open={isMenuOpen} onOpenChange={setIsMenuOpen}>
              <SheetTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="md:hidden"
                  aria-label="Menu Utama"
                >
                  <Menu className="h-6 w-6" />
                </Button>
              </SheetTrigger>
              <SheetContent
                side="right"
                className="flex w-[300px] flex-col justify-between bg-background p-6 sm:w-[380px]"
              >
                <div className="space-y-6">
                  <SheetHeader className="border-b px-0 pb-4 text-left">
                    <SheetTitle className="font-heading text-xl font-bold">
                      {brandName}
                    </SheetTitle>
                  </SheetHeader>
                  <nav className="flex flex-col gap-4 text-base font-medium">
                    <a
                      href="#layanan"
                      onClick={() => setIsMenuOpen(false)}
                      className="border-b border-border/40 py-2 transition-colors hover:text-primary"
                    >
                      Layanan
                    </a>
                    <a
                      href="#undangan"
                      onClick={() => setIsMenuOpen(false)}
                      className="border-b border-border/40 py-2 transition-colors hover:text-primary"
                    >
                      Undangan
                    </a>
                    <a
                      href="#testimoni"
                      onClick={() => setIsMenuOpen(false)}
                      className="border-b border-border/40 py-2 transition-colors hover:text-primary"
                    >
                      Testimoni
                    </a>
                    <a
                      href="#galeri"
                      onClick={() => setIsMenuOpen(false)}
                      className="border-b border-border/40 py-2 transition-colors hover:text-primary"
                    >
                      Galeri
                    </a>
                    <a
                      href="#faq"
                      onClick={() => setIsMenuOpen(false)}
                      className="py-2 transition-colors hover:text-primary"
                    >
                      FAQ
                    </a>
                  </nav>
                </div>
                <div className="mt-auto border-t border-border pt-6">
                  <Button asChild className="w-full" size="lg">
                    <a
                      href={buildWhatsAppUrl(
                        waNumber,
                        getConsultationMessage(),
                      )}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Hubungi Kami via WA
                    </a>
                  </Button>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </header>

      <main className="flex-1">
        <section className="relative flex h-[80vh] w-full items-center justify-center overflow-hidden bg-muted">
          <div className="absolute inset-0 z-0">
            <Image
              src="https://images.unsplash.com/photo-1519225421980-715cb0215aed?q=80&w=2070&auto=format&fit=crop"
              alt="Wedding Event"
              fill
              className="object-cover brightness-50"
              priority
            />
          </div>
          <div className="relative z-10 container flex flex-col items-center space-y-6 px-4 text-center text-white">
            <Badge
              variant="secondary"
              className="border-none bg-white/20 px-4 py-1.5 text-white backdrop-blur hover:bg-white/30"
            >
              Spesialis Acara Pernikahan dan Formal
            </Badge>
            <h1 className="max-w-4xl font-heading text-3xl font-bold leading-[1.1] text-shadow-sm sm:text-5xl md:text-6xl lg:text-7xl">
              MC Profesional untuk Momen Tak Terlupakan
            </h1>
            <p className="max-w-2xl text-lg text-gray-100 text-shadow-sm md:text-xl">
              Menghidupkan suasana acara Anda dari awal hingga akhir dengan
              profesionalisme dan kehangatan.
            </p>
            <div className="flex flex-col gap-4 pt-6 sm:flex-row">
              <Button asChild size="lg" className="h-12 px-8 text-base">
                <a href="#layanan">Lihat Layanan</a>
              </Button>
              <Button
                variant="outline"
                size="lg"
                onClick={() => openMcDialog()}
                className="h-12 border-white/50 bg-black/20 px-8 text-base text-white backdrop-blur hover:bg-white hover:text-black"
              >
                Booking Sekarang
              </Button>
            </div>
          </div>
        </section>

        <section
          id="layanan"
          className="container mx-auto scroll-mt-16 px-4 py-16 md:py-24"
        >
          <div className="mb-16 space-y-4 text-center">
            <h2 className="font-heading text-3xl font-bold text-primary md:text-4xl">
              Layanan MC
            </h2>
            <p className="mx-auto max-w-2xl text-muted-foreground">
              Beragam pilihan paket Master of Ceremony yang dapat disesuaikan
              dengan kebutuhan acara Anda.
            </p>
          </div>

          {data.services.length > 0 ? (
            <div className="space-y-10">
              <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
                {data.services.slice(0, 3).map((service) => (
                  <Card
                    key={service.slug}
                    className={cn(
                      "flex flex-col transition-colors shadow-sm hover:border-primary hover:shadow-md",
                      service.is_featured
                        ? "relative overflow-hidden border-primary/40 shadow-md"
                        : "border-primary/20",
                    )}
                  >
                    {service.badge_variant === "best_value" ? (
                      <div className="absolute top-0 right-0 z-10 rounded-bl-lg bg-primary px-4 py-1 text-xs font-bold uppercase tracking-wider text-primary-foreground shadow-sm">
                        Best Value
                      </div>
                    ) : null}
                    <CardHeader>
                      {service.badge_label ? (
                        <div className="mb-2 flex justify-between">
                          <Badge
                            variant="outline"
                            className={getServiceBadgeClass(
                              service.badge_variant,
                            )}
                          >
                            {service.badge_label}
                          </Badge>
                        </div>
                      ) : null}
                      <CardTitle className="font-heading text-2xl">
                        {service.title}
                      </CardTitle>
                      <CardDescription>
                        {service.short_description}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="flex-1">
                      <ul className="space-y-3 text-sm text-muted-foreground">
                        {service.features.map((feature) => (
                          <li key={feature} className="flex items-start gap-2">
                            <CheckCircle className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                            <span>{feature}</span>
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                    <CardFooter>
                      <Button
                        className="w-full"
                        onClick={() => openMcDialog(service.title)}
                      >
                        Booking Sekarang
                      </Button>
                    </CardFooter>
                  </Card>
                ))}
              </div>
              {data.services.length > 3 ? (
                <div className="text-center">
                  <Button variant="outline" size="lg" asChild>
                    <Link
                      href="/layanan-mc"
                      className="inline-flex items-center gap-2"
                    >
                      Lihat Semua Layanan MC
                      <ArrowRight className="h-4 w-4" />
                    </Link>
                  </Button>
                </div>
              ) : null}
            </div>
          ) : (
            <div className="rounded-2xl border border-dashed border-border p-10 text-center text-muted-foreground">
              Data layanan belum tersedia saat ini.
            </div>
          )}
        </section>

        <section
          id="undangan"
          className="w-full scroll-mt-16 bg-muted/40 py-16 md:py-24"
        >
          <div className="container mx-auto px-4">
            <div className="mb-16 space-y-4 text-center">
              <Badge className="mb-2" variant="outline">
                Koleksi Template Premium
              </Badge>
              <h2 className="font-heading text-3xl font-bold text-primary md:text-4xl">
                Undangan Digital
              </h2>
              <p className="mx-auto max-w-2xl text-muted-foreground">
                Sebarkan momen kebahagiaan Anda dengan mudah, elegan, dan ramah
                lingkungan.
              </p>
              <div className="mx-auto mt-4 inline-flex items-center justify-center gap-2 rounded-full border border-amber-200 bg-amber-100/50 px-5 py-2.5 text-sm font-medium text-amber-700">
                <Info className="h-4 w-4" />
                <span>Pemesanan minimal 7 hari sebelum tanggal acara</span>
              </div>
            </div>

            {data.templates.length > 0 ? (
              <div className="mb-12 grid grid-cols-2 gap-3 md:gap-6 lg:grid-cols-4">
                {data.templates.map((template, index) => {
                  const previewSrc = getTemplatePreview(template);

                  return (
                    <Card
                      key={template.slug}
                      className="group flex flex-col overflow-hidden border bg-background shadow-sm transition-all duration-300 hover:shadow-lg"
                    >
                      <div className="relative aspect-[3/4] overflow-hidden bg-muted">
                        {previewSrc ? (
                          <Image
                            src={previewSrc}
                            alt={`${template.name} preview`}
                            fill
                            sizes="(max-width: 768px) 50vw, (max-width: 1280px) 25vw, 20vw"
                            priority={index < 2}
                            className="object-cover transition-transform duration-700 group-hover:scale-110"
                          />
                        ) : (
                          <div className="flex h-full w-full items-center justify-center px-4 text-center text-xs text-muted-foreground">
                            Preview belum tersedia
                          </div>
                        )}
                      </div>
                      <CardContent className="flex flex-1 flex-col items-start gap-1 p-3 md:p-4">
                        <span className="line-clamp-2 font-heading text-xs font-semibold md:text-[15px]">
                          {template.name}
                        </span>
                        <div className="flex items-center gap-1.5">
                          <span className="text-[10px] text-muted-foreground line-through md:text-xs">
                            {formatCurrency(template.original_price)}
                          </span>
                          <span className="text-xs font-bold text-primary md:text-sm">
                            {formatCurrency(template.promo_price)}
                          </span>
                        </div>
                      </CardContent>
                      <CardFooter className="grid w-full grid-cols-2 gap-1.5 p-3 pt-0 md:gap-2 md:p-4 md:pt-0">
                        {template.is_demo_ready && template.demo_url ? (
                          <Button
                            variant="outline"
                            className="w-full px-0 text-[10px] md:text-xs"
                            asChild
                          >
                            <a
                              href={template.demo_url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex items-center justify-center"
                            >
                              Demo{" "}
                              <ExternalLink className="ml-1 h-2.5 w-2.5 shrink-0 md:h-3 md:w-3" />
                            </a>
                          </Button>
                        ) : (
                          <Button
                            variant="outline"
                            className="w-full text-[10px] opacity-70 md:text-xs"
                            disabled
                          >
                            Proses
                          </Button>
                        )}
                        <Button
                          className="w-full text-[10px] md:text-xs"
                          onClick={() => openInvitationDialog(template.name)}
                        >
                          Pesan
                        </Button>
                      </CardFooter>
                    </Card>
                  );
                })}
              </div>
            ) : (
              <div className="rounded-2xl border border-dashed border-border bg-background p-10 text-center text-muted-foreground">
                Template undangan belum tersedia saat ini.
              </div>
            )}

            <div className="mt-12 text-center">
              <Button
                size="lg"
                className="h-14 px-10 text-lg shadow-lg transition-transform hover:scale-105"
                onClick={() => openInvitationDialog()}
              >
                Pesan Undangan Sekarang
              </Button>
            </div>
          </div>
        </section>

        <section className="container mx-auto px-4 py-16 md:py-24">
          <div className="mb-16 space-y-4 text-center">
            <h2 className="font-heading text-3xl font-bold text-primary md:text-4xl">
              Cara Memesan
            </h2>
            <p className="text-muted-foreground">
              Proses booking mudah, cepat, dan transparan.
            </p>
          </div>

          <div className="relative mx-auto grid max-w-4xl grid-cols-1 gap-8 md:grid-cols-3">
            <div className="absolute top-[4.5rem] left-[16%] right-[16%] -z-10 hidden h-0.5 bg-border md:block" />

            <div className="flex flex-col items-center space-y-5 bg-background p-6 text-center">
              <div className="flex h-24 w-24 items-center justify-center rounded-full border border-primary/20 bg-primary/5 shadow-sm">
                <CalendarIcon className="h-10 w-10 text-primary" />
              </div>
              <div className="space-y-2">
                <h3 className="font-heading text-xl font-bold">
                  1. Pilih Layanan
                </h3>
                <p className="text-sm leading-relaxed text-muted-foreground">
                  Pilih paket MC atau template undangan digital yang Anda
                  inginkan dan klik tombol pesan.
                </p>
              </div>
            </div>

            <div className="flex flex-col items-center space-y-5 bg-background p-6 text-center">
              <div className="flex h-24 w-24 items-center justify-center rounded-full border border-primary/20 bg-primary/5 shadow-sm">
                <MessageCircle className="h-10 w-10 text-primary" />
              </div>
              <div className="space-y-2">
                <h3 className="font-heading text-xl font-bold">
                  2. Isi Form dan Chat WA
                </h3>
                <p className="text-sm leading-relaxed text-muted-foreground">
                  Isi formulir singkat yang disediakan, lalu Anda akan diarahkan
                  ke WhatsApp untuk konfirmasi.
                </p>
              </div>
            </div>

            <div className="flex flex-col items-center space-y-5 bg-background p-6 text-center">
              <div className="flex h-24 w-24 items-center justify-center rounded-full border border-primary/20 bg-primary/5 shadow-sm">
                <CheckCircle className="h-10 w-10 text-primary" />
              </div>
              <div className="space-y-2">
                <h3 className="font-heading text-xl font-bold">
                  3. Konfirmasi dan Deal
                </h3>
                <p className="text-sm leading-relaxed text-muted-foreground">
                  Tim kami akan follow up. Setelah DP dikonfirmasi, jadwal atau
                  pesanan Anda kami proses.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section
          id="testimoni"
          className="scroll-mt-16 bg-primary py-16 text-primary-foreground md:py-24"
        >
          <div className="container mx-auto px-4">
            <div className="mb-16 space-y-4 text-center">
              <h2 className="font-heading text-3xl font-bold text-white md:text-4xl">
                Apa Kata Klien Kami
              </h2>
              <p className="mx-auto max-w-2xl text-primary-foreground/80">
                Kepuasan Anda adalah prioritas utama kami dalam setiap acara.
              </p>
            </div>

            {data.testimonials.length > 0 ? (
              <Carousel
                className="mx-auto w-full max-w-5xl"
                opts={{ loop: true }}
              >
                <CarouselContent className="-ml-2 md:-ml-4">
                  {data.testimonials.map((testimonial) => (
                    <CarouselItem
                      key={testimonial.id}
                      className="basis-full pl-2 md:basis-1/2 md:pl-4 lg:basis-1/3"
                    >
                      <div className="h-full p-1">
                        <Card className="flex h-full flex-col border-none bg-white/10 text-white shadow-md backdrop-blur-md transition-colors hover:bg-white/15">
                          <CardHeader className="pb-4">
                            <div className="mb-3 flex gap-1">
                              {Array.from({ length: 5 }).map((_, index) => (
                                <Star
                                  key={`${testimonial.id}-${index}`}
                                  className={cn(
                                    "h-4 w-4",
                                    index < testimonial.rating
                                      ? "fill-amber-400 text-amber-400"
                                      : "text-white/30",
                                  )}
                                />
                              ))}
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
                                    className="object-cover"
                                  />
                                ) : (
                                  <div className="flex h-full w-full items-center justify-center text-sm font-semibold">
                                    {testimonial.client_name
                                      .trim()
                                      .split(/\s+/)
                                      .filter(Boolean)
                                      .slice(0, 2)
                                      .map(
                                        (part) => part[0]?.toUpperCase() ?? "",
                                      )
                                      .join("")}
                                  </div>
                                )}
                              </div>
                              <div>
                                <CardTitle className="font-heading text-xl">
                                  {testimonial.client_name}
                                </CardTitle>
                                <CardDescription className="mt-1 flex items-center gap-2 text-white/70">
                                  <span>
                                    {testimonial.event_type ?? "Klien"}
                                  </span>
                                  {testimonial.is_verified ? (
                                    <Badge
                                      variant="outline"
                                      className="h-5 border-white/20 bg-white/5 px-2 py-0 text-[10px] font-normal uppercase tracking-wider text-white"
                                    >
                                      Verified
                                    </Badge>
                                  ) : null}
                                </CardDescription>
                              </div>
                            </div>
                          </CardHeader>
                          <CardContent className="flex-1">
                            <p className="leading-relaxed text-white/90 italic">
                              &ldquo;{testimonial.quote}&rdquo;
                            </p>
                          </CardContent>
                        </Card>
                      </div>
                    </CarouselItem>
                  ))}
                </CarouselContent>
                <div className="mt-8 hidden items-center justify-center gap-4 md:flex">
                  <CarouselPrevious className="static transform-none border-none bg-white text-black hover:bg-white/90 hover:text-black" />
                  <CarouselNext className="static transform-none border-none bg-white text-black hover:bg-white/90 hover:text-black" />
                </div>
              </Carousel>
            ) : (
              <div className="rounded-2xl border border-white/20 bg-white/5 p-10 text-center text-white/70">
                Testimoni belum tersedia saat ini.
              </div>
            )}
          </div>
        </section>

        <section
          id="galeri"
          className="container mx-auto scroll-mt-16 px-4 py-16 md:py-24"
        >
          <div className="mb-12 space-y-4 text-center">
            <h2 className="font-heading text-3xl font-bold text-primary md:text-4xl">
              Galeri dan Dokumentasi
            </h2>
            <p className="text-muted-foreground">
              Beberapa momen indah yang telah kami abadikan bersama.
            </p>
          </div>

          <div className="grid auto-rows-[180px] grid-cols-2 gap-4 sm:auto-rows-[250px] md:grid-cols-4">
            {data.gallery.length > 0 ? (
              data.gallery.map((item, index) => {
                const isLarge = index === 0;
                const isTall = index === 2;
                const isWide = index === 4;

                return (
                  <div
                    key={item.id}
                    className={cn(
                      "relative overflow-hidden rounded-xl shadow-sm group",
                      isLarge && "col-span-2 row-span-2",
                      isTall && "row-span-2",
                      isWide && "col-span-2",
                    )}
                  >
                    <Image
                      src={getGalleryPreview(item)}
                      alt={item.title}
                      fill
                      className="object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 flex items-end bg-gradient-to-t from-black/60 via-transparent to-transparent p-6 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                      <span className="font-heading text-lg font-medium text-white">
                        {item.title}
                      </span>
                    </div>
                    {item.media_type === "video" ? (
                      <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
                        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-black/40 backdrop-blur-sm">
                          <Video className="h-6 w-6 text-white" />
                        </div>
                      </div>
                    ) : null}
                  </div>
                );
              })
            ) : (
              <div className="col-span-full flex flex-col items-center py-20 text-center text-muted-foreground">
                <Camera className="mb-4 h-12 w-12 opacity-20" />
                <p>Belum ada dokumentasi acara yang diunggah.</p>
              </div>
            )}
          </div>

          <div className="mt-12 text-center">
            <Button
              variant="outline"
              size="lg"
              className="group rounded-full px-8"
              onClick={() =>
                window.open(instagramUrl, "_blank", "noopener,noreferrer")
              }
            >
              Lihat Lebih Banyak di Instagram
              <Camera className="ml-2 h-4 w-4 transition-colors group-hover:text-pink-600" />
            </Button>
          </div>
        </section>

        <section
          id="faq"
          className="w-full scroll-mt-16 border-y bg-muted/30 py-16 md:py-24"
        >
          <div className="container mx-auto max-w-3xl px-4">
            <div className="mb-12 space-y-4 text-center">
              <h2 className="font-heading text-3xl font-bold text-primary md:text-4xl">
                Frequently Asked Questions
              </h2>
              <p className="text-muted-foreground">
                Jawaban dari pertanyaan yang paling sering diajukan kepada kami.
              </p>
            </div>

            {data.faqs.length > 0 ? (
              <Accordion
                type="single"
                collapsible
                className="w-full rounded-2xl border bg-background px-6 py-2 shadow-sm"
              >
                {data.faqs.map((faq, index) => (
                  <AccordionItem
                    key={faq.id}
                    value={faq.id}
                    className={cn(
                      index === data.faqs.length - 1
                        ? "border-none"
                        : "border-b border-border/50",
                    )}
                  >
                    <AccordionTrigger className="py-4 text-left text-[15px] font-semibold hover:text-primary hover:no-underline">
                      {faq.question}
                    </AccordionTrigger>
                    <AccordionContent className="pb-5 leading-relaxed text-muted-foreground">
                      {faq.answer}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            ) : (
              <div className="rounded-2xl border border-dashed border-border bg-background p-10 text-center text-muted-foreground">
                FAQ belum tersedia saat ini.
              </div>
            )}
          </div>
        </section>
      </main>

      <footer className="bg-[#1a1a1a] py-16 text-white">
        <div className="container mx-auto grid grid-cols-1 gap-12 px-4 md:grid-cols-12 lg:gap-8">
          <div className="space-y-6 md:col-span-5">
            <h3 className="font-heading text-3xl font-bold tracking-tight">
              {brandName}
            </h3>
            <p className="max-w-sm text-[15px] leading-relaxed text-white/60">
              Menyediakan layanan MC profesional dan undangan digital elegan
              untuk menyempurnakan dan mengabadikan momen bahagia di hari
              istimewa Anda.
            </p>
          </div>

          <div className="space-y-6 md:col-span-3">
            <h4 className="font-heading text-lg font-semibold tracking-wide">
              Tautan Cepat
            </h4>
            <nav className="flex flex-col gap-3 text-[15px] text-white/60">
              <a
                href="#layanan"
                className="w-fit transition-colors hover:text-white"
              >
                Layanan MC
              </a>
              <a
                href="#undangan"
                className="w-fit transition-colors hover:text-white"
              >
                Undangan Digital
              </a>
              <a
                href="#galeri"
                className="w-fit transition-colors hover:text-white"
              >
                Galeri Dokumentasi
              </a>
              <a
                href="#faq"
                className="w-fit transition-colors hover:text-white"
              >
                FAQ
              </a>
            </nav>
          </div>

          <div className="space-y-6 md:col-span-4">
            <h4 className="font-heading text-lg font-semibold tracking-wide">
              Hubungi Kami
            </h4>
            <div className="flex flex-col gap-4 text-[15px] text-white/60">
              <div className="flex items-start gap-3">
                <Phone className="mt-0.5 h-5 w-5 shrink-0" />
                <span>+{waNumber}</span>
              </div>
              {email ? (
                <div className="flex items-start gap-3">
                  <Mail className="mt-0.5 h-5 w-5 shrink-0" />
                  <span>{email}</span>
                </div>
              ) : null}
              <div className="flex items-start gap-3">
                <Camera className="mt-0.5 h-5 w-5 shrink-0" />
                <a
                  href={instagramUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="transition-colors hover:text-white"
                >
                  {getInstagramLabel(instagramUrl)}
                </a>
              </div>
              {address ? (
                <div className="text-sm leading-relaxed text-white/50">
                  {address}
                </div>
              ) : null}
            </div>
          </div>
        </div>
        <div className="container mx-auto mt-16 flex flex-col items-center justify-between gap-4 border-t border-white/10 px-4 pt-8 text-sm text-white/40 md:flex-row">
          <p>
            &copy; {new Date().getFullYear()} {brandName}. All rights reserved.
          </p>
          <div className="flex gap-4">
            <a href="#" className="transition-colors hover:text-white">
              Privacy Policy
            </a>
            <a href="#" className="transition-colors hover:text-white">
              Terms of Service
            </a>
          </div>
        </div>
      </footer>

      <a
        href={buildWhatsAppUrl(waNumber, getGeneralQuestionMessage())}
        target="_blank"
        rel="noopener noreferrer"
        className="group fixed right-6 bottom-6 z-50 flex items-center justify-center gap-2 rounded-full bg-[#25D366] px-5 py-3.5 text-white shadow-xl transition-all hover:-translate-y-1 hover:bg-[#20bd5a] hover:shadow-2xl"
      >
        <MessageCircle className="h-6 w-6" />
        <span className="hidden text-[15px] font-medium sm:inline">
          Chat Kami via WhatsApp
        </span>
      </a>

      <Dialog open={isMCOpen} onOpenChange={setIsMCOpen}>
        <DialogFormContent
          className="sm:max-w-[460px]"
          title="Booking Layanan MC"
          description="Isi detail acara Anda. Data booking akan langsung tersimpan dan tim kami akan segera menghubungi Anda."
          bodyClassName="grid gap-4"
          footer={
            <DialogFooter>
              <Button
                onClick={handleMcSubmit}
                disabled={isMCSubmitting}
                className="flex w-full items-center justify-center gap-2"
              >
                {isMCSubmitting ? "Mengirim..." : "Booking Sekarang"}
                <CalendarIcon className="h-4 w-4" />
              </Button>
            </DialogFooter>
          }
        >
          <div className="grid gap-2">
            <Label htmlFor="mc-client-name">Nama Klien</Label>
            <Input
              id="mc-client-name"
              placeholder="Cth: Budi dan Rina"
              value={mcForm.clientName}
              onChange={(event) =>
                setMcForm((current) => ({
                  ...current,
                  clientName: event.target.value,
                }))
              }
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="mc-phone">Nomor WhatsApp</Label>
            <Input
              id="mc-phone"
              placeholder="Cth: 628123456789"
              value={mcForm.phone}
              onChange={(event) =>
                setMcForm((current) => ({
                  ...current,
                  phone: event.target.value,
                }))
              }
            />
          </div>
          <div className="grid gap-2">
            <Label>Tanggal Acara</Label>
            <Popover open={mcDateOpen} onOpenChange={setMcDateOpen}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "h-10 w-full justify-start bg-background text-left font-normal",
                    !mcForm.eventDate && "text-muted-foreground",
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4 shrink-0 opacity-50" />
                  {mcForm.eventDate ? (
                    toDisplayDate(mcForm.eventDate)
                  ) : (
                    <span>Pilih tanggal acara</span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent
                className="z-50 w-auto bg-background p-0"
                align="start"
              >
                <Calendar
                  mode="single"
                  selected={mcForm.eventDate}
                  onSelect={(date) => {
                    setMcForm((current) => ({ ...current, eventDate: date }));
                    setMcDateOpen(false);
                  }}
                />
              </PopoverContent>
            </Popover>
          </div>
          <div className="grid gap-2">
            <Label htmlFor="mc-service-name">Pilihan Layanan</Label>
            <Select
              value={mcForm.serviceName}
              onValueChange={(value) =>
                setMcForm((current) => ({ ...current, serviceName: value }))
              }
            >
              <SelectTrigger id="mc-service-name">
                <SelectValue placeholder="Pilih layanan" />
              </SelectTrigger>
              <SelectContent>
                {data.services.map((service) => (
                  <SelectItem key={service.slug} value={service.title}>
                    {service.title}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="grid gap-2">
            <Label htmlFor="mc-location">Lokasi Acara</Label>
            <Input
              id="mc-location"
              placeholder="Opsional"
              value={mcForm.eventLocation}
              onChange={(event) =>
                setMcForm((current) => ({
                  ...current,
                  eventLocation: event.target.value,
                }))
              }
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="mc-notes">Catatan Tambahan</Label>
            <textarea
              id="mc-notes"
              rows={4}
              placeholder="Opsional"
              value={mcForm.notes}
              onChange={(event) =>
                setMcForm((current) => ({
                  ...current,
                  notes: event.target.value,
                }))
              }
              className="min-h-24 rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-xs outline-none placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50"
            />
          </div>
          {mcError ? (
            <div className="rounded-md border border-destructive/20 bg-destructive/5 px-3 py-2 text-sm text-destructive">
              {mcError}
            </div>
          ) : null}
        </DialogFormContent>
      </Dialog>

      <Dialog open={isUndanganOpen} onOpenChange={setIsUndanganOpen}>
        <DialogFormContent
          className="sm:max-w-[460px]"
          title="Pesan Undangan Digital"
          description="Lengkapi detail di bawah untuk menyimpan pesanan Anda lalu lanjut ke WhatsApp."
          bodyClassName="grid gap-4"
          footer={
            <DialogFooter>
              <Button
                onClick={handleInvitationSubmit}
                disabled={isInvitationSubmitting}
                className="w-full"
              >
                {isInvitationSubmitting ? "Memproses..." : "Pesan Sekarang"}
              </Button>
            </DialogFooter>
          }
        >
          <div className="grid gap-2">
            <Label htmlFor="invitation-couple-name">Nama Mempelai</Label>
            <Input
              id="invitation-couple-name"
              placeholder="Cth: Romeo dan Juliet"
              value={invitationForm.coupleName}
              onChange={(event) =>
                setInvitationForm((current) => ({
                  ...current,
                  coupleName: event.target.value,
                }))
              }
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="invitation-phone">Nomor WhatsApp</Label>
            <Input
              id="invitation-phone"
              placeholder="Cth: 628123456789"
              value={invitationForm.phone}
              onChange={(event) =>
                setInvitationForm((current) => ({
                  ...current,
                  phone: event.target.value,
                }))
              }
            />
          </div>
          <div className="grid gap-2">
            <Label>Tanggal Acara</Label>
            <Popover
              open={invitationDateOpen}
              onOpenChange={setInvitationDateOpen}
            >
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "h-10 w-full justify-start bg-background text-left font-normal",
                    !invitationForm.eventDate && "text-muted-foreground",
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4 shrink-0 opacity-50" />
                  {invitationForm.eventDate ? (
                    toDisplayDate(invitationForm.eventDate)
                  ) : (
                    <span>Pilih tanggal acara</span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent
                className="z-50 w-auto bg-background p-0"
                align="start"
              >
                <Calendar
                  mode="single"
                  selected={invitationForm.eventDate}
                  onSelect={(date) => {
                    setInvitationForm((current) => ({
                      ...current,
                      eventDate: date,
                    }));
                    setInvitationDateOpen(false);
                  }}
                />
              </PopoverContent>
            </Popover>
          </div>
          <div className="grid gap-2">
            <Label>Tanggal Target Jadi Undangan</Label>
            <Popover
              open={invitationTargetDateOpen}
              onOpenChange={setInvitationTargetDateOpen}
            >
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "h-10 w-full justify-start bg-background text-left font-normal",
                    !invitationForm.targetCompletionDate &&
                      "text-muted-foreground",
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4 shrink-0 opacity-50" />
                  {invitationForm.targetCompletionDate ? (
                    toDisplayDate(invitationForm.targetCompletionDate)
                  ) : (
                    <span>Pilih tanggal target jadi</span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent
                className="z-50 w-auto bg-background p-0"
                align="start"
              >
                <Calendar
                  mode="single"
                  selected={invitationForm.targetCompletionDate}
                  onSelect={(date) => {
                    setInvitationForm((current) => ({
                      ...current,
                      targetCompletionDate: date,
                    }));
                    setInvitationTargetDateOpen(false);
                  }}
                />
              </PopoverContent>
            </Popover>
          </div>
          <div className="grid gap-2">
            <Label htmlFor="invitation-location">Lokasi Acara</Label>
            <Input
              id="invitation-location"
              placeholder="Cth: Gedung Manggala Wanabakti, Jakarta"
              value={invitationForm.eventLocation}
              onChange={(event) =>
                setInvitationForm((current) => ({
                  ...current,
                  eventLocation: event.target.value,
                }))
              }
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="invitation-template">Pilihan Template</Label>
            <Select
              value={invitationForm.templateName}
              onValueChange={(value) =>
                setInvitationForm((current) => ({
                  ...current,
                  templateName: value,
                }))
              }
            >
              <SelectTrigger id="invitation-template">
                <SelectValue placeholder="Pilih template" />
              </SelectTrigger>
              <SelectContent>
                {data.templates.map((template) => (
                  <SelectItem key={template.slug} value={template.name}>
                    {template.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="grid gap-2">
            <Label htmlFor="invitation-notes">Catatan Tambahan</Label>
            <textarea
              id="invitation-notes"
              rows={4}
              placeholder="Opsional"
              value={invitationForm.notes}
              onChange={(event) =>
                setInvitationForm((current) => ({
                  ...current,
                  notes: event.target.value,
                }))
              }
              className="min-h-24 rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-xs outline-none placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50"
            />
          </div>
          {invitationError ? (
            <div className="rounded-md border border-destructive/20 bg-destructive/5 px-3 py-2 text-sm text-destructive">
              {invitationError}
            </div>
          ) : null}
        </DialogFormContent>
      </Dialog>

      <Dialog
        open={Boolean(confirmation)}
        onOpenChange={(open) => (!open ? setConfirmation(null) : null)}
      >
        <DialogFormContent
          className="sm:max-w-[460px]"
          title={confirmation?.title ?? "Konfirmasi"}
          description={confirmation?.description}
          bodyClassName="grid gap-4"
          footer={
            <DialogFooter>
              <Button variant="outline" onClick={() => setConfirmation(null)}>
                Tutup
              </Button>
              <Button
                onClick={() => {
                  if (!confirmation) {
                    return;
                  }

                  window.open(
                    buildWhatsAppUrl(waNumber, confirmation.whatsappMessage),
                    "_blank",
                    "noopener,noreferrer",
                  );
                  setConfirmation(null);
                }}
                className="flex items-center justify-center gap-2"
              >
                Lanjut ke WhatsApp
                <MessageCircle className="h-4 w-4" />
              </Button>
            </DialogFooter>
          }
        >
          <div className="rounded-md border bg-muted p-4 text-sm whitespace-pre-wrap text-muted-foreground">
            {confirmation?.whatsappMessage}
          </div>
        </DialogFormContent>
      </Dialog>
    </div>
  );
}
