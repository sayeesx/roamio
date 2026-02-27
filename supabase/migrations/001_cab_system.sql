-- ============================================================================
-- Roamio Cab Booking System - Complete Database Schema
-- Location: Kerala, India
-- ============================================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================================================
-- 1. DRIVERS TABLE
-- ============================================================================
CREATE TABLE IF NOT EXISTS drivers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    
    -- Personal Details
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    full_name VARCHAR(201) GENERATED ALWAYS AS (first_name || ' ' || last_name) STORED,
    
    -- Contact Information
    phone VARCHAR(15) NOT NULL UNIQUE,
    email VARCHAR(255) UNIQUE,
    whatsapp VARCHAR(15),
    
    -- License Details
    license_number VARCHAR(50) NOT NULL UNIQUE,
    license_expiry DATE NOT NULL,
    license_type VARCHAR(20) DEFAULT 'LMV', -- LMV, HGV, etc.
    
    -- Professional Info
    years_of_experience INTEGER DEFAULT 0 CHECK (years_of_experience >= 0),
    rating DECIMAL(2,1) DEFAULT 4.0 CHECK (rating >= 1.0 AND rating <= 5.0),
    total_trips INTEGER DEFAULT 0 CHECK (total_trips >= 0),
    
    -- Availability & Location
    is_available BOOLEAN DEFAULT true,
    current_city VARCHAR(100) NOT NULL,
    operating_cities TEXT[] DEFAULT '{}', -- Array of cities they operate in
    
    -- Profile
    profile_image_url TEXT DEFAULT 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop',
    bio TEXT,
    languages TEXT[] DEFAULT '{"English", "Malayalam"}',
    
    -- Verification Status
    is_verified BOOLEAN DEFAULT false,
    is_background_checked BOOLEAN DEFAULT false,
    
    -- Metadata
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for drivers
CREATE INDEX IF NOT EXISTS idx_drivers_city ON drivers(current_city);
CREATE INDEX IF NOT EXISTS idx_drivers_available ON drivers(is_available) WHERE is_available = true;
CREATE INDEX IF NOT EXISTS idx_drivers_rating ON drivers(rating DESC);

-- ============================================================================
-- 2. VEHICLES TABLE
-- ============================================================================
CREATE TABLE IF NOT EXISTS vehicles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    
    -- Vehicle Details
    brand VARCHAR(50) NOT NULL,
    model VARCHAR(100) NOT NULL,
    year INTEGER NOT NULL CHECK (year >= 2000 AND year <= EXTRACT(YEAR FROM CURRENT_DATE) + 1),
    
    -- Registration
    registration_number VARCHAR(20) NOT NULL UNIQUE,
    registration_state VARCHAR(2) DEFAULT 'KL', -- KL for Kerala
    
    -- Specifications
    fuel_type VARCHAR(20) NOT NULL CHECK (fuel_type IN ('Petrol', 'Diesel', 'CNG', 'Electric', 'Hybrid')),
    seating_capacity INTEGER NOT NULL CHECK (seating_capacity >= 2 AND seating_capacity <= 20),
    has_ac BOOLEAN DEFAULT true,
    vehicle_type VARCHAR(30) NOT NULL CHECK (vehicle_type IN ('Hatchback', 'Sedan', 'SUV', 'MUV', 'Luxury', 'Tempo Traveller')),
    
    -- Images
    primary_image_url TEXT DEFAULT 'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=600&h=400&fit=crop',
    additional_images TEXT[] DEFAULT '{}',
    
    -- Status
    is_active BOOLEAN DEFAULT true,
    
    -- Metadata
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for vehicles
CREATE INDEX IF NOT EXISTS idx_vehicles_type ON vehicles(vehicle_type);
CREATE INDEX IF NOT EXISTS idx_vehicles_capacity ON vehicles(seating_capacity);
CREATE INDEX IF NOT EXISTS idx_vehicles_active ON vehicles(is_active) WHERE is_active = true;

