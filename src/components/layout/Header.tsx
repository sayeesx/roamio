'use client'

import Link from 'next/link'
import { useState, useEffect } from 'react'
import { Menu, X, Globe } from 'lucide-react'

const navItems = [
    { label: 'Medical Concierge', href: '/medical' },
    { label: 'Tourism Planning', href: '/tourism' },
    { label: 'NRI Concierge', href: '/nri' },
    { label: 'About', href: '/about' },
    { label: 'Contact', href: '/contact' },
]

export default function Header() {
    const [scrolled, setScrolled] = useState(false)
    const [mobileOpen, setMobileOpen] = useState(false)
    const [lang, setLang] = useState<'EN' | 'AR'>('EN')

    useEffect(() => {
        const handler = () => setScrolled(window.scrollY > 20)
        window.addEventListener('scroll', handler, { passive: true })
        return () => window.removeEventListener('scroll', handler)
    }, [])

    const toggleLang = () => {
        const next = lang === 'EN' ? 'AR' : 'EN'
        setLang(next)
        document.documentElement.setAttribute('dir', next === 'AR' ? 'rtl' : 'ltr')
        document.documentElement.setAttribute('lang', next === 'AR' ? 'ar' : 'en')
    }

    return (
        <header
            className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled
                    ? 'bg-white/95 backdrop-blur-md shadow-sm border-b border-[#E8E4DF]'
                    : 'bg-transparent'
                }`}
        >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16 lg:h-20">
                    {/* Logo */}
                    <Link href="/" className="flex items-center gap-2 group">
                        <div className="w-8 h-8 rounded-lg gradient-primary flex items-center justify-center">
                            <span className="text-white text-sm font-bold">R</span>
                        </div>
                        <span
                            className={`text-xl font-bold tracking-tight transition-colors ${scrolled ? 'text-[#0D6E6E]' : 'text-white'
                                }`}
                        >
                            Roamio
                        </span>
                    </Link>

                    {/* Desktop Nav */}
                    <nav className="hidden lg:flex items-center gap-8">
                        {navItems.map((item) => (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={`text-sm font-medium transition-colors hover:text-[#C9A84C] ${scrolled ? 'text-[#1C1C1E]' : 'text-white/90'
                                    }`}
                            >
                                {item.label}
                            </Link>
                        ))}
                    </nav>

                    {/* Right actions */}
                    <div className="hidden lg:flex items-center gap-4">
                        <button
                            onClick={toggleLang}
                            className={`flex items-center gap-1.5 text-sm font-medium transition-colors hover:text-[#C9A84C] ${scrolled ? 'text-[#6B7280]' : 'text-white/80'
                                }`}
                            aria-label="Toggle language"
                        >
                            <Globe size={16} />
                            {lang}
                        </button>
                        <Link
                            href="/plan/start"
                            className="px-5 py-2.5 rounded-xl text-sm font-semibold bg-[#C9A84C] text-white hover:bg-[#b8962f] transition-all duration-200 shadow-md hover:shadow-lg hover:-translate-y-0.5"
                        >
                            Plan My Visit
                        </Link>
                    </div>

                    {/* Mobile toggle */}
                    <button
                        className={`lg:hidden p-2 rounded-lg transition-colors ${scrolled ? 'text-[#1C1C1E]' : 'text-white'}`}
                        onClick={() => setMobileOpen(!mobileOpen)}
                        aria-label="Toggle menu"
                    >
                        {mobileOpen ? <X size={24} /> : <Menu size={24} />}
                    </button>
                </div>
            </div>

            {/* Mobile menu */}
            {mobileOpen && (
                <div className="lg:hidden bg-white/98 backdrop-blur-md border-b border-[#E8E4DF] shadow-lg">
                    <div className="max-w-7xl mx-auto px-4 py-4 flex flex-col gap-4">
                        {navItems.map((item) => (
                            <Link
                                key={item.href}
                                href={item.href}
                                className="text-[#1C1C1E] font-medium py-2 border-b border-[#E8E4DF] hover:text-[#0D6E6E] transition-colors"
                                onClick={() => setMobileOpen(false)}
                            >
                                {item.label}
                            </Link>
                        ))}
                        <div className="flex items-center justify-between pt-2">
                            <button
                                onClick={toggleLang}
                                className="flex items-center gap-1.5 text-sm text-[#6B7280]"
                            >
                                <Globe size={16} />
                                <span>{lang === 'EN' ? 'English' : 'عربي'}</span>
                            </button>
                            <Link
                                href="/plan/start"
                                className="px-5 py-2.5 rounded-xl text-sm font-semibold bg-[#C9A84C] text-white"
                                onClick={() => setMobileOpen(false)}
                            >
                                Plan My Visit
                            </Link>
                        </div>
                    </div>
                </div>
            )}
        </header>
    )
}
