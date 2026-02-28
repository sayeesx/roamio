'use client'

import { useState, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowRight, Car, MapPin, Clock, Users, CheckCircle, Star, Shield, Phone, MessageCircle, ThumbsUp, Navigation, Loader2, Search, Bike, Fuel, Zap, ChevronDown, ChevronUp } from 'lucide-react'
import { SectionContainer, SectionHeading } from '@/components/ui/SectionContainer'
import { CTAButton } from '@/components/ui/CTAButton'
import { FeatureCard, StepIndicator } from '@/components/ui/Cards'
import { BookingWidget } from '@/components/cabs/BookingWidget'
import { AnimatedStat } from '@/components/cabs/CountUp'
import { RentalWidget } from '@/components/cabs/RentalWidget'
import { BookingModal } from '@/components/cabs/BookingModal'
import { Toaster } from '@/components/ui/toaster'
import { useToast } from '@/hooks/use-toast'
import type { DriverWithVehicle } from '@/lib/supabase/cabs'

interface CabsPageClientProps {
  stats: {
    availableDrivers: number
    totalCities: number
    completedTrips: number
    avgRating: number
  }
}

const steps = [
  { number: 1, label: 'Enter Your Route', description: 'Select pickup and drop locations from our extensive Kerala network with smart autocomplete.' },
  { number: 2, label: 'Choose Your Driver', description: 'Browse available verified drivers with their vehicles, ratings, and transparent pricing.' },
  { number: 3, label: 'Confirm & Book', description: 'Review your selection and confirm. Get instant booking confirmation with driver details.' },
  { number: 4, label: 'Enjoy the Ride', description: 'Your professional driver arrives on time. Track your trip and travel with peace of mind.' },
]

const faqs = [
  { q: 'How does the driver matching work?', a: 'Once you enter your pickup and drop locations, our system instantly shows available drivers operating in those areas. You can see their ratings, vehicle details, and pricing before making a selection.' },
  { q: 'Are all drivers verified?', a: 'Yes, every driver on our platform undergoes thorough background checks, license verification, and driving record review before being approved. Only verified drivers can accept bookings.' },
  { q: 'What types of vehicles are available?', a: 'We offer a wide range from compact sedans and hatchbacks for solo travelers, to SUVs and MUVs for families, luxury cars for premium needs, and Tempo Travellers for larger groups up to 12 people.' },
  { q: 'Can I book for immediate pickup?', a: 'While we recommend booking at least 2 hours in advance for best availability, many drivers accept same-day bookings. The system shows only currently available drivers.' },
  { q: 'Is the pricing fixed or metered?', a: 'All our prices are fixed and transparent. You see the exact per-km rate before booking. No hidden charges, no surprise fees. The final fare is calculated based on distance and vehicle type.' },
  { q: 'What if my driver cancels?', a: 'In the rare event of a cancellation, our system automatically suggests alternative available drivers. Your booking remains active and can be quickly reassigned.' },
  { q: 'Do you support airport transfers?', a: 'Absolutely! We have dedicated airport pickup and drop services at Cochin (COK), Trivandrum (TRV), Calicut (CCJ), and Kannur (CNN) airports with flight tracking.' },
]

const whyChooseUs = [
  { icon: <Shield size={24} />, title: 'Verified Drivers', description: 'Every driver is background-checked, licensed verified, and rated by real customers. Your safety is our priority.' },
  { icon: <Navigation size={24} />, title: 'Smart Matching', description: 'Our system instantly matches you with the best available drivers based on your route, timing, and preferences.' },
  { icon: <Star size={24} />, title: 'Transparent Pricing', description: 'No hidden charges. See exact per-km rates upfront. Fixed pricing means no meter anxiety.' },
  { icon: <ThumbsUp size={24} />, title: 'Quality Guarantee', description: 'All vehicles are maintained to high standards. Air-conditioned, clean, and comfortable rides every time.' },
]

