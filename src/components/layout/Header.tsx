'use client'

import { cn } from '@/lib/utils'
import { IconMenu2, IconX } from '@tabler/icons-react'
import { usePathname } from 'next/navigation'
import Link from 'next/link'
import React, { useState, useEffect } from 'react'
import { Globe } from 'lucide-react'

const navLinks = [
    { name: 'Medical Concierge', link: '/medical' },
    { name: 'Tourism Planning', link: '/tourism' },
    { name: 'NRI Concierge', link: '/nri' },
    { name: 'About', link: '/about' },
    { name: 'Contact', link: '/contact' },
]

// ─── Mobile detection (avoids hydration mismatch) ───────────────────────────
const useMobileDetection = () => {
    const [isMobile, setIsMobile] = useState(false)
    const [hasMounted, setHasMounted] = useState(false)

    useEffect(() => {
        setHasMounted(true)
        const check = () => setIsMobile(window.innerWidth < 1024)
        check()
        window.addEventListener('resize', check)
        return () => window.removeEventListener('resize', check)
    }, [])

    return { isMobile: hasMounted ? isMobile : false, hasMounted }
}

// ─── Language toggle (preserved from original) ──────────────────────────────
const useLang = () => {
    const [lang, setLang] = useState<'EN' | 'AR'>('EN')
    const toggleLang = () => {
        const next = lang === 'EN' ? 'AR' : 'EN'
        setLang(next)
        document.documentElement.setAttribute('dir', next === 'AR' ? 'rtl' : 'ltr')
        document.documentElement.setAttribute('lang', next === 'AR' ? 'ar' : 'en')
    }
    return { lang, toggleLang }
}

// ─── NavItems ────────────────────────────────────────────────────────────────
function NavItems({
    items,
    className,
    onItemClick,
    dark,
}: {
    items: typeof navLinks
    className?: string
    onItemClick?: () => void
    dark?: boolean
}) {
    const pathname = usePathname()
    const [loadingItem, setLoadingItem] = useState<string | null>(null)

    const handleClick = (link: string) => {
        setLoadingItem(link)
        onItemClick?.()
        setTimeout(() => setLoadingItem(null), 1000)
    }

    return (
        <div className={cn('flex flex-row items-center gap-1', className)}>
            {items.map((item) => {
                const isActive = pathname === item.link
                const isLoading = loadingItem === item.link
                return (
                    <div key={item.link} className="relative">
                        <Link
                            href={item.link}
                            onClick={() => handleClick(item.link)}
                            className={cn(
                                'relative px-3 py-2 text-sm font-medium transition-colors duration-200 rounded-lg hover:bg-black/5',
                                dark
                                    ? isActive
                                        ? 'text-[#C9A84C] font-bold'
                                        : 'text-[#1C1C1E]'
                                    : isActive
                                        ? 'text-[#C9A84C] font-bold'
                                        : 'text-[#4B5563]',
                            )}
                        >
                            {item.name}
                        </Link>
                        {isLoading && (
                            <div className="absolute -right-1 top-1/2 -translate-y-1/2 w-3 h-3">
                                <div className="w-3 h-3 border border-[#C9A84C] border-t-transparent rounded-full animate-spin" />
                            </div>
                        )}
                    </div>
                )
            })}
        </div>
    )
}

