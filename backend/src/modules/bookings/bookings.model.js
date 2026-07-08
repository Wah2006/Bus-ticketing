import { query } from '../../shared/db/pool.js';
import { CONSTANTS } from '../../config/constants.js';

export const createBooking = async (bookingData) => {
    const {
        userId, tripId, seatNumber, firstName, lastName, email, phone, status = CONSTANTS.BOOKING_STATUS.PENDING
    } = bookingData;

    const result = await query(
        `INSERT INTO bookings (user_id, trip_id, seat_number, first_name, last_name, email, phone, status, created_at, updated_at)
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8, NOW(), NOW())
     RETURNING id, reference, user_id, trip_id, seat_number, status, created_at`,
        [userId, tripId, seatNumber, firstName, lastName, email, phone, status]
    );

    return result.rows[0];
};

export const getBookingById = async (bookingId) => {
    const result = await query(
        `SELECT b.*, t.departure_time, t.base_price, r.origin, r.destination, a.name as agency_name
     FROM bookings b
     JOIN trips t ON b.trip_id = t.id
     JOIN routes r ON t.route_id = r.id
     JOIN buses bu ON t.bus_id = bu.id
     JOIN agencies a ON bu.agency_id = a.id
     WHERE b.id = $1`,
        [bookingId]
    );

    return result.rows[0];
};

export const getBookingByReference = async (reference) => {
    const result = await query(
        `SELECT b.*, t.departure_time, t.base_price, r.origin, r.destination
     FROM bookings b
     JOIN trips t ON b.trip_id = t.id
     JOIN routes r ON t.route_id = r.id
     WHERE b.reference = $1`,
        [reference]
    );

    return result.rows[0];
};

export const getUserBookings = async (userId, limit = 20, offset = 0) => {
    const result = await query(
        `SELECT b.*, t.departure_time, t.base_price, r.origin, r.destination, a.name as agency_name
     FROM bookings b
     JOIN trips t ON b.trip_id = t.id
     JOIN routes r ON t.route_id = r.id
     JOIN buses bu ON t.bus_id = bu.id
     JOIN agencies a ON bu.agency_id = a.id
     WHERE b.user_id = $1
     ORDER BY b.created_at DESC
     LIMIT $2 OFFSET $3`,
        [userId, limit, offset]
    );

    return result.rows;
};

export const countUserBookings = async (userId) => {
    const result = await query(
        `SELECT COUNT(*) as count FROM bookings WHERE user_id = $1`,
        [userId]
    );

    return parseInt(result.rows[0].count);
};

export const updateBookingStatus = async (bookingId, status) => {
    await query(
        `UPDATE bookings SET status = $1, updated_at = NOW() WHERE id = $2`,
        [status, bookingId]
    );
};

export const getTripManifest = async (tripId) => {
    const result = await query(
        `SELECT seat_number, first_name, last_name, email, phone, status
     FROM bookings
     WHERE trip_id = $1 AND status = $2
     ORDER BY seat_number ASC`,
        [tripId, CONSTANTS.BOOKING_STATUS.CONFIRMED]
    );

    return result.rows;
};

export const checkSeatBooked = async (tripId, seatNumber) => {
    const result = await query(
        `SELECT id FROM bookings 
     WHERE trip_id = $1 AND seat_number = $2 AND status IN ($3, $4)`,
        [tripId, seatNumber, CONSTANTS.BOOKING_STATUS.CONFIRMED, CONSTANTS.BOOKING_STATUS.PENDING]
    );

    return result.rows.length > 0;
};

export const getExpiredPendingBookings = async () => {
    const cancellationWindow = parseInt(process.env.SEAT_LOCK_DURATION_SECONDS || 600) / 60; // in minutes

    const result = await query(
        `SELECT id, trip_id, seat_number 
     FROM bookings 
     WHERE status = $1 AND created_at < NOW() - INTERVAL '${cancellationWindow} minutes'`,
        [CONSTANTS.BOOKING_STATUS.PENDING]
    );

    return result.rows;
};

export const getAgencyBookings = async (agencyId, limit = 20, offset = 0) => {
    const result = await query(
        `SELECT b.id, b.reference, b.trip_id, b.seat_number, b.first_name, b.last_name, 
            b.email, b.phone, b.status, b.created_at, t.departure_time, 
            r.origin, r.destination
     FROM bookings b
     JOIN trips t ON b.trip_id = t.id
     JOIN routes r ON t.route_id = r.id
     JOIN buses bu ON t.bus_id = bu.id
     WHERE bu.agency_id = $1
     ORDER BY b.created_at DESC
     LIMIT $2 OFFSET $3`,
        [agencyId, limit, offset]
    );

    return result.rows;
};
