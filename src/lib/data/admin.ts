import "server-only";

import { cache } from "react";
import { z } from "zod";
import type { User } from "@supabase/supabase-js";

import { createClient } from "@/lib/supabase/server";

const adminRoleSchema = z.enum(["admin", "super_admin"]);
const bookingStatusSchema = z.enum([
  "pending",
  "followed_up",
  "deal",
  "canceled",
]);
const invitationOrderStatusSchema = z.enum([
  "new",
  "in_progress",
  "review",
  "done",
  "canceled",
]);

const isoDateSchema = z
  .string()
  .trim()
  .regex(/^\d{4}-\d{2}-\d{2}$/, "Format tanggal tidak valid.");

const adminProfileSchema = z.object({
  id: z.string().uuid(),
  email: z.string().email(),
  full_name: z.string().nullable(),
  role: adminRoleSchema,
  is_active: z.boolean(),
});

const dashboardMetricsSchema = z.object({
  pending_mc_bookings: z.number().int().nonnegative(),
  new_invitation_orders: z.number().int().nonnegative(),
  upcoming_events: z.number().int().nonnegative(),
  active_templates: z.number().int().nonnegative(),
  active_gallery_items: z.number().int().nonnegative(),
});

const adminBookingSchema = z.object({
  id: z.string().uuid(),
  public_id: z.string(),
  client_name: z.string(),
  phone: z.string().nullable(),
  event_date: z.string(),
  event_location: z.string().nullable(),
  service_name: z.string(),
  notes: z.string().nullable(),
  status: bookingStatusSchema,
  created_at: z.string(),
  updated_at: z.string(),
});

const adminInvitationOrderSchema = z.object({
  id: z.string().uuid(),
  public_id: z.string(),
  couple_name: z.string(),
  phone: z.string().nullable(),
  event_date: z.string(),
  target_completion_date: z.string().nullable(),
  event_location: z.string(),
  template_name: z.string(),
  notes: z.string().nullable(),
  status: invitationOrderStatusSchema,
  created_at: z.string(),
  updated_at: z.string(),
});

const adminCalendarItemSchema = z.object({
  id: z.string().uuid(),
  public_id: z.string().nullable(),
  title: z.string(),
  event_date: z.string(),
  event_time: z.string().nullable(),
  event_kind: z.string(),
  status: z.string().nullable(),
  description: z.string().nullable(),
});

const adminWebsiteSettingsSchema = z.object({
  brand_name: z.string(),
  phone_whatsapp: z.string(),
  email: z.string().nullable(),
  instagram_url: z.string().nullable(),
  address: z.string().nullable(),
  mc_whatsapp_template: z.string(),
  invitation_whatsapp_template: z.string(),
  updated_at: z.string(),
});

const adminMcServiceSchema = z.object({
  id: z.string().uuid(),
  slug: z.string(),
  title: z.string(),
  badge_label: z.string().nullable(),
  badge_variant: z.string().nullable(),
  short_description: z.string(),
  features: z.array(z.string()),
  sort_order: z.number().int(),
  is_featured: z.boolean(),
  is_active: z.boolean(),
  updated_at: z.string(),
});

const adminFaqSchema = z.object({
  id: z.string().uuid(),
  question: z.string(),
  answer: z.string(),
  sort_order: z.number().int(),
  is_active: z.boolean(),
  updated_at: z.string(),
});

const adminTestimonialSchema = z.object({
  id: z.string().uuid(),
  client_name: z.string(),
  event_type: z.string().nullable(),
  quote: z.string(),
  rating: z.number().int(),
  photo_url: z.string().nullable(),
  is_verified: z.boolean(),
  sort_order: z.number().int(),
  is_active: z.boolean(),
  updated_at: z.string(),
});

const adminInvitationTemplateSchema = z.object({
  id: z.string().uuid(),
  slug: z.string(),
  name: z.string(),
  theme: z.string().nullable(),
  original_price: z.number().int(),
  promo_price: z.number().int(),
  demo_url: z.string().nullable(),
  preview_image_url: z.string().nullable(),
  img_sig: z.number().int().nullable(),
  min_order_days: z.number().int(),
  sort_order: z.number().int(),
  is_active: z.boolean(),
  is_demo_ready: z.boolean(),
  updated_at: z.string(),
});

const adminGalleryItemSchema = z.object({
  id: z.string().uuid(),
  title: z.string(),
  category: z.string(),
  media_type: z.enum(["image", "video"]),
  media_url: z.string(),
  thumbnail_url: z.string().nullable(),
  storage_path: z.string().nullable(),
  sort_order: z.number().int(),
  is_featured: z.boolean(),
  is_active: z.boolean(),
  updated_at: z.string(),
});

const mcServiceOptionSchema = z.object({
  id: z.string().uuid(),
  title: z.string(),
  is_active: z.boolean(),
  sort_order: z.number().int(),
});

const invitationTemplateOptionSchema = z.object({
  id: z.string().uuid(),
  name: z.string(),
  is_active: z.boolean(),
  sort_order: z.number().int(),
});

const createMcBookingSchema = z.object({
  clientName: z
    .string()
    .trim()
    .min(2, "Nama klien wajib diisi minimal 2 karakter."),
  phone: z.string().trim().optional(),
  eventDate: isoDateSchema,
  eventLocation: z.string().trim().optional(),
  serviceName: z.string().trim().min(1, "Pilihan layanan wajib diisi."),
  notes: z.string().trim().optional(),
  status: bookingStatusSchema.default("pending"),
});

const updateMcBookingStatusSchema = z.object({
  id: z.string().uuid(),
  status: bookingStatusSchema,
});

const deleteMcBookingSchema = z.object({
  id: z.string().uuid(),
});

const createInvitationOrderSchema = z.object({
  coupleName: z
    .string()
    .trim()
    .min(2, "Nama mempelai wajib diisi minimal 2 karakter."),
  phone: z.string().trim().optional(),
  eventDate: isoDateSchema,
  targetCompletionDate: isoDateSchema.optional(),
  eventLocation: z.string().trim().min(2, "Lokasi acara wajib diisi."),
  templateName: z.string().trim().min(1, "Pilihan template wajib diisi."),
  notes: z.string().trim().optional(),
  status: invitationOrderStatusSchema.default("new"),
});

const updateInvitationOrderStatusSchema = z.object({
  id: z.string().uuid(),
  status: invitationOrderStatusSchema,
});

const deleteInvitationOrderSchema = z.object({
  id: z.string().uuid(),
});

const nonNegativeIntSchema = z.coerce.number().int().min(0);
const priceSchema = z.coerce.number().int().min(0, "Harga tidak valid.");

