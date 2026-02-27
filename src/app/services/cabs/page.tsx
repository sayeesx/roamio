import { getCabStatsAction } from './actions'
import { CabsPageClient } from './CabsPageClient'
import type { Metadata } from 'next'

export const metadata: Metadata = {
    title: 'Cab & Local Transport in Kerala — Roamio',
    description: 'Book reliable cabs with professional drivers across Kerala. Real-time driver matching, transparent pricing, and premium service. Airport transfers, inter-city travel, and sightseeing.',
}

export default async function CabsPage() {
    // Fetch stats on server side
    const stats = await getCabStatsAction().catch(() => ({
        availableDrivers: 50,
        totalCities: 45,
        completedTrips: 5000,
        avgRating: 4.7,
    }))

    return <CabsPageClient stats={stats} />
}
