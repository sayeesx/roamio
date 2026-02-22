'use client'

import { useEffect, useRef, useState } from 'react'

interface Stat {
    number: string
    label: string
}

function useCountUp(target: number, duration = 1600, shouldStart: boolean) {
    const [count, setCount] = useState(0)

    useEffect(() => {
        if (!shouldStart) return
        let startTime: number | null = null
        const step = (timestamp: number) => {
            if (!startTime) startTime = timestamp
            const progress = Math.min((timestamp - startTime) / duration, 1)
            // ease-out cubic
            const eased = 1 - Math.pow(1 - progress, 3)
            setCount(Math.floor(eased * target))
            if (progress < 1) requestAnimationFrame(step)
        }
        requestAnimationFrame(step)
    }, [shouldStart, target, duration])

    return count
}

function StatCard({ number, label }: Stat) {
    const ref = useRef<HTMLDivElement>(null)
    const [started, setStarted] = useState(false)

    // Parse: e.g. "500+" → numeric=500, suffix="+"
    //         "98%"  → numeric=98, suffix="%"
    //         "24/7" → special, no animation
    const isSpecial = number.includes('/')
    const match = !isSpecial ? number.match(/^(\d+)(.*)$/) : null
    const numeric = match ? parseInt(match[1]) : 0
    const suffix = match ? match[2] : ''

    const count = useCountUp(numeric, 1600, started && !isSpecial)

    useEffect(() => {
        const el = ref.current
        if (!el) return
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setStarted(true)
                    observer.disconnect()
                }
            },
            { threshold: 0.5 },
        )
        observer.observe(el)
        return () => observer.disconnect()
    }, [])

    return (
        <div
            ref={ref}
            className="bg-white/10 backdrop-blur-sm rounded-xl sm:rounded-2xl p-3 sm:p-6 text-center border border-white/10"
        >
            <p className="text-2xl sm:text-3xl font-bold text-[#C9A84C] mb-0.5 sm:mb-1">
                {isSpecial ? number : `${started ? count : 0}${suffix}`}
            </p>
            <p className="text-white/60 text-xs sm:text-sm">{label}</p>
        </div>
    )
}

export function CountUpStats({ stats }: { stats: Stat[] }) {
    return (
        <div className="grid grid-cols-2 gap-3 sm:gap-4">
            {stats.map((stat) => (
                <StatCard key={stat.label} {...stat} />
            ))}
        </div>
    )
}
