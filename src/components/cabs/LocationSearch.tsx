'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import { MapPin, Search, X, Loader2 } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { cn } from '@/lib/utils'
import { searchLocations, getPopularLocations, type Location } from '@/lib/supabase/cabs'

interface LocationSearchProps {
  label: string
  placeholder?: string
  value: Location | null
  onChange: (location: Location | null) => void
  excludeLocationId?: string // To prevent selecting same location as pickup/drop
  className?: string
}

export function LocationSearch({
  label,
  placeholder = 'Search location...',
  value,
  onChange,
  excludeLocationId,
  className,
}: LocationSearchProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [query, setQuery] = useState('')
  const [locations, setLocations] = useState<Location[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [popularLocations, setPopularLocations] = useState<Location[]>([])
  const containerRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  // Fetch popular locations on mount
  useEffect(() => {
    const fetchPopular = async () => {
      const data = await getPopularLocations(6)
      setPopularLocations(data)
    }
    fetchPopular()
  }, [])

  // Handle click outside to close dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  // Debounced search
  const debouncedSearch = useCallback(
    debounce(async (searchQuery: string) => {
      if (searchQuery.length < 2) {
        setLocations([])
        setIsLoading(false)
        return
      }

      setIsLoading(true)
      const data = await searchLocations(searchQuery, 8)
      setLocations(excludeLocationId ? data.filter(l => l.id !== excludeLocationId) : data)
      setIsLoading(false)
    }, 300),
    [excludeLocationId]
  )

  useEffect(() => {
    debouncedSearch(query)
  }, [query, debouncedSearch])

  const handleSelect = (location: Location) => {
    onChange(location)
    setQuery(location.name)
    setIsOpen(false)
  }

  const handleClear = () => {
    onChange(null)
    setQuery('')
    setLocations([])
    inputRef.current?.focus()
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newQuery = e.target.value
    setQuery(newQuery)
    
    if (newQuery.length >= 2) {
      setIsOpen(true)
    } else {
      setIsOpen(false)
    }

    // Clear selection if user modifies the text
    if (value && newQuery !== value.name) {
      onChange(null)
    }
  }

  const handleFocus = () => {
    if (!value) {
      setIsOpen(true)
    }
  }

  // Group locations by type for display
  const groupedPopular = popularLocations.reduce((acc, loc) => {
    const key = loc.type
    if (!acc[key]) acc[key] = []
    acc[key].push(loc)
    return acc
  }, {} as Record<string, Location[]>)

  return (
    <div ref={containerRef} className={cn('relative', className)}>
      <label className="block text-sm font-semibold text-[#1C1C1E] mb-2">
        {label}
      </label>
      
      <div className="relative">
        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-[#0D6E6E]">
          <MapPin size={20} />
        </div>
        
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={handleInputChange}
          onFocus={handleFocus}
          placeholder={placeholder}
          className={cn(
            'w-full pl-10 pr-10 py-3 bg-white border-2 rounded-xl',
            'text-[#1C1C1E] placeholder:text-[#6B7280]/60',
            'transition-all duration-200',
            'focus:outline-none focus:border-[#0D6E6E] focus:ring-2 focus:ring-[#0D6E6E]/10',
            value ? 'border-[#0D6E6E]' : 'border-[#E8E4DF]'
          )}
        />
        
        <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1">
          {isLoading && (
            <Loader2 size={18} className="animate-spin text-[#0D6E6E]" />
          )}
          
          {value && !isLoading && (
            <button
              onClick={handleClear}
              className="p-1 rounded-full hover:bg-[#E8E4DF] transition-colors"
            >
              <X size={16} className="text-[#6B7280]" />
            </button>
          )}
          
          {!value && !isLoading && (
            <Search size={18} className="text-[#6B7280]/50" />
          )}
        </div>
      </div>

      {/* Dropdown */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl border border-[#E8E4DF] z-50 max-h-80 overflow-hidden"
          >
            {/* Search Results */}
            {query.length >= 2 && locations.length > 0 && (
              <div className="p-2">
                <p className="text-xs font-semibold text-[#6B7280] uppercase tracking-wider px-3 py-2">
                  Search Results
                </p>
                {locations.map((location) => (
                  <button
                    key={location.id}
                    onClick={() => handleSelect(location)}
                    className="w-full flex items-start gap-3 px-3 py-3 rounded-lg hover:bg-[#F2EFE9] transition-colors text-left"
                  >
                    <div className="w-8 h-8 rounded-lg bg-[#0D6E6E]/10 flex items-center justify-center flex-shrink-0">
                      <MapPin size={16} className="text-[#0D6E6E]" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-[#1C1C1E] truncate">{location.name}</p>
                      <p className="text-xs text-[#6B7280]">
                        {location.district} • {location.type}
                      </p>
                    </div>
                  </button>
                ))}
              </div>
            )}

            {/* No Results */}
            {query.length >= 2 && !isLoading && locations.length === 0 && (
              <div className="p-6 text-center">
                <Search size={32} className="mx-auto text-[#E8E4DF] mb-2" />
                <p className="text-sm text-[#6B7280]">No locations found</p>
                <p className="text-xs text-[#6B7280]/70 mt-1">Try a different search term</p>
              </div>
            )}

            {/* Popular Locations */}
            {query.length < 2 && popularLocations.length > 0 && (
              <div className="p-2 overflow-y-auto max-h-72">
                <p className="text-xs font-semibold text-[#6B7280] uppercase tracking-wider px-3 py-2">
                  Popular in Kerala
                </p>
                
                {Object.entries(groupedPopular).map(([type, typeLocations]) => (
                  <div key={type} className="mb-2">
                    <p className="text-xs font-medium text-[#C9A84C] px-3 py-1">{type}</p>
                    {typeLocations.map((location) => (
                      <button
                        key={location.id}
                        onClick={() => handleSelect(location)}
                        className="w-full flex items-start gap-3 px-3 py-2.5 rounded-lg hover:bg-[#F2EFE9] transition-colors text-left"
                      >
                        <div className="w-7 h-7 rounded-lg bg-[#C9A84C]/10 flex items-center justify-center flex-shrink-0">
                          <MapPin size={14} className="text-[#C9A84C]" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-[#1C1C1E] text-sm truncate">{location.name}</p>
                          <p className="text-xs text-[#6B7280]">{location.district}</p>
                        </div>
                      </button>
                    ))}
                  </div>
                ))}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

// Debounce utility
function debounce<T extends (...args: Parameters<T>) => ReturnType<T>>(
  fn: T,
  delay: number
): (...args: Parameters<T>) => void {
  let timeoutId: ReturnType<typeof setTimeout>
  return (...args) => {
    clearTimeout(timeoutId)
    timeoutId = setTimeout(() => fn(...args), delay)
  }
}
