import mysql from 'mysql2/promise';

// การตั้งค่าการเชื่อมต่อฐานข้อมูล
const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'van_booking_system',
  port: process.env.DB_PORT || 3306,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  acquireTimeout: 60000,
  timeout: 60000,
  reconnect: true
};

// สร้าง connection pool
let pool;

export async function getConnection() {
  if (!pool) {
    pool = mysql.createPool(dbConfig);
  }
  return pool;
}

// ฟังก์ชันสำหรับสร้างการจองใหม่
export async function createBooking(bookingData) {
  const connection = await getConnection();
  
  try {
    const {
      customerName,
      customerEmail,
      customerPhone,
      serviceType,
      pickupLocation,
      dropoffLocation,
      date,
      time,
      passengers,
      specialRequests
    } = bookingData;

    // เรียกใช้ Stored Procedure
    const [result] = await connection.execute(
      'CALL CreateBooking(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, @booking_id)',
      [
        customerName,
        customerEmail,
        customerPhone,
        serviceType,
        pickupLocation,
        dropoffLocation,
        date,
        time,
        passengers,
        specialRequests || null
      ]
    );

    // รับ booking_id ที่ได้จาก Stored Procedure
    const [bookingIdResult] = await connection.execute('SELECT @booking_id as booking_id');
    const bookingId = bookingIdResult[0].booking_id;

    return { success: true, bookingId };
  } catch (error) {
    console.error('Error creating booking:', error);
    throw error;
  }
}

// ฟังก์ชันสำหรับบันทึกการชำระเงิน
export async function recordPayment(paymentData) {
  const connection = await getConnection();
  
  try {
    const {
      bookingId,
      stripeSessionId,
      amount,
      currency = 'USD',
      paymentMethod = 'card',
      metadata = {}
    } = paymentData;

    // เรียกใช้ Stored Procedure
    const [result] = await connection.execute(
      'CALL RecordPayment(?, ?, ?, ?, ?, ?, @payment_id)',
      [
        bookingId,
        stripeSessionId,
        amount,
        currency,
        paymentMethod,
        JSON.stringify(metadata)
      ]
    );

    // รับ payment_id ที่ได้จาก Stored Procedure
    const [paymentIdResult] = await connection.execute('SELECT @payment_id as payment_id');
    const paymentId = paymentIdResult[0].payment_id;

    return { success: true, paymentId };
  } catch (error) {
    console.error('Error recording payment:', error);
    throw error;
  }
}

// ฟังก์ชันสำหรับอัปเดตสถานะการชำระเงิน
export async function updatePaymentStatus(stripeSessionId, status, stripeEventType = null, stripeEventId = null) {
  const connection = await getConnection();
  
  try {
    const [result] = await connection.execute(
      'UPDATE payments SET payment_status = ? WHERE stripe_session_id = ?',
      [status, stripeSessionId]
    );

    if (result.affectedRows > 0) {
      // บันทึกประวัติการเปลี่ยนแปลง
      if (stripeEventType && stripeEventId) {
        await connection.execute(
          'INSERT INTO payment_history (payment_id, stripe_event_type, stripe_event_id, description) VALUES ((SELECT id FROM payments WHERE stripe_session_id = ?), ?, ?, ?)',
          [stripeSessionId, stripeEventType, stripeEventId, `Payment status updated to ${status}`]
        );
      }

      return { success: true };
    }

    return { success: false, message: 'Payment not found' };
  } catch (error) {
    console.error('Error updating payment status:', error);
    throw error;
  }
}

// ฟังก์ชันสำหรับดึงข้อมูลการจองและการชำระเงิน
export async function getBookingPaymentSummary(bookingId = null) {
  const connection = await getConnection();
  
  try {
    let query = 'SELECT * FROM booking_payment_summary';
    let params = [];

    if (bookingId) {
      query += ' WHERE booking_id = ?';
      params.push(bookingId);
    }

    query += ' ORDER BY payment_created_at DESC';

    const [rows] = await connection.execute(query, params);
    return rows;
  } catch (error) {
    console.error('Error getting booking payment summary:', error);
    throw error;
  }
}

// ฟังก์ชันสำหรับดึงข้อมูลลูกค้า
export async function getCustomerByEmail(email) {
  const connection = await getConnection();
  
  try {
    const [rows] = await connection.execute(
      'SELECT * FROM customers WHERE email = ?',
      [email]
    );
    
    return rows[0] || null;
  } catch (error) {
    console.error('Error getting customer:', error);
    throw error;
  }
}

// ฟังก์ชันสำหรับดึงข้อมูลการตั้งค่าบริการ
export async function getServiceSettings() {
  const connection = await getConnection();
  
  try {
    const [rows] = await connection.execute(
      'SELECT * FROM service_settings WHERE is_active = TRUE'
    );
    
    return rows;
  } catch (error) {
    console.error('Error getting service settings:', error);
    throw error;
  }
}

// ฟังก์ชันสำหรับปิดการเชื่อมต่อ
export async function closeConnection() {
  if (pool) {
    await pool.end();
    pool = null;
  }
} 