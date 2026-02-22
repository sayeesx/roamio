import { ArrowRight, Compass, Map, Calendar, Users } from 'lucide-react'
import { SectionContainer, SectionHeading } from '@/components/ui/SectionContainer'
import { CTAButton } from '@/components/ui/CTAButton'
import { FeatureCard } from '@/components/ui/Cards'
import type { Metadata } from 'next'

export const metadata: Metadata = {
    title: 'Tourism Planning — Personalized Kerala Travel',
    description: 'Roamio builds personalized Kerala travel itineraries for individuals, families, and groups. Beyond tourist trails — curated, coordinated, authentic.',
}

const features = [
    { icon: <Compass size={24} />, title: 'Curated Itineraries', description: 'AI-generated plans based on your interests, timeframe, and travel style — not cookie-cutter packages.' },
    { icon: <Map size={24} />, title: 'Off-the-Beaten-Path', description: 'Discover hidden backwaters, local homestays, and experiences that most tourists never find.' },
    { icon: <Calendar size={24} />, title: 'Seamless Scheduling', description: 'Every activity, accommodation, and transit is coordinated to fit perfectly into your timeline.' },
    { icon: <Users size={24} />, title: 'Group & Family Ready', description: 'From solo travellers to large family groups — we scale your plan with zero compromise on quality.' },
]

const destinations = [
    {
        id: 'munnar',
        name: 'Munnar',
        tagline: 'Tea Hills & Misty Mornings',
        description: 'Rolling tea estates, cool mountain air, and dramatic landscapes. Perfect for nature lovers and honeymooners.',
        highlights: ['Eravikulam National Park', 'Tea Museum', 'Echo Point', 'Mattupetty Dam'],
        color: '#1a5c3a',
    },
    {
        id: 'alappuzha',
        name: 'Alappuzha (Alleppey)',
        tagline: 'Backwaters & Houseboat Life',
        description: 'The "Venice of the East." Drifting through palm-lined canals on a traditional houseboat is a life experience.',
        highlights: ['Houseboat Stays', 'Punnamada Lake', 'Marari Beach', 'Nehru Trophy Race'],
        color: '#1a3a5c',
    },
    {
        id: 'kochi',
        name: 'Kochi',
        tagline: 'Heritage, Art & Cosmopolitan Culture',
        description: 'Fort Kochi blends Portuguese, Dutch, and British history with a thriving contemporary arts scene.',
        highlights: ['Fort Kochi', 'Chinese Fishing Nets', 'Mattancherry Palace', 'Kochi Biennale'],
        color: '#3a1a5c',
    },
    {
        id: 'wayanad',
        name: 'Wayanad',
        tagline: 'Forests, Tribes & Wildlife',
        description: 'Dense forests, tribal culture, ancient caves, and thrilling wildlife make Wayanad truly unique.',
        highlights: ['Edakkal Caves', 'Banasura Sagar Dam', 'Chembra Peak', 'Wildlife Sanctuary'],
        color: '#5c3a1a',
    },
]

const sampleItinerary = [
    { day: 'Day 1–2', location: 'Kochi', activities: 'Arrive in Kochi. Fort Kochi walk, Kathakali performance, seafood dinner.' },
    { day: 'Day 3–4', location: 'Munnar', activities: 'Drive to Munnar (4.5 hrs). Tea estate tour, sunrise hike, local market.' },
    { day: 'Day 5–6', location: 'Alappuzha', activities: 'Overnight houseboat on the backwaters. Village life, canoe experience.' },
    { day: 'Day 7', location: 'Kochi', activities: 'Return to Kochi. Spice market, farewell dinner, departure.' },
]

