# API Configuration Setup

## Environment Variables

Create a `.env.local` file in the root directory with the following configuration:

```env
NEXT_PUBLIC_BASE_API=https://uapi.rg.in.th/uapi/rantcar/
```

## API Endpoints

The application uses the following API structure:

### External API:
- **Base URL**: `https://uapi.rg.in.th/uapi/rantcar/`
- **Booking Endpoint**: `/booking`
- **Full URL**: `https://uapi.rg.in.th/uapi/rantcar/booking`

### Internal API:
- **Create Checkout Session**: `/api/create-checkout-session`
- **Stripe Session Handler**: `/api/stripe/session`
- **Bookings Management**: `/api/bookings`

## API Configuration Files

### 1. `src/lib/api-config.js`
Contains utility functions for API calls:
- `API_CONFIG`: Configuration object with base URL and endpoints
- `buildApiUrl()`: Helper function to build complete API URLs
- `apiCall()`: Helper function for making JSON API requests
- `externalApiCall()`: Helper function for making FormData API requests to external API

### 2. `src/app/api/bookings.js`
Updated to use environment variables:
- Uses `process.env.NEXT_PUBLIC_BASE_API` for base URL
- Calls `/booking` endpoint
- Sends data as FormData
- Used for legacy flow (internal API calls external)

### 3. `src/app/api/bookings/route.js`
Internal API route that:
- Receives booking data from frontend (legacy flow)
- OR stores locally processed booking data (new flow)
- Calls external API via `bookings.js` (legacy)
- Returns booking confirmation with ID

## Data Flow

### New Flow (Stripe Payment):
1. **Frontend** → Step 1-4: Collect booking data
2. **Step 5** → Review & Confirmation → `/api/create-checkout-session`
3. **Stripe Checkout** → Payment processing
4. **Success** → `/api/stripe/session` → Create booking → Success page

### Legacy Flow (Direct External API):
1. **Frontend** → External API directly → `https://uapi.rg.in.th/uapi/rantcar/booking`
2. **External API Response** → Store locally via `/api/bookings`
3. **Success Page** → Display booking details

### Legacy Flow (Internal API):
1. **Frontend** → `/api/bookings` (POST)
2. **Internal API** → `bookings.js` → External API
3. **External API** → `https://uapi.rg.in.th/uapi/rantcar/booking`
4. **Response** → Success page with booking ID

## FormData Structure

The booking data is sent as FormData with the following fields:

```javascript
{
  serviceType: "hourly-service" | "daily-service",
  pickupLocation: "string",
  dropoffLocation: "string", 
  date: "YYYY-MM-DD",
  time: "HH:MM",
  hours: number, // Only for hourly service
  passengers: number,
  customerName: "string",
  customerEmail: "string",
  customerPhone: "string",
  specialRequests: "string" // Optional
}
```

## Error Handling

- API calls include proper error handling
- Failed requests return appropriate error messages
- Frontend shows user-friendly error messages in Thai

## Development vs Production

- **Development**: Uses `.env.local` for configuration
- **Production**: Set environment variables in your hosting platform
- **Fallback**: Defaults to `https://uapi.rg.in.th/uapi/rantcar/` if env var not set 