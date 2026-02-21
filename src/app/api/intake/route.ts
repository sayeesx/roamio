import { NextResponse } from 'next/server'

export async function POST(request: Request) {
    try {
        const body = await request.json()
        const { purpose, details, contact } = body

        if (!purpose || !contact?.email || !contact?.name) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
        }

        // In production: save to database, trigger AI plan generation, send email confirmation
        const planId = `PLAN-${Date.now()}`

        // Simulate processing delay
        await new Promise((r) => setTimeout(r, 200))

        const response = NextResponse.json({
            success: true,
            planId,
            message: 'Your plan request has been received. Our AI is generating your personalized plan.',
            estimatedDelivery: '24–48 hours',
        })

        // Set a session token cookie for dashboard access (MVP)
        response.cookies.set('roamio_token', `token_${planId}`, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            maxAge: 60 * 60 * 24 * 7, // 7 days
            path: '/',
        })

        return response
    } catch (error) {
        console.error('[/api/intake] Error:', error)
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
    }
}
