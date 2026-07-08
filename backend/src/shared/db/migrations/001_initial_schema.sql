-- 001_create_users_table.sql
CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  first_name VARCHAR(100),
  last_name VARCHAR(100),
  phone VARCHAR(20),
  role VARCHAR(50) DEFAULT 'passenger' CHECK (role IN ('passenger', 'agency_staff', 'superadmin')),
  agency_id INTEGER,
  refresh_token TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_role ON users(role);
CREATE INDEX idx_users_agency_id ON users(agency_id);

-- 002_create_agencies_table.sql
CREATE TABLE IF NOT EXISTS agencies (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255),
  phone VARCHAR(20),
  address TEXT,
  city VARCHAR(100),
  logo VARCHAR(500),
  status VARCHAR(50) DEFAULT 'active' CHECK (status IN ('active', 'suspended', 'inactive')),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_agencies_status ON agencies(status);

-- Add agency_id constraint to users
ALTER TABLE users ADD CONSTRAINT fk_users_agency FOREIGN KEY (agency_id) REFERENCES agencies(id) ON DELETE SET NULL;

-- 003_create_buses_table.sql
CREATE TABLE IF NOT EXISTS buses (
  id SERIAL PRIMARY KEY,
  agency_id INTEGER NOT NULL,
  registration_number VARCHAR(50) NOT NULL,
  name VARCHAR(100),
  type VARCHAR(50) CHECK (type IN ('sedan', 'coaster', 'luxury')),
  total_seats INTEGER DEFAULT 32,
  status VARCHAR(50) DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'maintenance')),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  FOREIGN KEY (agency_id) REFERENCES agencies(id) ON DELETE CASCADE
);

CREATE INDEX idx_buses_agency_id ON buses(agency_id);
CREATE INDEX idx_buses_registration ON buses(registration_number);

-- 004_create_routes_table.sql
CREATE TABLE IF NOT EXISTS routes (
  id SERIAL PRIMARY KEY,
  agency_id INTEGER NOT NULL,
  origin VARCHAR(100) NOT NULL,
  destination VARCHAR(100) NOT NULL,
  distance DECIMAL(10, 2),
  estimated_duration INTEGER,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  FOREIGN KEY (agency_id) REFERENCES agencies(id) ON DELETE CASCADE
);

CREATE INDEX idx_routes_agency_id ON routes(agency_id);
CREATE INDEX idx_routes_origin_dest ON routes(origin, destination);

-- 005_create_trips_table.sql
CREATE TABLE IF NOT EXISTS trips (
  id SERIAL PRIMARY KEY,
  route_id INTEGER NOT NULL,
  bus_id INTEGER NOT NULL,
  departure_time TIMESTAMP NOT NULL,
  base_price DECIMAL(10, 2) NOT NULL,
  status VARCHAR(50) DEFAULT 'scheduled' CHECK (status IN ('scheduled', 'departed', 'completed', 'cancelled')),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  FOREIGN KEY (route_id) REFERENCES routes(id) ON DELETE CASCADE,
  FOREIGN KEY (bus_id) REFERENCES buses(id) ON DELETE CASCADE
);

CREATE INDEX idx_trips_route_id ON trips(route_id);
CREATE INDEX idx_trips_bus_id ON trips(bus_id);
CREATE INDEX idx_trips_departure ON trips(departure_time);
CREATE INDEX idx_trips_status ON trips(status);

-- 006_create_seat_availability_table.sql
CREATE TABLE IF NOT EXISTS seat_availability (
  id SERIAL PRIMARY KEY,
  trip_id INTEGER NOT NULL,
  seat_number INTEGER NOT NULL,
  status VARCHAR(50) DEFAULT 'available' CHECK (status IN ('available', 'sold', 'unavailable')),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(trip_id, seat_number),
  FOREIGN KEY (trip_id) REFERENCES trips(id) ON DELETE CASCADE
);

CREATE INDEX idx_seat_avail_trip_id ON seat_availability(trip_id);
CREATE INDEX idx_seat_avail_status ON seat_availability(status);

-- 007_create_bookings_table.sql
CREATE TABLE IF NOT EXISTS bookings (
  id SERIAL PRIMARY KEY,
  reference VARCHAR(50) UNIQUE DEFAULT concat('BK-', floor(random()*1000000)),
  user_id INTEGER,
  trip_id INTEGER NOT NULL,
  seat_number INTEGER NOT NULL,
  first_name VARCHAR(100),
  last_name VARCHAR(100),
  email VARCHAR(255),
  phone VARCHAR(20),
  status VARCHAR(50) DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'cancelled', 'expired')),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL,
  FOREIGN KEY (trip_id) REFERENCES trips(id) ON DELETE CASCADE
);

CREATE INDEX idx_bookings_user_id ON bookings(user_id);
CREATE INDEX idx_bookings_trip_id ON bookings(trip_id);
CREATE INDEX idx_bookings_status ON bookings(status);
CREATE INDEX idx_bookings_created_at ON bookings(created_at);

-- 008_create_payments_table.sql
CREATE TABLE IF NOT EXISTS payments (
  id SERIAL PRIMARY KEY,
  booking_id INTEGER NOT NULL,
  user_id INTEGER,
  amount DECIMAL(10, 2) NOT NULL,
  method VARCHAR(50) CHECK (method IN ('mobile_money', 'card', 'cash')),
  status VARCHAR(50) DEFAULT 'pending' CHECK (status IN ('pending', 'completed', 'failed', 'refunded')),
  external_reference VARCHAR(255),
  raw_payload JSONB,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  FOREIGN KEY (booking_id) REFERENCES bookings(id) ON DELETE CASCADE,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL
);

CREATE INDEX idx_payments_booking_id ON payments(booking_id);
CREATE INDEX idx_payments_user_id ON payments(user_id);
CREATE INDEX idx_payments_status ON payments(status);
CREATE INDEX idx_payments_external_ref ON payments(external_reference);
