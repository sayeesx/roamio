'use client'

import React, { useState, useRef, useEffect } from 'react'
import { ChevronDown, Search, Check } from 'lucide-react'
import { countries } from '@/lib/countryData'

interface PhoneInputProps {
    label?: string
    error?: string
    value?: string
    onChange?: (value: string) => void
    onBlur?: () => void
    name?: string
    placeholder?: string
    selectedCountryName?: string // For automatic sync
}

export const PhoneInput = React.forwardRef<HTMLInputElement, PhoneInputProps>(
    ({ label, error, value = '', onChange, onBlur, name, placeholder = '123 456 7890', selectedCountryName }, ref) => {
        const [isOpen, setIsOpen] = useState(false)
        const [searchTerm, setSearchTerm] = useState('')
        const dropdownRef = useRef<HTMLDivElement>(null)

        // Extract dial code and number from value (format: "+1 1234567890")
        const [dialCode, setDialCode] = useState('+91') // Default to India
        const [number, setNumber] = useState('')

        // Initialize state from value
        useEffect(() => {
            if (value) {
                const parts = value.split(' ')
                if (parts.length > 1) {
                    setDialCode(parts[0])
                    setNumber(parts.slice(1).join(''))
                } else if (value.startsWith('+')) {
                    // Maybe only dial code was provided
                    setDialCode(value)
                } else {
                    setNumber(value)
                }
            }
        }, [value])

        // Automatic sync when country changes elsewhere
        useEffect(() => {
            if (selectedCountryName) {
                const country = countries.find(c => c.name === selectedCountryName)
                if (country && country.dialCode !== dialCode) {
                    setDialCode(country.dialCode)
                    onChange?.(`${country.dialCode} ${number}`)
                }
            }
        }, [selectedCountryName])

        const filteredCountries = countries.filter(c =>
            c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            c.dialCode.includes(searchTerm)
        )

        const selectedCountry = countries.find(c => c.dialCode === dialCode)

        // Close dropdown when clicking outside
        useEffect(() => {
            const handleClickOutside = (event: MouseEvent) => {
                if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                    setIsOpen(false)
                }
            }
            document.addEventListener('mousedown', handleClickOutside)
            return () => document.removeEventListener('mousedown', handleClickOutside)
        }, [])

        const handleDialCodeSelect = (code: string) => {
            setDialCode(code)
            setIsOpen(false)
            setSearchTerm('')
            onChange?.(`${code} ${number}`)
        }

        const handleNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
            const newNumber = e.target.value.replace(/[^\d]/g, '')
            setNumber(newNumber)
            onChange?.(`${dialCode} ${newNumber}`)
        }

        const inputCls = 'w-full rounded-xl border border-[#E8E4DF] text-sm bg-white text-[#1C1C1E] focus:outline-none focus:border-[#0D6E6E] focus:ring-2 focus:ring-[#0D6E6E]/10 transition-all flex items-center'
        const labelCls = 'block text-sm font-medium text-[#1C1C1E] mb-1.5'
        const errorCls = 'text-xs text-red-500 mt-1'

        return (
            <div className="w-full relative" ref={dropdownRef}>
                {label && <label className={labelCls}>{label}</label>}

                <div className={`${inputCls} ${error ? 'border-red-500 focus-within:ring-red-500/10' : ''}`}>
                    {/* Country Code Picker */}
                    <div
                        onClick={() => setIsOpen(!isOpen)}
                        className="flex items-center gap-1 px-3 py-3 border-r border-[#E8E4DF] cursor-pointer hover:bg-[#F9F7F4] shrink-0"
                    >
                        <span className="text-lg leading-none">{selectedCountry?.flag || '🌐'}</span>
                        <span className="text-xs font-semibold text-[#1C1C1E]">{dialCode}</span>
                        <ChevronDown size={14} className={`text-[#9CA3AF] transition-transform ${isOpen ? 'rotate-180' : ''}`} />
                    </div>

                    {/* Number Input */}
                    <input
                        type="tel"
                        className="flex-1 px-4 py-3 bg-transparent border-none focus:ring-0 placeholder-[#9CA3AF]"
                        placeholder={placeholder}
                        value={number}
                        onChange={handleNumberChange}
                        onBlur={onBlur}
                    />
                </div>

                {/* Dropdown Menu */}
                <div className={`absolute z-50 left-0 mt-2 w-64 bg-white rounded-xl border border-[#E8E4DF] shadow-xl overflow-hidden transition-all duration-200 origin-top ${isOpen ? 'opacity-100 scale-100 translate-y-0 visible' : 'opacity-0 scale-95 -translate-y-2 invisible'
                    }`}>
                    <div className="p-2 sticky top-0 bg-white">
                        <div className="relative">
                            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#9CA3AF]" />
                            <input
                                type="text"
                                className="w-full pl-9 pr-3 py-2 text-xs rounded-lg bg-[#F9F7F4] border-none focus:ring-1 focus:ring-[#0D6E6E] focus:outline-none"
                                placeholder="Search code..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                onClick={(e) => e.stopPropagation()}
                            />
                        </div>
                    </div>

                    <div className="max-h-60 overflow-y-auto custom-scrollbar">
                        {filteredCountries.map((country) => (
                            <div
                                key={country.code}
                                onClick={() => handleDialCodeSelect(country.dialCode)}
                                className={`flex items-center justify-between px-4 py-2 hover:bg-[#F9F7F4] cursor-pointer transition-colors ${dialCode === country.dialCode ? 'bg-[#0D6E6E]/5' : ''
                                    }`}
                            >
                                <div className="flex items-center gap-3">
                                    <span className="text-lg">{country.flag}</span>
                                    <div className="flex flex-col">
                                        <span className="text-[10px] text-[#6B7280]">{country.name}</span>
                                        <span className="text-sm font-bold text-[#1C1C1E]">{country.dialCode}</span>
                                    </div>
                                </div>
                                {dialCode === country.dialCode && <Check size={14} className="text-[#0D6E6E]" />}
                            </div>
                        ))}
                    </div>
                </div>

                {error && <p className={errorCls}>{error}</p>}

                {/* Internal Hidden Input for Form compatibility if needed, 
                   but usually we use the prop 'name' on the component and handle value via Controller */}
                <input type="hidden" name={name} value={value} ref={ref} />
            </div>
        )
    }
)

PhoneInput.displayName = 'PhoneInput'
