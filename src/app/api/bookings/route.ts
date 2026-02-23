import { NextResponse } from 'next/server'
import { z } from 'zod'
import { createAdminClient } from '@/lib/supabase/server'

// ─── Rate Limiting (in-memory sliding window) ────────────────
const rateLimitMap = new Map<string, number[]>()
const RATE_LIMIT_WINDOW_MS = 10 * 60_000 // 10 minutes
const RATE_LIMIT_MAX = 5 // max requests per window

function isRateLimited(ip: string): boolean {
    const now = Date.now()
    const timestamps = rateLimitMap.get(ip) ?? []
    const recent = timestamps.filter((t) => now - t < RATE_LIMIT_WINDOW_MS)
    if (recent.length >= RATE_LIMIT_MAX) return true
    recent.push(now)
    rateLimitMap.set(ip, recent)
    return false
}

// ─── Bot Protection (Turnstile/hCaptcha) ──────────────────────
async function validateBotToken(token: string) {
    if (!token) return false
    try {
        const secret = process.env.TURNSTILE_SECRET_KEY
        if (!secret) {
            console.warn('TURNSTILE_SECRET_KEY not set. Skipping validation.')
            return true
        }
        const res = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: `secret=${secret}&response=${token}`,
        })
        const data = await res.json()
        return data.success
    } catch (e) {
        console.error('Bot validation error:', e)
        return false
    }
}

// ─── Zod Schema ──────────────────────────────────────────────
const bookingSchema = z.object({
    purpose: z.enum([
        'medical', 'tourism', 'nri', 'hybrid',
        'cab', 'hotel', 'logistics', 'service',
    ]),
    details: z.record(z.string(), z.unknown()).default({}),
    contact: z.object({
        name: z.string().min(2, 'Name is required'),
        email: z.string().email('Valid email required'),
        phone: z.string().min(7, 'Valid phone required'),
        country: z.string().min(2, 'Country is required'),
    }),
    captchaToken: z.string().optional(),
})

// ─── POST handler ────────────────────────────────────────────
export async function POST(request: Request) {
    try {
        // Rate limiting
        const forwarded = request.headers.get('x-forwarded-for')
        const ip = forwarded?.split(',')[0]?.trim() ?? 'unknown'
        if (isRateLimited(ip)) {
            return NextResponse.json(
                { error: 'Too many requests. Please wait a few minutes.' },
                { status: 429 },
            )
        }

        // Parse & validate body
        const body = await request.json()

        // Bot validation
        if (process.env.TURNSTILE_SECRET_KEY) {
            const isValid = await validateBotToken(body.captchaToken)
            if (!isValid) {
                return NextResponse.json({ error: 'Bot validation failed' }, { status: 403 })
            }
        }

        const parsed = bookingSchema.safeParse(body)
        if (!parsed.success) {
            return NextResponse.json(
                { error: 'Invalid input', issues: parsed.error.flatten().fieldErrors },
                { status: 400 },
            )
        }
        const { purpose, details, contact } = parsed.data

        // Use admin client for privileged inserts
        const supabase = createAdminClient()

        // 1. Upsert client (by email)
        const { data: client, error: clientError } = await supabase
            .from('clients')
            .upsert(
                {
                    name: contact.name,
                    email: contact.email,
                    phone: contact.phone,
                    country: contact.country,
                },
                { onConflict: 'email' },
            )
            .select('id')
            .single()

        if (clientError || !client) {
            console.error('[/api/bookings] Client upsert error:', clientError)
            return NextResponse.json({ error: 'Failed to create client record' }, { status: 500 })
        }

        // 2. Insert booking
        const { data: booking, error: bookingError } = await supabase
            .from('bookings')
            .insert({
                client_id: client.id,
                purpose,
                details,
                status: 'pending',
            })
            .select('id')
            .single()

        if (bookingError || !booking) {
            console.error('[/api/bookings] Booking insert error:', bookingError)
            return NextResponse.json({ error: 'Failed to create booking' }, { status: 500 })
        }

        // 3. Create default task
        // (Also handled by DB trigger, but we do it explicitly for reliability)
        const { error: taskError } = await supabase
            .from('tasks')
            .insert({
                booking_id: booking.id,
                title: `Review new ${purpose} booking`,
                status: 'open',
            })

        if (taskError) {
            console.error('[/api/bookings] Task insert error:', taskError)
            // Non-critical: don't fail the booking
        }

        // 4. Create audit log
        const { error: auditError } = await supabase
            .from('audit_logs')
            .insert({
                table_name: 'bookings',
                record_id: booking.id,
                action: 'INSERT',
                actor: 'website',
                metadata: { purpose, client_id: client.id, contact_email: contact.email },
            })

        if (auditError) {
            console.error('[/api/bookings] Audit log error:', auditError)
            // Non-critical: don't fail the booking
        }

        // 5. Set session cookie for dashboard access
        const response = NextResponse.json({
            success: true,
            bookingId: booking.id,
            message: 'Your booking has been received. Our team will follow up shortly.',
        })

        response.cookies.set('roamio_token', `token_${booking.id}`, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            maxAge: 60 * 60 * 24 * 7, // 7 days
            path: '/',
        })

        return response
    } catch (error) {
        console.error('[/api/bookings] Unexpected error:', error)
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 },
        )
    }
}
