import Link from 'next/link'
import { cn } from '@/lib/utils'

interface CTAButtonProps {
    href: string
    children: React.ReactNode
    variant?: 'primary' | 'secondary' | 'outline' | 'ghost'
    size?: 'sm' | 'md' | 'lg'
    className?: string
    external?: boolean
}

export function CTAButton({
    href,
    children,
    variant = 'primary',
    size = 'md',
    className,
    external,
}: CTAButtonProps) {
    const base = 'inline-flex items-center justify-center gap-2 font-semibold rounded-xl transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2'

    const variants = {
        primary: 'bg-[#C9A84C] text-white hover:bg-[#b8962f] shadow-md hover:shadow-lg hover:-translate-y-0.5 focus-visible:ring-[#C9A84C]',
        secondary: 'bg-[#0D6E6E] text-white hover:bg-[#095555] shadow-md hover:shadow-lg hover:-translate-y-0.5 focus-visible:ring-[#0D6E6E]',
        outline: 'border-2 border-white text-white hover:bg-white hover:text-[#0D6E6E] focus-visible:ring-white',
        ghost: 'text-[#0D6E6E] hover:bg-[#0D6E6E]/10 focus-visible:ring-[#0D6E6E]',
    }

    const sizes = {
        sm: 'px-4 py-2 text-sm',
        md: 'px-6 py-3 text-base',
        lg: 'px-6 py-3 text-base sm:px-8 sm:py-4 sm:text-lg',
    }

    return (
        <Link
            href={href}
            target={external ? '_blank' : undefined}
            rel={external ? 'noopener noreferrer' : undefined}
            className={cn(base, variants[variant], sizes[size], className)}
        >
            {children}
        </Link>
    )
}