-- ============================================================================
-- 3. DRIVER-VEHICLE RELATIONSHIP (Many-to-Many)
-- ============================================================================
CREATE TABLE IF NOT EXISTS driver_vehicles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    driver_id UUID NOT NULL REFERENCES drivers(id) ON DELETE CASCADE,
    vehicle_id UUID NOT NULL REFERENCES vehicles(id) ON DELETE CASCADE,
    is_primary BOOLEAN DEFAULT false, -- Primary vehicle for the driver
    price_per_km DECIMAL(6,2) NOT NULL DEFAULT 15.00 CHECK (price_per_km > 0),
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    UNIQUE(driver_id, vehicle_id)
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_driver_vehicles_driver ON driver_vehicles(driver_id);
CREATE INDEX IF NOT EXISTS idx_driver_vehicles_vehicle ON driver_vehicles(vehicle_id);

-- ============================================================================
-- 4. LOCATIONS TABLE (Kerala Cities & Tourist Spots)
-- ============================================================================
CREATE TABLE IF NOT EXISTS locations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(100) NOT NULL,
    name_ml VARCHAR(100), -- Malayalam name
    type VARCHAR(30) NOT NULL CHECK (type IN ('City', 'Town', 'Tourist Spot', 'Airport', 'Railway Station', 'Beach', 'Hill Station', 'Backwater')),
    district VARCHAR(50) NOT NULL,
    
    -- Coordinates (for future geocoding)
    latitude DECIMAL(10, 8),
    longitude DECIMAL(11, 8),
    
    -- Popularity for search ranking
    popularity_score INTEGER DEFAULT 0,
    
    -- Metadata
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_locations_type ON locations(type);
CREATE INDEX IF NOT EXISTS idx_locations_district ON locations(district);
CREATE INDEX IF NOT EXISTS idx_locations_popularity ON locations(popularity_score DESC);
CREATE INDEX IF NOT EXISTS idx_locations_name_search ON locations USING gin(to_tsvector('english', name));

-- ============================================================================
-- 5. CAB BOOKINGS TABLE
-- ============================================================================
CREATE TABLE IF NOT EXISTS cab_bookings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    
    -- Booking Reference
    booking_reference VARCHAR(20) UNIQUE NOT NULL,
    
    -- Customer Details
    customer_name VARCHAR(200) NOT NULL,
    customer_phone VARCHAR(15) NOT NULL,
    customer_email VARCHAR(255),
    
    -- Trip Details
    pickup_location_id UUID REFERENCES locations(id),
    pickup_address TEXT NOT NULL,
    drop_location_id UUID REFERENCES locations(id),
    drop_address TEXT NOT NULL,
    
    -- Date & Time
    pickup_date DATE NOT NULL,
    pickup_time TIME NOT NULL,
    
    -- Distance & Pricing
    estimated_distance_km DECIMAL(8,2),
    base_fare DECIMAL(10,2) NOT NULL,
    total_fare DECIMAL(10,2) NOT NULL,
    
    -- Assigned Driver
    driver_id UUID REFERENCES drivers(id),
    driver_vehicle_id UUID REFERENCES driver_vehicles(id),
    
    -- Status Tracking
    status VARCHAR(30) DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'driver_assigned', 'in_progress', 'completed', 'cancelled')),
    
    -- Additional Requirements
    trip_type VARCHAR(20) DEFAULT 'one_way' CHECK (trip_type IN ('one_way', 'round_trip', 'hourly_rental', 'outstation')),
    special_requests TEXT,
    luggage_count INTEGER DEFAULT 0,
    passenger_count INTEGER NOT NULL DEFAULT 1 CHECK (passenger_count >= 1 AND passenger_count <= 20),
    
    -- Payment
    payment_status VARCHAR(20) DEFAULT 'pending' CHECK (payment_status IN ('pending', 'paid', 'failed', 'refunded')),
    payment_method VARCHAR(30),
    
    -- Metadata
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    confirmed_at TIMESTAMP WITH TIME ZONE,
    completed_at TIMESTAMP WITH TIME ZONE
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_bookings_status ON cab_bookings(status);
CREATE INDEX IF NOT EXISTS idx_bookings_driver ON cab_bookings(driver_id);
CREATE INDEX IF NOT EXISTS idx_bookings_customer_phone ON cab_bookings(customer_phone);
CREATE INDEX IF NOT EXISTS idx_bookings_pickup_date ON cab_bookings(pickup_date);
CREATE INDEX IF NOT EXISTS idx_bookings_created ON cab_bookings(created_at DESC);

