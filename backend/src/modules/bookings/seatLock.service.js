import redisClient from '../../shared/redis/client.js';
import { CONSTANTS } from '../../config/constants.js';
import { ERROR_CODES } from '../../config/constants.js';

class ApiError extends Error {
    constructor(code, message, statusCode = 400) {
        super(message);
        this.code = code;
        this.statusCode = statusCode;
    }
}

const LOCK_PREFIX = process.env.SEAT_LOCK_KEY_PREFIX || 'lock:trip:';
const LOCK_DURATION = parseInt(process.env.SEAT_LOCK_DURATION_SECONDS || 600);

export const acquireSeatLock = async (tripId, seatNumber, userId) => {
    const lockKey = `${LOCK_PREFIX}${tripId}:seat:${seatNumber}`;
    const lockValue = JSON.stringify({ userId, acquiredAt: new Date().toISOString() });

    try {
        // SET NX EX: Set only if not exists, with expiration
        const result = await redisClient.set(lockKey, lockValue, {
            NX: true,
            EX: LOCK_DURATION,
        });

        if (!result) {
            throw new ApiError(
                ERROR_CODES.SEAT_ALREADY_LOCKED,
                'This seat is currently being booked by another passenger',
                400
            );
        }

        return { success: true, lockKey, expiresIn: LOCK_DURATION };
    } catch (error) {
        if (error.code) throw error;
        throw new ApiError(
            ERROR_CODES.INTERNAL_ERROR,
            'Failed to acquire seat lock',
            500
        );
    }
};

export const releaseSeatLock = async (tripId, seatNumber) => {
    const lockKey = `${LOCK_PREFIX}${tripId}:seat:${seatNumber}`;

    try {
        await redisClient.del(lockKey);
        return { success: true };
    } catch (error) {
        console.error('Error releasing seat lock', error);
        // Don't throw - let lock expire naturally if Redis fails
    }
};

export const getSeatLock = async (tripId, seatNumber) => {
    const lockKey = `${LOCK_PREFIX}${tripId}:seat:${seatNumber}`;

    try {
        const lock = await redisClient.get(lockKey);
        if (!lock) return null;
        return JSON.parse(lock);
    } catch (error) {
        console.error('Error getting seat lock', error);
        return null;
    }
};

export const getTTL = async (tripId, seatNumber) => {
    const lockKey = `${LOCK_PREFIX}${tripId}:seat:${seatNumber}`;

    try {
        const ttl = await redisClient.ttl(lockKey);
        return ttl > 0 ? ttl : null; // null if lock doesn't exist or expired
    } catch (error) {
        console.error('Error getting lock TTL', error);
        return null;
    }
};

export default {
    acquireSeatLock,
    releaseSeatLock,
    getSeatLock,
    getTTL,
};
