'use client'

import { useState } from 'react'
import { X, Phone, MapPin, User, MessageSquare, CheckCircle, Loader2, ArrowRight } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { cn } from '@/lib/utils'
import { createBookingAction } from '@/app/services/cabs/actions'
import type { DriverWithVehicle, Location } from '@/lib/supabase/cabs'

interface BookingModalProps {
  isOpen: boolean
  onClose: () => void
  driver: DriverWithVehicle | null
  pickupLocation: Location | null
  dropLocation: Location | null
  pickupDate: string
  pickupTime: string
  passengerCount: number
  onBookingSuccess?: (reference: string) => void
  onBookingError?: (error: string) => void
}

// Country codes for phone input - using SVG flags to avoid hydration issues
const countryCodes = [
  { code: 'IN', dial: '+91', name: 'India' },
  { code: 'US', dial: '+1', name: 'United States' },
  { code: 'GB', dial: '+44', name: 'United Kingdom' },
  { code: 'AE', dial: '+971', name: 'UAE' },
  { code: 'SA', dial: '+966', name: 'Saudi Arabia' },
  { code: 'QA', dial: '+974', name: 'Qatar' },
  { code: 'KW', dial: '+965', name: 'Kuwait' },
  { code: 'BH', dial: '+973', name: 'Bahrain' },
  { code: 'OM', dial: '+968', name: 'Oman' },
  { code: 'AU', dial: '+61', name: 'Australia' },
  { code: 'CA', dial: '+1', name: 'Canada' },
  { code: 'SG', dial: '+65', name: 'Singapore' },
]

