import "server-only"

import { cache } from "react"
import { z } from "zod"
import type { User } from "@supabase/supabase-js"

import { createClient } from "@/lib/supabase/server"

const adminRoleSchema = z.enum(["admin", "super_admin"])

const adminProfileSchema = z.object({
  id: z.string().uuid(),
  email: z.string().email(),
  full_name: z.string().nullable(),
  role: adminRoleSchema,
  is_active: z.boolean(),
})

const dashboardMetricsSchema = z.object({
  pending_mc_bookings: z.number().int().nonnegative(),
  new_invitation_orders: z.number().int().nonnegative(),
  upcoming_events: z.number().int().nonnegative(),
  active_templates: z.number().int().nonnegative(),
  active_gallery_items: z.number().int().nonnegative(),
})

const adminBookingSchema = z.object({
  id: z.string().uuid(),
  public_id: z.string(),
  client_name: z.string(),
  phone: z.string().nullable(),
  event_date: z.string(),
  event_location: z.string().nullable(),
  service_name: z.string(),
  notes: z.string().nullable(),
  status: z.string(),
  created_at: z.string(),
  updated_at: z.string(),
})

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
  status: z.string(),
  created_at: z.string(),
  updated_at: z.string(),
})

const adminCalendarItemSchema = z.object({
  id: z.string().uuid(),
  public_id: z.string().nullable(),
  title: z.string(),
  event_date: z.string(),
  event_time: z.string().nullable(),
  event_kind: z.string(),
  status: z.string().nullable(),
  description: z.string().nullable(),
})

const adminWebsiteSettingsSchema = z.object({
  brand_name: z.string(),
  phone_whatsapp: z.string(),
  email: z.string().nullable(),
  instagram_url: z.string().nullable(),
  address: z.string().nullable(),
  mc_whatsapp_template: z.string(),
  invitation_whatsapp_template: z.string(),
  updated_at: z.string(),
})

export type AdminRole = z.infer<typeof adminRoleSchema>
export type AdminProfile = z.infer<typeof adminProfileSchema>
export type DashboardMetrics = z.infer<typeof dashboardMetricsSchema>
export type AdminBooking = z.infer<typeof adminBookingSchema>
export type AdminInvitationOrder = z.infer<typeof adminInvitationOrderSchema>
export type AdminCalendarItem = z.infer<typeof adminCalendarItemSchema>
export type AdminWebsiteSettings = z.infer<typeof adminWebsiteSettingsSchema>

type AdminSession = {
  user: User
  profile: AdminProfile
}

async function readAdminProfile(userId: string): Promise<AdminProfile | null> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from("profiles")
    .select("id,email,full_name,role,is_active")
    .eq("id", userId)
    .maybeSingle()

  if (error || !data) {
    return null
  }

  const parsed = adminProfileSchema.safeParse(data)

  if (!parsed.success || !parsed.data.is_active) {
    return null
  }

  return parsed.data
}

export const getAdminSession = cache(async (): Promise<AdminSession | null> => {
  const supabase = await createClient()
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser()

  if (error || !user) {
    return null
  }

  const profile = await readAdminProfile(user.id)

  if (!profile) {
    return null
  }

  return {
    user,
    profile,
  }
})

export const getDashboardMetrics = cache(async (): Promise<DashboardMetrics | null> => {
  const session = await getAdminSession()

  if (!session) {
    return null
  }

  const supabase = await createClient()
  const { data, error } = await supabase.rpc("get_admin_dashboard_metrics")

  if (error || !data) {
    return null
  }

  const parsed = dashboardMetricsSchema.safeParse(data)
  return parsed.success ? parsed.data : null
})

export async function listMcBookings(): Promise<AdminBooking[]> {
  const session = await getAdminSession()

  if (!session) {
    return []
  }

  const supabase = await createClient()
  const { data, error } = await supabase
    .from("mc_bookings")
    .select(
      "id,public_id,client_name,phone,event_date,event_location,service_name,notes,status,created_at,updated_at"
    )
    .order("created_at", { ascending: false })

  if (error || !data) {
    return []
  }

  return z.array(adminBookingSchema).parse(data)
}

export async function listInvitationOrders(): Promise<AdminInvitationOrder[]> {
  const session = await getAdminSession()

  if (!session) {
    return []
  }

  const supabase = await createClient()
  const { data, error } = await supabase
    .from("invitation_orders")
    .select(
      "id,public_id,couple_name,phone,event_date,target_completion_date,event_location,template_name,notes,status,created_at,updated_at"
    )
    .order("created_at", { ascending: false })

  if (error || !data) {
    return []
  }

  return z.array(adminInvitationOrderSchema).parse(data)
}

export async function listAdminCalendarItems(): Promise<AdminCalendarItem[]> {
  const session = await getAdminSession()

  if (!session) {
    return []
  }

  const supabase = await createClient()
  const { data, error } = await supabase
    .from("admin_calendar_items")
    .select("id,public_id,title,event_date,event_time,event_kind,status,description")
    .order("event_date", { ascending: true })

  if (error || !data) {
    return []
  }

  return z.array(adminCalendarItemSchema).parse(data)
}

export const getAdminWebsiteSettings = cache(async (): Promise<AdminWebsiteSettings | null> => {
  const session = await getAdminSession()

  if (!session) {
    return null
  }

  const supabase = await createClient()
  const { data, error } = await supabase
    .from("website_settings")
    .select(
      "brand_name,phone_whatsapp,email,instagram_url,address,mc_whatsapp_template,invitation_whatsapp_template,updated_at"
    )
    .eq("id", true)
    .maybeSingle()

  if (error || !data) {
    return null
  }

  const parsed = adminWebsiteSettingsSchema.safeParse(data)
  return parsed.success ? parsed.data : null
})
