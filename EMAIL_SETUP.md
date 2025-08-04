# Email Service Setup Guide

## ระบบส่งอีเมลยืนยันการชำระเงินด้วย Resend SDK

### การติดตั้ง

1. **ติดตั้งแพ็กเกจ Resend** (ถ้ายังไม่ได้ติดตั้ง)
   ```bash
   npm install resend
   ```

2. **ตั้งค่าตัวแปรสภาพแวดล้อม**
   
   เพิ่ม `RESEND_API_KEY` ในไฟล์ `.env`:
   ```
   RESEND_API_KEY=your_resend_api_key_here
   ```

### การใช้งาน

#### 1. ฟังก์ชันหลัก

```javascript
import { sendPaymentConfirmation } from './src/lib/emailService.js';

// ตัวอย่างการใช้งาน
await sendPaymentConfirmation({
  to: 'customer@example.com',     // อีเมลผู้ชำระเงิน
  name: 'สมชาย ใจดี',              // ชื่อผู้ชำระเงิน
  amount: 2500,                   // ยอดที่จ่าย (number)
  currency: 'THB',                // สกุลเงิน (string)
  bookingRef: 'BK-2024-001',      // รหัสการจอง (string)
  paidAt: new Date()              // เวลาชำระ (Date)
});
```

#### 2. การทดสอบ

รันไฟล์ทดสอบ:
```bash
node test-email.js
```

### การตั้งค่า Resend

1. **สร้างบัญชี Resend**
   - ไปที่ [resend.com](https://resend.com)
   - สร้างบัญชีใหม่

2. **สร้าง API Key**
   - ไปที่ Dashboard > API Keys
   - สร้าง API Key ใหม่
   - คัดลอก API Key ไปใส่ใน `.env`

3. **ยืนยันโดเมน** (จำเป็น)
   - ไปที่ Dashboard > Domains
   - เพิ่มโดเมนที่ต้องการใช้ส่งอีเมล
   - ทำตามขั้นตอนการยืนยัน DNS

4. **อัปเดต "from" email**
   - แก้ไขไฟล์ `src/lib/emailService.js`
   - เปลี่ยน `noreply@yourdomain.com` เป็นโดเมนที่ยืนยันแล้ว

### ตัวอย่างการใช้งานใน Stripe Webhook

```javascript
// ในไฟล์ webhook handler
import { sendPaymentConfirmation } from './src/lib/emailService.js';

// เมื่อได้รับ webhook จาก Stripe
if (event.type === 'checkout.session.completed') {
  const session = event.data.object;
  
  // ส่งอีเมลยืนยัน
  await sendPaymentConfirmation({
    to: session.customer_details.email,
    name: session.customer_details.name,
    amount: session.amount_total / 100, // Stripe เก็บเป็น cents
    currency: session.currency.toUpperCase(),
    bookingRef: session.metadata.bookingRef,
    paidAt: new Date(session.created * 1000)
  });
}
```

### คุณสมบัติ

- ✅ ส่งอีเมล HTML และ Text
- ✅ รองรับภาษาไทย
- ✅ จัดรูปแบบสกุลเงินไทย
- ✅ แสดงวันที่และเวลาตาม timezone ไทย
- ✅ อีเมลสวยงามและ responsive
- ✅ Error handling ที่ดี
- ✅ ฟังก์ชันทดสอบ

### การแก้ไขปัญหา

1. **Error: "Invalid API key"**
   - ตรวจสอบ RESEND_API_KEY ใน .env
   - ตรวจสอบว่า API key ถูกต้อง

2. **Error: "Domain not verified"**
   - ยืนยันโดเมนใน Resend Dashboard
   - อัปเดต "from" email ใน emailService.js

3. **Error: "Rate limit exceeded"**
   - Resend มี limit 100 emails/day สำหรับ free tier
   - อัปเกรด plan หากต้องการส่งมากกว่านี้

### หมายเหตุ

- อีเมลจะถูกส่งจากโดเมนที่ยืนยันแล้วเท่านั้น
- ตรวจสอบ spam folder หากไม่ได้รับอีเมล
- ใช้ test email ก่อนใช้งานจริง 