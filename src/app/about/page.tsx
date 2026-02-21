import { ArrowRight, Globe, Heart, Users, Sparkles } from 'lucide-react'
import { SectionContainer, SectionHeading } from '@/components/ui/SectionContainer'
import { CTAButton } from '@/components/ui/CTAButton'
import type { Metadata } from 'next'

export const metadata: Metadata = {
    title: 'About Roamio',
    description: 'Learn about Roamio — the AI-powered concierge platform built to connect the world with Kerala\'s best medical care and tourism experiences.',
}

export default function AboutPage() {
    return (
        <>
            <section className="relative pt-32 pb-20 gradient-hero overflow-hidden">
                <div className="absolute inset-0 opacity-10">
                    <div className="absolute top-20 right-20 w-72 h-72 rounded-full bg-[#C9A84C] blur-3xl" />
                </div>
                <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="max-w-3xl">
                        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white leading-[1.1] mb-6">
                            About <span className="text-[#C9A84C]">Roamio</span>
                        </h1>
                        <p className="text-xl text-white/80 leading-relaxed">
                            We built Roamio because we saw a gap: Kerala has world-class medical and tourism offerings, but no intelligent system to help visitors navigate them.
                        </p>
                    </div>
                </div>
            </section>

            <SectionContainer>
                <div className="grid lg:grid-cols-2 gap-16 items-start">
                    <div>
                        <SectionHeading eyebrow="Our Mission" title="Intelligent Concierge, Human Care" centered={false} />
                        <div className="space-y-5 text-[#6B7280] leading-relaxed">
                            <p>Roamio is not a travel booking site. We are an intelligent concierge — a system that listens, plans, and executes on your behalf.</p>
                            <p>Our AI understands your needs. Our human team acts on the ground. Together, they deliver an experience that feels personal, not transactional.</p>
                            <p>We serve medical tourists seeking healing in Kerala, NRIs reconnecting with home, and international visitors who want to experience Kerala authentically and deeply.</p>
                        </div>
                    </div>
                    <div className="space-y-6">
                        {[
                            { icon: <Sparkles size={24} />, title: 'AI-First Planning', desc: 'Our AI engine generates personalized plans tailored to each individual — not templates.' },
                            { icon: <Users size={24} />, title: 'Local Human Team', desc: 'Verified, experienced Kerala-based coordinators who execute your plan on the ground.' },
                            { icon: <Globe size={24} />, title: 'Global Reach', desc: 'Serving visitors from the Gulf, UK, US, Europe, and beyond — multilingual and culturally aware.' },
                            { icon: <Heart size={24} />, title: 'Care at the Core', desc: 'Not a marketplace. Not a directory. A concierge that genuinely cares about your outcome.' },
                        ].map((item) => (
                            <div key={item.title} className="flex gap-4">
                                <div className="w-10 h-10 rounded-xl gradient-primary flex items-center justify-center text-white shrink-0">
                                    {item.icon}
                                </div>
                                <div>
                                    <h4 className="font-semibold text-[#1C1C1E] mb-1">{item.title}</h4>
                                    <p className="text-[#6B7280] text-sm leading-relaxed">{item.desc}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </SectionContainer>

            <SectionContainer variant="dark">
                <div className="text-center max-w-xl mx-auto">
                    <SectionHeading eyebrow="Begin" title="Ready to Experience Roamio?" light />
                    <CTAButton href="/plan/start" variant="primary" size="lg">
                        Plan My Visit <ArrowRight size={20} />
                    </CTAButton>
                </div>
            </SectionContainer>
        </>
    )
}
