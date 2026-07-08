import { query } from '../../shared/db/pool.js';
import { CONSTANTS } from '../../config/constants.js';

// Trip queries
export const createTrip = async (tripData) => {
    const { routeId, busId, departureTime, basePrice, status = CONSTANTS.TRIP_STATUS.SCHEDULED } = tripData;

    const result = await query(
        `INSERT INTO trips (route_id, bus_id, departure_time, base_price, status, created_at, updated_at)
     VALUES ($1, $2, $3, $4, $5, NOW(), NOW())
     RETURNING id, route_id, bus_id, departure_time, base_price, status`,
        [routeId, busId, departureTime, basePrice, status]
    );

    const trip = result.rows[0];

    // Create seat availability records
    const busData = await query('SELECT total_seats FROM buses WHERE id = $1', [busId]);
    const totalSeats = busData.rows[0]?.total_seats || 32;

    for (let seatNumber = 1; seatNumber <= totalSeats; seatNumber++) {
        await query(
            `INSERT INTO seat_availability (trip_id, seat_number, status, created_at, updated_at)
       VALUES ($1, $2, $3, NOW(), NOW())`,
            [trip.id, seatNumber, CONSTANTS.SEAT_STATUS.AVAILABLE]
        );
    }

    return trip;
};

export const getTripById = async (tripId) => {
    const result = await query(
        `SELECT t.id, t.route_id, t.bus_id, t.departure_time, t.base_price, t.status, 
            r.origin, r.destination, r.distance,
            b.registration_number, b.name as bus_name, b.type, b.total_seats,
            a.name as agency_name
     FROM trips t
     JOIN routes r ON t.route_id = r.id
     JOIN buses b ON t.bus_id = b.id
     JOIN agencies a ON b.agency_id = a.id
     WHERE t.id = $1`,
        [tripId]
    );

    return result.rows[0];
};

export const searchTrips = async (origin, destination, departureDate, limit = 20, offset = 0) => {
    // Search by origin and destination, with departure date on that calendar day
    const startOfDay = new Date(departureDate);
    startOfDay.setHours(0, 0, 0, 0);

    const endOfDay = new Date(departureDate);
    endOfDay.setHours(23, 59, 59, 999);

    const result = await query(
        `SELECT t.id, t.route_id, t.bus_id, t.departure_time, t.base_price, t.status,
            r.origin, r.destination, r.distance,
            b.registration_number, b.name as bus_name, b.type, b.total_seats,
            a.id as agency_id, a.name as agency_name,
            COUNT(CASE WHEN sa.status = $4 THEN 1 END) as available_seats
     FROM trips t
     JOIN routes r ON t.route_id = r.id
     JOIN buses b ON t.bus_id = b.id
     JOIN agencies a ON b.agency_id = a.id
     LEFT JOIN seat_availability sa ON t.id = sa.trip_id
     WHERE r.origin ILIKE $1 AND r.destination ILIKE $2
       AND t.departure_time >= $3 AND t.departure_time <= $5
       AND t.status = $6
     GROUP BY t.id, r.id, b.id, a.id
     ORDER BY t.departure_time ASC
     LIMIT $7 OFFSET $8`,
        [origin, destination, startOfDay, CONSTANTS.SEAT_STATUS.AVAILABLE, endOfDay, CONSTANTS.TRIP_STATUS.SCHEDULED, limit, offset]
    );

    return result.rows;
};

export const countSearchResults = async (origin, destination, departureDate) => {
    const startOfDay = new Date(departureDate);
    startOfDay.setHours(0, 0, 0, 0);

    const endOfDay = new Date(departureDate);
    endOfDay.setHours(23, 59, 59, 999);

    const result = await query(
        `SELECT COUNT(DISTINCT t.id) as count
     FROM trips t
     JOIN routes r ON t.route_id = r.id
     WHERE r.origin ILIKE $1 AND r.destination ILIKE $2
       AND t.departure_time >= $3 AND t.departure_time <= $4
       AND t.status = $5`,
        [origin, destination, startOfDay, endOfDay, CONSTANTS.TRIP_STATUS.SCHEDULED]
    );

    return parseInt(result.rows[0].count);
};

export const getTripsByAgency = async (agencyId, limit = 20, offset = 0) => {
    const result = await query(
        `SELECT t.id, t.route_id, t.bus_id, t.departure_time, t.base_price, t.status,
            r.origin, r.destination,
            b.registration_number, b.name as bus_name
     FROM trips t
     JOIN routes r ON t.route_id = r.id
     JOIN buses b ON t.bus_id = b.id
     WHERE b.agency_id = $1
     ORDER BY t.departure_time DESC
     LIMIT $2 OFFSET $3`,
        [agencyId, limit, offset]
    );

    return result.rows;
};

// Seat availability queries
export const getSeatAvailability = async (tripId) => {
    const result = await query(
        `SELECT seat_number, status FROM seat_availability 
     WHERE trip_id = $1 
     ORDER BY seat_number ASC`,
        [tripId]
    );

    return result.rows;
};

export const getSeatStatus = async (tripId, seatNumber) => {
    const result = await query(
        `SELECT status FROM seat_availability 
     WHERE trip_id = $1 AND seat_number = $2`,
        [tripId, seatNumber]
    );

    return result.rows[0]?.status;
};

export const updateSeatStatus = async (tripId, seatNumber, status) => {
    await query(
        `UPDATE seat_availability 
     SET status = $1, updated_at = NOW() 
     WHERE trip_id = $2 AND seat_number = $3`,
        [status, tripId, seatNumber]
    );
};

export const getAvailableSeatCount = async (tripId) => {
    const result = await query(
        `SELECT COUNT(*) as count FROM seat_availability 
     WHERE trip_id = $1 AND status = $2`,
        [tripId, CONSTANTS.SEAT_STATUS.AVAILABLE]
    );

    return parseInt(result.rows[0].count);
};
