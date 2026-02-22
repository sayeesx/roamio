import { ArrowRight, Hotel, Star, CheckCircle, Wifi, Utensils } from 'lucide-react'
import { SectionContainer, SectionHeading } from '@/components/ui/SectionContainer'
import { CTAButton } from '@/components/ui/CTAButton'
import { FeatureCard, StepIndicator } from '@/components/ui/Cards'
import type { Metadata } from 'next'

export const metadata: Metadata = {
    title: 'Hotel & Stays in Kerala — Roamio',
    description: 'Roamio arranges stays across Kerala — from heritage hotels and Ayurveda resorts to serviced apartments and budget guesthouses. We find the right fit for your purpose and budget.',
}

const steps = [
    { number: 1, label: 'Tell Us Your Needs', description: 'Share your travel dates, location preferences, budget range, and any specific needs like medical proximity or family facilities.' },
    { number: 2, label: 'Curated Options', description: 'We shortlist stays that genuinely fit your requirements — not just the ones with the best commission.' },
    { number: 3, label: 'Booking & Confirmation', description: 'We coordinate directly with the property and confirm your booking with a written record.' },
    { number: 4, label: 'Smooth Check-in', description: 'We brief both you and the property so your arrival is warm and hassle-free.' },
]

const faqs = [
    { q: 'What types of stays do you arrange?', a: 'We cover the full spectrum — luxury resorts, Ayurveda retreats, heritage bungalows, serviced apartments, guesthouses, and budget hotels across Kerala.' },
    { q: 'Can you arrange stays close to specific hospitals?', a: 'Yes — for medical visitors, we prioritise proximity to your hospital or treatment center and ensure the stay has appropriate facilities for recovery.' },
    { q: 'Do you arrange houseboats?', a: 'Absolutely. Kerala\'s iconic backwater houseboats are part of our stays offering. We arrange overnight and multi-day houseboat experiences in Alleppey.' },
    { q: 'Can you accommodate dietary preferences?', a: 'We note your dietary needs and communicate them to the property in advance — whether it\'s halal, vegan, diabetic-friendly, or Ayurvedic meals.' },
    { q: 'What if I need to change my stay dates?', a: 'We handle date changes and amendments on your behalf. We manage the communication with the property so you don\'t have to.' },
]

export default function StaysPage() {
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
                            <Hotel size={14} className="text-[#C9A84C]" />
                            <span className="text-[#0D6E6E] text-xs sm:text-sm font-semibold">Hotel & Stays</span>
                        </div>
                        <h1 className="text-3xl sm:text-5xl lg:text-6xl font-bold text-[#1C1C1E] leading-[1.1] mb-5">
                            The Right Place to Stay
                            <span className="text-[#0D6E6E]"> in Kerala</span>
                        </h1>
                        <p className="text-base sm:text-xl text-[#4B5563] mb-8 sm:mb-10 leading-relaxed">
                            From serene Ayurveda retreats to heritage homes and backwater houseboats — we find and book the stay that fits your purpose, preferences, and budget.
                        </p>
                        <CTAButton href="/plan/start?service=stays" variant="primary" size="lg">
                            Find My Stay <ArrowRight size={20} />
                        </CTAButton>
                    </div>
                </div>
            </section>

            {/* Why */}
            <SectionContainer>
                <SectionHeading
                    eyebrow="What We Offer"
                    title="Stays Chosen With Care"
                    subtitle="We go beyond listing websites — we match you to places we genuinely recommend."
                />
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {[
                        { icon: <Star size={24} />, title: 'Curated Properties', description: 'Only verified, reviewed properties make it into our recommendations — no filler options.' },
                        { icon: <Utensils size={24} />, title: 'Dietary Coordination', description: 'We communicate your food preferences to the property so meals are always right for you.' },
                        { icon: <Wifi size={24} />, title: 'All Amenities Sorted', description: 'From connectivity to parking to accessible rooms — we check the details that matter to you.' },
                        { icon: <CheckCircle size={24} />, title: 'No Surprises on Arrival', description: 'We brief the property about your arrival time, needs, and preferences ahead of your stay.' },
                    ].map((item) => (
                        <FeatureCard key={item.title} icon={item.icon} title={item.title} description={item.description} />
                    ))}
                </div>
            </SectionContainer>

            {/* Process */}
            <SectionContainer variant="tinted">
                <SectionHeading
                    eyebrow="How It Works"
                    title="From Request to Check-In"
                    subtitle="Four steps to a stay you will actually enjoy."
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
                        title="Find Your Perfect Stay in Kerala"
                        subtitle="Tell us your dates, location, and budget — we will do the searching and arranging."
                        light
                    />
                    <CTAButton href="/plan/start?service=stays" variant="primary" size="lg">
                        Find My Stay <ArrowRight size={20} />
                    </CTAButton>
                </div>
            </SectionContainer>

            {/* FAQ */}
            <SectionContainer>
                <SectionHeading eyebrow="FAQ" title="Common Questions" subtitle="Everything about arranging accommodation in Kerala with Roamio." />
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
