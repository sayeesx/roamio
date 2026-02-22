import { cn } from '@/lib/utils'

interface FeatureCardProps {
    icon: React.ReactNode
    title: string
    description: string
    className?: string
    accent?: boolean
}

export function FeatureCard({ icon, title, description, className, accent }: FeatureCardProps) {
    return (
        <div
            className={cn(
                'group relative p-5 sm:p-8 rounded-2xl border border-[#E8E4DF] bg-white',
                'hover:shadow-xl hover:-translate-y-1 transition-all duration-300',
                accent && 'border-[#C9A84C]/30 bg-gradient-to-br from-white to-[#fdf9ef]',
                className,
            )}
        >
            <div className="flex items-center gap-3 sm:gap-4 mb-3 sm:mb-5">
                <div className="w-10 h-10 sm:w-14 sm:h-14 rounded-xl gradient-primary flex items-center justify-center text-white group-hover:scale-110 transition-transform duration-300 shrink-0">
                    {icon}
                </div>
                <h3 className="text-lg sm:text-xl font-bold text-[#1C1C1E]">{title}</h3>
            </div>
            <p className="text-[#6B7280] text-sm leading-relaxed">{description}</p>
        </div>
    )
}

interface StepIndicatorProps {
    steps: { number: number; label: string; description?: string }[]
    variant?: 'horizontal' | 'vertical'
}

export function StepIndicator({ steps, variant = 'horizontal' }: StepIndicatorProps) {
    if (variant === 'vertical') {
        return (
            <div className="space-y-8">
                {steps.map((step, i) => (
                    <div key={step.number} className="flex gap-5">
                        <div className="flex flex-col items-center">
                            <div className="w-10 h-10 rounded-full gradient-primary flex items-center justify-center text-white font-bold text-sm shrink-0">
                                {step.number}
                            </div>
                            {i < steps.length - 1 && (
                                <div className="w-0.5 h-12 bg-[#0D6E6E]/20 mt-2" />
                            )}
                        </div>
                        <div className="pt-1.5">
                            <h4 className="font-semibold text-[#1C1C1E] mb-1">{step.label}</h4>
                            {step.description && (
                                <p className="text-sm text-[#6B7280] leading-relaxed">{step.description}</p>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        )
    }

    return (
        <div className="flex flex-col sm:flex-row gap-8 sm:gap-0">
            {steps.map((step, i) => (
                <div key={step.number} className="flex sm:flex-col flex-1 gap-4 sm:gap-0">
                    {/* Number + horizontal connector (desktop) */}
                    <div className="flex items-center sm:flex-col sm:items-center gap-0">
                        <div className="w-11 h-11 rounded-full gradient-primary flex items-center justify-center text-white font-bold shrink-0">
                            {step.number}
                        </div>
                        {i < steps.length - 1 && (
                            <div className="hidden sm:block h-0.5 flex-1 bg-gradient-to-r from-[#0D6E6E] to-[#0D6E6E]/20 mt-5 mx-3" />
                        )}
                    </div>
                    {/* Text */}
                    <div className="sm:text-center sm:mt-4 sm:px-3 flex-1">
                        <h4 className="font-semibold text-[#1C1C1E] text-sm sm:text-base mb-1">{step.label}</h4>
                        {step.description && (
                            <p className="text-xs sm:text-sm text-[#6B7280] leading-relaxed">{step.description}</p>
                        )}
                    </div>
                </div>
            ))}
        </div>
    )
}

interface StatusBadgeProps {
    status: 'pending' | 'confirmed' | 'in_progress' | 'completed'
}

export function StatusBadge({ status }: StatusBadgeProps) {
    const config = {
        pending: { label: 'Pending Review', bg: 'bg-amber-100', text: 'text-amber-800', dot: 'bg-amber-500' },
        confirmed: { label: 'Confirmed', bg: 'bg-green-100', text: 'text-green-800', dot: 'bg-green-500' },
        in_progress: { label: 'In Progress', bg: 'bg-blue-100', text: 'text-blue-800', dot: 'bg-blue-500' },
        completed: { label: 'Completed', bg: 'bg-teal-100', text: 'text-teal-800', dot: 'bg-teal-500' },
    }
    const c = config[status]
    return (
        <span className={cn('inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-medium', c.bg, c.text)}>
            <span className={cn('w-2 h-2 rounded-full animate-pulse', c.dot)} />
            {c.label}
        </span>
    )
}