// ─── Main Header ─────────────────────────────────────────────────────────────
export default function Header() {
    const [visible, setVisible] = useState(false)
    const [mobileOpen, setMobileOpen] = useState(false)
    const { isMobile } = useMobileDetection()
    const { lang, toggleLang } = useLang()

    useEffect(() => {
        let ticking = false
        const onScroll = () => {
            if (!ticking) {
                window.requestAnimationFrame(() => {
                    setVisible(window.scrollY > 50)
                    ticking = false
                })
                ticking = true
            }
        }
        window.addEventListener('scroll', onScroll, { passive: true })
        return () => window.removeEventListener('scroll', onScroll)
    }, [])

    // ── Mobile layout ──────────────────────────────────────────────────────────
    if (isMobile) {
        return (
            <header className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-[#E8E4DF] shadow-sm">
                <div className="flex items-center justify-between px-4 py-3">
                    {/* Logo */}
                    <RoamioLogo dark />

                    <button
                        onClick={() => setMobileOpen(!mobileOpen)}
                        aria-label="Toggle menu"
                        className="p-2 rounded-lg text-[#1C1C1E]"
                    >
                        {mobileOpen ? <IconX size={24} /> : <IconMenu2 size={24} />}
                    </button>
                </div>

                {/* Mobile dropdown */}
                {mobileOpen && (
                    <div className="bg-white border-t border-[#E8E4DF] shadow-lg px-4 pb-5 pt-3 flex flex-col gap-1 animate-fade-in">
                        {navLinks.map((item) => (
                            <Link
                                key={item.link}
                                href={item.link}
                                className="py-2 px-2.5 rounded-lg text-sm text-[#1C1C1E] font-medium hover:bg-[#F2EFE9] transition-colors"
                                onClick={() => setMobileOpen(false)}
                            >
                                {item.name}
                            </Link>
                        ))}
                        <div className="flex items-center justify-between pt-3 mt-2 border-t border-[#E8E4DF]">
                            <button
                                onClick={toggleLang}
                                className="flex items-center gap-1.5 text-sm text-[#6B7280]"
                            >
                                <Globe size={16} />
                                {lang === 'EN' ? 'English' : 'عربي'}
                            </button>
                            <Link
                                href="/plan/start"
                                className="px-3 py-2 rounded-lg text-xs font-semibold bg-[#C9A84C] text-white hover:bg-[#b8962f] transition-colors"
                                onClick={() => setMobileOpen(false)}
                            >
                                Plan My Visit
                            </Link>
                        </div>
                    </div>
                )}
            </header>
        )
    }

    // ── Desktop layout ─────────────────────────────────────────────────────────
    return (
        <div className="fixed top-0 left-0 z-50 w-full transition-all duration-300 flex justify-center">
            <div
                className={cn(
                    'flex w-full flex-row items-center justify-between transition-all duration-300 ease-in-out',
                    visible
                        ? 'bg-white/60 backdrop-blur-xl shadow-sm rounded-full mt-4 max-w-5xl px-6 py-3'
                        : 'bg-transparent max-w-7xl px-8 py-5',
                )}
            >
                {/* Logo */}
                <RoamioLogo dark={visible} />

                {/* Nav items */}
                <NavItems items={navLinks} dark={visible} />

                {/* Right actions */}
                <div className="flex items-center gap-3">
                    <button
                        onClick={toggleLang}
                        className={cn(
                            'flex items-center gap-1.5 text-sm font-medium transition-colors hover:text-[#C9A84C]',
                            visible ? 'text-[#6B7280]' : 'text-[#6B7280]',
                        )}
                        aria-label="Toggle language"
                    >
                        <Globe size={16} />
                        {lang}
                    </button>
                    <Link
                        href="/plan/start"
                        className="px-5 py-2.5 rounded-xl text-sm font-semibold bg-[#C9A84C] text-white hover:bg-[#b8962f] transition-all duration-200 shadow-sm hover:shadow-md hover:-translate-y-0.5"
                    >
                        Plan My Visit
                    </Link>
                </div>
            </div>
        </div>
    )
}

// ─── Logo component ──────────────────────────────────────────────────────────
function RoamioLogo({ dark }: { dark?: boolean }) {
    const pathname = usePathname()
    return (
        <Link
            href="/"
            className="flex items-center gap-2 group"
            onClick={(e) => {
                if (pathname === '/') {
                    window.scrollTo({ top: 0, behavior: 'smooth' })
                    e.preventDefault()
                }
            }}
        >
            <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-[#0D6E6E] flex items-center justify-center shadow-sm">
                <span className="text-white text-xs sm:text-sm font-bold">R</span>
            </div>
            <span className={cn('text-lg sm:text-xl font-bold tracking-tight transition-colors', dark ? 'text-[#0D6E6E]' : 'text-[#1C1C1E]')}>
                Roamio
            </span>
        </Link>
    )
}
