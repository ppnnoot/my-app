"use client"
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { VehicleGallery } from "@/components/vehicle-gallery";
import { 
  Calendar,
  Clock,
  MapPin,
  Users,
  Car,
  CreditCard,
  ArrowLeft,
  ArrowRight,
  CheckCircle,
  Phone,
  Mail,
  Loader2
} from "lucide-react";

export default function BookingPage() {
  const TOTAL_STEPS = 5;
  const [currentStep, setCurrentStep] = useState(1);
  const [isProcessing, setIsProcessing] = useState(false);
  
  const [bookingData, setBookingData] = useState({
    service: "",
    vehicleType: "",
    pickupLocation: "",
    dropoffLocation: "",
    date: "",
    time: "",
    hours: 1,
    passengers: 1,
    name: "",
    email: "",
    phone: "",
    specialRequests: ""
  });

  const services = [
    {
      id: "hourly-service",
      title: "รายชั่วโมง",
      description: "บริการแบบรายชั่วโมง - เลือกจำนวนชั่วโมงที่ต้องการ",
      icon: <Clock className="h-8 w-8" />,
      price: "฿500/ชั่วโมง"
    },
    {
      id: "daily-service",
      title: "เหมาวัน",
      description: "บริการแบบเหมาวัน - ใช้บริการตลอดทั้งวัน",
      icon: <Calendar className="h-8 w-8" />,
      price: "฿3,500/วัน"
    },
  ];

  const timeSlots = [
    "06:00", "06:30", "07:00", "07:30", "08:00", "08:30", "09:00", "09:30",
    "10:00", "10:30", "11:00", "11:30", "12:00", "12:30", "13:00", "13:30",
    "14:00", "14:30", "15:00", "15:30", "16:00", "16:30", "17:00", "17:30",
    "18:00", "18:30", "19:00", "19:30", "20:00", "20:30", "21:00", "21:30"
  ];

  const vehicles = [
    {
      id: "toyota-alphard",
      name: "Toyota Alphard",
      type: "Luxury Van",
      capacity: 7,
      price: "฿800/ชั่วโมง",
      dailyPrice: "฿5,500/วัน",
      image: "/images/alphard/1.jpg",
      images: [
        "/images/alphard/1.jpg",
        "/images/alphard/2.jpg",
        "/images/alphard/TOYOTA ALPHARD.mp4"
      ],
      features: ["ที่นั่งหนัง", "ระบบเสียง", "แอร์เย็น", "WiFi", "ชาร์จมือถือ"],
      description: "รถตู้หรูหรา 7 ที่นั่ง พร้อมอุปกรณ์ครบครัน"
    },
    {
      id: "mercedes-v-class",
      name: "Mercedes-Benz V-Class",
      type: "Premium Van",
      capacity: 8,
      price: "฿1,000/ชั่วโมง",
      dailyPrice: "฿7,000/วัน",
      image: "/images/benz/1.jpg",
      images: [
        "/images/benz/1.jpg",
        "/images/benz/2.jpg",
        "/images/benz/3.jpg",
        "/images/benz/4.jpg",
        "/images/benz/Mercedes Benz V Class 2025 Van with Luxury Interior.mp4"
      ],
      features: ["ที่นั่งหนัง", "ระบบเสียง", "แอร์เย็น", "WiFi", "ชาร์จมือถือ", "ห้องน้ำ"],
      description: "รถตู้พรีเมียม 8 ที่นั่ง หรูหราสุดยอด"
    },
    {
      id: "lexus-lm",
      name: "Lexus LM",
      type: "Ultra Luxury Van",
      capacity: 6,
      price: "฿1,200/ชั่วโมง",
      dailyPrice: "฿8,500/วัน",
      image: "/images/lexus/1.jpg",
      images: [
        "/images/lexus/1.jpg",
        "/images/lexus/2.jpg",
        "/images/lexus/3.jpg",
        "/images/lexus/The Story of LM - short ver-.mp4"
      ],
      features: ["ที่นั่งหนัง", "ระบบเสียง", "แอร์เย็น", "WiFi", "ชาร์จมือถือ", "ห้องน้ำ", "ตู้เย็น"],
      description: "รถตู้หรูหราสุดยอด 6 ที่นั่ง พร้อมอุปกรณ์ครบครัน"
    },
    {
      id: "toyota-vellfire",
      name: "Toyota Vellfire",
      type: "Luxury Van",
      capacity: 7,
      price: "฿900/ชั่วโมง",
      dailyPrice: "฿6,500/วัน",
      image: "/images/vellfire/1.jpg",
      images: [
        "/images/vellfire/1.jpg",
        "/images/vellfire/2.jpg",
        "/images/vellfire/The All New Toyota Vellfire.mp4"
      ],
      features: ["ที่นั่งหนัง", "ระบบเสียง", "แอร์เย็น", "WiFi", "ชาร์จมือถือ"],
      description: "รถตู้หรูหรา 7 ที่นั่ง สะดวกสบาย"
    }
  ];

  const handleInputChange = (field, value) => {
    setBookingData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleServiceSelect = (serviceId) => {
    console.log('Service selected:', serviceId);
    setBookingData(prev => ({
      ...prev,
      service: serviceId
    }));
    setCurrentStep(2);
  };

  const handleVehicleSelect = (vehicleId) => {
    console.log('Vehicle selected:', vehicleId);
    setBookingData(prev => ({
      ...prev,
      vehicleType: vehicleId
    }));
    // setCurrentStep(3);
  };

  // Calculate total price
  const calculateTotalPrice = () => {
    if (!bookingData.service || !bookingData.vehicleType) return 0;
    
    const selectedVehicle = vehicles.find(v => v.id === bookingData.vehicleType);
    if (!selectedVehicle) return 0;
    
    if (bookingData.service === 'hourly-service') {
      return selectedVehicle.price.replace('฿', '').replace('/ชั่วโมง', '') * bookingData.hours;
    } else {
      return selectedVehicle.dailyPrice.replace('฿', '').replace('/วัน', '').replace(',', '');
    }
  };

  const totalPrice = calculateTotalPrice();

  const nextStep = () => {
    console.log('nextStep called, currentStep:', currentStep);
    if (currentStep < TOTAL_STEPS) {
      const newStep = currentStep + 1;
      console.log('Setting step to:', newStep);
      setCurrentStep(newStep);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  // Handle Stripe payment (Credit Card)
  const handleStripePayment = async () => {
    console.log('🚀 Starting Stripe payment process...');
    console.log('📋 Booking data:', bookingData);
    console.log('💰 Total price:', totalPrice);
    
    setIsProcessing(true);
    
    try {
      console.log('📡 Creating checkout session...');
      
      // Create checkout session
      const response = await fetch('/api/create-checkout-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...bookingData,
          totalPrice: totalPrice
        }),
      });

      console.log('📡 Response status:', response.status);
      console.log('📡 Response ok:', response.ok);

      if (!response.ok) {
        const errorData = await response.json();
        console.error('❌ API Error:', errorData);
        throw new Error(errorData.error || 'Failed to create checkout session');
      }

      const responseData = await response.json();
      console.log('✅ Checkout session created:', responseData);
      
      const { sessionId } = responseData;
      console.log('🎫 Session ID:', sessionId);
      
      // Load Stripe
      console.log('🔌 Loading Stripe...');
      // const stripe = await getStripeJs();
      // console.log('✅ Stripe loaded:', stripe);
      
      // Redirect to Stripe Checkout
      console.log('🔄 Redirecting to Stripe Checkout...');

      // const { error } = await stripe.redirectToCheckout({ sessionId });
      const error = null;
      const url = responseData.url;
      window.location.href = url;
      
      if (error) {
        console.error('❌ Stripe redirect error:', error);
        throw new Error(error.message);
      }
      
      console.log('✅ Redirect successful');
    } catch (error) {
      console.error('❌ Payment error:', error);
      console.error('❌ Error stack:', error.stack);
      setIsProcessing(false);
      alert('เกิดข้อผิดพลาดในการชำระเงิน กรุณาลองใหม่อีกครั้ง');
    }
  };

  // Load Stripe.js
  const getStripeJs = async () => {
    const { loadStripe } = await import('@stripe/stripe-js');
    
    // Check if Stripe key is available
    const stripeKey = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY;
    
    if (!stripeKey) {
      console.error('❌ NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY is not defined');
      throw new Error('Stripe configuration is missing. Please check your environment variables.');
    }
    
    console.log('🔑 Stripe key found:', stripeKey.substring(0, 20) + '...');
    return loadStripe(stripeKey);
  };

  const selectedService = services.find(s => s.id === bookingData.service);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Progress Bar */}
        {currentStep <= TOTAL_STEPS && (
          <div className="mb-8 sm:mb-12">
            <div className="max-w-4xl mx-auto">
              <div className="relative">
                {/* Progress Line */}
                <div className="absolute top-6 left-0 right-0 h-1 bg-gray-200 dark:bg-gray-700 rounded-full">
                  <div 
                    className="h-1 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full transition-all duration-500 ease-in-out"
                    style={{ width: `${((currentStep - 1) / (TOTAL_STEPS - 1)) * 100}%` }}
                  />
                </div>
                
                {/* Steps */}
                <div className="relative flex justify-between">
                  {[
                    { step: 1, title: "บริการ"},
                    { step: 2, title: "เลือกรถ"},
                    { step: 3, title: "รายละเอียด"},
                    { step: 4, title: "ติดต่อ"},
                    { step: 5, title: "ชำระเงิน"}
                  ].map((item) => (
                    <div key={item.step} className="flex flex-col items-center">
                      <div className={`relative flex items-center justify-center w-8 h-8 sm:w-12 sm:h-12 rounded-full border-2 transition-all duration-300 ${
                        currentStep >= item.step 
                          ? 'bg-gradient-to-br from-blue-500 to-blue-600 border-blue-500 text-white shadow-lg shadow-blue-500/25' 
                          : 'bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 text-gray-400'
                      }`}>
                        {currentStep > item.step ? (
                          <CheckCircle className="h-4 w-4 sm:h-6 sm:w-6" />
                        ) : currentStep === item.step ? (
                          <span className="text-sm sm:text-lg font-semibold">{item.step}</span>
                        ) : (
                          <span className="text-sm sm:text-lg">{item.step}</span>
                        )}
                        
                        {/* Pulse animation for current step */}
                        {currentStep === item.step && (
                          <div className="absolute inset-0 rounded-full bg-blue-500 opacity-20" />
                        )}
                      </div>
                      
                      {/* Step Title */}
                      <div className="mt-2 sm:mt-3 text-center">
                        <p className={`text-xs sm:text-sm font-medium transition-colors duration-300 ${
                          currentStep >= item.step 
                            ? 'text-blue-600 dark:text-blue-400' 
                            : 'text-gray-500 dark:text-gray-400'
                        }`}>
                          {item.title}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Booking Form */}
        {currentStep <= TOTAL_STEPS && (
          <div className="max-w-4xl mx-auto">
            <div className="space-y-8">
              {/* Step 1: Service Selection */}
              {currentStep === 1 && (
                <div className="bg-white dark:bg-gray-800 rounded-lg p-4 sm:p-6 shadow-lg">
                  <h2 className="text-xl sm:text-2xl font-semibold text-gray-900 dark:text-white mb-4 sm:mb-6">
                    เลือกบริการ
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                    {services.map((service) => (
                      <div
                        key={service.id}
                        className={`flex flex-col p-4 sm:p-6 rounded-lg border-2 cursor-pointer transition-all ${
                          bookingData.service === service.id
                            ? 'border-blue-600 bg-blue-50 dark:bg-blue-900/20'
                            : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                        }`}
                        onClick={() => handleServiceSelect(service.id)}
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex items-center gap-3">
                            <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg">
                              <div className="text-blue-600 dark:text-blue-400">
                                {service.icon}
                              </div>
                            </div>
                            <div>
                              <h3 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-white">
                                {service.title}
                              </h3>
                              <p className="text-sm text-gray-600 dark:text-gray-300">
                                {service.description}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Step 2: Vehicle Selection */}
              {currentStep === 2 && (
                <div className="bg-white dark:bg-gray-800 rounded-lg p-4 sm:p-6 shadow-lg">
                  <h2 className="text-xl sm:text-2xl font-semibold text-gray-900 dark:text-white mb-4 sm:mb-6">
                    เลือกรถ
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                    {vehicles.map((vehicle) => (
                      <div
                        key={vehicle.id}
                        className={`flex flex-col p-4 sm:p-6 rounded-lg border-2 cursor-pointer transition-all ${
                          bookingData.vehicleType === vehicle.id
                            ? 'border-blue-600 bg-blue-50 dark:bg-blue-900/20'
                            : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                        }`}
                        onClick={() => handleVehicleSelect(vehicle.id)}
                      >
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex items-center gap-3">
                            <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg">
                              <Car className="h-5 w-5 sm:h-6 sm:w-6 text-blue-600 dark:text-blue-400" />
                            </div>
                            <div>
                              <h3 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-white">
                                {vehicle.name}
                              </h3>
                              <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-300">
                                {vehicle.type}
                              </p>
                            </div>
                          </div>
                        </div>
                        
                        <div className="mb-4">
                          <VehicleGallery 
                            images={vehicle.images || [vehicle.image]} 
                            vehicleName={vehicle.name}
                          />
                        </div>
                        
                        <div className="space-y-2">
                          <div className="flex justify-between items-center">
                            <span className="text-xs sm:text-sm text-gray-600 dark:text-gray-300">ความจุ:</span>
                            <span className="text-xs sm:text-sm font-medium text-gray-900 dark:text-white">
                              {vehicle.capacity} คน
                            </span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-xs sm:text-sm text-gray-600 dark:text-gray-300">ราคารายชั่วโมง:</span>
                            <span className="text-xs sm:text-sm font-medium text-gray-900 dark:text-white">
                              {vehicle.price}
                            </span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-xs sm:text-sm text-gray-600 dark:text-gray-300">ราคาเหมาวัน:</span>
                            <span className="text-xs sm:text-sm font-medium text-gray-900 dark:text-white">
                              {vehicle.dailyPrice}
                            </span>
                          </div>
                        </div>
                        
                        <div className="mt-4">
                          <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-300 mb-2">
                            {vehicle.description}
                          </p>
                          <div className="flex flex-wrap gap-1">
                            {vehicle.features.map((feature, index) => (
                              <span 
                                key={index}
                                className="px-1.5 py-0.5 sm:px-2 sm:py-1 bg-gray-100 dark:bg-gray-700 text-xs text-gray-600 dark:text-gray-300 rounded"
                              >
                                {feature}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Step 3: Trip Details */}
              {currentStep === 3 && (
                <div className="bg-white dark:bg-gray-800 rounded-lg p-4 sm:p-6 shadow-lg">
                  <h2 className="text-xl sm:text-2xl font-semibold text-gray-900 dark:text-white mb-4 sm:mb-6">
                    รายละเอียดการเดินทาง
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="pickupLocation" className="text-sm">จุดรับ</Label>
                        <div className="relative">
                          <MapPin className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                          <Input
                            id="pickupLocation"
                            placeholder="กรอกที่อยู่จุดรับ"
                            value={bookingData.pickupLocation}
                            onChange={(e) => handleInputChange('pickupLocation', e.target.value)}
                            onKeyDown={(e) => {
                              if (e.key === 'Enter') {
                                e.preventDefault();
                              }
                            }}
                            className="pl-10 text-sm"
                            required
                          />
                        </div>
                      </div>
                      <div>
                        <Label htmlFor="dropoffLocation" className="text-sm">จุดส่ง</Label>
                        <div className="relative">
                          <MapPin className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                          <Input
                            id="dropoffLocation"
                            placeholder="กรอกที่อยู่จุดส่ง"
                            value={bookingData.dropoffLocation}
                            onChange={(e) => handleInputChange('dropoffLocation', e.target.value)}
                            onKeyDown={(e) => {
                              if (e.key === 'Enter') {
                                e.preventDefault();
                              }
                            }}
                            className="pl-10 text-sm"
                            required
                          />
                        </div>
                      </div>
                    </div>
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="date" className="text-sm">วันที่</Label>
                        <div className="relative">
                          <Calendar className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                          <Input
                            id="date"
                            type="date"
                            value={bookingData.date}
                            onChange={(e) => handleInputChange('date', e.target.value)}
                            onKeyDown={(e) => {
                              if (e.key === 'Enter') {
                                e.preventDefault();
                              }
                            }}
                            className="pl-10 text-sm"
                            min={new Date().toISOString().split('T')[0]}
                            required
                          />
                        </div>
                      </div>
                      <div>
                        <Label htmlFor="time" className="text-sm">เวลา</Label>
                        <div className="relative">
                          <Clock className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                          <select
                            id="time"
                            value={bookingData.time}
                            onChange={(e) => handleInputChange('time', e.target.value)}
                            onKeyDown={(e) => {
                              if (e.key === 'Enter') {
                                e.preventDefault();
                              }
                            }}
                            className="w-full px-3 py-2 pl-10 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                            required
                          >
                            <option value="">เลือกเวลา</option>
                            {timeSlots.map((time) => (
                              <option key={time} value={time}>{time}</option>
                            ))}
                          </select>
                        </div>
                      </div>
                      {bookingData.service === "hourly-service" && (
                        <div>
                          <Label htmlFor="hours">จำนวนชั่วโมง</Label>
                          <div className="relative">
                            <Clock className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                            <select
                              id="hours"
                              value={bookingData.hours}
                              onChange={(e) => handleInputChange('hours', parseInt(e.target.value))}
                              onKeyDown={(e) => {
                                if (e.key === 'Enter') {
                                  e.preventDefault();
                                }
                              }}
                              className="w-full px-3 py-2 pl-10 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            >
                              {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((num) => (
                                <option key={num} value={num}>{num} ชั่วโมง</option>
                              ))}
                            </select>
                          </div>
                        </div>
                      )}
                      <div>
                        <Label htmlFor="passengers">จำนวนผู้โดยสาร</Label>
                        <div className="relative">
                          <Users className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                          <select
                            id="passengers"
                            value={bookingData.passengers}
                            onChange={(e) => handleInputChange('passengers', parseInt(e.target.value))}
                            className="w-full px-3 py-2 pl-10 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          >
                            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => (
                              <option key={num} value={num}>{num} คน</option>
                            ))}
                          </select>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Step 4: Contact Information */}
              {currentStep === 4 && (
                <div className="bg-white dark:bg-gray-800 rounded-lg p-4 sm:p-6 shadow-lg">
                  <h2 className="text-xl sm:text-2xl font-semibold text-gray-900 dark:text-white mb-4 sm:mb-6">
                    ข้อมูลติดต่อ
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="name" className="text-sm">ชื่อ-นามสกุล</Label>
                        <Input
                          id="name"
                          placeholder="กรอกชื่อ-นามสกุล"
                          value={bookingData.name}
                          onChange={(e) => handleInputChange('name', e.target.value)}
                          className="text-sm"
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="email" className="text-sm">อีเมล</Label>
                        <div className="relative">
                          <Mail className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                          <Input
                            id="email"
                            type="email"
                            placeholder="กรอกอีเมล"
                            value={bookingData.email}
                            onChange={(e) => handleInputChange('email', e.target.value)}
                            className="pl-10 text-sm"
                            required
                          />
                        </div>
                      </div>
                    </div>
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="phone" className="text-sm">เบอร์โทรศัพท์</Label>
                        <div className="relative">
                          <Phone className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                          <Input
                            id="phone"
                            type="tel"
                            placeholder="กรอกเบอร์โทรศัพท์"
                            value={bookingData.phone}
                            onChange={(e) => handleInputChange('phone', e.target.value)}
                            className="pl-10 text-sm"
                            required
                          />
                        </div>
                      </div>
                      <div>
                        <Label htmlFor="specialRequests" className="text-sm">คำขอพิเศษ (ไม่บังคับ)</Label>
                        <textarea
                          id="specialRequests"
                          placeholder="ข้อความหรือคำขอพิเศษ..."
                          value={bookingData.specialRequests}
                          onChange={(e) => handleInputChange('specialRequests', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none text-sm"
                          rows={4}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Step 5: Payment Method Selection */}
              {currentStep === 5 && (
                <div className="bg-white dark:bg-gray-800 rounded-lg p-4 sm:p-6 shadow-lg">
                  <div className="space-y-4 sm:space-y-6 mb-6 sm:mb-8">
                    {/* Booking Summary */}
                                          <div>
                        <h2 className="text-xl sm:text-2xl font-semibold text-gray-900 dark:text-white mb-4 sm:mb-6">
                          สรุปการจอง
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 mb-4 sm:mb-6">
                                                  <div className="space-y-4">
                            <h3 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white">บริการและรถ</h3>
                            <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-3 sm:p-4">
                            <div className="flex items-center gap-3 mb-2">
                              <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg">
                                <div className="text-blue-600 dark:text-blue-400">
                                  {selectedService?.icon}
                                </div>
                              </div>
                              <div>
                                <p className="font-semibold text-gray-900 dark:text-white">
                                  {selectedService?.title}
                                </p>
                                <p className="text-sm text-gray-600 dark:text-gray-300">
                                  {selectedService?.price}
                                </p>
                              </div>
                            </div>
                          </div>
                          
                          {bookingData.vehicleType && (
                            <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                              <div className="flex items-center gap-3 mb-2">
                                <div className="p-2 bg-green-100 dark:bg-green-900 rounded-lg">
                                  <Car className="h-5 w-5 text-green-600 dark:text-green-400" />
                                </div>
                                <div>
                                  <p className="font-semibold text-gray-900 dark:text-white">
                                    {vehicles.find(v => v.id === bookingData.vehicleType)?.name}
                                  </p>
                                  <p className="text-sm text-gray-600 dark:text-gray-300">
                                    {vehicles.find(v => v.id === bookingData.vehicleType)?.type}
                                  </p>
                                </div>
                              </div>
                            </div>
                          )}
                        </div>
                        <div className="space-y-4">
                          <h3 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white">รายละเอียดการเดินทาง</h3>
                          <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-3 sm:p-4 space-y-2">
                            <div className="flex justify-between">
                              <span className="text-gray-600 dark:text-gray-300">วันที่:</span>
                              <span className="font-medium text-gray-900 dark:text-white">{bookingData.date}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-600 dark:text-gray-300">เวลา:</span>
                              <span className="font-medium text-gray-900 dark:text-white">{bookingData.time}</span>
                            </div>
                            {bookingData.service === "hourly-service" && (
                              <div className="flex justify-between">
                                <span className="text-gray-600 dark:text-gray-300">จำนวนชั่วโมง:</span>
                                <span className="font-medium text-gray-900 dark:text-white">{bookingData.hours} ชั่วโมง</span>
                              </div>
                            )}
                            <div className="flex justify-between">
                              <span className="text-gray-600 dark:text-gray-300">จำนวนผู้โดยสาร:</span>
                              <span className="font-medium text-gray-900 dark:text-white">{bookingData.passengers} คน</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="bg-gray-50 p-3 sm:p-4 rounded-lg">
                      <div className="flex justify-between items-center">
                        <span className="text-sm sm:text-base font-semibold">ยอดรวมทั้งสิ้น:</span>
                        <span className="text-xl sm:text-2xl font-bold text-green-600">
                          ฿{totalPrice.toLocaleString()}
                        </span>
                      </div>
                    </div>
                    <div className="flex justify-center">
                      <Button
                        onClick={handleStripePayment}
                        disabled={isProcessing}
                        className="w-full text-sm sm:text-base"
                      >
                        {isProcessing ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            <span className="hidden sm:inline">กำลังดำเนินการ...</span>
                            <span className="sm:hidden">กำลังดำเนินการ</span>
                          </>
                        ) : (
                          <>
                            <CreditCard className="mr-2 h-4 w-4" />
                            <span className="hidden sm:inline">ยืนยันการชำระเงิน</span>
                            <span className="sm:hidden">ชำระเงิน</span>
                          </>
                        )}
                      </Button>
                    </div>
                  </div>
                </div>
              )}

              {/* Navigation Buttons */}
              <div className="flex justify-between gap-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={prevStep}
                  disabled={currentStep === 1}
                  className="flex items-center gap-2 text-sm"
                >
                  <ArrowLeft className="h-4 w-4" />
                  <span className="hidden sm:inline">Previous</span>
                </Button>
                {currentStep < TOTAL_STEPS ? (
                  <Button
                    type="button"
                    onClick={(e) => {
                      e.preventDefault();
                      console.log('Next button clicked');
                      nextStep();
                    }}
                    disabled={
                      (currentStep === 1 && !bookingData.service) ||
                      (currentStep === 2 && !bookingData.vehicleType) ||
                      (currentStep === 3 && (!bookingData.pickupLocation || !bookingData.dropoffLocation || !bookingData.date || !bookingData.time || (bookingData.service === "hourly-service" && !bookingData.hours))) ||
                      (currentStep === 4 && (!bookingData.name || !bookingData.email || !bookingData.phone))
                    }
                    className="flex items-center gap-2 text-sm"
                  >
                    <span className="hidden sm:inline">Next</span>
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                ) : null}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}