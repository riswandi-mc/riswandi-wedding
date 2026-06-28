"use server"

import { revalidatePath } from "next/cache"

import {
  createFaq,
  createGalleryItemWithUpload,
  createInvitationOrder,
  createInvitationTemplate,
  createManualCalendarEvent,
  createMcBooking,
  createMcService,
  deleteFaq,
  deleteGalleryItem,
  deleteInvitationOrder,
  deleteInvitationTemplate,
  deleteManualCalendarEvent,
  deleteMcBooking,
  deleteMcService,
  updateFaq,
  updateGalleryItem,
  updateInvitationOrderStatus,
  updateInvitationTemplate,
  updateMcBookingStatus,
  updateMcService,
  updateWebsiteSettings,
} from "@/lib/data/admin"

function revalidateAdminLeadPaths() {
  revalidatePath("/dashboard")
  revalidatePath("/dashboard/booking-mc")
  revalidatePath("/dashboard/pesanan-undangan")
  revalidatePath("/dashboard/calendar")
}

function revalidatePublicContentPaths() {
  revalidatePath("/")
  revalidatePath("/layanan-mc")
  revalidatePath("/dashboard")
  revalidatePath("/dashboard/layanan-mc")
  revalidatePath("/dashboard/faq")
  revalidatePath("/dashboard/template-undangan")
  revalidatePath("/dashboard/setting")
  revalidatePath("/dashboard/galeri")
}

function revalidateCalendarPaths() {
  revalidatePath("/dashboard")
  revalidatePath("/dashboard/calendar")
}

export async function createAdminMcBooking(input: {
  clientName: string
  phone?: string
  eventDate: string
  eventLocation?: string
  serviceName: string
  notes?: string
  status?: "pending" | "followed_up" | "deal" | "canceled"
}) {
  const result = await createMcBooking(input)

  if (result.ok) {
    revalidateAdminLeadPaths()

    return {
      ok: true as const,
      booking: result.data,
    }
  }

  return result
}

export async function updateAdminMcBookingStatus(input: {
  id: string
  status: "pending" | "followed_up" | "deal" | "canceled"
}) {
  const result = await updateMcBookingStatus(input)

  if (result.ok) {
    revalidateAdminLeadPaths()

    return {
      ok: true as const,
      booking: result.data,
    }
  }

  return result
}

export async function deleteAdminMcBooking(input: { id: string }) {
  const result = await deleteMcBooking(input)

  if (result.ok) {
    revalidateAdminLeadPaths()
  }

  return result
}

export async function createAdminMcService(input: {
  title: string
  badgeLabel?: string
  badgeVariant?: string
  shortDescription: string
  features: string[]
  sortOrder?: number
  isFeatured?: boolean
  isActive?: boolean
}) {
  const result = await createMcService(input)

  if (result.ok) {
    revalidatePublicContentPaths()
    revalidatePath("/dashboard/booking-mc")

    return {
      ok: true as const,
      service: result.data,
    }
  }

  return result
}

export async function updateAdminMcService(input: {
  id: string
  title: string
  badgeLabel?: string
  badgeVariant?: string
  shortDescription: string
  features: string[]
  sortOrder?: number
  isFeatured?: boolean
  isActive?: boolean
}) {
  const result = await updateMcService(input)

  if (result.ok) {
    revalidatePublicContentPaths()
    revalidatePath("/dashboard/booking-mc")

    return {
      ok: true as const,
      service: result.data,
    }
  }

  return result
}

export async function deleteAdminMcService(input: { id: string }) {
  const result = await deleteMcService(input)

  if (result.ok) {
    revalidatePublicContentPaths()
    revalidatePath("/dashboard/booking-mc")
  }

  return result
}

export async function createAdminInvitationOrder(input: {
  coupleName: string
  phone?: string
  eventDate: string
  targetCompletionDate?: string
  eventLocation: string
  templateName: string
  notes?: string
  status?: "new" | "in_progress" | "review" | "done" | "canceled"
}) {
  const result = await createInvitationOrder(input)

  if (result.ok) {
    revalidateAdminLeadPaths()

    return {
      ok: true as const,
      order: result.data,
    }
  }

  return result
}

export async function updateAdminInvitationOrderStatus(input: {
  id: string
  status: "new" | "in_progress" | "review" | "done" | "canceled"
}) {
  const result = await updateInvitationOrderStatus(input)

  if (result.ok) {
    revalidateAdminLeadPaths()

    return {
      ok: true as const,
      order: result.data,
    }
  }

  return result
}

export async function deleteAdminInvitationOrder(input: { id: string }) {
  const result = await deleteInvitationOrder(input)

  if (result.ok) {
    revalidateAdminLeadPaths()
  }

  return result
}

export async function createAdminFaq(input: {
  question: string
  answer: string
  sortOrder?: number
  isActive?: boolean
}) {
  const result = await createFaq(input)

  if (result.ok) {
    revalidatePublicContentPaths()

    return {
      ok: true as const,
      faq: result.data,
    }
  }

  return result
}

