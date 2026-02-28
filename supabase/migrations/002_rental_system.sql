-- ============================================================================
-- VEHICLE RENTAL SYSTEM SCHEMA
-- For self-drive car, bike, and bicycle rentals
-- ============================================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================================================
-- VEHICLES TABLE (Rental Fleet)
-- ============================================================================
CREATE TABLE rental_vehicles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    
    -- Vehicle Identification
    vehicle_code VARCHAR(20) UNIQUE NOT NULL, -- e.g., ROM-CAR-001, ROM-BIKE-001
    name VARCHAR(100) NOT NULL, -- e.g., "Maruti Swift", "Honda Activa"
    brand VARCHAR(50) NOT NULL, -- e.g., "Maruti", "Honda"
    model VARCHAR(50) NOT NULL, -- e.g., "Swift", "Activa 6G"
    
    -- Vehicle Type Classification
    vehicle_type VARCHAR(20) NOT NULL CHECK (vehicle_type IN ('car', 'bike', 'bicycle')),
    
    -- Vehicle Sub-type (more specific classification)
    vehicle_subtype VARCHAR(30) CHECK (vehicle_subtype IN (
        -- Cars
        'hatchback', 'sedan', 'suv', 'muv', 'luxury', 'compact_suv',
        -- Bikes
        'scooter', 'motorcycle', 'sports_bike', 'cruiser',
        -- Bicycles
        'mountain', 'road', 'hybrid', 'electric_bicycle', 'city'
    )),
    
    -- Fuel Type
    fuel_type VARCHAR(20) NOT NULL CHECK (fuel_type IN ('petrol', 'diesel', 'cng', 'electric')),
    
    -- Specifications
    seating_capacity INTEGER,
    engine_cc INTEGER, -- For bikes/cars
    transmission VARCHAR(20) CHECK (transmission IN ('manual', 'automatic', 'semi_automatic')),
    
    -- Images
    primary_image_url TEXT,
    gallery_images TEXT[], -- Array of image URLs
    
    -- Rental Pricing (in INR)
    price_per_hour INTEGER,
    price_per_day INTEGER NOT NULL,
    price_per_week INTEGER,
    price_per_month INTEGER,
    
    -- Deposit & Fees
    security_deposit INTEGER DEFAULT 0, -- Amount to be held as security
    late_return_fee_per_hour INTEGER DEFAULT 200,
    
    -- Features & Amenities
    features TEXT[], -- e.g., ['AC', 'Bluetooth', 'Power Steering', 'ABS']
    
    -- Availability
    is_available BOOLEAN DEFAULT true,
    total_quantity INTEGER DEFAULT 1, -- How many units of this vehicle
    available_quantity INTEGER DEFAULT 1,
    
    -- Location
    current_city VARCHAR(50) NOT NULL,
    pickup_location_id UUID REFERENCES locations(id),
    
    -- Vehicle Status
    status VARCHAR(20) DEFAULT 'available' CHECK (status IN ('available', 'rented', 'maintenance', 'retired')),
    last_service_date DATE,
    next_service_due DATE,
    
    -- Documentation
    registration_number VARCHAR(20),
    insurance_expiry DATE,
    pollution_certificate_expiry DATE,
    
    -- Metadata
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for rental_vehicles
CREATE INDEX idx_rental_vehicles_type ON rental_vehicles(vehicle_type);
CREATE INDEX idx_rental_vehicles_fuel ON rental_vehicles(fuel_type);
CREATE INDEX idx_rental_vehicles_city ON rental_vehicles(current_city);
CREATE INDEX idx_rental_vehicles_available ON rental_vehicles(is_available, status);
CREATE INDEX idx_rental_vehicles_subtype ON rental_vehicles(vehicle_subtype);

