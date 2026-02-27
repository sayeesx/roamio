import { createClient } from './client'

// ============================================================================
// TYPES - Based on Database Schema
// ============================================================================

export interface Driver {
  id: string
  first_name: string
  last_name: string
  full_name: string
  phone: string
  email?: string
  whatsapp?: string
  license_number: string
  license_expiry: string
  license_type: string
  years_of_experience: number
  rating: number
  total_trips: number
  is_available: boolean
  current_city: string
  operating_cities: string[]
  profile_image_url: string
  bio?: string
  languages: string[]
  is_verified: boolean
  is_background_checked: boolean
  created_at: string
  updated_at: string
}

export interface Vehicle {
  id: string
  brand: string
  model: string
  year: number
  registration_number: string
  registration_state: string
  fuel_type: 'Petrol' | 'Diesel' | 'CNG' | 'Electric' | 'Hybrid'
  seating_capacity: number
  has_ac: boolean
  vehicle_type: 'Hatchback' | 'Sedan' | 'SUV' | 'MUV' | 'Luxury' | 'Tempo Traveller'
  primary_image_url: string
  additional_images: string[]
  is_active: boolean
  created_at: string
  updated_at: string
}

export interface DriverVehicle {
  id: string
  driver_id: string
  vehicle_id: string
  is_primary: boolean
  price_per_km: number
  created_at: string
}

export interface Location {
  id: string
  name: string
  name_ml?: string
  type: 'City' | 'Town' | 'Tourist Spot' | 'Airport' | 'Railway Station' | 'Beach' | 'Hill Station' | 'Backwater'
  district: string
  latitude?: number
  longitude?: number
  popularity_score: number
  is_active: boolean
  created_at: string
}

export interface CabBooking {
  id: string
  booking_reference: string
  customer_name: string
  customer_phone: string
  customer_email?: string
  pickup_location_id?: string
  pickup_address: string
  drop_location_id?: string
  drop_address: string
  pickup_date: string
  pickup_time: string
  estimated_distance_km?: number
  base_fare: number
  total_fare: number
  driver_id?: string
  driver_vehicle_id?: string
  status: 'pending' | 'confirmed' | 'driver_assigned' | 'in_progress' | 'completed' | 'cancelled'
  trip_type: 'one_way' | 'round_trip' | 'hourly_rental' | 'outstation'
  special_requests?: string
  luggage_count: number
  passenger_count: number
  payment_status: 'pending' | 'paid' | 'failed' | 'refunded'
  payment_method?: string
  created_at: string
  updated_at: string
  confirmed_at?: string
  completed_at?: string
}

// Combined view type for available drivers with vehicles
export interface DriverWithVehicle {
  driver_id: string
  full_name: string
  rating: number
  total_trips: number
  years_of_experience: number
  current_city: string
  profile_image_url: string
  languages: string[]
  vehicle_id: string
  brand: string
  model: string
  vehicle_type: Vehicle['vehicle_type']
  fuel_type: Vehicle['fuel_type']
  seating_capacity: number
  has_ac: boolean
  vehicle_image: string
  price_per_km: number
}

// ============================================================================
// LOCATION QUERIES
// ============================================================================

