'use client'

import { useEffect, useState, useRef } from 'react'
import { motion, useInView, useSpring, useTransform } from 'framer-motion'

interface CountUpProps {
  target: number
  duration?: number
  suffix?: string
  prefix?: string
  decimals?: number
  className?: string
}

export function CountUp({ 
  target, 
  duration = 2, 
  suffix = '', 
  prefix = '',
  decimals = 0,
  className = '' 
}: CountUpProps) {
  const ref = useRef<HTMLSpanElement>(null)
  const isInView = useInView(ref, { once: true, margin: '-50px' })
  const [displayValue, setDisplayValue] = useState(0)
  
  const spring = useSpring(0, {
    stiffness: 50,
    damping: 20,
    duration: duration * 1000,
  })
  
  const rounded = useTransform(spring, (latest) => {
    if (decimals > 0) {
      return latest.toFixed(decimals)
    }
    return Math.round(latest).toLocaleString()
  })
  
  useEffect(() => {
    if (isInView) {
      spring.set(target)
    }
  }, [isInView, target, spring])
  
  useEffect(() => {
    const unsubscribe = rounded.on('change', (latest) => {
      setDisplayValue(Number(latest))
    })
    return unsubscribe
  }, [rounded])
  
  return (
    <span ref={ref} className={className}>
      {prefix}
      {decimals > 0 ? displayValue.toFixed(decimals) : Math.round(displayValue).toLocaleString()}
      {suffix}
    </span>
  )
}

interface AnimatedStatProps {
  value: number
  suffix?: string
  prefix?: string
  decimals?: number
  label: string
  delay?: number
}

export function AnimatedStat({ 
  value, 
  suffix = '', 
  prefix = '',
  decimals = 0,
  label, 
  delay = 0 
}: AnimatedStatProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
      className="bg-white/70 backdrop-blur-sm rounded-xl p-4 border border-[#E8E4DF]/50"
    >
      <p className="text-2xl font-bold text-[#0D6E6E]">
        <CountUp 
          target={value} 
          suffix={suffix} 
          prefix={prefix}
          decimals={decimals}
        />
      </p>
      <p className="text-xs text-[#6B7280]">{label}</p>
    </motion.div>
  )
}
