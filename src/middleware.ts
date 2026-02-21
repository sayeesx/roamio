import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl

    if (pathname.startsWith('/dashboard')) {
        const token = request.cookies.get('roamio_token')?.value
        if (!token) {
            const url = new URL('/plan/start', request.url)
            url.searchParams.set('redirect', pathname)
            return NextResponse.redirect(url)
        }
    }

    return NextResponse.next()
}

export const config = {
    matcher: ['/dashboard/:path*'],
}
