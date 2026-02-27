'use server'

import { createClient as createServerClient } from '@/lib/supabase/server'
import type { DriverWithVehicle, Location, CabBooking } from '@/lib/supabase/cabs'

// ============================================================================
// LOCATION ACTIONS
// ============================================================================

/**
 * Server action to search locations
 */
export async function searchLocationsAction(query: string, limit: number = 8): Promise<Location[]> {
  'use server'
  
  const supabase = await createServerClient()
  
  const { data, error } = await supabase
    .from('locations')
    .select('*')
    .ilike('name', `%${query}%`)
    .eq('is_active', true)
    .order('popularity_score', { ascending: false })
    .limit(limit)

  if (error) {
    console.error('Server: Error searching locations:', error)
    return []
  }

  return data || []
}

/**
 * Get popular locations for initial suggestions
 */
export async function getPopularLocationsAction(limit: number = 10): Promise<Location[]> {
  'use server'
  
  const supabase = await createServerClient()
  
  const { data, error } = await supabase
    .from('locations')
    .select('*')
    .eq('is_active', true)
    .order('popularity_score', { ascending: false })
    .limit(limit)

  if (error) {
    console.error('Server: Error fetching popular locations:', error)
    return []
  }

  return data || []
}

// ============================================================================
// DRIVER ACTIONS
// ============================================================================

interface FindDriversParams {
  pickupCity: string
  dropCity?: string
  minSeating?: number
  vehicleType?: string
}

/**
 * Server action to find available drivers
 */
export async function findDriversAction(params: FindDriversParams): Promise<DriverWithVehicle[]> {
  'use server'
  
  const { pickupCity, dropCity, minSeating } = params
  const supabase = await createServerClient()
  
  let query = supabase
    .from('available_drivers_with_vehicles')
    .select('*')
    .order('rating', { ascending: false })

  // Filter by city if provided
  if (pickupCity) {
    query = query.or(`current_city.ilike.%${pickupCity}%,current_city.ilike.%${dropCity || pickupCity}%`)
  }

  // Filter by seating capacity if provided
  if (minSeating && minSeating > 0) {
    query = query.gte('seating_capacity', minSeating)
  }

  const { data, error } = await query.limit(20)

  if (error) {
    console.error('Server: Error finding drivers:', error)
    return []
  }

  return data || []
}

/**
 * Get all available drivers
 */
export async function getAllDriversAction(limit: number = 12): Promise<DriverWithVehicle[]> {
  'use server'
  
  const supabase = await createServerClient()
  
  const { data, error } = await supabase
    .from('available_drivers_with_vehicles')
    .select('*')
    .order('rating', { ascending: false })
    .limit(limit)

  if (error) {
    console.error('Server: Error fetching all drivers:', error)
    return []
  }

  return data || []
}

// ============================================================================
// BOOKING ACTIONS
// ============================================================================

interface CreateBookingParams {
  customerName: string
  customerPhone: string
  customerEmail?: string
  pickupLocationId?: string
  pickupAddress: string
  dropLocationId?: string
  dropAddress: string
  pickupDate: string
  pickupTime: string
  driverId: string
  driverVehicleId: string
  estimatedDistanceKm?: number
  baseFare: number
  totalFare: number
  tripType: 'one_way' | 'round_trip' | 'hourly_rental' | 'outstation'
  passengerCount: number
  specialRequests?: string
}

/**
 * Server action to create a new cab booking
 */
export async function createBookingAction(params: CreateBookingParams): Promise<{ success: boolean; bookingReference?: string; error?: string }> {
  'use server'
  
  const supabase = await createServerClient()
  
  // Generate booking reference
  const bookingRef = `ROM-${Date.now().toString(36).toUpperCase()}-${Math.random().toString(36).substring(2, 5).toUpperCase()}`
  
  const { data, error } = await supabase
    .from('cab_bookings')
    .insert({
      booking_reference: bookingRef,
      customer_name: params.customerName,
      customer_phone: params.customerPhone,
      customer_email: params.customerEmail,
      pickup_location_id: params.pickupLocationId,
      pickup_address: params.pickupAddress,
      drop_location_id: params.dropLocationId,
      drop_address: params.dropAddress,
      pickup_date: params.pickupDate,
      pickup_time: params.pickupTime,
      driver_id: params.driverId,
      driver_vehicle_id: params.driverVehicleId,
      estimated_distance_km: params.estimatedDistanceKm,
      base_fare: params.baseFare,
      total_fare: params.totalFare,
      trip_type: params.tripType,
      passenger_count: params.passengerCount,
      special_requests: params.specialRequests,
      status: 'pending',
      payment_status: 'pending',
    })
    .select('booking_reference')
    .single()

  if (error) {
    console.error('Server: Error creating booking:', error)
    return { success: false, error: error.message }
  }

  return { 
    success: true, 
    bookingReference: data?.booking_reference || bookingRef 
  }
}

