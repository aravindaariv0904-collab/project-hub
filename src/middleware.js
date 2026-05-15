import { createServerClient } from '@supabase/ssr'
import { NextResponse } from 'next/server'
import { DEMO_COOKIE, DEMO_COOKIE_VALUE } from '@/lib/demo/demoSession'

export async function middleware(request) {
  const { pathname } = request.nextUrl

  // Public paths — never block
  const publicPaths = ['/', '/auth/verify']
  if (publicPaths.includes(pathname)) {
    return NextResponse.next({ request })
  }

  // ── Demo Mode Bypass ──────────────────────────────────────────
  const demoCookie = request.cookies.get(DEMO_COOKIE)
  if (demoCookie?.value === DEMO_COOKIE_VALUE) {
    return NextResponse.next({ request })
  }

  // ── Supabase Auth Check ───────────────────────────────────────
  let supabaseResponse = NextResponse.next({ request })

  try {
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
      {
        cookies: {
          getAll() { return request.cookies.getAll() },
          setAll(cookiesToSet) {
            cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
            supabaseResponse = NextResponse.next({ request })
            cookiesToSet.forEach(({ name, value, options }) =>
              supabaseResponse.cookies.set(name, value, options)
            )
          },
        },
      }
    )

    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      const url = request.nextUrl.clone()
      url.pathname = '/auth/verify'
      return NextResponse.redirect(url)
    }
  } catch {
    // Supabase env missing — redirect to auth
    const url = request.nextUrl.clone()
    url.pathname = '/auth/verify'
    return NextResponse.redirect(url)
  }

  return supabaseResponse
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
