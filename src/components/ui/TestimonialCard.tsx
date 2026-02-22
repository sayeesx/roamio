'use client'

import { Star } from 'lucide-react'

interface TestimonialCardProps {
    quote: string
    author: string
    role: string
    rating: number
}

export function TestimonialCard({ quote, author, role, rating }: TestimonialCardProps) {
    return (
        <div
            className="group relative flex items-center justify-center rounded-3xl overflow-hidden border border-[#cccccc] bg-white"
            style={{
                width: '100%',
                minHeight: '360px',
                padding: '32px',
                lineHeight: '1.6',
                transition: 'all 0.48s cubic-bezier(0.23, 1, 0.32, 1)',
            }}
            onMouseEnter={(e) => {
                const el = e.currentTarget
                el.style.boxShadow = '8px 8px #0D6E6E'
                el.style.borderColor = '#0D6E6E'
                el.style.transform = 'translate(-8px, -8px)'
            }}
            onMouseLeave={(e) => {
                const el = e.currentTarget
                el.style.boxShadow = 'none'
                el.style.borderColor = '#cccccc'
                el.style.transform = 'translate(0, 0)'
            }}
        >
            <div
                className="flex flex-col h-full justify-between gap-2 w-full"
                style={{ color: '#000000', transition: 'all 0.48s cubic-bezier(0.23, 1, 0.32, 1)' }}
            >
                {/* Header */}
                <div>
                    <p className="font-bold text-[#1C1C1E]">{author}</p>
                    <p className="opacity-80 text-sm" style={{ transition: 'all 0.48s cubic-bezier(0.23, 1, 0.32, 1)' }}>
                        {role}
                    </p>
                </div>

                {/* Footer */}
                <div className="flex flex-col items-start gap-4">
                    {/* Quote icon */}
                    <svg viewBox="0 0 24 24" style={{ width: 48, height: 48 }}>
                        <path
                            fill="black"
                            d="M4.58341 17.3211C3.55316 16.2274 3 15 3 13.0103C3 9.51086 5.45651 6.37366 9.03059 4.82318L9.92328 6.20079C6.58804 8.00539 5.93618 10.346 5.67564 11.822C6.21263 11.5443 6.91558 11.4466 7.60471 11.5105C9.40908 11.6778 10.8312 13.159 10.8312 15C10.8312 16.933 9.26416 18.5 7.33116 18.5C6.2581 18.5 5.23196 18.0095 4.58341 17.3211ZM14.5834 17.3211C13.5532 16.2274 13 15 13 13.0103C13 9.51086 15.4565 6.37366 19.0306 4.82318L19.9233 6.20079C16.588 8.00539 15.9362 10.346 15.6756 11.822C16.2126 11.5443 16.9156 11.4466 17.6047 11.5105C19.4091 11.6778 20.8312 13.159 20.8312 15C20.8312 16.933 19.2642 18.5 17.3312 18.5C16.2581 18.5 15.232 18.0095 14.5834 17.3211Z"
                        />
                    </svg>

                    {/* Quote text */}
                    <p
                        className="text-sm sm:text-base leading-relaxed"
                        style={{ opacity: 0.8, transition: 'all 0.48s cubic-bezier(0.23, 1, 0.32, 1)', zIndex: 1 }}
                    >
                        &ldquo;{quote}&rdquo;
                    </p>

                    {/* Stars */}
                    <div className="flex gap-1">
                        {Array.from({ length: rating }).map((_, i) => (
                            <Star key={i} size={14} className="fill-[#C9A84C] text-[#C9A84C]" />
                        ))}
                    </div>

                    {/* Animated underline button */}
                    <div className="relative overflow-hidden">
                        <button
                            className="relative font-bold text-base text-black cursor-pointer bg-transparent border-none p-0 leading-relaxed"
                            style={{
                                fontFamily: 'inherit',
                                transition: 'all 0.48s cubic-bezier(0.23, 1, 0.32, 1)',
                                zIndex: 1,
                                padding: '4px 0',
                            }}
                            onMouseEnter={(e) => {
                                const underline = e.currentTarget.nextElementSibling as HTMLElement
                                if (underline) {
                                    underline.style.transform = 'scaleX(1)'
                                    underline.style.transformOrigin = 'left'
                                }
                            }}
                            onMouseLeave={(e) => {
                                const underline = e.currentTarget.nextElementSibling as HTMLElement
                                if (underline) {
                                    underline.style.transform = 'scaleX(0)'
                                    underline.style.transformOrigin = 'right'
                                }
                            }}
                        >
                            View more
                        </button>
                        {/* underline bar */}
                        <span
                            style={{
                                position: 'absolute',
                                height: '1px',
                                width: '112%',
                                left: 0,
                                bottom: 0,
                                background: '#0D6E6E',
                                transform: 'scaleX(0)',
                                transformOrigin: 'right',
                                transition: 'transform 0.64s cubic-bezier(0.23, 1, 0.32, 1)',
                                pointerEvents: 'none',
                                display: 'block',
                            }}
                        />
                    </div>
                </div>
            </div>
        </div>
    )
}
