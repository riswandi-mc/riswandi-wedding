import { NextResponse, type NextRequest } from 'next/server'
import { updateSession } from '@insforge/sdk/ssr'

export async function middleware(request: NextRequest) {
  const response = NextResponse.next({ request })

  // Refresh the InsForge session so Server Components see fresh cookies
  await updateSession({
    requestCookies: request.cookies,
    responseCookies: response.cookies,
  })

  // Protect /dashboard routes — redirect to /login if no access token
  if (request.nextUrl.pathname.startsWith('/dashboard')) {
    const accessToken = request.cookies.get('insforge_access_token')?.value
    if (!accessToken) {
      const loginUrl = request.nextUrl.clone()
      loginUrl.pathname = '/login'
      return NextResponse.redirect(loginUrl)
    }
  }

  return response
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|api/).*)'],
}
