function requireEnv(
  name:
    | "NEXT_PUBLIC_SUPABASE_URL"
    | "NEXT_PUBLIC_SUPABASE_ANON_KEY"
    | "SUPABASE_SERVICE_ROLE_KEY"
) {
  const value = process.env[name]

  if (!value) {
    throw new Error(`Missing environment variable: ${name}`)
  }

  return value
}

export const supabaseUrl = requireEnv("NEXT_PUBLIC_SUPABASE_URL")
export const supabaseAnonKey = requireEnv("NEXT_PUBLIC_SUPABASE_ANON_KEY")

export function getServiceRoleKey() {
  return requireEnv("SUPABASE_SERVICE_ROLE_KEY")
}
