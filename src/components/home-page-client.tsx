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
  MessageCircle,
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
import {
  FloatingWhatsappButton,
  PublicFooter,
  PublicHeader,
} from "@/components/public-page-shell";
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
import { Textarea } from "@/components/ui/textarea";
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
import { cn } from "@/lib/utils";
import { trackEvent } from "@/lib/analytics";
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

function getTemplateDemoUrl(template: HomepageTemplate) {
  if (!template.is_demo_ready || !template.demo_url) {
    return null;
  }

  try {
    const demoUrl = new URL(template.demo_url);

    if (demoUrl.protocol !== "https:") {
      return null;
    }

    return demoUrl.href;
  } catch {
    return null;
  }
}

function getGalleryPreview(item: HomepageGalleryItem) {
  return item.thumbnail_url ?? item.media_url;
}

export default function HomePageClient({ data }: HomePageClientProps) {
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
  const instagramUrl = data.settings?.instagram_url ?? FALLBACK_INSTAGRAM;
  const averageRating = data.testimonials.length
    ? (
        data.testimonials.reduce((total, testimonial) => total + testimonial.rating, 0) /
        data.testimonials.length
      ).toFixed(1)
    : "5.0";

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
    trackEvent("booking_mc_submit", { service_name: mcForm.serviceName });
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
    trackEvent("invitation_order_submit", {
      template_name: invitationForm.templateName,
    });
    setConfirmation({
      title: "Pesanan Berhasil Dicatat",
      description:
        "Data pesanan undangan Anda sudah tersimpan. Lanjutkan ke WhatsApp untuk konfirmasi langsung dengan admin.",
      whatsappMessage: result.whatsappMessage,
    });
  };

  return (
    <div className="site-public flex min-h-screen flex-col bg-background">
      <PublicHeader settings={data.settings} />

      <main className="flex-1">
        <section className="relative overflow-hidden pb-16 pt-7 sm:pb-20 sm:pt-10 lg:pb-24 lg:pt-12">
          <div className="site-container grid items-center gap-10 lg:grid-cols-[1.02fr_.98fr] lg:gap-12">
            <div className="relative z-10 w-full max-w-[calc(100vw-2rem)] lg:max-w-none">
              <span className="section-eyebrow">MC Wedding & Undangan Digital</span>
              <h1 className="display-title mt-5 max-w-[11ch] text-[3.35rem] text-primary sm:max-w-none sm:text-[4.8rem] lg:text-[6.7rem] xl:text-[7.6rem]">
                Momen besar,
                <br />dibawakan <span className="block text-[#d98065] italic sm:inline">dengan hangat.</span>
              </h1>
              <p className="mt-6 w-full max-w-[calc(100vw-2rem)] text-base leading-8 text-muted-foreground sm:max-w-xl sm:text-lg">
                {brandName} membantu acara Anda terasa rapi tanpa menjadi kaku—dengan MC yang peka pada suasana dan undangan digital yang berkesan sejak pertama dibuka.
              </p>
              <div className="mt-8 flex w-full max-w-[calc(100vw-2rem)] flex-col gap-3 sm:max-w-xl sm:flex-row sm:flex-wrap">
                <Button asChild size="lg">
                  <Link href="/layanan-mc">Lihat Paket & Cek Jadwal <ArrowRight className="size-4" /></Link>
                </Button>
                <Button variant="outline" size="lg" onClick={() => openMcDialog()}>
                  Konsultasi Acara Gratis
                </Button>
              </div>
              <div className="mt-9 flex items-center gap-4">
                <div className="flex -space-x-2" aria-hidden="true">
                  {data.testimonials.slice(0, 3).map((testimonial) => (
                    <span key={testimonial.id} className="relative grid size-10 overflow-hidden rounded-full border-3 border-background bg-secondary text-xs font-bold text-primary sm:size-11">
                      {testimonial.photo_url ? (
                        <Image src={resolvePublicStorageUrl("gallery", testimonial.photo_url) ?? testimonial.photo_url} alt="" fill sizes="44px" className="object-cover" />
                      ) : (
                        <span className="m-auto">{testimonial.client_name.slice(0, 1).toUpperCase()}</span>
                      )}
                    </span>
                  ))}
                  {data.testimonials.length === 0 ? (
                    <><span className="grid size-10 place-items-center rounded-full border-3 border-background bg-secondary text-xs font-bold text-primary sm:size-11">W</span><span className="grid size-10 place-items-center rounded-full border-3 border-background bg-[#f1c875] text-xs font-bold text-primary sm:size-11">C</span><span className="grid size-10 place-items-center rounded-full border-3 border-background bg-[#d98065] text-xs font-bold text-white sm:size-11">P</span></>
                  ) : null}
                </div>
                <p className="text-xs leading-5 text-muted-foreground sm:text-sm">
                  <strong className="block text-foreground">★★★★★ {averageRating} dari klien</strong>
                  Wedding · Corporate · Private Event
                </p>
              </div>
            </div>

            <div className="relative mx-auto h-[29rem] w-full max-w-[35rem] sm:h-[36rem] lg:h-[40rem]">
              <div className="absolute inset-x-[11%] bottom-0 top-3 overflow-hidden rounded-[9rem_9rem_2rem_2rem] shadow-[0_28px_60px_rgba(37,68,47,.18)] sm:rounded-[12rem_12rem_2.2rem_2.2rem]">
                <Image src="https://images.unsplash.com/photo-1519741497674-611481863552?q=85&w=1100&auto=format&fit=crop" alt="Pasangan menikmati momen pernikahan yang hangat" fill sizes="(max-width: 1024px) 90vw, 45vw" className="object-cover saturate-[.82]" priority />
              </div>
              <div className="absolute bottom-8 left-0 h-36 w-28 overflow-hidden rounded-[5rem_5rem_1.25rem_1.25rem] border-[6px] border-background shadow-lg sm:h-48 sm:w-40 sm:border-8">
                <Image src="https://images.unsplash.com/photo-1519225421980-715cb0215aed?q=80&w=500&auto=format&fit=crop" alt="Dekorasi pernikahan elegan" fill sizes="160px" className="object-cover" />
              </div>
              <div className="absolute right-0 top-7 grid size-28 rotate-6 place-items-center rounded-full bg-[#f1c875] p-4 text-center font-heading text-base font-semibold leading-tight text-primary shadow-lg sm:size-38 sm:p-7 sm:text-xl">
                Warm, joyful & memorable
              </div>
              <div className="absolute -bottom-3 right-4 -z-10 size-32 rounded-[42%_58%_63%_37%/56%_42%_58%_44%] bg-secondary sm:size-40" />
            </div>
          </div>
        </section>

        <section
          id="tentang"
          aria-labelledby="tentang-riswandi-wedding"
          className="section-shell scroll-mt-28"
        >
          <div className="site-container relative grid gap-7 overflow-hidden rounded-[2rem] bg-secondary p-7 sm:p-10 md:grid-cols-[.82fr_1.18fr] md:gap-12 lg:p-16">
            <div className="pointer-events-none absolute -bottom-24 -right-20 size-72 rounded-full border-[3.5rem] border-[#c1d3b9]" />
            <div className="space-y-3">
              <span className="section-eyebrow">Tentang Kami</span>
              <h2
                id="tentang-riswandi-wedding"
                className="display-title text-[2.75rem] text-primary sm:text-[3.8rem] lg:text-[5rem]"
              >
                Tenang menikmati momen, kami jaga alurnya.
              </h2>
            </div>
            <div className="relative z-10 space-y-5 text-base leading-8 text-[#58675d]">
              <p className="text-lg text-primary sm:text-xl">
                Anda seharusnya hadir sepenuhnya di hari istimewa—bukan sibuk mengkhawatirkan transisi, suasana, atau detail yang terlewat.
              </p>
              <p>
                Kami menyiapkan alur MC yang personal, berkoordinasi dengan pihak terkait, dan menyediakan undangan digital yang praktis dibagikan. Layanan utama mencakup Jabodetabek; kebutuhan luar kota dapat dikonsultasikan.
              </p>
              <div className="flex flex-wrap gap-2 text-xs font-bold text-primary">
                <Link href="/layanan-mc" className="rounded-full bg-white/60 px-4 py-2.5 transition-colors hover:bg-white">
                  Paket jasa MC
                </Link>
                <Link href="/undangan-digital" className="rounded-full bg-white/60 px-4 py-2.5 transition-colors hover:bg-white">
                  Undangan digital
                </Link>
                <Link href="/faq" className="rounded-full bg-white/60 px-4 py-2.5 transition-colors hover:bg-white">
                  FAQ pemesanan
                </Link>
              </div>
            </div>
          </div>
        </section>

        <section
          id="layanan"
          className="site-container section-shell scroll-mt-28"
        >
          <div className="mb-10 grid gap-5 md:mb-12 md:grid-cols-[1fr_.55fr] md:items-end md:gap-10">
            <div>
              <span className="section-eyebrow">Layanan Kami</span>
              <h2 className="display-title mt-4 text-[2.9rem] text-primary sm:text-[4.1rem] lg:text-[5.5rem]">
                Satu panggung,<br />banyak cerita.
              </h2>
            </div>
            <p className="max-w-lg text-muted-foreground">
              Pilih format MC yang paling sesuai dengan karakter acara, jumlah tamu, dan suasana yang ingin Anda ciptakan.
            </p>
          </div>

          {data.services.length > 0 ? (
            <div className="space-y-10">
              <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
                {data.services.slice(0, 3).map((service, serviceIndex) => (
                  <Card
                    key={service.slug}
                    className={cn(
                      "flex flex-col p-1 hover:-translate-y-1.5 hover:border-primary/50 hover:shadow-[0_24px_50px_rgba(37,68,47,.14)]",
                      service.is_featured
                        ? "relative overflow-hidden border-primary bg-primary text-white md:rotate-1 md:hover:rotate-0"
                        : "border-border bg-card",
                    )}
                  >
                    {service.badge_variant === "best_value" ? (
                      <div className="absolute top-0 right-0 z-10 rounded-bl-lg bg-primary px-4 py-1 text-xs font-bold uppercase tracking-wider text-primary-foreground shadow-sm">
                        Best Value
                      </div>
                    ) : null}
                    <CardHeader>
                      <span className={cn("mb-3 grid size-13 place-items-center rounded-2xl bg-secondary font-heading text-xl text-primary", service.is_featured && "bg-[#c8dc9d]")}>
                        {String(serviceIndex + 1).padStart(2, "0")}
                      </span>
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
                      <CardTitle className="font-heading text-3xl leading-none">
                        {service.title}
                      </CardTitle>
                      <CardDescription className={cn("leading-6", service.is_featured && "text-white/70")}>
                        {service.short_description}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="flex-1">
                      <ul className={cn("space-y-3 border-t border-border pt-5 text-sm text-muted-foreground", service.is_featured && "border-white/15 text-white/75")}>
                        {service.features.map((feature) => (
                          <li key={feature} className="flex items-start gap-2">
                            <CheckCircle className={cn("mt-0.5 h-4 w-4 shrink-0 text-primary", service.is_featured && "text-[#c8dc9d]")} />
                            <span>{feature}</span>
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                    <CardFooter>
                      <Button
                        className={cn("w-full", service.is_featured && "border-[#91a96e] bg-gradient-to-b from-[#e0edbf] via-[#c8dc9d] to-[#a8c477] text-primary shadow-[inset_0_1px_0_rgba(255,255,255,.7),inset_0_-2px_0_rgba(49,92,70,.18),0_5px_0_#789652,0_9px_20px_rgba(0,0,0,.2)] hover:from-[#e7f2ca] hover:via-[#d3e5ac] hover:to-[#b4cd83] active:shadow-[inset_0_2px_4px_rgba(49,92,70,.18),0_1px_0_#789652]")}
                        onClick={() => openMcDialog(service.title)}
                      >
                        Cek Jadwal Paket
                      </Button>
                    </CardFooter>
                  </Card>
                ))}
              </div>
              <div className="text-center">
                <Button variant="outline" size="lg" asChild>
                  <Link
                    href="/layanan-mc"
                    className="inline-flex items-center gap-2"
                  >
                    Pelajari Detail Semua Paket MC
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </Button>
              </div>
            </div>
          ) : (
            <div className="empty-state">
              <strong className="font-heading text-xl text-foreground">Paket sedang diperbarui</strong>
              <span>Silakan konsultasi langsung agar kami dapat merekomendasikan layanan sesuai acara Anda.</span>
            </div>
          )}
        </section>

        <section
          id="undangan"
          className="section-shell w-full scroll-mt-28 bg-card"
        >
          <div className="site-container">
            <div className="mb-10 grid gap-5 md:mb-12 md:grid-cols-[1fr_.55fr] md:items-end md:gap-10">
              <div>
                <span className="section-eyebrow">Koleksi Template Premium</span>
                <h2 className="display-title mt-4 text-[2.9rem] text-primary sm:text-[4.1rem] lg:text-[5.5rem]">
                  Undangan Digital
                </h2>
              </div>
              <div>
                <p className="text-muted-foreground">Kesan pertama hari bahagia dimulai dari undangan yang cantik, mudah dibuka, dan nyaman dibagikan kepada siapa pun.</p>
                <div className="mt-4 inline-flex items-center gap-2 rounded-xl bg-[#f7e7bd] px-4 py-2.5 text-xs font-semibold text-[#715720]">
                  <Info className="h-4 w-4" />
                  <span>Pesan minimal 7 hari sebelum acara</span>
                </div>
              </div>
            </div>

            {data.templates.length > 0 ? (
              <div className="mb-12 grid grid-cols-2 gap-3 md:gap-6 lg:grid-cols-4">
                {data.templates.map((template, index) => {
                  const previewSrc = getTemplatePreview(template);
                  const demoUrl = getTemplateDemoUrl(template);

                  return (
                    <Card
                      key={template.slug}
                      className="group flex flex-col overflow-hidden bg-background p-0 hover:-translate-y-1.5 hover:shadow-[0_22px_44px_rgba(37,68,47,.14)]"
                    >
                      <div className="relative aspect-[3/4] overflow-hidden bg-muted">
                        {previewSrc ? (
                          <Image
                            src={previewSrc}
                            alt={`Pratinjau template undangan digital ${template.name}`}
                            fill
                            sizes="(max-width: 768px) 50vw, (max-width: 1280px) 25vw, 20vw"
                            priority={index < 2}
                            className="object-cover transition-transform duration-700 group-hover:scale-110"
                          />
                        ) : (
                          <div className="flex h-full w-full items-center justify-center bg-secondary/45 px-4 text-center text-xs text-muted-foreground">
                            Pratinjau sedang disiapkan
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
                        {demoUrl ? (
                          <Button
                            variant="outline"
                            className="w-full px-0 text-[10px] md:text-xs"
                            asChild
                          >
                            <a
                              href={demoUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              aria-label={`Buka demo ${template.name}`}
                              onClick={() =>
                                trackEvent("invitation_demo_click", {
                                  location: "homepage_catalog",
                                  template_name: template.name,
                                })
                              }
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
                            Segera hadir
                          </Button>
                        )}
                        <Button
                          className="w-full text-[10px] md:text-xs"
                          onClick={() => openInvitationDialog(template.name)}
                        >
                          Pilih
                        </Button>
                      </CardFooter>
                    </Card>
                  );
                })}
              </div>
            ) : (
              <div className="empty-state">
                <strong className="font-heading text-xl text-foreground">Koleksi sedang diperbarui</strong>
                <span>Hubungi kami untuk melihat pilihan desain terbaru yang tersedia.</span>
              </div>
            )}

            <div className="mt-12 text-center">
              <Button
                size="lg"
                className="px-8"
                onClick={() => openInvitationDialog()}
              >
                Pilih Desain & Mulai Pesan
              </Button>
            </div>
          </div>
        </section>

        <section className="section-shell bg-[#f1c875]">
          <div className="site-container">
          <div className="mb-10 md:mb-12">
            <span className="section-eyebrow">Mudah, cepat & transparan</span>
            <h2 className="display-title mt-4 text-[2.9rem] text-primary sm:text-[4.1rem] lg:text-[5.5rem]">
              Cara Memesan
            </h2>
            <p className="mt-4 max-w-xl text-[#65572f]">
              Tiga langkah sederhana menuju acara yang lebih tenang dan terarah.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">

            <div className="rounded-[1.75rem] bg-[#fff9e7] p-7">
              <div className="grid size-13 place-items-center rounded-full border border-[#d8ac56] bg-[#f1c875] font-heading text-xl">01</div>
              <div className="mt-6 space-y-2">
                <CalendarIcon className="h-7 w-7 text-primary" />
                <h3 className="font-heading text-xl font-bold">
                  Pilih Layanan
                </h3>
                <p className="text-sm leading-relaxed text-muted-foreground">
                  Pilih paket MC atau template undangan digital yang Anda
                  inginkan dan klik tombol pesan.
                </p>
              </div>
            </div>

            <div className="rounded-[1.75rem] bg-[#d98065] p-7 text-white md:translate-y-4">
              <div className="grid size-13 place-items-center rounded-full bg-[#fff2e7] font-heading text-xl text-[#d98065]">02</div>
              <div className="mt-6 space-y-2">
                <MessageCircle className="h-7 w-7" />
                <h3 className="font-heading text-xl font-bold">
                  Isi Form & Chat WA
                </h3>
                <p className="text-sm leading-relaxed text-white/75">
                  Isi formulir singkat yang disediakan, lalu Anda akan diarahkan
                  ke WhatsApp untuk konfirmasi.
                </p>
              </div>
            </div>

            <div className="rounded-[1.75rem] bg-primary p-7 text-white">
              <div className="grid size-13 place-items-center rounded-full bg-[#c8dc9d] font-heading text-xl text-primary">03</div>
              <div className="mt-6 space-y-2">
                <CheckCircle className="h-7 w-7 text-[#c8dc9d]" />
                <h3 className="font-heading text-xl font-bold">
                  Konfirmasi & Deal
                </h3>
                <p className="text-sm leading-relaxed text-white/70">
                  Tim kami akan follow up. Setelah DP dikonfirmasi, jadwal atau
                  pesanan Anda kami proses.
                </p>
              </div>
            </div>
          </div>
          </div>
        </section>

        <section
          id="testimoni"
          className="section-shell scroll-mt-28 bg-primary text-primary-foreground"
        >
          <div className="site-container">
            <div className="mb-10 grid gap-5 md:mb-12 md:grid-cols-[1fr_.55fr] md:items-end">
              <div>
                <span className="section-eyebrow text-[#c8dc9d]">Cerita dari klien</span>
                <h2 className="display-title mt-4 text-[2.9rem] text-white sm:text-[4.1rem] lg:text-[5.5rem]">
                  Kata mereka,<br />tentang kami.
                </h2>
              </div>
              <p className="max-w-2xl text-primary-foreground/70">
                Bukan sekadar acara selesai tepat waktu—tetapi momen yang terasa nyaman bagi keluarga dan tamu.
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
                        <Card className="flex h-full flex-col border-white/15 bg-white/10 text-white shadow-[0_18px_45px_rgba(0,0,0,.12)] backdrop-blur-md transition-colors hover:bg-white/15">
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
                                    alt={`Foto klien ${testimonial.client_name}`}
                                    fill
                                    sizes="80px"
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
              <div className="rounded-[1.75rem] border border-dashed border-white/25 bg-white/5 p-10 text-center text-white/70">
                Cerita klien akan segera hadir di sini.
              </div>
            )}
          </div>
        </section>

        <section
          id="galeri"
          className="section-shell scroll-mt-28 bg-primary text-white"
        >
          <div className="site-container">
          <div className="mb-10 grid gap-5 md:mb-12 md:grid-cols-[1fr_.55fr] md:items-end">
            <div>
              <span className="section-eyebrow text-[#c8dc9d]">Momen pilihan</span>
              <h2 className="display-title mt-4 text-[2.9rem] sm:text-[4.1rem] lg:text-[5.5rem]">Galeri &<br />Dokumentasi</h2>
            </div>
            <p className="text-white/70">Lihat bagaimana setiap detail, ekspresi, dan energi acara dirangkai menjadi kenangan yang layak disimpan.</p>
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
                      "relative overflow-hidden rounded-[1.5rem] shadow-sm group",
                      isLarge && "col-span-2 row-span-2",
                      isTall && "row-span-2",
                      isWide && "col-span-2",
                    )}
                  >
                    <Image
                      src={getGalleryPreview(item)}
                      alt={`Dokumentasi acara ${item.title}`}
                      fill
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      className="object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 flex items-end bg-gradient-to-t from-black/65 via-transparent to-transparent p-3 sm:p-5">
                      <span className="rounded-xl bg-white/90 px-3 py-2 font-heading text-sm font-semibold text-primary backdrop-blur sm:text-lg">
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
              <div className="col-span-full flex flex-col items-center py-20 text-center text-white/65">
                <Camera className="mb-4 h-12 w-12 opacity-20" />
                <p>Belum ada dokumentasi acara yang diunggah.</p>
              </div>
            )}
          </div>

          <div className="mt-12 text-center">
            <Button variant="outline" size="lg" className="group" asChild>
              <a
                href={instagramUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => trackEvent("instagram_click", { location: "gallery_section" })}
              >
                Lihat Dokumentasi Lain di Instagram
                <Camera className="ml-2 h-4 w-4 transition-colors group-hover:text-pink-600" />
              </a>
            </Button>
            <Button variant="ghost" size="lg" className="mt-3 text-white hover:bg-white/10 hover:text-white sm:ml-2 sm:mt-0" asChild>
              <Link href="/galeri">Buka Halaman Galeri</Link>
            </Button>
          </div>
          </div>
        </section>

        <section
          id="faq"
          className="section-shell w-full scroll-mt-28"
        >
          <div className="site-container grid gap-9 lg:grid-cols-[.72fr_1.28fr] lg:gap-16">
            <div>
              <span className="section-eyebrow">Tanya jawab</span>
              <h2 className="display-title mt-4 text-[2.9rem] text-primary sm:text-[4rem] lg:text-[5rem]">Yang sering ditanyakan sebelum memesan.</h2>
              <p className="mt-5 text-muted-foreground">Masih ada yang ingin dipastikan? Konsultasikan langsung—kami akan membantu tanpa membuat Anda merasa terburu-buru.</p>
            </div>
            <div>
            {data.faqs.length > 0 ? (
              <Accordion
                type="single"
                collapsible
                className="w-full rounded-[1.5rem] border bg-card px-5 py-2 shadow-[0_18px_40px_rgba(37,68,47,.08)] sm:px-6"
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
              <div className="empty-state">
                FAQ sedang diperbarui. Hubungi kami untuk jawaban langsung.
              </div>
            )}
            <div className="mt-8 text-center">
              <Button asChild variant="outline">
                <Link href="/faq">Baca Semua FAQ</Link>
              </Button>
            </div>
            </div>
          </div>
        </section>
      </main>

      <PublicFooter settings={data.settings} />
      <FloatingWhatsappButton settings={data.settings} />

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
              name="clientName"
              autoComplete="name"
              aria-invalid={Boolean(mcError)}
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
              name="phone"
              type="tel"
              inputMode="tel"
              autoComplete="tel"
              aria-invalid={Boolean(mcError)}
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
            <Label htmlFor="mc-event-date">Tanggal Acara</Label>
            <Popover open={mcDateOpen} onOpenChange={setMcDateOpen}>
              <PopoverTrigger asChild>
                <Button
                  id="mc-event-date"
                  aria-invalid={Boolean(mcError)}
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
              <SelectTrigger id="mc-service-name" aria-invalid={Boolean(mcError)}>
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
              name="eventLocation"
              autoComplete="street-address"
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
            <Textarea
              id="mc-notes"
              name="notes"
              rows={4}
              placeholder="Opsional"
              value={mcForm.notes}
              onChange={(event) =>
                setMcForm((current) => ({
                  ...current,
                  notes: event.target.value,
                }))
              }
              className="min-h-28"
            />
          </div>
          {mcError ? (
            <div role="alert" aria-live="assertive" className="rounded-md border border-destructive/20 bg-destructive/5 px-3 py-2 text-sm text-destructive">
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
              name="coupleName"
              autoComplete="name"
              aria-invalid={Boolean(invitationError)}
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
              name="phone"
              type="tel"
              inputMode="tel"
              autoComplete="tel"
              aria-invalid={Boolean(invitationError)}
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
            <Label htmlFor="invitation-event-date">Tanggal Acara</Label>
            <Popover
              open={invitationDateOpen}
              onOpenChange={setInvitationDateOpen}
            >
              <PopoverTrigger asChild>
                <Button
                  id="invitation-event-date"
                  aria-invalid={Boolean(invitationError)}
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
            <Label htmlFor="invitation-target-date">Tanggal Target Jadi Undangan</Label>
            <Popover
              open={invitationTargetDateOpen}
              onOpenChange={setInvitationTargetDateOpen}
            >
              <PopoverTrigger asChild>
                <Button
                  id="invitation-target-date"
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
              name="eventLocation"
              autoComplete="street-address"
              aria-invalid={Boolean(invitationError)}
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
              <SelectTrigger id="invitation-template" aria-invalid={Boolean(invitationError)}>
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
            <Textarea
              id="invitation-notes"
              name="notes"
              rows={4}
              placeholder="Opsional"
              value={invitationForm.notes}
              onChange={(event) =>
                setInvitationForm((current) => ({
                  ...current,
                  notes: event.target.value,
                }))
              }
              className="min-h-28"
            />
          </div>
          {invitationError ? (
            <div role="alert" aria-live="assertive" className="rounded-md border border-destructive/20 bg-destructive/5 px-3 py-2 text-sm text-destructive">
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
                  trackEvent("whatsapp_click", { location: "submission_confirmation" });
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
          <div role="status" aria-live="polite" className="rounded-md border bg-muted p-4 text-sm whitespace-pre-wrap text-muted-foreground">
            {confirmation?.whatsappMessage}
          </div>
        </DialogFormContent>
      </Dialog>
    </div>
  );
}