const createMcServiceSchema = z.object({
  title: z
    .string()
    .trim()
    .min(2, "Nama layanan wajib diisi minimal 2 karakter."),
  badgeLabel: z.string().trim().optional(),
  badgeVariant: z.string().trim().optional(),
  shortDescription: z
    .string()
    .trim()
    .min(10, "Deskripsi layanan terlalu pendek."),
  features: z
    .array(z.string().trim().min(2))
    .min(1, "Minimal 1 fitur layanan wajib diisi."),
  sortOrder: nonNegativeIntSchema.default(0),
  isFeatured: z.boolean().default(false),
  isActive: z.boolean().default(true),
});

const updateMcServiceSchema = createMcServiceSchema.extend({
  id: z.string().uuid(),
});

const deleteMcServiceSchema = z.object({
  id: z.string().uuid(),
});

const createFaqSchema = z.object({
  question: z
    .string()
    .trim()
    .min(3, "Pertanyaan wajib diisi minimal 3 karakter."),
  answer: z.string().trim().min(3, "Jawaban wajib diisi minimal 3 karakter."),
  sortOrder: nonNegativeIntSchema.default(0),
  isActive: z.boolean().default(true),
});

const updateFaqSchema = createFaqSchema.extend({
  id: z.string().uuid(),
});

const deleteFaqSchema = z.object({
  id: z.string().uuid(),
});

const createTestimonialSchema = z.object({
  clientName: z
    .string()
    .trim()
    .min(2, "Nama klien wajib diisi minimal 2 karakter."),
  eventType: z.string().trim().optional(),
  quote: z.string().trim().min(10, "Testimoni terlalu pendek."),
  rating: z.coerce.number().int().min(1).max(5),
  photoUrl: z.string().trim().optional(),
  sortOrder: nonNegativeIntSchema.default(0),
  isVerified: z.boolean().default(true),
  isActive: z.boolean().default(true),
});

const updateTestimonialSchema = createTestimonialSchema.extend({
  id: z.string().uuid(),
});

const deleteTestimonialSchema = z.object({
  id: z.string().uuid(),
});

const createInvitationTemplateSchema = z.object({
  name: z.string().trim().min(2, "Nama template wajib diisi."),
  theme: z.string().trim().optional(),
  originalPrice: priceSchema.default(59000),
  promoPrice: priceSchema.default(39000),
  demoUrl: z.string().trim().optional(),
  previewImageUrl: z.string().trim().optional(),
  imgSig: z.coerce.number().int().optional(),
  minOrderDays: z.coerce.number().int().min(1).default(7),
  sortOrder: nonNegativeIntSchema.default(0),
  isActive: z.boolean().default(true),
  isDemoReady: z.boolean().default(true),
});

const updateInvitationTemplateSchema = createInvitationTemplateSchema.extend({
  id: z.string().uuid(),
});

const deleteInvitationTemplateSchema = z.object({
  id: z.string().uuid(),
});

const updateWebsiteSettingsSchema = z.object({
  brandName: z.string().trim().min(2, "Nama brand wajib diisi."),
  phoneWhatsapp: z
    .string()
    .trim()
    .regex(/^[0-9+]{8,20}$/, "Nomor WhatsApp tidak valid."),
  email: z
    .string()
    .trim()
    .email("Email tidak valid.")
    .optional()
    .or(z.literal("")),
  instagramUrl: z.string().trim().optional(),
  address: z.string().trim().optional(),
  mcWhatsappTemplate: z
    .string()
    .trim()
    .min(10, "Template pesan MC terlalu pendek."),
  invitationWhatsappTemplate: z
    .string()
    .trim()
    .min(10, "Template pesan undangan terlalu pendek."),
});

const createGalleryItemSchema = z.object({
  title: z.string().trim().min(2, "Judul dokumentasi wajib diisi."),
  category: z.string().trim().min(2, "Kategori wajib diisi."),
  mediaType: z.enum(["image", "video"]),
  sortOrder: nonNegativeIntSchema.default(0),
  isFeatured: z.boolean().default(false),
  isActive: z.boolean().default(true),
});

const updateGalleryItemSchema = createGalleryItemSchema.extend({
  id: z.string().uuid(),
});

const deleteGalleryItemSchema = z.object({
  id: z.string().uuid(),
});

const createManualCalendarEventSchema = z.object({
  title: z.string().trim().min(2, "Judul event wajib diisi."),
  eventDate: isoDateSchema,
  eventTime: z
    .string()
    .trim()
    .regex(/^\d{2}:\d{2}$/, "Format jam tidak valid.")
    .optional()
    .or(z.literal("")),
  notes: z.string().trim().optional(),
  status: z.string().trim().optional(),
});

const deleteManualCalendarEventSchema = z.object({
  id: z.string().uuid(),
});

export type AdminRole = z.infer<typeof adminRoleSchema>;
export type AdminBookingStatus = z.infer<typeof bookingStatusSchema>;
export type AdminInvitationOrderStatus = z.infer<
  typeof invitationOrderStatusSchema
>;
export type AdminProfile = z.infer<typeof adminProfileSchema>;
export type DashboardMetrics = z.infer<typeof dashboardMetricsSchema>;
export type AdminBooking = z.infer<typeof adminBookingSchema>;
export type AdminInvitationOrder = z.infer<typeof adminInvitationOrderSchema>;
export type AdminCalendarItem = z.infer<typeof adminCalendarItemSchema>;
export type AdminWebsiteSettings = z.infer<typeof adminWebsiteSettingsSchema>;
export type AdminMcService = z.infer<typeof adminMcServiceSchema>;
export type AdminFaq = z.infer<typeof adminFaqSchema>;
export type AdminTemplate = z.infer<typeof adminInvitationTemplateSchema>;
export type AdminGalleryItem = z.infer<typeof adminGalleryItemSchema>;
export type AdminTestimonial = z.infer<typeof adminTestimonialSchema>;
export type McServiceOption = z.infer<typeof mcServiceOptionSchema>;
export type InvitationTemplateOption = z.infer<
  typeof invitationTemplateOptionSchema
>;

type AdminSession = {
  user: User;
  profile: AdminProfile;
};

type MutationResult<T> =
  | {
      ok: true;
      data: T;
    }
  | {
      ok: false;
      error: string;
    };

function getValidationErrorMessage(error: z.ZodError) {
  return error.issues[0]?.message ?? "Input tidak valid.";
}

function normalizeOptional(value?: string) {
  if (!value) {
    return null;
  }

  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : null;
}

function slugify(value: string) {
  return value
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 60);
}

function normalizeUrl(value?: string) {
  const normalized = normalizeOptional(value);
  return normalized === "#" ? null : normalized;
}

function sanitizeStorageFileName(value: string) {
  const parts = value.split(".");
  const extension = parts.length > 1 ? `.${parts.pop()?.toLowerCase()}` : "";
  const basename = parts.join(".") || "media";

  return `${slugify(basename) || "media"}${extension.replace(/[^a-z0-9.]/g, "")}`;
}