/**
 * Get booking by reference
 */
export async function getBookingByReferenceAction(reference: string): Promise<CabBooking | null> {
  'use server'
  
  const supabase = await createServerClient()
  
  const { data, error } = await supabase
    .from('cab_bookings')
    .select('*')
    .eq('booking_reference', reference)
    .single()

  if (error) {
    console.error('Server: Error fetching booking:', error)
    return null
  }

  return data
}

// ============================================================================
// RENTAL BOOKING ACTIONS
// ============================================================================

interface CreateRentalBookingParams {
  customerName: string
  customerPhone: string
  customerEmail?: string
  customerAddress: string
  idProofType: string
  idProofNumber: string
  vehicleId: string
  pickupLocationId?: string
  pickupDate: string
  pickupTime: string
  returnDate: string
  returnTime: string
  totalDays: number
  dailyRate: number
  totalAmount: number
  securityDeposit: number
  specialRequests?: string
}

/**
 * Server action to create a new rental booking
 */
export async function createRentalBookingAction(params: CreateRentalBookingParams): Promise<{ success: boolean; bookingReference?: string; error?: string }> {
  'use server'
  
  const supabase = await createServerClient()
  
  // Generate booking reference
  const bookingRef = `ROM-REN-${Date.now().toString(36).toUpperCase().slice(-6)}`
  
  const { data, error } = await supabase
    .from('rental_bookings')
    .insert({
      booking_reference: bookingRef,
      customer_name: params.customerName,
      customer_phone: params.customerPhone,
      customer_email: params.customerEmail,
      customer_address: params.customerAddress,
      id_proof_type: params.idProofType,
      id_proof_number: params.idProofNumber,
      vehicle_id: params.vehicleId,
      pickup_location_id: params.pickupLocationId,
      pickup_date: params.pickupDate,
      pickup_time: params.pickupTime,
      return_date: params.returnDate,
      return_time: params.returnTime,
      total_days: params.totalDays,
      daily_rate: params.dailyRate,
      total_amount: params.totalAmount,
      security_deposit: params.securityDeposit,
      special_requests: params.specialRequests,
      status: 'pending',
      payment_status: 'pending',
    })
    .select('booking_reference')
    .single()

  if (error) {
    console.error('Server: Error creating rental booking:', error)
    return { success: false, error: error.message }
  }

  return { 
    success: true, 
    bookingReference: data?.booking_reference || bookingRef 
  }
}

// ============================================================================
// STATS ACTIONS
// ============================================================================

/**
 * Get quick stats for the UI
 */
export async function getCabStatsAction(): Promise<{ 
  availableDrivers: number
  totalCities: number
  completedTrips: number
  avgRating: number 
}> {
  'use server'
  
  const supabase = await createServerClient()
  
  // Get available drivers count
  const { count: availableDrivers, error: driversError } = await supabase
    .from('drivers')
    .select('id', { count: 'exact', head: true })
    .eq('is_available', true)
    .eq('is_verified', true)

  // Get total cities count
  const { count: totalCities, error: citiesError } = await supabase
    .from('locations')
    .select('id', { count: 'exact', head: true })
    .eq('is_active', true)

  // Get completed trips count
  const { count: completedTrips, error: tripsError } = await supabase
    .from('cab_bookings')
    .select('id', { count: 'exact', head: true })
    .eq('status', 'completed')

  // Get average rating
  const { data: ratingData, error: ratingError } = await supabase
    .from('drivers')
    .select('rating')
    .eq('is_verified', true)

  const avgRating = ratingData && ratingData.length > 0
    ? ratingData.reduce((sum, d) => sum + (d.rating || 0), 0) / ratingData.length
    : 4.5

  if (driversError || citiesError || tripsError || ratingError) {
    console.error('Server: Error fetching stats:', { 
      driversError: driversError?.message || driversError, 
      citiesError: citiesError?.message || citiesError, 
      tripsError: tripsError?.message || tripsError,
      ratingError: ratingError?.message || ratingError
    })
  }

  return {
    availableDrivers: availableDrivers || 0,
    totalCities: totalCities || 0,
    completedTrips: completedTrips || 0,
    avgRating: Number(avgRating.toFixed(1)),
  }
}
