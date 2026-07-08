import express from 'express';
import * as bookingsController from './bookings.controller.js';
import authGuard from '../../shared/middleware/authGuard.js';
import roleGuard from '../../shared/middleware/roleGuard.js';
import validate from '../../shared/middleware/validate.js';
import { CONSTANTS } from '../../config/constants.js';
import { createBookingSchema, cancelBookingSchema } from './bookings.validation.js';

const router = express.Router();

// Public manifest (for agencies)
router.get(
    '/trips/:tripId/manifest',
    authGuard,
    roleGuard(CONSTANTS.ROLES.AGENCY_STAFF, CONSTANTS.ROLES.SUPERADMIN),
    bookingsController.getTripManifest
);

// Passenger routes (protected)
router.post(
    '/',
    authGuard,
    roleGuard(CONSTANTS.ROLES.PASSENGER),
    validate(createBookingSchema),
    bookingsController.createBooking
);

router.get(
    '/my-bookings',
    authGuard,
    bookingsController.getUserBookings
);

router.get(
    '/:bookingId',
    authGuard,
    bookingsController.getBooking
);

router.post(
    '/:bookingId/confirm',
    authGuard,
    bookingsController.confirmBooking
);

router.post(
    '/:bookingId/cancel',
    authGuard,
    validate(cancelBookingSchema),
    bookingsController.cancelBooking
);

export default router;