async function uploadPublicStorageFile({
  bucket,
  folder,
  file,
  expectedType,
}: {
  bucket: "gallery" | "invitation-template";
  folder: string;
  file: File;
  expectedType?: "image" | "video";
}): Promise<MutationResult<{ publicUrl: string; storagePath: string }>> {
  if (!file || file.size === 0) {
    return {
      ok: false,
      error: "File media wajib dipilih.",
    };
  }

  if (file.size > 20 * 1024 * 1024) {
    return {
      ok: false,
      error: "Ukuran file maksimal 20MB.",
    };
  }

  if (expectedType && !file.type.startsWith(`${expectedType}/`)) {
    return {
      ok: false,
      error: "Tipe file tidak sesuai.",
    };
  }

  const supabase = await createClient();
  const storagePath = `${folder}/${Date.now()}-${sanitizeStorageFileName(file.name)}`;
  const { error: uploadError } = await supabase.storage
    .from(bucket)
    .upload(storagePath, file, {
      contentType: file.type,
      upsert: false,
    });

  if (uploadError) {
    return {
      ok: false,
      error: uploadError.message,
    };
  }

  const {
    data: { publicUrl },
  } = supabase.storage.from(bucket).getPublicUrl(storagePath);

  return {
    ok: true,
    data: {
      publicUrl,
      storagePath,
    },
  };
}

async function removeStorageFile({
  bucket,
  path,
}: {
  bucket: "gallery" | "invitation-template";
  path?: string | null;
}) {
  if (!path) {
    return;
  }

  const supabase = await createClient();
  await supabase.storage.from(bucket).remove([path]);
}

function extractGalleryStoragePath(value?: string | null) {
  const normalized = normalizeOptional(value ?? undefined);

  if (!normalized) {
    return null;
  }

  const match = normalized.match(
    /\/storage\/v1\/object\/public\/gallery\/(.+)$/i,
  );

  if (match?.[1]) {
    return decodeURIComponent(match[1]);
  }

  return null;
}

async function readAdminProfile(userId: string): Promise<AdminProfile | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("profiles")
    .select("id,email,full_name,role,is_active")
    .eq("id", userId)
    .maybeSingle();

  if (error || !data) {
    return null;
  }

  const parsed = adminProfileSchema.safeParse(data);

  if (!parsed.success || !parsed.data.is_active) {
    return null;
  }

  return parsed.data;
}

async function requireAdminSession(): Promise<AdminSession | null> {
  const session = await getAdminSession();
  return session ?? null;
}

export const getAdminSession = cache(async (): Promise<AdminSession | null> => {
  const supabase = await createClient();
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error || !user) {
    return null;
  }

  const profile = await readAdminProfile(user.id);

  if (!profile) {
    return null;
  }

  return {
    user,
    profile,
  };
});

export const getDashboardMetrics = cache(
  async (): Promise<DashboardMetrics | null> => {
    const session = await getAdminSession();

    if (!session) {
      return null;
    }

    const supabase = await createClient();
    const { data, error } = await supabase.rpc("get_admin_dashboard_metrics");

    if (error || !data) {
      return null;
    }

    const parsed = dashboardMetricsSchema.safeParse(data);
    return parsed.success ? parsed.data : null;
  },
);

export async function listMcBookings(): Promise<AdminBooking[]> {
  const session = await getAdminSession();

  if (!session) {
    return [];
  }

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("mc_bookings")
    .select(
      "id,public_id,client_name,phone,event_date,event_location,service_name,notes,status,created_at,updated_at",
    )
    .order("created_at", { ascending: false });

  if (error || !data) {
    return [];
  }

  return z.array(adminBookingSchema).parse(data);
}

export async function listMcServiceOptions(): Promise<McServiceOption[]> {
  const session = await getAdminSession();

  if (!session) {
    return [];
  }

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("mc_services")
    .select("id,title,is_active,sort_order")
    .order("sort_order", { ascending: true })
    .order("title", { ascending: true });

  if (error || !data) {
    return [];
  }

  return z.array(mcServiceOptionSchema).parse(data);
}

export async function listAdminMcServices(): Promise<AdminMcService[]> {
  const session = await getAdminSession();

  if (!session) {
    return [];
  }

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("mc_services")
    .select(
      "id,slug,title,badge_label,badge_variant,short_description,features,sort_order,is_featured,is_active,updated_at",
    )
    .order("sort_order", { ascending: true })
    .order("title", { ascending: true });

  if (error || !data) {
    return [];
  }

  return z.array(adminMcServiceSchema).parse(data);
}

export async function listInvitationOrders(): Promise<AdminInvitationOrder[]> {
  const session = await getAdminSession();

  if (!session) {
    return [];
  }

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("invitation_orders")
    .select(
      "id,public_id,couple_name,phone,event_date,target_completion_date,event_location,template_name,notes,status,created_at,updated_at",
    )
    .order("created_at", { ascending: false });

  if (error || !data) {
    return [];
  }

  return z.array(adminInvitationOrderSchema).parse(data);
}

export async function listInvitationTemplateOptions(): Promise<
  InvitationTemplateOption[]
> {
  const session = await getAdminSession();

  if (!session) {
    return [];
  }

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("invitation_templates")
    .select("id,name,is_active,sort_order")
    .order("sort_order", { ascending: true })
    .order("name", { ascending: true });

  if (error || !data) {
    return [];
  }

  return z.array(invitationTemplateOptionSchema).parse(data);
}

export async function listAdminCalendarItems(): Promise<AdminCalendarItem[]> {
  const session = await getAdminSession();

  if (!session) {
    return [];
  }

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("admin_calendar_items")
    .select(
      "id,public_id,title,event_date,event_time,event_kind,status,description",
    )
    .order("event_date", { ascending: true });

  if (error || !data) {
    return [];
  }

  return z.array(adminCalendarItemSchema).parse(data);
}

export async function listAdminFaqs(): Promise<AdminFaq[]> {
  const session = await getAdminSession();

  if (!session) {
    return [];
  }

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("faqs")
    .select("id,question,answer,sort_order,is_active,updated_at")
    .order("sort_order", { ascending: true })
    .order("created_at", { ascending: false });

  if (error || !data) {
    return [];
  }

  return z.array(adminFaqSchema).parse(data);
}

export async function listAdminTestimonials(): Promise<AdminTestimonial[]> {
  const session = await getAdminSession();

  if (!session) {
    return [];
  }

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("testimonials")
    .select(
      "id,client_name,event_type,quote,rating,photo_url,is_verified,sort_order,is_active,updated_at",
    )
    .order("sort_order", { ascending: true })
    .order("created_at", { ascending: false });

  if (error || !data) {
    return [];
  }

  return z.array(adminTestimonialSchema).parse(data);
}

