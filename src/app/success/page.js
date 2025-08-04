"use client"
import { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { CheckCircle, Calendar, MapPin, Users, CreditCard, Clock, Car } from 'lucide-react';

function SuccessPageContent() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get('session_id');
  const bookingId = searchParams.get('booking-id');
  const [bookingDetails, setBookingDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Function to save booking data to localStorage
  const saveBookingToLocalStorage = (bookingData) => {
    try {
      // Get existing bookings or initialize empty array
      const existingBookings = JSON.parse(localStorage.getItem('knovan_bookings') || '[]');
      
      // Create booking object with timestamp
      const bookingToSave = {
        ...bookingData,
        savedAt: new Date().toISOString(),
        id: bookingData.bookingId || bookingData.id || Date.now().toString()
      };
      
      // Add new booking to the beginning of the array
      existingBookings.unshift(bookingToSave);
      
      // Keep only the last 10 bookings to avoid localStorage getting too large
      const trimmedBookings = existingBookings.slice(0, 10);
      
      // Save to localStorage
      localStorage.setItem('knovan_bookings', JSON.stringify(trimmedBookings));
      
      console.log('✅ Booking saved to localStorage:', bookingToSave);
    } catch (error) {
      console.error('❌ Error saving booking to localStorage:', error);
    }
  };

  // Function to find booking in localStorage by booking-id
  const findBookingInLocalStorage = (searchBookingId) => {
    try {
      const savedBookings = JSON.parse(localStorage.getItem('knovan_bookings') || '[]');
      console.log('🔍 Searching for booking ID:', searchBookingId);
      console.log('📋 Available bookings:', savedBookings);
      
      const foundBooking = savedBookings.find(booking => booking.id === searchBookingId);
      
      if (foundBooking) {
        console.log('✅ Found booking in localStorage:', foundBooking);
        return foundBooking;
      } else {
        console.log('❌ Booking not found in localStorage');
        return null;
      }
    } catch (error) {
      console.error('❌ Error searching localStorage:', error);
      return null;
    }
  };

  useEffect(() => {
    console.log('🔍 Success page useEffect triggered');
    console.log('🎫 Session ID:', sessionId);
    console.log('🆔 Booking ID:', bookingId);
    
    if (sessionId) {
      console.log('🎉 Processing Stripe success...');
      // Handle Stripe success - create booking and get details
      handleStripeSuccess(sessionId);
    } else if (bookingId) {
      console.log('📋 Processing booking ID from localStorage...');
      // First try to find in localStorage
      const localBooking = findBookingInLocalStorage(bookingId);
      
      if (localBooking) {
        console.log('✅ Found booking in localStorage, displaying...');
        setBookingDetails(localBooking);
        setLoading(false);
      } else {
        console.log('📋 Booking not found in localStorage, fetching from API...');
        // If not found in localStorage, try API
        fetchBookingDetails(bookingId);
      }
    } else {
      console.error('❌ No session ID or booking ID provided');
      setError('No session ID or booking ID provided');
      setLoading(false);
    }
  }, [sessionId, bookingId]);

  const handleStripeSuccess = async (sessionId) => {
    console.log('🎉 Stripe success handler called');
    console.log('🎫 Session ID:', sessionId);
    
    try {
      console.log('📡 Fetching session details from Stripe...');
      
      // Get session details from Stripe
      const response = await fetch('/api/stripe/session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ sessionId }),
      });

      console.log('📡 Response status:', response.status);
      console.log('📡 Response ok:', response.ok);

      if (!response.ok) {
        const errorText = await response.text();
        console.error('❌ API Error:', errorText);
        throw new Error('Failed to get session details');
      }

      const data = await response.json();
      console.log('data', data);
      
      setBookingDetails(data);
      
      // Save booking data to localStorage after successful payment
      saveBookingToLocalStorage(data);
      
      setLoading(false);
    } catch (error) {
      console.error('❌ Error handling Stripe success:', error);
      console.error('❌ Error stack:', error.stack);
      setError(error.message);
      setLoading(false);
    }
  };

  const fetchBookingDetails = async (bookingId) => {
    console.log('📋 Fetching booking details for ID:', bookingId);
    
    try {
      console.log('📡 Fetching from API...');
      const response = await fetch(`/api/bookings?booking-id=${bookingId}`);
      
      console.log('📡 Response status:', response.status);
      console.log('📡 Response ok:', response.ok);
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('❌ API Error:', errorText);
        throw new Error('Booking not found');
      }
      
      const data = await response.json();
      console.log('✅ Booking details received:', data);
      
      setBookingDetails(data);
      
      // Save booking data to localStorage after successful booking
      saveBookingToLocalStorage(data);
      
      setLoading(false);
    } catch (error) {
      console.error('❌ Error fetching booking:', error);
      console.error('❌ Error stack:', error.stack);
      setError(error.message);
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">กำลังโหลดข้อมูลการจอง...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="w-20 h-20 bg-red-100 dark:bg-red-900 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="h-10 w-10 text-red-600 dark:text-red-400" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            เกิดข้อผิดพลาด
          </h1>
          <p className="text-gray-600 dark:text-gray-300 mb-6">
            {error}
          </p>
          <Button
            onClick={() => window.location.href = '/booking'}
            className="bg-blue-600 hover:bg-blue-700"
          >
            กลับไปหน้าจอง
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="max-w-2xl mx-auto">
          {/* Success Header */}
          <div className="text-center mb-8">
            <div className="w-20 h-20 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="h-10 w-10 text-green-600 dark:text-green-400" />
            </div>
            <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              การจองสำเร็จ!
            </h1>
            {/* <p className="text-lg text-gray-600 dark:text-gray-300">
              ขอบคุณที่เลือกใช้บริการ KnoVan การจองของคุณได้รับการยืนยันแล้ว
            </p> */}
          </div>

          {/* Booking Details Card */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 mb-8">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
              Booking Details
            </h2>
            
            <div className="space-y-4">
              {/* Booking ID */}
              <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <div className="flex items-center gap-3">
                  <CreditCard className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                  <span className="text-gray-600 dark:text-gray-300">Booking ID:</span>
                </div>
                <span className="font-mono font-semibold text-gray-900 dark:text-white">
                  {bookingDetails?.id || bookingDetails?.bookingId}
                </span>
              </div>

              {/* Service Type */}
              <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <div className="flex items-center gap-3">
                  <Calendar className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                  <span className="text-gray-600 dark:text-gray-300">บริการ:</span>
                </div>
                <span className="font-semibold text-gray-900 dark:text-white">
                  {(bookingDetails?.service || bookingDetails?.serviceType) === 'hourly-service' ? 'รายชั่วโมง' : 'เหมาวัน'}
                </span>
              </div>

              {/* Vehicle Type */}
              {bookingDetails?.vehicleType && (
                <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <div className="flex items-center gap-3">
                    <Car className="h-5 w-5 text-green-600 dark:text-green-400" />
                    <span className="text-gray-600 dark:text-gray-300">รถ:</span>
                  </div>
                  <span className="font-semibold text-gray-900 dark:text-white">
                    {bookingDetails.vehicleType}
                  </span>
                </div>
              )}

              {/* Hours for hourly service */}
              {((bookingDetails?.service || bookingDetails?.serviceType) === 'hourly-service') && bookingDetails?.hours && (
                <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <div className="flex items-center gap-3">
                    <Clock className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                    <span className="text-gray-600 dark:text-gray-300">จำนวนชั่วโมง:</span>
                  </div>
                  <span className="font-semibold text-gray-900 dark:text-white">
                    {bookingDetails.hours} ชั่วโมง
                  </span>
                </div>
              )}

              {/* Locations */}
              <div className="space-y-3">
                <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <div className="flex items-center gap-3">
                    <MapPin className="h-5 w-5 text-green-600 dark:text-green-400" />
                    <span className="text-gray-600 dark:text-gray-300">จุดรับ:</span>
                  </div>
                  <span className="font-medium text-gray-900 dark:text-white text-right">
                    {bookingDetails?.pickupLocation}
                  </span>
                </div>
                
                <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <div className="flex items-center gap-3">
                    <MapPin className="h-5 w-5 text-red-600 dark:text-red-400" />
                    <span className="text-gray-600 dark:text-gray-300">จุดส่ง:</span>
                  </div>
                  <span className="font-medium text-gray-900 dark:text-white text-right">
                    {bookingDetails?.dropoffLocation}
                  </span>
                </div>
              </div>

              {/* Date & Time */}
              <div className="grid grid-cols-2 gap-3">
                <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <span className="text-gray-600 dark:text-gray-300">วันที่:</span>
                  <span className="font-medium text-gray-900 dark:text-white">
                    {bookingDetails?.date}
                  </span>
                </div>
                
                <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <span className="text-gray-600 dark:text-gray-300">เวลา:</span>
                  <span className="font-medium text-gray-900 dark:text-white">
                    {bookingDetails?.time}
                  </span>
                </div>
              </div>

              {/* Passengers */}
              <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <div className="flex items-center gap-3">
                  <Users className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                  <span className="text-gray-600 dark:text-gray-300">จำนวนผู้โดยสาร:</span>
                </div>
                <span className="font-medium text-gray-900 dark:text-white">
                  {bookingDetails?.passengers} คน
                </span>
              </div>

              {/* Total Price */}
              {bookingDetails?.totalPrice && (
                <div className="flex items-center justify-between p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                  <div className="flex items-center gap-3">
                    <CreditCard className="h-5 w-5 text-green-600 dark:text-green-400" />
                    <span className="text-gray-600 dark:text-gray-300">ราคารวม:</span>
                  </div>
                  <span className="font-bold text-green-600 dark:text-green-400">
                    ฿{bookingDetails.totalPrice.toLocaleString()}
                  </span>
                </div>
              )}

              {/* Payment Status */}
              {bookingDetails?.paymentStatus && (
                <div className="flex items-center justify-between p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                  <div className="flex items-center gap-3">
                    <CheckCircle className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                    <span className="text-gray-600 dark:text-gray-300">สถานะการชำระเงิน:</span>
                  </div>
                  <span className={`font-semibold ${
                    bookingDetails.paymentStatus === 'paid' 
                      ? 'text-green-600 dark:text-green-400' 
                      : 'text-yellow-600 dark:text-yellow-400'
                  }`}>
                    {bookingDetails.paymentStatus === 'paid' ? 'ชำระแล้ว' : 'รอชำระ'}
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Customer Information */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 mb-8">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              ข้อมูลติดต่อ
            </h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-300">ชื่อ:</span>
                <span className="font-medium text-gray-900 dark:text-white">
                  {bookingDetails?.name || bookingDetails?.customerName}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-300">อีเมล:</span>
                <span className="font-medium text-gray-900 dark:text-white">
                  {bookingDetails?.email || bookingDetails?.customerEmail}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-300">เบอร์โทร:</span>
                <span className="font-medium text-gray-900 dark:text-white">
                  {bookingDetails?.phone || bookingDetails?.customerPhone}
                </span>
              </div>
              {bookingDetails?.specialRequests && (
                <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                  <span className="text-sm text-gray-600 dark:text-gray-300">คำขอพิเศษ:</span>
                  <p className="text-gray-900 dark:text-white mt-1">
                    {bookingDetails.specialRequests}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Next Steps */}
          {/* <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-6 mb-8">
            <h3 className="text-lg font-semibold text-blue-900 dark:text-blue-100 mb-3">
              ขั้นตอนต่อไป
            </h3>
            <ul className="space-y-2 text-blue-800 dark:text-blue-200">
              <li className="flex items-start gap-2">
                <span className="text-blue-600 dark:text-blue-400">•</span>
                คุณจะได้รับอีเมลยืนยันพร้อมรายละเอียดการจองทั้งหมด
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-600 dark:text-blue-400">•</span>
                คนขับจะติดต่อคุณ 30 นาทีก่อนเวลารับ
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-600 dark:text-blue-400">•</span>
                กรุณาเตรียมบัตรประชาชนสำหรับการตรวจสอบ
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-600 dark:text-blue-400">•</span>
                หากต้องการเปลี่ยนแปลง ติดต่อเราได้ที่ support@knovan.com
              </li>
            </ul>
          </div> */}

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              onClick={() => window.location.href = '/booking'}
              className="bg-blue-600 hover:bg-blue-700"
            >
              จองรถอีกครั้ง
            </Button>
            <Button
              variant="outline"
              onClick={() => window.location.href = '/'}
            >
              กลับหน้าหลัก
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function SuccessPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">กำลังโหลด...</p>
        </div>
      </div>
    }>
      <SuccessPageContent />
    </Suspense>
  );
} 