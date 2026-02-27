import { ArrowRight, Clock, Home, Users, Heart, Calendar, Briefcase } from 'lucide-react'
import { SectionContainer, SectionHeading } from '@/components/ui/SectionContainer'
import { CTAButton } from '@/components/ui/CTAButton'
import { FeatureCard } from '@/components/ui/Cards'
import type { Metadata } from 'next'

export const metadata: Metadata = {
    title: 'NRI Concierge — Smart Short-Visit Planning for Kerala',
    description: 'Shahr helps NRIs maximize every day of their Kerala visit. Property checks, family medical appointments, weddings, legal errands — all coordinated by AI.',
}

const services = [
    { icon: <Clock size={24} />, title: 'Short-Visit Optimization', description: 'Days are precious. We build a day-by-day plan so you accomplish everything on your list — nothing wasted.' },
    { icon: <Home size={24} />, title: 'Property & Legal Support', description: 'Property visits, liaison with agents, legal document coordination — we connect you to the right people.' },
    { icon: <Heart size={24} />, title: 'Medical Appointments', description: 'Schedule family health check-ups, specialist consultations, and pharmacy runs efficiently.' },
    { icon: <Users size={24} />, title: 'Wedding & Event Support', description: 'Coordinating a family wedding from abroad? We handle vendor liaison, logistics, and day-of coordination.' },
    { icon: <Calendar size={24} />, title: 'Family Logistics', description: 'School admissions, elder care visits, utility transfers — we handle the administrative side of your visit.' },
    { icon: <Briefcase size={24} />, title: 'Local Business Meetings', description: 'Need to meet local partners, banks, or government offices? We prep, schedule, and support you.' },
]

const testimonials = [
    {
        quote: 'I had 12 days in Kerala and a list of 20 things to do. Shahr got me through all of them and I still had time to relax.',
        author: 'Arun Nair',
        role: 'Toronto, Canada',
    },
    {
        quote: 'My parents needed medical check-ups, the house needed repairs, and my sister was getting married. Shahr coordinated everything while I focused on family.',
        author: 'Deepa Krishnan',
        role: 'Abu Dhabi, UAE',
    },
]

export default function NRIConciergePage() {
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
                            <Users size={14} className="text-[#C9A84C]" />
                            <span className="text-[#0D6E6E] text-xs sm:text-sm font-semibold">NRI Concierge</span>
                        </div>
                        <h1 className="text-3xl sm:text-5xl lg:text-6xl font-bold text-[#1C1C1E] leading-[1.1] mb-5">
                            Every Day Back Home
                            <span className="text-[#0D6E6E]"> Should Count</span>
                        </h1>
                        <p className="text-base sm:text-xl text-[#4B5563] mb-8 sm:mb-10 leading-relaxed">
                            You&apos;ve been planning this trip for months. Don&apos;t let logistics eat your time. Roamio coordinates everything so you can focus on what matters.
                        </p>
                        <CTAButton href="/plan/start?purpose=nri" variant="primary" size="lg">
                            Plan My NRI Visit <ArrowRight size={20} />
                        </CTAButton>
                    </div>
                </div>
            </section>

            {/* Services */}
            <SectionContainer>
                <SectionHeading
                    eyebrow="What We Handle"
                    title="Everything on Your Kerala To-Do List"
                    subtitle="Our AI finds the gaps, fills the schedule, and our local team executes flawlessly."
                />
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {services.map((s) => <FeatureCard key={s.title} icon={s.icon} title={s.title} description={s.description} />)}
                </div>
            </SectionContainer>

            {/* How it differs from tourism */}
            <SectionContainer variant="tinted">
                <div className="max-w-3xl mx-auto">
                    <SectionHeading
                        eyebrow="Built for NRIs"
                        title="More Than a Travel Plan"
                        subtitle="NRI visits aren't holidays. They're dense, emotional, multi-purpose trips. Roamio is built for that reality."
                    />
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                        {[
                            { title: 'Time-boxed planning', desc: 'We know your leave ends in 14 days. Every moment is mapped.' },
                            { title: 'Hybrid itineraries', desc: 'Mix family duties, medical visits, property meetings, and rest time.' },
                            { title: 'Pre-trip preparation', desc: 'We start coordinating weeks before you land — so nothing waits.' },
                            { title: 'Local ground support', desc: 'Our verified local team acts on your behalf before and during your visit.' },
                        ].map((item) => (
                            <div key={item.title} className="bg-white rounded-2xl p-6 border border-[#E8E4DF]">
                                <h4 className="font-bold text-[#1C1C1E] mb-2">{item.title}</h4>
                                <p className="text-[#6B7280] text-sm leading-relaxed">{item.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </SectionContainer>

            {/* Testimonials */}
            <SectionContainer>
                <SectionHeading eyebrow="NRI Stories" title="From People Like You" />
                <div className="max-w-3xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6">
                    {testimonials.map((t) => (
                        <div key={t.author} className="bg-[#F9F7F4] rounded-2xl p-5 sm:p-8 border border-[#E8E4DF]">
                            <p className="text-[#1C1C1E] leading-relaxed italic mb-5">&ldquo;{t.quote}&rdquo;</p>
                            <p className="font-semibold text-[#1C1C1E]">{t.author}</p>
                            <p className="text-sm text-[#6B7280]">{t.role}</p>
                        </div>
                    ))}
                </div>
            </SectionContainer>

            {/* CTA */}
            <SectionContainer variant="dark">
                <div className="text-center max-w-xl mx-auto">
                    <SectionHeading eyebrow="Start Now" title="Plan Your NRI Visit" subtitle="Let&apos;s make your time in Kerala count. Submit your visit details and we&apos;ll build your plan." light />
                    <CTAButton href="/plan/start?purpose=nri" variant="primary" size="lg">
                        Plan My NRI Visit <ArrowRight size={20} />
                    </CTAButton>
                </div>
            </SectionContainer>
        </>
    )
}