export async function listAdminInvitationTemplates(): Promise<AdminTemplate[]> {
  const session = await getAdminSession();

  if (!session) {
    return [];
  }

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("invitation_templates")
    .select(
      "id,slug,name,theme,original_price,promo_price,demo_url,preview_image_url,img_sig,min_order_days,sort_order,is_active,is_demo_ready,updated_at",
    )
    .order("sort_order", { ascending: true })
    .order("created_at", { ascending: false });

  if (error || !data) {
    return [];
  }

  return z.array(adminInvitationTemplateSchema).parse(data);
}

export async function listAdminGalleryItems(): Promise<AdminGalleryItem[]> {
  const session = await getAdminSession();

  if (!session) {
    return [];
  }

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("gallery_items")
    .select(
      "id,title,category,media_type,media_url,thumbnail_url,storage_path,sort_order,is_featured,is_active,updated_at",
    )
    .order("sort_order", { ascending: true })
    .order("created_at", { ascending: false });

  if (error || !data) {
    return [];
  }

  return z.array(adminGalleryItemSchema).parse(data);
}

export const getAdminWebsiteSettings = cache(
  async (): Promise<AdminWebsiteSettings | null> => {
    const session = await getAdminSession();

    if (!session) {
      return null;
    }

    const supabase = await createClient();
    const { data, error } = await supabase
      .from("website_settings")
      .select(
        "brand_name,phone_whatsapp,email,instagram_url,address,mc_whatsapp_template,invitation_whatsapp_template,updated_at",
      )
      .eq("id", true)
      .maybeSingle();

    if (error || !data) {
      return null;
    }

    const parsed = adminWebsiteSettingsSchema.safeParse(data);
    return parsed.success ? parsed.data : null;
  },
);

export async function createMcService(
  input: z.input<typeof createMcServiceSchema>,
): Promise<MutationResult<AdminMcService>> {
  const session = await requireAdminSession();

  if (!session) {
    return {
      ok: false,
      error: "Sesi admin tidak valid. Silakan login ulang.",
    };
  }

  const parsed = createMcServiceSchema.safeParse(input);

  if (!parsed.success) {
    return {
      ok: false,
      error: getValidationErrorMessage(parsed.error),
    };
  }

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("mc_services")
    .insert({
      slug: `${slugify(parsed.data.title) || "layanan-mc"}-${Date.now()}`,
      title: parsed.data.title,
      badge_label: normalizeOptional(parsed.data.badgeLabel),
      badge_variant: normalizeOptional(parsed.data.badgeVariant),
      short_description: parsed.data.shortDescription,
      features: parsed.data.features,
      sort_order: parsed.data.sortOrder,
      is_featured: parsed.data.isFeatured,
      is_active: parsed.data.isActive,
    })
    .select(
      "id,slug,title,badge_label,badge_variant,short_description,features,sort_order,is_featured,is_active,updated_at",
    )
    .single();

  if (error || !data) {
    return {
      ok: false,
      error: error?.message ?? "Gagal menambah layanan MC.",
    };
  }

  return {
    ok: true,
    data: adminMcServiceSchema.parse(data),
  };
}

export async function updateMcService(
  input: z.input<typeof updateMcServiceSchema>,
): Promise<MutationResult<AdminMcService>> {
  const session = await requireAdminSession();

  if (!session) {
    return {
      ok: false,
      error: "Sesi admin tidak valid. Silakan login ulang.",
    };
  }

  const parsed = updateMcServiceSchema.safeParse(input);

  if (!parsed.success) {
    return {
      ok: false,
      error: getValidationErrorMessage(parsed.error),
    };
  }

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("mc_services")
    .update({
      title: parsed.data.title,
      badge_label: normalizeOptional(parsed.data.badgeLabel),
      badge_variant: normalizeOptional(parsed.data.badgeVariant),
      short_description: parsed.data.shortDescription,
      features: parsed.data.features,
      sort_order: parsed.data.sortOrder,
      is_featured: parsed.data.isFeatured,
      is_active: parsed.data.isActive,
    })
    .eq("id", parsed.data.id)
    .select(
      "id,slug,title,badge_label,badge_variant,short_description,features,sort_order,is_featured,is_active,updated_at",
    )
    .single();

  if (error || !data) {
    return {
      ok: false,
      error: error?.message ?? "Gagal memperbarui layanan MC.",
    };
  }

  return {
    ok: true,
    data: adminMcServiceSchema.parse(data),
  };
}

export async function deleteMcService(
  input: z.input<typeof deleteMcServiceSchema>,
): Promise<MutationResult<{ id: string }>> {
  const session = await requireAdminSession();

  if (!session) {
    return {
      ok: false,
      error: "Sesi admin tidak valid. Silakan login ulang.",
    };
  }

  const parsed = deleteMcServiceSchema.safeParse(input);

  if (!parsed.success) {
    return {
      ok: false,
      error: getValidationErrorMessage(parsed.error),
    };
  }

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("mc_services")
    .delete()
    .eq("id", parsed.data.id)
    .select("id")
    .single();

  if (error || !data) {
    return {
      ok: false,
      error: error?.message ?? "Gagal menghapus layanan MC.",
    };
  }

  return {
    ok: true,
    data: {
      id: data.id,
    },
  };
}

export async function createFaq(
  input: z.input<typeof createFaqSchema>,
): Promise<MutationResult<AdminFaq>> {
  const session = await requireAdminSession();

  if (!session) {
    return {
      ok: false,
      error: "Sesi admin tidak valid. Silakan login ulang.",
    };
  }

  const parsed = createFaqSchema.safeParse(input);

  if (!parsed.success) {
    return {
      ok: false,
      error: getValidationErrorMessage(parsed.error),
    };
  }

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("faqs")
    .insert({
      question: parsed.data.question,
      answer: parsed.data.answer,
      sort_order: parsed.data.sortOrder,
      is_active: parsed.data.isActive,
    })
    .select("id,question,answer,sort_order,is_active,updated_at")
    .single();

  if (error || !data) {
    return {
      ok: false,
      error: error?.message ?? "Gagal menambah FAQ.",
    };
  }

  return {
    ok: true,
    data: adminFaqSchema.parse(data),
  };
}

export async function updateFaq(
  input: z.input<typeof updateFaqSchema>,
): Promise<MutationResult<AdminFaq>> {
  const session = await requireAdminSession();

  if (!session) {
    return {
      ok: false,
      error: "Sesi admin tidak valid. Silakan login ulang.",
    };
  }

  const parsed = updateFaqSchema.safeParse(input);

  if (!parsed.success) {
    return {
      ok: false,
      error: getValidationErrorMessage(parsed.error),
    };
  }

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("faqs")
    .update({
      question: parsed.data.question,
      answer: parsed.data.answer,
      sort_order: parsed.data.sortOrder,
      is_active: parsed.data.isActive,
    })
    .eq("id", parsed.data.id)
    .select("id,question,answer,sort_order,is_active,updated_at")
    .single();

  if (error || !data) {
    return {
      ok: false,
      error: error?.message ?? "Gagal memperbarui FAQ.",
    };
  }

  return {
    ok: true,
    data: adminFaqSchema.parse(data),
  };
}

