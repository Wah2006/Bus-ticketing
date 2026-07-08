import * as paymentsModel from './payments.model.js';
import * as bookingsService from '../bookings/bookings.service.js';
import { ERROR_CODES, CONSTANTS } from '../../config/constants.js';
import { eventBus, EVENTS } from '../../shared/events/eventBus.js';
import crypto from 'crypto';

class ApiError extends Error {
    constructor(code, message, statusCode = 400) {
        super(message);
        this.code = code;
        this.statusCode = statusCode;
    }
}

export const initiatePayment = async (bookingId, userId, amount, method) => {
    // Create payment record with pending status
    const payment = await paymentsModel.createPayment({
        bookingId,
        userId,
        amount,
        method,
        status: CONSTANTS.PAYMENT_STATUS.PENDING,
    });

    // Generate payment reference
    const paymentReference = `PAY-${payment.id}-${Date.now()}`;

    // Emit event
    eventBus.emit(EVENTS.PAYMENT_INITIATED, {
        paymentId: payment.id,
        bookingId,
        amount,
        method,
        reference: paymentReference,
    });

    return {
        ...payment,
        reference: paymentReference,
    };
};

export const handlePaymentWebhook = async (webhookData) => {
    // Verify webhook signature (implementation depends on provider)
    // verifyWebhookSignature(webhookData, signature);

    const externalReference = webhookData.transactionId || webhookData.reference;

    // Check for idempotency - if payment already processed, return success
    let payment = await paymentsModel.getPaymentByExternalReference(externalReference);

    if (payment && payment.status === CONSTANTS.PAYMENT_STATUS.COMPLETED) {
        // Already processed
        return { success: true, alreadyProcessed: true };
    }

    if (!payment) {
        throw new ApiError(
            ERROR_CODES.PAYMENT_FAILED,
            'Payment record not found',
            404
        );
    }

    const isSuccessful = webhookData.status === 'success' || webhookData.status === 'completed';

    if (isSuccessful) {
        // Update payment status
        await paymentsModel.updatePaymentStatus(
            payment.id,
            CONSTANTS.PAYMENT_STATUS.COMPLETED,
            webhookData
        );

        // Confirm booking
        await bookingsService.confirmBooking(payment.booking_id);

        // Emit event
        eventBus.emit(EVENTS.PAYMENT_COMPLETED, {
            paymentId: payment.id,
            bookingId: payment.booking_id,
            amount: payment.amount,
        });
    } else {
        // Payment failed
        await paymentsModel.updatePaymentStatus(
            payment.id,
            CONSTANTS.PAYMENT_STATUS.FAILED,
            webhookData
        );

        // Cancel booking
        await bookingsService.cancelBooking(payment.booking_id, payment.user_id);

        eventBus.emit(EVENTS.PAYMENT_FAILED, {
            paymentId: payment.id,
            bookingId: payment.booking_id,
            reason: webhookData.failureReason || 'Payment declined',
        });
    }

    return { success: true };
};

export const getPayment = async (paymentId) => {
    const payment = await paymentsModel.getPaymentById(paymentId);
    if (!payment) {
        throw new ApiError(
            ERROR_CODES.NOT_FOUND,
            'Payment not found',
            404
        );
    }
    return payment;
};

export const getUserPayments = async (userId, page = 1, pageSize = 20) => {
    const offset = (page - 1) * pageSize;

    const payments = await paymentsModel.getPaymentsByUser(userId, pageSize, offset);
    const total = await paymentsModel.countUserPayments(userId);

    return {
        payments,
        pagination: { page, pageSize, total },
    };
};

export const getAgencyRevenue = async (agencyId, startDate, endDate) => {
    return paymentsModel.getAgencyRevenue(agencyId, startDate, endDate);
};

export default {
    initiatePayment,
    handlePaymentWebhook,
    getPayment,
    getUserPayments,
    getAgencyRevenue,
};
