import { Download, MessageCircle, FileText, Building2, BedDouble, Map, Wallet } from 'lucide-react'
import { SectionContainer } from '@/components/ui/SectionContainer'
import { StatusBadge } from '@/components/ui/Cards'
import type { Metadata } from 'next'

export const metadata: Metadata = {
    title: 'My Dashboard — Roamio',
    description: 'Your personalized Kerala plan, recommendations, itinerary, and status updates from Roamio.',
}

// Static mock data for MVP
const mockPlan = {
    id: 'PLAN-2026-001',
    status: 'pending' as const,
    purpose: 'Medical Visit',
    traveler: 'Ahmed Al-Rashidi',
    destination: 'Kochi, Kerala',
    dates: 'March 10 – March 30, 2026',
    budget: '$5,000 – $10,000',
    hospitals: [
        { name: 'Kottakkal Arya Vaidya Sala', specialty: 'Ayurveda & Panchakarma', location: 'Kottakkal, Malappuram', match: '98% match' },
        { name: 'Aster Medcity', specialty: 'Multi-specialty care', location: 'Kochi', match: '87% match' },
    ],
    stays: [
        { name: 'CGH Earth Evolve', type: 'Medical-adjacent stay', location: '2km from Aster Medcity', price: '$80/night' },
        { name: 'Brunton Boatyard', type: 'Heritage hotel', location: 'Fort Kochi', price: '$120/night' },
    ],
    itinerary: [
        { day: 'Day 1', activity: 'Arrival, airport transfer, check-in, initial rest' },
        { day: 'Day 2–3', activity: 'Initial consultation at Aster Medcity, diagnostic tests' },
        { day: 'Day 4–14', activity: 'Panchakarma treatment at Kottakkal (daily 4-hr sessions)' },
        { day: 'Day 15–17', activity: 'Rest & acclimatization — day trips to Munnar and Backwaters' },
        { day: 'Day 18–20', activity: 'Follow-up consultation, medications collected, departure prep' },
    ],
}