-- ============================================================================
-- RENTAL BOOKINGS TABLE
-- ============================================================================
CREATE TABLE rental_bookings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    
    -- Booking Reference
    booking_reference VARCHAR(30) UNIQUE NOT NULL, -- e.g., ROM-REN-ABC123
    
    -- Customer Details
    customer_name VARCHAR(100) NOT NULL,
    customer_phone VARCHAR(20) NOT NULL,
    customer_email VARCHAR(100),
    customer_address TEXT,
    
    -- Customer ID Proof
    id_proof_type VARCHAR(20) CHECK (id_proof_type IN ('aadhaar', 'driving_license', 'passport', 'voter_id')),
    id_proof_number VARCHAR(50),
    id_proof_verified BOOLEAN DEFAULT false,
    
    -- Driving License (required for cars/bikes)
    driving_license_number VARCHAR(30),
    driving_license_validity DATE,
    license_verified BOOLEAN DEFAULT false,
    
    -- Vehicle Details
    vehicle_id UUID NOT NULL REFERENCES rental_vehicles(id),
    
    -- Rental Period
    pickup_date DATE NOT NULL,
    pickup_time TIME NOT NULL,
    return_date DATE NOT NULL,
    return_time TIME NOT NULL,
    total_days INTEGER NOT NULL, -- Duration of rental in days
    
    -- Pickup & Return Location
    pickup_location_id UUID REFERENCES locations(id),
    return_location_id UUID REFERENCES locations(id),
    
    -- Pricing
    daily_rate INTEGER, -- Store the daily rate at time of booking
    base_rental_amount INTEGER NOT NULL, -- Calculated based on duration
    security_deposit INTEGER DEFAULT 0,
    additional_charges INTEGER DEFAULT 0, -- Late fees, damages, etc.
    discount_amount INTEGER DEFAULT 0,
    total_amount INTEGER NOT NULL,
    
    -- Payment Status
    payment_status VARCHAR(20) DEFAULT 'pending' CHECK (payment_status IN ('pending', 'partial', 'paid', 'refunded', 'failed')),
    amount_paid INTEGER DEFAULT 0,
    
    -- Booking Status
    status VARCHAR(20) DEFAULT 'confirmed' CHECK (status IN (
        'pending', 'confirmed', 'picked_up', 'active', 'returned', 
        'completed', 'cancelled', 'no_show'
    )),
    
    -- Special Requests
    special_requests TEXT,
    
    -- Timestamps for tracking
    booking_created_at TIMESTAMPTZ DEFAULT NOW(),
    confirmed_at TIMESTAMPTZ,
    picked_up_at TIMESTAMPTZ,
    returned_at TIMESTAMPTZ,
    completed_at TIMESTAMPTZ,
    cancelled_at TIMESTAMPTZ,
    cancellation_reason TEXT,
    
    -- Admin notes
    admin_notes TEXT,
    
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for rental_bookings
CREATE INDEX idx_rental_bookings_vehicle ON rental_bookings(vehicle_id);
CREATE INDEX idx_rental_bookings_customer ON rental_bookings(customer_phone);
CREATE INDEX idx_rental_bookings_dates ON rental_bookings(pickup_date, return_date);
CREATE INDEX idx_rental_bookings_status ON rental_bookings(status);
CREATE INDEX idx_rental_bookings_reference ON rental_bookings(booking_reference);

