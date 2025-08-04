import { Resend } from 'resend';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// Initialize Resend with API key from environment variables
const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;

/**
 * Send payment confirmation email
 * @param {Object} params - Payment confirmation parameters
 * @param {string} params.to - Email address of the payer
 * @param {string} params.name - Name of the payer
 * @param {number} params.amount - Payment amount
 * @param {string} params.currency - Currency code (e.g., 'THB')
 * @param {string} params.bookingId - Booking ID
 * @param {Date} params.paidAt - Payment timestamp
 * @param {Object} params.bookingDetails - Additional booking details
 * @param {string} params.bookingDetails.serviceType - Type of service
 * @param {string} params.bookingDetails.pickupLocation - Pickup location
 * @param {string} params.bookingDetails.dropoffLocation - Dropoff location
 * @param {string} params.bookingDetails.date - Booking date
 * @param {string} params.bookingDetails.time - Booking time
 * @param {number} params.bookingDetails.passengers - Number of passengers
 * @param {string} params.bookingDetails.customerPhone - Customer phone number
 * @param {string} params.bookingDetails.specialRequests - Special requests
 * @returns {Promise<Object>} Resend API response
 */
export async function sendPaymentConfirmation({
  to,
  name,
  amount,
  currency,
  bookingId,
  paidAt,
  bookingDetails = {}
}) {
  // Check if Resend is initialized
  if (!resend) {
    console.warn('Resend is not configured, skipping email send');
    return { success: false, error: 'Email service not configured' };
  }
  
  try {
    // Format the payment amount with currency
    const formattedAmount = new Intl.NumberFormat('th-TH', {
      style: 'currency',
      currency: currency || 'THB',
      minimumFractionDigits: 2
    }).format(amount);

    // Format the payment date
    const formattedDate = new Intl.DateTimeFormat('th-TH', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      timeZone: 'Asia/Bangkok'
    }).format(paidAt);

    const { data, error } = await resend.emails.send({
      from: 'Van Booking <noreply@resend.dev>', // Update with your verified domain
      to: [to],
      subject: `การชำระเงินสำเร็จ - รหัสการจอง: ${bookingId}`,
      html: `
        <!DOCTYPE html>
        <html lang="th">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>การชำระเงินสำเร็จ</title>
          <style>
            body {
              font-family: 'Sarabun', Arial, sans-serif;
              line-height: 1.6;
              color: #333;
              max-width: 600px;
              margin: 0 auto;
              padding: 20px;
              background-color: #f8f9fa;
            }
            .container {
              background-color: #ffffff;
              border-radius: 10px;
              padding: 30px;
              box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
            }
            .header {
              text-align: center;
              margin-bottom: 30px;
            }
            .success-icon {
              color: #28a745;
              font-size: 48px;
              margin-bottom: 10px;
            }
            .title {
              color: #28a745;
              font-size: 24px;
              font-weight: bold;
              margin-bottom: 10px;
            }
            .subtitle {
              color: #6c757d;
              font-size: 16px;
            }
            .details {
              background-color: #f8f9fa;
              border-radius: 8px;
              padding: 20px;
              margin: 20px 0;
            }
            .detail-row {
              display: flex;
              justify-content: space-between;
              margin-bottom: 10px;
              padding: 8px 0;
              border-bottom: 1px solid #e9ecef;
            }
            .detail-row:last-child {
              border-bottom: none;
            }
            .label {
              font-weight: bold;
              color: #495057;
            }
            .value {
              color: #212529;
            }
            .amount {
              font-size: 20px;
              font-weight: bold;
              color: #28a745;
            }
            .footer {
              text-align: center;
              margin-top: 30px;
              padding-top: 20px;
              border-top: 1px solid #e9ecef;
              color: #6c757d;
              font-size: 14px;
            }
            .contact-info {
              background-color: #e3f2fd;
              border-radius: 8px;
              padding: 15px;
              margin-top: 20px;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <div class="success-icon">✅</div>
              <h1 class="title">การชำระเงินสำเร็จ</h1>
              <p class="subtitle">ขอบคุณสำหรับการชำระเงินของคุณ</p>
            </div>

            <div class="details">
              <div class="detail-row">
                <span class="label">ชื่อ:</span>
                <span class="value">${name}</span>
              </div>
              <div class="detail-row">
                <span class="label">รหัสการจอง:</span>
                <span class="value">${bookingId}</span>
              </div>
              <div class="detail-row">
                <span class="label">ยอดชำระ:</span>
                <span class="value amount">${formattedAmount}</span>
              </div>
              <div class="detail-row">
                <span class="label">วันที่ชำระ:</span>
                <span class="value">${formattedDate}</span>
              </div>
            </div>

            ${bookingDetails.serviceType || bookingDetails.pickupLocation || bookingDetails.date ? `
            <div class="details">
              <h3 style="margin: 0 0 15px 0; color: #495057; font-size: 18px;">รายละเอียดการจอง</h3>
              ${bookingDetails.serviceType ? `
              <div class="detail-row">
                <span class="label">ประเภทบริการ:</span>
                <span class="value">${bookingDetails.serviceType === 'hourly-service' ? 'บริการรายชั่วโมง' : 
                                   bookingDetails.serviceType === 'airport-transfer' ? 'รับส่งสนามบิน' :
                                   bookingDetails.serviceType === 'city-tour' ? 'ทัวร์ในเมือง' :
                                   bookingDetails.serviceType === 'intercity-transfer' ? 'รับส่งระหว่างเมือง' :
                                   bookingDetails.serviceType}</span>
              </div>
              ` : ''}
              ${bookingDetails.pickupLocation ? `
              <div class="detail-row">
                <span class="label">จุดรับ:</span>
                <span class="value">${bookingDetails.pickupLocation}</span>
              </div>
              ` : ''}
              ${bookingDetails.dropoffLocation ? `
              <div class="detail-row">
                <span class="label">จุดส่ง:</span>
                <span class="value">${bookingDetails.dropoffLocation}</span>
              </div>
              ` : ''}
              ${bookingDetails.date ? `
              <div class="detail-row">
                <span class="label">วันที่:</span>
                <span class="value">${bookingDetails.date}</span>
              </div>
              ` : ''}
              ${bookingDetails.time ? `
              <div class="detail-row">
                <span class="label">เวลา:</span>
                <span class="value">${bookingDetails.time}</span>
              </div>
              ` : ''}
              ${bookingDetails.passengers ? `
              <div class="detail-row">
                <span class="label">จำนวนผู้โดยสาร:</span>
                <span class="value">${bookingDetails.passengers} คน</span>
              </div>
              ` : ''}
              ${bookingDetails.customerPhone ? `
              <div class="detail-row">
                <span class="label">เบอร์โทรศัพท์:</span>
                <span class="value">${bookingDetails.customerPhone}</span>
              </div>
              ` : ''}
              ${bookingDetails.specialRequests ? `
              <div class="detail-row">
                <span class="label">คำขอพิเศษ:</span>
                <span class="value">${bookingDetails.specialRequests}</span>
              </div>
              ` : ''}
            </div>
            ` : ''}

            <div class="contact-info">
              <p><strong>หากมีคำถามหรือต้องการความช่วยเหลือ</strong></p>
              <p>กรุณาติดต่อเราได้ที่:</p>
              <p>📧 pakpoomsisanoot12@gmail.com</p>
              <p>📞 081-234-5678</p>
            </div>

            <div class="footer">
              <p>อีเมลนี้ถูกส่งโดยระบบอัตโนมัติ กรุณาอย่าตอบกลับ</p>
              <p>© 2024 Van Booking Service. All rights reserved.</p>
            </div>
          </div>
        </body>
        </html>
      `,
      text: `
การชำระเงินสำเร็จ

ขอบคุณสำหรับการชำระเงินของคุณ

รายละเอียดการชำระเงิน:
- ชื่อ: ${name}
- รหัสการจอง: ${bookingId}
- ยอดชำระ: ${formattedAmount}
- วันที่ชำระ: ${formattedDate}

${bookingDetails.serviceType || bookingDetails.pickupLocation || bookingDetails.date ? `
รายละเอียดการจอง:
${bookingDetails.serviceType ? `- ประเภทบริการ: ${bookingDetails.serviceType === 'hourly-service' ? 'บริการรายชั่วโมง' : 
                               bookingDetails.serviceType === 'airport-transfer' ? 'รับส่งสนามบิน' :
                               bookingDetails.serviceType === 'city-tour' ? 'ทัวร์ในเมือง' :
                               bookingDetails.serviceType === 'intercity-transfer' ? 'รับส่งระหว่างเมือง' :
                               bookingDetails.serviceType}` : ''}
${bookingDetails.pickupLocation ? `- จุดรับ: ${bookingDetails.pickupLocation}` : ''}
${bookingDetails.dropoffLocation ? `- จุดส่ง: ${bookingDetails.dropoffLocation}` : ''}
${bookingDetails.date ? `- วันที่: ${bookingDetails.date}` : ''}
${bookingDetails.time ? `- เวลา: ${bookingDetails.time}` : ''}
${bookingDetails.passengers ? `- จำนวนผู้โดยสาร: ${bookingDetails.passengers} คน` : ''}
${bookingDetails.customerPhone ? `- เบอร์โทรศัพท์: ${bookingDetails.customerPhone}` : ''}
${bookingDetails.specialRequests ? `- คำขอพิเศษ: ${bookingDetails.specialRequests}` : ''}
` : ''}

หากมีคำถามหรือต้องการความช่วยเหลือ กรุณาติดต่อเราได้ที่:
📧 support@yourdomain.com
📞 02-XXX-XXXX

อีเมลนี้ถูกส่งโดยระบบอัตโนมัติ กรุณาอย่าตอบกลับ
      `
    });

    if (error) {
      console.error('Error sending email:', error);
      throw new Error(`Failed to send email: ${error.message}`);
    }

    console.log('Payment confirmation email sent successfully:', data);
    return data;

  } catch (error) {
    console.error('Error in sendPaymentConfirmation:', error);
    throw error;
  }
}

