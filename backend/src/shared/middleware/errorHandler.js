import { error } from '../utils/response.js';
import logger, { sanitize } from '../utils/logger.js';
import { ERROR_CODES } from '../../config/constants.js';

export const errorHandler = (err, req, res, next) => {
    const requestId = req.id || 'unknown';

    // Log the error
    logger.error({
        requestId,
        error: err.message,
        stack: err.stack,
        data: sanitize(err.data || {}),
    });

    // Handle known error types
    if (err.code) {
        const statusCode = err.statusCode || 400;
        return res.status(statusCode).json(
            error(err.code, err.message)
        );
    }

    // Handle validation errors
    if (err.isJoi) {
        return res.status(400).json(
            error(ERROR_CODES.VALIDATION_ERROR, err.message)
        );
    }

    // Handle database errors
    if (err.name === 'DatabaseError') {
        return res.status(500).json(
            error(ERROR_CODES.INTERNAL_ERROR, 'Database error occurred')
        );
    }

    // Default error response
    const statusCode = err.statusCode || 500;
    const errorCode = err.code || ERROR_CODES.INTERNAL_ERROR;
    const message = process.env.NODE_ENV === 'production'
        ? 'An error occurred'
        : err.message;

    return res.status(statusCode).json(
        error(errorCode, message)
    );
};

export default errorHandler;
