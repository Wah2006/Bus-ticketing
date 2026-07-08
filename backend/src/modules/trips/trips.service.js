import * as tripsModel from './trips.model.js';
import { ERROR_CODES } from '../../config/constants.js';

class ApiError extends Error {
    constructor(code, message, statusCode = 400) {
        super(message);
        this.code = code;
        this.statusCode = statusCode;
    }
}

export const createTrip = async (tripData) => {
    return tripsModel.createTrip(tripData);
};

export const getTrip = async (tripId) => {
    const trip = await tripsModel.getTripById(tripId);
    if (!trip) {
        throw new ApiError(
            ERROR_CODES.TRIP_NOT_FOUND,
            'Trip not found',
            404
        );
    }

    // Add seat availability
    const seats = await tripsModel.getSeatAvailability(tripId);
    trip.seats = seats;
    trip.availableSeats = seats.filter(s => s.status === 'available').length;

    return trip;
};

export const searchTrips = async (origin, destination, departureDate, page = 1, pageSize = 20) => {
    const offset = (page - 1) * pageSize;

    const trips = await tripsModel.searchTrips(
        origin,
        destination,
        departureDate,
        pageSize,
        offset
    );

    const total = await tripsModel.countSearchResults(origin, destination, departureDate);

    return {
        trips,
        pagination: { page, pageSize, total },
    };
};

export const listTripsByAgency = async (agencyId, page = 1, pageSize = 20) => {
    const offset = (page - 1) * pageSize;

    const trips = await tripsModel.getTripsByAgency(agencyId, pageSize, offset);

    return {
        trips,
        pagination: { page, pageSize, total: trips.length },
    };
};

export const getSeatAvailability = async (tripId) => {
    await getTrip(tripId); // Verify trip exists

    return tripsModel.getSeatAvailability(tripId);
};

export const getAvailableSeatCount = async (tripId) => {
    return tripsModel.getAvailableSeatCount(tripId);
};

export default {
    createTrip,
    getTrip,
    searchTrips,
    listTripsByAgency,
    getSeatAvailability,
    getAvailableSeatCount,
};
