import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { createServerClient } from '@supabase/ssr'

export async function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl

    // Only protect dashboard routes
    if (!pathname.startsWith('/dashboard')) {
        return NextResponse.next()
    }

    // 1. Try Supabase session auth (primary)
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

    if (supabaseUrl && supabaseAnonKey) {
        let response = NextResponse.next({ request })

        const supabase = createServerClient(supabaseUrl, supabaseAnonKey, {
            cookies: {
                getAll() {
                    return request.cookies.getAll()
                },
                setAll(cookiesToSet) {
                    cookiesToSet.forEach(({ name, value }) =>
                        request.cookies.set(name, value),
                    )
                    response = NextResponse.next({ request })
                    cookiesToSet.forEach(({ name, value, options }) =>
                        response.cookies.set(name, value, options),
                    )
                },
            },
        })

        const {
            data: { user },
        } = await supabase.auth.getUser()

        if (!user) {
            // No Supabase session → redirect to login
            const url = new URL('/login', request.url)
            url.searchParams.set('redirect', pathname)
            return NextResponse.redirect(url)
        }

        // Check user role from profiles table
        const { data: profile } = await supabase
            .from('profiles')
            .select('role')
            .eq('id', user.id)
            .single()

        if (!profile) {
            return NextResponse.redirect(new URL('/unauthorized', request.url))
        }

        const allowedRoles = ['admin', 'operations', 'finance']
        if (!allowedRoles.includes(profile.role)) {
            return NextResponse.redirect(new URL('/unauthorized', request.url))
        }

        return response
    }

    // 2. Fallback: legacy cookie-based auth (during migration)
    const token = request.cookies.get('roamio_token')?.value
    if (!token) {
        const url = new URL('/plan/start', request.url)
        url.searchParams.set('redirect', pathname)
        return NextResponse.redirect(url)
    }

    return NextResponse.next()
}

export const config = {
    matcher: ['/dashboard/:path*'],
}