export async function updateAdminFaq(input: {
  id: string
  question: string
  answer: string
  sortOrder?: number
  isActive?: boolean
}) {
  const result = await updateFaq(input)

  if (result.ok) {
    revalidatePublicContentPaths()

    return {
      ok: true as const,
      faq: result.data,
    }
  }

  return result
}

export async function deleteAdminFaq(input: { id: string }) {
  const result = await deleteFaq(input)

  if (result.ok) {
    revalidatePublicContentPaths()
  }

  return result
}

function getOptionalUploadFile(formData: FormData, key: string) {
  const file = formData.get(key)
  return file instanceof File && file.size > 0 ? file : undefined
}

function getInvitationTemplateInput(formData: FormData) {
  return {
    name: String(formData.get("name") ?? ""),
    theme: String(formData.get("theme") ?? ""),
    originalPrice: Number(formData.get("originalPrice") ?? 59000),
    promoPrice: Number(formData.get("promoPrice") ?? 39000),
    demoUrl: String(formData.get("demoUrl") ?? ""),
    previewImageUrl: String(formData.get("previewImageUrl") ?? ""),
    imgSig: Number(formData.get("imgSig") ?? 1),
    minOrderDays: Number(formData.get("minOrderDays") ?? 7),
    sortOrder: Number(formData.get("sortOrder") ?? 0),
    isActive: formData.get("isActive") !== "false",
    isDemoReady: formData.get("isDemoReady") !== "false",
    previewFile: getOptionalUploadFile(formData, "previewFile"),
  }
}

export async function createAdminInvitationTemplate(formData: FormData) {
  const result = await createInvitationTemplate(getInvitationTemplateInput(formData))

  if (result.ok) {
    revalidatePublicContentPaths()

    return {
      ok: true as const,
      template: result.data,
    }
  }

  return result
}

export async function updateAdminInvitationTemplate(formData: FormData) {
  const result = await updateInvitationTemplate({
    id: String(formData.get("id") ?? ""),
    ...getInvitationTemplateInput(formData),
  })

  if (result.ok) {
    revalidatePublicContentPaths()

    return {
      ok: true as const,
      template: result.data,
    }
  }

  return result
}

export async function deleteAdminInvitationTemplate(input: { id: string }) {
  const result = await deleteInvitationTemplate(input)

  if (result.ok) {
    revalidatePublicContentPaths()
  }

  return result
}

export async function updateAdminWebsiteSettings(input: {
  brandName: string
  phoneWhatsapp: string
  email?: string
  instagramUrl?: string
  address?: string
  mcWhatsappTemplate: string
  invitationWhatsappTemplate: string
}) {
  const result = await updateWebsiteSettings(input)

  if (result.ok) {
    revalidatePublicContentPaths()

    return {
      ok: true as const,
      settings: result.data,
    }
  }

  return result
}

export async function createAdminGalleryItem(formData: FormData) {
  const file = formData.get("file")

  if (!(file instanceof File)) {
    return {
      ok: false as const,
      error: "File media wajib dipilih.",
    }
  }

  const result = await createGalleryItemWithUpload({
    title: String(formData.get("title") ?? ""),
    category: String(formData.get("category") ?? ""),
    mediaType: String(formData.get("mediaType") ?? "image") as "image" | "video",
    sortOrder: Number(formData.get("sortOrder") ?? 0),
    isFeatured: formData.get("isFeatured") === "true",
    isActive: formData.get("isActive") !== "false",
    file,
  })

  if (result.ok) {
    revalidatePublicContentPaths()

    return {
      ok: true as const,
      item: result.data,
    }
  }

  return result
}

export async function updateAdminGalleryItem(input: {
  id: string
  title: string
  category: string
  mediaType: "image" | "video"
  sortOrder?: number
  isFeatured?: boolean
  isActive?: boolean
}) {
  const result = await updateGalleryItem(input)

  if (result.ok) {
    revalidatePublicContentPaths()

    return {
      ok: true as const,
      item: result.data,
    }
  }

  return result
}

export async function deleteAdminGalleryItem(input: { id: string }) {
  const result = await deleteGalleryItem(input)

  if (result.ok) {
    revalidatePublicContentPaths()
  }

  return result
}

export async function createAdminManualCalendarEvent(input: {
  title: string
  eventDate: string
  eventTime?: string
  notes?: string
  status?: string
}) {
  const result = await createManualCalendarEvent(input)

  if (result.ok) {
    revalidateCalendarPaths()

    return {
      ok: true as const,
      event: result.data,
    }
  }

  return result
}

export async function deleteAdminManualCalendarEvent(input: { id: string }) {
  const result = await deleteManualCalendarEvent(input)

  if (result.ok) {
    revalidateCalendarPaths()
  }

  return result
}
