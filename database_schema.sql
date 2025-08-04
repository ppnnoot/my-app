-- Database Schema for Van Booking System
-- สร้างฐานข้อมูลสำหรับระบบจองรถตู้

-- สร้างฐานข้อมูล (ถ้ายังไม่มี)
CREATE DATABASE IF NOT EXISTS van_booking_system;
USE van_booking_system;

-- ตารางลูกค้า (Customers)
CREATE TABLE customers (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    phone VARCHAR(20),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_email (email),
    INDEX idx_phone (phone)
);

-- ตารางการจอง (Bookings)
CREATE TABLE bookings (
    id INT PRIMARY KEY AUTO_INCREMENT,
    customer_id INT NOT NULL,
    service_type ENUM('hourly-service', 'daily-service') NOT NULL,
    pickup_location TEXT NOT NULL,
    dropoff_location TEXT NOT NULL,
    booking_date DATE NOT NULL,
    booking_time TIME NOT NULL,
    passengers INT NOT NULL DEFAULT 1,
    special_requests TEXT,
    status ENUM('pending', 'confirmed', 'completed', 'cancelled') DEFAULT 'pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (customer_id) REFERENCES customers(id) ON DELETE CASCADE,
    INDEX idx_customer_id (customer_id),
    INDEX idx_booking_date (booking_date),
    INDEX idx_status (status)
);

-- ตารางการชำระเงิน (Payments)
CREATE TABLE payments (
    id INT PRIMARY KEY AUTO_INCREMENT,
    booking_id INT NOT NULL,
    stripe_session_id VARCHAR(255) UNIQUE NOT NULL,
    stripe_payment_intent_id VARCHAR(255),
    amount DECIMAL(10,2) NOT NULL,
    currency VARCHAR(3) DEFAULT 'USD',
    payment_method VARCHAR(50),
    payment_status ENUM('pending', 'succeeded', 'failed', 'cancelled') DEFAULT 'pending',
    payment_type ENUM('card', 'promptpay', 'other') DEFAULT 'card',
    metadata JSON,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (booking_id) REFERENCES bookings(id) ON DELETE CASCADE,
    INDEX idx_booking_id (booking_id),
    INDEX idx_stripe_session_id (stripe_session_id),
    INDEX idx_payment_status (payment_status),
    INDEX idx_created_at (created_at)
);

-- ตารางประวัติการชำระเงิน (Payment History)
CREATE TABLE payment_history (
    id INT PRIMARY KEY AUTO_INCREMENT,
    payment_id INT NOT NULL,
    status_from ENUM('pending', 'succeeded', 'failed', 'cancelled'),
    status_to ENUM('pending', 'succeeded', 'failed', 'cancelled'),
    stripe_event_type VARCHAR(100),
    stripe_event_id VARCHAR(255),
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (payment_id) REFERENCES payments(id) ON DELETE CASCADE,
    INDEX idx_payment_id (payment_id),
    INDEX idx_created_at (created_at)
);

-- ตารางการตั้งค่าบริการ (Service Settings)
CREATE TABLE service_settings (
    id INT PRIMARY KEY AUTO_INCREMENT,
    service_type ENUM('hourly-service', 'daily-service') NOT NULL,
    base_price DECIMAL(10,2) NOT NULL,
    currency VARCHAR(3) DEFAULT 'USD',
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    UNIQUE KEY unique_service_type (service_type)
);

-- เพิ่มข้อมูลเริ่มต้นสำหรับการตั้งค่าบริการ
INSERT INTO service_settings (service_type, base_price, currency) VALUES
('hourly-service', 50.00, 'USD'),
('daily-service', 200.00, 'USD');

-- สร้าง View สำหรับดูข้อมูลการจองและการชำระเงิน
CREATE VIEW booking_payment_summary AS
SELECT 
    b.id as booking_id,
    c.name as customer_name,
    c.email as customer_email,
    c.phone as customer_phone,
    b.service_type,
    b.pickup_location,
    b.dropoff_location,
    b.booking_date,
    b.booking_time,
    b.passengers,
    b.status as booking_status,
    p.stripe_session_id,
    p.amount,
    p.currency,
    p.payment_status,
    p.payment_method,
    p.created_at as payment_created_at
