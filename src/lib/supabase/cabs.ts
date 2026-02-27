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

// Kerala fallback locations when database is empty - All 14 Districts + Famous Places
const keralaFallbackLocations: Location[] = [
  // District Capitals (14 districts)
  { id: '1', name: 'Thiruvananthapuram', type: 'City', district: 'Thiruvananthapuram', popularity_score: 100, is_active: true, created_at: new Date().toISOString() },
  { id: '2', name: 'Kollam', type: 'City', district: 'Kollam', popularity_score: 95, is_active: true, created_at: new Date().toISOString() },
  { id: '3', name: 'Pathanamthitta', type: 'City', district: 'Pathanamthitta', popularity_score: 85, is_active: true, created_at: new Date().toISOString() },
  { id: '4', name: 'Alappuzha', type: 'City', district: 'Alappuzha', popularity_score: 92, is_active: true, created_at: new Date().toISOString() },
  { id: '5', name: 'Kottayam', type: 'City', district: 'Kottayam', popularity_score: 90, is_active: true, created_at: new Date().toISOString() },
  { id: '6', name: 'Idukki', type: 'City', district: 'Idukki', popularity_score: 88, is_active: true, created_at: new Date().toISOString() },
  { id: '7', name: 'Ernakulam', type: 'City', district: 'Ernakulam', popularity_score: 98, is_active: true, created_at: new Date().toISOString() },
  { id: '8', name: 'Thrissur', type: 'City', district: 'Thrissur', popularity_score: 94, is_active: true, created_at: new Date().toISOString() },
  { id: '9', name: 'Palakkad', type: 'City', district: 'Palakkad', popularity_score: 89, is_active: true, created_at: new Date().toISOString() },
  { id: '10', name: 'Malappuram', type: 'City', district: 'Malappuram', popularity_score: 87, is_active: true, created_at: new Date().toISOString() },
  { id: '11', name: 'Kozhikode', type: 'City', district: 'Kozhikode', popularity_score: 96, is_active: true, created_at: new Date().toISOString() },
  { id: '12', name: 'Wayanad', type: 'City', district: 'Wayanad', popularity_score: 91, is_active: true, created_at: new Date().toISOString() },
  { id: '13', name: 'Kannur', type: 'City', district: 'Kannur', popularity_score: 88, is_active: true, created_at: new Date().toISOString() },
  { id: '14', name: 'Kasaragod', type: 'City', district: 'Kasaragod', popularity_score: 82, is_active: true, created_at: new Date().toISOString() },
  
  // Alternative names for major cities
  { id: '15', name: 'Trivandrum', type: 'City', district: 'Thiruvananthapuram', popularity_score: 99, is_active: true, created_at: new Date().toISOString() },
  { id: '16', name: 'Cochin', type: 'City', district: 'Ernakulam', popularity_score: 97, is_active: true, created_at: new Date().toISOString() },
  { id: '17', name: 'Kochi', type: 'City', district: 'Ernakulam', popularity_score: 99, is_active: true, created_at: new Date().toISOString() },
  { id: '18', name: 'Calicut', type: 'City', district: 'Kozhikode', popularity_score: 95, is_active: true, created_at: new Date().toISOString() },
  { id: '19', name: 'Trichur', type: 'City', district: 'Thrissur', popularity_score: 93, is_active: true, created_at: new Date().toISOString() },
  { id: '20', name: 'Quilon', type: 'City', district: 'Kollam', popularity_score: 94, is_active: true, created_at: new Date().toISOString() },
  { id: '21', name: 'Alleppey', type: 'City', district: 'Alappuzha', popularity_score: 96, is_active: true, created_at: new Date().toISOString() },
  { id: '22', name: 'Cottayam', type: 'City', district: 'Kottayam', popularity_score: 89, is_active: true, created_at: new Date().toISOString() },
  { id: '23', name: 'Palghat', type: 'City', district: 'Palakkad', popularity_score: 88, is_active: true, created_at: new Date().toISOString() },
  { id: '24', name: 'Cannanore', type: 'City', district: 'Kannur', popularity_score: 87, is_active: true, created_at: new Date().toISOString() },
  
  // Hill Stations
  { id: '25', name: 'Munnar', type: 'Hill Station', district: 'Idukki', popularity_score: 98, is_active: true, created_at: new Date().toISOString() },
  { id: '26', name: 'Thekkady', type: 'Hill Station', district: 'Idukki', popularity_score: 92, is_active: true, created_at: new Date().toISOString() },
  { id: '27', name: 'Vagamon', type: 'Hill Station', district: 'Idukki', popularity_score: 86, is_active: true, created_at: new Date().toISOString() },
  { id: '28', name: 'Ponmudi', type: 'Hill Station', district: 'Thiruvananthapuram', popularity_score: 84, is_active: true, created_at: new Date().toISOString() },
  { id: '29', name: 'Nelliampathy', type: 'Hill Station', district: 'Palakkad', popularity_score: 83, is_active: true, created_at: new Date().toISOString() },
  { id: '30', name: 'Wayanad Hills', type: 'Hill Station', district: 'Wayanad', popularity_score: 90, is_active: true, created_at: new Date().toISOString() },
  { id: '31', name: 'Lakkidi', type: 'Hill Station', district: 'Wayanad', popularity_score: 85, is_active: true, created_at: new Date().toISOString() },
  { id: '32', name: 'Kalpetta', type: 'City', district: 'Wayanad', popularity_score: 88, is_active: true, created_at: new Date().toISOString() },
  { id: '33', name: 'Sulthan Bathery', type: 'City', district: 'Wayanad', popularity_score: 84, is_active: true, created_at: new Date().toISOString() },
  { id: '34', name: 'Mananthavady', type: 'City', district: 'Wayanad', popularity_score: 82, is_active: true, created_at: new Date().toISOString() },
  
  // Beaches
  { id: '35', name: 'Kovalam', type: 'Beach', district: 'Thiruvananthapuram', popularity_score: 95, is_active: true, created_at: new Date().toISOString() },
  { id: '36', name: 'Varkala', type: 'Beach', district: 'Thiruvananthapuram', popularity_score: 93, is_active: true, created_at: new Date().toISOString() },
  { id: '37', name: 'Poovar', type: 'Beach', district: 'Thiruvananthapuram', popularity_score: 86, is_active: true, created_at: new Date().toISOString() },
  { id: '38', name: 'Marari Beach', type: 'Beach', district: 'Alappuzha', popularity_score: 89, is_active: true, created_at: new Date().toISOString() },
  { id: '39', name: 'Fort Kochi Beach', type: 'Beach', district: 'Ernakulam', popularity_score: 87, is_active: true, created_at: new Date().toISOString() },
  { id: '40', name: 'Cherai Beach', type: 'Beach', district: 'Ernakulam', popularity_score: 85, is_active: true, created_at: new Date().toISOString() },
  { id: '41', name: 'Muzhappilangad Beach', type: 'Beach', district: 'Kannur', popularity_score: 84, is_active: true, created_at: new Date().toISOString() },
  { id: '42', name: 'Payyambalam Beach', type: 'Beach', district: 'Kannur', popularity_score: 83, is_active: true, created_at: new Date().toISOString() },
  { id: '43', name: 'Bekal Beach', type: 'Beach', district: 'Kasaragod', popularity_score: 82, is_active: true, created_at: new Date().toISOString() },
  { id: '44', name: 'Kappad Beach', type: 'Beach', district: 'Kozhikode', popularity_score: 85, is_active: true, created_at: new Date().toISOString() },
  { id: '45', name: 'Kozhikode Beach', type: 'Beach', district: 'Kozhikode', popularity_score: 86, is_active: true, created_at: new Date().toISOString() },
  
  // Backwaters
  { id: '46', name: 'Kumarakom', type: 'Backwater', district: 'Kottayam', popularity_score: 94, is_active: true, created_at: new Date().toISOString() },
  { id: '47', name: 'Alappuzha Backwaters', type: 'Backwater', district: 'Alappuzha', popularity_score: 95, is_active: true, created_at: new Date().toISOString() },
  { id: '48', name: 'Ashtamudi Lake', type: 'Backwater', district: 'Kollam', popularity_score: 88, is_active: true, created_at: new Date().toISOString() },
  { id: '49', name: 'Vembanad Lake', type: 'Backwater', district: 'Kottayam', popularity_score: 91, is_active: true, created_at: new Date().toISOString() },
  { id: '50', name: 'Vaikom', type: 'Town', district: 'Kottayam', popularity_score: 85, is_active: true, created_at: new Date().toISOString() },
  
  // Tourist Spots
  { id: '51', name: 'Athirapally', type: 'Tourist Spot', district: 'Thrissur', popularity_score: 91, is_active: true, created_at: new Date().toISOString() },
  { id: '52', name: 'Vazhachal', type: 'Tourist Spot', district: 'Thrissur', popularity_score: 87, is_active: true, created_at: new Date().toISOString() },
  { id: '53', name: 'Fort Kochi', type: 'Tourist Spot', district: 'Ernakulam', popularity_score: 93, is_active: true, created_at: new Date().toISOString() },
  { id: '54', name: 'Mattancherry', type: 'Tourist Spot', district: 'Ernakulam', popularity_score: 88, is_active: true, created_at: new Date().toISOString() },
  { id: '55', name: 'Guruvayur', type: 'Tourist Spot', district: 'Thrissur', popularity_score: 90, is_active: true, created_at: new Date().toISOString() },
  { id: '56', name: 'Silent Valley', type: 'Tourist Spot', district: 'Palakkad', popularity_score: 85, is_active: true, created_at: new Date().toISOString() },
  { id: '57', name: 'Parambikulam', type: 'Tourist Spot', district: 'Palakkad', popularity_score: 84, is_active: true, created_at: new Date().toISOString() },
  { id: '58', name: 'Malampuzha', type: 'Tourist Spot', district: 'Palakkad', popularity_score: 86, is_active: true, created_at: new Date().toISOString() },
  { id: '59', name: 'Bekal Fort', type: 'Tourist Spot', district: 'Kasaragod', popularity_score: 87, is_active: true, created_at: new Date().toISOString() },
  { id: '60', name: 'St. Angelo Fort', type: 'Tourist Spot', district: 'Kannur', popularity_score: 84, is_active: true, created_at: new Date().toISOString() },
  { id: '61', name: 'Parassinikkadavu', type: 'Tourist Spot', district: 'Kannur', popularity_score: 83, is_active: true, created_at: new Date().toISOString() },
  { id: '62', name: 'Thalassery', type: 'Town', district: 'Kannur', popularity_score: 85, is_active: true, created_at: new Date().toISOString() },
  { id: '63', name: 'Mahe', type: 'Town', district: 'Kannur', popularity_score: 82, is_active: true, created_at: new Date().toISOString() },
  { id: '64', name: 'Kappil', type: 'Tourist Spot', district: 'Kasaragod', popularity_score: 81, is_active: true, created_at: new Date().toISOString() },
  { id: '65', name: 'Nileshwar', type: 'Town', district: 'Kasaragod', popularity_score: 80, is_active: true, created_at: new Date().toISOString() },
  { id: '66', name: 'Valiyaparamba', type: 'Backwater', district: 'Kasaragod', popularity_score: 82, is_active: true, created_at: new Date().toISOString() },
  { id: '67', name: 'Ananthapura', type: 'Tourist Spot', district: 'Kasaragod', popularity_score: 80, is_active: true, created_at: new Date().toISOString() },
  
  // Wildlife & Nature
  { id: '68', name: 'Periyar Wildlife Sanctuary', type: 'Tourist Spot', district: 'Idukki', popularity_score: 93, is_active: true, created_at: new Date().toISOString() },
  { id: '69', name: 'Eravikulam National Park', type: 'Tourist Spot', district: 'Idukki', popularity_score: 90, is_active: true, created_at: new Date().toISOString() },
  { id: '70', name: 'Thattekad Bird Sanctuary', type: 'Tourist Spot', district: 'Ernakulam', popularity_score: 84, is_active: true, created_at: new Date().toISOString() },
  { id: '71', name: 'Chinnar Wildlife Sanctuary', type: 'Tourist Spot', district: 'Idukki', popularity_score: 83, is_active: true, created_at: new Date().toISOString() },
  { id: '72', name: 'Kumarakom Bird Sanctuary', type: 'Tourist Spot', district: 'Kottayam', popularity_score: 86, is_active: true, created_at: new Date().toISOString() },
  { id: '73', name: 'Peppara Wildlife Sanctuary', type: 'Tourist Spot', district: 'Thiruvananthapuram', popularity_score: 81, is_active: true, created_at: new Date().toISOString() },
  { id: '74', name: 'Shendurney Wildlife Sanctuary', type: 'Tourist Spot', district: 'Kollam', popularity_score: 80, is_active: true, created_at: new Date().toISOString() },
  { id: '75', name: 'Mangalavanam Bird Sanctuary', type: 'Tourist Spot', district: 'Ernakulam', popularity_score: 82, is_active: true, created_at: new Date().toISOString() },
  { id: '76', name: 'Kadalundi Bird Sanctuary', type: 'Tourist Spot', district: 'Kozhikode', popularity_score: 81, is_active: true, created_at: new Date().toISOString() },
  
  // Major Towns
  { id: '77', name: 'Changanassery', type: 'Town', district: 'Kottayam', popularity_score: 86, is_active: true, created_at: new Date().toISOString() },
  { id: '78', name: 'Pala', type: 'Town', district: 'Kottayam', popularity_score: 85, is_active: true, created_at: new Date().toISOString() },
  { id: '79', name: 'Ettumanoor', type: 'Town', district: 'Kottayam', popularity_score: 84, is_active: true, created_at: new Date().toISOString() },
  { id: '80', name: 'Kanjirappally', type: 'Town', district: 'Kottayam', popularity_score: 83, is_active: true, created_at: new Date().toISOString() },
  { id: '81', name: 'Cherthala', type: 'Town', district: 'Alappuzha', popularity_score: 85, is_active: true, created_at: new Date().toISOString() },
  { id: '82', name: 'Kayamkulam', type: 'Town', district: 'Alappuzha', popularity_score: 84, is_active: true, created_at: new Date().toISOString() },
  { id: '83', name: 'Mavelikara', type: 'Town', district: 'Alappuzha', popularity_score: 83, is_active: true, created_at: new Date().toISOString() },
  { id: '84', name: 'Haripad', type: 'Town', district: 'Alappuzha', popularity_score: 82, is_active: true, created_at: new Date().toISOString() },
  { id: '85', name: 'Chengannur', type: 'Town', district: 'Alappuzha', popularity_score: 84, is_active: true, created_at: new Date().toISOString() },
  { id: '86', name: 'Kattanam', type: 'Town', district: 'Alappuzha', popularity_score: 81, is_active: true, created_at: new Date().toISOString() },
  { id: '87', name: 'Karunagappally', type: 'Town', district: 'Kollam', popularity_score: 83, is_active: true, created_at: new Date().toISOString() },
  { id: '88', name: 'Punalur', type: 'Town', district: 'Kollam', popularity_score: 82, is_active: true, created_at: new Date().toISOString() },
  { id: '89', name: 'Kottarakkara', type: 'Town', district: 'Kollam', popularity_score: 84, is_active: true, created_at: new Date().toISOString() },
  { id: '90', name: 'Chavara', type: 'Town', district: 'Kollam', popularity_score: 81, is_active: true, created_at: new Date().toISOString() },
  { id: '91', name: 'Paravur', type: 'Town', district: 'Kollam', popularity_score: 83, is_active: true, created_at: new Date().toISOString() },
  { id: '92', name: 'Attingal', type: 'Town', district: 'Thiruvananthapuram', popularity_score: 84, is_active: true, created_at: new Date().toISOString() },
  { id: '93', name: 'Neyyattinkara', type: 'Town', district: 'Thiruvananthapuram', popularity_score: 83, is_active: true, created_at: new Date().toISOString() },
  { id: '94', name: 'Nedumangad', type: 'Town', district: 'Thiruvananthapuram', popularity_score: 82, is_active: true, created_at: new Date().toISOString() },
  { id: '95', name: 'Kazhakoottam', type: 'Town', district: 'Thiruvananthapuram', popularity_score: 85, is_active: true, created_at: new Date().toISOString() },
  { id: '96', name: 'Kovalam', type: 'Town', district: 'Thiruvananthapuram', popularity_score: 86, is_active: true, created_at: new Date().toISOString() },
  { id: '97', name: 'Technopark', type: 'Tourist Spot', district: 'Thiruvananthapuram', popularity_score: 87, is_active: true, created_at: new Date().toISOString() },
  { id: '98', name: 'Adoor', type: 'Town', district: 'Pathanamthitta', popularity_score: 82, is_active: true, created_at: new Date().toISOString() },
  { id: '99', name: 'Thiruvalla', type: 'Town', district: 'Pathanamthitta', popularity_score: 86, is_active: true, created_at: new Date().toISOString() },
  { id: '100', name: 'Ranni', type: 'Town', district: 'Pathanamthitta', popularity_score: 81, is_active: true, created_at: new Date().toISOString() },
  { id: '101', name: 'Pandalam', type: 'Town', district: 'Pathanamthitta', popularity_score: 83, is_active: true, created_at: new Date().toISOString() },
  { id: '102', name: 'Mallappally', type: 'Town', district: 'Pathanamthitta', popularity_score: 80, is_active: true, created_at: new Date().toISOString() },
  { id: '103', name: 'Kozhencherry', type: 'Town', district: 'Pathanamthitta', popularity_score: 81, is_active: true, created_at: new Date().toISOString() },
  { id: '104', name: 'Sabarimala', type: 'Tourist Spot', district: 'Pathanamthitta', popularity_score: 95, is_active: true, created_at: new Date().toISOString() },
  { id: '105', name: 'Perunthenaruvi', type: 'Tourist Spot', district: 'Pathanamthitta', popularity_score: 84, is_active: true, created_at: new Date().toISOString() },
  { id: '106', name: 'Gavi', type: 'Tourist Spot', district: 'Pathanamthitta', popularity_score: 88, is_active: true, created_at: new Date().toISOString() },
  { id: '107', name: 'Konni', type: 'Town', district: 'Pathanamthitta', popularity_score: 82, is_active: true, created_at: new Date().toISOString() },
  { id: '108', name: 'Kottayam Town', type: 'City', district: 'Kottayam', popularity_score: 87, is_active: true, created_at: new Date().toISOString() },
  { id: '109', name: 'Kumarakom', type: 'Tourist Spot', district: 'Kottayam', popularity_score: 94, is_active: true, created_at: new Date().toISOString() },
  { id: '110', name: 'Kottayam Kumarakom', type: 'Backwater', district: 'Kottayam', popularity_score: 93, is_active: true, created_at: new Date().toISOString() },
  { id: '111', name: 'Thodupuzha', type: 'Town', district: 'Idukki', popularity_score: 85, is_active: true, created_at: new Date().toISOString() },
  { id: '112', name: 'Adimali', type: 'Town', district: 'Idukki', popularity_score: 82, is_active: true, created_at: new Date().toISOString() },
  { id: '113', name: 'Nedumkandam', type: 'Town', district: 'Idukki', popularity_score: 81, is_active: true, created_at: new Date().toISOString() },
  { id: '114', name: 'Painavu', type: 'Town', district: 'Idukki', popularity_score: 80, is_active: true, created_at: new Date().toISOString() },
  { id: '115', name: 'Muvattupuzha', type: 'Town', district: 'Ernakulam', popularity_score: 84, is_active: true, created_at: new Date().toISOString() },
  { id: '116', name: 'Perumbavoor', type: 'Town', district: 'Ernakulam', popularity_score: 85, is_active: true, created_at: new Date().toISOString() },
  { id: '117', name: 'Aluva', type: 'Town', district: 'Ernakulam', popularity_score: 87, is_active: true, created_at: new Date().toISOString() },
  { id: '118', name: 'Angamaly', type: 'Town', district: 'Ernakulam', popularity_score: 86, is_active: true, created_at: new Date().toISOString() },
  { id: '119', name: 'North Paravur', type: 'Town', district: 'Ernakulam', popularity_score: 84, is_active: true, created_at: new Date().toISOString() },
  { id: '120', name: 'Kothamangalam', type: 'Town', district: 'Ernakulam', popularity_score: 85, is_active: true, created_at: new Date().toISOString() },
  { id: '121', name: 'Kalamassery', type: 'Town', district: 'Ernakulam', popularity_score: 86, is_active: true, created_at: new Date().toISOString() },
  { id: '122', name: 'Edappally', type: 'Town', district: 'Ernakulam', popularity_score: 88, is_active: true, created_at: new Date().toISOString() },
  { id: '123', name: 'Tripunithura', type: 'Town', district: 'Ernakulam', popularity_score: 85, is_active: true, created_at: new Date().toISOString() },
  { id: '124', name: 'Vyttila', type: 'Town', district: 'Ernakulam', popularity_score: 87, is_active: true, created_at: new Date().toISOString() },
  { id: '125', name: 'Palarivattom', type: 'Town', district: 'Ernakulam', popularity_score: 86, is_active: true, created_at: new Date().toISOString() },
  { id: '126', name: 'Kakkanad', type: 'Town', district: 'Ernakulam', popularity_score: 89, is_active: true, created_at: new Date().toISOString() },
  { id: '127', name: 'Infopark', type: 'Tourist Spot', district: 'Ernakulam', popularity_score: 88, is_active: true, created_at: new Date().toISOString() },
  { id: '128', name: 'Smart City', type: 'Tourist Spot', district: 'Ernakulam', popularity_score: 87, is_active: true, created_at: new Date().toISOString() },
  { id: '129', name: 'Kochi Airport', type: 'Airport', district: 'Ernakulam', popularity_score: 92, is_active: true, created_at: new Date().toISOString() },
  { id: '130', name: 'Nedumbassery', type: 'Town', district: 'Ernakulam', popularity_score: 85, is_active: true, created_at: new Date().toISOString() },
  { id: '131', name: 'Chalakudy', type: 'Town', district: 'Thrissur', popularity_score: 86, is_active: true, created_at: new Date().toISOString() },
  { id: '132', name: 'Irinjalakuda', type: 'Town', district: 'Thrissur', popularity_score: 85, is_active: true, created_at: new Date().toISOString() },
  { id: '133', name: 'Kodungallur', type: 'Town', district: 'Thrissur', popularity_score: 84, is_active: true, created_at: new Date().toISOString() },
  { id: '134', name: 'Chavakkad', type: 'Town', district: 'Thrissur', popularity_score: 83, is_active: true, created_at: new Date().toISOString() },
  { id: '135', name: 'Wadakkanchery', type: 'Town', district: 'Thrissur', popularity_score: 82, is_active: true, created_at: new Date().toISOString() },
  { id: '136', name: 'Kunnamkulam', type: 'Town', district: 'Thrissur', popularity_score: 84, is_active: true, created_at: new Date().toISOString() },
  { id: '137', name: 'Ottapalam', type: 'Town', district: 'Palakkad', popularity_score: 84, is_active: true, created_at: new Date().toISOString() },
  { id: '138', name: 'Chittur', type: 'Town', district: 'Palakkad', popularity_score: 82, is_active: true, created_at: new Date().toISOString() },
  { id: '139', name: 'Mannarkkad', type: 'Town', district: 'Palakkad', popularity_score: 83, is_active: true, created_at: new Date().toISOString() },
  { id: '140', name: 'Pattambi', type: 'Town', district: 'Palakkad', popularity_score: 81, is_active: true, created_at: new Date().toISOString() },
  { id: '141', name: 'Shoranur', type: 'Town', district: 'Palakkad', popularity_score: 85, is_active: true, created_at: new Date().toISOString() },
  { id: '142', name: 'Tirur', type: 'Town', district: 'Malappuram', popularity_score: 85, is_active: true, created_at: new Date().toISOString() },
  { id: '143', name: 'Ponnani', type: 'Town', district: 'Malappuram', popularity_score: 84, is_active: true, created_at: new Date().toISOString() },
  { id: '144', name: 'Manjeri', type: 'Town', district: 'Malappuram', popularity_score: 86, is_active: true, created_at: new Date().toISOString() },
  { id: '145', name: 'Perinthalmanna', type: 'Town', district: 'Malappuram', popularity_score: 83, is_active: true, created_at: new Date().toISOString() },
  { id: '146', name: 'Nilambur', type: 'Town', district: 'Malappuram', popularity_score: 84, is_active: true, created_at: new Date().toISOString() },
  { id: '147', name: 'Kottakkal', type: 'Town', district: 'Malappuram', popularity_score: 85, is_active: true, created_at: new Date().toISOString() },
  { id: '148', name: 'Tanur', type: 'Town', district: 'Malappuram', popularity_score: 82, is_active: true, created_at: new Date().toISOString() },
  { id: '149', name: 'Parappanangadi', type: 'Town', district: 'Malappuram', popularity_score: 81, is_active: true, created_at: new Date().toISOString() },
  { id: '150', name: 'Kondotty', type: 'Town', district: 'Malappuram', popularity_score: 83, is_active: true, created_at: new Date().toISOString() },
  { id: '151', name: 'Vadakara', type: 'Town', district: 'Kozhikode', popularity_score: 85, is_active: true, created_at: new Date().toISOString() },
  { id: '152', name: 'Quilandy', type: 'Town', district: 'Kozhikode', popularity_score: 83, is_active: true, created_at: new Date().toISOString() },
  { id: '153', name: 'Perambra', type: 'Town', district: 'Kozhikode', popularity_score: 82, is_active: true, created_at: new Date().toISOString() },
  { id: '154', name: 'Balussery', type: 'Town', district: 'Kozhikode', popularity_score: 81, is_active: true, created_at: new Date().toISOString() },
  { id: '155', name: 'Feroke', type: 'Town', district: 'Kozhikode', popularity_score: 84, is_active: true, created_at: new Date().toISOString() },
  { id: '156', name: 'Ramanattukara', type: 'Town', district: 'Kozhikode', popularity_score: 85, is_active: true, created_at: new Date().toISOString() },
  { id: '157', name: 'Koyilandy', type: 'Town', district: 'Kozhikode', popularity_score: 83, is_active: true, created_at: new Date().toISOString() },
  { id: '158', name: 'Mukkam', type: 'Town', district: 'Kozhikode', popularity_score: 82, is_active: true, created_at: new Date().toISOString() },
  { id: '159', name: 'Koduvally', type: 'Town', district: 'Kozhikode', popularity_score: 81, is_active: true, created_at: new Date().toISOString() },
  { id: '160', name: 'Thamarassery', type: 'Town', district: 'Kozhikode', popularity_score: 84, is_active: true, created_at: new Date().toISOString() },
  { id: '161', name: 'Thiruvambady', type: 'Town', district: 'Kozhikode', popularity_score: 82, is_active: true, created_at: new Date().toISOString() },
  { id: '162', name: 'Mananthavady', type: 'Town', district: 'Wayanad', popularity_score: 83, is_active: true, created_at: new Date().toISOString() },
  { id: '163', name: 'Panamaram', type: 'Town', district: 'Wayanad', popularity_score: 81, is_active: true, created_at: new Date().toISOString() },
  { id: '164', name: 'Vythiri', type: 'Town', district: 'Wayanad', popularity_score: 86, is_active: true, created_at: new Date().toISOString() },
  { id: '165', name: 'Meenangadi', type: 'Town', district: 'Wayanad', popularity_score: 80, is_active: true, created_at: new Date().toISOString() },
  { id: '166', name: 'Padinharathara', type: 'Town', district: 'Wayanad', popularity_score: 79, is_active: true, created_at: new Date().toISOString() },
  { id: '167', name: 'Ambalavayal', type: 'Town', district: 'Wayanad', popularity_score: 81, is_active: true, created_at: new Date().toISOString() },
  { id: '168', name: 'Thaliparamba', type: 'Town', district: 'Kannur', popularity_score: 84, is_active: true, created_at: new Date().toISOString() },
  { id: '169', name: 'Payyanur', type: 'Town', district: 'Kannur', popularity_score: 85, is_active: true, created_at: new Date().toISOString() },
  { id: '170', name: 'Iritty', type: 'Town', district: 'Kannur', popularity_score: 82, is_active: true, created_at: new Date().toISOString() },
  { id: '171', name: 'Mattannur', type: 'Town', district: 'Kannur', popularity_score: 83, is_active: true, created_at: new Date().toISOString() },
  { id: '172', name: 'Sreekandapuram', type: 'Town', district: 'Kannur', popularity_score: 81, is_active: true, created_at: new Date().toISOString() },
  { id: '173', name: 'Cherukunnu', type: 'Town', district: 'Kannur', popularity_score: 80, is_active: true, created_at: new Date().toISOString() },
  { id: '174', name: 'Kuthuparamba', type: 'Town', district: 'Kannur', popularity_score: 82, is_active: true, created_at: new Date().toISOString() },
  { id: '175', name: 'Panoor', type: 'Town', district: 'Kannur', popularity_score: 81, is_active: true, created_at: new Date().toISOString() },
  { id: '176', name: 'Peringome', type: 'Town', district: 'Kannur', popularity_score: 80, is_active: true, created_at: new Date().toISOString() },
  { id: '177', name: 'Cherupuzha', type: 'Town', district: 'Kannur', popularity_score: 79, is_active: true, created_at: new Date().toISOString() },
  { id: '178', name: 'Udma', type: 'Town', district: 'Kasaragod', popularity_score: 80, is_active: true, created_at: new Date().toISOString() },
  { id: '179', name: 'Vellarikundu', type: 'Town', district: 'Kasaragod', popularity_score: 79, is_active: true, created_at: new Date().toISOString() },
  { id: '180', name: 'Cheruvathur', type: 'Town', district: 'Kasaragod', popularity_score: 80, is_active: true, created_at: new Date().toISOString() },
  { id: '181', name: 'Uppala', type: 'Town', district: 'Kasaragod', popularity_score: 81, is_active: true, created_at: new Date().toISOString() },
  { id: '182', name: 'Manjeshwar', type: 'Town', district: 'Kasaragod', popularity_score: 82, is_active: true, created_at: new Date().toISOString() },
  { id: '183', name: 'Uliyathadka', type: 'Town', district: 'Kasaragod', popularity_score: 78, is_active: true, created_at: new Date().toISOString() },
  { id: '184', name: 'Kumbla', type: 'Town', district: 'Kasaragod', popularity_score: 80, is_active: true, created_at: new Date().toISOString() },
  { id: '185', name: 'Mogral Puthur', type: 'Town', district: 'Kasaragod', popularity_score: 79, is_active: true, created_at: new Date().toISOString() },
  { id: '186', name: 'Kasargod Town', type: 'City', district: 'Kasaragod', popularity_score: 84, is_active: true, created_at: new Date().toISOString() },
  { id: '187', name: 'Cheruvathur', type: 'Town', district: 'Kasaragod', popularity_score: 80, is_active: true, created_at: new Date().toISOString() },
  { id: '188', name: 'Nileshwar', type: 'Town', district: 'Kasaragod', popularity_score: 81, is_active: true, created_at: new Date().toISOString() },
  { id: '189', name: 'Trikaripur', type: 'Town', district: 'Kasaragod', popularity_score: 79, is_active: true, created_at: new Date().toISOString() },
  { id: '190', name: 'Payyannur', type: 'Town', district: 'Kannur', popularity_score: 84, is_active: true, created_at: new Date().toISOString() },
  { id: '191', name: 'Rajapuram', type: 'Town', district: 'Kasaragod', popularity_score: 78, is_active: true, created_at: new Date().toISOString() },
  { id: '192', name: 'Bandadka', type: 'Town', district: 'Kasaragod', popularity_score: 77, is_active: true, created_at: new Date().toISOString() },
  { id: '193', name: 'Badiadka', type: 'Town', district: 'Kasaragod', popularity_score: 78, is_active: true, created_at: new Date().toISOString() },
  { id: '194', name: 'Mulleria', type: 'Town', district: 'Kasaragod', popularity_score: 79, is_active: true, created_at: new Date().toISOString() },
  { id: '195', name: 'Karadka', type: 'Town', district: 'Kasaragod', popularity_score: 77, is_active: true, created_at: new Date().toISOString() },
  { id: '196', name: 'Thayyeni', type: 'Town', district: 'Kasaragod', popularity_score: 76, is_active: true, created_at: new Date().toISOString() },
  { id: '197', name: 'Vellarikundu', type: 'Town', district: 'Kasaragod', popularity_score: 78, is_active: true, created_at: new Date().toISOString() },
  { id: '198', name: 'East Eleri', type: 'Town', district: 'Kasaragod', popularity_score: 76, is_active: true, created_at: new Date().toISOString() },
  { id: '199', name: 'West Eleri', type: 'Town', district: 'Kasaragod', popularity_score: 76, is_active: true, created_at: new Date().toISOString() },
  { id: '200', name: 'Cheemeni', type: 'Town', district: 'Kasaragod', popularity_score: 77, is_active: true, created_at: new Date().toISOString() },
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
