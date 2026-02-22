import { cn } from '@/lib/utils'

interface SectionContainerProps {
    children: React.ReactNode
    className?: string
    id?: string
    variant?: 'default' | 'tinted' | 'dark'
}

export function SectionContainer({ children, className, id, variant = 'default' }: SectionContainerProps) {
    return (
        <section
            id={id}
            className={cn(
                'py-12 sm:py-16 lg:py-28',
                variant === 'tinted' && 'bg-[#F2EFE9]',
                variant === 'dark' && 'bg-[#0a2e2e] text-white',
                className,
            )}
        >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {children}
            </div>
        </section>
    )
}

interface SectionHeadingProps {
    eyebrow?: string
    title: string
    subtitle?: string
    subtitleClassName?: string
    centered?: boolean
    light?: boolean
}

export function SectionHeading({ eyebrow, title, subtitle, subtitleClassName, centered = true, light = false }: SectionHeadingProps) {
    return (
        <div className={cn('mb-8 sm:mb-14', centered && 'text-center')}>
            {eyebrow && (
                <p className="text-sm font-semibold tracking-widest uppercase text-[#C9A84C] mb-3">
                    {eyebrow}
                </p>
            )}
            <h2 className={cn(
                'text-2xl sm:text-3xl lg:text-5xl font-bold leading-tight mb-4',
                light ? 'text-white' : 'text-[#1C1C1E]',
            )}>
                {title}
            </h2>
            {subtitle && (
                <p className={cn(
                    'text-base sm:text-lg max-w-2xl leading-relaxed break-words',
                    centered && 'mx-auto',
                    light ? 'text-white/70' : 'text-[#6B7280]',
                    subtitleClassName,
                )}>
                    {subtitle}
                </p>
            )}
        </div>
    )
}
