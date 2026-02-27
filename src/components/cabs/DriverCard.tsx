'use client'

import { useState } from 'react'
import { Star, Users, MapPin, CheckCircle, Phone, MessageCircle, Fuel, Wind, Award, Briefcase, Car } from 'lucide-react'
import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'
import type { DriverWithVehicle, Location } from '@/lib/supabase/cabs'
import Image from 'next/image'
import { BookingModal } from './BookingModal'

interface DriverCardProps {
  driver: DriverWithVehicle
  isSelected?: boolean
  onSelect?: (driver: DriverWithVehicle) => void
  showDetails?: boolean
  className?: string
  pickupLocation?: Location | null
  dropLocation?: Location | null
  pickupDate?: string
  pickupTime?: string
  passengerCount?: number
}

export function DriverCard({
  driver,
  isSelected = false,
  onSelect,
  showDetails = true,
  className,
  pickupLocation,
  dropLocation,
  pickupDate,
  pickupTime,
  passengerCount = 1,
}: DriverCardProps) {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const {
    full_name,
    rating,
    total_trips,
    years_of_experience,
    current_city,
    profile_image_url,
    languages,
    brand,
    model,
    vehicle_type,
    fuel_type,
    seating_capacity,
    has_ac,
    vehicle_image,
    price_per_km,
  } = driver

  const handleCardClick = () => {
    // If we have all booking details, open modal directly
    if (pickupLocation && dropLocation && pickupDate && pickupTime) {
      setIsModalOpen(true)
    } else {
      // Otherwise use the parent onSelect handler
      onSelect?.(driver)
    }
  }

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className={cn(
          'bg-white rounded-2xl border-2 overflow-hidden transition-all duration-300',
          isSelected 
            ? 'border-[#0D6E6E] shadow-lg shadow-[#0D6E6E]/10' 
            : 'border-[#E8E4DF] hover:border-[#0D6E6E]/30 hover:shadow-md',
          'cursor-pointer',
          className
        )}
        onClick={handleCardClick}
      >
      {/* Vehicle Image - Better aspect ratio for alignment */}
      <div className="relative aspect-[16/9] bg-[#F2EFE9] overflow-hidden">
        <Image
          src={vehicle_image}
          alt={`${brand} ${model}`}
          fill
          className="object-cover"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
        
        {/* Vehicle Type Badge - Better positioning */}
        <div className="absolute top-3 left-3 z-10">
          <span className={cn(
            'px-3 py-1.5 rounded-full text-xs font-bold backdrop-blur-md shadow-sm',
            vehicle_type === 'Luxury' 
              ? 'bg-[#C9A84C] text-white'
              : 'bg-white/95 text-[#0D6E6E]'
          )}>
            {vehicle_type}
          </span>
        </div>

        {/* AC Badge */}
        {has_ac && (
          <div className="absolute top-3 right-3 z-10">
            <span className="px-2.5 py-1.5 rounded-full text-xs font-semibold bg-[#0D6E6E] text-white backdrop-blur-md flex items-center gap-1 shadow-sm">
              <Wind size={12} />
              AC
            </span>
          </div>
        )}

        {/* Vehicle Info Overlay - Better aligned */}
        <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 to-transparent">
          <p className="text-white font-bold text-base sm:text-lg leading-tight">{brand} {model}</p>
          <p className="text-white/90 text-sm flex items-center gap-2 mt-1">
            <Car size={14} />
            {fuel_type} • {seating_capacity} seats
          </p>
        </div>
      </div>

      {/* Driver Info - Better spacing and alignment */}
      <div className="p-4 sm:p-5">
        {/* Driver Header - Better alignment */}
        <div className="flex items-center gap-3 mb-4">
          <div className="relative w-11 h-11 sm:w-12 sm:h-12 rounded-full overflow-hidden border-2 border-[#E8E4DF] flex-shrink-0 bg-[#F2EFE9]">
            <Image
              src={profile_image_url}
              alt={full_name}
              fill
              className="object-cover"
              sizes="48px"
            />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="font-bold text-[#1C1C1E] text-sm sm:text-base truncate">{full_name}</h3>
              <CheckCircle size={16} className="text-[#0D6E6E] flex-shrink-0" />
            </div>
            <div className="flex items-center gap-2 text-xs sm:text-sm text-[#6B7280]">
              <span className="flex items-center gap-1">
                <Star size={14} className="text-[#C9A84C] fill-[#C9A84C]" />
                <span className="font-semibold">{rating.toFixed(1)}</span>
              </span>
              <span className="text-[#E8E4DF]">|</span>
              <span>{total_trips.toLocaleString()} trips</span>
            </div>
          </div>
        </div>

        {/* Details Grid - Better aligned icons */}
        {showDetails && (
          <div className="grid grid-cols-2 gap-x-3 gap-y-2 mb-4">
            <div className="flex items-center gap-2 text-xs sm:text-sm">
              <div className="w-7 h-7 rounded-lg bg-[#0D6E6E]/10 flex items-center justify-center flex-shrink-0">
                <Briefcase size={14} className="text-[#0D6E6E]" />
              </div>
              <span className="text-[#6B7280] truncate">{years_of_experience} years</span>
            </div>
            <div className="flex items-center gap-2 text-xs sm:text-sm">
              <div className="w-7 h-7 rounded-lg bg-[#0D6E6E]/10 flex items-center justify-center flex-shrink-0">
                <MapPin size={14} className="text-[#0D6E6E]" />
              </div>
              <span className="text-[#6B7280] truncate">{current_city}</span>
            </div>
            <div className="flex items-center gap-2 text-xs sm:text-sm">
              <div className="w-7 h-7 rounded-lg bg-[#0D6E6E]/10 flex items-center justify-center flex-shrink-0">
                <Users size={14} className="text-[#0D6E6E]" />
              </div>
              <span className="text-[#6B7280]">{seating_capacity} Seats</span>
            </div>
            <div className="flex items-center gap-2 text-xs sm:text-sm">
              <div className="w-7 h-7 rounded-lg bg-[#0D6E6E]/10 flex items-center justify-center flex-shrink-0">
                <Award size={14} className="text-[#0D6E6E]" />
              </div>
              <span className="text-[#6B7280]">Verified</span>
            </div>
          </div>
        )}

        {/* Languages - Better styling */}
        {languages && languages.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-4">
            {languages.slice(0, 3).map((lang) => (
              <span 
                key={lang}
                className="px-2.5 py-1 rounded-full text-xs font-medium bg-[#F2EFE9] text-[#6B7280]"
              >
                {lang}
              </span>
            ))}
          </div>
        )}

        {/* Price & Action - Better alignment */}
        <div className="flex items-center justify-between pt-4 border-t border-[#E8E4DF]">
          <div>
            <p className="text-xs text-[#6B7280] mb-0.5">Starting from</p>
            <p className="text-xl sm:text-2xl font-bold text-[#0D6E6E]">₹{price_per_km.toFixed(0)}<span className="text-sm font-normal text-[#6B7280]">/km</span></p>
          </div>
          
          <button
            className={cn(
              'px-5 py-2.5 rounded-xl font-semibold text-sm transition-all duration-200 shadow-sm hover:shadow-md',
              isSelected
                ? 'bg-[#0D6E6E] text-white'
                : 'bg-[#C9A84C] text-white hover:bg-[#b8962f]'
            )}
            onClick={(e) => {
              e.stopPropagation()
              handleCardClick()
            }}
          >
            {isSelected ? 'Selected' : 'Book Now'}
          </button>
        </div>
      </div>
    </motion.div>

    {/* Booking Modal */}
    <BookingModal
      isOpen={isModalOpen}
      onClose={() => setIsModalOpen(false)}
      driver={driver}
      pickupLocation={pickupLocation || null}
      dropLocation={dropLocation || null}
      pickupDate={pickupDate || ''}
      pickupTime={pickupTime || ''}
      passengerCount={passengerCount}
    />
  </>
  )
}

