"use server"

import { redirect } from "next/navigation"
import { z } from "zod"

import { getAuthContext } from "@/lib/auth"
import { createClient } from "@/lib/supabase/server"

const loginSchema = z.object({
  email: z.email("Email tidak valid.").trim(),
  password: z.string().min(8, "Password minimal 8 karakter."),
})

export type LoginFormState =
  | {
      error: string | null
    }
  | undefined

export async function login(
  _state: LoginFormState,
  formData: FormData
): Promise<LoginFormState> {
  const parsed = loginSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
  })

  if (!parsed.success) {
    return {
      error: parsed.error.issues[0]?.message ?? "Input login tidak valid.",
    }
  }

  const supabase = await createClient()
  const { error } = await supabase.auth.signInWithPassword(parsed.data)

  if (error) {
    return {
      error: "Email atau password salah.",
    }
  }

  const {
    profile,
  } = await getAuthContext()

  if (!profile) {
    await supabase.auth.signOut()

    return {
      error: "Akun ini tidak memiliki akses admin.",
    }
  }

  redirect("/dashboard")
}

export async function logout() {
  const supabase = await createClient()
  await supabase.auth.signOut()
  redirect("/login")
}
