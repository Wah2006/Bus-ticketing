import express from 'express';
import * as tripsController from './trips.controller.js';
import authGuard from '../../shared/middleware/authGuard.js';
import roleGuard from '../../shared/middleware/roleGuard.js';
import validate from '../../shared/middleware/validate.js';
import { CONSTANTS } from '../../config/constants.js';
import { createTripSchema, searchTripsSchema } from './trips.validation.js';

const router = express.Router();

// Public search
router.get('/search', validate(searchTripsSchema), tripsController.searchTrips);

// Trip detail
router.get('/:tripId', tripsController.getTrip);

// Seat availability for a trip
router.get('/:tripId/seats', tripsController.getSeatAvailability);

// Agency trips (staff only)
router.get(
    '/agency/:agencyId/trips',
    authGuard,
    roleGuard(CONSTANTS.ROLES.AGENCY_STAFF, CONSTANTS.ROLES.SUPERADMIN),
    tripsController.getTripsByAgency
);

// Create trip (staff/superadmin only)
router.post(
    '/',
    authGuard,
    roleGuard(CONSTANTS.ROLES.AGENCY_STAFF, CONSTANTS.ROLES.SUPERADMIN),
    validate(createTripSchema),
    tripsController.createTrip
);

export default router;
