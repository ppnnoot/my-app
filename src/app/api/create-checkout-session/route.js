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
  console.log('🔄 POST /api/create-checkout-session called');
  
  // Check if Stripe is initialized
  if (!stripe) {
    return NextResponse.json(
      { error: 'Stripe is not configured' },
      { status: 500 }
    );
  }
  
  try {
    const bookingData = await request.json();
    
    console.log('📋 Received booking data:', bookingData);
    console.log('🔧 Environment check:');
    console.log('  - STRIPE_SECRET_KEY:', process.env.STRIPE_SECRET_KEY ? '✅ Set' : '❌ Missing');
    console.log('  - NEXT_PUBLIC_BASE_URL:', process.env.NEXT_PUBLIC_BASE_URL || '❌ Missing');
    
    // Validate required fields
    if (!bookingData.service || !bookingData.vehicleType || !bookingData.totalPrice) {
      console.error('❌ Missing required fields:');
      console.error('  - service:', bookingData.service);
      console.error('  - vehicleType:', bookingData.vehicleType);
      console.error('  - totalPrice:', bookingData.totalPrice);
      throw new Error('Missing required booking data');
    }
    
    // Get vehicle name
    const selectedVehicle = vehicles.find(v => v.id === bookingData.vehicleType);
    const vehicleName = selectedVehicle ? selectedVehicle.name : 'รถตู้';
    
    console.log('🚗 Vehicle name:', vehicleName);
    console.log('💰 Total price:', bookingData.totalPrice);
    console.log('💱 Amount in cents:', Math.round(bookingData.totalPrice * 100));
    
    // Validate Stripe configuration
    if (!process.env.STRIPE_SECRET_KEY) {
      console.error('❌ Stripe secret key not configured');
      throw new Error('Stripe secret key not configured');
    }
    
    if (!process.env.NEXT_PUBLIC_BASE_URL) {
      console.error('❌ Base URL not configured');
      throw new Error('Base URL not configured');
    }
    
    console.log('✅ All validations passed, creating Stripe session...');
    
    // Create Stripe checkout session with card payment
    const sessionData = {
      // payment_method_types: ['card'],  // ใช้ card เท่านั้นเพื่อความเสถียร
      payment_method_types: ['card', 'promptpay'],
      line_items: [
        {
          price_data: {
            currency: 'thb',
            product_data: {
              name: `การจองรถตู้ - ${bookingData.service === 'hourly-service' ? 'รายชั่วโมง' : 'เหมาวัน'}`,
              description: `${vehicleName} - ${bookingData.pickupLocation} ไป ${bookingData.dropoffLocation}`,
            },
            unit_amount: Math.round(bookingData.totalPrice * 100), // Convert to cents and ensure integer
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `${process.env.NEXT_PUBLIC_BASE_URL}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL}/booking`,
      metadata: {
        // ปรับ metadata ให้ตรงกับ webhook
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
        // เก็บข้อมูลทั้งหมดไว้ใน metadata
        bookingData: JSON.stringify(bookingData),
      },
      // กำหนดภาษาไทยสำหรับ UI
      locale: 'th',
      // เพิ่มตัวเลือกการแสดงผล
      customer_creation: 'always', // สร้าง customer record
      // เพิ่ม billing address collection (ถ้าต้องการ)
      billing_address_collection: 'auto',
    };
    
    console.log('📤 Stripe session data:', sessionData);
    
    const session = await stripe.checkout.sessions.create(sessionData);

    console.log('✅ Stripe session created successfully:');
    console.log('  - Session ID:', session.id);
    console.log('  - URL:', session.url);
    console.log('  - Amount:', session.amount_total);
    console.log('  - Payment Methods:', session.payment_method_types);
    
    return NextResponse.json({ 
      sessionId: session.id,
      url: session.url,
      paymentMethods: session.payment_method_types 
    });
  } catch (error) {
    console.error('❌ Error creating checkout session:');
    console.error('  - Message:', error.message);
    console.error('  - Stack:', error.stack);
    
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}

// เพิ่ม API endpoint สำหรับสร้าง Payment Intent สำหรับ QR Code
export async function PUT(request) {
  console.log('🔄 PUT /api/create-checkout-session called (QR Code Payment)');
  
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
    
    console.log('💳 Creating QR Code Payment Intent...');
    
    // สร้าง Payment Intent สำหรับ QR Code
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(bookingData.totalPrice * 100),
      currency: 'thb',
      payment_method_types: ['card'], // ใช้ card แทน promptpay เพื่อความเสถียร
      description: `การจองรถตู้ - ${vehicleName} - ${bookingData.pickupLocation} ไป ${bookingData.dropoffLocation}`,
      metadata: {
        // ปรับ metadata ให้ตรงกับ webhook
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
        // เก็บข้อมูลทั้งหมดไว้ใน metadata
        bookingData: JSON.stringify(bookingData),
      },
      // เพิ่มการตั้งค่าสำหรับ QR Code
      setup_future_usage: 'off_session',
      confirm: false, // ไม่ confirm ทันที
    });

    console.log('✅ Payment Intent created:');
    console.log('  - Payment Intent ID:', paymentIntent.id);
    console.log('  - Client Secret:', paymentIntent.client_secret ? '✅ Present' : '❌ Missing');
    console.log('  - Status:', paymentIntent.status);
    
    return NextResponse.json({
      paymentIntentId: paymentIntent.id,
      clientSecret: paymentIntent.client_secret,
      status: paymentIntent.status,
      amount: paymentIntent.amount,
      currency: paymentIntent.currency,
    });
    
  } catch (error) {
    console.error('❌ Error creating Payment Intent:');
    console.error('  - Message:', error.message);
    console.error('  - Stack:', error.stack);
    
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}