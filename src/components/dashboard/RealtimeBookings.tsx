'use client'

import { useRealtimeTable } from '@/lib/supabase/realtime'
import { Bell } from 'lucide-react'

interface Booking {
    id: string
    purpose: string
    status: string
    details: Record<string, unknown>
    created_at: string
}

const statusColors: Record<string, string> = {
    pending: 'bg-amber-100 text-amber-700',
    confirmed: 'bg-emerald-100 text-emerald-700',
    in_progress: 'bg-blue-100 text-blue-700',
    completed: 'bg-gray-100 text-gray-600',
    cancelled: 'bg-red-100 text-red-700',
}

function formatTime(iso: string) {
    const d = new Date(iso)
    const now = new Date()
    const diffMs = now.getTime() - d.getTime()
    const mins = Math.floor(diffMs / 60000)
    if (mins < 1) return 'Just now'
    if (mins < 60) return `${mins}m ago`
    const hrs = Math.floor(mins / 60)
    if (hrs < 24) return `${hrs}h ago`
    return d.toLocaleDateString()
}

export default function RealtimeBookings() {
    const { rows: bookings, newCount, resetNewCount, loading } = useRealtimeTable<Booking>({
        table: 'bookings',
        events: ['INSERT', 'UPDATE'],
    })

    if (loading) {
        return (
            <div className="bg-white rounded-2xl border border-[#E8E4DF] p-6 shadow-sm animate-pulse">
                <div className="h-5 bg-[#E8E4DF] rounded w-48 mb-4" />
                <div className="space-y-3">
                    {[1, 2, 3].map((i) => (
                        <div key={i} className="h-16 bg-[#F9F7F4] rounded-xl" />
                    ))}
                </div>
            </div>
        )
    }

    if (bookings.length === 0) {
        return (
            <div className="bg-white rounded-2xl border border-[#E8E4DF] p-6 shadow-sm">
                <h3 className="font-bold text-[#1C1C1E] mb-3">Live Bookings</h3>
                <p className="text-sm text-[#9CA3AF]">No bookings yet. New bookings will appear here in real time.</p>
            </div>
        )
    }

    return (
        <div className="bg-white rounded-2xl border border-[#E8E4DF] p-6 shadow-sm">
            <div className="flex items-center justify-between mb-5">
                <h3 className="font-bold text-[#1C1C1E]">Live Bookings</h3>
                {newCount > 0 && (
                    <button
                        onClick={resetNewCount}
                        className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#0D6E6E]/10 text-[#0D6E6E] text-xs font-semibold hover:bg-[#0D6E6E]/20 transition-colors"
                    >
                        <Bell size={12} />
                        {newCount} new
                    </button>
                )}
            </div>
            <div className="space-y-3 max-h-[400px] overflow-y-auto">
                {bookings.map((b) => (
                    <div
                        key={b.id}
                        className="flex items-center justify-between gap-4 p-4 rounded-xl bg-[#F9F7F4] border border-[#E8E4DF]"
                    >
                        <div className="min-w-0">
                            <p className="text-sm font-semibold text-[#1C1C1E] capitalize truncate">
                                {b.purpose.replace(/_/g, ' ')} booking
                            </p>
                            <p className="text-xs text-[#9CA3AF] font-mono truncate">{b.id.slice(0, 8)}…</p>
                        </div>
                        <div className="flex items-center gap-3 shrink-0">
                            <span className="text-xs text-[#9CA3AF]">{formatTime(b.created_at)}</span>
                            <span className={`text-xs font-semibold px-2 py-0.5 rounded-full capitalize ${statusColors[b.status] ?? 'bg-gray-100 text-gray-600'}`}>
                                {b.status.replace(/_/g, ' ')}
                            </span>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}
