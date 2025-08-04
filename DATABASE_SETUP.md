# การติดตั้งฐานข้อมูลสำหรับระบบจองรถตู้

## ข้อกำหนดเบื้องต้น

1. **MySQL Server** (เวอร์ชัน 8.0 ขึ้นไป)
2. **Node.js** (เวอร์ชัน 18 ขึ้นไป)
3. **npm** หรือ **yarn**

## ขั้นตอนการติดตั้ง

### 1. ติดตั้ง MySQL Server

#### สำหรับ macOS (ใช้ Homebrew):
```bash
brew install mysql
brew services start mysql
```

#### สำหรับ Ubuntu/Debian:
```bash
sudo apt update
sudo apt install mysql-server
sudo systemctl start mysql
sudo systemctl enable mysql
```

#### สำหรับ Windows:
ดาวน์โหลดและติดตั้งจาก [MySQL Official Website](https://dev.mysql.com/downloads/mysql/)

### 2. สร้างฐานข้อมูล

1. เข้าสู่ MySQL:
```bash
mysql -u root -p
```

2. รัน SQL script:
```bash
mysql -u root -p < database_schema.sql
```

หรือคัดลอกเนื้อหาจาก `database_schema.sql` และรันใน MySQL Workbench

### 3. ติดตั้ง Dependencies

```bash
npm install mysql2
```

### 4. ตั้งค่า Environment Variables

1. คัดลอกไฟล์ `env.example` เป็น `.env.local`:
```bash
cp env.example .env.local
```

2. แก้ไขไฟล์ `.env.local` ให้ตรงกับการตั้งค่าของคุณ:
```env
# Database Configuration
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_database_password
DB_NAME=van_booking_system
DB_PORT=3306
```

### 5. ทดสอบการเชื่อมต่อ

สร้างไฟล์ `test-db.js`:
```javascript
import { getConnection } from './src/lib/database.js';

async function testConnection() {
  try {
    const connection = await getConnection();
    console.log('Database connection successful!');
    
    // ทดสอบ query
    const [rows] = await connection.execute('SELECT 1 as test');
    console.log('Query test successful:', rows);
    
    process.exit(0);
  } catch (error) {
    console.error('Database connection failed:', error);
    process.exit(1);
  }
}

testConnection();
```

รันการทดสอบ:
```bash
node test-db.js
```

## โครงสร้างฐานข้อมูล

### ตารางหลัก

1. **customers** - ข้อมูลลูกค้า
2. **bookings** - ข้อมูลการจอง
3. **payments** - ข้อมูลการชำระเงิน
4. **payment_history** - ประวัติการเปลี่ยนแปลงสถานะการชำระเงิน
5. **service_settings** - การตั้งค่าบริการ

### Stored Procedures

1. **CreateBooking** - สร้างการจองใหม่
2. **RecordPayment** - บันทึกการชำระเงิน

### Views

1. **booking_payment_summary** - ดูข้อมูลการจองและการชำระเงิน

## การใช้งานในโค้ด

### ตัวอย่างการสร้างการจอง

```javascript
import { createBooking } from '@/lib/database';

const bookingData = {
  customerName: 'John Doe',
  customerEmail: 'john@example.com',
  customerPhone: '+1234567890',
  serviceType: 'hourly-service',
  pickupLocation: 'Bangkok Airport',
  dropoffLocation: 'Pattaya Hotel',
  date: '2024-01-15',
  time: '09:00:00',
  passengers: 4,
  specialRequests: 'Need wheelchair access'
};

const result = await createBooking(bookingData);
console.log('Booking created:', result.bookingId);
```

### ตัวอย่างการบันทึกการชำระเงิน

```javascript
import { recordPayment } from '@/lib/database';

const paymentData = {
  bookingId: 1,
  stripeSessionId: 'cs_test_123456789',
  amount: 50.00,
  currency: 'USD',
  paymentMethod: 'card',
  metadata: { serviceType: 'hourly-service' }
};

const result = await recordPayment(paymentData);
console.log('Payment recorded:', result.paymentId);
```

### ตัวอย่างการดึงข้อมูล

```javascript
import { getBookingPaymentSummary } from '@/lib/database';

// ดึงข้อมูลทั้งหมด
const allBookings = await getBookingPaymentSummary();

// ดึงข้อมูลเฉพาะการจอง
const specificBooking = await getBookingPaymentSummary(1);
```

## การบำรุงรักษา

### การสำรองข้อมูล

```bash
# สำรองฐานข้อมูล
mysqldump -u root -p van_booking_system > backup_$(date +%Y%m%d_%H%M%S).sql

# กู้คืนฐานข้อมูล
mysql -u root -p van_booking_system < backup_file.sql
```

### การตรวจสอบประสิทธิภาพ

```sql
-- ตรวจสอบขนาดตาราง
SELECT 
    table_name,
    ROUND(((data_length + index_length) / 1024 / 1024), 2) AS 'Size (MB)'
FROM information_schema.tables 
WHERE table_schema = 'van_booking_system';

-- ตรวจสอบ slow queries
SHOW VARIABLES LIKE 'slow_query_log';
```

## การแก้ไขปัญหา

### ปัญหาการเชื่อมต่อ

1. ตรวจสอบว่า MySQL server กำลังทำงาน
2. ตรวจสอบ username และ password
3. ตรวจสอบ port ที่ใช้

### ปัญหา Permission

```sql
-- สร้าง user ใหม่
CREATE USER 'vanapp'@'localhost' IDENTIFIED BY 'password';
GRANT ALL PRIVILEGES ON van_booking_system.* TO 'vanapp'@'localhost';
FLUSH PRIVILEGES;
```

### ปัญหา Character Set

```sql
-- ตั้งค่า character set
ALTER DATABASE van_booking_system CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

## คำแนะนำเพิ่มเติม

1. **Security**: ใช้ strong password และจำกัดการเข้าถึง
2. **Backup**: สำรองข้อมูลเป็นประจำ
3. **Monitoring**: ติดตั้ง monitoring tools
4. **Indexing**: ตรวจสอบและปรับปรุง indexes ตามการใช้งาน
5. **Connection Pooling**: ใช้ connection pool เพื่อประสิทธิภาพ 