// Event bus for inter-module communication
import { EventEmitter } from 'events';

class EventBus extends EventEmitter {
    constructor() {
        super();
        this.setMaxListeners(50);
    }

    emit(event, data) {
        console.log(`Event emitted: ${event}`, data);
        return super.emit(event, data);
    }

    on(event, handler) {
        console.log(`Handler registered for event: ${event}`);
        return super.on(event, handler);
    }

    once(event, handler) {
        console.log(`One-time handler registered for event: ${event}`);
        return super.once(event, handler);
    }
}

export const eventBus = new EventBus();

// Event names - used throughout the app
export const EVENTS = {
    // Auth
    USER_REGISTERED: 'user.registered',
    USER_LOGGED_IN: 'user.logged_in',
    USER_LOGGED_OUT: 'user.logged_out',

    // Booking
    BOOKING_CREATED: 'booking.created',
    BOOKING_CONFIRMED: 'booking.confirmed',
    BOOKING_CANCELLED: 'booking.cancelled',
    BOOKING_EXPIRED: 'booking.expired',

    // Payment
    PAYMENT_INITIATED: 'payment.initiated',
    PAYMENT_COMPLETED: 'payment.completed',
    PAYMENT_FAILED: 'payment.failed',

    // Seat
    SEAT_LOCKED: 'seat.locked',
    SEAT_RELEASED: 'seat.released',
    SEAT_SOLD: 'seat.sold',
};

export default eventBus;
