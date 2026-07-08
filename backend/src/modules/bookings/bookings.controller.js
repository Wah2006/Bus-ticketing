import * as bookingsService from './bookings.service.js';
import { success, paginated } from '../../shared/utils/response.js';

export const createBooking = async (req, res, next) => {
    try {
        const booking = await bookingsService.createBooking(req.user.id, req.body);
        return res.status(201).json(success(booking));
    } catch (error) {
        next(error);
    }
};

export const getBooking = async (req, res, next) => {
    try {
        const booking = await bookingsService.getBooking(req.params.bookingId);
        return res.status(200).json(success(booking));
    } catch (error) {
        next(error);
    }
};

export const confirmBooking = async (req, res, next) => {
    try {
        const booking = await bookingsService.confirmBooking(req.params.bookingId);
        return res.status(200).json(success(booking));
    } catch (error) {
        next(error);
    }
};

export const cancelBooking = async (req, res, next) => {
    try {
        const booking = await bookingsService.cancelBooking(req.params.bookingId, req.user.id);
        return res.status(200).json(success(booking));
    } catch (error) {
        next(error);
    }
};

export const getUserBookings = async (req, res, next) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const pageSize = parseInt(req.query.pageSize) || 20;

        const { bookings, pagination } = await bookingsService.getUserBookings(
            req.user.id,
            page,
            pageSize
        );

        return res.status(200).json(
            paginated(bookings, pagination.page, pagination.pageSize, pagination.total)
        );
    } catch (error) {
        next(error);
    }
};

export const getTripManifest = async (req, res, next) => {
    try {
        const manifest = await bookingsService.getTripManifest(req.params.tripId);
        return res.status(200).json(success(manifest));
    } catch (error) {
        next(error);
    }
};
