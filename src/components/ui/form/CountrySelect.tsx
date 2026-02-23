'use client'

import React, { useState, useRef, useEffect } from 'react'
import { ChevronDown, Search, Check } from 'lucide-react'
import { countries, CountryType } from '@/lib/countryData'

interface CountrySelectProps {
    label?: string
    error?: string
    value?: string
    onChange?: (value: string) => void
    onBlur?: () => void
    name?: string
    placeholder?: string
}

export const CountrySelect = React.forwardRef<HTMLInputElement, CountrySelectProps>(
    ({ label, error, value, onChange, onBlur, name, placeholder = 'Select country...' }, ref) => {
        const [isOpen, setIsOpen] = useState(false)
        const [searchTerm, setSearchTerm] = useState('')
        const dropdownRef = useRef<HTMLDivElement>(null)

        const selectedCountry = countries.find(c => c.name === value)

        const filteredCountries = countries.filter(c =>
            c.name.toLowerCase().includes(searchTerm.toLowerCase())
        )

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

        const handleSelect = (countryName: string) => {
            onChange?.(countryName)
            setIsOpen(false)
            setSearchTerm('')
        }

        const inputCls = 'w-full rounded-xl border border-[#E8E4DF] px-4 py-3 text-sm bg-white text-[#1C1C1E] placeholder-[#9CA3AF] focus:outline-none focus:border-[#0D6E6E] focus:ring-2 focus:ring-[#0D6E6E]/10 transition-all flex items-center justify-between cursor-pointer'
        const labelCls = 'block text-sm font-medium text-[#1C1C1E] mb-1.5'
        const errorCls = 'text-xs text-red-500 mt-1'

        return (
            <div className="w-full relative" ref={dropdownRef}>
                {label && <label className={labelCls}>{label}</label>}

                <div
                    onClick={() => setIsOpen(!isOpen)}
                    className={`${inputCls} ${error ? 'border-red-500 focus:ring-red-500/10' : ''} ${isOpen ? 'border-[#0D6E6E] ring-2 ring-[#0D6E6E]/10' : ''}`}
                >
                    <div className="flex items-center gap-2 overflow-hidden">
                        {selectedCountry ? (
                            <>
                                <span className="text-lg leading-none">{selectedCountry.flag}</span>
                                <span className="truncate">{selectedCountry.name}</span>
                            </>
                        ) : (
                            <span className="text-[#9CA3AF]">{placeholder}</span>
                        )}
                    </div>
                    <ChevronDown size={18} className={`text-[#9CA3AF] transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
                </div>

                {/* Dropdown Menu */}
                <div className={`absolute z-50 left-0 right-0 mt-2 bg-white rounded-xl border border-[#E8E4DF] shadow-xl overflow-hidden transition-all duration-200 origin-top ${isOpen ? 'opacity-100 scale-100 translate-y-0 visible' : 'opacity-0 scale-95 -translate-y-2 invisible'
                    }`}>
                    {/* Search */}
                    <div className="p-2 border-bottom border-[#E8E4DF] sticky top-0 bg-white">
                        <div className="relative">
                            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#9CA3AF]" />
                            <input
                                type="text"
                                className="w-full pl-9 pr-3 py-2 text-xs rounded-lg bg-[#F9F7F4] border-none focus:ring-1 focus:ring-[#0D6E6E] focus:outline-none"
                                placeholder="Search countries..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                onClick={(e) => e.stopPropagation()}
                            />
                        </div>
                    </div>

                    {/* List */}
                    <div className="max-h-60 overflow-y-auto custom-scrollbar">
                        {filteredCountries.length > 0 ? (
                            filteredCountries.map((country) => (
                                <div
                                    key={country.code}
                                    onClick={() => handleSelect(country.name)}
                                    className={`flex items-center justify-between px-4 py-2.5 hover:bg-[#F9F7F4] cursor-pointer transition-colors ${value === country.name ? 'bg-[#0D6E6E]/5' : ''
                                        }`}
                                >
                                    <div className="flex items-center gap-3">
                                        <span className="text-lg leading-none">{country.flag}</span>
                                        <span className="text-sm font-medium text-[#1C1C1E]">{country.name}</span>
                                    </div>
                                    {value === country.name && <Check size={16} className="text-[#0D6E6E]" />}
                                </div>
                            ))
                        ) : (
                            <div className="px-4 py-8 text-center text-xs text-[#9CA3AF]">
                                No countries found
                            </div>
                        )}
                    </div>
                </div>

                {error && <p className={errorCls}>{error}</p>}

                {/* Internal Hidden Input for Form compatibility */}
                <input
                    type="hidden"
                    name={name}
                    value={value || ''}
                    ref={ref}
                />
            </div>
        )
    }
)

CountrySelect.displayName = 'CountrySelect'
