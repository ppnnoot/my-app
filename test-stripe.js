// Test Stripe API
const testBookingData = {
  service: "hourly-service",
  vehicleType: "toyota-alphard",
  pickupLocation: "สนามบินสุวรรณภูมิ",
  dropoffLocation: "สุขุมวิท 55",
  date: "2024-01-15",
  time: "14:00",
  hours: 3,
  passengers: 4,
  name: "สมชาย ใจดี",
  email: "somchai@example.com",
  phone: "081-234-5678",
  specialRequests: "ต้องการรถที่มีที่นั่งสำหรับเด็ก",
  totalPrice: 2400
};

// Test the API
fetch('http://localhost:3000/api/create-checkout-session', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify(testBookingData),
})
.then(response => response.json())
.then(data => {
  console.log('Success:', data);
})
.catch(error => {
  console.error('Error:', error);
}); 