import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import { sendPaymentConfirmation } from '@/lib/emailService';

// Only initialize Stripe if we're not in a build environment
const stripe = process.env.STRIPE_SECRET_KEY ? new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: '2024-12-18.acacia',
}) : null;

const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;

export async function POST(request) {
  // Check if Stripe is initialized
  if (!stripe) {
    return NextResponse.json(
      { error: 'Stripe is not configured' },
      { status: 500 }
    );
  }
  
  const body = await request.text();
  const sig = request.headers.get('stripe-signature');

  let event;

  try {
    event = stripe.webhooks.constructEvent(body, sig, endpointSecret);
  } catch (err) {
    console.error('Webhook signature verification failed:', err.message);
    return NextResponse.json({ error: 'Webhook signature verification failed' }, { status: 400 });
  }

  console.log('📡 Webhook event received:', event.type);

  // Handle the event
  switch (event.type) {
    case 'checkout.session.completed':
      const session = event.data.object;
      console.log('✅ Checkout session completed:', session.id);
      
      try {
        // ตรวจสอบ metadata
        if (!session.metadata) {
          console.error('❌ No metadata found in session');
          throw new Error('No metadata found in session');
        }

        // ดึงข้อมูลจาก session
        const customerName = session.metadata.customerName || session.customer_details?.name || 'Unknown';
        const customerEmail = session.customer_email || session.customer_details?.email || session.metadata.customerEmail || 'unknown@example.com';
        const amount = session.amount_total / 100; // แปลงจาก cents เป็น baht
        const currency = session.currency.toUpperCase();
        const bookingId = session.metadata.bookingId || session.id;
        
        // ดึงข้อมูลการจองจาก metadata
        const bookingDetails = {
          serviceType: session.metadata.serviceType,
          pickupLocation: session.metadata.pickupLocation,
          dropoffLocation: session.metadata.dropoffLocation,
          date: session.metadata.date,
          time: session.metadata.time,
          passengers: session.metadata.passengers ? parseInt(session.metadata.passengers) : undefined,
          customerPhone: session.metadata.customerPhone,
          specialRequests: session.metadata.specialRequests
        };

        console.log('📋 Payment data extracted:', {
          customerName,
          customerEmail,
          amount,
          currency,
          bookingId,
          bookingDetails
        });

        // ส่งอีเมลยืนยันการชำระเงิน
        try {
          await sendPaymentConfirmation({
            to: customerEmail,
            name: customerName,
            amount: amount,
            currency: currency,
            bookingId: bookingId,
            paidAt: new Date(),
            bookingDetails: bookingDetails
          });
          console.log('📧 Payment confirmation email sent successfully');
        } catch (emailError) {
          console.error('❌ Failed to send payment confirmation email:', emailError);
          // ไม่ throw error เพราะการส่งอีเมลไม่ควรทำให้การชำระเงินล้มเหลว
        }
        
        console.log('✅ Payment processed successfully:', {
          sessionId: session.id,
          amount: amount,
          customerEmail: customerEmail
        });
        
      } catch (error) {
        console.error('❌ Error processing checkout session:', error);
      }
      
      break;
      
    case 'payment_intent.succeeded':
      const paymentIntent = event.data.object;
      console.log('✅ Payment intent succeeded:', paymentIntent.id);
      
      try {
        // ตรวจสอบ metadata
        if (!paymentIntent.metadata) {
          console.error('❌ No metadata found in payment intent');
          throw new Error('No metadata found in payment intent');
        }

        // ดึงข้อมูลจาก payment intent
        const customerName = paymentIntent.metadata.customerName || 'Unknown';
        const customerEmail = paymentIntent.metadata.customerEmail || 'unknown@example.com';
        const amount = paymentIntent.amount / 100; // แปลงจาก cents เป็น baht
        const currency = paymentIntent.currency.toUpperCase();
        const bookingId = paymentIntent.metadata.bookingId || paymentIntent.id;
        
        // ดึงข้อมูลการจองจาก metadata
        const bookingDetails = {
          serviceType: paymentIntent.metadata.serviceType,
          pickupLocation: paymentIntent.metadata.pickupLocation,
          dropoffLocation: paymentIntent.metadata.dropoffLocation,
          date: paymentIntent.metadata.date,
          time: paymentIntent.metadata.time,
          passengers: paymentIntent.metadata.passengers ? parseInt(paymentIntent.metadata.passengers) : undefined,
          customerPhone: paymentIntent.metadata.customerPhone,
          specialRequests: paymentIntent.metadata.specialRequests
        };

        console.log('📋 PromptPay payment data extracted:', {
          customerName,
          customerEmail,
          amount,
          currency,
          bookingId,
          bookingDetails
        });

        // ส่งอีเมลยืนยันการชำระเงิน
        try {
          await sendPaymentConfirmation({
            to: customerEmail,
            name: customerName,
            amount: amount,
            currency: currency,
            bookingId: bookingId,
            paidAt: new Date(),
            bookingDetails: bookingDetails
          });
          console.log('📧 PromptPay payment confirmation email sent successfully');
        } catch (emailError) {
          console.error('❌ Failed to send PromptPay payment confirmation email:', emailError);
        }
        
        console.log('✅ PromptPay payment processed successfully:', {
          paymentIntentId: paymentIntent.id,
          amount: amount,
          customerEmail: customerEmail
        });
        
      } catch (error) {
        console.error('❌ Error processing payment intent:', error);
      }
      
      break;
      
    case 'payment_intent.payment_failed':
      const failedPaymentIntent = event.data.object;
      console.log('❌ Payment intent failed:', failedPaymentIntent.id);
      
      try {
        // บันทึกการชำระเงินที่ล้มเหลว
        console.log('📋 Failed payment data:', {
          paymentIntentId: failedPaymentIntent.id,
          amount: failedPaymentIntent.amount / 100,
          currency: failedPaymentIntent.currency,
          failureReason: failedPaymentIntent.last_payment_error?.message || 'Unknown error'
        });
        
        // ส่งอีเมลแจ้งการชำระเงินล้มเหลว (ถ้าต้องการ)
        const customerEmail = failedPaymentIntent.metadata?.customerEmail;
        if (customerEmail) {
          console.log('📧 Sending payment failure notification to:', customerEmail);
        }
        
      } catch (error) {
        console.error('❌ Error processing failed payment intent:', error);
      }
      
      break;
      
    case 'checkout.session.expired':
      const expiredSession = event.data.object;
      console.log('⏰ Checkout session expired:', expiredSession.id);
      break;
      
    default:
      console.log(`ℹ️ Unhandled event type: ${event.type}`);
  }

  return NextResponse.json({ received: true });
} 