-- ============================================================================
-- 6. UPDATE TRIGGER FOR timestamps
-- ============================================================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Apply triggers
CREATE TRIGGER update_drivers_updated_at BEFORE UPDATE ON drivers
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_vehicles_updated_at BEFORE UPDATE ON vehicles
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_cab_bookings_updated_at BEFORE UPDATE ON cab_bookings
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================================================
-- 7. INSERT KERALA LOCATIONS (Popular Cities & Tourist Spots)
-- ============================================================================

INSERT INTO locations (name, name_ml, type, district, popularity_score) VALUES
-- Major Cities
('Kochi', 'കൊച്ചി', 'City', 'Ernakulam', 100),
('Thiruvananthapuram', 'തിരുവനന്തപുരം', 'City', 'Thiruvananthapuram', 95),
('Kozhikode', 'കോഴിക്കോട്', 'City', 'Kozhikode', 90),
('Thrissur', 'തൃശ്ശൂർ', 'City', 'Thrissur', 85),
('Kottayam', 'കോട്ടയം', 'City', 'Kottayam', 80),
('Alappuzha', 'ആലപ്പുഴ', 'City', 'Alappuzha', 85),
('Kollam', 'കൊല്ലം', 'City', 'Kollam', 75),
('Palakkad', 'പാലക്കാട്', 'City', 'Palakkad', 70),
('Malappuram', 'മലപ്പുറം', 'City', 'Malappuram', 65),
('Kannur', 'കണ്ണൂർ', 'City', 'Kannur', 70),
('Kasaragod', 'കാസർഗോഡ്', 'City', 'Kasaragod', 55),
('Pathanamthitta', 'പത്തനംതിട്ട', 'City', 'Pathanamthitta', 60),
('Idukki', 'ഇടുക്കി', 'City', 'Idukki', 65),
('Wayanad', 'വയനാട്', 'City', 'Wayanad', 75),
('Ernakulam', 'എറണാകുളം', 'City', 'Ernakulam', 88),

-- Tourist Spots - Hill Stations
('Munnar', 'മൂന്നാർ', 'Hill Station', 'Idukki', 98),
('Wayanad Hills', 'വയനാട്', 'Hill Station', 'Wayanad', 90),
('Thekkady', 'തേക്കടി', 'Hill Station', 'Idukki', 88),
('Vagamon', 'വാഗമൺ', 'Hill Station', 'Idukki', 75),
('Ponmudi', 'പൊന്മുടി', 'Hill Station', 'Thiruvananthapuram', 70),
('Nelliampathy', 'നെല്ലിയാമ്പതി', 'Hill Station', 'Palakkad', 65),

-- Tourist Spots - Beaches
('Kovalam Beach', 'കോവളം', 'Beach', 'Thiruvananthapuram', 95),
('Varkala Beach', 'വർക്കല', 'Beach', 'Thiruvananthapuram', 90),
('Cherai Beach', 'ചെറായി', 'Beach', 'Ernakulam', 80),
('Marari Beach', 'മരാരി', 'Beach', 'Alappuzha', 85),
('Bekal Beach', 'ബേക്കൽ', 'Beach', 'Kasaragod', 75),
('Kappad Beach', 'കപ്പാട്', 'Beach', 'Kozhikode', 70),
('Fort Kochi Beach', 'ഫോർട്ട് കൊച്ചി', 'Beach', 'Ernakulam', 85),

-- Tourist Spots - Backwaters
('Alleppey Backwaters', 'ആലപ്പുഴ കായലുകൾ', 'Backwater', 'Alappuzha', 95),
('Kumarakom', 'കുമരകം', 'Backwater', 'Kottayam', 90),
('Ashtamudi Lake', 'അഷ്ടമുടി കായൽ', 'Backwater', 'Kollam', 80),
('Poovar Island', 'പൂവാർ', 'Backwater', 'Thiruvananthapuram', 75),

