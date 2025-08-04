# การตั้งค่า PromptPay จริงสำหรับ KnoVan

## 1. ข้อกำหนดเบื้องต้น

### 1.1 Stripe Account
- ต้องมี Stripe account ที่รองรับ PromptPay
- ต้องตั้งค่าในประเทศไทย
- ต้องผ่านการยืนยันตัวตน (KYC)

### 1.2 ธนาคารที่รองรับ PromptPay
- ธนาคารกรุงเทพ
- ธนาคารกสิกรไทย
- ธนาคารกรุงไทย
- ธนาคารไทยพาณิชย์
- ธนาคารกรุงศรี
- ธนาคารทหารไทยธนชาต
- และธนาคารอื่นๆ ที่เข้าร่วม PromptPay

## 2. การตั้งค่า Stripe สำหรับ PromptPay

### 2.1 เปิดใช้งาน PromptPay ใน Stripe
1. ไปที่ Stripe Dashboard
2. ไปที่ Settings > Payment methods
3. เปิดใช้งาน PromptPay
4. ยืนยันการตั้งค่า

### 2.2 ตั้งค่า Webhook Events
เพิ่ม webhook events สำหรับ PromptPay:
- `payment_intent.succeeded`
- `payment_intent.payment_failed`
- `payment_intent.canceled`

### 2.3 ตั้งค่า Environment Variables
```bash
# ในไฟล์ .env.local
STRIPE_SECRET_KEY=sk_live_your_live_secret_key
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_your_live_publishable_key
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret
```

## 3. การทดสอบ PromptPay

### 3.1 Test Mode
- ใช้ Stripe test keys
- PromptPay จะทำงานใน test mode
- ใช้ QR Code จำลองสำหรับการทดสอบ

### 3.2 Live Mode
- ใช้ Stripe live keys
- PromptPay จะทำงานจริง
- ใช้ QR Code จริงจากธนาคาร

## 4. การทำงานของระบบ

### 4.1 การสร้าง Payment Intent
```javascript
const paymentIntent = await stripe.paymentIntents.create({
  amount: amountInCents,
  currency: 'thb',
  payment_method_types: ['promptpay'],
  payment_method_options: {
    promptpay: {
      setup_future_usage: 'off_session',
    },
  },
});
```

### 4.2 การแสดง QR Code
```javascript
const qrCodeUrl = paymentIntent.next_action?.promptpay_display_qr_code?.image_url_png;
```

### 4.3 การตรวจสอบสถานะ
```javascript
const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);
if (paymentIntent.status === 'succeeded') {
  // Payment successful
}
```

## 5. การจัดการข้อผิดพลาด

### 5.1 PromptPay ไม่รองรับ
```javascript
if (error.message.includes('promptpay')) {
  // Fallback to card payment
  return fallbackToCardPayment();
}
```

### 5.2 การชำระเงินล้มเหลว
```javascript
if (paymentIntent.status === 'payment_failed') {
  // Handle payment failure
  showErrorMessage();
}
```

## 6. การ Deploy

### 6.1 Production Environment
1. เปลี่ยนเป็น Stripe live keys
2. ตั้งค่า webhook URL เป็น production URL
3. ทดสอบการชำระเงินจริง

### 6.2 Security
1. ใช้ HTTPS
2. ตั้งค่า CORS
3. ตรวจสอบ webhook signature

## 7. การบำรุงรักษา

### 7.1 Monitoring
- ตรวจสอบ Stripe Dashboard
- ดู logs ของ webhook events
- ตรวจสอบการชำระเงินที่ล้มเหลว

### 7.2 Updates
- อัปเดต Stripe SDK
- ตรวจสอบ PromptPay API changes
- ทดสอบการทำงานหลังอัปเดต

## 8. การแก้ไขปัญหา

### 8.1 PromptPay ไม่แสดง
- ตรวจสอบ Stripe account settings
- ตรวจสอบ payment_method_types
- ตรวจสอบ currency (ต้องเป็น 'thb')

### 8.2 QR Code ไม่แสดง
- ตรวจสอบ next_action
- ตรวจสอบ promptpay_display_qr_code
- ตรวจสอบ image_url_png

### 8.3 การชำระเงินไม่สำเร็จ
- ตรวจสอบ webhook events
- ตรวจสอบ payment intent status
- ตรวจสอบ logs

## 9. Support

### 9.1 Stripe Support
- [Stripe PromptPay Documentation](https://stripe.com/docs/payments/promptpay)
- [Stripe Support](https://support.stripe.com/)

### 9.2 PromptPay Support
- [PromptPay Official Website](https://www.promptpay.or.th/)
- [Bank of Thailand](https://www.bot.or.th/)

## 10. หมายเหตุสำคัญ

### 10.1 การใช้งานจริง
- ต้องใช้ Stripe live keys
- ต้องผ่านการยืนยันตัวตน
- ต้องตั้งค่าในประเทศไทย

### 10.2 การทดสอบ
- ใช้ Stripe test keys
- ใช้ QR Code จำลอง
- ทดสอบใน development environment

### 10.3 การ Deploy
- เปลี่ยนเป็น live keys
- ตั้งค่า production webhook
- ทดสอบการชำระเงินจริง 