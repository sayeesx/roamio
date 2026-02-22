import { ArrowRight, Stethoscope, CheckCircle, Clock, ShieldCheck, Heart } from 'lucide-react'
import { SectionContainer, SectionHeading } from '@/components/ui/SectionContainer'
import { CTAButton } from '@/components/ui/CTAButton'
import { FeatureCard, StepIndicator } from '@/components/ui/Cards'
import type { Metadata } from 'next'

export const metadata: Metadata = {
    title: 'Hospital Consultation in Kerala — Roamio',
    description: 'Roamio coordinates hospital consultations across Kerala — from Ayurveda centers to multi-specialty hospitals. We handle appointments, specialist access, and all logistics.',
}

const steps = [
    { number: 1, label: 'Share Your Health Details', description: 'Tell us your health concerns, preferred treatment type (Ayurveda, modern medicine, specialist), and any prior reports.' },
    { number: 2, label: 'Hospital Matching', description: 'We identify the best-suited hospitals and specialists in Kerala based on your needs and budget.' },
    { number: 3, label: 'Appointment Booking', description: 'We coordinate the appointment directly with the hospital or clinic, handling all the back-and-forth for you.' },
    { number: 4, label: 'Day of Consultation', description: 'We ensure you have all you need: directions, translator support if required, and someone to contact on the ground.' },
    { number: 5, label: 'Post-Consultation Support', description: 'We help with prescriptions, follow-up scheduling, and any additional care coordination after your visit.' },
]

const faqs = [
    { q: 'Do you provide medical advice?', a: 'No. Roamio is a concierge coordination service — we connect you with qualified healthcare professionals, but all medical decisions rest with licensed doctors.' },
    { q: 'Which hospitals do you work with?', a: 'Our network includes Kottakkal Arya Vaidya Sala, Aster Medcity, Baby Memorial Hospital, PVS Hospital, and several other respected institutions across Kerala.' },
    { q: 'Can you arrange Ayurveda consultations?', a: 'Yes — Ayurvedic consultations and treatment packages are among our most requested services, especially at Kottakkal and other traditional centers.' },
    { q: 'What if I need a second opinion?', a: 'We can arrange consultations at multiple hospitals so you can make an informed decision with input from more than one specialist.' },
    { q: 'Is my health information kept private?', a: 'Absolutely. All health data you share with us is encrypted and shared only with the specific providers you authorise us to contact.' },
]

export default function HospitalPage() {
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
                            <Stethoscope size={14} className="text-[#C9A84C]" />
                            <span className="text-[#0D6E6E] text-xs sm:text-sm font-semibold">Hospital Consultation</span>
                        </div>
                        <h1 className="text-3xl sm:text-5xl lg:text-6xl font-bold text-[#1C1C1E] leading-[1.1] mb-5">
                            Expert Medical Care in Kerala,
                            <span className="text-[#0D6E6E]"> Coordinated for You</span>
                        </h1>
                        <p className="text-base sm:text-xl text-[#4B5563] mb-8 sm:mb-10 leading-relaxed">
                            Whether you need an Ayurveda consultation or a specialist appointment at a leading hospital, we arrange the right care so you can focus entirely on your health.
                        </p>
                        <CTAButton href="/plan/start?service=hospital" variant="primary" size="lg">
                            Book Consultation <ArrowRight size={20} />
                        </CTAButton>
                    </div>
                </div>
            </section>

            {/* Why */}
            <SectionContainer>
                <SectionHeading
                    eyebrow="Why Trust Roamio"
                    title="Healthcare Coordination That Puts You First"
                    subtitle="Navigating a foreign healthcare system is stressful. We remove that stress entirely."
                />
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {[
                        { icon: <Heart size={24} />, title: 'Ayurveda & Modern Care', description: 'Access Kerala\'s world-renowned Ayurveda centers as well as advanced modern hospitals — or both.' },
                        { icon: <ShieldCheck size={24} />, title: 'Verified Institutions', description: 'Every hospital in our network is reviewed for quality, patient experience, and international care standards.' },
                        { icon: <Clock size={24} />, title: 'Fast Appointments', description: 'We work directly with hospital teams to secure timely appointments, avoiding long waits.' },
                        { icon: <CheckCircle size={24} />, title: 'Full Care Coordination', description: 'From booking to follow-up, we stay involved so nothing falls through the cracks.' },
                    ].map((item) => (
                        <FeatureCard key={item.title} icon={item.icon} title={item.title} description={item.description} />
                    ))}
                </div>
            </SectionContainer>

            {/* Process */}
            <SectionContainer variant="tinted">
                <SectionHeading
                    eyebrow="The Process"
                    title="From First Contact to Follow-Up"
                    subtitle="A five-step journey designed to make your healthcare experience as smooth as possible."
                />
                <div className="max-w-2xl mx-auto">
                    <StepIndicator steps={steps} variant="vertical" />
                </div>
            </SectionContainer>

            {/* CTA Banner */}
            <SectionContainer variant="dark">
                <div className="text-center max-w-2xl mx-auto">
                    <SectionHeading
                        eyebrow="Get Care"
                        title="Book Your Hospital Consultation"
                        subtitle="Share your health details and we will identify the best specialist or Ayurveda center for you."
                        light
                    />
                    <CTAButton href="/plan/start?service=hospital" variant="primary" size="lg">
                        Book Consultation <ArrowRight size={20} />
                    </CTAButton>
                </div>
            </SectionContainer>

            {/* FAQ */}
            <SectionContainer>
                <SectionHeading eyebrow="FAQ" title="Common Questions" subtitle="Answers to important questions about medical consultations in Kerala." />
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
