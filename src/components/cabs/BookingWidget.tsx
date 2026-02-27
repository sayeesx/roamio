'use client'

import { useState, useCallback } from 'react'
import { ArrowRight, Calendar, Clock, Users, Search, Loader2, MapPin, Car, CheckCircle, Shield } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { cn } from '@/lib/utils'
import { LocationSearch } from './LocationSearch'
import { DriverCard, DriverCardCompact } from './DriverCard'
import { findAvailableDrivers, getAllAvailableDrivers, type Location, type DriverWithVehicle } from '@/lib/supabase/cabs'

interface BookingWidgetProps {
  className?: string
  isCompact?: boolean
  onSearchStart?: () => void
  onSearchComplete?: (drivers: DriverWithVehicle[]) => void
}

export function BookingWidget({ 
  className, 
  isCompact = false, 
  onSearchStart, 
  onSearchComplete 
}: BookingWidgetProps) {
  // Form State
  const [pickupLocation, setPickupLocation] = useState<Location | null>(null)
  const [dropLocation, setDropLocation] = useState<Location | null>(null)
  const [pickupDate, setPickupDate] = useState('')
  const [pickupTime, setPickupTime] = useState('')
  const [passengerCount, setPassengerCount] = useState(1)
  const [tripType, setTripType] = useState<'one_way' | 'round_trip'>('one_way')
  
  // UI State
  const [isSearching, setIsSearching] = useState(false)
  const [hasSearched, setHasSearched] = useState(false)
  const [drivers, setDrivers] = useState<DriverWithVehicle[]>([])
  const [selectedDriver, setSelectedDriver] = useState<DriverWithVehicle | null>(null)
  const [error, setError] = useState<string | null>(null)

  // Search drivers
  const handleSearch = useCallback(async () => {
    if (!pickupLocation || !dropLocation) {
      setError('Please select both pickup and drop locations')
      return
    }

    setIsSearching(true)
    setError(null)
    setHasSearched(true)
    setSelectedDriver(null)
    
    // Notify parent that search started
    onSearchStart?.()

    try {
      const availableDrivers = await findAvailableDrivers(
        pickupLocation.name,
        dropLocation.name,
        passengerCount
      )
      
      let finalDrivers: DriverWithVehicle[]
      if (availableDrivers.length === 0) {
        // If no specific matches, show all available drivers
        finalDrivers = await getAllAvailableDrivers()
      } else {
        finalDrivers = availableDrivers
      }
      
      setDrivers(finalDrivers)
      // Notify parent with results
      onSearchComplete?.(finalDrivers)
    } catch (err) {
      setError('Failed to search drivers. Please try again.')
      console.error('Search error:', err)
      onSearchComplete?.([])
    } finally {
      setIsSearching(false)
    }
  }, [pickupLocation, dropLocation, passengerCount, onSearchStart, onSearchComplete])

  // Handle driver selection
  const handleDriverSelect = useCallback((driver: DriverWithVehicle) => {
    setSelectedDriver(driver)
    // Scroll to booking form smoothly
    document.getElementById('booking-summary')?.scrollIntoView({ behavior: 'smooth', block: 'center' })
  }, [])

  // Check if form is valid
  const isFormValid = pickupLocation && dropLocation && pickupDate && pickupTime

  // Get today's date for min date
  const today = new Date().toISOString().split('T')[0]

  return (
    <div className={cn('space-y-6', className)}>
      {/* Booking Form Card */}
      <div className="bg-white/90 backdrop-blur-xl rounded-2xl border border-white/50 shadow-xl shadow-black/5 p-6 sm:p-8">
        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-[#0D6E6E] flex items-center justify-center">
            <Car size={20} className="text-white" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-[#1C1C1E]">Book Your Ride</h3>
            <p className="text-sm text-[#6B7280]">Find professional drivers across Kerala</p>
          </div>
        </div>

        {/* Trip Type Toggle - Smooth Animated */}
        <div className="relative flex p-1 bg-[#F2EFE9] rounded-xl mb-6">
          {/* Sliding Background */}
          <motion.div
            className="absolute top-1 bottom-1 rounded-lg bg-white shadow-sm"
            initial={false}
            animate={{
              x: tripType === 'one_way' ? 4 : 'calc(100% - 4px)',
              width: 'calc(50% - 8px)',
            }}
            transition={{
              type: 'spring',
              stiffness: 400,
              damping: 30,
            }}
            style={{
              left: 0,
            }}
          />
          <button
            onClick={() => setTripType('one_way')}
            className={cn(
              'relative z-10 flex-1 py-2.5 px-4 rounded-lg text-sm font-semibold transition-colors duration-200',
              tripType === 'one_way' ? 'text-[#0D6E6E]' : 'text-[#6B7280] hover:text-[#1C1C1E]'
            )}
          >
            One Way
          </button>
          <button
            onClick={() => setTripType('round_trip')}
            className={cn(
              'relative z-10 flex-1 py-2.5 px-4 rounded-lg text-sm font-semibold transition-colors duration-200',
              tripType === 'round_trip' ? 'text-[#0D6E6E]' : 'text-[#6B7280] hover:text-[#1C1C1E]'
            )}
          >
            Round Trip
          </button>
        </div>

        {/* Location Inputs */}
        <div className="space-y-4 mb-6">
          <LocationSearch
            label="From (Pickup Location)"
            placeholder="Search pickup location..."
            value={pickupLocation}
            onChange={setPickupLocation}
            excludeLocationId={dropLocation?.id}
          />
          
          <LocationSearch
            label="To (Drop Location)"
            placeholder="Search drop location..."
            value={dropLocation}
            onChange={setDropLocation}
            excludeLocationId={pickupLocation?.id}
          />
        </div>

        {/* Date, Time, Passengers */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
          {/* Date */}
          <div>
            <label className="block text-sm font-semibold text-[#1C1C1E] mb-2">
              <span className="flex items-center gap-2">
                <Calendar size={16} className="text-[#0D6E6E]" />
                Date
              </span>
            </label>
            <input
              type="date"
              min={today}
              value={pickupDate}
              onChange={(e) => setPickupDate(e.target.value)}
              className="w-full px-4 py-3 bg-white border-2 border-[#E8E4DF] rounded-xl text-[#1C1C1E] focus:outline-none focus:border-[#0D6E6E] focus:ring-2 focus:ring-[#0D6E6E]/10 transition-all"
            />
          </div>

          {/* Time */}
          <div>
            <label className="block text-sm font-semibold text-[#1C1C1E] mb-2">
              <span className="flex items-center gap-2">
                <Clock size={16} className="text-[#0D6E6E]" />
                Time
              </span>
            </label>
            <input
              type="time"
              value={pickupTime}
              onChange={(e) => setPickupTime(e.target.value)}
              className="w-full px-4 py-3 bg-white border-2 border-[#E8E4DF] rounded-xl text-[#1C1C1E] focus:outline-none focus:border-[#0D6E6E] focus:ring-2 focus:ring-[#0D6E6E]/10 transition-all"
            />
          </div>

          {/* Passengers */}
          <div>
            <label className="block text-sm font-semibold text-[#1C1C1E] mb-2">
              <span className="flex items-center gap-2">
                <Users size={16} className="text-[#0D6E6E]" />
                Passengers
              </span>
            </label>
            <select
              value={passengerCount}
              onChange={(e) => setPassengerCount(Number(e.target.value))}
              className="w-full px-4 py-3 bg-white border-2 border-[#E8E4DF] rounded-xl text-[#1C1C1E] focus:outline-none focus:border-[#0D6E6E] focus:ring-2 focus:ring-[#0D6E6E]/10 transition-all appearance-none cursor-pointer"
            >
              {[1, 2, 3, 4, 5, 6, 7, 8, 10, 12].map((num) => (
                <option key={num} value={num}>
                  {num} {num === 1 ? 'Passenger' : 'Passengers'}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm"
          >
            {error}
          </motion.div>
        )}

        {/* Search Button */}
        <button
          onClick={handleSearch}
          disabled={!isFormValid || isSearching}
          className={cn(
            'w-full py-4 px-6 rounded-xl font-bold text-lg flex items-center justify-center gap-3 transition-all duration-300',
            isFormValid && !isSearching
              ? 'bg-[#C9A84C] text-white hover:bg-[#b8962f] shadow-lg hover:shadow-xl hover:-translate-y-0.5'
              : 'bg-[#E8E4DF] text-[#6B7280] cursor-not-allowed'
          )}
        >
          {isSearching ? (
            <>
              <Loader2 size={24} className="animate-spin" />
              Finding Drivers...
            </>
          ) : (
            <>
              <Search size={24} />
              Find Available Drivers
            </>
          )}
        </button>

        {/* Trust Badges */}
        <div className="flex flex-wrap items-center justify-center gap-4 mt-6 pt-6 border-t border-[#E8E4DF]">
          <div className="flex items-center gap-2 text-sm text-[#6B7280]">
            <Shield size={16} className="text-[#0D6E6E]" />
            <span>Verified Drivers</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-[#6B7280]">
            <CheckCircle size={16} className="text-[#0D6E6E]" />
            <span>Fixed Prices</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-[#6B7280]">
            <Car size={16} className="text-[#0D6E6E]" />
            <span>Premium Vehicles</span>
          </div>
        </div>
      </div>

      {/* Driver Results */}
      <AnimatePresence>
        {hasSearched && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 30 }}
            transition={{ duration: 0.4 }}
            id="driver-results"
          >
            {/* Results Header */}
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-xl font-bold text-[#1C1C1E]">Available Drivers</h3>
                <p className="text-sm text-[#6B7280]">
                  {drivers.length} {drivers.length === 1 ? 'driver' : 'drivers'} found for your route
                </p>
              </div>
              
              {pickupLocation && dropLocation && (
                <div className="hidden sm:flex items-center gap-2 px-4 py-2 bg-[#F2EFE9] rounded-xl">
                  <MapPin size={16} className="text-[#0D6E6E]" />
                  <span className="text-sm text-[#6B7280]">
                    {pickupLocation.name} <ArrowRight size={14} className="inline mx-1" /> {dropLocation.name}
                  </span>
                </div>
              )}
            </div>

            {/* Drivers Grid - Responsive */}
            {drivers.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6">
                {drivers.map((driver, index) => (
                  <DriverCard
                    key={driver.driver_id}
                    driver={driver}
                    isSelected={selectedDriver?.driver_id === driver.driver_id}
                    onSelect={handleDriverSelect}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-12 bg-[#F2EFE9] rounded-2xl">
                <Car size={48} className="mx-auto text-[#E8E4DF] mb-4" />
                <h4 className="text-lg font-semibold text-[#1C1C1E] mb-2">No drivers available</h4>
                <p className="text-[#6B7280] max-w-md mx-auto">
                  We couldn&apos;t find any drivers matching your criteria. Try adjusting your passenger count or locations.
                </p>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Selected Driver Summary & CTA */}
      <AnimatePresence>
        {selectedDriver && (
          <motion.div
            id="booking-summary"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 30 }}
            transition={{ duration: 0.4 }}
            className="bg-[#0a2e2e] rounded-2xl p-6 sm:p-8 text-white"
          >
            <div className="flex flex-col lg:flex-row lg:items-center gap-6">
              {/* Selected Driver Info */}
              <div className="flex-1">
                <p className="text-sm text-white/60 mb-2">Your Selected Driver</p>
                <DriverCardCompact
                  driver={selectedDriver}
                  className="bg-white/10 border-white/20"
                />
              </div>

              {/* Trip Summary */}
              <div className="flex-1 lg:border-l lg:border-white/20 lg:pl-6">
                <p className="text-sm text-white/60 mb-2">Trip Details</p>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <MapPin size={16} className="text-[#C9A84C]" />
                    <span className="text-sm">
                      {pickupLocation?.name} → {dropLocation?.name}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar size={16} className="text-[#C9A84C]" />
                    <span className="text-sm">{pickupDate} at {pickupTime}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Users size={16} className="text-[#C9A84C]" />
                    <span className="text-sm">{passengerCount} passengers</span>
                  </div>
                </div>
              </div>

              {/* CTA */}
              <div className="flex-shrink-0">
                <button className="w-full lg:w-auto px-8 py-4 bg-[#C9A84C] hover:bg-[#b8962f] text-white font-bold rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 flex items-center justify-center gap-2">
                  Proceed to Book
                  <ArrowRight size={20} />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
