-- Booking Table for Van Rental System
-- สร้างตารางสำหรับระบบการจองรถตู้

CREATE TABLE bookings (
    id VARCHAR(50) PRIMARY KEY,
    service_type ENUM('hourly-service', 'daily-service') NOT NULL,
    pickup_location TEXT NOT NULL,
    dropoff_location TEXT NOT NULL,
    booking_date DATE NOT NULL,
    booking_time TIME NOT NULL,
    hours INT DEFAULT 1,
    passengers INT NOT NULL DEFAULT 1,
    customer_name VARCHAR(255) NOT NULL,
    customer_email VARCHAR(255) NOT NULL,
    customer_phone VARCHAR(50) NOT NULL,
    special_requests TEXT,
    status ENUM('pending', 'confirmed', 'cancelled', 'completed') DEFAULT 'confirmed',
    external_api_response JSON,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    -- Indexes for better performance
    INDEX idx_customer_email (customer_email),
    INDEX idx_booking_date (booking_date),
    INDEX idx_status (status),
    INDEX idx_created_at (created_at)
);

-- Sample data for testing (optional)
INSERT INTO bookings (
    id, 
    service_type, 
    pickup_location, 
    dropoff_location, 
    booking_date, 
    booking_time, 
    hours, 
    passengers, 
    customer_name, 
    customer_email, 
    customer_phone, 
    special_requests,
    status
) VALUES (
    'KV-123456',
    'hourly-service',
    'สนามบินสุวรรณภูมิ',
    'สุขุมวิท 55',
    '2024-01-15',
    '14:00:00',
    3,
    4,
    'สมชาย ใจดี',
    'somchai@example.com',
    '081-234-5678',
    'ต้องการรถที่มีที่นั่งสำหรับเด็ก',
    'confirmed'
);

-- Alternative table structure with more detailed fields
CREATE TABLE bookings_detailed (
    id VARCHAR(50) PRIMARY KEY,
    
    -- Service Information
    service_type ENUM('hourly-service', 'daily-service') NOT NULL,
    service_name VARCHAR(100) NOT NULL,
    service_price DECIMAL(10,2),
    
    -- Location Information
    pickup_location TEXT NOT NULL,
    dropoff_location TEXT NOT NULL,
    pickup_lat DECIMAL(10,8),
    pickup_lng DECIMAL(11,8),
    dropoff_lat DECIMAL(10,8),
    dropoff_lng DECIMAL(11,8),
    
    -- Booking Details
    booking_date DATE NOT NULL,
    booking_time TIME NOT NULL,
    duration_hours INT DEFAULT 1,
    total_passengers INT NOT NULL DEFAULT 1,
    
    -- Customer Information
    customer_name VARCHAR(255) NOT NULL,
    customer_email VARCHAR(255) NOT NULL,
    customer_phone VARCHAR(50) NOT NULL,
    customer_id_card VARCHAR(20),
    
    -- Special Requirements
    special_requests TEXT,
    vehicle_type VARCHAR(50),
    additional_services JSON,
    
    -- Payment Information
    payment_status ENUM('pending', 'paid', 'refunded') DEFAULT 'pending',
    payment_amount DECIMAL(10,2),
    payment_method VARCHAR(50),
    
    -- Booking Status
    status ENUM('pending', 'confirmed', 'in_progress', 'completed', 'cancelled') DEFAULT 'confirmed',
    driver_assigned VARCHAR(100),
    driver_phone VARCHAR(50),
    
    -- External API Integration
    external_api_response JSON,
    external_booking_id VARCHAR(100),
    
    -- Timestamps
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    confirmed_at TIMESTAMP NULL,
    completed_at TIMESTAMP NULL,
    
    -- Indexes
    INDEX idx_customer_email (customer_email),
    INDEX idx_booking_date (booking_date),
    INDEX idx_status (status),
    INDEX idx_payment_status (payment_status),
    INDEX idx_created_at (created_at),
    INDEX idx_external_booking_id (external_booking_id)
);

-- Comments for table structure
/*
Table Structure Explanation:

1. Basic Booking Table (bookings):
   - id: Unique booking identifier (KV-XXXXXX format)
   - service_type: hourly-service or daily-service
   - pickup_location/dropoff_location: Text addresses
   - booking_date/time: When the service is needed
   - hours: Duration for hourly service
   - passengers: Number of passengers
   - customer_*: Customer contact information
   - special_requests: Optional special requirements
   - status: Booking status
   - external_api_response: Response from external API
   - created_at/updated_at: Timestamps

2. Detailed Booking Table (bookings_detailed):
   - Additional fields for comprehensive booking management
   - GPS coordinates for locations
   - Payment information
   - Driver assignment
   - More detailed status tracking
   - External API integration fields

Usage:
- Use 'bookings' table for basic functionality
- Use 'bookings_detailed' table for advanced features
*/ 