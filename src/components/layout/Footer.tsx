import Link from 'next/link'
import { MapPin, Phone, Mail, MessageCircle, Facebook, Instagram, Twitter, Linkedin, Shield } from 'lucide-react'

const footerLinks = {
    services: [
        { label: 'Medical Concierge', href: '/medical' },
        { label: 'Tourism Planning', href: '/tourism' },
        { label: 'NRI Concierge', href: '/nri' },
        { label: 'Plan My Visit', href: '/plan/start' },
    ],
    company: [
        { label: 'About Roamio', href: '/about' },
        { label: 'Contact Us', href: '/contact' },
        { label: 'Privacy Policy', href: '/privacy' },
        { label: 'Terms of Service', href: '/terms' },
    ],
    destinations: [
        { label: 'Kochi', href: '/tourism#kochi' },
        { label: 'Munnar', href: '/tourism#munnar' },
        { label: 'Alappuzha', href: '/tourism#alappuzha' },
        { label: 'Wayanad', href: '/tourism#wayanad' },
    ],
}

export default function Footer() {
    return (
        <footer className="bg-[#0a2e2e] text-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12">
                    {/* Brand col */}
                    <div className="lg:col-span-2">
                        <Link href="/" className="flex items-center gap-2 mb-4">
                            <div className="w-9 h-9 rounded-lg gradient-primary flex items-center justify-center">
                                <span className="text-white text-base font-bold">R</span>
                            </div>
                            <span className="text-2xl font-bold text-white">Roamio</span>
                        </Link>
                        <p className="text-white/70 text-sm leading-relaxed mb-6 max-w-xs">
                            An intelligent concierge platform for medical travel, tourism planning, and NRI visits to Kerala.
                            Smart planning. Seamless coordination. Trusted execution.
                        </p>

                        {/* Contact */}
                        <div className="space-y-2 mb-6">
                            <div className="flex items-center gap-2 text-sm text-white/70">
                                <MapPin size={14} className="text-[#C9A84C] shrink-0" />
                                <span>Kochi, Kerala, India</span>
                            </div>
                            <div className="flex items-center gap-2 text-sm text-white/70">
                                <Phone size={14} className="text-[#C9A84C] shrink-0" />
                                <a href="tel:+919999999999" className="hover:text-white transition-colors">+91 99999 99999</a>
                            </div>
                            <div className="flex items-center gap-2 text-sm text-white/70">
                                <Mail size={14} className="text-[#C9A84C] shrink-0" />
                                <a href="mailto:hello@roamio.in" className="hover:text-white transition-colors">hello@roamio.in</a>
                            </div>
                        </div>

                        {/* WhatsApp CTA */}
                        <a
                            href="https://wa.me/919999999999?text=Hi%20Roamio%2C%20I%20want%20to%20plan%20my%20visit"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 bg-[#25D366] text-white px-4 py-2.5 rounded-xl text-sm font-semibold hover:bg-[#1ebe5d] transition-colors"
                        >
                            <MessageCircle size={16} />
                            Chat on WhatsApp
                        </a>
                    </div>

                    {/* Services */}
                    <div>
                        <h4 className="font-semibold text-white mb-4">Services</h4>
                        <ul className="space-y-2.5">
                            {footerLinks.services.map((link) => (
                                <li key={link.href}>
                                    <Link
                                        href={link.href}
                                        className="text-white/60 text-sm hover:text-[#C9A84C] transition-colors"
                                    >
                                        {link.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Company */}
                    <div>
                        <h4 className="font-semibold text-white mb-4">Company</h4>
                        <ul className="space-y-2.5">
                            {footerLinks.company.map((link) => (
                                <li key={link.href}>
                                    <Link
                                        href={link.href}
                                        className="text-white/60 text-sm hover:text-[#C9A84C] transition-colors"
                                    >
                                        {link.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Destinations */}
                    <div>
                        <h4 className="font-semibold text-white mb-4">Destinations</h4>
                        <ul className="space-y-2.5">
                            {footerLinks.destinations.map((link) => (
                                <li key={link.href}>
                                    <Link
                                        href={link.href}
                                        className="text-white/60 text-sm hover:text-[#C9A84C] transition-colors"
                                    >
                                        {link.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>

                {/* Bottom bar */}
                <div className="mt-12 pt-8 border-t border-white/10">
                    {/* Disclaimer */}
                    <div className="flex items-start gap-2.5 bg-white/5 rounded-xl p-4 mb-6">
                        <Shield size={16} className="text-[#C9A84C] mt-0.5 shrink-0" />
                        <p className="text-xs text-white/50 leading-relaxed">
                            <strong className="text-white/70">Medical Disclaimer:</strong> Roamio does not provide medical diagnosis, treatment advice, or direct medical services. We are a concierge coordination service. All medical decisions must be made by qualified healthcare professionals.
                        </p>
                    </div>

                    <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                        <p className="text-white/40 text-xs">
                            © {new Date().getFullYear()} Roamio. All rights reserved.
                        </p>
                        {/* Social */}
                        <div className="flex items-center gap-4">
                            {[
                                { Icon: Facebook, href: '#', label: 'Facebook' },
                                { Icon: Instagram, href: '#', label: 'Instagram' },
                                { Icon: Twitter, href: '#', label: 'Twitter' },
                                { Icon: Linkedin, href: '#', label: 'LinkedIn' },
                            ].map(({ Icon, href, label }) => (
                                <a
                                    key={label}
                                    href={href}
                                    aria-label={label}
                                    className="text-white/40 hover:text-[#C9A84C] transition-colors"
                                >
                                    <Icon size={16} />
                                </a>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    )
}