export async function deleteFaq(
  input: z.input<typeof deleteFaqSchema>,
): Promise<MutationResult<{ id: string }>> {
  const session = await requireAdminSession();

  if (!session) {
    return {
      ok: false,
      error: "Sesi admin tidak valid. Silakan login ulang.",
    };
  }

  const parsed = deleteFaqSchema.safeParse(input);

  if (!parsed.success) {
    return {
      ok: false,
      error: getValidationErrorMessage(parsed.error),
    };
  }

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("faqs")
    .delete()
    .eq("id", parsed.data.id)
    .select("id")
    .single();

  if (error || !data) {
    return {
      ok: false,
      error: error?.message ?? "Gagal menghapus FAQ.",
    };
  }

  return {
    ok: true,
    data: {
      id: data.id,
    },
  };
}

export async function createInvitationTemplate(
  input: z.input<typeof createInvitationTemplateSchema> & {
    previewFile?: File;
  },
): Promise<MutationResult<AdminTemplate>> {
  const session = await requireAdminSession();

  if (!session) {
    return {
      ok: false,
      error: "Sesi admin tidak valid. Silakan login ulang.",
    };
  }

  const parsed = createInvitationTemplateSchema.safeParse(input);

  if (!parsed.success) {
    return {
      ok: false,
      error: getValidationErrorMessage(parsed.error),
    };
  }

  const supabase = await createClient();
  const uploadedPreview = input.previewFile
    ? await uploadPublicStorageFile({
        bucket: "invitation-template",
        folder: "preview",
        file: input.previewFile,
        expectedType: "image",
      })
    : null;

  if (uploadedPreview && !uploadedPreview.ok) {
    return uploadedPreview;
  }

  const previewImageUrl =
    uploadedPreview?.data.publicUrl ??
    normalizeUrl(parsed.data.previewImageUrl);

  const { data, error } = await supabase
    .from("invitation_templates")
    .insert({
      slug: `${slugify(parsed.data.name) || "template"}-${Date.now()}`,
      name: parsed.data.name,
      theme: normalizeOptional(parsed.data.theme),
      original_price: parsed.data.originalPrice,
      promo_price: parsed.data.promoPrice,
      demo_url: normalizeUrl(parsed.data.demoUrl),
      preview_image_url: previewImageUrl,
      img_sig: parsed.data.imgSig ?? null,
      min_order_days: parsed.data.minOrderDays,
      sort_order: parsed.data.sortOrder,
      is_active: parsed.data.isActive,
      is_demo_ready: parsed.data.isDemoReady,
    })
    .select(
      "id,slug,name,theme,original_price,promo_price,demo_url,preview_image_url,img_sig,min_order_days,sort_order,is_active,is_demo_ready,updated_at",
    )
    .single();

  if (error || !data) {
    if (uploadedPreview?.ok) {
      await supabase.storage
        .from("invitation-template")
        .remove([uploadedPreview.data.storagePath]);
    }

    return {
      ok: false,
      error: error?.message ?? "Gagal menambah template undangan.",
    };
  }

  return {
    ok: true,
    data: adminInvitationTemplateSchema.parse(data),
  };
}

export async function updateInvitationTemplate(
  input: z.input<typeof updateInvitationTemplateSchema> & {
    previewFile?: File;
  },
): Promise<MutationResult<AdminTemplate>> {
  const session = await requireAdminSession();

  if (!session) {
    return {
      ok: false,
      error: "Sesi admin tidak valid. Silakan login ulang.",
    };
  }

  const parsed = updateInvitationTemplateSchema.safeParse(input);

  if (!parsed.success) {
    return {
      ok: false,
      error: getValidationErrorMessage(parsed.error),
    };
  }

  const supabase = await createClient();
  const uploadedPreview = input.previewFile
    ? await uploadPublicStorageFile({
        bucket: "invitation-template",
        folder: "preview",
        file: input.previewFile,
        expectedType: "image",
      })
    : null;

  if (uploadedPreview && !uploadedPreview.ok) {
    return uploadedPreview;
  }

  const previewImageUrl =
    uploadedPreview?.data.publicUrl ??
    normalizeUrl(parsed.data.previewImageUrl);

  const { data, error } = await supabase
    .from("invitation_templates")
    .update({
      name: parsed.data.name,
      theme: normalizeOptional(parsed.data.theme),
      original_price: parsed.data.originalPrice,
      promo_price: parsed.data.promoPrice,
      demo_url: normalizeUrl(parsed.data.demoUrl),
      preview_image_url: previewImageUrl,
      img_sig: parsed.data.imgSig ?? null,
      min_order_days: parsed.data.minOrderDays,
      sort_order: parsed.data.sortOrder,
      is_active: parsed.data.isActive,
      is_demo_ready: parsed.data.isDemoReady,
    })
    .eq("id", parsed.data.id)
    .select(
      "id,slug,name,theme,original_price,promo_price,demo_url,preview_image_url,img_sig,min_order_days,sort_order,is_active,is_demo_ready,updated_at",
    )
    .single();

  if (error || !data) {
    if (uploadedPreview?.ok) {
      await supabase.storage
        .from("invitation-template")
        .remove([uploadedPreview.data.storagePath]);
    }

    return {
      ok: false,
      error: error?.message ?? "Gagal memperbarui template undangan.",
    };
  }

  return {
    ok: true,
    data: adminInvitationTemplateSchema.parse(data),
  };
}

export async function deleteInvitationTemplate(
  input: z.input<typeof deleteInvitationTemplateSchema>,
): Promise<MutationResult<{ id: string }>> {
  const session = await requireAdminSession();

  if (!session) {
    return {
      ok: false,
      error: "Sesi admin tidak valid. Silakan login ulang.",
    };
  }

  const parsed = deleteInvitationTemplateSchema.safeParse(input);

  if (!parsed.success) {
    return {
      ok: false,
      error: getValidationErrorMessage(parsed.error),
    };
  }

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("invitation_templates")
    .delete()
    .eq("id", parsed.data.id)
    .select("id")
    .single();

  if (error || !data) {
    return {
      ok: false,
      error: error?.message ?? "Gagal menghapus template undangan.",
    };
  }

  return {
    ok: true,
    data: {
      id: data.id,
    },
  };
}