// Kerala fallback locations when database is empty
const keralaFallbackLocations: Location[] = [
  { id: '1', name: 'Kochi', type: 'City', district: 'Ernakulam', popularity_score: 100, is_active: true, created_at: new Date().toISOString() },
  { id: '2', name: 'Trivandrum', type: 'City', district: 'Thiruvananthapuram', popularity_score: 95, is_active: true, created_at: new Date().toISOString() },
  { id: '3', name: 'Kozhikode', type: 'City', district: 'Kozhikode', popularity_score: 90, is_active: true, created_at: new Date().toISOString() },
  { id: '4', name: 'Thrissur', type: 'City', district: 'Thrissur', popularity_score: 85, is_active: true, created_at: new Date().toISOString() },
  { id: '5', name: 'Kottayam', type: 'City', district: 'Kottayam', popularity_score: 80, is_active: true, created_at: new Date().toISOString() },
  { id: '6', name: 'Alappuzha', type: 'City', district: 'Alappuzha', popularity_score: 78, is_active: true, created_at: new Date().toISOString() },
  { id: '7', name: 'Munnar', type: 'Hill Station', district: 'Idukki', popularity_score: 92, is_active: true, created_at: new Date().toISOString() },
  { id: '8', name: 'Thekkady', type: 'Tourist Spot', district: 'Idukki', popularity_score: 88, is_active: true, created_at: new Date().toISOString() },
  { id: '9', name: 'Wayanad', type: 'Hill Station', district: 'Wayanad', popularity_score: 87, is_active: true, created_at: new Date().toISOString() },
  { id: '10', name: 'Kumarakom', type: 'Backwater', district: 'Kottayam', popularity_score: 82, is_active: true, created_at: new Date().toISOString() },
  { id: '11', name: 'Kovalam', type: 'Beach', district: 'Thiruvananthapuram', popularity_score: 80, is_active: true, created_at: new Date().toISOString() },
  { id: '12', name: 'Varkala', type: 'Beach', district: 'Thiruvananthapuram', popularity_score: 78, is_active: true, created_at: new Date().toISOString() },
  { id: '13', name: 'Fort Kochi', type: 'Tourist Spot', district: 'Ernakulam', popularity_score: 85, is_active: true, created_at: new Date().toISOString() },
  { id: '14', name: 'Marari Beach', type: 'Beach', district: 'Alappuzha', popularity_score: 75, is_active: true, created_at: new Date().toISOString() },
  { id: '15', name: 'Athirapally', type: 'Tourist Spot', district: 'Thrissur', popularity_score: 83, is_active: true, created_at: new Date().toISOString() },
]

/**
 * Search locations by name (for autocomplete)
 */
export async function searchLocations(query: string, limit: number = 8): Promise<Location[]> {
  const supabase = createClient()
  
  const { data, error } = await supabase
    .from('locations')
    .select('*')
    .ilike('name', `%${query}%`)
    .eq('is_active', true)
    .order('popularity_score', { ascending: false })
    .limit(limit)

  if (error) {
    console.warn('Database error searching locations, using fallback:', error.message)
    // Return filtered fallback data
    return keralaFallbackLocations
      .filter(loc => loc.name.toLowerCase().includes(query.toLowerCase()))
      .slice(0, limit)
  }

  // If no data from database, use fallback
  if (!data || data.length === 0) {
    return keralaFallbackLocations
      .filter(loc => loc.name.toLowerCase().includes(query.toLowerCase()))
      .slice(0, limit)
  }

  return data
}

/**
 * Get popular locations for default suggestions
 */
export async function getPopularLocations(limit: number = 10): Promise<Location[]> {
  const supabase = createClient()
  
  const { data, error } = await supabase
    .from('locations')
    .select('*')
    .eq('is_active', true)
    .order('popularity_score', { ascending: false })
    .limit(limit)

  if (error) {
    console.warn('Database error fetching popular locations, using fallback:', error.message)
    return keralaFallbackLocations.slice(0, limit)
  }

  // If no data from database, use fallback
  if (!data || data.length === 0) {
    return keralaFallbackLocations.slice(0, limit)
  }

  return data
}

/**
 * Get a specific location by ID
 */
export async function getLocationById(id: string): Promise<Location | null> {
  const supabase = createClient()
  
  const { data, error } = await supabase
    .from('locations')
    .select('*')
    .eq('id', id)
    .single()

  if (error) {
    console.error('Error fetching location:', error)
    return null
  }

  return data
}

// ============================================================================
// DRIVER QUERIES
// ============================================================================

/**
 * Fetch available drivers with their primary vehicles
 * Filters by operating cities matching pickup/drop locations
 */
export async function findAvailableDrivers(
  pickupCity: string,
  dropCity?: string,
  minSeating?: number
): Promise<DriverWithVehicle[]> {
  const supabase = createClient()
  
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
    console.error('Error fetching available drivers:', error)
    return []
  }

  return data || []
}

/**
 * Get all available drivers (for initial display)
 */
export async function getAllAvailableDrivers(limit: number = 12): Promise<DriverWithVehicle[]> {
  const supabase = createClient()
  
  const { data, error } = await supabase
    .from('available_drivers_with_vehicles')
    .select('*')
    .order('rating', { ascending: false })
    .limit(limit)

  if (error) {
    console.error('Error fetching all drivers:', error)
    return []
  }

  return data || []
}

/**
 * Get a specific driver with vehicle details
 */
