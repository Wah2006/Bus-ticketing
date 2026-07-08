import * as bookingsModel from './bookings.model.js';
import * as tripsModel from '../trips/trips.model.js';
import * as seatLockService from './seatLock.service.js';
import { ERROR_CODES, CONSTANTS } from '../../config/constants.js';
import { eventBus, EVENTS } from '../../shared/events/eventBus.js';

class ApiError extends Error {
    constructor(code, message, statusCode = 400) {
        super(message);
        this.code = code;
        this.statusCode = statusCode;
    }
}

export const createBooking = async (userId, bookingData) => {
    const { tripId, seatNumber, firstName, lastName, email, phone } = bookingData;

    // Check if seat exists and get its status
    const seatStatus = await tripsModel.getSeatStatus(tripId, seatNumber);
    if (!seatStatus) {
        throw new ApiError(
            ERROR_CODES.TRIP_NOT_FOUND,
            'Invalid trip or seat',
            404
        );
    }

    // Check if seat is available
    if (seatStatus !== CONSTANTS.SEAT_STATUS.AVAILABLE) {
        throw new ApiError(
            ERROR_CODES.SEAT_NOT_AVAILABLE,
            'This seat is not available',
            400
        );
    }

    // Acquire seat lock (10 minutes)
    try {
        await seatLockService.acquireSeatLock(tripId, seatNumber, userId);
    } catch (error) {
        if (error.code === ERROR_CODES.SEAT_ALREADY_LOCKED) {
            throw error;
        }
        throw new ApiError(
            ERROR_CODES.INTERNAL_ERROR,
            'Could not reserve seat',
            500
        );
    }

    // Create pending booking
    const booking = await bookingsModel.createBooking({
        userId,
        tripId,
        seatNumber,
        firstName,
        lastName,
        email,
        phone,
        status: CONSTANTS.BOOKING_STATUS.PENDING,
    });

    // Emit event
    eventBus.emit(EVENTS.SEAT_LOCKED, {
        bookingId: booking.id,
        tripId,
        seatNumber,
        expiresIn: 600,
    });

    return booking;
};

export const confirmBooking = async (bookingId) => {
    const booking = await getBooking(bookingId);

    if (booking.status !== CONSTANTS.BOOKING_STATUS.PENDING) {
        throw new ApiError(
            ERROR_CODES.CONFLICT,
            'Booking cannot be confirmed in its current state',
            400
        );
    }

    // Update booking status
    await bookingsModel.updateBookingStatus(bookingId, CONSTANTS.BOOKING_STATUS.CONFIRMED);

    // Update seat status to sold
    await tripsModel.updateSeatStatus(booking.trip_id, booking.seat_number, CONSTANTS.SEAT_STATUS.SOLD);

    // Release lock
    await seatLockService.releaseSeatLock(booking.trip_id, booking.seat_number);

    // Emit event
    eventBus.emit(EVENTS.BOOKING_CONFIRMED, {
        bookingId,
        userId: booking.user_id,
        tripId: booking.trip_id,
    });

    return booking;
};

export const cancelBooking = async (bookingId, userId) => {
    const booking = await getBooking(bookingId);

    // Verify ownership
    if (booking.user_id !== userId) {
        throw new ApiError(
            ERROR_CODES.FORBIDDEN,
            'Cannot cancel booking',
            403
        );
    }

    // Check if cancellation window is open
    const hoursOld = (Date.now() - new Date(booking.created_at).getTime()) / (1000 * 60 * 60);
    const cancellationWindow = parseInt(process.env.CANCELLATION_WINDOW_HOURS || 24);

    if (hoursOld > cancellationWindow) {
        throw new ApiError(
            ERROR_CODES.CANCELLATION_WINDOW_CLOSED,
            `Cancellation window closed. You can only cancel within ${cancellationWindow} hours of booking.`,
            400
        );
    }

    // Update booking status
    await bookingsModel.updateBookingStatus(bookingId, CONSTANTS.BOOKING_STATUS.CANCELLED);

    // If pending, release seat. If confirmed, revert seat to available.
    if (booking.status === CONSTANTS.BOOKING_STATUS.PENDING) {
        await seatLockService.releaseSeatLock(booking.trip_id, booking.seat_number);
    } else if (booking.status === CONSTANTS.BOOKING_STATUS.CONFIRMED) {
        await tripsModel.updateSeatStatus(booking.trip_id, booking.seat_number, CONSTANTS.SEAT_STATUS.AVAILABLE);
    }

    // Emit event
    eventBus.emit(EVENTS.BOOKING_CANCELLED, {
        bookingId,
        userId,
        tripId: booking.trip_id,
    });

    return booking;
};

export const getBooking = async (bookingId) => {
    const booking = await bookingsModel.getBookingById(bookingId);
    if (!booking) {
        throw new ApiError(
            ERROR_CODES.BOOKING_NOT_FOUND,
            'Booking not found',
            404
        );
    }
    return booking;
};

export const getUserBookings = async (userId, page = 1, pageSize = 20) => {
    const offset = (page - 1) * pageSize;

    const bookings = await bookingsModel.getUserBookings(userId, pageSize, offset);
    const total = await bookingsModel.countUserBookings(userId);

    return {
        bookings,
        pagination: { page, pageSize, total },
    };
};

export const getTripManifest = async (tripId) => {
    return bookingsModel.getTripManifest(tripId);
};

export const expireUnpaidBookings = async () => {
    // Periodic job to clean up pending bookings whose locks have expired
    const expiredBookings = await bookingsModel.getExpiredPendingBookings();

    for (const booking of expiredBookings) {
        // Mark as expired
        await bookingsModel.updateBookingStatus(booking.id, CONSTANTS.BOOKING_STATUS.EXPIRED);

        // Revert seat to available
        await tripsModel.updateSeatStatus(booking.trip_id, booking.seat_number, CONSTANTS.SEAT_STATUS.AVAILABLE);

        eventBus.emit(EVENTS.BOOKING_EXPIRED, {
            bookingId: booking.id,
            tripId: booking.trip_id,
        });
    }

    return expiredBookings.length;
};

export default {
    createBooking,
    confirmBooking,
    cancelBooking,
    getBooking,
    getUserBookings,
    getTripManifest,
    expireUnpaidBookings,
};
