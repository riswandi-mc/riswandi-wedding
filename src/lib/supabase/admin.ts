import "server-only"

import { createClient as createSupabaseClient } from "@supabase/supabase-js"

import { getServiceRoleKey, supabaseUrl } from "@/lib/supabase/env"

export function createAdminClient() {
  return createSupabaseClient(supabaseUrl, getServiceRoleKey(), {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  })
}