FROM bookings b
LEFT JOIN customers c ON b.customer_id = c.id
LEFT JOIN payments p ON b.id = p.booking_id
ORDER BY b.created_at DESC;

-- สร้าง Stored Procedure สำหรับสร้างการจองใหม่
DELIMITER //
CREATE PROCEDURE CreateBooking(
    IN p_customer_name VARCHAR(255),
    IN p_customer_email VARCHAR(255),
    IN p_customer_phone VARCHAR(20),
    IN p_service_type ENUM('hourly-service', 'daily-service'),
    IN p_pickup_location TEXT,
    IN p_dropoff_location TEXT,
    IN p_booking_date DATE,
    IN p_booking_time TIME,
    IN p_passengers INT,
    IN p_special_requests TEXT,
    OUT p_booking_id INT
)
BEGIN
    DECLARE v_customer_id INT;
    
    -- ตรวจสอบหรือสร้างลูกค้าใหม่
    INSERT INTO customers (name, email, phone) 
    VALUES (p_customer_name, p_customer_email, p_customer_phone)
    ON DUPLICATE KEY UPDATE 
        name = VALUES(name),
        phone = VALUES(phone),
        updated_at = CURRENT_TIMESTAMP;
    
    -- รับ customer_id
    SELECT id INTO v_customer_id FROM customers WHERE email = p_customer_email;
    
    -- สร้างการจอง
    INSERT INTO bookings (
        customer_id, service_type, pickup_location, dropoff_location,
        booking_date, booking_time, passengers, special_requests
    ) VALUES (
        v_customer_id, p_service_type, p_pickup_location, p_dropoff_location,
        p_booking_date, p_booking_time, p_passengers, p_special_requests
    );
    
    SET p_booking_id = LAST_INSERT_ID();
END //
DELIMITER ;

-- สร้าง Stored Procedure สำหรับบันทึกการชำระเงิน
DELIMITER //
CREATE PROCEDURE RecordPayment(
    IN p_booking_id INT,
    IN p_stripe_session_id VARCHAR(255),
    IN p_amount DECIMAL(10,2),
    IN p_currency VARCHAR(3),
    IN p_payment_method VARCHAR(50),
    IN p_metadata JSON,
    OUT p_payment_id INT
)
BEGIN
    INSERT INTO payments (
        booking_id, stripe_session_id, amount, currency, 
        payment_method, metadata
    ) VALUES (
        p_booking_id, p_stripe_session_id, p_amount, p_currency,
        p_payment_method, p_metadata
    );
    
    SET p_payment_id = LAST_INSERT_ID();
END //
DELIMITER ;

-- สร้าง Trigger สำหรับบันทึกประวัติการเปลี่ยนแปลงสถานะการชำระเงิน
DELIMITER //
CREATE TRIGGER payment_status_change_trigger
AFTER UPDATE ON payments
FOR EACH ROW
BEGIN
    IF OLD.payment_status != NEW.payment_status THEN
        INSERT INTO payment_history (
            payment_id, status_from, status_to, description
        ) VALUES (
            NEW.id, OLD.payment_status, NEW.payment_status,
            CONCAT('Payment status changed from ', OLD.payment_status, ' to ', NEW.payment_status)
        );
    END IF;
END //
DELIMITER ;

-- สร้าง Index เพิ่มเติมสำหรับประสิทธิภาพ
CREATE INDEX idx_payments_booking_date ON payments(created_at);
CREATE INDEX idx_bookings_customer_date ON bookings(customer_id, booking_date);
CREATE INDEX idx_customers_created_at ON customers(created_at);

-- ตัวอย่างการใช้งาน
-- เรียกใช้ Stored Procedure สำหรับสร้างการจอง
-- CALL CreateBooking('John Doe', 'john@example.com', '+1234567890', 'hourly-service', 'Bangkok Airport', 'Pattaya Hotel', '2024-01-15', '09:00:00', 4, 'Need wheelchair access', @booking_id);

-- เรียกใช้ Stored Procedure สำหรับบันทึกการชำระเงิน
-- CALL RecordPayment(@booking_id, 'cs_test_123456789', 50.00, 'USD', 'card', '{"service_type": "hourly-service"}', @payment_id); 