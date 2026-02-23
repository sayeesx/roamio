'use client'

import React from 'react'
import { Calendar } from 'lucide-react'

interface TravelDatePickerProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label?: string
    error?: string
}

export const TravelDatePicker = React.forwardRef<HTMLInputElement, TravelDatePickerProps>(
    ({ label, error, className = '', ...props }, ref) => {
        const inputCls = 'w-full rounded-xl border border-[#E8E4DF] px-4 py-3 text-sm bg-white text-[#1C1C1E] placeholder-[#9CA3AF] focus:outline-none focus:border-[#0D6E6E] focus:ring-2 focus:ring-[#0D6E6E]/10 transition-all appearance-none cursor-pointer'
        const labelCls = 'block text-sm font-medium text-[#1C1C1E] mb-1.5'
        const errorCls = 'text-xs text-red-500 mt-1'

        return (
            <div className="w-full relative group">
                {label && <label className={labelCls}>{label}</label>}
                <div className="relative">
                    <input
                        type="date"
                        ref={ref}
                        className={`${inputCls} ${error ? 'border-red-500 focus:ring-red-500/10' : ''} ${className}`}
                        {...props}
                    />
                    <div className="absolute right-4 top-1/2 -translate-y-1/2 text-[#9CA3AF] group-focus-within:text-[#0D6E6E] pointer-events-none transition-colors">
                        <Calendar size={18} />
                    </div>
                </div>
                {error && <p className={errorCls}>{error}</p>}

                <style jsx>{`
                    input[type="date"]::-webkit-calendar-picker-indicator {
                        background: transparent;
                        bottom: 0;
                        color: transparent;
                        cursor: pointer;
                        height: auto;
                        left: 0;
                        position: absolute;
                        right: 0;
                        top: 0;
                        width: auto;
                    }
                `}</style>
            </div>
        )
    }
)

TravelDatePicker.displayName = 'TravelDatePicker'
