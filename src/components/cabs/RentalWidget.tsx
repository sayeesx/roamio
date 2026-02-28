'use client'

import { useState, useCallback } from 'react'
import { Search, MapPin, Car, Bike, Zap, Fuel, Droplets, Flame, Calendar, Clock, Filter, ChevronDown } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import Image from 'next/image'
import { cn } from '@/lib/utils'
import { LocationSearch } from './LocationSearch'
import { RentalBookingModal } from './RentalBookingModal'
import { useToast } from '@/hooks/use-toast'
import { Toaster } from '@/components/ui/toaster'
import type { Location } from '@/lib/supabase/cabs'

type VehicleType = 'all' | 'car' | 'bike' | 'bicycle'
type FuelType = 'all' | 'petrol' | 'diesel' | 'cng' | 'electric'

interface RentalVehicle {
  id: string
  name: string
  type: Exclude<VehicleType, 'all'>
  brand: string
  fuel_type: FuelType
  price_per_day: number
  price_per_hour?: number
  seating_capacity?: number
  location: string
  image_url: string
  features: string[]
  is_available: boolean
}

const mockVehicles: RentalVehicle[] = [
  { id: '550e8400-e29b-41d4-a716-446655440001', name: 'Maruti Swift', type: 'car', brand: 'Maruti', fuel_type: 'petrol', price_per_day: 1200, seating_capacity: 5, location: 'Kochi', image_url: '/vehicles/swift.jpg', features: ['AC', 'Bluetooth', 'Power Steering'], is_available: true },
  { id: '550e8400-e29b-41d4-a716-446655440002', name: 'Hyundai Creta', type: 'car', brand: 'Hyundai', fuel_type: 'diesel', price_per_day: 2200, seating_capacity: 5, location: 'Kochi', image_url: '/vehicles/creta.jpg', features: ['AC', 'Sunroof', 'Touchscreen'], is_available: true },
  { id: '550e8400-e29b-41d4-a716-446655440003', name: 'Tata Nexon EV', type: 'car', brand: 'Tata', fuel_type: 'electric', price_per_day: 2500, seating_capacity: 5, location: 'Trivandrum', image_url: '/vehicles/nexon.jpg', features: ['AC', 'Fast Charging', 'Touchscreen'], is_available: true },
  { id: '550e8400-e29b-41d4-a716-446655440004', name: 'Honda Activa 6G', type: 'bike', brand: 'Honda', fuel_type: 'petrol', price_per_day: 400, price_per_hour: 50, location: 'Kochi', image_url: '/vehicles/activa.jpg', features: ['Automatic', 'Underseat Storage'], is_available: true },
  { id: '550e8400-e29b-41d4-a716-446655440005', name: 'Bajaj Pulsar NS200', type: 'bike', brand: 'Bajaj', fuel_type: 'petrol', price_per_day: 600, location: 'Trivandrum', image_url: '/vehicles/pulsar.jpg', features: ['ABS', 'Digital Console'], is_available: true },
  { id: '550e8400-e29b-41d4-a716-446655440006', name: 'Ather 450X', type: 'bike', brand: 'Ather', fuel_type: 'electric', price_per_day: 700, location: 'Kochi', image_url: '/vehicles/ather.jpg', features: ['Touchscreen', 'Fast Charging', 'Navigation'], is_available: true },
  { id: '550e8400-e29b-41d4-a716-446655440007', name: 'Trek Marlin 7', type: 'bicycle', brand: 'Trek', fuel_type: 'electric', price_per_day: 800, location: 'Munnar', image_url: '/vehicles/trek.jpg', features: ['Mountain Bike', '21 Speed', 'Disc Brakes'], is_available: true },
  { id: '550e8400-e29b-41d4-a716-446655440008', name: 'Hero Lectro', type: 'bicycle', brand: 'Hero', fuel_type: 'electric', price_per_day: 500, location: 'Kochi', image_url: '/vehicles/lectro.jpg', features: ['Electric Assist', '25km Range'], is_available: true },
  { id: '550e8400-e29b-41d4-a716-446655440009', name: 'Giant Escape 3', type: 'bicycle', brand: 'Giant', fuel_type: 'electric', price_per_day: 300, location: 'Alappuzha', image_url: '/vehicles/giant.jpg', features: ['City Bike', '7 Speed', 'Comfort Seat'], is_available: true },
  { id: '550e8400-e29b-41d4-a716-446655440010', name: 'Toyota Innova', type: 'car', brand: 'Toyota', fuel_type: 'diesel', price_per_day: 2800, seating_capacity: 7, location: 'Trivandrum', image_url: '/vehicles/innova.jpg', features: ['AC', 'Spacious', 'AC Vents'], is_available: true },
  { id: '550e8400-e29b-41d4-a716-446655440011', name: 'Maruti WagonR CNG', type: 'car', brand: 'Maruti', fuel_type: 'cng', price_per_day: 1000, seating_capacity: 5, location: 'Kozhikode', image_url: '/vehicles/wagonr.jpg', features: ['AC', 'Spacious', 'Economical'], is_available: true },
  { id: '550e8400-e29b-41d4-a716-446655440012', name: 'TVS Jupiter', type: 'bike', brand: 'TVS', fuel_type: 'cng', price_per_day: 350, location: 'Thrissur', image_url: '/vehicles/jupiter.jpg', features: ['Automatic', 'Economical'], is_available: true },
]

