'use client'

import { useEffect, useState, useCallback } from 'react'
import { createClient } from '@/lib/supabase/client'
import type { RealtimePostgresChangesPayload } from '@supabase/supabase-js'

type PostgresChangeEvent = 'INSERT' | 'UPDATE' | 'DELETE'

interface UseRealtimeTableOptions {
    table: string
    events?: PostgresChangeEvent[]
    schema?: string
}

/**
 * Subscribe to realtime Postgres changes on a Supabase table.
 * Returns live rows (most recent first) and a count of new inserts since mount.
 *
 * Usage:
 *   const { rows, newCount, resetNewCount } = useRealtimeTable<Booking>({
 *       table: 'bookings',
 *       events: ['INSERT', 'UPDATE'],
 *   })
 */
export function useRealtimeTable<T extends { id: string }>({
    table,
    events = ['INSERT', 'UPDATE'],
    schema = 'public',
}: UseRealtimeTableOptions) {
    const [rows, setRows] = useState<T[]>([])
    const [newCount, setNewCount] = useState(0)
    const [loading, setLoading] = useState(true)

    // Reset notification badge
    const resetNewCount = useCallback(() => setNewCount(0), [])

    useEffect(() => {
        const supabase = createClient()

        // Initial fetch
        const fetchRows = async () => {
            const { data, error } = await supabase
                .from(table)
                .select('*')
                .order('created_at', { ascending: false })
                .limit(100)

            if (!error && data) {
                setRows(data as T[])
            }
            setLoading(false)
        }

        fetchRows()

        // Subscribe to changes
        const channel = supabase
            .channel(`realtime-${table}`)
            .on(
                'postgres_changes' as never,
                {
                    event: events.length === 1 ? events[0] : '*',
                    schema,
                    table,
                },
                (payload: RealtimePostgresChangesPayload<T>) => {
                    if (payload.eventType === 'INSERT') {
                        setRows((prev) => [payload.new as T, ...prev])
                        setNewCount((c) => c + 1)
                    } else if (payload.eventType === 'UPDATE') {
                        setRows((prev) =>
                            prev.map((row) =>
                                row.id === (payload.new as T).id
                                    ? (payload.new as T)
                                    : row,
                            ),
                        )
                    } else if (payload.eventType === 'DELETE') {
                        setRows((prev) =>
                            prev.filter(
                                (row) => row.id !== (payload.old as T).id,
                            ),
                        )
                    }
                },
            )
            .subscribe()

        return () => {
            supabase.removeChannel(channel)
        }
    }, [table, schema, events])

    return { rows, newCount, resetNewCount, loading }
}
