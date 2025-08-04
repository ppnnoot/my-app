-- Simple Booking Table for Van Rental
-- ตารางการจองรถตู้แบบง่าย

CREATE TABLE bookings (
    id VARCHAR(50) PRIMARY KEY,
    service_type VARCHAR(20) NOT NULL,
    vehicle_type VARCHAR(50) NOT NULL,
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
    payment_method VARCHAR(50),
    payment_amount DECIMAL(10,2),
    payment_status VARCHAR(20) DEFAULT 'pending',
    status VARCHAR(20) DEFAULT 'confirmed',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Sample data
INSERT INTO bookings (
    id, service_type, vehicle_type, pickup_location, dropoff_location, 
    booking_date, booking_time, hours, passengers,
    customer_name, customer_email, customer_phone, special_requests
) VALUES 
('KV-123456', 'hourly-service', 'toyota-alphard', 'สนามบินสุวรรณภูมิ', 'สุขุมวิท 55', 
 '2024-01-15', '14:00:00', 3, 4,
 'สมชาย ใจดี', 'somchai@example.com', '081-234-5678', 'ต้องการรถที่มีที่นั่งสำหรับเด็ก'),

('KV-123457', 'daily-service', 'mercedes-v-class', 'ห้างสรรพสินค้าเซ็นทรัลเวิลด์', 'โรงแรมแกรนด์ไฮแอท', 
 '2024-01-16', '09:00:00', 1, 6,
 'สมหญิง รักดี', 'somying@example.com', '082-345-6789', 'ต้องการรถที่มีที่นั่งสำหรับผู้สูงอายุ'); 