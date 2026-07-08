// Business rule constants - single source of truth
export const CONSTANTS = {
    // Seat locking
    SEAT_LOCK_DURATION_SECONDS: parseInt(process.env.SEAT_LOCK_DURATION_SECONDS || 600),
    SEAT_LOCK_KEY_PREFIX: process.env.SEAT_LOCK_KEY_PREFIX || 'lock:trip:',

    // Booking
    CANCELLATION_WINDOW_HOURS: parseInt(process.env.CANCELLATION_WINDOW_HOURS || 24),
    AGENCY_COMMISSION_PERCENT: parseFloat(process.env.AGENCY_COMMISSION_PERCENT || 10),

    // User roles
    ROLES: {
        PASSENGER: 'passenger',
        AGENCY_STAFF: 'agency_staff',
        SUPERADMIN: 'superadmin',
    },

    // Booking status
    BOOKING_STATUS: {
        PENDING: 'pending',
        CONFIRMED: 'confirmed',
        CANCELLED: 'cancelled',
        EXPIRED: 'expired',
    },

    // Payment status
    PAYMENT_STATUS: {
        PENDING: 'pending',
        COMPLETED: 'completed',
        FAILED: 'failed',
        REFUNDED: 'refunded',
    },

    // Seat availability status
    SEAT_STATUS: {
        AVAILABLE: 'available',
        SOLD: 'sold',
        UNAVAILABLE: 'unavailable',
    },

    // Agency status
    AGENCY_STATUS: {
        ACTIVE: 'active',
        SUSPENDED: 'suspended',
        INACTIVE: 'inactive',
    },

    // Trip status
    TRIP_STATUS: {
        SCHEDULED: 'scheduled',
        DEPARTED: 'departed',
        COMPLETED: 'completed',
        CANCELLED: 'cancelled',
    },
};

export const ERROR_CODES = {
    // Auth errors
    INVALID_CREDENTIALS: 'INVALID_CREDENTIALS',
    USER_NOT_FOUND: 'USER_NOT_FOUND',
    UNAUTHORIZED: 'UNAUTHORIZED',
    FORBIDDEN: 'FORBIDDEN',
    TOKEN_EXPIRED: 'TOKEN_EXPIRED',
    INVALID_TOKEN: 'INVALID_TOKEN',

    // Validation errors
    VALIDATION_ERROR: 'VALIDATION_ERROR',
    INVALID_REQUEST: 'INVALID_REQUEST',

    // Resource errors
    NOT_FOUND: 'NOT_FOUND',
    ALREADY_EXISTS: 'ALREADY_EXISTS',
    CONFLICT: 'CONFLICT',

    // Booking errors
    SEAT_ALREADY_LOCKED: 'SEAT_ALREADY_LOCKED',
    SEAT_NOT_AVAILABLE: 'SEAT_NOT_AVAILABLE',
    SEAT_SOLD: 'SEAT_SOLD',
    TRIP_NOT_FOUND: 'TRIP_NOT_FOUND',
    BOOKING_NOT_FOUND: 'BOOKING_NOT_FOUND',
    BOOKING_ALREADY_CANCELLED: 'BOOKING_ALREADY_CANCELLED',
    CANCELLATION_WINDOW_CLOSED: 'CANCELLATION_WINDOW_CLOSED',

    // Payment errors
    PAYMENT_FAILED: 'PAYMENT_FAILED',
    PAYMENT_DECLINED: 'PAYMENT_DECLINED',
    PAYMENT_TIMEOUT: 'PAYMENT_TIMEOUT',
    INVALID_PAYMENT_METHOD: 'INVALID_PAYMENT_METHOD',

    // Agency errors
    AGENCY_NOT_FOUND: 'AGENCY_NOT_FOUND',
    AGENCY_SUSPENDED: 'AGENCY_SUSPENDED',
    AGENCY_INACTIVE: 'AGENCY_INACTIVE',

    // Server errors
    INTERNAL_ERROR: 'INTERNAL_ERROR',
    SERVICE_UNAVAILABLE: 'SERVICE_UNAVAILABLE',
};
