import { ArrowRight, Car, MapPin, Clock, Users, CheckCircle, Star } from 'lucide-react'
import { SectionContainer, SectionHeading } from '@/components/ui/SectionContainer'
import { CTAButton } from '@/components/ui/CTAButton'
import { FeatureCard, StepIndicator } from '@/components/ui/Cards'
import type { Metadata } from 'next'

export const metadata: Metadata = {
    title: 'Cab & Local Transport in Kerala — Roamio',
    description: 'Roamio arranges reliable cabs, private cars, and local transport across Kerala. Airport transfers, inter-city travel, and daily commutes — all coordinated for you.',
}

const steps = [
    { number: 1, label: 'Share Your Details', description: 'Tell us your pickup location, destination, date, time, and any special requirements.' },
    { number: 2, label: 'We Find the Best Option', description: 'Our team identifies reliable, vetted drivers and vehicles suited to your route and group size.' },
    { number: 3, label: 'Confirmation & Contact', description: 'We confirm your booking and share driver details so you know exactly who to expect.' },
    { number: 4, label: 'Smooth Journey', description: 'Your driver meets you on time. We stay available throughout your trip for any support.' },
]

const faqs = [
    { q: 'What types of vehicles do you arrange?', a: 'We arrange everything from compact cars for solo travelers to SUVs and tempo travellers for larger groups — whatever suits your journey best.' },
    { q: 'Can I book a cab for multi-day trips?', a: 'Yes, we coordinate full-day and multi-day cab arrangements across Kerala, including tourist circuits.' },
    { q: 'Are the drivers vetted?', a: 'All our driver partners are vetted for safety, reliability, and local knowledge. Only verified drivers make it into our network.' },
    { q: 'Can you arrange airport transfers?', a: 'Absolutely — airport pickup and drop-off is one of our most requested services. We also have a dedicated Airport Pickup page for that.' },
    { q: 'How far in advance should I book?', a: 'For best availability, booking 24 hours ahead is ideal. For same-day requests, contact us directly and we will do our best.' },
]

export default function CabsPage() {
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
                            <Car size={14} className="text-[#C9A84C]" />
                            <span className="text-[#0D6E6E] text-xs sm:text-sm font-semibold">Cab & Local Transport</span>
                        </div>
                        <h1 className="text-3xl sm:text-5xl lg:text-6xl font-bold text-[#1C1C1E] leading-[1.1] mb-5">
                            Get Around Kerala
                            <span className="text-[#0D6E6E]"> Without the Hassle</span>
                        </h1>
                        <p className="text-base sm:text-xl text-[#4B5563] mb-8 sm:mb-10 leading-relaxed">
                            From airport runs to full-day sightseeing, we arrange safe, comfortable, and reliable transport with vetted drivers who know Kerala inside out.
                        </p>
                        <CTAButton href="/plan/start?service=cabs" variant="primary" size="lg">
                            Book Transport <ArrowRight size={20} />
                        </CTAButton>
                    </div>
                </div>
            </section>

            {/* Why our cabs */}
            <SectionContainer>
                <SectionHeading
                    eyebrow="Why Choose Us"
                    title="Transport That Works Around You"
                    subtitle="We handle the logistics so you can focus on your journey — not the stress of finding a ride."
                />
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {[
                        { icon: <CheckCircle size={24} />, title: 'Vetted Drivers', description: 'Every driver is background-checked, licensed, and reviewed by previous travelers.' },
                        { icon: <Clock size={24} />, title: 'On Time, Every Time', description: 'Punctuality is non-negotiable. Your driver will be there when you need them.' },
                        { icon: <MapPin size={24} />, title: 'Local Knowledge', description: 'Our drivers know the best routes, shortcuts, and hidden gems across Kerala.' },
                        { icon: <Users size={24} />, title: 'Any Group Size', description: 'Solo traveler or a group of twelve — we have the right vehicle for you.' },
                    ].map((item) => (
                        <FeatureCard key={item.title} icon={item.icon} title={item.title} description={item.description} />
                    ))}
                </div>
            </SectionContainer>

            {/* Process */}
            <SectionContainer variant="tinted">
                <SectionHeading
                    eyebrow="How It Works"
                    title="From Request to Ride in Minutes"
                    subtitle="Simple steps, zero confusion — we take care of the coordination."
                />
                <div className="max-w-2xl mx-auto">
                    <StepIndicator steps={steps} variant="vertical" />
                </div>
            </SectionContainer>

            {/* CTA Banner */}
            <SectionContainer variant="dark">
                <div className="text-center max-w-2xl mx-auto">
                    <SectionHeading
                        eyebrow="Ready to Ride"
                        title="Book Your Cab in Kerala"
                        subtitle="Tell us your route and we will handle the rest — quickly and reliably."
                        light
                    />
                    <CTAButton href="/plan/start?service=cabs" variant="primary" size="lg">
                        Book Transport <ArrowRight size={20} />
                    </CTAButton>
                </div>
            </SectionContainer>

            {/* FAQ */}
            <SectionContainer>
                <SectionHeading eyebrow="FAQ" title="Common Questions" subtitle="Everything you need to know about arranging transport in Kerala." />
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
