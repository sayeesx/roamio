import { ArrowRight, CheckCircle, HeartPulse, Stethoscope, Plane, Home, ClipboardList, PhoneCall } from 'lucide-react'
import { SectionContainer, SectionHeading } from '@/components/ui/SectionContainer'
import { CTAButton } from '@/components/ui/CTAButton'
import { FeatureCard, StepIndicator } from '@/components/ui/Cards'
import type { Metadata } from 'next'

export const metadata: Metadata = {
    title: 'Medical Concierge — Kerala Medical Travel Made Simple',
    description: 'Roamio coordinates your entire medical journey to Kerala: hospital suggestions, consultations, stay, and follow-up care. Trusted AI concierge for NRIs and international patients.',
}

const steps = [
    { number: 1, label: 'Submit Medical Details', description: 'Share your condition summary, travel dates, budget, and preferred treatment type securely.' },
    { number: 2, label: 'AI Hospital Suggestions', description: 'Our AI matches you to the best-fit hospitals and specialists in Kerala based on your case.' },
    { number: 3, label: 'Consultation Booking', description: 'We coordinate appointments with your chosen hospital and physician.' },
    { number: 4, label: 'Stay & Logistics', description: 'We arrange nearby accommodation, airport transfers, and local transportation.' },
    { number: 5, label: 'Follow-Up Support', description: 'Post-treatment guidance, prescription coordination, and ongoing concierge support.' },
]

const faqs = [
    { q: 'Is Roamio a hospital or medical provider?', a: 'No. Roamio is a concierge coordination service. We work alongside hospitals and doctors but do not provide medical services ourselves.' },
    { q: 'Which hospitals do you work with?', a: 'We work with a curated network including Kottakkal Arya Vaidya Sala, Aster Medcity, Baby Memorial Hospital, and several other leading institutions in Kerala.' },
    { q: 'How long does planning take?', a: 'Once you submit your intake form, we typically send a personalized plan within 24–48 hours.' },
    { q: 'Is my medical information safe?', a: 'Yes. All data is encrypted in transit and at rest. We do not share your information without explicit consent.' },
    { q: 'Can you help with visa or travel documents?', a: 'We can guide you through the process and connect you with the right resources, though we are not a visa agency.' },
]

export default function MedicalConciergePage() {
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
                            <HeartPulse size={14} className="text-[#C9A84C]" />
                            <span className="text-[#0D6E6E] text-xs sm:text-sm font-semibold">Medical Concierge</span>
                        </div>
                        <h1 className="text-3xl sm:text-5xl lg:text-6xl font-bold text-[#1C1C1E] leading-[1.1] mb-5">
                            Medical Travel to Kerala
                            <span className="text-[#0D6E6E]"> Made Simple</span>
                        </h1>
                        <p className="text-base sm:text-xl text-[#4B5563] mb-8 sm:mb-10 leading-relaxed">
                            World-class Ayurveda, advanced hospitals, and compassionate care — all coordinated by Roamio so you can focus on healing.
                        </p>
                        <CTAButton href="/plan/start?purpose=medical" variant="primary" size="lg">
                            Start Medical Plan <ArrowRight size={20} />
                        </CTAButton>
                    </div>
                </div>
            </section>

            {/* Why Kerala */}
            <SectionContainer>
                <SectionHeading
                    eyebrow="Why Kerala"
                    title="A Global Destination for Healing & Care"
                    subtitle="Kerala uniquely combines ancient healing traditions with modern medical infrastructure."
                />
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {[
                        { icon: <HeartPulse size={24} />, title: 'Kottakkal Arya Vaidya Sala', description: 'India\'s most trusted Ayurvedic institution with over a century of healing expertise.' },
                        { icon: <Stethoscope size={24} />, title: 'Aster Medcity', description: 'Multi-specialty tertiary care hospital with international patient services and JCI standards.' },
                        { icon: <ClipboardList size={24} />, title: 'Baby Memorial Hospital', description: 'Renowned for neurology, cardiology, and orthopedic care in Kozhikode.' },
                        { icon: <CheckCircle size={24} />, title: 'Affordable Excellence', description: 'World-class care at a fraction of the cost compared to Western countries.' },
                    ].map((item) => (
                        <FeatureCard key={item.title} icon={item.icon} title={item.title} description={item.description} />
                    ))}
                </div>
            </SectionContainer>

            {/* Process */}
            <SectionContainer variant="tinted">
                <SectionHeading
                    eyebrow="The Process"
                    title="Your Step-by-Step Medical Journey"
                    subtitle="We guide you from your first inquiry to your last follow-up appointment."
                />
                <div className="max-w-2xl mx-auto">
                    <StepIndicator steps={steps} variant="vertical" />
                </div>
            </SectionContainer>

            {/* CTA Banner */}
            <SectionContainer variant="dark">
                <div className="text-center max-w-2xl mx-auto">
                    <SectionHeading
                        eyebrow="Begin Today"
                        title="Start Your Medical Plan"
                        subtitle="Submit your details and receive a personalized medical travel plan within 48 hours."
                        light
                    />
                    <CTAButton href="/plan/start?purpose=medical" variant="primary" size="lg">
                        Start Medical Plan <ArrowRight size={20} />
                    </CTAButton>
                </div>
            </SectionContainer>

            {/* FAQ */}
            <SectionContainer>
                <SectionHeading eyebrow="FAQ" title="Common Questions" subtitle="Answers to the most frequent concerns about medical travel to Kerala." />
                <div className="max-w-3xl mx-auto space-y-4">
                    {faqs.map((faq) => (
                        <details
                            key={faq.q}
                            className="group bg-white border border-[#E8E4DF] rounded-2xl overflow-hidden"
                        >
                            <summary className="flex items-center justify-between p-4 sm:p-6 cursor-pointer list-none font-semibold text-[#1C1C1E] hover:text-[#0D6E6E] transition-colors text-sm sm:text-base">
                                {faq.q}
                                <span className="text-[#0D6E6E] text-xl leading-none group-open:rotate-45 transition-transform duration-200">+</span>
                            </summary>
                            <div className="px-6 pb-6 text-[#6B7280] leading-relaxed border-t border-[#E8E4DF] pt-4">
                                {faq.a}
                            </div>
                        </details>
                    ))}
                </div>
            </SectionContainer>
        </>
    )
}
