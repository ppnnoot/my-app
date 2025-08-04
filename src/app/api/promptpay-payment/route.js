import { NextResponse } from 'next/server';
import Stripe from 'stripe';

// Only initialize Stripe if we're not in a build environment
const stripe = process.env.STRIPE_SECRET_KEY ? new Stripe(process.env.STRIPE_SECRET_KEY) : null;

// Vehicle data for reference
const vehicles = [
  {
    id: "toyota-alphard",
    name: "Toyota Alphard",
    type: "Luxury Van"
  },
  {
    id: "mercedes-v-class",
    name: "Mercedes-Benz V-Class",
    type: "Premium Van"
  },
  {
    id: "lexus-lm",
    name: "Lexus LM",
    type: "Ultra Luxury Van"
  },
  {
    id: "toyota-vellfire",
    name: "Toyota Vellfire",
    type: "Luxury Van"
  }
];

export async function POST(request) {
  console.log('🔄 POST /api/promptpay-payment called');
  
  // Check if Stripe is initialized
  if (!stripe) {
    return NextResponse.json(
      { error: 'Stripe is not configured' },
      { status: 500 }
    );
  }
  
  try {
    const bookingData = await request.json();
    
    // Validate required fields
    if (!bookingData.service || !bookingData.vehicleType || !bookingData.totalPrice) {
      throw new Error('Missing required booking data');
    }
    
    // Get vehicle name
    const selectedVehicle = vehicles.find(v => v.id === bookingData.vehicleType);
    const vehicleName = selectedVehicle ? selectedVehicle.name : 'รถตู้';
    
    console.log('💳 Creating PromptPay Payment Intent...');
    
    // สร้าง Payment Intent สำหรับ PromptPay จริง
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(bookingData.totalPrice * 100),
      currency: 'thb',
      payment_method_types: ['promptpay'], // ใช้ PromptPay จริง
      description: `การจองรถตู้ - ${vehicleName} - ${bookingData.pickupLocation} ไป ${bookingData.dropoffLocation}`,
      metadata: {
        customerName: bookingData.name,
        customerEmail: bookingData.email,
        customerPhone: bookingData.phone,
        serviceType: bookingData.service,
        vehicleType: bookingData.vehicleType,
        vehicleName: vehicleName,
        pickupLocation: bookingData.pickupLocation,
        dropoffLocation: bookingData.dropoffLocation,
        date: bookingData.date,
        time: bookingData.time,
        hours: bookingData.hours?.toString() || '',
        passengers: bookingData.passengers?.toString() || '1',
        specialRequests: bookingData.specialRequests || '',
        totalPrice: bookingData.totalPrice.toString(),
        bookingData: JSON.stringify(bookingData),
      },
      // การตั้งค่าสำหรับ PromptPay
      payment_method_options: {
        promptpay: {
          setup_future_usage: 'off_session',
        },
      },
    });

    console.log('✅ PromptPay Payment Intent created:');
    console.log('  - Payment Intent ID:', paymentIntent.id);
    console.log('  - Status:', paymentIntent.status);
    
    // สร้าง QR Code สำหรับ PromptPay
    const qrCodeData = {
      paymentIntentId: paymentIntent.id,
      amount: bookingData.totalPrice,
      qrCodeUrl: paymentIntent.next_action?.promptpay_display_qr_code?.image_url_png || 
                 `https://api.qrserver.com/v1/create-qr-code/?size=256x256&data=KnoVan-${paymentIntent.id}-${bookingData.totalPrice}`,
      status: paymentIntent.status,
      isRealPromptPay: true,
    };
    
    return NextResponse.json(qrCodeData);
    
  } catch (error) {
    console.error('❌ Error creating PromptPay Payment Intent:');
    console.error('  - Message:', error.message);
    console.error('  - Stack:', error.stack);
    
    // ถ้า PromptPay ไม่รองรับ ให้ fallback ไปใช้ card
    if (error.message.includes('promptpay') || error.message.includes('PromptPay')) {
      console.log('⚠️ PromptPay not supported, falling back to card payment');
      return NextResponse.json(
        { 
          error: 'PromptPay is not available. Please use card payment instead.',
          fallbackToCard: true 
        },
        { status: 400 }
      );
    }
    
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}

// API endpoint สำหรับตรวจสอบสถานะการชำระเงิน PromptPay
export async function GET(request) {
  // Check if Stripe is initialized
  if (!stripe) {
    return NextResponse.json(
      { error: 'Stripe is not configured' },
      { status: 500 }
    );
  }
  
  const { searchParams } = new URL(request.url);
  const paymentIntentId = searchParams.get('payment_intent_id');
  
  if (!paymentIntentId) {
    return NextResponse.json(
      { error: 'Payment Intent ID is required' },
      { status: 400 }
    );
  }
  
  try {
    const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);
    
    return NextResponse.json({
      id: paymentIntent.id,
      status: paymentIntent.status,
      amount: paymentIntent.amount,
      currency: paymentIntent.currency,
      nextAction: paymentIntent.next_action,
    });
    
  } catch (error) {
    console.error('❌ Error retrieving Payment Intent:', error);
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
} 