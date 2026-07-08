import rateLimit from 'express-rate-limit';
import { error } from '../utils/response.js';
import { ERROR_CODES } from '../../config/constants.js';

const windowMs = parseInt(process.env.RATE_LIMIT_WINDOW_MS || 900000);
const maxRequests = parseInt(process.env.RATE_LIMIT_MAX_REQUESTS || 100);

export const apiLimiter = rateLimit({
    windowMs,
    max: maxRequests,
    message: error(ERROR_CODES.INTERNAL_ERROR, 'Too many requests, please try again later'),
    standardHeaders: true,
    legacyHeaders: false,
});

export const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 5, // 5 requests per 15 minutes
    message: error(ERROR_CODES.INTERNAL_ERROR, 'Too many login attempts, please try again later'),
    skipSuccessfulRequests: true,
});

export const paymentLimiter = rateLimit({
    windowMs: 60 * 60 * 1000, // 1 hour
    max: 20, // 20 payment initiations per hour
    message: error(ERROR_CODES.INTERNAL_ERROR, 'Too many payment requests, please try again later'),
});

export default { apiLimiter, authLimiter, paymentLimiter };
