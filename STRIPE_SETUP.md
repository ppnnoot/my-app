# Stripe Setup Guide

## 1. สร้างไฟล์ .env.local

สร้างไฟล์ `.env.local` ใน root directory ของโปรเจค:

```env
# API Configuration
NEXT_PUBLIC_BASE_API=https://uapi.rg.in.th/uapi/rantcar/
NEXT_PUBLIC_BASE_URL=http://localhost:3000

# Stripe Configuration
STRIPE_SECRET_KEY=sk_test_your_stripe_secret_key_here
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_your_stripe_publishable_key_here
```

## 2. รับ Stripe Keys

1. ไปที่ [Stripe Dashboard](https://dashboard.stripe.com/)
2. สร้างบัญชีหรือล็อกอิน
3. ไปที่ **Developers** → **API keys**
4. คัดลอก **Publishable key** และ **Secret key**
5. แทนที่ในไฟล์ `.env.local`

## 3. Test Keys (แนะนำ)

สำหรับการทดสอบ ใช้ test keys:
- **Publishable key**: ขึ้นต้นด้วย `pk_test_`
- **Secret key**: ขึ้นต้นด้วย `sk_test_`

## 4. การทดสอบ

1. รันเซิร์ฟเวอร์: `npm run dev`
2. ไปที่ `http://localhost:3000/booking`
3. กรอกข้อมูลการจอง
4. กดปุ่ม "ยืนยันและไปจ่ายเงิน"
5. ควรไปหน้า Stripe Checkout

## 5. Test Card Numbers

สำหรับการทดสอบการจ่ายเงิน:

- **Visa**: 4242 4242 4242 4242
- **Mastercard**: 5555 5555 5555 4444
- **Expiry**: ใช้วันที่ในอนาคต (เช่น 12/25)
- **CVC**: ใช้เลข 3 หลัก (เช่น 123)

## 6. Troubleshooting

### Error: "Stripe secret key not configured"
- ตรวจสอบว่าไฟล์ `.env.local` มี `STRIPE_SECRET_KEY`
- รีสตาร์ทเซิร์ฟเวอร์หลังแก้ไข .env

### Error: "Base URL not configured"
- ตรวจสอบว่าไฟล์ `.env.local` มี `NEXT_PUBLIC_BASE_URL`
- ควรเป็น `http://localhost:3000` สำหรับ development

### Error: "Missing required booking data"
- ตรวจสอบว่าส่งข้อมูลครบถ้วน
- ต้องมี `service`, `vehicleType`, `totalPrice`

## 7. Production Setup

เมื่อ deploy ไป production:

1. เปลี่ยนเป็น live keys (ขึ้นต้นด้วย `pk_live_` และ `sk_live_`)
2. เปลี่ยน `NEXT_PUBLIC_BASE_URL` เป็น domain จริง
3. ตั้งค่า environment variables ใน hosting platform

## 8. Webhook Setup (Optional)

สำหรับการจัดการ payment events:

1. ไปที่ Stripe Dashboard → **Developers** → **Webhooks**
2. สร้าง endpoint: `https://yourdomain.com/api/webhooks/stripe`
3. เลือก events: `checkout.session.completed`
4. รับ webhook secret และเพิ่มใน environment variables 