export default function DashboardPage() {
    return (
        <div className="min-h-screen bg-[#F9F7F4] pt-24 pb-16">
            <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div>
                        <p className="text-sm text-[#6B7280] mb-1">Welcome back,</p>
                        <h1 className="text-2xl sm:text-3xl font-bold text-[#1C1C1E]">{mockPlan.traveler}</h1>
                    </div>
                    <div className="flex gap-3">
                        <button className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-[#E8E4DF] bg-white text-sm font-medium text-[#6B7280] hover:border-[#0D6E6E] hover:text-[#0D6E6E] transition-all">
                            <Download size={16} /> Download PDF
                        </button>
                        <button className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#25D366] text-white text-sm font-medium hover:bg-[#1ebe5d] transition-colors">
                            <MessageCircle size={16} /> Chat Support
                        </button>
                    </div>
                </div>

                {/* Plan summary card */}
                <div className="bg-white rounded-2xl border border-[#E8E4DF] p-6 mb-6 shadow-sm">
                    <div className="flex items-start justify-between gap-4 flex-wrap">
                        <div>
                            <div className="flex items-center gap-2 mb-3">
                                <FileText size={16} className="text-[#0D6E6E]" />
                                <span className="text-xs font-mono text-[#6B7280]">{mockPlan.id}</span>
                            </div>
                            <h2 className="text-lg font-bold text-[#1C1C1E] mb-1">{mockPlan.purpose} — {mockPlan.destination}</h2>
                            <p className="text-sm text-[#6B7280]">{mockPlan.dates}</p>
                        </div>
                        <StatusBadge status={mockPlan.status} />
                    </div>
                    <div className="mt-4 pt-4 border-t border-[#E8E4DF] grid grid-cols-2 sm:grid-cols-4 gap-4">
                        {[
                            { label: 'Purpose', value: mockPlan.purpose },
                            { label: 'Destination', value: mockPlan.destination },
                            { label: 'Duration', value: '20 nights' },
                            { label: 'Budget', value: mockPlan.budget },
                        ].map((item) => (
                            <div key={item.label}>
                                <p className="text-xs text-[#9CA3AF] uppercase tracking-wide mb-0.5">{item.label}</p>
                                <p className="text-sm font-semibold text-[#1C1C1E]">{item.value}</p>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                    {/* Recommended Hospitals */}
                    <div className="bg-white rounded-2xl border border-[#E8E4DF] p-6 shadow-sm">
                        <div className="flex items-center gap-2 mb-5">
                            <Building2 size={18} className="text-[#0D6E6E]" />
                            <h3 className="font-bold text-[#1C1C1E]">Recommended Hospitals</h3>
                        </div>
                        <div className="space-y-4">
                            {mockPlan.hospitals.map((h, i) => (
                                <div key={i} className="p-4 rounded-xl bg-[#F9F7F4] border border-[#E8E4DF]">
                                    <div className="flex items-start justify-between gap-2">
                                        <h4 className="font-semibold text-[#1C1C1E] text-sm mb-1">{h.name}</h4>
                                        <span className="text-xs font-semibold text-[#0D6E6E] bg-[#0D6E6E]/10 px-2 py-0.5 rounded-full shrink-0">{h.match}</span>
                                    </div>
                                    <p className="text-xs text-[#6B7280]">{h.specialty}</p>
                                    <p className="text-xs text-[#9CA3AF]">{h.location}</p>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Stay Suggestions */}
                    <div className="bg-white rounded-2xl border border-[#E8E4DF] p-6 shadow-sm">
                        <div className="flex items-center gap-2 mb-5">
                            <BedDouble size={18} className="text-[#0D6E6E]" />
                            <h3 className="font-bold text-[#1C1C1E]">Stay Suggestions</h3>
                        </div>
                        <div className="space-y-4">
                            {mockPlan.stays.map((s, i) => (
                                <div key={i} className="p-4 rounded-xl bg-[#F9F7F4] border border-[#E8E4DF]">
                                    <div className="flex items-start justify-between gap-2">
                                        <h4 className="font-semibold text-[#1C1C1E] text-sm mb-1">{s.name}</h4>
                                        <span className="text-xs font-semibold text-[#C9A84C]">{s.price}</span>
                                    </div>
                                    <p className="text-xs text-[#6B7280]">{s.type}</p>
                                    <p className="text-xs text-[#9CA3AF]">{s.location}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Itinerary */}
                <div className="bg-white rounded-2xl border border-[#E8E4DF] p-6 shadow-sm mb-6">
                    <div className="flex items-center gap-2 mb-5">
                        <Map size={18} className="text-[#0D6E6E]" />
                        <h3 className="font-bold text-[#1C1C1E]">Tentative Itinerary</h3>
                    </div>
                    <div className="space-y-3">
                        {mockPlan.itinerary.map((item, i) => (
                            <div key={i} className="flex gap-4 items-start">
                                <div className="w-20 shrink-0 text-xs font-semibold text-[#0D6E6E] pt-0.5">{item.day}</div>
                                <div className="flex-1 text-sm text-[#6B7280] border-l border-[#E8E4DF] pl-4 pb-3">
                                    {item.activity}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Budget estimate */}
                <div className="bg-white rounded-2xl border border-[#E8E4DF] p-6 shadow-sm">
                    <div className="flex items-center gap-2 mb-5">
                        <Wallet size={18} className="text-[#0D6E6E]" />
                        <h3 className="font-bold text-[#1C1C1E]">Estimated Budget Breakdown</h3>
                    </div>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                        {[
                            { label: 'Medical Treatment', value: '$4,000–$6,000' },
                            { label: 'Accommodation', value: '$1,200–$2,000' },
                            { label: 'Transfers & Transport', value: '$300–$500' },
                            { label: 'Meals & Incidentals', value: '$400–$700' },
                        ].map((item) => (
                            <div key={item.label} className="text-center p-4 rounded-xl bg-[#F9F7F4]">
                                <p className="font-bold text-[#1C1C1E] mb-1">{item.value}</p>
                                <p className="text-xs text-[#9CA3AF]">{item.label}</p>
                            </div>
                        ))}
                    </div>
                    <p className="text-xs text-[#9CA3AF] mt-4 text-center">Estimates are indicative. Roamio will confirm final costs once your plan is reviewed.</p>
                </div>
            </div>
        </div>
    )
}
