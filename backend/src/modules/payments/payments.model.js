import { query } from '../../shared/db/pool.js';
import { CONSTANTS } from '../../config/constants.js';

export const createPayment = async (paymentData) => {
    const {
        bookingId,
        userId,
        amount,
        method,
        status = CONSTANTS.PAYMENT_STATUS.PENDING,
        externalReference = null,
        rawPayload = null,
    } = paymentData;

    const result = await query(
        `INSERT INTO payments (booking_id, user_id, amount, method, status, external_reference, raw_payload, created_at, updated_at)
     VALUES ($1, $2, $3, $4, $5, $6, $7, NOW(), NOW())
     RETURNING id, external_reference, amount, status, created_at`,
        [bookingId, userId, amount, method, status, externalReference, rawPayload ? JSON.stringify(rawPayload) : null]
    );

    return result.rows[0];
};

export const getPaymentById = async (paymentId) => {
    const result = await query(
        `SELECT * FROM payments WHERE id = $1`,
        [paymentId]
    );

    return result.rows[0];
};

export const getPaymentByExternalReference = async (externalReference) => {
    const result = await query(
        `SELECT * FROM payments WHERE external_reference = $1`,
        [externalReference]
    );

    return result.rows[0];
};

export const getPaymentByBooking = async (bookingId) => {
    const result = await query(
        `SELECT * FROM payments WHERE booking_id = $1 ORDER BY created_at DESC LIMIT 1`,
        [bookingId]
    );

    return result.rows[0];
};

export const updatePaymentStatus = async (paymentId, status, rawPayload = null) => {
    const payloadJson = rawPayload ? JSON.stringify(rawPayload) : null;

    await query(
        `UPDATE payments 
     SET status = $1, raw_payload = COALESCE($2::jsonb, raw_payload), updated_at = NOW()
     WHERE id = $2`,
        [status, paymentId, payloadJson]
    );
};

export const getPaymentsByUser = async (userId, limit = 20, offset = 0) => {
    const result = await query(
        `SELECT p.*, b.trip_id, b.seat_number
     FROM payments p
     JOIN bookings b ON p.booking_id = b.id
     WHERE p.user_id = $1
     ORDER BY p.created_at DESC
     LIMIT $2 OFFSET $3`,
        [userId, limit, offset]
    );

    return result.rows;
};

export const countUserPayments = async (userId) => {
    const result = await query(
        `SELECT COUNT(*) as count FROM payments WHERE user_id = $1`,
        [userId]
    );

    return parseInt(result.rows[0].count);
};

export const getAgencyRevenue = async (agencyId, startDate, endDate) => {
    const result = await query(
        `SELECT 
       SUM(p.amount) as total_revenue,
       COUNT(DISTINCT b.id) as total_bookings,
       COUNT(DISTINCT p.id) as total_payments
     FROM payments p
     JOIN bookings b ON p.booking_id = b.id
     JOIN trips t ON b.trip_id = t.id
     JOIN buses bu ON t.bus_id = bu.id
     WHERE bu.agency_id = $1 
       AND p.status = $2
       AND p.created_at >= $3
       AND p.created_at <= $4`,
        [agencyId, CONSTANTS.PAYMENT_STATUS.COMPLETED, startDate, endDate]
    );

    return result.rows[0];
};
