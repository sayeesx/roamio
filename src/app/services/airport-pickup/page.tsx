import { ArrowRight, MapPin, CheckCircle, Clock, Users, PhoneCall } from 'lucide-react'
import { SectionContainer, SectionHeading } from '@/components/ui/SectionContainer'
import { CTAButton } from '@/components/ui/CTAButton'
import { FeatureCard, StepIndicator } from '@/components/ui/Cards'
import type { Metadata } from 'next'

export const metadata: Metadata = {
    title: 'Airport Pickup in Kerala — Roamio',
    description: 'Roamio arranges reliable airport pickup and drop-off across all Kerala airports. Pre-booked, punctual, and coordinated with your flight details for a stress-free arrival.',
}

const steps = [
    { number: 1, label: 'Share Your Flight Details', description: 'Provide your flight number, arrival date and time, airport, and number of passengers.' },
    { number: 2, label: 'We Confirm Your Driver', description: 'We assign a vetted driver with the right vehicle and share their contact details with you in advance.' },
    { number: 3, label: 'Tracked Arrival', description: 'We monitor your flight in real time — if it\'s delayed, your driver adjusts automatically.' },
    { number: 4, label: 'Smooth Pickup', description: 'Your driver meets you at the arrivals gate with a name board, ready to take you directly to your destination.' },
]

const faqs = [
    { q: 'Which airports do you cover?', a: 'We cover all four major Kerala airports: Cochin (COK), Calicut (CCJ), Trivandrum (TRV), and Kannur (CNN).' },
    { q: 'What if my flight is delayed?', a: 'We track your flight in real time. If there is a delay, your driver will be updated automatically — no extra calls needed from your side.' },
    { q: 'Can you pick up large groups?', a: 'Yes — we can arrange larger vehicles including SUVs and tempo travellers for groups or families travelling with significant luggage.' },
    { q: 'Do you offer late-night pickups?', a: 'We operate 24/7 for airport transfers. Arriving at 2 AM or 5 AM is no problem — your driver will be there.' },
    { q: 'Can I also book a drop-off for departure?', a: 'Absolutely. We handle both directions. Just share your departure flight and we will arrange the drop-off with appropriate lead time.' },
]

export default function AirportPickupPage() {
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
                            <MapPin size={14} className="text-[#C9A84C]" />
                            <span className="text-[#0D6E6E] text-xs sm:text-sm font-semibold">Airport Pickup</span>
                        </div>
                        <h1 className="text-3xl sm:text-5xl lg:text-6xl font-bold text-[#1C1C1E] leading-[1.1] mb-5">
                            Land in Kerala,
                            <span className="text-[#0D6E6E]"> We Are Already Waiting</span>
                        </h1>
                        <p className="text-base sm:text-xl text-[#4B5563] mb-8 sm:mb-10 leading-relaxed">
                            No waiting at the airport, no haggling with unknown cabs. Your driver is pre-booked, on time, and ready to take you straight to your destination.
                        </p>
                        <CTAButton href="/plan/start?service=airport-pickup" variant="primary" size="lg">
                            Book Pickup <ArrowRight size={20} />
                        </CTAButton>
                    </div>
                </div>
            </section>

            {/* Why */}
            <SectionContainer>
                <SectionHeading
                    eyebrow="Why Pre-Book"
                    title="Your First Impression of Kerala Should Be Good"
                    subtitle="A pre-arranged pickup removes the uncertainty and stress from the moment you land."
                />
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {[
                        { icon: <Clock size={24} />, title: '24/7 Availability', description: 'Early morning, late night, or a red-eye flight — we are there whenever you land.' },
                        { icon: <CheckCircle size={24} />, title: 'Flight Tracking', description: 'We monitor your flight live and update your driver automatically if your arrival changes.' },
                        { icon: <Users size={24} />, title: 'Any Group Size', description: 'From solo travelers to large family groups, we have the right vehicle ready.' },
                        { icon: <PhoneCall size={24} />, title: 'Live Support', description: 'Our team is reachable throughout your journey if anything needs adjusting.' },
                    ].map((item) => (
                        <FeatureCard key={item.title} icon={item.icon} title={item.title} description={item.description} />
                    ))}
                </div>
            </SectionContainer>

            {/* Process */}
            <SectionContainer variant="tinted">
                <SectionHeading
                    eyebrow="How It Works"
                    title="From Booking to Baggage Carousel"
                    subtitle="Simple, clear, and fully handled."
                />
                <div className="max-w-2xl mx-auto">
                    <StepIndicator steps={steps} variant="vertical" />
                </div>
            </SectionContainer>

            {/* CTA Banner */}
            <SectionContainer variant="dark">
                <div className="text-center max-w-2xl mx-auto">
                    <SectionHeading
                        eyebrow="Book Your Pickup"
                        title="Arrive in Kerala With Confidence"
                        subtitle="Share your flight details and we will have a verified driver waiting at arrivals."
                        light
                    />
                    <CTAButton href="/plan/start?service=airport-pickup" variant="primary" size="lg">
                        Book Pickup <ArrowRight size={20} />
                    </CTAButton>
                </div>
            </SectionContainer>

            {/* FAQ */}
            <SectionContainer>
                <SectionHeading eyebrow="FAQ" title="Common Questions" subtitle="Everything about airport pickup and drop-off in Kerala." />
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
