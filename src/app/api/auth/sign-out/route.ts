import { NextResponse } from 'next/server'
import { createServerClient, clearAuthCookies } from '@insforge/sdk/ssr'

export async function POST() {
  const client = createServerClient()

  // Call the Insforge backend to invalidate the session
  try {
    await client.auth.signOut()
  } catch {
    // Even if the backend call fails, we still clear the cookies
  }

  const response = NextResponse.json({ success: true })
  clearAuthCookies(response.cookies)

  return response
}
