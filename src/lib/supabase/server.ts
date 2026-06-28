import "server-only"

import { cookies } from "next/headers"
import { createServerClient } from "@supabase/ssr"

import { supabaseAnonKey, supabaseUrl } from "@/lib/supabase/env"

export async function createClient() {
  const cookieStore = await cookies()

  return createServerClient(supabaseUrl, supabaseAnonKey, {
    cookies: {
      getAll() {
        return cookieStore.getAll()
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value, options }) => {
          try {
            cookieStore.set(name, value, options)
          } catch {
            // Server Components may only read cookies. Session cookie writes still work
            // when this client is used from Server Actions, Route Handlers, or proxy.
          }
        })
      },
    },
  })
}
