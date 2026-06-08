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

  // After refresh, check the response cookie (it may have been updated by updateSession)
  // Fall back to request cookie if response didn't set a new one
  const accessToken =
    response.cookies.get('insforge_access_token')?.value ||
    request.cookies.get('insforge_access_token')?.value

  const pathname = request.nextUrl.pathname

  // Protect /dashboard routes — redirect to /login if no access token
  if (pathname.startsWith('/dashboard') && !accessToken) {
    const loginUrl = request.nextUrl.clone()
    loginUrl.pathname = '/login'
    return NextResponse.redirect(loginUrl)
  }

  // Redirect logged-in users away from /login to /dashboard
  if (pathname === '/login' && accessToken) {
    const dashboardUrl = request.nextUrl.clone()
    dashboardUrl.pathname = '/dashboard'
    return NextResponse.redirect(dashboardUrl)
  }

  return response
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|api/).*)'],
}
