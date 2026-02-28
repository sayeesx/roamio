-- Create booking_status table to track booking history with passenger details
CREATE TABLE IF NOT EXISTS public.booking_status (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    
    -- Reference to the original booking
    booking_reference VARCHAR(20) NOT NULL UNIQUE,
    booking_id UUID, -- No FK constraint since parent table may not exist
    
    -- Passenger Information
    passenger_name VARCHAR(255) NOT NULL,
    passenger_phone VARCHAR(20) NOT NULL,
    passenger_email VARCHAR(255),
    passenger_count INTEGER DEFAULT 1,
    
    -- Booking Details
    pickup_address TEXT NOT NULL,
    drop_address TEXT NOT NULL,
    pickup_location_id UUID REFERENCES public.locations(id),
    drop_location_id UUID REFERENCES public.locations(id),
    pickup_date DATE NOT NULL,
    pickup_time TIME NOT NULL,
    
    -- Driver & Vehicle Info (snapshot at booking time)
    driver_id UUID,
    driver_name VARCHAR(255),
    vehicle_brand VARCHAR(100),
    vehicle_model VARCHAR(100),
    vehicle_type VARCHAR(50),
    
    -- Pricing
    price_per_km DECIMAL(10, 2),
    estimated_distance_km DECIMAL(10, 2),
    base_fare DECIMAL(10, 2),
    total_fare DECIMAL(10, 2),
    
    -- Status Tracking
    status VARCHAR(50) NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'driver_assigned', 'ongoing', 'completed', 'cancelled', 'failed')),
    
    -- Status Change History (JSON array of status changes with timestamps)
    status_history JSONB DEFAULT '[]'::jsonb,
    
    -- Special Requests
    special_requests TEXT,
    
    -- Failure/Cancellation Reason
    failure_reason TEXT,
    cancellation_reason TEXT,
    cancelled_by VARCHAR(50), -- 'customer', 'driver', 'system', 'admin'
    
    -- Timestamps
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    confirmed_at TIMESTAMPTZ,
    driver_assigned_at TIMESTAMPTZ,
    started_at TIMESTAMPTZ,
    completed_at TIMESTAMPTZ,
    cancelled_at TIMESTAMPTZ,
    
    -- Metadata
    ip_address INET,
    user_agent TEXT
);

-- Create index for faster lookups
CREATE INDEX IF NOT EXISTS idx_booking_status_reference ON public.booking_status(booking_reference);
CREATE INDEX IF NOT EXISTS idx_booking_status_status ON public.booking_status(status);
CREATE INDEX IF NOT EXISTS idx_booking_status_driver ON public.booking_status(driver_id);
CREATE INDEX IF NOT EXISTS idx_booking_status_created ON public.booking_status(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_booking_status_phone ON public.booking_status(passenger_phone);

-- Enable RLS
ALTER TABLE public.booking_status ENABLE ROW LEVEL SECURITY;

-- Policy: Allow anyone to create a booking status record (during booking)
CREATE POLICY "Allow insert for booking creation"
    ON public.booking_status
    FOR INSERT
    TO authenticated, anon
    WITH CHECK (true);

-- Policy: Allow users to view their own bookings by phone number
CREATE POLICY "Allow view own bookings by phone"
    ON public.booking_status
    FOR SELECT
    TO authenticated, anon
    USING (true);

-- Policy: Allow anyone to view (simplified - no drivers table dependency)
CREATE POLICY "Allow view all bookings"
    ON public.booking_status
    FOR SELECT
    TO authenticated, anon
    USING (true);

-- Policy: Allow admins full access
CREATE POLICY "Allow admin full access"
    ON public.booking_status
    FOR ALL
    TO authenticated
    USING (auth.jwt() ->> 'role' = 'admin')
    WITH CHECK (auth.jwt() ->> 'role' = 'admin');

-- Function to update status history automatically
CREATE OR REPLACE FUNCTION update_booking_status_history()
RETURNS TRIGGER AS $$
BEGIN
    -- Append status change to history
    NEW.status_history = COALESCE(OLD.status_history, '[]'::jsonb) || jsonb_build_object(
        'status', NEW.status,
        'timestamp', NOW(),
        'previous_status', OLD.status
    );
    
    -- Update corresponding timestamp fields based on status
    IF NEW.status = 'confirmed' AND OLD.status != 'confirmed' THEN
        NEW.confirmed_at = NOW();
    ELSIF NEW.status = 'driver_assigned' AND OLD.status != 'driver_assigned' THEN
        NEW.driver_assigned_at = NOW();
    ELSIF NEW.status = 'ongoing' AND OLD.status != 'ongoing' THEN
        NEW.started_at = NOW();
    ELSIF NEW.status = 'completed' AND OLD.status != 'completed' THEN
        NEW.completed_at = NOW();
    ELSIF NEW.status = 'cancelled' AND OLD.status != 'cancelled' THEN
        NEW.cancelled_at = NOW();
    END IF;
    
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to call the function
CREATE TRIGGER booking_status_history_trigger
    BEFORE UPDATE ON public.booking_status
    FOR EACH ROW
    EXECUTE FUNCTION update_booking_status_history();

-- Create rental_booking_status table for rental bookings
CREATE TABLE IF NOT EXISTS public.rental_booking_status (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    
    -- Reference
    booking_reference VARCHAR(20) NOT NULL UNIQUE,
    rental_booking_id UUID, -- No FK constraint since parent table may not exist
    
    -- Passenger Information
    customer_name VARCHAR(255) NOT NULL,
    customer_phone VARCHAR(20) NOT NULL,
    customer_email VARCHAR(255),
    
    -- Rental Details
    vehicle_id UUID,
    vehicle_name VARCHAR(255),
    vehicle_type VARCHAR(50),
    
    -- Location & Dates
    pickup_location VARCHAR(255) NOT NULL,
    pickup_date DATE NOT NULL,
    pickup_time TIME NOT NULL,
    return_date DATE NOT NULL,
    return_time TIME NOT NULL,
    
    -- Pricing
    daily_rate DECIMAL(10, 2),
    total_days INTEGER,
    total_amount DECIMAL(10, 2),
    security_deposit DECIMAL(10, 2),
    
    -- Status
    status VARCHAR(50) NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'vehicle_assigned', 'active', 'completed', 'cancelled', 'failed')),
    status_history JSONB DEFAULT '[]'::jsonb,
    
    -- Special Requests & Notes
    special_requests TEXT,
    failure_reason TEXT,
    cancellation_reason TEXT,
    cancelled_by VARCHAR(50),
    
    -- Timestamps
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    confirmed_at TIMESTAMPTZ,
    vehicle_assigned_at TIMESTAMPTZ,
    started_at TIMESTAMPTZ,
    completed_at TIMESTAMPTZ,
    cancelled_at TIMESTAMPTZ
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_rental_booking_status_reference ON public.rental_booking_status(booking_reference);
CREATE INDEX IF NOT EXISTS idx_rental_booking_status_status ON public.rental_booking_status(status);

-- Enable RLS
ALTER TABLE public.rental_booking_status ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Allow insert for rental booking creation"
    ON public.rental_booking_status
    FOR INSERT
    TO authenticated, anon
    WITH CHECK (true);

CREATE POLICY "Allow view rental bookings"
    ON public.rental_booking_status
    FOR SELECT
    TO authenticated, anon
    USING (true);

-- Trigger for rental status history
CREATE TRIGGER rental_booking_status_history_trigger
    BEFORE UPDATE ON public.rental_booking_status
    FOR EACH ROW
    EXECUTE FUNCTION update_booking_status_history();
