import express from 'express';
import * as paymentsController from './payments.controller.js';
import authGuard from '../../shared/middleware/authGuard.js';
import roleGuard from '../../shared/middleware/roleGuard.js';
import { CONSTANTS } from '../../config/constants.js';

const router = express.Router();

// Webhook (no auth - called by payment aggregator)
router.post('/webhooks/payments', paymentsController.handleWebhook);

// Initiate payment (passenger only)
router.post(
    '/initiate',
    authGuard,
    roleGuard(CONSTANTS.ROLES.PASSENGER),
    paymentsController.initiatePayment
);

// Get payment details
router.get(
    '/:paymentId',
    authGuard,
    paymentsController.getPayment
);

// Get user's payments
router.get(
    '/user/payments',
    authGuard,
    paymentsController.getUserPayments
);

// Get agency revenue
router.get(
    '/agency/:agencyId/revenue',
    authGuard,
    roleGuard(CONSTANTS.ROLES.AGENCY_STAFF, CONSTANTS.ROLES.SUPERADMIN),
    paymentsController.getAgencyRevenue
);

export default router;
