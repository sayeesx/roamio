import { ArrowRight, Plane, CheckCircle, Clock, Globe, Wallet } from 'lucide-react'
import { SectionContainer, SectionHeading } from '@/components/ui/SectionContainer'
import { CTAButton } from '@/components/ui/CTAButton'
import { FeatureCard, StepIndicator } from '@/components/ui/Cards'
import type { Metadata } from 'next'

export const metadata: Metadata = {
    title: 'Flight Ticket Assistance — Roamio Kerala',
    description: 'Roamio helps you find and book the best flights to Kerala. We compare options, assist with bookings, and coordinate your arrival — all as part of your Kerala visit plan.',
}

const steps = [
    { number: 1, label: 'Share Your Travel Dates', description: 'Tell us your origin, preferred travel dates, class of travel, and any airline preferences.' },
    { number: 2, label: 'We Research Options', description: 'Our team identifies the best-value, well-timed flights that suit your schedule and budget.' },
    { number: 3, label: 'Review & Confirm', description: 'We share the options with you. Once you confirm, we assist with the booking process.' },
    { number: 4, label: 'Arrives Sorted', description: 'With flights confirmed, we seamlessly connect this with your full Kerala visit plan.' },
]

const faqs = [
    { q: 'Do you book flights directly?', a: 'We assist and coordinate the booking process, helping you find the best options and facilitating the booking. We work with trusted travel partners for actual ticket issuance.' },
    { q: 'Which airports in Kerala do you cover?', a: 'We cover all major Kerala airports — Cochin International (COK), Calicut International (CCJ), Trivandrum International (TRV), and Kannur International (CNN).' },
    { q: 'Can you help with connecting flights?', a: 'Yes, we can help plan multi-leg itineraries including international connections, layovers, and codeshare flights.' },
    { q: 'Is there a fee for this service?', a: 'Flight assistance is included as part of a full Roamio plan. For standalone flight-only requests, contact us and we will advise on applicable coordination fees.' },
    { q: 'Can you arrange return tickets too?', a: 'Absolutely. We handle both outbound and return flights, and can align departure times with your Kerala itinerary.' },
]

export default function FlightsPage() {
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
                            <Plane size={14} className="text-[#C9A84C]" />
                            <span className="text-[#0D6E6E] text-xs sm:text-sm font-semibold">Flight Tickets</span>
                        </div>
                        <h1 className="text-3xl sm:text-5xl lg:text-6xl font-bold text-[#1C1C1E] leading-[1.1] mb-5">
                            Fly to Kerala
                            <span className="text-[#0D6E6E]"> Without the Confusion</span>
                        </h1>
                        <p className="text-base sm:text-xl text-[#4B5563] mb-8 sm:mb-10 leading-relaxed">
                            We research, compare, and help book the best flights to Kerala for your dates — so your journey starts on the right foot from the moment you leave home.
                        </p>
                        <CTAButton href="/plan/start?service=flights" variant="primary" size="lg">
                            Get Flight Help <ArrowRight size={20} />
                        </CTAButton>
                    </div>
                </div>
            </section>

            {/* Why our service */}
            <SectionContainer>
                <SectionHeading
                    eyebrow="Why It Matters"
                    title="The Right Flight Makes Everything Easier"
                    subtitle="A well-timed, well-priced flight sets the tone for your entire Kerala visit."
                />
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {[
                        { icon: <Globe size={24} />, title: 'All Origins Covered', description: 'We assist travelers arriving from the Gulf, UK, Europe, and all international hubs.' },
                        { icon: <Wallet size={24} />, title: 'Best Value Options', description: 'We compare across airlines to find competitive fares that fit your travel window.' },
                        { icon: <Clock size={24} />, title: 'Well-Timed Arrivals', description: 'We plan arrival times that align perfectly with your Kerala itinerary and pickups.' },
                        { icon: <CheckCircle size={24} />, title: 'Seamless Integration', description: 'Your flight details feed directly into your Roamio plan — no gap, no confusion.' },
                    ].map((item) => (
                        <FeatureCard key={item.title} icon={item.icon} title={item.title} description={item.description} />
                    ))}
                </div>
            </SectionContainer>

            {/* Process */}
            <SectionContainer variant="tinted">
                <SectionHeading
                    eyebrow="How It Works"
                    title="From Dates to Boarding Pass"
                    subtitle="We handle the research and coordination — you focus on packing."
                />
                <div className="max-w-2xl mx-auto">
                    <StepIndicator steps={steps} variant="vertical" />
                </div>
            </SectionContainer>

            {/* CTA Banner */}
            <SectionContainer variant="dark">
                <div className="text-center max-w-2xl mx-auto">
                    <SectionHeading
                        eyebrow="Book Now"
                        title="Start With Your Flight"
                        subtitle="Share your dates and origin city — we will find the best way to get you to Kerala."
                        light
                    />
                    <CTAButton href="/plan/start?service=flights" variant="primary" size="lg">
                        Get Flight Help <ArrowRight size={20} />
                    </CTAButton>
                </div>
            </SectionContainer>

            {/* FAQ */}
            <SectionContainer>
                <SectionHeading eyebrow="FAQ" title="Common Questions" subtitle="Everything about flight assistance for your Kerala trip." />
                <div className="max-w-3xl mx-auto space-y-4">
                    {faqs.map((faq) => (
                        <details key={faq.q} className="group bg-white border border-[#E8E4DF] rounded-2xl overflow-hidden">
                            <summary className="flex items-center justify-between p-4 sm:p-6 cursor-pointer list-none font-semibold text-[#1C1C1E] hover:text-[#0D6E6E] transition-colors text-sm sm:text-base">
                                {faq.q}
                                <span className="text-[#0D6E6E] text-xl leading-none group-open:rotate-45 transition-transform duration-200">+</span>
                            </summary>
                            <div className="px-6 pb-6 text-[#6B7280] leading-relaxed border-t border-[#E8E4DF] pt-4">{faq.a}</div>
                        </details>
                    ))}
                </div>
            </SectionContainer>
        </>
    )
}