export async function updateWebsiteSettings(
  input: z.input<typeof updateWebsiteSettingsSchema>,
): Promise<MutationResult<AdminWebsiteSettings>> {
  const session = await requireAdminSession();

  if (!session) {
    return {
      ok: false,
      error: "Sesi admin tidak valid. Silakan login ulang.",
    };
  }

  const parsed = updateWebsiteSettingsSchema.safeParse(input);

  if (!parsed.success) {
    return {
      ok: false,
      error: getValidationErrorMessage(parsed.error),
    };
  }

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("website_settings")
    .upsert({
      id: true,
      brand_name: parsed.data.brandName,
      phone_whatsapp: parsed.data.phoneWhatsapp,
      email: normalizeOptional(parsed.data.email),
      instagram_url: normalizeOptional(parsed.data.instagramUrl),
      address: normalizeOptional(parsed.data.address),
      mc_whatsapp_template: parsed.data.mcWhatsappTemplate,
      invitation_whatsapp_template: parsed.data.invitationWhatsappTemplate,
    })
    .select(
      "brand_name,phone_whatsapp,email,instagram_url,address,mc_whatsapp_template,invitation_whatsapp_template,updated_at",
    )
    .single();

  if (error || !data) {
    return {
      ok: false,
      error: error?.message ?? "Gagal menyimpan setting website.",
    };
  }

  return {
    ok: true,
    data: adminWebsiteSettingsSchema.parse(data),
  };
}

export async function createTestimonial(
  input: z.input<typeof createTestimonialSchema> & {
    photoFile?: File;
  },
): Promise<MutationResult<AdminTestimonial>> {
  const session = await requireAdminSession();

  if (!session) {
    return {
      ok: false,
      error: "Sesi admin tidak valid. Silakan login ulang.",
    };
  }

  const parsed = createTestimonialSchema.safeParse(input);

  if (!parsed.success) {
    return {
      ok: false,
      error: getValidationErrorMessage(parsed.error),
    };
  }

  const supabase = await createClient();
  const uploadedPhoto = input.photoFile
    ? await uploadPublicStorageFile({
        bucket: "gallery",
        folder: "testimonials",
        file: input.photoFile,
        expectedType: "image",
      })
    : null;

  if (uploadedPhoto && !uploadedPhoto.ok) {
    return uploadedPhoto;
  }

  const photoUrl =
    uploadedPhoto?.data.publicUrl ?? normalizeOptional(parsed.data.photoUrl);
  const { data, error } = await supabase
    .from("testimonials")
    .insert({
      client_name: parsed.data.clientName,
      event_type: normalizeOptional(parsed.data.eventType),
      quote: parsed.data.quote,
      rating: parsed.data.rating,
      photo_url: photoUrl,
      sort_order: parsed.data.sortOrder,
      is_verified: parsed.data.isVerified,
      is_active: parsed.data.isActive,
    })
    .select(
      "id,client_name,event_type,quote,rating,photo_url,is_verified,sort_order,is_active,updated_at",
    )
    .single();

  if (error || !data) {
    if (uploadedPhoto?.ok) {
      await removeStorageFile({
        bucket: "gallery",
        path: uploadedPhoto.data.storagePath,
      });
    }

    return {
      ok: false,
      error: error?.message ?? "Gagal menambah testimoni.",
    };
  }

  return {
    ok: true,
    data: adminTestimonialSchema.parse(data),
  };
}

export async function updateTestimonial(
  input: z.input<typeof updateTestimonialSchema> & {
    photoFile?: File;
  },
): Promise<MutationResult<AdminTestimonial>> {
  const session = await requireAdminSession();

  if (!session) {
    return {
      ok: false,
      error: "Sesi admin tidak valid. Silakan login ulang.",
    };
  }

  const parsed = updateTestimonialSchema.safeParse(input);

  if (!parsed.success) {
    return {
      ok: false,
      error: getValidationErrorMessage(parsed.error),
    };
  }

  const supabase = await createClient();
  const uploadedPhoto = input.photoFile
    ? await uploadPublicStorageFile({
        bucket: "gallery",
        folder: "testimonials",
        file: input.photoFile,
        expectedType: "image",
      })
    : null;

  if (uploadedPhoto && !uploadedPhoto.ok) {
    return uploadedPhoto;
  }

  const photoUrl =
    uploadedPhoto?.data.publicUrl ?? normalizeOptional(parsed.data.photoUrl);
  const previousPhotoStoragePath = extractGalleryStoragePath(
    parsed.data.photoUrl,
  );

  const { data, error } = await supabase
    .from("testimonials")
    .update({
      client_name: parsed.data.clientName,
      event_type: normalizeOptional(parsed.data.eventType),
      quote: parsed.data.quote,
      rating: parsed.data.rating,
      photo_url: photoUrl,
      sort_order: parsed.data.sortOrder,
      is_verified: parsed.data.isVerified,
      is_active: parsed.data.isActive,
    })
    .eq("id", parsed.data.id)
    .select(
      "id,client_name,event_type,quote,rating,photo_url,is_verified,sort_order,is_active,updated_at",
    )
    .single();

  if (error || !data) {
    if (uploadedPhoto?.ok) {
      await removeStorageFile({
        bucket: "gallery",
        path: uploadedPhoto.data.storagePath,
      });
    }

    return {
      ok: false,
      error: error?.message ?? "Gagal memperbarui testimoni.",
    };
  }

  if (
    uploadedPhoto?.ok &&
    previousPhotoStoragePath &&
    previousPhotoStoragePath !== uploadedPhoto.data.storagePath
  ) {
    await removeStorageFile({
      bucket: "gallery",
      path: previousPhotoStoragePath,
    });
  }

  return {
    ok: true,
    data: adminTestimonialSchema.parse(data),
  };
}

export async function deleteTestimonial(
  input: z.input<typeof deleteTestimonialSchema>,
): Promise<MutationResult<{ id: string }>> {
  const session = await requireAdminSession();

  if (!session) {
    return {
      ok: false,
      error: "Sesi admin tidak valid. Silakan login ulang.",
    };
  }

  const parsed = deleteTestimonialSchema.safeParse(input);

  if (!parsed.success) {
    return {
      ok: false,
      error: getValidationErrorMessage(parsed.error),
    };
  }

  const supabase = await createClient();
  const { data: existing, error: existingError } = await supabase
    .from("testimonials")
    .select("photo_url")
    .eq("id", parsed.data.id)
    .maybeSingle();

  if (existingError) {
    return {
      ok: false,
      error: existingError.message,
    };
  }

  const { data, error } = await supabase
    .from("testimonials")
    .delete()
    .eq("id", parsed.data.id)
    .select("id")
    .single();

  if (error || !data) {
    return {
      ok: false,
      error: error?.message ?? "Gagal menghapus testimoni.",
    };
  }

  const existingPhotoStoragePath = extractGalleryStoragePath(
    existing?.photo_url,
  );

  if (existingPhotoStoragePath) {
    await removeStorageFile({
      bucket: "gallery",
      path: existingPhotoStoragePath,
    });
  }

  return {
    ok: true,
    data: {
      id: data.id,
    },
  };
}