const vehicleTypeFilters = [
  { value: 'all', label: 'All', icon: Car },
  { value: 'car', label: 'Cars', icon: Car },
  { value: 'bike', label: 'Bikes', icon: Bike },
  { value: 'bicycle', label: 'Bicycles', icon: Zap },
] as const

const fuelTypeFilters = [
  { value: 'all', label: 'All Fuel', icon: Fuel },
  { value: 'petrol', label: 'Petrol', icon: Droplets },
  { value: 'diesel', label: 'Diesel', icon: Fuel },
  { value: 'cng', label: 'CNG', icon: Flame },
  { value: 'electric', label: 'Electric', icon: Zap },
] as const

export function RentalWidget() {
  const { toast } = useToast()
  const [selectedLocation, setSelectedLocation] = useState<Location | null>(null)
  const [pickupDate, setPickupDate] = useState('')
  const [pickupTime, setPickupTime] = useState('')
  const [returnDate, setReturnDate] = useState('')
  const [returnTime, setReturnTime] = useState('')
  const [vehicleType, setVehicleType] = useState<VehicleType>('all')
  const [fuelType, setFuelType] = useState<FuelType>('all')
  const [showFilters, setShowFilters] = useState(false)
  const [isSearching, setIsSearching] = useState(false)
  const [vehicles, setVehicles] = useState<RentalVehicle[]>(mockVehicles)
  const [hasSearched, setHasSearched] = useState(false)
  
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedVehicle, setSelectedVehicle] = useState<RentalVehicle | null>(null)

  const handleBookingSuccess = useCallback((reference: string) => {
    toast({
      title: 'Rental Confirmed!',
      description: `Your booking reference: ${reference}`,
    })
  }, [toast])

  const handleBookingError = useCallback((error: string) => {
    toast({
      title: 'Booking Failed',
      description: error,
      variant: 'destructive',
    })
  }, [toast])

  const today = new Date().toISOString().split('T')[0]

  const handleSearch = useCallback(async () => {
    setIsSearching(true)
    setHasSearched(true)
    
    await new Promise(resolve => setTimeout(resolve, 800))
    
    let filtered = mockVehicles
    
    if (selectedLocation) {
      filtered = filtered.filter(v => v.location === selectedLocation.name || v.location.includes(selectedLocation.name))
    }
    
    if (vehicleType !== 'all') {
      filtered = filtered.filter(v => v.type === vehicleType)
    }
    
    if (fuelType !== 'all') {
      filtered = filtered.filter(v => v.fuel_type === fuelType)
    }
    
    setVehicles(filtered)
    setIsSearching(false)
  }, [selectedLocation, vehicleType, fuelType])

  const isFormValid = selectedLocation && pickupDate && pickupTime

  const getFuelIcon = (fuel: FuelType) => {
    switch (fuel) {
      case 'petrol': return <Droplets size={14} />
      case 'diesel': return <Fuel size={14} />
      case 'cng': return <Flame size={14} />
      case 'electric': return <Zap size={14} />
      default: return <Fuel size={14} />
    }
  }

  return (
    <div className="space-y-6">
      {/* Search & Filter Bar */}
      <div className="bg-white/90 backdrop-blur-xl rounded-2xl border border-white/50 p-4 sm:p-6">
        {/* Single Row Layout */}
        <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {/* Location Search */}
          <div className="lg:col-span-2">
            <label className="block text-xs font-semibold text-[#1C1C1E] mb-1.5">
              <span className="flex items-center gap-1">
                <MapPin size={14} className="text-[#0D6E6E]" />
                Location
              </span>
            </label>
            <LocationSearch
              label=""
              placeholder="Search location..."
              value={selectedLocation}
              onChange={setSelectedLocation}
            />
          </div>

          {/* Pickup Date */}
          <div>
            <label className="block text-xs font-semibold text-[#1C1C1E] mb-1.5">
              <span className="flex items-center gap-1">
                <Calendar size={14} className="text-[#0D6E6E]" />
                Pickup Date
              </span>
            </label>
            <input
              type="date"
              min={today}
              value={pickupDate}
              onChange={(e) => setPickupDate(e.target.value)}
              className="w-full px-3 py-2.5 bg-white border-2 border-[#E8E4DF] rounded-xl text-[#1C1C1E] focus:outline-none focus:border-[#0D6E6E] text-sm transition-all"
            />
          </div>

          {/* Pickup Time */}
          <div>
            <label className="block text-xs font-semibold text-[#1C1C1E] mb-1.5">
              <span className="flex items-center gap-1">
                <Clock size={14} className="text-[#0D6E6E]" />
                Pickup Time
              </span>
            </label>
            <input
              type="time"
              value={pickupTime}
              onChange={(e) => setPickupTime(e.target.value)}
              className="w-full px-3 py-2.5 bg-white border-2 border-[#E8E4DF] rounded-xl text-[#1C1C1E] focus:outline-none focus:border-[#0D6E6E] text-sm transition-all"
            />
          </div>

          {/* Return Date */}
          <div>
            <label className="block text-xs font-semibold text-[#1C1C1E] mb-1.5">
              <span className="flex items-center gap-1">
                <Calendar size={14} className="text-[#0D6E6E]" />
                Return Date
              </span>
            </label>
            <input
              type="date"
              min={pickupDate || today}
              value={returnDate}
              onChange={(e) => setReturnDate(e.target.value)}
              className="w-full px-3 py-2.5 bg-white border-2 border-[#E8E4DF] rounded-xl text-[#1C1C1E] focus:outline-none focus:border-[#0D6E6E] text-sm transition-all"
            />
          </div>

          {/* Return Time */}
          <div>
            <label className="block text-xs font-semibold text-[#1C1C1E] mb-1.5">
              <span className="flex items-center gap-1">
                <Clock size={14} className="text-[#0D6E6E]" />
                Return Time
              </span>
            </label>
            <input
              type="time"
              value={returnTime}
              onChange={(e) => setReturnTime(e.target.value)}
              className="w-full px-3 py-2.5 bg-white border-2 border-[#E8E4DF] rounded-xl text-[#1C1C1E] focus:outline-none focus:border-[#0D6E6E] text-sm transition-all"
            />
          </div>
        </div>

        {/* Filter Toggle & Search Button */}
        <div className="flex flex-col sm:flex-row gap-3 mt-4 pt-4 border-t border-[#E8E4DF]">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border-2 border-[#E8E4DF] text-[#6B7280] hover:border-[#0D6E6E]/30 hover:text-[#0D6E6E] transition-all"
          >
            <Filter size={18} />
            <span>Filters</span>
            <ChevronDown size={16} className={cn('transition-transform', showFilters && 'rotate-180')} />
          </button>

          <button
            onClick={handleSearch}
            disabled={!isFormValid || isSearching}
            className={cn(
              'flex-1 py-3 px-6 rounded-xl font-bold flex items-center justify-center gap-2 transition-all duration-300',
              isFormValid && !isSearching
                ? 'bg-[#C9A84C] text-white hover:bg-[#b8962f]'
                : 'bg-[#E8E4DF] text-[#6B7280] cursor-not-allowed'
            )}
          >
            {isSearching ? (
              <>
                <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}>
                  <Search size={20} />
                </motion.div>
                Searching...
              </>
            ) : (
              <>
                <Search size={20} />
                Find Vehicles
              </>
            )}
          </button>
        </div>

        {/* Expandable Filters */}
        <AnimatePresence>
          {showFilters && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="overflow-hidden"
            >
              <div className="pt-4 mt-4 border-t border-[#E8E4DF] space-y-4">
                {/* Vehicle Type Filter */}
                <div>
                  <p className="text-sm font-semibold text-[#1C1C1E] mb-3">Vehicle Type</p>
                  <div className="flex flex-wrap gap-2">
                    {vehicleTypeFilters.map(({ value, label, icon: Icon }) => (
                      <button
                        key={value}
                        onClick={() => setVehicleType(value as VehicleType)}
                        className={cn(
                          'flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all',
                          vehicleType === value
                            ? 'bg-[#0D6E6E] text-white'
                            : 'bg-[#F2EFE9] text-[#6B7280] hover:bg-[#E8E4DF]'
                        )}
                      >
                        <Icon size={16} />
                        {label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Fuel Type Filter */}
                <div>
                  <p className="text-sm font-semibold text-[#1C1C1E] mb-3">Fuel Type</p>
                  <div className="flex flex-wrap gap-2">
                    {fuelTypeFilters.map(({ value, label, icon: Icon }) => (
                      <button
                        key={value}
                        onClick={() => setFuelType(value as FuelType)}
                        className={cn(
                          'flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all',
                          fuelType === value
                            ? 'bg-[#C9A84C] text-white'
                            : 'bg-[#F2EFE9] text-[#6B7280] hover:bg-[#E8E4DF]'
                        )}
                      >
                        <Icon size={16} />
                        {label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Results Grid */}
      {hasSearched && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold text-[#1C1C1E]">
              {isSearching ? 'Searching...' : `${vehicles.length} Vehicles Available`}
            </h3>
            {selectedLocation && (
              <p className="text-sm text-[#6B7280]">in {selectedLocation.name}</p>
            )}
          </div>

          {!isSearching && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {vehicles.map((vehicle, index) => (
                <motion.div
                  key={vehicle.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                  className="bg-white rounded-2xl border border-[#E8E4DF] overflow-hidden hover:border-[#0D6E6E]/30 transition-all group"
                >
                  {/* Vehicle Image */}
                  <div className="relative aspect-[4/3] bg-gradient-to-br from-[#F2EFE9] to-[#E8E4DF] flex items-center justify-center overflow-hidden">
                    {vehicle.image_url ? (
                      <Image
                        src={vehicle.image_url}
                        alt={vehicle.name}
                        fill
                        className="object-cover"
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                      />
                    ) : (
                      <div className="flex items-center justify-center">
                        {vehicle.type === 'car' && <Car size={48} className="text-[#0D6E6E]/40" />}
                        {vehicle.type === 'bike' && <Bike size={48} className="text-[#0D6E6E]/40" />}
                        {vehicle.type === 'bicycle' && <Zap size={48} className="text-[#0D6E6E]/40" />}
                      </div>
                    )}
                    
                    <div className="absolute top-3 left-3">
                      <span className={cn(
                        'px-2 py-1 rounded-lg text-xs font-semibold',
                        vehicle.type === 'car' ? 'bg-[#0D6E6E] text-white' :
                        vehicle.type === 'bike' ? 'bg-[#C9A84C] text-white' :
                        'bg-green-500 text-white'
                      )}>
                        {vehicle.type === 'car' ? 'Car' : vehicle.type === 'bike' ? 'Bike' : 'Cycle'}
                      </span>
                    </div>

                    <div className="absolute top-3 right-3">
                      <span className="px-2 py-1 rounded-lg text-xs font-medium bg-white/90 text-[#0D6E6E] flex items-center gap-1">
                        {getFuelIcon(vehicle.fuel_type)}
                        {vehicle.fuel_type}
                      </span>
                    </div>
                  </div>

                  {/* Vehicle Info */}
                  <div className="p-4">
                    <h4 className="font-bold text-[#1C1C1E] mb-1">{vehicle.name}</h4>
                    <p className="text-sm text-[#6B7280] mb-3 flex items-center gap-1">
                      <MapPin size={14} />
                      {vehicle.location}
                    </p>

                    <div className="flex flex-wrap gap-1 mb-4">
                      {vehicle.features.slice(0, 2).map((feature, i) => (
                        <span key={i} className="text-xs bg-[#F2EFE9] text-[#6B7280] px-2 py-1 rounded-md">
                          {feature}
                        </span>
                      ))}
                    </div>

                    <div className="flex items-center justify-between pt-3 border-t border-[#E8E4DF]">
                      <div>
                        <p className="text-xs text-[#6B7280]">Per Day</p>
                        <p className="text-xl font-bold text-[#0D6E6E]">₹{vehicle.price_per_day}</p>
                      </div>
                      <button 
                        onClick={() => {
                          setSelectedVehicle(vehicle)
                          setIsModalOpen(true)
                        }}
                        className="px-4 py-2 bg-[#C9A84C] hover:bg-[#b8962f] text-white font-semibold rounded-xl transition-colors"
                      >
                        Rent Now
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}

          {!isSearching && vehicles.length === 0 && (
            <div className="text-center py-12 bg-[#F2EFE9] rounded-2xl">
              <Car size={48} className="mx-auto text-[#E8E4DF] mb-4" />
              <h4 className="text-lg font-semibold text-[#1C1C1E] mb-2">No vehicles found</h4>
              <p className="text-[#6B7280] max-w-md mx-auto">
                Try adjusting your filters or search for a different location.
              </p>
            </div>
          )}
        </motion.div>
      )}

      {/* Rental Booking Modal */}
      <RentalBookingModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        vehicle={selectedVehicle}
        selectedLocation={selectedLocation}
        pickupDate={pickupDate}
        pickupTime={pickupTime}
        returnDate={returnDate}
        returnTime={returnTime}
        onBookingSuccess={handleBookingSuccess}
        onBookingError={handleBookingError}
      />
      
      {/* Toast Notifications */}
      <Toaster />
    </div>
  )
}