export default function TourismPlanningPage() {
    return (
        <>
            {/* Hero */}
            <section
                className="relative pt-24 sm:pt-28 lg:pt-32 pb-14 sm:pb-20 overflow-hidden"
                style={{ background: 'linear-gradient(160deg, #F2EFE9 0%, #EDE8E0 60%, #E8E2D8 100%)' }}
            >
                <div className="absolute inset-0 overflow-hidden pointer-events-none">
                    <div className="absolute -top-32 -right-32 w-[500px] h-[500px] rounded-full opacity-30"
                        style={{ background: 'radial-gradient(circle, #d4c9a8 0%, transparent 70%)' }} />
                    <div className="absolute bottom-0 -left-24 w-[400px] h-[400px] rounded-full opacity-20"
                        style={{ background: 'radial-gradient(circle, #b8c9c9 0%, transparent 70%)' }} />
                </div>
                <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="max-w-3xl">
                        <div className="inline-flex items-center gap-2 bg-[#0D6E6E]/10 border border-[#0D6E6E]/20 rounded-full px-3 py-1.5 sm:px-4 sm:py-2 mb-5 sm:mb-8">
                            <Compass size={14} className="text-[#C9A84C]" />
                            <span className="text-[#0D6E6E] text-xs sm:text-sm font-semibold">Tourism Planning</span>
                        </div>
                        <h1 className="text-3xl sm:text-5xl lg:text-6xl font-bold text-[#1C1C1E] leading-[1.1] mb-5">
                            Personalized Kerala
                            <span className="text-[#0D6E6E]"> Travel Planning</span>
                        </h1>
                        <p className="text-base sm:text-xl text-[#4B5563] mb-8 sm:mb-10 leading-relaxed">
                            Tell us who you are and what you seek. We&apos;ll build an itinerary that feels like it was made just for you — because it was.
                        </p>
                        <CTAButton href="/plan/start?purpose=tourism" variant="primary" size="lg">
                            Create My Travel Plan <ArrowRight size={20} />
                        </CTAButton>
                    </div>
                </div>
            </section>

            {/* Features */}
            <SectionContainer>
                <SectionHeading eyebrow="What We Do" title="Smarter Kerala Travel" subtitle="We build itineraries that go beyond the usual tourist checklist." />
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {features.map((f) => <FeatureCard key={f.title} icon={f.icon} title={f.title} description={f.description} />)}
                </div>
            </SectionContainer>

            {/* Destinations */}
            <SectionContainer variant="tinted">
                <SectionHeading eyebrow="Destinations" title="Kerala&apos;s Most Iconic Places" subtitle="Each destination has layers most visitors never discover. We take you deeper." />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {destinations.map((dest) => (
                        <div
                            key={dest.id}
                            id={dest.id}
                            className="relative rounded-2xl overflow-hidden bg-white border border-[#E8E4DF] hover:shadow-xl transition-shadow duration-300"
                        >
                            <div className="h-3" style={{ background: `linear-gradient(90deg, ${dest.color}, ${dest.color}99)` }} />
                            <div className="p-5 sm:p-8">
                                <p className="text-xs font-semibold tracking-widest uppercase text-[#6B7280] mb-2">{dest.tagline}</p>
                                <h3 className="text-2xl font-bold text-[#1C1C1E] mb-3">{dest.name}</h3>
                                <p className="text-[#6B7280] leading-relaxed mb-5">{dest.description}</p>
                                <div className="flex flex-wrap gap-2">
                                    {dest.highlights.map((h) => (
                                        <span key={h} className="px-3 py-1 rounded-full text-xs font-medium bg-[#F2EFE9] text-[#6B7280]">{h}</span>
                                    ))}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </SectionContainer>

            {/* Sample Itinerary */}
            <SectionContainer>
                <SectionHeading eyebrow="Sample Plan" title="A 7-Day Kerala Classic" subtitle="Here&apos;s what a typical Roamio-planned trip looks like. Yours will be tailored to you." />
                <div className="max-w-3xl mx-auto">
                    <div className="space-y-4">
                        {sampleItinerary.map((item, i) => (
                            <div key={i} className="flex flex-col sm:flex-row gap-4 sm:gap-6 bg-white rounded-2xl border border-[#E8E4DF] p-5 sm:p-6 hover:border-[#0D6E6E]/30 transition-colors">
                                <div className="shrink-0 text-center">
                                    <div className="w-16 h-16 rounded-xl gradient-primary flex items-center justify-center text-white text-xs font-bold text-center leading-tight px-1">
                                        {item.day}
                                    </div>
                                </div>
                                <div>
                                    <p className="font-bold text-[#0D6E6E] mb-1">{item.location}</p>
                                    <p className="text-[#6B7280] text-sm leading-relaxed">{item.activities}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                    <div className="text-center mt-10">
                        <CTAButton href="/plan/start?purpose=tourism" variant="secondary" size="lg">
                            Build My Custom Plan <ArrowRight size={20} />
                        </CTAButton>
                    </div>
                </div>
            </SectionContainer>
        </>
    )
}
