'use client'

import { cn } from '@/lib/utils'
import { IconMenu2, IconX, IconChevronDown } from '@tabler/icons-react'
import { usePathname } from 'next/navigation'
import Link from 'next/link'
import React, { useState, useEffect, useRef } from 'react'
import { Globe, Car, Plane, Stethoscope, Hotel, MapPin, FileText } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

const navLinks = [
    { name: 'Medical Concierge', link: '/medical' },
    { name: 'Tourism Planning', link: '/tourism' },
    { name: 'NRI Concierge', link: '/nri' },
]

const extraServices = [
    { icon: <Car size={18} />, label: 'Cab & Local Transport', href: '/services/cabs' },
    { icon: <Plane size={18} />, label: 'Flight Tickets', href: '/services/flights' },
    { icon: <Stethoscope size={18} />, label: 'Hospital Consultation', href: '/services/hospital' },
    { icon: <Hotel size={18} />, label: 'Hotel & Stays', href: '/services/stays' },
    { icon: <MapPin size={18} />, label: 'Airport Pickup', href: '/services/airport-pickup' },
    { icon: <FileText size={18} />, label: 'Visa Guidance', href: '/services/visa' },
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

// ─── Language toggle ──────────────────────────────────────────────────────────
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

// ─── Desktop Services Dropdown ────────────────────────────────────────────────
function ServicesDropdown({ dark, visible }: { dark: boolean; visible: boolean }) {
    const [isOpen, setIsOpen] = useState(false)
    const timeoutRef = useRef<NodeJS.Timeout>(null)

    const handleMouseEnter = () => {
        if (timeoutRef.current) clearTimeout(timeoutRef.current)
        setIsOpen(true)
    }

    const handleMouseLeave = () => {
        timeoutRef.current = setTimeout(() => setIsOpen(false), 200)
    }

    return (
        <div
            className="relative"
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
        >
            <button
                className={cn(
                    'flex items-center gap-1 px-3 py-2 text-sm font-medium transition-colors duration-200 rounded-lg hover:bg-black/5',
                    dark ? 'text-[#1C1C1E]' : 'text-[#4B5563]',
                    isOpen && 'text-[#0D6E6E]'
                )}
            >
                Other Services
                <IconChevronDown size={14} className={cn('transition-transform duration-300', isOpen && 'rotate-180')} />
            </button>

            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                        transition={{ duration: 0.2 }}
                        className={cn(
                            "absolute top-full left-1/2 -translate-x-1/2 mt-2 w-64 bg-white/95 backdrop-blur-xl rounded-2xl border border-[#E8E4DF] shadow-xl p-2 z-[60]"
                        )}
                    >
                        <div className="grid grid-cols-1 gap-1">
                            {extraServices.map((service) => (
                                <Link
                                    key={service.label}
                                    href={service.href}
                                    className="flex items-center gap-3 p-3 rounded-xl hover:bg-[#F2EFE9] transition-colors group"
                                    onClick={() => setIsOpen(false)}
                                >
                                    <div className="w-8 h-8 rounded-lg bg-[#0D6E6E]/10 flex items-center justify-center text-[#0D6E6E] group-hover:bg-[#0D6E6E] group-hover:text-white transition-colors">
                                        {service.icon}
                                    </div>
                                    <span className="text-sm font-semibold text-[#1C1C1E]">{service.label}</span>
                                </Link>
                            ))}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    )
}

// ─── NavItems ─────────────────────────────────────────────────────────────────
function NavItems({
    items,
    className,
    onItemClick,
    dark,
    visible,
}: {
    items: typeof navLinks
    className?: string
    onItemClick?: () => void
    dark?: boolean
    visible?: boolean
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
                                    ? isActive ? 'text-[#C9A84C] font-bold' : 'text-[#1C1C1E]'
                                    : isActive ? 'text-[#C9A84C] font-bold' : 'text-[#4B5563]',
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
            <ServicesDropdown dark={!!dark} visible={!!visible} />
            <Link
                href="/about"
                className={cn(
                    'px-3 py-2 text-sm font-medium transition-colors duration-200 rounded-lg hover:bg-black/5',
                    dark ? 'text-[#1C1C1E]' : 'text-[#4B5563]',
                )}
            >
                About
            </Link>
            <Link
                href="/contact"
                className={cn(
                    'px-3 py-2 text-sm font-medium transition-colors duration-200 rounded-lg hover:bg-black/5',
                    dark ? 'text-[#1C1C1E]' : 'text-[#4B5563]',
                )}
            >
                Contact
            </Link>
        </div>
    )
}

// ─── Logo ─────────────────────────────────────────────────────────────────────
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

// ─── Main Header ──────────────────────────────────────────────────────────────
export default function Header() {
    const [visible, setVisible] = useState(false)
    const [mobileVisible, setMobileVisible] = useState(true)
    const [mobileOpen, setMobileOpen] = useState(false)
    const [mobileServicesOpen, setMobileServicesOpen] = useState(false)
    const { isMobile } = useMobileDetection()
    const { lang, toggleLang } = useLang()
    const lastScrollY = useRef(0)

    useEffect(() => {
        let ticking = false
        const onScroll = () => {
            if (!ticking) {
                window.requestAnimationFrame(() => {
                    const currentY = window.scrollY

                    // Desktop pill visibility
                    setVisible(currentY > 50)

                    // Mobile auto-hide: show at top, hide on scroll-down, show on scroll-up
                    if (currentY <= 60) {
                        setMobileVisible(true)
                    } else if (currentY > lastScrollY.current + 8) {
                        setMobileVisible(false)
                        setMobileOpen(false)
                    } else if (currentY < lastScrollY.current - 4) {
                        setMobileVisible(true)
                    }

                    lastScrollY.current = currentY
                    ticking = false
                })
                ticking = true
            }
        }
        window.addEventListener('scroll', onScroll, { passive: true })
        return () => window.removeEventListener('scroll', onScroll)
    }, [])

    // ── Mobile layout ─────────────────────────────────────────────────────────
    if (isMobile) {
        return (
            <header
                className={cn(
                    'fixed top-0 left-0 right-0 z-50 bg-white/60 backdrop-blur-xl border-b border-white/30 shadow-sm',
                    'transition-all duration-300 ease-in-out',
                    mobileVisible ? 'translate-y-0 opacity-100' : '-translate-y-full opacity-0',
                )}
            >
                <div className="flex items-center justify-between px-4 py-2">
                    <RoamioLogo dark />
                    <button
                        onClick={() => {
                            setMobileOpen(!mobileOpen)
                            setMobileServicesOpen(false)
                        }}
                        aria-label="Toggle menu"
                        className="p-1.5 rounded-lg text-[#1C1C1E]"
                    >
                        {mobileOpen ? <IconX size={20} /> : <IconMenu2 size={20} />}
                    </button>
                </div>

                <AnimatePresence>
                    {mobileOpen && (
                        <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            className="overflow-hidden bg-white/70 backdrop-blur-xl border-t border-white/30 shadow-lg px-4 pb-5 pt-3 flex flex-col gap-1"
                        >
                            {navLinks.map((item) => (
                                <Link
                                    key={item.link}
                                    href={item.link}
                                    className="py-2.5 px-3 rounded-xl text-sm text-[#1C1C1E] font-medium hover:bg-[#F2EFE9] transition-colors"
                                    onClick={() => setMobileOpen(false)}
                                >
                                    {item.name}
                                </Link>
                            ))}

                            {/* Mobile Services Trigger */}
                            <div>
                                <button
                                    onClick={() => setMobileServicesOpen(!mobileServicesOpen)}
                                    className="w-full flex items-center justify-between py-2.5 px-3 rounded-xl text-sm text-[#1C1C1E] font-medium hover:bg-[#F2EFE9] transition-colors"
                                >
                                    <span>Other Services</span>
                                    <IconChevronDown size={18} className={cn('transition-transform duration-300', mobileServicesOpen && 'rotate-180')} />
                                </button>

                                <AnimatePresence>
                                    {mobileServicesOpen && (
                                        <motion.div
                                            initial={{ height: 0, opacity: 0 }}
                                            animate={{ height: 'auto', opacity: 1 }}
                                            exit={{ height: 0, opacity: 0 }}
                                            className="overflow-hidden pl-4 pr-2 mt-1 flex flex-col gap-1"
                                        >
                                            {extraServices.map((service) => (
                                                <Link
                                                    key={service.label}
                                                    href={service.href}
                                                    className="flex items-center gap-3 py-2.5 px-3 rounded-xl hover:bg-[#F2EFE9]/50 transition-colors"
                                                    onClick={() => setMobileOpen(false)}
                                                >
                                                    <div className="w-7 h-7 rounded-lg bg-[#0D6E6E]/10 flex items-center justify-center text-[#0D6E6E]">
                                                        {service.icon}
                                                    </div>
                                                    <span className="text-xs font-semibold text-[#4B5563]">{service.label}</span>
                                                </Link>
                                            ))}
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>

                            <Link
                                href="/about"
                                className="py-2.5 px-3 rounded-xl text-sm text-[#1C1C1E] font-medium hover:bg-[#F2EFE9] transition-colors"
                                onClick={() => setMobileOpen(false)}
                            >
                                About
                            </Link>
                            <Link
                                href="/contact"
                                className="py-2.5 px-3 rounded-xl text-sm text-[#1C1C1E] font-medium hover:bg-[#F2EFE9] transition-colors"
                                onClick={() => setMobileOpen(false)}
                            >
                                Contact
                            </Link>

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
                                    className="px-4 py-2 rounded-xl text-xs font-semibold bg-[#C9A84C] text-white hover:bg-[#b8962f] transition-all duration-200"
                                    onClick={() => setMobileOpen(false)}
                                >
                                    Plan My Visit
                                </Link>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </header>
        )
    }

    // ── Desktop layout ────────────────────────────────────────────────────────
    return (
        <div className="fixed top-0 left-0 z-50 w-full transition-all duration-300 flex justify-center">
            <div
                className={cn(
                    'flex w-full flex-row items-center justify-between transition-all duration-300 ease-in-out',
                    visible
                        ? 'bg-white/60 backdrop-blur-xl shadow-sm rounded-full mt-4 max-w-6xl px-8 py-3'
                        : 'bg-transparent max-w-7xl px-8 py-5',
                )}
            >
                <RoamioLogo dark={visible} />
                <NavItems items={navLinks} dark={visible} visible={visible} />
                <div className="flex items-center gap-3">
                    <button
                        onClick={toggleLang}
                        className="flex items-center gap-1.5 text-sm font-medium text-[#6B7280] transition-colors hover:text-[#C9A84C]"
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