-- Other Popular Tourist Spots
('Guruvayur', 'ഗുരുവായൂർ', 'Tourist Spot', 'Thrissur', 92),
('Sabarimala', 'ശബരിമല', 'Tourist Spot', 'Pathanamthitta', 88),
('Athirappilly Falls', 'അതിരപ്പിള്ളി', 'Tourist Spot', 'Thrissur', 85),
('Silent Valley', 'സൈലന്റ് വാലി', 'Tourist Spot', 'Palakkad', 70),
('Parambikulam', 'പറമ്പിക്കുളം', 'Tourist Spot', 'Palakkad', 65),
('Thattekad Bird Sanctuary', 'തട്ടേക്കാട്', 'Tourist Spot', 'Ernakulam', 60),
('Periyar Wildlife Sanctuary', 'പെരിയാർ', 'Tourist Spot', 'Idukki', 88),

-- Airports
('Cochin International Airport', 'കൊച്ചി അന്താരാഷ്ട്ര വിമാനത്താവളം', 'Airport', 'Ernakulam', 100),
('Trivandrum International Airport', 'തിരുവനന്തപുരം അന്താരാഷ്ട്ര വിമാനത്താവളം', 'Airport', 'Thiruvananthapuram', 95),
('Calicut International Airport', 'കോഴിക്കോട് അന്താരാഷ്ട്ര വിമാനത്താവളം', 'Airport', 'Kozhikode', 90),
('Kannur International Airport', 'കണ്ണൂർ അന്താരാഷ്ട്ര വിമാനത്താവളം', 'Airport', 'Kannur', 80),

-- Railway Stations
('Ernakulam Junction', 'എറണാകുളം ജങ്ഷൻ', 'Railway Station', 'Ernakulam', 90),
('Kottayam Railway Station', 'കോട്ടയം റെയിൽവേ സ്റ്റേഷൻ', 'Railway Station', 'Kottayam', 75),
('Alappuzha Railway Station', 'ആലപ്പുഴ റെയിൽവേ സ്റ്റേഷൻ', 'Railway Station', 'Alappuzha', 70),
('Thrissur Railway Station', 'തൃശ്ശൂർ റെയിൽവേ സ്റ്റേഷൻ', 'Railway Station', 'Thrissur', 75),
('Kozhikode Railway Station', 'കോഴിക്കോട് റെയിൽവേ സ്റ്റേഷൻ', 'Railway Station', 'Kozhikode', 80)
ON CONFLICT DO NOTHING;

-- ============================================================================
-- 8. INSERT DUMMY DRIVERS (Kerala-based, Realistic Data)
-- ============================================================================

