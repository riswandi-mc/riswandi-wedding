import "server-only"

import { cache } from "react"
import { unstable_cache } from "next/cache"
import { createClient as createSupabaseClient } from "@supabase/supabase-js"
import { z } from "zod"

import { supabaseAnonKey, supabaseUrl } from "@/lib/supabase/env"

const publicSettingsSchema = z.object({
  brand_name: z.string(),
  phone_whatsapp: z.string(),
  email: z.string().nullable(),
  instagram_url: z.string().nullable(),
  address: z.string().nullable(),
  mc_whatsapp_template: z.string(),
  invitation_whatsapp_template: z.string(),
})

const publicServiceSchema = z.object({
  slug: z.string(),
  title: z.string(),
  badge_label: z.string().nullable(),
  badge_variant: z.string().nullable(),
  short_description: z.string(),
  features: z.array(z.string()),
  sort_order: z.number().int(),
  is_featured: z.boolean(),
})

const publicInvitationTemplateSchema = z.object({
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
  is_demo_ready: z.boolean(),
})

const publicGalleryItemSchema = z.object({
  id: z.string().uuid(),
  title: z.string(),
  category: z.string(),
  media_type: z.enum(["image", "video"]),
  media_url: z.string(),
  thumbnail_url: z.string().nullable(),
  sort_order: z.number().int(),
  is_featured: z.boolean(),
})

const publicFaqSchema = z.object({
  id: z.string().uuid(),
  question: z.string(),
  answer: z.string(),
  sort_order: z.number().int(),
})

const publicTestimonialSchema = z.object({
  id: z.string().uuid(),
  client_name: z.string(),
  event_type: z.string().nullable(),
  quote: z.string(),
  rating: z.number().int(),
  photo_url: z.string().nullable(),
  is_verified: z.boolean(),
  sort_order: z.number().int(),
})

const publicHomepageSchema = z.object({
  settings: publicSettingsSchema.nullable(),
  services: z.array(publicServiceSchema),
  templates: z.array(publicInvitationTemplateSchema),
  gallery: z.array(publicGalleryItemSchema),
  faqs: z.array(publicFaqSchema),
  testimonials: z.array(publicTestimonialSchema),
})

export type PublicHomepageData = z.infer<typeof publicHomepageSchema>

export const emptyPublicHomepageData: PublicHomepageData = {
  settings: null,
  services: [],
  templates: [],
  gallery: [],
  faqs: [],
  testimonials: [],
}

async function fetchPublicHomepageData(): Promise<PublicHomepageData> {
  try {
    const supabase = createSupabaseClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
        detectSessionInUrl: false,
      },
    })
    const { data, error } = await supabase.rpc("get_public_homepage")

    if (error || !data) {
      return emptyPublicHomepageData
    }

    const parsed = publicHomepageSchema.safeParse(data)

    if (!parsed.success) {
      return emptyPublicHomepageData
    }

    return parsed.data
  } catch {
    return emptyPublicHomepageData
  }
}

const getCachedPublicHomepageData = unstable_cache(
  fetchPublicHomepageData,
  ["public-homepage-v1"],
  {
    tags: ["public-homepage"],
    revalidate: 300,
  },
)

export const getPublicHomepageData = cache(getCachedPublicHomepageData)

export const getPublicContactSettings = cache(async () => {
  const data = await getPublicHomepageData()
  return data.settings
})