export async function getDriverWithVehicle(driverId: string): Promise<DriverWithVehicle | null> {
  const supabase = createClient()
  
  const { data, error } = await supabase
    .from('available_drivers_with_vehicles')
    .select('*')
    .eq('driver_id', driverId)
    .single()

  if (error) {
    console.error('Error fetching driver:', error)
    return null
  }

  return data
}

/**
 * Get driver's additional vehicles
 */
export async function getDriverVehicles(driverId: string): Promise<(DriverVehicle & { vehicle: Vehicle })[]> {
  const supabase = createClient()
  
  const { data, error } = await supabase
    .from('driver_vehicles')
    .select(`
      *,
      vehicle:vehicles(*)
    `)
    .eq('driver_id', driverId)

  if (error) {
    console.error('Error fetching driver vehicles:', error)
    return []
  }

  return data || []
}

// ============================================================================
// BOOKING QUERIES
// ============================================================================

/**
 * Create a new cab booking
 */
export async function createBooking(
  bookingData: Omit<CabBooking, 'id' | 'booking_reference' | 'created_at' | 'updated_at' | 'confirmed_at' | 'completed_at'>
): Promise<{ success: boolean; booking?: CabBooking; error?: string }> {
  const supabase = createClient()
  
  // Generate booking reference
  const bookingRef = `ROM-${Date.now().toString(36).toUpperCase()}`
  
  const { data, error } = await supabase
    .from('cab_bookings')
    .insert({
      ...bookingData,
      booking_reference: bookingRef,
    })
    .select()
    .single()

  if (error) {
    console.error('Error creating booking:', error)
    return { success: false, error: error.message }
  }

  return { success: true, booking: data }
}

/**
 * Get booking by reference number
 */
export async function getBookingByReference(reference: string): Promise<CabBooking | null> {
  const supabase = createClient()
  
  const { data, error } = await supabase
    .from('cab_bookings')
    .select('*')
    .eq('booking_reference', reference)
    .single()

  if (error) {
    console.error('Error fetching booking:', error)
    return null
  }

  return data
}

/**
 * Update booking status
 */
export async function updateBookingStatus(
  bookingId: string,
  status: CabBooking['status']
): Promise<boolean> {
  const supabase = createClient()
  
  const updateData: Partial<CabBooking> = { status }
  
  // Set timestamps based on status
  if (status === 'confirmed') {
    updateData.confirmed_at = new Date().toISOString()
  } else if (status === 'completed') {
    updateData.completed_at = new Date().toISOString()
  }
  
  const { error } = await supabase
    .from('cab_bookings')
    .update(updateData)
    .eq('id', bookingId)

  if (error) {
    console.error('Error updating booking:', error)
    return false
  }

  return true
}

/**
 * Assign driver to booking
 */
export async function assignDriverToBooking(
  bookingId: string,
  driverId: string,
  driverVehicleId: string
): Promise<boolean> {
  const supabase = createClient()
  
  const { error } = await supabase
    .from('cab_bookings')
    .update({
      driver_id: driverId,
      driver_vehicle_id: driverVehicleId,
      status: 'driver_assigned',
    })
    .eq('id', bookingId)

  if (error) {
    console.error('Error assigning driver:', error)
    return false
  }

  return true
}

// ============================================================================
// STATS QUERIES
// ============================================================================

/**
 * Get driver statistics by city
 */
export async function getDriverStatsByCity() {
  const supabase = createClient()
  
  const { data, error } = await supabase
    .from('driver_stats_by_city')
    .select('*')
    .order('total_drivers', { ascending: false })

  if (error) {
    console.error('Error fetching driver stats:', error)
    return []
  }

  return data || []
}

/**
 * Get quick stats for UI display
 */
export async function getQuickStats() {
  const supabase = createClient()
  
  const { data: drivers, error: driversError } = await supabase
    .from('drivers')
    .select('id', { count: 'exact', head: true })
    .eq('is_available', true)
    .eq('is_verified', true)

  const { data: cities, error: citiesError } = await supabase
    .from('locations')
    .select('id', { count: 'exact', head: true })
    .eq('is_active', true)

  if (driversError || citiesError) {
    console.error('Error fetching stats:', driversError || citiesError)
    return { availableDrivers: 0, totalCities: 0 }
  }

  return {
    availableDrivers: drivers?.length || 0,
    totalCities: cities?.length || 0,
  }
}