INSERT INTO drivers (first_name, last_name, phone, email, license_number, license_expiry, license_type, years_of_experience, rating, total_trips, current_city, operating_cities, bio, languages, is_verified, is_background_checked, profile_image_url) VALUES
('Rajesh', 'Nair', '+91-98471-12345', 'rajesh.nair@email.com', 'KL-42-2018-0012345', '2028-05-15', 'LMV', 8, 4.8, 2847, 'Kochi', '{"Kochi", "Ernakulam", "Alappuzha", "Kottayam"}', 'Professional driver with 8 years of experience. Expert in Kerala routes and tourist destinations. Fluent in English, Malayalam, and Tamil.', '{"English", "Malayalam", "Tamil"}', true, true, 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&crop=face'),
('Suresh', 'Kumar', '+91-98471-23456', 'suresh.k@email.com', 'KL-01-2019-0023456', '2029-08-20', 'LMV', 6, 4.6, 1923, 'Thiruvananthapuram', '{"Thiruvananthapuram", "Kollam", "Kovalam", "Varkala"}', 'Reliable driver specializing in South Kerala routes. Known for punctuality and safe driving.', '{"English", "Malayalam"}', true, true, 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=400&fit=crop&crop=face'),
('Vijay', 'Menon', '+91-98471-34567', 'vijay.menon@email.com', 'KL-32-2017-0034567', '2027-11-10', 'LMV', 10, 4.9, 4521, 'Kozhikode', '{"Kozhikode", "Kannur", "Wayanad", "Kasaragod"}', 'Experienced driver with extensive knowledge of Malabar region. Perfect for Wayanad and hill station trips.', '{"English", "Malayalam", "Hindi"}', true, true, 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop&crop=face'),
('Anil', 'Pillai', '+91-98471-45678', 'anil.pillai@email.com', 'KL-15-2020-0045678', '2030-03-25', 'LMV', 4, 4.5, 1287, 'Thrissur', '{"Thrissur", "Palakkad", "Guruvayur", "Athirappilly"}', 'Friendly driver specializing in cultural and temple tours. Expert in Thrissur and nearby destinations.', '{"English", "Malayalam", "Tamil"}', true, true, 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400&h=400&fit=crop&crop=face'),
('Mohammed', 'Ali', '+91-98471-56789', 'mohammed.ali@email.com', 'KL-05-2016-0056789', '2026-09-12', 'HGV', 12, 4.7, 5634, 'Kottayam', '{"Kottayam", "Alappuzha", "Kumarakom", "Thekkady"}', 'Professional driver with heavy vehicle license. Specializes in group tours and backwater trips.', '{"English", "Malayalam", "Arabic"}', true, true, 'https://images.unsplash.com/photo-1519345182560-3f2917c472ef?w=400&h=400&fit=crop&crop=face'),
('Sanjay', 'Krishnan', '+91-98471-67890', 'sanjay.k@email.com', 'KL-07-2018-0067890', '2028-07-08', 'LMV', 7, 4.4, 2156, 'Munnar', '{"Munnar", "Idukki", "Thekkady", "Kochi"}', 'Hill driving expert. Perfect for Munnar and Thekkady trips. Knowledgeable about tea estates.', '{"English", "Malayalam", "Tamil"}', true, true, 'https://images.unsplash.com/photo-1463453091185-61582044d556?w=400&h=400&fit=crop&crop=face'),
('Prakash', 'Unni', '+91-98471-78901', 'prakash.unni@email.com', 'KL-11-2019-0078901', '2029-12-01', 'LMV', 5, 4.3, 1654, 'Alappuzha', '{"Alappuzha", "Kollam", "Kottayam", "Kochi"}', 'Backwater tour specialist. Expert in Alleppey routes and houseboat coordination.', '{"English", "Malayalam"}', true, true, 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=400&h=400&fit=crop&crop=face'),
('Thomas', 'George', '+91-98471-89012', 'thomas.george@email.com', 'KL-08-2015-0089012', '2025-04-18', 'LMV', 15, 4.9, 8234, 'Kochi', '{"Kochi", "Ernakulam", "Thrissur", "Munnar", "Thekkady"}', 'Veteran driver with 15 years experience. Premium service for corporate and NRI clients.', '{"English", "Malayalam", "Hindi", "Tamil"}', true, true, 'https://images.unsplash.com/photo-1566492031773-4f4e44671857?w=400&h=400&fit=crop&crop=face'),
('Faisal', 'Hassan', '+91-98471-90123', 'faisal.h@email.com', 'KL-13-2020-0090123', '2030-06-22', 'LMV', 4, 4.2, 987, 'Kannur', '{"Kannur", "Kasaragod", "Kozhikode", "Wayanad"}', 'Young and energetic driver. Great for long distance trips to North Kerala.', '{"English", "Malayalam", "Hindi"}', true, true, 'https://images.unsplash.com/photo-1504257432389-52343af06ae3?w=400&h=400&fit=crop&crop=face'),
('Gopal', 'Nambiar', '+91-98471-01234', 'gopal.n@email.com', 'KL-03-2017-0001234', '2027-10-05', 'LMV', 9, 4.7, 3421, 'Wayanad', '{"Wayanad", "Kozhikode", "Mysore", "Ooty"}', 'Expert hill driver for Wayanad and nearby destinations. Cross-border experience to Karnataka and Tamil Nadu.', '{"English", "Malayalam", "Kannada", "Tamil"}', true, true, 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=400&h=400&fit=crop&crop=face'),
('Ramesh', 'Iyer', '+91-98472-12345', 'ramesh.i@email.com', 'KL-22-2018-0112345', '2028-02-14', 'LMV', 6, 4.5, 1876, 'Kollam', '{"Kollam", "Thiruvananthapuram", "Varkala", "Ponmudi"}', 'South Kerala specialist. Expert in beach and backwater routes.', '{"English", "Malayalam", "Tamil"}', true, true, 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=400&fit=crop&crop=face'),
('Shaji', 'Mathew', '+91-98472-23456', 'shaji.m@email.com', 'KL-33-2016-0123456', '2026-08-30', 'HGV', 11, 4.6, 4892, 'Kochi', '{"Kochi", "Ernakulam", "Thrissur", "Kottayam", "Alappuzha"}', 'Group tour specialist with tempo traveller experience. Perfect for family trips.', '{"English", "Malayalam", "Hindi"}', true, true, 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&crop=face');

-- ============================================================================
-- 9. INSERT VEHICLES (Popular Models in Kerala)
-- ============================================================================

INSERT INTO vehicles (brand, model, year, registration_number, registration_state, fuel_type, seating_capacity, has_ac, vehicle_type, primary_image_url) VALUES
('Maruti Suzuki', 'Swift Dzire', 2022, 'KL-07-AB-1234', 'KL', 'Petrol', 4, true, 'Sedan', 'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=600&h=400&fit=crop'),
('Toyota', 'Innova Crysta', 2023, 'KL-42-BC-5678', 'KL', 'Diesel', 7, true, 'MUV', 'https://images.unsplash.com/photo-1617788138017-80ad40651399?w=600&h=400&fit=crop'),
('Maruti Suzuki', 'Ertiga', 2022, 'KL-01-CD-9012', 'KL', 'Petrol', 7, true, 'MUV', 'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=600&h=400&fit=crop'),
('Hyundai', 'Creta', 2023, 'KL-32-DE-3456', 'KL', 'Diesel', 5, true, 'SUV', 'https://images.unsplash.com/photo-1606016159991-dfe4f2746ad5?w=600&h=400&fit=crop'),
('Honda', 'City', 2022, 'KL-15-EF-7890', 'KL', 'Petrol', 4, true, 'Sedan', 'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=600&h=400&fit=crop'),
('Toyota', 'Fortuner', 2023, 'KL-05-GH-1234', 'KL', 'Diesel', 7, true, 'SUV', 'https://images.unsplash.com/photo-1606016159991-dfe4f2746ad5?w=600&h=400&fit=crop'),
('Mahindra', 'XUV700', 2023, 'KL-07-IJ-5678', 'KL', 'Diesel', 7, true, 'SUV', 'https://images.unsplash.com/photo-1606016159991-dfe4f2746ad5?w=600&h=400&fit=crop'),
('Maruti Suzuki', 'Swift', 2021, 'KL-11-KL-9012', 'KL', 'Petrol', 4, true, 'Hatchback', 'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=600&h=400&fit=crop'),
('Mercedes-Benz', 'E-Class', 2022, 'KL-08-MN-3456', 'KL', 'Diesel', 4, true, 'Luxury', 'https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?w=600&h=400&fit=crop'),
('Force', 'Traveller', 2021, 'KL-13-OP-7890', 'KL', 'Diesel', 12, true, 'Tempo Traveller', 'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=600&h=400&fit=crop'),
('Tata', 'Nexon EV', 2023, 'KL-42-QR-1234', 'KL', 'Electric', 5, true, 'SUV', 'https://images.unsplash.com/photo-1593941707882-a5bba14938c7?w=600&h=400&fit=crop'),
('Kia', 'Carens', 2023, 'KL-03-ST-5678', 'KL', 'Diesel', 7, true, 'MUV', 'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=600&h=400&fit=crop'),
('Toyota', 'Camry', 2022, 'KL-22-UV-9012', 'KL', 'Hybrid', 4, true, 'Luxury', 'https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?w=600&h=400&fit=crop'),
('Mahindra', 'Marazzo', 2022, 'KL-33-WX-3456', 'KL', 'Diesel', 8, true, 'MUV', 'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=600&h=400&fit=crop'),
('Maruti Suzuki', 'Eeco', 2021, 'KL-05-YZ-7890', 'KL', 'CNG', 7, false, 'MUV', 'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=600&h=400&fit=crop');

-- ============================================================================
-- 10. LINK DRIVERS TO VEHICLES (driver_vehicles junction table)
-- ============================================================================

-- Get driver IDs and vehicle IDs for linking (using subqueries for demo data)
WITH driver_ids AS (SELECT id, first_name FROM drivers ORDER BY first_name),
     vehicle_ids AS (SELECT id, brand, model FROM vehicles ORDER BY brand, model)

INSERT INTO driver_vehicles (driver_id, vehicle_id, is_primary, price_per_km)
SELECT d.id, v.id, true, 
    CASE 
        WHEN v.vehicle_type = 'Luxury' THEN 35.00
        WHEN v.vehicle_type = 'SUV' THEN 25.00
        WHEN v.vehicle_type = 'MUV' AND v.seating_capacity > 7 THEN 30.00
        WHEN v.vehicle_type = 'MUV' THEN 22.00
        WHEN v.vehicle_type = 'Tempo Traveller' THEN 40.00
        ELSE 18.00
    END
FROM (SELECT id, ROW_NUMBER() OVER (ORDER BY first_name) as rn FROM drivers) d
JOIN (SELECT id, vehicle_type, seating_capacity, ROW_NUMBER() OVER (ORDER BY brand, model) as rn FROM vehicles) v
ON d.rn = v.rn;

-- Add secondary vehicles for some drivers
INSERT INTO driver_vehicles (driver_id, vehicle_id, is_primary, price_per_km)
SELECT d.id, v.id, false, 20.00
FROM drivers d, vehicles v
WHERE d.first_name = 'Rajesh' AND v.brand = 'Maruti Suzuki' AND v.model = 'Ertiga'
AND NOT EXISTS (SELECT 1 FROM driver_vehicles WHERE driver_id = d.id AND vehicle_id = v.id);

-- ============================================================================
-- 11. CREATE USEFUL VIEWS
-- ============================================================================

-- View: Available drivers with their primary vehicle
CREATE OR REPLACE VIEW available_drivers_with_vehicles AS
SELECT 
    d.id as driver_id,
    d.full_name,
    d.rating,
    d.total_trips,
    d.years_of_experience,
    d.current_city,
    d.profile_image_url,
    d.languages,
    v.id as vehicle_id,
    v.brand,
    v.model,
    v.vehicle_type,
    v.fuel_type,
    v.seating_capacity,
    v.has_ac,
    v.primary_image_url as vehicle_image,
    dv.price_per_km
FROM drivers d
JOIN driver_vehicles dv ON d.id = dv.driver_id
JOIN vehicles v ON dv.vehicle_id = v.id
WHERE d.is_available = true 
  AND d.is_verified = true
  AND v.is_active = true
  AND dv.is_primary = true;

-- View: Driver stats by city
CREATE OR REPLACE VIEW driver_stats_by_city AS
SELECT 
    current_city,
    COUNT(*) as total_drivers,
    COUNT(*) FILTER (WHERE is_available) as available_drivers,
    AVG(rating) as avg_rating,
    SUM(total_trips) as total_trips_completed
FROM drivers
WHERE is_verified = true
GROUP BY current_city;

-- ============================================================================
-- 12. ENABLE ROW LEVEL SECURITY (RLS) POLICIES
-- ============================================================================

-- Enable RLS on tables
ALTER TABLE drivers ENABLE ROW LEVEL SECURITY;
ALTER TABLE vehicles ENABLE ROW LEVEL SECURITY;
ALTER TABLE driver_vehicles ENABLE ROW LEVEL SECURITY;
ALTER TABLE cab_bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE locations ENABLE ROW LEVEL SECURITY;

-- Public can read locations
CREATE POLICY locations_read_public ON locations
    FOR SELECT TO PUBLIC USING (true);

-- Drivers and vehicles are publicly readable (for booking interface)
CREATE POLICY drivers_read_public ON drivers
    FOR SELECT TO PUBLIC USING (is_verified = true);

CREATE POLICY vehicles_read_public ON vehicles
    FOR SELECT TO PUBLIC USING (is_active = true);

CREATE POLICY driver_vehicles_read_public ON driver_vehicles
    FOR SELECT TO PUBLIC USING (true);

-- Bookings: users can read their own bookings
CREATE POLICY bookings_read_own ON cab_bookings
    FOR SELECT TO PUBLIC USING (true);

-- ============================================================================
-- SCHEMA COMPLETE
-- ============================================================================