/**
 * Test function to verify email service is working
 * @param {string} testEmail - Test email address
 */
export async function testEmailService(testEmail) {
  try {
    const result = await sendPaymentConfirmation({
      to: testEmail,
      name: 'Test User',
      amount: 1500,
      currency: 'THB',
      bookingId: 'TEST-001',
      paidAt: new Date()
    });
    
    console.log('Email service test successful:', result);
    return result;
  } catch (error) {
    console.error('Email service test failed:', error);
    throw error;
  }
} 

/**
 * Example function showing how to use the email service in other parts of the app
 * This function can be called from any API route or server action
 */
export async function sendPaymentConfirmationFromBooking(bookingData, paymentData) {
  try {
    const result = await sendPaymentConfirmation({
      to: bookingData.customerEmail,
      name: bookingData.customerName,
      amount: paymentData.amount,
      currency: paymentData.currency,
      bookingId: `BK-${bookingData.id}`,
      paidAt: new Date()
    });
    
    console.log('Payment confirmation email sent:', result);
    return { success: true, data: result };
    
  } catch (error) {
    console.error('Failed to send payment confirmation email:', error);
    return { success: false, error: error.message };
  }
}

/**
 * Example usage in API route:
 * 
 * // In your API route file
 * import { sendPaymentConfirmationFromBooking } from '@/lib/emailService';
 * 
 * export async function POST(request) {
 *   const { bookingData, paymentData } = await request.json();
 *   
 *   // Send confirmation email
 *   const emailResult = await sendPaymentConfirmationFromBooking(bookingData, paymentData);
 *   
 *   if (emailResult.success) {
 *     console.log('Email sent successfully');
 *   } else {
 *     console.error('Failed to send email:', emailResult.error);
 *   }
 *   
 *   return NextResponse.json({ success: true });
 * }
 */ 