// Test file for email service
// Run with: node test-email.js

import dotenv from 'dotenv';
import { sendPaymentConfirmation, testEmailService } from './src/lib/emailService.js';

// Load environment variables
dotenv.config();

// Example usage of the email service
async function testPaymentConfirmation() {
  try {
    console.log('Testing payment confirmation email...');
    
    const result = await sendPaymentConfirmation({
      to: 'pakpoom.sria@gmail.com', // Use the email registered with Resend
      name: 'สมชาย ใจดี',
      amount: 2500,
      currency: 'THB',
      bookingId: 'BK-2024-001',
      paidAt: new Date(),
      bookingDetails: {
        serviceType: 'airport-transfer',
        pickupLocation: 'สนามบินดอนเมือง',
        dropoffLocation: 'โรงแรมในกรุงเทพฯ',
        date: '2024-01-15',
        time: '14:00',
        passengers: 4,
        customerPhone: '081-234-5678',
        specialRequests: 'ต้องการรถที่มีที่นั่งสำหรับเด็ก'
      }
    });
    
    console.log('✅ Email sent successfully!');
    console.log('Result:', result);
    
  } catch (error) {
    console.error('❌ Error sending email:', error.message);
  }
}

// Test the email service with a test function
async function runTest() {
  try {
    console.log('Running email service test...');
    
    const result = await testEmailService('pakpoom.sria@gmail.com'); // Use the email registered with Resend
    
    console.log('✅ Test completed successfully!');
    console.log('Result:', result);
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
  }
}

// Uncomment one of these to run the test
testPaymentConfirmation();
// runTest();

console.log('Email service test file loaded.');
console.log('To run tests, uncomment the function calls at the bottom of this file.');
console.log('Make sure to:');
console.log('1. Set RESEND_API_KEY in your .env file');
console.log('2. Use the email registered with your Resend account');
console.log('3. Update the "from" email in emailService.js with your verified domain'); 