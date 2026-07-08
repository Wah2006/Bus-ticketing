import * as paymentsService from './payments.service.js';
import * as bookingsService from '../bookings/bookings.service.js';
import { success, paginated } from '../../shared/utils/response.js';

export const initiatePayment = async (req, res, next) => {
    try {
        const { bookingId, method } = req.body;

        // Verify booking exists and belongs to user
        const booking = await bookingsService.getBooking(bookingId);
        if (booking.user_id !== req.user.id) {
            return res.status(403).json({
                success: false,
                error: { code: 'FORBIDDEN', message: 'Forbidden' },
            });
        }

        // Initiate payment
        const payment = await paymentsService.initiatePayment(
            bookingId,
            req.user.id,
            booking.base_price,
            method
        );

        return res.status(201).json(success(payment));
    } catch (error) {
        next(error);
    }
};

export const handleWebhook = async (req, res, next) => {
    try {
        // Handle webhook idempotently
        const result = await paymentsService.handlePaymentWebhook(req.body);
        return res.status(200).json(success(result));
    } catch (error) {
        // Always return 200 for webhooks to prevent retries from aggregator
        console.error('Webhook error:', error);
        return res.status(200).json({ success: false, error: error.message });
    }
};

export const getPayment = async (req, res, next) => {
    try {
        const payment = await paymentsService.getPayment(req.params.paymentId);
        return res.status(200).json(success(payment));
    } catch (error) {
        next(error);
    }
};

export const getUserPayments = async (req, res, next) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const pageSize = parseInt(req.query.pageSize) || 20;

        const { payments, pagination } = await paymentsService.getUserPayments(
            req.user.id,
            page,
            pageSize
        );

        return res.status(200).json(
            paginated(payments, pagination.page, pagination.pageSize, pagination.total)
        );
    } catch (error) {
        next(error);
    }
};

export const getAgencyRevenue = async (req, res, next) => {
    try {
        const { startDate, endDate } = req.query;

        if (!startDate || !endDate) {
            return res.status(400).json({
                success: false,
                error: { code: 'VALIDATION_ERROR', message: 'startDate and endDate are required' },
            });
        }

        // Staff can only view their own agency revenue
        if (req.user.role === 'agency_staff' && req.user.agencyId !== parseInt(req.params.agencyId)) {
            return res.status(403).json({
                success: false,
                error: { code: 'FORBIDDEN', message: 'Forbidden' },
            });
        }

        const revenue = await paymentsService.getAgencyRevenue(
            req.params.agencyId,
            new Date(startDate),
            new Date(endDate)
        );

        return res.status(200).json(success(revenue));
    } catch (error) {
        next(error);
    }
};
