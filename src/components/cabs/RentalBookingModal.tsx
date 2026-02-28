'use client'

import { useState } from 'react'
import { X, Phone, MapPin, User, MessageSquare, CheckCircle, Loader2, ArrowRight, Car, Calendar, Clock } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { cn } from '@/lib/utils'
import { createRentalBookingAction } from '@/app/services/cabs/actions'
import type { Location } from '@/lib/supabase/cabs'

interface RentalBookingModalProps {
  isOpen: boolean
  onClose: () => void
  vehicle: {
    id: string
    name: string
    brand: string
    type: 'car' | 'bike' | 'bicycle'
    fuel_type: string
    price_per_day: number
    price_per_hour?: number
    seating_capacity?: number
    location: string
    features: string[]
  } | null
  selectedLocation: Location | null
  pickupDate: string
  pickupTime: string
  returnDate: string
  returnTime: string
  onBookingSuccess?: (reference: string) => void
  onBookingError?: (error: string) => void
}

// Country codes for phone input - using text to avoid hydration issues
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

export function RentalBookingModal({
  isOpen,
  onClose,
  vehicle,
  selectedLocation,
  pickupDate,
  pickupTime,
  returnDate,
  returnTime,
  onBookingSuccess,
  onBookingError
}: RentalBookingModalProps) {
  const [step, setStep] = useState<'details' | 'confirm'>('details')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [bookingReference, setBookingReference] = useState('')

  // Form state
  const [fullName, setFullName] = useState('')
  const [countryCode, setCountryCode] = useState('+91')
  const [phoneNumber, setPhoneNumber] = useState('')
  const [email, setEmail] = useState('')
  const [address, setAddress] = useState('')
  const [idProofType, setIdProofType] = useState('driving_license')
  const [idProofNumber, setIdProofNumber] = useState('')
  const [specialRequests, setSpecialRequests] = useState('')
  const [errors, setErrors] = useState<Record<string, string>>({})

  const validateStep1 = () => {
    const newErrors: Record<string, string> = {}
    if (!fullName.trim()) newErrors.fullName = 'Full name is required'
    if (!phoneNumber.trim()) newErrors.phone = 'Phone number is required'
    else if (!/^\d{10}$/.test(phoneNumber.replace(/\D/g, ''))) {
      newErrors.phone = 'Please enter a valid 10-digit phone number'
    }
    if (!address.trim()) newErrors.address = 'Address is required'
    if (!idProofNumber.trim()) newErrors.idProofNumber = 'ID proof number is required'

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleContinue = () => {
    if (validateStep1()) {
      setStep('confirm')
    }
  }

  const handleSubmit = async () => {
    if (!vehicle) return

    setIsSubmitting(true)

    try {
      const result = await createRentalBookingAction({
        customerName: fullName,
        customerPhone: fullPhoneNumber,
        customerEmail: email || undefined,
        customerAddress: address,
        idProofType: idProofType,
        idProofNumber: idProofNumber,
        pickupDate: pickupDate,
        pickupTime: pickupTime,
        dropoffDate: returnDate,
        dropoffTime: returnTime,
        vehicleId: vehicle.id,
        dailyRate: vehicle.price_per_day,
        taxes: 0,
        extraCharges: 0
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
      setStep('details')
      setIsSuccess(false)
      setBookingReference('')
      setFullName('')
      setPhoneNumber('')
      setEmail('')
      setAddress('')
      setIdProofNumber('')
      setSpecialRequests('')
    }
    onClose()
  }

  if (!isOpen || !vehicle) return null

  const fullPhoneNumber = `${countryCode} ${phoneNumber}`

  // Calculate rental duration and price
  const calculateRentalDetails = () => {
    if (!pickupDate || !returnDate) return { days: 1, total: vehicle.price_per_day }

    const start = new Date(pickupDate)
    const end = new Date(returnDate)
    const diffTime = end.getTime() - start.getTime()
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    const days = Math.max(1, diffDays)
    const total = days * vehicle.price_per_day

    return { days, total }
  }

  const rentalDetails = calculateRentalDetails()

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
                  {isSuccess ? 'Booking Confirmed!' : step === 'details' ? 'Rent Vehicle' : 'Confirm Rental'}
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
                  <h3 className="text-2xl font-bold text-[#1C1C1E] mb-2">Rental Confirmed!</h3>
                  <p className="text-[#6B7280] mb-6">Your vehicle rental has been confirmed.</p>

                  <div className="bg-[#F2EFE9] rounded-xl p-4 mb-6">
                    <p className="text-sm text-[#6B7280] mb-1">Booking Reference</p>
                    <p className="text-2xl font-bold text-[#0D6E6E] font-mono">{bookingReference}</p>
                  </div>

                  <div className="bg-[#0D6E6E]/10 rounded-xl p-4 mb-6 text-left">
                    <p className="text-sm font-semibold text-[#0D6E6E] mb-2">Important Instructions:</p>
                    <ul className="text-sm text-[#1C1C1E] space-y-1 list-disc list-inside">
                      <li>Bring original ID proof to pickup location</li>
                      <li>Security deposit: ₹{vehicle.price_per_day * 2} (refundable)</li>
                      <li>Fuel policy: Same-to-same</li>
                      <li>Late returns charged at hourly rate</li>
                    </ul>
                  </div>

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
                  {/* Vehicle Summary Card */}
                  <div className="bg-[#F2EFE9] rounded-xl p-4 mb-6">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-[#0D6E6E]/10 rounded-full flex items-center justify-center">
                        <Car size={24} className="text-[#0D6E6E]" />
                      </div>
                      <div className="flex-1">
                        <p className="font-bold text-[#1C1C1E]">{vehicle.name}</p>
                        <p className="text-sm text-[#6B7280]">{vehicle.brand} • {vehicle.fuel_type} • {vehicle.location}</p>
                      </div>
                    </div>
                    <div className="mt-3 pt-3 border-t border-[#E8E4DF] grid grid-cols-2 gap-2 text-sm">
                      <div className="flex items-center gap-1.5 text-[#6B7280]">
                        <Calendar size={14} />
                        {pickupDate || 'Select date'}
                      </div>
                      <div className="flex items-center gap-1.5 text-[#6B7280]">
                        <Clock size={14} />
                        {pickupTime || 'Select time'}
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

                  {/* Address */}
                  <div>
                    <label className="block text-sm font-semibold text-[#1C1C1E] mb-2">
                      <span className="flex items-center gap-2">
                        <MapPin size={16} className="text-[#0D6E6E]" />
                        Your Address *
                      </span>
                    </label>
                    <textarea
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      placeholder="House number, street, city, PIN code..."
                      rows={2}
                      className={cn(
                        'w-full px-3 sm:px-4 py-2.5 sm:py-3 bg-white border-2 rounded-lg sm:rounded-xl text-sm sm:text-base text-[#1C1C1E] focus:outline-none focus:border-[#0D6E6E] transition-all resize-none',
                        errors.address ? 'border-red-300' : 'border-[#E8E4DF]'
                      )}
                    />
                    {errors.address && <p className="text-red-500 text-xs mt-1">{errors.address}</p>}
                  </div>

                  {/* ID Proof */}
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-sm font-semibold text-[#1C1C1E] mb-2">
                        ID Proof Type *
                      </label>
                      <select
                        value={idProofType}
                        onChange={(e) => setIdProofType(e.target.value)}
                        className="w-full px-3 sm:px-4 py-2.5 sm:py-3 bg-white border-2 border-[#E8E4DF] rounded-lg sm:rounded-xl text-sm sm:text-base text-[#1C1C1E] focus:outline-none focus:border-[#0D6E6E] transition-all"
                      >
                        <option value="driving_license">Driving License</option>
                        <option value="aadhaar">Aadhaar Card</option>
                        <option value="passport">Passport</option>
                        <option value="voter_id">Voter ID</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-[#1C1C1E] mb-2">
                        ID Number *
                      </label>
                      <input
                        type="text"
                        value={idProofNumber}
                        onChange={(e) => setIdProofNumber(e.target.value)}
                        placeholder="Enter ID number"
                        className={cn(
                          'w-full px-3 sm:px-4 py-2.5 sm:py-3 bg-white border-2 rounded-lg sm:rounded-xl text-sm sm:text-base text-[#1C1C1E] focus:outline-none focus:border-[#0D6E6E] transition-all',
                          errors.idProofNumber ? 'border-red-300' : 'border-[#E8E4DF]'
                        )}
                      />
                      {errors.idProofNumber && <p className="text-red-500 text-xs mt-1">{errors.idProofNumber}</p>}
                    </div>
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
                    <h3 className="font-bold text-[#1C1C1E]">Rental Summary</h3>

                    <div className="grid grid-cols-2 gap-3 text-sm">
                      <div>
                        <p className="text-[#6B7280]">Vehicle</p>
                        <p className="font-medium text-[#1C1C1E]">{vehicle.name}</p>
                      </div>
                      <div>
                        <p className="text-[#6B7280]">Brand</p>
                        <p className="font-medium text-[#1C1C1E]">{vehicle.brand}</p>
                      </div>
                      <div>
                        <p className="text-[#6B7280]">Pickup</p>
                        <p className="font-medium text-[#1C1C1E]">{selectedLocation?.name || vehicle.location}</p>
                      </div>
                      <div>
                        <p className="text-[#6B7280]">Duration</p>
                        <p className="font-medium text-[#1C1C1E]">{rentalDetails.days} day(s)</p>
                      </div>
                    </div>

                    <div className="border-t border-[#E8E4DF] pt-3 mt-3">
                      <div className="flex justify-between items-center text-sm">
                        <span className="text-[#6B7280]">Daily Rate</span>
                        <span className="font-medium text-[#1C1C1E]">₹{vehicle.price_per_day}</span>
                      </div>
                      <div className="flex justify-between items-center text-sm mt-1">
                        <span className="text-[#6B7280]">Security Deposit</span>
                        <span className="font-medium text-[#1C1C1E]">₹{vehicle.price_per_day * 2}</span>
                      </div>
                      <div className="flex justify-between items-center font-bold text-lg mt-2 pt-2 border-t border-[#E8E4DF]">
                        <span className="text-[#1C1C1E]">Total Amount</span>
                        <span className="text-[#0D6E6E]">₹{rentalDetails.total + (vehicle.price_per_day * 2)}</span>
                      </div>
                    </div>

                    <div className="border-t border-[#E8E4DF] pt-3 mt-3">
                      <div className="grid grid-cols-2 gap-3 text-sm">
                        <div>
                          <p className="text-[#6B7280]">Renter</p>
                          <p className="font-medium text-[#1C1C1E]">{fullName}</p>
                        </div>
                        <div>
                          <p className="text-[#6B7280]">Phone</p>
                          <p className="font-medium text-[#1C1C1E]">{fullPhoneNumber}</p>
                        </div>
                        <div>
                          <p className="text-[#6B7280]">ID Proof</p>
                          <p className="font-medium text-[#1C1C1E]">{idProofType.replace('_', ' ').toUpperCase()}</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
                    <p className="text-sm text-amber-800">
                      <strong>Note:</strong> Security deposit of ₹{vehicle.price_per_day * 2} will be collected at pickup and refunded after vehicle return inspection.
                    </p>
                  </div>
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
                      Processing...
                    </>
                  ) : step === 'details' ? (
                    <>
                      Continue
                      <ArrowRight size={20} />
                    </>
                  ) : (
                    'Confirm & Pay'
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
