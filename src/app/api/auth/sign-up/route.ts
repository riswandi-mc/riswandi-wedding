import { NextResponse } from 'next/server'
import { createServerClient, setAuthCookies } from '@insforge/sdk/ssr'

export async function POST(request: Request) {
  const client = createServerClient()
  const body = await request.json()
  const { data, error } = await client.auth.signUp({
    email: body.email,
    password: body.password,
  })

  if (error || !data?.accessToken) {
    return Response.json(
      { error: error?.error ?? 'SIGNUP_FAILED', message: error?.message ?? 'Sign up failed' },
      { status: error?.statusCode ?? 400 }
    )
  }

  const response = NextResponse.json({ user: data.user })
  setAuthCookies(response.cookies, {
    accessToken: data.accessToken,
    refreshToken: data.refreshToken,
  })

  return response
}
