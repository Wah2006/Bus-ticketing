# VibeCoding Backend API

Node.js + Express API for the VibeCoding multi-agency bus ticketing platform.

## 🏗️ Architecture

- **Modular monolith** — organized by domain modules (auth, agencies, trips, bookings, payments, notifications)
- **MVC pattern** — within each module: routes → controller → service → model
- **Event-driven** — modules communicate via event bus for notifications and inter-module events
- **Concurrent seat locking** — Redis-based seat locks with 10-minute TTL + PostgreSQL as source of truth

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- PostgreSQL 13+
- Redis 6+
- npm

### Installation

```bash
# Install dependencies
npm install

# Create .env file
cp .env.example .env.local

# Configure database, Redis, and API keys in .env.local
```

### Database Setup

```bash
# Run migrations
npm run migrate

# Seed development data (optional)
npm run seed
```

### Start Server

```bash
# Development (with nodemon)
npm run dev

# Production
npm start
```

Server will start on `http://localhost:3000`

## 📁 Project Structure

```
src/
├── modules/               # Domain modules
│   ├── auth/             # Authentication & user management
│   ├── agencies/         # Agency management, buses, routes
│   ├── trips/            # Trip search & seat availability
│   ├── bookings/         # Bookings & seat locking
│   ├── payments/         # Payment processing & webhooks
│   └── notifications/    # SMS/Email notifications
├── shared/
│   ├── db/              # Database pool & migrations
│   ├── redis/           # Redis client
│   ├── middleware/      # Express middleware
│   ├── events/          # Event bus
│   └── utils/           # Utilities (logger, response, etc.)
├── config/
│   └── constants.js     # Business rule constants
├── app.js               # Express app assembly
└── server.js            # Server entry point
```

## 🔐 Authentication

- JWT-based with short-lived access tokens (~15 min) and longer-lived refresh tokens (~7 days)
- Role-based access control: `passenger`, `agency_staff`, `superadmin`
- Automatic agency scoping for staff users via JWT claim

**Login Endpoint:**
```bash
POST /api/v1/auth/login
{
  "email": "user@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "user": { "id": 1, "email": "user@example.com", "role": "passenger" },
    "accessToken": "eyJh...",
    "refreshToken": "eyJh..."
  }
}
```

## 📚 Core Features

### Trip Search
```bash
GET /api/v1/trips/search?origin=Douala&destination=Yaoundé&departureDate=2026-01-15&page=1&pageSize=20
```

### Booking Workflow
1. **Hold seat** (acquires Redis lock, creates pending booking)
   ```bash
   POST /api/v1/bookings
   {
     "tripId": 1,
     "seatNumber": 5,
     "firstName": "John",
     "lastName": "Doe",
     "email": "john@example.com",
     "phone": "+237123456789"
   }
   ```

2. **Initiate payment** (starts payment flow with aggregator)
   ```bash
   POST /api/v1/payments/initiate
   {
     "bookingId": 1,
     "method": "mobile_money"
   }
   ```

3. **Payment webhook** (called by payment provider)
   ```bash
   POST /api/v1/payments/webhooks/payments
   {
     "transactionId": "ext-123456",
     "status": "success",
     "amount": 25000
   }
   ```

4. **Confirm booking** (marks as confirmed, seat as sold, lock released)
   ```bash
   POST /api/v1/bookings/1/confirm
   ```

### Seat Locking (Concurrency)
- Redis key: `lock:trip:{tripId}:seat:{seatNumber}`
- TTL: 10 minutes (configurable via `SEAT_LOCK_DURATION_SECONDS`)
- Value: `{ userId, acquiredAt }`
- Prevents double-booking under concurrent requests
- Automatic expiry cleans up expired pending bookings

## 💰 Business Rules

| Rule | Value | Config |
|---|---|---|
| Seat lock duration | 10 minutes | `SEAT_LOCK_DURATION_SECONDS` |
| Cancellation window | 24 hours | `CANCELLATION_WINDOW_HOURS` |
| Agency commission | 10% | `AGENCY_COMMISSION_PERCENT` |
| JWT access expiry | 15 minutes | `JWT_ACCESS_EXPIRY` |
| JWT refresh expiry | 7 days | `JWT_REFRESH_EXPIRY` |

## 🔄 Event System

Modules communicate via event bus. Current events:

```
USER_REGISTERED
USER_LOGGED_IN
USER_LOGGED_OUT
BOOKING_CREATED
BOOKING_CONFIRMED
BOOKING_CANCELLED
BOOKING_EXPIRED
SEAT_LOCKED
SEAT_RELEASED
SEAT_SOLD
PAYMENT_INITIATED
PAYMENT_COMPLETED
PAYMENT_FAILED
```