export async function createGalleryItemWithUpload(input: {
  title: string;
  category: string;
  mediaType: "image" | "video";
  sortOrder?: number;
  isFeatured?: boolean;
  isActive?: boolean;
  file: File;
}): Promise<MutationResult<AdminGalleryItem>> {
  const session = await requireAdminSession();

  if (!session) {
    return {
      ok: false,
      error: "Sesi admin tidak valid. Silakan login ulang.",
    };
  }

  const parsed = createGalleryItemSchema.safeParse(input);

  if (!parsed.success) {
    return {
      ok: false,
      error: getValidationErrorMessage(parsed.error),
    };
  }

  if (!input.file || input.file.size === 0) {
    return {
      ok: false,
      error: "File media wajib dipilih.",
    };
  }

  if (input.file.size > 20 * 1024 * 1024) {
    return {
      ok: false,
      error: "Ukuran file maksimal 20MB.",
    };
  }

  if (!input.file.type.startsWith(`${parsed.data.mediaType}/`)) {
    return {
      ok: false,
      error: "Tipe file tidak sesuai dengan pilihan media.",
    };
  }

  const supabase = await createClient();
  const storagePath = `${parsed.data.mediaType}/${Date.now()}-${sanitizeStorageFileName(input.file.name)}`;
  const { error: uploadError } = await supabase.storage
    .from("gallery")
    .upload(storagePath, input.file, {
      contentType: input.file.type,
      upsert: false,
    });

  if (uploadError) {
    return {
      ok: false,
      error: uploadError.message,
    };
  }

  const {
    data: { publicUrl },
  } = supabase.storage.from("gallery").getPublicUrl(storagePath);

  const { data, error } = await supabase
    .from("gallery_items")
    .insert({
      title: parsed.data.title,
      category: parsed.data.category,
      media_type: parsed.data.mediaType,
      media_url: publicUrl,
      thumbnail_url: parsed.data.mediaType === "image" ? publicUrl : null,
      storage_path: storagePath,
      sort_order: parsed.data.sortOrder,
      is_featured: parsed.data.isFeatured,
      is_active: parsed.data.isActive,
    })
    .select(
      "id,title,category,media_type,media_url,thumbnail_url,storage_path,sort_order,is_featured,is_active,updated_at",
    )
    .single();

  if (error || !data) {
    await supabase.storage.from("gallery").remove([storagePath]);

    return {
      ok: false,
      error: error?.message ?? "Gagal menyimpan metadata galeri.",
    };
  }

  return {
    ok: true,
    data: adminGalleryItemSchema.parse(data),
  };
}

export async function updateGalleryItem(
  input: z.input<typeof updateGalleryItemSchema>,
): Promise<MutationResult<AdminGalleryItem>> {
  const session = await requireAdminSession();

  if (!session) {
    return {
      ok: false,
      error: "Sesi admin tidak valid. Silakan login ulang.",
    };
  }

  const parsed = updateGalleryItemSchema.safeParse(input);

  if (!parsed.success) {
    return {
      ok: false,
      error: getValidationErrorMessage(parsed.error),
    };
  }

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("gallery_items")
    .update({
      title: parsed.data.title,
      category: parsed.data.category,
      media_type: parsed.data.mediaType,
      sort_order: parsed.data.sortOrder,
      is_featured: parsed.data.isFeatured,
      is_active: parsed.data.isActive,
    })
    .eq("id", parsed.data.id)
    .select(
      "id,title,category,media_type,media_url,thumbnail_url,storage_path,sort_order,is_featured,is_active,updated_at",
    )
    .single();

  if (error || !data) {
    return {
      ok: false,
      error: error?.message ?? "Gagal memperbarui galeri.",
    };
  }

  return {
    ok: true,
    data: adminGalleryItemSchema.parse(data),
  };
}

export async function deleteGalleryItem(
  input: z.input<typeof deleteGalleryItemSchema>,
): Promise<MutationResult<{ id: string }>> {
  const session = await requireAdminSession();

  if (!session) {
    return {
      ok: false,
      error: "Sesi admin tidak valid. Silakan login ulang.",
    };
  }

  const parsed = deleteGalleryItemSchema.safeParse(input);

  if (!parsed.success) {
    return {
      ok: false,
      error: getValidationErrorMessage(parsed.error),
    };
  }

  const supabase = await createClient();
  const { data: existing } = await supabase
    .from("gallery_items")
    .select("storage_path")
    .eq("id", parsed.data.id)
    .maybeSingle();

  const { data, error } = await supabase
    .from("gallery_items")
    .delete()
    .eq("id", parsed.data.id)
    .select("id")
    .single();

  if (error || !data) {
    return {
      ok: false,
      error: error?.message ?? "Gagal menghapus galeri.",
    };
  }

  if (existing?.storage_path) {
    await supabase.storage.from("gallery").remove([existing.storage_path]);
  }

  return {
    ok: true,
    data: {
      id: data.id,
    },
  };
}

export async function createManualCalendarEvent(
  input: z.input<typeof createManualCalendarEventSchema>,
): Promise<MutationResult<AdminCalendarItem>> {
  const session = await requireAdminSession();

  if (!session) {
    return {
      ok: false,
      error: "Sesi admin tidak valid. Silakan login ulang.",
    };
  }

  const parsed = createManualCalendarEventSchema.safeParse(input);

  if (!parsed.success) {
    return {
      ok: false,
      error: getValidationErrorMessage(parsed.error),
    };
  }

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("calendar_events")
    .insert({
      title: parsed.data.title,
      event_date: parsed.data.eventDate,
      event_time: normalizeOptional(parsed.data.eventTime),
      event_kind: "manual",
      status: normalizeOptional(parsed.data.status),
      notes: normalizeOptional(parsed.data.notes),
      created_by: session.user.id,
      updated_by: session.user.id,
    })
    .select("id,title,event_date,event_time,event_kind,status,notes")
    .single();

  if (error || !data) {
    return {
      ok: false,
      error: error?.message ?? "Gagal menambah event manual.",
    };
  }

  return {
    ok: true,
    data: adminCalendarItemSchema.parse({
      id: data.id,
      public_id: null,
      title: data.title,
      event_date: data.event_date,
      event_time: data.event_time,
      event_kind: data.event_kind,
      status: data.status,
      description: data.notes,
    }),
  };
}

export async function deleteManualCalendarEvent(
  input: z.input<typeof deleteManualCalendarEventSchema>,
): Promise<MutationResult<{ id: string }>> {
  const session = await requireAdminSession();

  if (!session) {
    return {
      ok: false,
      error: "Sesi admin tidak valid. Silakan login ulang.",
    };
  }

  const parsed = deleteManualCalendarEventSchema.safeParse(input);

  if (!parsed.success) {
    return {
      ok: false,
      error: getValidationErrorMessage(parsed.error),
    };
  }

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("calendar_events")
    .delete()
    .eq("id", parsed.data.id)
    .eq("event_kind", "manual")
    .select("id")
    .single();

  if (error || !data) {
    return {
      ok: false,
      error: error?.message ?? "Gagal menghapus event manual.",
    };
  }

  return {
    ok: true,
    data: {
      id: data.id,
    },
  };
}