export function BookingModal({
  isOpen,
  onClose,
  driver,
  pickupLocation,
  dropLocation,
  pickupDate,
  pickupTime,
  passengerCount,
  onBookingSuccess,
  onBookingError
}: BookingModalProps) {
  const [step, setStep] = useState<'details' | 'confirm'>('details')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [bookingReference, setBookingReference] = useState('')

  // Form state
  const [fullName, setFullName] = useState('')
  const [countryCode, setCountryCode] = useState('+91')
  const [phoneNumber, setPhoneNumber] = useState('')
  const [email, setEmail] = useState('')
  const [pickupAddress, setPickupAddress] = useState('')
  const [dropAddress, setDropAddress] = useState('')
  const [specialRequests, setSpecialRequests] = useState('')
  const [errors, setErrors] = useState<Record<string, string>>({})

  const validateStep1 = () => {
    const newErrors: Record<string, string> = {}
    if (!fullName.trim()) newErrors.fullName = 'Full name is required'
    if (!phoneNumber.trim()) newErrors.phone = 'Phone number is required'
    else if (!/^\d{10}$/.test(phoneNumber.replace(/\D/g, ''))) {
      newErrors.phone = 'Please enter a valid 10-digit phone number'
    }
    if (!pickupAddress.trim()) newErrors.pickupAddress = 'Pickup address is required'
    if (!dropAddress.trim()) newErrors.dropAddress = 'Drop address is required'
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleContinue = () => {
    if (validateStep1()) {
      setStep('confirm')
    }
  }

  const handleSubmit = async () => {
    if (!driver) return
    
    setIsSubmitting(true)
    
    try {
      const result = await createBookingAction({
        customerName: fullName,
        customerPhone: fullPhoneNumber,
        customerEmail: email || undefined,
        pickupLocationId: pickupLocation?.id,
        pickupAddress: pickupAddress,
        dropLocationId: dropLocation?.id,
        dropAddress: dropAddress,
        pickupDate: pickupDate,
        pickupTime: pickupTime,
        driverId: driver.driver_id,
        driverVehicleId: driver.driver_vehicle_id,
        estimatedDistanceKm: 10, // Default estimation
        baseFare: driver.price_per_km * 10,
        totalFare: driver.price_per_km * 10,
        tripType: 'one_way',
        passengerCount: passengerCount,
        specialRequests: specialRequests || undefined,
      })
      
      if (result.success && result.bookingReference) {
        setBookingReference(result.bookingReference)
        setIsSuccess(true)
        onBookingSuccess?.(result.bookingReference)
      } else {
        const errorMsg = result.error || 'Booking failed. Please try again.'
        setErrors({ submit: errorMsg })
        onBookingError?.(errorMsg)
      }
    } catch (error) {
      console.error('Booking error:', error)
      const errorMsg = 'An unexpected error occurred. Please try again.'
      setErrors({ submit: errorMsg })
      onBookingError?.(errorMsg)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleClose = () => {
    if (isSuccess) {
      // Reset state when closing after success
      setStep('details')
      setIsSuccess(false)
      setBookingReference('')
      setFullName('')
      setPhoneNumber('')
      setEmail('')
      setPickupAddress('')
      setDropAddress('')
      setSpecialRequests('')
    }
    onClose()
  }

  if (!isOpen || !driver) return null

  const fullPhoneNumber = `${countryCode} ${phoneNumber}`

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
            onClick={handleClose}
          />
          
          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="fixed inset-4 sm:inset-auto sm:top-1/2 sm:left-1/2 sm:-translate-x-1/2 sm:-translate-y-1/2 sm:w-full sm:max-w-2xl sm:max-h-[90vh] bg-white rounded-2xl shadow-2xl z-50 overflow-hidden flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 sm:p-6 border-b border-[#E8E4DF]">
              <div>
                <h2 className="text-lg sm:text-xl font-bold text-[#1C1C1E]">
                  {isSuccess ? 'Booking Confirmed!' : step === 'details' ? 'Enter Your Details' : 'Confirm Booking'}
                </h2>
                {!isSuccess && (
                  <p className="text-sm text-[#6B7280]">
                    Step {step === 'details' ? '1' : '2'} of 2
                  </p>
                )}
              </div>
              <button
                onClick={handleClose}
                className="p-2 hover:bg-[#F2EFE9] rounded-xl transition-colors"
              >
                <X size={24} className="text-[#6B7280]" />
              </button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-4 sm:p-6">
              {isSuccess ? (
                // Success View
                <div className="text-center py-8">
                  <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                    <CheckCircle size={40} className="text-green-600" />
                  </div>
                  <h3 className="text-2xl font-bold text-[#1C1C1E] mb-2">Booking Successful!</h3>
                  <p className="text-[#6B7280] mb-6">Your cab has been booked successfully.</p>
                  
                  <div className="bg-[#F2EFE9] rounded-xl p-4 mb-6">
                    <p className="text-sm text-[#6B7280] mb-1">Booking Reference</p>
                    <p className="text-2xl font-bold text-[#0D6E6E] font-mono">{bookingReference}</p>
                  </div>
                  
                  <p className="text-sm text-[#6B7280] mb-6">
                    We've sent a confirmation SMS to {fullPhoneNumber}.<br />
                    The driver will contact you shortly.
                  </p>
                  
                  <button
                    onClick={handleClose}
                    className="px-8 py-3 bg-[#C9A84C] hover:bg-[#b8962f] text-white font-bold rounded-xl transition-colors"
                  >
                    Done
                  </button>
                </div>
              ) : step === 'details' ? (
                // Step 1: Details Form
                <div className="space-y-4">
                  {/* Driver Summary Card */}
                  <div className="bg-[#F2EFE9] rounded-xl p-4 mb-6">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-[#0D6E6E]/10 rounded-full flex items-center justify-center">
                        <User size={24} className="text-[#0D6E6E]" />
                      </div>
                      <div className="flex-1">
                        <p className="font-bold text-[#1C1C1E]">{driver.full_name}</p>
                        <p className="text-sm text-[#6B7280]">{driver.brand} {driver.model} • ₹{driver.price_per_km}/km</p>
                      </div>
                    </div>
                    <div className="mt-3 pt-3 border-t border-[#E8E4DF] grid grid-cols-2 gap-2 text-sm">
                      <div className="flex items-center gap-1.5 text-[#6B7280]">
                        <MapPin size={14} />
                        {pickupLocation?.name} → {dropLocation?.name}
                      </div>
                      <div className="flex items-center gap-1.5 text-[#6B7280]">
                        {pickupDate} at {pickupTime}
                      </div>
                    </div>
                  </div>

                  {/* Full Name */}
                  <div>
                    <label className="block text-sm font-semibold text-[#1C1C1E] mb-2">
                      <span className="flex items-center gap-2">
                        <User size={16} className="text-[#0D6E6E]" />
                        Full Name *
                      </span>
                    </label>
                    <input
                      type="text"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="Enter your full name"
                      className={cn(
                        'w-full px-3 sm:px-4 py-2.5 sm:py-3 bg-white border-2 rounded-lg sm:rounded-xl text-sm sm:text-base text-[#1C1C1E] focus:outline-none focus:border-[#0D6E6E] transition-all',
                        errors.fullName ? 'border-red-300' : 'border-[#E8E4DF]'
                      )}
                    />
                    {errors.fullName && <p className="text-red-500 text-xs mt-1">{errors.fullName}</p>}
                  </div>

                  {/* Phone Number with Country Code */}
                  <div>
                    <label className="block text-sm font-semibold text-[#1C1C1E] mb-2">
                      <span className="flex items-center gap-2">
                        <Phone size={16} className="text-[#0D6E6E]" />
                        Phone Number *
                      </span>
                    </label>
                    <div className="flex gap-2">
                      <select
                        value={countryCode}
                        onChange={(e) => setCountryCode(e.target.value)}
                        className="px-2 sm:px-3 py-2.5 sm:py-3 bg-white border-2 border-[#E8E4DF] rounded-lg sm:rounded-xl text-sm sm:text-base text-[#1C1C1E] focus:outline-none focus:border-[#0D6E6E] transition-all"
                      >
                        {countryCodes.map((c) => (
                          <option key={c.code} value={c.dial}>
                            {c.dial} ({c.code})
                          </option>
                        ))}
                      </select>
                      <input
                        type="tel"
                        value={phoneNumber}
                        onChange={(e) => setPhoneNumber(e.target.value.replace(/\D/g, '').slice(0, 10))}
                        placeholder="98765 43210"
                        className={cn(
                          'flex-1 px-3 sm:px-4 py-2.5 sm:py-3 bg-white border-2 rounded-lg sm:rounded-xl text-sm sm:text-base text-[#1C1C1E] focus:outline-none focus:border-[#0D6E6E] transition-all',
                          errors.phone ? 'border-red-300' : 'border-[#E8E4DF]'
                        )}
                      />
                    </div>
                    {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone}</p>}
                  </div>

                  {/* Email (Optional) */}
                  <div>
                    <label className="block text-sm font-semibold text-[#1C1C1E] mb-2">
                      Email (Optional)
                    </label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="your@email.com"
                      className="w-full px-3 sm:px-4 py-2.5 sm:py-3 bg-white border-2 border-[#E8E4DF] rounded-lg sm:rounded-xl text-sm sm:text-base text-[#1C1C1E] focus:outline-none focus:border-[#0D6E6E] transition-all"
                    />
                  </div>

                  {/* Pickup Address */}
                  <div>
                    <label className="block text-sm font-semibold text-[#1C1C1E] mb-2">
                      <span className="flex items-center gap-2">
                        <MapPin size={16} className="text-[#0D6E6E]" />
                        Exact Pickup Address *
                      </span>
                    </label>
                    <textarea
                      value={pickupAddress}
                      onChange={(e) => setPickupAddress(e.target.value)}
                      placeholder="House number, street, landmark..."
                      rows={2}
                      className={cn(
                        'w-full px-3 sm:px-4 py-2.5 sm:py-3 bg-white border-2 rounded-lg sm:rounded-xl text-sm sm:text-base text-[#1C1C1E] focus:outline-none focus:border-[#0D6E6E] transition-all resize-none',
                        errors.pickupAddress ? 'border-red-300' : 'border-[#E8E4DF]'
                      )}
                    />
                    {errors.pickupAddress && <p className="text-red-500 text-xs mt-1">{errors.pickupAddress}</p>}
                  </div>

                  {/* Drop Address */}
                  <div>
                    <label className="block text-sm font-semibold text-[#1C1C1E] mb-2">
                      <span className="flex items-center gap-2">
                        <MapPin size={16} className="text-[#0D6E6E]" />
                        Exact Drop Address *
                      </span>
                    </label>
                    <textarea
                      value={dropAddress}
                      onChange={(e) => setDropAddress(e.target.value)}
                      placeholder="House number, street, landmark..."
                      rows={2}
                      className={cn(
                        'w-full px-3 sm:px-4 py-2.5 sm:py-3 bg-white border-2 rounded-lg sm:rounded-xl text-sm sm:text-base text-[#1C1C1E] focus:outline-none focus:border-[#0D6E6E] transition-all resize-none',
                        errors.dropAddress ? 'border-red-300' : 'border-[#E8E4DF]'
                      )}
                    />
                    {errors.dropAddress && <p className="text-red-500 text-xs mt-1">{errors.dropAddress}</p>}
                  </div>

                  {/* Special Requests */}
                  <div>
                    <label className="block text-sm font-semibold text-[#1C1C1E] mb-2">
                      <span className="flex items-center gap-2">
                        <MessageSquare size={16} className="text-[#0D6E6E]" />
                        Special Requests (Optional)
                      </span>
                    </label>
                    <textarea
                      value={specialRequests}
                      onChange={(e) => setSpecialRequests(e.target.value)}
                      placeholder="Any special requirements..."
                      rows={2}
                      className="w-full px-3 sm:px-4 py-2.5 sm:py-3 bg-white border-2 border-[#E8E4DF] rounded-lg sm:rounded-xl text-sm sm:text-base text-[#1C1C1E] focus:outline-none focus:border-[#0D6E6E] transition-all resize-none"
                    />
                  </div>
                </div>
              ) : (
                // Step 2: Confirm
                <div className="space-y-4">
                  {/* Booking Summary */}
                  <div className="bg-[#F2EFE9] rounded-xl p-4 space-y-3">
                    <h3 className="font-bold text-[#1C1C1E]">Booking Summary</h3>
                    
                    <div className="grid grid-cols-2 gap-3 text-sm">
                      <div>
                        <p className="text-[#6B7280]">Driver</p>
                        <p className="font-medium text-[#1C1C1E]">{driver.full_name}</p>
                      </div>
                      <div>
                        <p className="text-[#6B7280]">Vehicle</p>
                        <p className="font-medium text-[#1C1C1E]">{driver.brand} {driver.model}</p>
                      </div>
                      <div>
                        <p className="text-[#6B7280]">Route</p>
                        <p className="font-medium text-[#1C1C1E]">{pickupLocation?.name} → {dropLocation?.name}</p>
                      </div>
                      <div>
                        <p className="text-[#6B7280]">Date & Time</p>
                        <p className="font-medium text-[#1C1C1E]">{pickupDate} at {pickupTime}</p>
                      </div>
                      <div>
                        <p className="text-[#6B7280]">Passengers</p>
                        <p className="font-medium text-[#1C1C1E]">{passengerCount}</p>
                      </div>
                      <div>
                        <p className="text-[#6B7280]">Rate</p>
                        <p className="font-medium text-[#0D6E6E]">₹{driver.price_per_km}/km</p>
                      </div>
                    </div>
                    
                    <div className="border-t border-[#E8E4DF] pt-3 mt-3">
                      <div className="grid grid-cols-2 gap-3 text-sm">
                        <div>
                          <p className="text-[#6B7280]">Passenger</p>
                          <p className="font-medium text-[#1C1C1E]">{fullName}</p>
                        </div>
                        <div>
                          <p className="text-[#6B7280]">Phone</p>
                          <p className="font-medium text-[#1C1C1E]">{fullPhoneNumber}</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <p className="text-sm text-[#6B7280]">
                    By confirming this booking, you agree to our terms and conditions. 
                    The driver will contact you at {fullPhoneNumber} to confirm pickup details.
                  </p>
                </div>
              )}
            </div>

            {/* Footer Actions */}
            {!isSuccess && (
              <div className="p-4 sm:p-6 border-t border-[#E8E4DF] flex gap-3">
                {step === 'confirm' && (
                  <button
                    onClick={() => setStep('details')}
                    disabled={isSubmitting}
                    className="px-6 py-3 border-2 border-[#E8E4DF] text-[#6B7280] font-semibold rounded-xl hover:border-[#0D6E6E] hover:text-[#0D6E6E] transition-colors disabled:opacity-50"
                  >
                    Back
                  </button>
                )}
                <button
                  onClick={step === 'details' ? handleContinue : handleSubmit}
                  disabled={isSubmitting}
                  className="flex-1 px-6 py-3 bg-[#C9A84C] hover:bg-[#b8962f] text-white font-bold rounded-xl transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 size={20} className="animate-spin" />
                      Booking...
                    </>
                  ) : step === 'details' ? (
                    <>
                      Continue
                      <ArrowRight size={20} />
                    </>
                  ) : (
                    'Confirm Booking'
                  )}
                </button>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