// Compact version for lists
interface DriverCardCompactProps {
  driver: DriverWithVehicle
  isSelected?: boolean
  onSelect?: (driver: DriverWithVehicle) => void
  className?: string
}

export function DriverCardCompact({
  driver,
  isSelected = false,
  onSelect,
  className,
}: DriverCardCompactProps) {
  const {
    full_name,
    rating,
    years_of_experience,
    profile_image_url,
    brand,
    model,
    vehicle_type,
    seating_capacity,
    has_ac,
    price_per_km,
  } = driver

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.2 }}
      className={cn(
        'flex items-center gap-4 p-4 bg-white rounded-xl border-2 transition-all duration-200',
        isSelected 
          ? 'border-[#0D6E6E] shadow-md' 
          : 'border-[#E8E4DF] hover:border-[#0D6E6E]/30',
        onSelect && 'cursor-pointer',
        className
      )}
      onClick={() => onSelect?.(driver)}
    >
      {/* Driver Photo */}
      <div className="relative w-14 h-14 rounded-full overflow-hidden border-2 border-[#E8E4DF] flex-shrink-0">
        <Image
          src={profile_image_url}
          alt={full_name}
          fill
          className="object-cover"
          sizes="56px"
        />
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1">
          <h3 className="font-bold text-[#1C1C1E] truncate">{full_name}</h3>
          <div className="flex items-center gap-1 text-sm text-[#C9A84C]">
            <Star size={14} className="fill-[#C9A84C]" />
            {rating.toFixed(1)}
          </div>
        </div>
        <p className="text-sm text-[#6B7280] truncate">
          {brand} {model} • {vehicle_type} • {seating_capacity} seats
          {has_ac && ' • AC'}
        </p>
        <p className="text-xs text-[#6B7280]/70">
          {years_of_experience} years experience
        </p>
      </div>

      {/* Price & Select */}
      <div className="text-right flex-shrink-0">
        <p className="text-lg font-bold text-[#0D6E6E]">₹{price_per_km.toFixed(0)}<span className="text-xs font-normal text-[#6B7280]">/km</span></p>
        {onSelect && (
          <button
            className={cn(
              'mt-1 px-3 py-1 rounded-lg text-xs font-semibold transition-colors',
              isSelected
                ? 'bg-[#0D6E6E] text-white'
                : 'bg-[#C9A84C] text-white hover:bg-[#b8962f]'
            )}
            onClick={(e) => {
              e.stopPropagation()
              onSelect(driver)
            }}
          >
            {isSelected ? 'Selected' : 'Select'}
          </button>
        )}
      </div>
    </motion.div>
  )
}
