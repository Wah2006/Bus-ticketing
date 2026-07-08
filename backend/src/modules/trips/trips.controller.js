import * as tripsService from './trips.service.js';
import { success, paginated } from '../../shared/utils/response.js';

export const createTrip = async (req, res, next) => {
    try {
        // Only agency staff and superadmin can create trips
        if (req.user.role !== 'agency_staff' && req.user.role !== 'superadmin') {
            return res.status(403).json({ success: false, error: { code: 'FORBIDDEN', message: 'Forbidden' } });
        }

        const trip = await tripsService.createTrip(req.body);
        return res.status(201).json(success(trip));
    } catch (error) {
        next(error);
    }
};

export const getTrip = async (req, res, next) => {
    try {
        const trip = await tripsService.getTrip(req.params.tripId);
        return res.status(200).json(success(trip));
    } catch (error) {
        next(error);
    }
};

export const searchTrips = async (req, res, next) => {
    try {
        const { origin, destination, departureDate } = req.query;

        if (!origin || !destination || !departureDate) {
            return res.status(400).json({
                success: false,
                error: { code: 'VALIDATION_ERROR', message: 'origin, destination, and departureDate are required' },
            });
        }

        const page = parseInt(req.query.page) || 1;
        const pageSize = parseInt(req.query.pageSize) || 20;

        const { trips, pagination } = await tripsService.searchTrips(
            origin,
            destination,
            new Date(departureDate),
            page,
            pageSize
        );

        return res.status(200).json(
            paginated(trips, pagination.page, pagination.pageSize, pagination.total)
        );
    } catch (error) {
        next(error);
    }
};

export const getTripsByAgency = async (req, res, next) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const pageSize = parseInt(req.query.pageSize) || 20;

        // Staff can only view their own agency's trips
        if (req.user.role === 'agency_staff' && req.user.agencyId !== parseInt(req.params.agencyId)) {
            return res.status(403).json({ success: false, error: { code: 'FORBIDDEN', message: 'Forbidden' } });
        }

        const { trips, pagination } = await tripsService.listTripsByAgency(
            req.params.agencyId,
            page,
            pageSize
        );

        return res.status(200).json(
            paginated(trips, pagination.page, pagination.pageSize, pagination.total)
        );
    } catch (error) {
        next(error);
    }
};

export const getSeatAvailability = async (req, res, next) => {
    try {
        const seats = await tripsService.getSeatAvailability(req.params.tripId);
        return res.status(200).json(success(seats));
    } catch (error) {
        next(error);
    }
};
