import { Mail, Phone, MapPin, MessageCircle } from 'lucide-react'
import { SectionContainer, SectionHeading } from '@/components/ui/SectionContainer'
import type { Metadata } from 'next'

export const metadata: Metadata = {
    title: 'Contact Roamio',
    description: 'Get in touch with Roamio — your AI concierge for Kerala medical travel, tourism, and NRI visits. WhatsApp, email, or phone.',
}

export default function ContactPage() {
    return (
        <>
            <section className="relative pt-32 pb-20 gradient-hero overflow-hidden">
                <div className="absolute inset-0 opacity-10">
                    <div className="absolute top-20 right-20 w-72 h-72 rounded-full bg-[#C9A84C] blur-3xl" />
                </div>
                <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="max-w-2xl">
                        <h1 className="text-4xl sm:text-5xl font-bold text-white leading-[1.1] mb-4">
                            Get in <span className="text-[#C9A84C]">Touch</span>
                        </h1>
                        <p className="text-xl text-white/80">We&apos;re here to help you plan your perfect Kerala experience.</p>
                    </div>
                </div>
            </section>

            <SectionContainer>
                <div className="grid lg:grid-cols-2 gap-16">
                    {/* Contact info */}
                    <div>
                        <SectionHeading eyebrow="Contact" title="Reach Us Anytime" centered={false} />
                        <div className="space-y-6">
                            {[
                                { icon: <Phone size={20} />, label: 'Phone', value: '+91 99999 99999', href: 'tel:+919999999999' },
                                { icon: <Mail size={20} />, label: 'Email', value: 'hello@roamio.in', href: 'mailto:hello@roamio.in' },
                                { icon: <MapPin size={20} />, label: 'Address', value: 'Kochi, Kerala, India 682001', href: '#' },
                                { icon: <MessageCircle size={20} />, label: 'WhatsApp', value: 'Chat with us instantly', href: 'https://wa.me/919999999999' },
                            ].map((item) => (
                                <a
                                    key={item.label}
                                    href={item.href}
                                    className="flex gap-4 group hover:text-[#0D6E6E] transition-colors"
                                >
                                    <div className="w-12 h-12 rounded-xl bg-[#F2EFE9] flex items-center justify-center text-[#0D6E6E] shrink-0 group-hover:gradient-primary group-hover:text-white transition-all">
                                        {item.icon}
                                    </div>
                                    <div>
                                        <p className="text-xs font-semibold text-[#6B7280] uppercase tracking-wide mb-0.5">{item.label}</p>
                                        <p className="text-[#1C1C1E] font-medium group-hover:text-[#0D6E6E] transition-colors">{item.value}</p>
                                    </div>
                                </a>
                            ))}
                        </div>
                    </div>

                    {/* Simple contact form */}
                    <div className="bg-white rounded-2xl border border-[#E8E4DF] p-8 shadow-sm">
                        <h2 className="text-2xl font-bold text-[#1C1C1E] mb-6">Send a Message</h2>
                        <form className="space-y-5">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-[#1C1C1E] mb-1.5">First Name</label>
                                    <input
                                        type="text"
                                        className="w-full rounded-xl border border-[#E8E4DF] px-4 py-3 text-sm focus:outline-none focus:border-[#0D6E6E] focus:ring-2 focus:ring-[#0D6E6E]/10 transition-all"
                                        placeholder="Ahmed"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-[#1C1C1E] mb-1.5">Last Name</label>
                                    <input
                                        type="text"
                                        className="w-full rounded-xl border border-[#E8E4DF] px-4 py-3 text-sm focus:outline-none focus:border-[#0D6E6E] focus:ring-2 focus:ring-[#0D6E6E]/10 transition-all"
                                        placeholder="Al-Rashidi"
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-[#1C1C1E] mb-1.5">Email</label>
                                <input type="email" className="w-full rounded-xl border border-[#E8E4DF] px-4 py-3 text-sm focus:outline-none focus:border-[#0D6E6E] focus:ring-2 focus:ring-[#0D6E6E]/10 transition-all" placeholder="hello@example.com" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-[#1C1C1E] mb-1.5">Message</label>
                                <textarea
                                    rows={4}
                                    className="w-full rounded-xl border border-[#E8E4DF] px-4 py-3 text-sm focus:outline-none focus:border-[#0D6E6E] focus:ring-2 focus:ring-[#0D6E6E]/10 transition-all resize-none"
                                    placeholder="Tell us how we can help..."
                                />
                            </div>
                            <button
                                type="submit"
                                className="w-full py-3.5 rounded-xl font-semibold text-white gradient-primary hover:opacity-90 transition-opacity text-sm"
                            >
                                Send Message
                            </button>
                        </form>
                    </div>
                </div>
            </SectionContainer>
        </>
    )
}
