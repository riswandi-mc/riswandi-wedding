"use server"

import { z } from "zod"

import { createClient } from "@/lib/supabase/server"

const isoDateSchema = z
  .string()
  .trim()
  .regex(/^\d{4}-\d{2}-\d{2}$/, "Format tanggal tidak valid.")

const mcBookingSchema = z.object({
  clientName: z.string().trim().min(2, "Nama wajib diisi minimal 2 karakter."),
  phone: z.string().trim().min(8, "Nomor WhatsApp wajib diisi."),
  eventDate: isoDateSchema,
  serviceName: z.string().trim().min(1, "Pilihan layanan wajib diisi."),
  eventLocation: z.string().trim().optional(),
  notes: z.string().trim().optional(),
})

const invitationOrderSchema = z.object({
  coupleName: z.string().trim().min(2, "Nama mempelai wajib diisi minimal 2 karakter."),
  phone: z.string().trim().min(8, "Nomor WhatsApp wajib diisi."),
  eventDate: isoDateSchema,
  targetCompletionDate: isoDateSchema.optional(),
  eventLocation: z.string().trim().min(2, "Lokasi acara wajib diisi."),
  templateName: z.string().trim().min(1, "Pilihan template wajib diisi."),
  notes: z.string().trim().optional(),
})

export type PublicSubmissionResult =
  | {
      ok: true
      publicId: string
      whatsappMessage: string
    }
  | {
      ok: false
      error: string
    }

function normalizeOptional(value?: string) {
  if (!value) {
    return null
  }

  const trimmed = value.trim()
  return trimmed.length > 0 ? trimmed : null
}

export async function submitMcBooking(
  input: z.input<typeof mcBookingSchema>
): Promise<PublicSubmissionResult> {
  const parsed = mcBookingSchema.safeParse(input)

  if (!parsed.success) {
    return {
      ok: false,
      error: parsed.error.issues[0]?.message ?? "Data booking tidak valid.",
    }
  }

  const supabase = await createClient()
  const { data, error } = await supabase.rpc("submit_mc_booking", {
    p_client_name: parsed.data.clientName,
    p_phone: parsed.data.phone,
    p_event_date: parsed.data.eventDate,
    p_service_name: parsed.data.serviceName,
    p_event_location: normalizeOptional(parsed.data.eventLocation),
    p_notes: normalizeOptional(parsed.data.notes),
  })

  const result = Array.isArray(data) ? data[0] : null

  if (error || !result) {
    return {
      ok: false,
      error: error?.message ?? "Booking gagal dikirim. Silakan coba lagi.",
    }
  }

  return {
    ok: true,
    publicId: result.public_id,
    whatsappMessage: result.whatsapp_message,
  }
}

export async function submitInvitationOrder(
  input: z.input<typeof invitationOrderSchema>
): Promise<PublicSubmissionResult> {
  const parsed = invitationOrderSchema.safeParse(input)

  if (!parsed.success) {
    return {
      ok: false,
      error: parsed.error.issues[0]?.message ?? "Data pesanan tidak valid.",
    }
  }

  const supabase = await createClient()
  const { data, error } = await supabase.rpc("submit_invitation_order", {
    p_couple_name: parsed.data.coupleName,
    p_phone: parsed.data.phone,
    p_event_date: parsed.data.eventDate,
    p_target_completion_date: normalizeOptional(parsed.data.targetCompletionDate),
    p_event_location: parsed.data.eventLocation,
    p_template_name: parsed.data.templateName,
    p_notes: normalizeOptional(parsed.data.notes),
  })

  const result = Array.isArray(data) ? data[0] : null

  if (error || !result) {
    return {
      ok: false,
      error: error?.message ?? "Pesanan undangan gagal dikirim. Silakan coba lagi.",
    }
  }

  return {
    ok: true,
    publicId: result.public_id,
    whatsappMessage: result.whatsapp_message,
  }
}
