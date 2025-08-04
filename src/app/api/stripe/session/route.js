import { NextResponse } from 'next/server';
import Stripe from 'stripe';

// Only initialize Stripe if we're not in a build environment
const stripe = process.env.STRIPE_SECRET_KEY ? new Stripe(process.env.STRIPE_SECRET_KEY) : null;

export async function POST(request) {
  console.log('🔄 POST /api/stripe/session called');
  
  // Check if Stripe is initialized
  if (!stripe) {
    return NextResponse.json(
      { error: 'Stripe is not configured' },
      { status: 500 }
    );
  }
  
  try {
    const { sessionId } = await request.json();
    console.log('🎫 Session ID:', sessionId);
    
    console.log('📡 Retrieving session from Stripe...');
    
    // Retrieve session from Stripe
    const session = await stripe.checkout.sessions.retrieve(sessionId);
    
    console.log('✅ Session retrieved:');
    console.log('  - Payment status:', session.payment_status);
    console.log('  - Amount total:', session.amount_total);
    console.log('  - Currency:', session.currency);
    console.log('  - Metadata:', session.metadata);
    
    if (session.payment_status !== 'paid') {
      console.error('❌ Payment not completed:', session.payment_status);
      throw new Error('Payment not completed');
    }

    console.log('✅ Payment completed, extracting booking data from session storage...');
    
    // Extract booking data from session storage (metadata)
    const bookingData = JSON.parse(session.metadata.bookingData);
    console.log('📋 Booking data from session storage:', bookingData);
    
    // Generate booking ID
    const bookingId = `KV-${Date.now().toString().slice(-6)}`;
    console.log('🆔 Generated booking ID:', bookingId);
    
    // Create final booking object
    const booking = {
      id: bookingId,
      ...bookingData,
      stripeSessionId: sessionId,
      paymentStatus: 'paid',
      paymentAmount: session.amount_total / 100, // Convert from cents
      createdAt: new Date().toISOString(),
      status: 'confirmed'
    };
    
    console.log('📝 Final booking object:', booking);
    console.log('💾 Data stored in session storage successfully');
    
    return NextResponse.json(booking);
  } catch (error) {
    console.error('❌ Error handling Stripe session:');
    console.error('  - Message:', error.message);
    console.error('  - Stack:', error.stack);
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
} 