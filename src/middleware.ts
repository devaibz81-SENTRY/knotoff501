import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname
  const isAuthRoute = path === '/admin/login'
  const isAdminRoute = path.startsWith('/admin')

  const isAuthenticated = request.cookies.get('admin_token')?.value === process.env.ADMIN_SECRET_TOKEN

  if (isAdminRoute && !isAuthRoute && !isAuthenticated) {
    return NextResponse.redirect(new URL('/admin/login', request.url))
  }

  if (isAuthRoute && isAuthenticated) {
    return NextResponse.redirect(new URL('/admin', request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/admin/:path*'],
}
