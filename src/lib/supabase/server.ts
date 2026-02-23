import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

/**
 * Server-side Supabase client for use in API routes and server components.
 * Uses the anon key by default for session-aware operations.
 * The service role key should only be used for admin operations.
 */
export async function createClient() {
    const cookieStore = await cookies()

    return createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
            cookies: {
                getAll() {
                    return cookieStore.getAll()
                },
                setAll(cookiesToSet) {
                    try {
                        cookiesToSet.forEach(({ name, value, options }) =>
                            cookieStore.set(name, value, options),
                        )
                    } catch {
                        // The `setAll` method is called from a Server Component
                        // which cannot set cookies. This can be ignored if middleware
                        // is refreshing user sessions.
                    }
                },
            },
        },
    )
}

/**
 * Admin Supabase client with service role key.
 * NEVER use this in client-side code or expose the key.
 * Use only in API routes for privileged operations.
 */
export function createAdminClient() {
    return createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.SUPABASE_SERVICE_ROLE_KEY!,
        {
            cookies: {
                getAll() { return [] },
                setAll() { /* no-op for admin client */ },
            },
        },
    )
}