-- ============================================================================
-- RENTAL RATINGS & REVIEWS
-- ============================================================================
CREATE TABLE rental_reviews (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    booking_id UUID NOT NULL REFERENCES rental_bookings(id),
    vehicle_id UUID NOT NULL REFERENCES rental_vehicles(id),
    
    -- Ratings (1-5)
    vehicle_condition_rating INTEGER CHECK (vehicle_condition_rating BETWEEN 1 AND 5),
    cleanliness_rating INTEGER CHECK (cleanliness_rating BETWEEN 1 AND 5),
    pickup_process_rating INTEGER CHECK (pickup_process_rating BETWEEN 1 AND 5),
    value_for_money_rating INTEGER CHECK (value_for_money_rating BETWEEN 1 AND 5),
    overall_rating INTEGER CHECK (overall_rating BETWEEN 1 AND 5),
    
    -- Review Content
    review_title VARCHAR(100),
    review_text TEXT,
    would_recommend BOOLEAN,
    
    -- Admin Response
    admin_response TEXT,
    admin_response_at TIMESTAMPTZ,
    
    -- Status
    is_published BOOLEAN DEFAULT true,
    is_verified BOOLEAN DEFAULT false, -- Verified that customer actually rented
    
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_rental_reviews_vehicle ON rental_reviews(vehicle_id);
CREATE INDEX idx_rental_reviews_rating ON rental_reviews(overall_rating);

-- ============================================================================
-- VEHICLE MAINTENANCE LOGS
-- ============================================================================
CREATE TABLE vehicle_maintenance_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    vehicle_id UUID NOT NULL REFERENCES rental_vehicles(id),
    
    maintenance_type VARCHAR(30) NOT NULL, -- 'service', 'repair', 'inspection', 'cleaning'
    description TEXT NOT NULL,
    service_center VARCHAR(100),
    cost INTEGER,
    
    maintenance_date DATE NOT NULL,
    next_due_date DATE,
    
    documents TEXT[], -- Receipt images, etc.
    
    created_by UUID, -- Admin who logged this
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================================
-- VIEWS
-- ============================================================================

-- View: Available rental vehicles by location
CREATE VIEW available_rental_vehicles AS
SELECT 
    rv.*,
    l.name as location_name,
    l.district as location_district,
    COALESCE(AVG(rr.overall_rating), 0) as avg_rating,
    COUNT(rr.id) as total_reviews
FROM rental_vehicles rv
LEFT JOIN locations l ON rv.pickup_location_id = l.id
LEFT JOIN rental_reviews rr ON rv.id = rr.vehicle_id AND rr.is_published = true
WHERE rv.is_available = true 
  AND rv.status = 'available'
  AND rv.available_quantity > 0
GROUP BY rv.id, l.name, l.district;

-- View: Rental statistics
CREATE VIEW rental_stats AS
SELECT 
    rv.vehicle_type,
    COUNT(DISTINCT rv.id) as total_vehicles,
    COUNT(DISTINCT CASE WHEN rv.is_available THEN rv.id END) as available_vehicles,
    COUNT(DISTINCT rb.id) as total_bookings,
    COALESCE(SUM(rb.total_amount), 0) as total_revenue
FROM rental_vehicles rv
LEFT JOIN rental_bookings rb ON rv.id = rb.vehicle_id 
    AND rb.status IN ('completed', 'returned')
    AND rb.created_at >= NOW() - INTERVAL '30 days'
GROUP BY rv.vehicle_type;

-- ============================================================================
-- FUNCTIONS & TRIGGERS
-- ============================================================================

-- Update available_quantity trigger
CREATE OR REPLACE FUNCTION update_vehicle_availability()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.status = 'confirmed' OR NEW.status = 'picked_up' OR NEW.status = 'active' THEN
        UPDATE rental_vehicles 
        SET available_quantity = available_quantity - 1,
            status = CASE WHEN available_quantity - 1 <= 0 THEN 'rented' ELSE status END
        WHERE id = NEW.vehicle_id;
    ELSIF NEW.status = 'returned' OR NEW.status = 'completed' OR NEW.status = 'cancelled' THEN
        UPDATE rental_vehicles 
        SET available_quantity = LEAST(available_quantity + 1, total_quantity),
            status = CASE WHEN status = 'rented' THEN 'available' ELSE status END
        WHERE id = NEW.vehicle_id;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER rental_booking_status_change
    AFTER UPDATE OF status ON rental_bookings
    FOR EACH ROW
    EXECUTE FUNCTION update_vehicle_availability();

-- Update timestamps
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_rental_vehicles_updated_at
    BEFORE UPDATE ON rental_vehicles
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_rental_bookings_updated_at
    BEFORE UPDATE ON rental_bookings
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================================================
-- RLS POLICIES (Enable RLS on tables)
-- ============================================================================

ALTER TABLE rental_vehicles ENABLE ROW LEVEL SECURITY;
ALTER TABLE rental_bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE rental_reviews ENABLE ROW LEVEL SECURITY;

-- Everyone can read available vehicles
CREATE POLICY "Anyone can view available rental vehicles"
    ON rental_vehicles FOR SELECT
    USING (is_available = true AND status = 'available');

-- Users can view their own bookings
CREATE POLICY "Users can view own bookings"
    ON rental_bookings FOR SELECT
    USING (customer_phone = current_setting('app.current_user_phone', true));

-- Allow anonymous users to create bookings
CREATE POLICY "Anyone can insert rental bookings"
    ON rental_bookings FOR INSERT
    TO PUBLIC WITH CHECK (true);

-- ============================================================================
-- DUMMY DATA: Rental Vehicles
-- ============================================================================

INSERT INTO rental_vehicles (
    vehicle_code, name, brand, model, vehicle_type, vehicle_subtype, 
    fuel_type, seating_capacity, transmission,
    price_per_day, price_per_week, security_deposit,
    features, current_city, status, is_available
) VALUES 
-- Cars (Hatchbacks)
('ROM-CAR-001', 'Maruti Swift', 'Maruti Suzuki', 'Swift', 'car', 'hatchback', 'petrol', 5, 'manual', 1200, 7000, 5000, 
 ARRAY['AC', 'Power Steering', 'Bluetooth', 'Music System'], 'Kochi', 'available', true),
('ROM-CAR-002', 'Hyundai i10', 'Hyundai', 'i10', 'car', 'hatchback', 'petrol', 5, 'manual', 1100, 6500, 5000, 
 ARRAY['AC', 'Power Steering', 'Central Locking'], 'Kochi', 'available', true),
('ROM-CAR-003', 'Tata Tiago CNG', 'Tata', 'Tiago', 'car', 'hatchback', 'cng', 5, 'manual', 900, 5500, 3000, 
 ARRAY['AC', 'Power Steering', 'Economical'], 'Kozhikode', 'available', true),

-- Cars (Sedans)
('ROM-CAR-004', 'Honda City', 'Honda', 'City', 'car', 'sedan', 'petrol', 5, 'manual', 1800, 11000, 8000, 
 ARRAY['AC', 'Sunroof', 'Touchscreen', 'Reverse Camera', 'Cruise Control'], 'Kochi', 'available', true),
('ROM-CAR-005', 'Hyundai Verna', 'Hyundai', 'Verna', 'car', 'sedan', 'diesel', 5, 'manual', 1600, 10000, 8000, 
 ARRAY['AC', 'Touchscreen', 'Ventilated Seats'], 'Trivandrum', 'available', true),
('ROM-CAR-006', 'Maruti Dzire', 'Maruti Suzuki', 'Dzire', 'car', 'sedan', 'petrol', 5, 'manual', 1400, 8500, 5000, 
 ARRAY['AC', 'Power Steering', 'Music System'], 'Thrissur', 'available', true),

-- Cars (SUVs)
('ROM-CAR-007', 'Hyundai Creta', 'Hyundai', 'Creta', 'car', 'suv', 'diesel', 5, 'manual', 2200, 13500, 10000, 
 ARRAY['AC', 'Sunroof', 'Touchscreen', 'Reverse Camera', 'ABS'], 'Kochi', 'available', true),
('ROM-CAR-008', 'Kia Seltos', 'Kia', 'Seltos', 'car', 'suv', 'petrol', 5, 'automatic', 2500, 15000, 10000, 
 ARRAY['AC', 'Sunroof', 'BOSE Sound', '360 Camera'], 'Kochi', 'available', true),
('ROM-CAR-009', 'Toyota Fortuner', 'Toyota', 'Fortuner', 'car', 'suv', 'diesel', 7, 'automatic', 4500, 28000, 15000, 
 ARRAY['AC', '4x4', 'Leather Seats', 'Premium Audio'], 'Trivandrum', 'available', true),

-- Cars (MUVs)
('ROM-CAR-010', 'Toyota Innova Crysta', 'Toyota', 'Innova Crysta', 'car', 'muv', 'diesel', 7, 'manual', 2800, 17000, 10000, 
 ARRAY['AC', 'Spacious', 'AC Vents', 'Captain Seats'], 'Kochi', 'available', true),
('ROM-CAR-011', 'Maruti Ertiga', 'Maruti Suzuki', 'Ertiga', 'car', 'muv', 'petrol', 7, 'manual', 1500, 9000, 5000, 
 ARRAY['AC', 'Spacious', 'Family Friendly'], 'Kottayam', 'available', true),

-- Cars (Luxury)
('ROM-CAR-012', 'Mercedes-Benz E-Class', 'Mercedes-Benz', 'E-Class', 'car', 'luxury', 'petrol', 5, 'automatic', 8000, 50000, 25000, 
 ARRAY['AC', 'Leather Seats', 'Ambient Lighting', 'Premium Audio', 'Sunroof'], 'Kochi', 'available', true),
('ROM-CAR-013', 'BMW 5 Series', 'BMW', '5 Series', 'car', 'luxury', 'diesel', 5, 'automatic', 7500, 45000, 25000, 
 ARRAY['AC', 'Leather Seats', 'Heads Up Display', 'Premium Audio'], 'Kochi', 'available', true),

-- Electric Cars
('ROM-CAR-014', 'Tata Nexon EV', 'Tata', 'Nexon EV', 'car', 'compact_suv', 'electric', 5, 'automatic', 2500, 15000, 10000, 
 ARRAY['AC', 'Fast Charging', 'Touchscreen', 'Zero Emission'], 'Trivandrum', 'available', true),
('ROM-CAR-015', 'MG ZS EV', 'MG', 'ZS EV', 'car', 'compact_suv', 'electric', 5, 'automatic', 2800, 17000, 10000, 
 ARRAY['AC', 'Panoramic Roof', 'Premium Audio', 'Fast Charging'], 'Kochi', 'available', true),

-- Bikes (Scooters)
('ROM-BIKE-001', 'Honda Activa 6G', 'Honda', 'Activa 6G', 'bike', 'scooter', 'petrol', 2, 'automatic', 400, 2500, 2000, 
 ARRAY['Automatic', 'Underseat Storage', 'Easy to Ride'], 'Kochi', 'available', true),
('ROM-BIKE-002', 'TVS Jupiter', 'TVS', 'Jupiter', 'bike', 'scooter', 'petrol', 2, 'automatic', 350, 2200, 2000, 
 ARRAY['Automatic', 'Economical', 'Comfortable'], 'Thrissur', 'available', true),
('ROM-BIKE-003', 'Suzuki Access 125', 'Suzuki', 'Access 125', 'bike', 'scooter', 'petrol', 2, 'automatic', 380, 2400, 2000, 
 ARRAY['Automatic', '125cc Power', 'Spacious'], 'Kozhikode', 'available', true),

-- Bikes (Motorcycles)
('ROM-BIKE-004', 'Bajaj Pulsar NS200', 'Bajaj', 'Pulsar NS200', 'bike', 'sports_bike', 'petrol', 2, 'manual', 600, 3800, 3000, 
 ARRAY['ABS', 'Digital Console', '200cc Power'], 'Trivandrum', 'available', true),
('ROM-BIKE-005', 'Royal Enfield Classic 350', 'Royal Enfield', 'Classic 350', 'bike', 'cruiser', 'petrol', 2, 'manual', 700, 4400, 5000, 
 ARRAY['Classic Style', '350cc', 'Comfortable'], 'Kochi', 'available', true),
('ROM-BIKE-006', 'KTM Duke 200', 'KTM', 'Duke 200', 'bike', 'sports_bike', 'petrol', 2, 'manual', 800, 5000, 5000, 
 ARRAY['ABS', '200cc Power', 'Naked Design'], 'Kochi', 'available', true),

-- Electric Bikes
('ROM-BIKE-007', 'Ather 450X', 'Ather', '450X', 'bike', 'scooter', 'electric', 2, 'automatic', 700, 4400, 5000, 
 ARRAY['Touchscreen', 'Fast Charging', 'Navigation', '82km Range'], 'Kochi', 'available', true),
('ROM-BIKE-008', 'Ola S1 Pro', 'Ola', 'S1 Pro', 'bike', 'scooter', 'electric', 2, 'automatic', 650, 4000, 5000, 
 ARRAY['Hyper Mode', '181km Range', 'Cruise Control'], 'Trivandrum', 'available', true),
('ROM-BIKE-009', 'TVS iQube', 'TVS', 'iQube', 'bike', 'scooter', 'electric', 2, 'automatic', 500, 3200, 3000, 
 ARRAY['75km Range', 'Economical', 'Easy Charging'], 'Kozhikode', 'available', true),

-- Bicycles (Regular)
('ROM-CYCLE-001', 'Hero Sprint', 'Hero', 'Sprint', 'bicycle', 'city', 'electric', 1, NULL, 200, 1200, 1000, 
 ARRAY['City Bike', 'Single Speed', 'Comfortable'], 'Alappuzha', 'available', true),
('ROM-CYCLE-002', 'Atlas Ultimate', 'Atlas', 'Ultimate', 'bicycle', 'mountain', 'electric', 1, NULL, 250, 1500, 1000, 
 ARRAY['Mountain Bike', '21 Speed', 'Front Suspension'], 'Munnar', 'available', true),
('ROM-CYCLE-003', 'Firefox Cyclone', 'Firefox', 'Cyclone', 'bicycle', 'hybrid', 'electric', 1, NULL, 300, 1800, 1500, 
 ARRAY['Hybrid', '18 Speed', 'Disc Brakes'], 'Wayanad', 'available', true),

-- Electric Bicycles
('ROM-CYCLE-004', 'Hero Lectro C5', 'Hero', 'Lectro C5', 'bicycle', 'city', 'electric', 1, NULL, 500, 3000, 2000, 
 ARRAY['Electric Assist', '25km Range', '3 Speed'], 'Kochi', 'available', true),
('ROM-CYCLE-005', 'Trek Verve+ 2', 'Trek', 'Verve+ 2', 'bicycle', 'city', 'electric', 1, NULL, 800, 5000, 3000, 
 ARRAY['Electric Assist', '65km Range', 'Comfortable'], 'Kochi', 'available', true),
('ROM-CYCLE-006', 'Giant Talon E+', 'Giant', 'Talon E+', 'bicycle', 'mountain', 'electric', 1, NULL, 1000, 6000, 3000, 
 ARRAY['Electric MTB', '120km Range', 'Full Suspension'], 'Munnar', 'available', true);

-- ============================================================================
-- END OF RENTAL SYSTEM SCHEMA
-- ============================================================================
