import { NextResponse } from 'next/server';
import { buildApiUrl } from '@/lib/api-config';
import { createBooking } from '../bookingsApi.js';

export async function POST(request) {
  try {
    const bookingData = await request.json();
    
    // Always process through external API to save to database
    const result = await createBooking(bookingData);
    
    return NextResponse.json(result);
  } catch (error) {
    console.error('Error in booking API:', error);
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const bookingId = searchParams.get('booking-id');
    
    // For now, return a simple response since we don't have the full Bookings class
    // You may need to implement these methods or use a different approach
    return NextResponse.json({ 
      message: 'GET bookings endpoint - implementation needed',
      bookingId: bookingId || null 
    });
  } catch (error) {
    console.error('Error in booking API:', error);
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
} 