export function CabsPageClient({ stats }: CabsPageClientProps) {
  const [isSearchMode, setIsSearchMode] = useState(false)
  const [drivers, setDrivers] = useState<DriverWithVehicle[]>([])
  const [isSearching, setIsSearching] = useState(false)
  const [selectedDriver, setSelectedDriver] = useState<DriverWithVehicle | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [showAllDrivers, setShowAllDrivers] = useState(false)
  const [pickupDate, setPickupDate] = useState('')
  const [pickupTime, setPickupTime] = useState('')
  const { toast } = useToast()

  const handleSearchStart = useCallback(() => {
    setIsSearching(true)
    setIsSearchMode(true)
    setShowAllDrivers(false)
  }, [])

  const handleSearchComplete = useCallback((foundDrivers: DriverWithVehicle[]) => {
    setDrivers(foundDrivers)
    setIsSearching(false)
  }, [])

  const handleResetSearch = useCallback(() => {
    setIsSearchMode(false)
    setDrivers([])
    setIsSearching(false)
  }, [])

  const handleDriverClick = useCallback((driver: DriverWithVehicle) => {
    setSelectedDriver(driver)
    setIsModalOpen(true)
  }, [])

  const handleCloseModal = useCallback(() => {
    setIsModalOpen(false)
    setSelectedDriver(null)
  }, [])

  const handleDateTimeChange = useCallback((date: string, time: string) => {
    setPickupDate(date)
    setPickupTime(time)
  }, [])

  const handleBookingSuccess = useCallback((reference: string) => {
    toast({
      title: 'Booking Confirmed!',
      description: `Your booking reference: ${reference}`,
      variant: 'success',
    })
  }, [toast])

  const handleBookingError = useCallback((error: string) => {
    toast({
      title: 'Booking Failed',
      description: error,
      variant: 'destructive',
    })
  }, [toast])

  return (
    <>
      {/* Hero Section with Booking Widget - Dynamic Layout */}
      <section
        className={`relative pt-24 sm:pt-28 lg:pt-32 pb-14 sm:pb-20 overflow-hidden transition-all duration-500 ${
          isSearchMode ? 'lg:min-h-[calc(100vh-80px)]' : ''
        }`}
        style={{ background: 'linear-gradient(160deg, #F2EFE9 0%, #EDE8E0 60%, #E8E2D8 100%)' }}
      >
        {/* Background Decorations - Hidden in search mode on mobile */}
        <div className={`absolute inset-0 overflow-hidden pointer-events-none transition-opacity duration-500 ${isSearchMode ? 'opacity-20 lg:opacity-100' : ''}`}>
          <div className="absolute -top-32 -right-32 w-[500px] h-[500px] rounded-full opacity-30"
            style={{ background: 'radial-gradient(circle, #d4c9a8 0%, transparent 70%)' }} />
          <div className="absolute bottom-0 -left-24 w-[400px] h-[400px] rounded-full opacity-20"
            style={{ background: 'radial-gradient(circle, #b8c9c9 0%, transparent 70%)' }} />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full opacity-10"
            style={{ background: 'radial-gradient(circle, #0D6E6E 0%, transparent 60%)' }} />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <AnimatePresence mode="wait">
            {!isSearchMode ? (
              /* Default Layout: Hero Content Left + Booking Widget Right */
              <motion.div
                key="hero-layout"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="grid lg:grid-cols-5 gap-8 lg:gap-12 items-start"
              >
                {/* Left: Hero Content - 3 cols */}
                <div className="lg:col-span-3 lg:pt-8">
                  <div className="inline-flex items-center gap-2 bg-[#0D6E6E]/10 border border-[#0D6E6E]/20 rounded-full px-3 py-1.5 sm:px-4 sm:py-2 mb-5 sm:mb-8">
                    <Car size={14} className="text-[#C9A84C]" />
                    <span className="text-[#0D6E6E] text-xs sm:text-sm font-semibold">Cab & Local Transport</span>
                  </div>
                  
                  <h1 className="text-3xl sm:text-5xl lg:text-6xl font-bold text-[#1C1C1E] leading-[1.1] mb-5">
                    Book Your Ride Across
                    <span className="text-[#0D6E6E]"> Kerala</span>
                  </h1>
                  
                  <p className="text-base sm:text-xl text-[#4B5563] mb-8 leading-relaxed max-w-2xl">
                    Connect with verified professional drivers instantly. From airport transfers to sightseeing tours, find the perfect ride with transparent pricing.
                  </p>

                  {/* Quick Stats with Count Animation */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
                    <AnimatedStat 
                      value={stats.availableDrivers} 
                      suffix="+" 
                      label="Active Drivers" 
                      delay={0.1}
                    />
                    <AnimatedStat 
                      value={stats.totalCities} 
                      suffix="+" 
                      label="Kerala Cities" 
                      delay={0.2}
                    />
                    <AnimatedStat 
                      value={stats.avgRating} 
                      decimals={1}
                      label="Avg. Rating" 
                      delay={0.3}
                    />
                    <AnimatedStat 
                      value={stats.completedTrips} 
                      suffix="+" 
                      label="Trips Done" 
                      delay={0.4}
                    />
                  </div>

                  <div className="flex flex-wrap items-center gap-4 text-sm text-[#6B7280]">
                    <span className="flex items-center gap-2">
                      <CheckCircle size={16} className="text-[#0D6E6E]" />
                      Instant Booking
                    </span>
                    <span className="flex items-center gap-2">
                      <CheckCircle size={16} className="text-[#0D6E6E]" />
                      Fixed Pricing
                    </span>
                    <span className="flex items-center gap-2">
                      <CheckCircle size={16} className="text-[#0D6E6E]" />
                      24/7 Support
                    </span>
                  </div>
                </div>

                {/* Right: Booking Widget - 2 cols */}
                <div className="lg:col-span-2 w-full">
                  <div className="lg:sticky lg:top-24">
                    <BookingWidget 
                      onSearchStart={handleSearchStart}
                      onSearchComplete={handleSearchComplete}
                      onDateTimeChange={handleDateTimeChange}
                    />
                  </div>
                </div>
              </motion.div>
            ) : (
              /* Search Mode Layout: Widget Left + Results Right */
              <motion.div
                key="search-layout"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
                className="grid lg:grid-cols-5 gap-6 lg:gap-8 items-start"
              >
                {/* Left: Compact Booking Widget - 2 cols */}
                <div className="lg:col-span-2 w-full order-1 lg:order-1">
                  <div className="lg:sticky lg:top-24">
                    <div className="flex items-center justify-between mb-4">
                      <button
                        onClick={handleResetSearch}
                        className="text-sm text-[#0D6E6E] hover:text-[#095555] font-medium flex items-center gap-1"
                      >
                        ← Back to Home
                      </button>
                    </div>
                    <BookingWidget 
                      isCompact
                      onSearchStart={handleSearchStart}
                      onSearchComplete={handleSearchComplete}
                      onDateTimeChange={handleDateTimeChange}
                    />
                  </div>
                </div>

                {/* Right: Driver Results - 3 cols */}
                <div className="lg:col-span-3 w-full order-2 lg:order-2">
                  <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-white/50 shadow-lg p-4 sm:p-6">
                    {/* Results Header */}
                    <div className="flex items-center justify-between mb-6">
                      <div>
                        <h3 className="text-lg sm:text-xl font-bold text-[#1C1C1E]">
                          {isSearching ? 'Finding Drivers...' : `${drivers.length} Drivers Available`}
                        </h3>
                        <p className="text-sm text-[#6B7280]">
                          {isSearching ? 'Matching you with the best rides' : 'Select your preferred driver'}
                        </p>
                      </div>
                      {isSearching && (
                        <Loader2 size={24} className="animate-spin text-[#0D6E6E]" />
                      )}
                    </div>

                    {/* Drivers Grid - Show only 4 initially */}
                    {!isSearching && (
                      <>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          {(showAllDrivers ? drivers : drivers.slice(0, 4)).map((driver) => (
                            <div 
                              key={driver.driver_id}
                              onClick={() => handleDriverClick(driver)}
                              className="bg-white rounded-xl border border-[#E8E4DF] p-3 sm:p-4 hover:border-[#0D6E6E]/30 hover:shadow-md transition-all cursor-pointer"
                            >
                              <div className="flex items-start gap-2 sm:gap-3">
                                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-[#F2EFE9] flex items-center justify-center flex-shrink-0">
                                  <Car size={16} className="text-[#0D6E6E] sm:w-5 sm:h-5" />
                                </div>
                                <div className="flex-1 min-w-0">
                                  <h4 className="font-bold text-[#1C1C1E] text-sm truncate">{driver.full_name}</h4>
                                  <p className="text-xs text-[#6B7280]">{driver.brand} {driver.model}</p>
                                  <div className="flex items-center gap-1.5 mt-1">
                                    <Star size={12} className="text-[#C9A84C] fill-[#C9A84C] sm:w-3.5 sm:h-3.5" />
                                    <span className="text-xs font-medium">{driver.rating.toFixed(1)}</span>
                                    <span className="text-[10px] sm:text-xs text-[#6B7280]">• {driver.total_trips.toLocaleString()} trips</span>
                                  </div>
                                </div>
                                <div className="text-right flex-shrink-0">
                                  <p className="text-base sm:text-lg font-bold text-[#0D6E6E]">₹{driver.price_per_km.toFixed(0)}</p>
                                  <p className="text-[10px] sm:text-xs text-[#6B7280]">/km</p>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                        
                        {/* Show More/Less Button */}
                        {drivers.length > 4 && (
                          <button
                            onClick={() => setShowAllDrivers(!showAllDrivers)}
                            className="w-full mt-4 py-3 px-4 bg-[#F2EFE9] hover:bg-[#E8E4DF] rounded-xl text-sm font-semibold text-[#0D6E6E] transition-colors flex items-center justify-center gap-2"
                          >
                            {showAllDrivers ? (
                              <>
                                <ChevronUp size={18} />
                                Show Less
                              </>
                            ) : (
                              <>
                                <ChevronDown size={18} />
                                Show {drivers.length - 4} More Drivers
                              </>
                            )}
                          </button>
                        )}
                      </>
                    )}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </section>

      {/* Why Choose Us */}
      <SectionContainer>
        <SectionHeading
          eyebrow="Why Choose Us"
          title="The Smarter Way to Travel Kerala"
          subtitle="Our driver matching system connects you with the best professionals, ensuring safe, comfortable, and reliable journeys every time."
        />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {whyChooseUs.map((item) => (
            <FeatureCard 
              key={item.title} 
              icon={item.icon} 
              title={item.title} 
              description={item.description} 
            />
          ))}
        </div>
      </SectionContainer>

      {/* How It Works */}
      <SectionContainer variant="tinted">
        <SectionHeading
          eyebrow="How It Works"
          title="Book in Minutes, Travel in Comfort"
          subtitle="Our streamlined booking process gets you from search to ride faster than ever."
        />
        <div className="max-w-3xl mx-auto">
          <StepIndicator steps={steps} variant="vertical" />
        </div>
      </SectionContainer>

      {/* Rent a Vehicle Section - REPLACED Fleet */}
      <SectionContainer>
        <SectionHeading
          eyebrow="Rent a Vehicle"
          title="Self-Drive Rentals Across Kerala"
          subtitle="From cars to bikes and bicycles, find the perfect vehicle for your adventure. Choose your fuel type and hit the road."
        />
        <RentalWidget />
      </SectionContainer>

      {/* Coverage Areas */}
      <SectionContainer variant="tinted">
        <SectionHeading
          eyebrow="Coverage"
          title="All of Kerala, Covered"
          subtitle="From major cities to hidden gems, our driver network spans the entire state."
        />
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
          {['Kochi', 'Trivandrum', 'Kozhikode', 'Thrissur', 'Kottayam', 'Alappuzha', 'Munnar', 'Thekkady', 'Wayanad', 'Kumarakom', 'Kovalam', 'Varkala'].map((city) => (
            <div key={city} className="flex items-center gap-2 px-4 py-3 bg-white rounded-xl border border-[#E8E4DF] hover:border-[#0D6E6E]/30 transition-colors">
              <MapPin size={16} className="text-[#0D6E6E]" />
              <span className="text-sm font-medium text-[#1C1C1E]">{city}</span>
            </div>
          ))}
        </div>
      </SectionContainer>

      {/* CTA Banner - Mobile Optimized */}
      <SectionContainer variant="dark">
        <div className="text-center max-w-2xl mx-auto px-4">
          <SectionHeading
            eyebrow="Ready to Go"
            title="Book Your Kerala Cab Now"
            subtitle="Join thousands of travelers who trust Shahr for their Kerala journeys."
            light
          />
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4">
            <CTAButton href="#" variant="primary" size="lg" className="w-full sm:w-auto text-sm sm:text-base py-3 sm:py-4">
              Book Your Ride <ArrowRight size={18} className="sm:w-5 sm:h-5" />
            </CTAButton>
            <a href="tel:+919876543210" className="flex items-center gap-2 text-white/80 hover:text-white transition-colors text-sm sm:text-base">
              <Phone size={18} className="sm:w-5 sm:h-5" />
              <span>Call us: +91 98765 43210</span>
            </a>
          </div>
        </div>
      </SectionContainer>

      {/* FAQ */}
      <SectionContainer>
        <SectionHeading 
          eyebrow="FAQ" 
          title="Common Questions" 
          subtitle="Everything you need to know about booking cabs in Kerala." 
        />
        <div className="max-w-3xl mx-auto space-y-4">
          {faqs.map((faq) => (
            <details key={faq.q} className="group bg-white border border-[#E8E4DF] rounded-2xl overflow-hidden hover:border-[#0D6E6E]/30 transition-colors">
              <summary className="flex items-center justify-between p-4 sm:p-6 cursor-pointer list-none font-semibold text-[#1C1C1E] hover:text-[#0D6E6E] transition-colors text-sm sm:text-base">
                {faq.q}
                <span className="text-[#0D6E6E] text-xl leading-none group-open:rotate-45 transition-transform duration-200">+</span>
              </summary>
              <div className="px-6 pb-6 text-[#6B7280] leading-relaxed border-t border-[#E8E4DF] pt-4">{faq.a}</div>
            </details>
          ))}
        </div>
      </SectionContainer>

      {/* Contact Section - Need Help */}
      <SectionContainer variant="tinted">
        <div className="max-w-3xl mx-auto text-center px-4">
          <SectionHeading
            eyebrow="Need Help?"
            title="We are Here to Assist"
            subtitle="Our team is available 24/7 to help with your cab bookings and answer any questions."
          />
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4">
            <a 
              href="tel:+919876543210" 
              className="flex items-center gap-2 sm:gap-3 px-4 sm:px-6 py-3 sm:py-4 bg-white rounded-xl border border-[#E8E4DF] hover:border-[#0D6E6E]/30 hover:shadow-md transition-all w-full sm:w-auto justify-center sm:justify-start"
            >
              <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-[#0D6E6E]/10 flex items-center justify-center flex-shrink-0">
                <Phone size={16} className="text-[#0D6E6E] sm:w-5 sm:h-5" />
              </div>
              <div className="text-left">
                <p className="text-[10px] sm:text-xs text-[#6B7280]">Call Us</p>
                <p className="font-semibold text-[#1C1C1E] text-sm sm:text-base">+91 98765 43210</p>
              </div>
            </a>
            <a 
              href="https://wa.me/919876543210" 
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 sm:gap-3 px-4 sm:px-6 py-3 sm:py-4 bg-white rounded-xl border border-[#E8E4DF] hover:border-[#0D6E6E]/30 hover:shadow-md transition-all w-full sm:w-auto justify-center sm:justify-start"
            >
              <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-green-500/10 flex items-center justify-center flex-shrink-0">
                <MessageCircle size={16} className="text-green-600 sm:w-5 sm:h-5" />
              </div>
              <div className="text-left">
                <p className="text-[10px] sm:text-xs text-[#6B7280]">WhatsApp</p>
                <p className="font-semibold text-[#1C1C1E] text-sm sm:text-base">Quick Chat</p>
              </div>
            </a>
          </div>
        </div>
      </SectionContainer>

      {/* Booking Modal */}
      <BookingModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        driver={selectedDriver}
        pickupLocation={null}
        dropLocation={null}
        pickupDate={pickupDate}
        pickupTime={pickupTime}
        passengerCount={1}
        onBookingSuccess={handleBookingSuccess}
        onBookingError={handleBookingError}
      />
      
      {/* Toast Notifications */}
      <Toaster />
    </>
  )
}
