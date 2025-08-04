# การตั้งค่าการชำระเงิน KnoVan

## 1. การตั้งค่า Environment Variables

สร้างไฟล์ `.env.local` ในโฟลเดอร์หลักของโปรเจค:

```bash
# API Configuration
NEXT_PUBLIC_BASE_API=https://uapi.rg.in.th/uapi/rantcar/
NEXT_PUBLIC_BASE_URL=http://localhost:3000

# Database Configuration
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=van_booking_system
DB_PORT=3306

# Stripe Configuration
STRIPE_SECRET_KEY=sk_test_your_stripe_secret_key_here
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_your_stripe_publishable_key_here
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret_here
```

## 2. การตั้งค่า Stripe

### 2.1 สร้าง Stripe Account
1. ไปที่ [stripe.com](https://stripe.com)
2. สร้างบัญชีใหม่
3. เลือกประเทศไทยเป็นประเทศ

### 2.2 รับ API Keys
1. ไปที่ Dashboard > Developers > API Keys
2. คัดลอก Publishable Key และ Secret Key
3. ใส่ในไฟล์ `.env.local`

### 2.3 ตั้งค่า Webhook
1. ไปที่ Dashboard > Developers > Webhooks
2. คลิก "Add endpoint"
3. ใส่ URL: `https://your-domain.com/api/webhooks/stripe`
4. เลือก events:
   - `checkout.session.completed`
   - `payment_intent.succeeded`
   - `payment_intent.payment_failed`
   - `checkout.session.expired`
5. คัดลอก Webhook Secret และใส่ใน `.env.local`

## 3. การตั้งค่าฐานข้อมูล

### 3.1 สร้างฐานข้อมูล
```sql
CREATE DATABASE van_booking_system;
USE van_booking_system;
```

### 3.2 รัน SQL Scripts
1. รัน `database_schema.sql` เพื่อสร้างตาราง
2. รัน `booking_simple.sql` เพื่อสร้าง Stored Procedures

## 4. การทดสอบ

### 4.1 ทดสอบการชำระเงินด้วยบัตร
1. เริ่มเซิร์ฟเวอร์: `npm run dev`
2. ไปที่ `http://localhost:3000/booking`
3. กรอกข้อมูลการจอง
4. เลือก "บัตรเครดิต/เดบิต"
5. ทดสอบการชำระเงินด้วย Stripe Test Cards:
   - Visa: `4242424242424242`
   - Mastercard: `5555555555554444`
   - Expiry: `12/25`
   - CVC: `123`

### 4.2 ทดสอบการชำระเงินด้วย QR Code
1. เริ่มเซิร์ฟเวอร์: `npm run dev`
2. ไปที่ `http://localhost:3000/booking`
3. กรอกข้อมูลการจอง
4. เลือก "QR Code"
5. ระบบจะสร้าง QR Code จำลองสำหรับการทดสอบ
6. สแกน QR Code ด้วยแอปธนาคาร (สำหรับการทดสอบจริง)

### 4.3 ทดสอบ Webhook
1. ใช้ Stripe CLI: `stripe listen --forward-to localhost:3000/api/webhooks/stripe`
2. หรือใช้ ngrok: `ngrok http 3000`
3. อัปเดต webhook URL ใน Stripe Dashboard

## 5. การแก้ไขปัญหา

### 5.1 ปัญหาการชำระเงินด้วยบัตร
- ตรวจสอบ Stripe Keys ใน `.env.local`
- ตรวจสอบ Webhook URL และ Secret
- ดู logs ใน console ของ browser

### 5.2 ปัญหาการชำระเงินด้วย QR Code
- ตรวจสอบ Payment Intent creation
- ตรวจสอบ QR Code generation
- ดู logs ใน console ของ browser

### 5.3 ปัญหาฐานข้อมูล
- ตรวจสอบการเชื่อมต่อฐานข้อมูล
- ตรวจสอบ Stored Procedures
- ดู logs ใน server console

### 5.4 ปัญหา Webhook
- ตรวจสอบ Webhook Secret
- ตรวจสอบ URL endpoint
- ดู logs ใน Stripe Dashboard

## 6. การ Deploy

### 6.1 Production Environment
1. เปลี่ยน Stripe Keys เป็น Production Keys
2. อัปเดต `NEXT_PUBLIC_BASE_URL` เป็น domain จริง
3. ตั้งค่า Webhook URL เป็น production URL

### 6.2 Security
1. ตรวจสอบ HTTPS
2. ตั้งค่า CORS ถ้าจำเป็น
3. ใช้ Environment Variables ใน Production

## 7. การบำรุงรักษา

### 7.1 Monitoring
- ตรวจสอบ Stripe Dashboard เป็นประจำ
- ดู logs ของ webhook events
- ตรวจสอบการชำระเงินที่ล้มเหลว

### 7.2 Updates
- อัปเดต Stripe SDK เป็นประจำ
- ตรวจสอบ security patches
- ทดสอบการทำงานหลังอัปเดต

## 8. QR Code Testing

### 8.1 การทดสอบ QR Code จำลอง
- ระบบจะสร้าง QR Code จำลองสำหรับการทดสอบ
- QR Code จะมีข้อมูล: `KnoVan-{paymentIntentId}-{amount}`
- สามารถสแกนด้วยแอป QR Code Scanner เพื่อดูข้อมูล

### 8.2 การทดสอบ QR Code จริง
- สำหรับการใช้งานจริง ต้องใช้ PromptPay หรือ QR Code จริง
- ต้องตั้งค่า Stripe account ให้รองรับ PromptPay
- ต้องใช้ Payment Intent ที่รองรับ QR Code

## 9. Support

หากมีปัญหา ติดต่อ:
- Email: support@knovan.com
- Documentation: [Stripe Docs](https://stripe.com/docs)
- Community: [Stripe Community](https://community.stripe.com) 