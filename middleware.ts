import { NextResponse, type NextRequest } from 'next/server'
import { updateSession } from '@insforge/sdk/ssr'

export async function middleware(request: NextRequest) {
  const response = NextResponse.next({ request })

  // Refresh the InsForge session so Server Components see fresh cookies
  try {
    await updateSession({
      requestCookies: request.cookies as unknown as Parameters<typeof updateSession>[0]['requestCookies'],
      responseCookies: response.cookies as unknown as Parameters<typeof updateSession>[0]['responseCookies'],
    })
  } catch {
    // Silently ignore refresh errors in middleware
  }

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
