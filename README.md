# VibeCoding - Bus Ticketing Platform (Cameroon)

A modern, full-stack bus ticketing web application built for multi-agency operations in Cameroon. Features real-time seat selection, booking management, payments, and admin dashboard.

## ✨ Features

### Backend (Node.js + Express + Prisma)
- **Multi-agency support** (Agencies can manage their own trips)
- **Real-time seat locking** with Redis
- **JWT Authentication** + Role-based access (user, agency_staff, admin)
- **PostgreSQL** with Prisma ORM + migrations
- **RESTful API** with validation (Zod)
- **Booking flow**: Search → Seat Map → Passenger Info → Payment → Confirmation
- **Admin tools**: Manage trips, agencies, bookings, analytics

### Frontend (React + Vite + Tailwind)
- Responsive UI with Tailwind CSS
- Bilingual support (English/French)
- React Query for data fetching
- Protected routes
- Interactive seat map
- Modern, mobile-friendly design

## 🚀 Quick Start

### Prerequisites
- Node.js 20+
- PostgreSQL
- Redis
- (Optional) Docker

### 1. Backend Setup

```bash
cd backend

# Install dependencies
npm install

# Copy environment file
cp .env.example .env.local

# Configure .env.local (DB + Redis)
# Then run:
npm run migrate
npm run seed

# Start development server
npm run dev
Backend runs on: http://localhost:3000
2. Frontend Setup
Bashcd ../web

npm install
npm run dev
Frontend runs on: http://localhost:5173
📁 Project Structure
textVibeCoding/
├── backend/                  # Node.js/Express API
│   ├── src/
│   │   ├── controllers/
│   │   ├── services/
│   │   ├── models/
│   │   ├── routes/
│   │   ├── middleware/
│   │   └── server.js
│   ├── prisma/
│   └── package.json
│
├── web/                      # React + Vite Frontend
│   ├── src/
│   │   ├── features/
│   │   ├── components/
│   │   ├── routes/
│   │   └── lib/
│   └── package.json
│
├── README.md
└── docker-compose.yml (optional)
Available Scripts
Backend

npm run dev - Start dev server
npm run migrate - Run Prisma migrations
npm run seed - Seed sample data
npm run lint - Run ESLint
npm test - Run tests

Frontend

npm run dev - Start Vite dev server
npm run build - Production build
npm run preview - Preview build

Test Flow

Register / Login
Go to Search Trips
Select route (e.g., Douala → Yaoundé)
Choose trip → Select seats
Fill passenger details → Checkout
View booking confirmation

Tech Stack

Backend: Node.js, Express, Prisma, PostgreSQL, Redis, JWT, Zod
Frontend: React 18, Vite, Tailwind CSS, React Query, React Router
Tools: TypeScript (partial), i18n, ESLint, Prettier

Common Issues & Fixes
Database Not Responding:

Start PostgreSQL + Redis services
Check DATABASE_URL and REDIS_URL in .env.local
Run npm run migrate and npm run seed

Frontend Import Errors:

Fix relative paths (e.g. ../../../features/auth/useAuth)
Run npm install after changes

Deployment

Backend: Render, Railway, or VPS
Frontend: Vercel / Netlify
Database: Supabase, Neon, or managed PostgreSQL


Made with ❤️ for Cameroon transport digitization
text---

**Next Step**: Paste this into your local `README.md` file and commit it.

Would you like me to also generate:
- A `docker-compose.yml`?
- Environment variable template?
- Or fix the database connection issue first? 

Just say the word! 🚀