export async function createMcBooking(
  input: z.input<typeof createMcBookingSchema>,
): Promise<MutationResult<AdminBooking>> {
  const session = await requireAdminSession();

  if (!session) {
    return {
      ok: false,
      error: "Sesi admin tidak valid. Silakan login ulang.",
    };
  }

  const parsed = createMcBookingSchema.safeParse(input);

  if (!parsed.success) {
    return {
      ok: false,
      error: getValidationErrorMessage(parsed.error),
    };
  }

  const supabase = await createClient();
  const { data: service } = await supabase
    .from("mc_services")
    .select("id")
    .eq("title", parsed.data.serviceName)
    .maybeSingle();

  const { data, error } = await supabase
    .from("mc_bookings")
    .insert({
      client_name: parsed.data.clientName,
      phone: normalizeOptional(parsed.data.phone),
      event_date: parsed.data.eventDate,
      event_location: normalizeOptional(parsed.data.eventLocation),
      service_id: service?.id ?? null,
      service_name: parsed.data.serviceName,
      notes: normalizeOptional(parsed.data.notes),
      status: parsed.data.status,
      created_by: session.user.id,
      updated_by: session.user.id,
    })
    .select(
      "id,public_id,client_name,phone,event_date,event_location,service_name,notes,status,created_at,updated_at",
    )
    .single();

  if (error || !data) {
    return {
      ok: false,
      error: error?.message ?? "Gagal menambah booking MC.",
    };
  }

  return {
    ok: true,
    data: adminBookingSchema.parse(data),
  };
}

export async function updateMcBookingStatus(
  input: z.input<typeof updateMcBookingStatusSchema>,
): Promise<MutationResult<AdminBooking>> {
  const session = await requireAdminSession();

  if (!session) {
    return {
      ok: false,
      error: "Sesi admin tidak valid. Silakan login ulang.",
    };
  }

  const parsed = updateMcBookingStatusSchema.safeParse(input);

  if (!parsed.success) {
    return {
      ok: false,
      error: getValidationErrorMessage(parsed.error),
    };
  }

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("mc_bookings")
    .update({
      status: parsed.data.status,
      updated_by: session.user.id,
    })
    .eq("id", parsed.data.id)
    .select(
      "id,public_id,client_name,phone,event_date,event_location,service_name,notes,status,created_at,updated_at",
    )
    .single();

  if (error || !data) {
    return {
      ok: false,
      error: error?.message ?? "Gagal memperbarui status booking MC.",
    };
  }

  return {
    ok: true,
    data: adminBookingSchema.parse(data),
  };
}

export async function deleteMcBooking(
  input: z.input<typeof deleteMcBookingSchema>,
): Promise<MutationResult<{ id: string }>> {
  const session = await requireAdminSession();

  if (!session) {
    return {
      ok: false,
      error: "Sesi admin tidak valid. Silakan login ulang.",
    };
  }

  const parsed = deleteMcBookingSchema.safeParse(input);

  if (!parsed.success) {
    return {
      ok: false,
      error: getValidationErrorMessage(parsed.error),
    };
  }

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("mc_bookings")
    .delete()
    .eq("id", parsed.data.id)
    .select("id")
    .single();

  if (error || !data) {
    return {
      ok: false,
      error: error?.message ?? "Gagal menghapus booking MC.",
    };
  }

  return {
    ok: true,
    data: {
      id: data.id,
    },
  };
}

export async function createInvitationOrder(
  input: z.input<typeof createInvitationOrderSchema>,
): Promise<MutationResult<AdminInvitationOrder>> {
  const session = await requireAdminSession();

  if (!session) {
    return {
      ok: false,
      error: "Sesi admin tidak valid. Silakan login ulang.",
    };
  }

  const parsed = createInvitationOrderSchema.safeParse(input);

  if (!parsed.success) {
    return {
      ok: false,
      error: getValidationErrorMessage(parsed.error),
    };
  }

  const supabase = await createClient();
  const { data: template } = await supabase
    .from("invitation_templates")
    .select("id")
    .eq("name", parsed.data.templateName)
    .maybeSingle();

  const { data, error } = await supabase
    .from("invitation_orders")
    .insert({
      couple_name: parsed.data.coupleName,
      phone: normalizeOptional(parsed.data.phone),
      event_date: parsed.data.eventDate,
      target_completion_date: normalizeOptional(
        parsed.data.targetCompletionDate,
      ),
      event_location: parsed.data.eventLocation,
      template_id: template?.id ?? null,
      template_name: parsed.data.templateName,
      notes: normalizeOptional(parsed.data.notes),
      status: parsed.data.status,
      created_by: session.user.id,
      updated_by: session.user.id,
    })
    .select(
      "id,public_id,couple_name,phone,event_date,target_completion_date,event_location,template_name,notes,status,created_at,updated_at",
    )
    .single();

  if (error || !data) {
    return {
      ok: false,
      error: error?.message ?? "Gagal menambah pesanan undangan.",
    };
  }

  return {
    ok: true,
    data: adminInvitationOrderSchema.parse(data),
  };
}

export async function updateInvitationOrderStatus(
  input: z.input<typeof updateInvitationOrderStatusSchema>,
): Promise<MutationResult<AdminInvitationOrder>> {
  const session = await requireAdminSession();

  if (!session) {
    return {
      ok: false,
      error: "Sesi admin tidak valid. Silakan login ulang.",
    };
  }

  const parsed = updateInvitationOrderStatusSchema.safeParse(input);

  if (!parsed.success) {
    return {
      ok: false,
      error: getValidationErrorMessage(parsed.error),
    };
  }

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("invitation_orders")
    .update({
      status: parsed.data.status,
      updated_by: session.user.id,
    })
    .eq("id", parsed.data.id)
    .select(
      "id,public_id,couple_name,phone,event_date,target_completion_date,event_location,template_name,notes,status,created_at,updated_at",
    )
    .single();

  if (error || !data) {
    return {
      ok: false,
      error: error?.message ?? "Gagal memperbarui status pesanan undangan.",
    };
  }

  return {
    ok: true,
    data: adminInvitationOrderSchema.parse(data),
  };
}

export async function deleteInvitationOrder(
  input: z.input<typeof deleteInvitationOrderSchema>,
): Promise<MutationResult<{ id: string }>> {
  const session = await requireAdminSession();

  if (!session) {
    return {
      ok: false,
      error: "Sesi admin tidak valid. Silakan login ulang.",
    };
  }

  const parsed = deleteInvitationOrderSchema.safeParse(input);

  if (!parsed.success) {
    return {
      ok: false,
      error: getValidationErrorMessage(parsed.error),
    };
  }

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("invitation_orders")
    .delete()
    .eq("id", parsed.data.id)
    .select("id")
    .single();

  if (error || !data) {
    return {
      ok: false,
      error: error?.message ?? "Gagal menghapus pesanan undangan.",
    };
  }

  return {
    ok: true,
    data: {
      id: data.id,
    },
  };
}