**Example listener:**
```javascript
import { eventBus, EVENTS } from './shared/events/eventBus.js';

eventBus.on(EVENTS.BOOKING_CONFIRMED, async (data) => {
  // Send confirmation SMS/email
});
```

## 🔌 API Response Envelope

All endpoints return consistent response shape:

**Success:**
```json
{
  "success": true,
  "data": { /* response data */ },
  "error": null,
  "meta": { /* pagination if applicable */ }
}
```

**Error:**
```json
{
  "success": false,
  "data": null,
  "error": {
    "code": "SEAT_ALREADY_LOCKED",
    "message": "This seat is currently being booked by another passenger."
  },
  "meta": {}
}
```

**Pagination:**
```json
{
  "success": true,
  "data": [ /* array of items */ ],
  "error": null,
  "meta": {
    "page": 1,
    "pageSize": 20,
    "total": 150,
    "totalPages": 8
  }
}
```

## 🧪 Testing

```bash
# Run all tests
npm test

# Watch mode
npm run test:watch

# Coverage report
npm run test:coverage
```

## 📝 Environment Variables

See `.env.example` for complete list. Key variables:

```env
# Database
DATABASE_URL=postgresql://user:pass@localhost:5432/vibecoding
DB_HOST=localhost
DB_PORT=5432
DB_NAME=vibecoding
DB_USER=postgres
DB_PASSWORD=password

# Redis
REDIS_URL=redis://localhost:6379

# JWT
JWT_SECRET=your-secret-key
JWT_REFRESH_SECRET=your-refresh-secret

# Business Rules
SEAT_LOCK_DURATION_SECONDS=600
CANCELLATION_WINDOW_HOURS=24
AGENCY_COMMISSION_PERCENT=10

# Payment Providers
PAYMENT_AGGREGATOR=cinetpay
CINETPAY_API_KEY=xxx
CINETPAY_SITE_ID=xxx

# Notifications
SMS_PROVIDER=africas_talking
AFRICAS_TALKING_API_KEY=xxx
EMAIL_PROVIDER=sendgrid
SENDGRID_API_KEY=xxx
```

## 🐛 Error Codes

Common error codes returned by API:

- `INVALID_CREDENTIALS` — login failed
- `SEAT_ALREADY_LOCKED` — seat being booked by another user
- `SEAT_NOT_AVAILABLE` — seat status not available
- `PAYMENT_DECLINED` — payment provider rejected
- `CANCELLATION_WINDOW_CLOSED` — booking too old to cancel
- `FORBIDDEN` — user lacks permission
- `NOT_FOUND` — resource not found
- `VALIDATION_ERROR` — request data invalid
- `INTERNAL_ERROR` — server error

## 🔄 Module Boundaries

**Hard rule:** modules only call other modules through `*.service.js` exports. Never import `*.model.js` directly.

```javascript
// ✅ CORRECT
import * as bookingsService from '../bookings/bookings.service.js';
await bookingsService.confirmBooking(bookingId);

// ❌ WRONG
import * as bookingsModel from '../bookings/bookings.model.js';
await bookingsModel.getBookingById(bookingId);
```

This maintains module boundaries and enables future microservice extraction without code changes.

## 📊 Database Schema

**Key Tables:**
- `users` — passengers, staff, superadmin
- `agencies` — bus operators
- `buses` — vehicles with seat capacity
- `routes` — city pairs
- `trips` — specific departures (route + bus + date + time)
- `seat_availability` — per-trip seat status (available/sold/unavailable)
- `bookings` — reservations (pending/confirmed/cancelled/expired)
- `payments` — transaction ledger (never hard-deleted)

All audit tables include `created_at`, `updated_at`, and use soft-delete with `status` column.

## 🚨 Rate Limiting

Applied on:
- `/auth/login` — 5 requests per 15 minutes
- `/auth/register` — 5 requests per 15 minutes
- `/payments/initiate` — 20 requests per hour
- All API routes — 100 requests per 15 minutes

## 🔐 Security Checklist

- ✅ Parameterized SQL queries (no string concatenation)
- ✅ JWT validation on protected endpoints
- ✅ Role-based access control
- ✅ Agency scoping server-side (never trust client)
- ✅ Sensitive data redaction in logs
- ✅ CORS enabled for web/mobile clients
- ✅ Rate limiting on auth and payment endpoints
- ✅ Payment webhook signature verification (aggregator-specific)

## 📞 Support

For issues, check:
1. `.env.local` configuration
2. Database and Redis connectivity
3. Application logs (`combined.log`, `error.log`)
4. Test coverage for your changes

---

**Built with:** Node.js, Express, PostgreSQL, Redis, JWT, Joi validation

**License:** Proprietary - VibeCoding 2024
