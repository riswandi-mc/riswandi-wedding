import "server-only"

import { cache } from "react"
import { redirect } from "next/navigation"
import type { User } from "@supabase/supabase-js"

import { getAdminSession, type AdminProfile } from "@/lib/data/admin"

export const getAuthContext = cache(async () => {
  const session = await getAdminSession()

  if (!session) {
    return {
      user: null,
      profile: null,
    }
  }

  return {
    user: session.user,
    profile: session.profile,
  }
})

export async function requireAdmin() {
  const context = await getAuthContext()

  if (!context.user || !context.profile) {
    redirect("/login")
  }

  return context as {
    user: User
    profile: AdminProfile
  }
}
