import { ArrowRight, FileText, CheckCircle, Clock, Globe, ShieldCheck } from 'lucide-react'
import { SectionContainer, SectionHeading } from '@/components/ui/SectionContainer'
import { CTAButton } from '@/components/ui/CTAButton'
import { FeatureCard, StepIndicator } from '@/components/ui/Cards'
import type { Metadata } from 'next'

export const metadata: Metadata = {
    title: 'Visa Guidance for Kerala Travel — Roamio',
    description: 'Roamio provides visa guidance for international visitors traveling to Kerala, India. We help you understand requirements, prepare documents, and navigate the application process.',
}

const steps = [
    { number: 1, label: 'Share Your Nationality & Purpose', description: 'Tell us your passport country and the purpose of your visit — tourism, medical, or family visit.' },
    { number: 2, label: 'Visa Assessment', description: 'We assess the right visa type for your situation and explain the requirements clearly.' },
    { number: 3, label: 'Document Checklist', description: 'We provide a personalised list of documents needed for your specific application.' },
    { number: 4, label: 'Application Guidance', description: 'We walk you through the application process step by step, helping you avoid common mistakes.' },
    { number: 5, label: 'Ongoing Support', description: 'If queries arise from the consulate, we help you respond accurately and promptly.' },
]

const faqs = [
    { q: 'Do you apply for visas on my behalf?', a: 'We are not a registered visa agency. We provide guidance, document checklists, and support throughout the process — the actual application is submitted by you or through an authorised agent we can recommend.' },
    { q: 'What type of visa do I need to visit Kerala?', a: 'Most international visitors need an Indian Tourist Visa or an e-Visa. Medical visitors may qualify for a Medical Visa. We assess your situation and recommend the correct type.' },
    { q: 'Can Gulf residents (NRIs, expats) get visa help?', a: 'Yes — we frequently assist Gulf-based expats and OCI cardholders navigating their return visit documentation requirements.' },
    { q: 'How long does the Indian e-Visa take?', a: 'The Indian e-Visa typically takes 24–72 hours once the application is complete and correctly submitted. We help ensure your documents are in order before you apply.' },
    { q: 'What if my visa is rejected?', a: 'We help you review the rejection reason and guide you on next steps, which may include reapplication with additional documentation or an alternative visa category.' },
]

export default function VisaPage() {
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
                            <FileText size={14} className="text-[#C9A84C]" />
                            <span className="text-[#0D6E6E] text-xs sm:text-sm font-semibold">Visa Guidance</span>
                        </div>
                        <h1 className="text-3xl sm:text-5xl lg:text-6xl font-bold text-[#1C1C1E] leading-[1.1] mb-5">
                            Visa for Kerala,
                            <span className="text-[#0D6E6E]"> Made Clear</span>
                        </h1>
                        <p className="text-base sm:text-xl text-[#4B5563] mb-8 sm:mb-10 leading-relaxed">
                            Confused about what visa you need, which documents to prepare, or how to apply? We guide you through the process so you arrive in Kerala with everything in order.
                        </p>
                        <CTAButton href="/plan/start?service=visa" variant="primary" size="lg">
                            Get Visa Guidance <ArrowRight size={20} />
                        </CTAButton>
                    </div>
                </div>
            </section>

            {/* Why */}
            <SectionContainer>
                <SectionHeading
                    eyebrow="Why It Helps"
                    title="Visa Paperwork Is Easy to Get Wrong"
                    subtitle="Small mistakes on visa applications cause big delays. We help you get it right the first time."
                />
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {[
                        { icon: <Globe size={24} />, title: 'All Nationalities', description: 'Whether you\'re from the Gulf, Europe, the US, or anywhere else, we know the requirements for your passport.' },
                        { icon: <ShieldCheck size={24} />, title: 'Accurate Guidance', description: 'Our guidance is based on current Indian immigration rules — we update our knowledge regularly.' },
                        { icon: <Clock size={24} />, title: 'Plan Ahead', description: 'We tell you exactly when to apply so your visa is ready well before your travel date.' },
                        { icon: <CheckCircle size={24} />, title: 'Document Ready', description: 'A precise document checklist tailored to your nationality and visa type — no guessing.' },
                    ].map((item) => (
                        <FeatureCard key={item.title} icon={item.icon} title={item.title} description={item.description} />
                    ))}
                </div>
            </SectionContainer>

            {/* Process */}
            <SectionContainer variant="tinted">
                <SectionHeading
                    eyebrow="Our Approach"
                    title="Guided Step by Step"
                    subtitle="We walk you through every stage so nothing catches you off guard."
                />
                <div className="max-w-2xl mx-auto">
                    <StepIndicator steps={steps} variant="vertical" />
                </div>
            </SectionContainer>

            {/* CTA Banner */}
            <SectionContainer variant="dark">
                <div className="text-center max-w-2xl mx-auto">
                    <SectionHeading
                        eyebrow="Start Now"
                        title="Get Your Visa Questions Answered"
                        subtitle="Tell us your nationality and travel purpose — we will explain exactly what you need and how to get it."
                        light
                    />
                    <CTAButton href="/plan/start?service=visa" variant="primary" size="lg">
                        Get Visa Guidance <ArrowRight size={20} />
                    </CTAButton>
                </div>
            </SectionContainer>

            {/* FAQ */}
            <SectionContainer>
                <SectionHeading eyebrow="FAQ" title="Common Questions" subtitle="Answers to the most asked visa questions for Kerala travel." />
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
