import { eventBus, EVENTS } from '../../shared/events/eventBus.js';
import { sendSMS } from './sms.provider.js';
import { sendEmail } from './email.provider.js';

export const setupNotificationListeners = () => {
    // Booking confirmed
    eventBus.on(EVENTS.BOOKING_CONFIRMED, async (data) => {
        console.log('Booking confirmed event received:', data);
        try {
            // Send confirmation SMS and email
            // await notifyBookingConfirmed(data);
        } catch (error) {
            console.error('Error sending booking confirmation notification:', error);
        }
    });

    // Booking cancelled
    eventBus.on(EVENTS.BOOKING_CANCELLED, async (data) => {
        console.log('Booking cancelled event received:', data);
        try {
            // Send cancellation notification
            // await notifyBookingCancelled(data);
        } catch (error) {
            console.error('Error sending booking cancellation notification:', error);
        }
    });

    // Payment completed
    eventBus.on(EVENTS.PAYMENT_COMPLETED, async (data) => {
        console.log('Payment completed event received:', data);
        try {
            // Send payment confirmation
            // await notifyPaymentCompleted(data);
        } catch (error) {
            console.error('Error sending payment notification:', error);
        }
    });

    // Payment failed
    eventBus.on(EVENTS.PAYMENT_FAILED, async (data) => {
        console.log('Payment failed event received:', data);
        try {
            // Send payment failure notification
            // await notifyPaymentFailed(data);
        } catch (error) {
            console.error('Error sending payment failure notification:', error);
        }
    });

    console.log('Notification listeners setup complete');
};

// Notification templates
export const notifyBookingConfirmed = async (bookingData) => {
    const { bookingId, passengerEmail, passengerPhone, reference, tripInfo } = bookingData;

    const smsMessage = `Your VibeCoding booking is confirmed! Reference: ${reference}`;
    const emailSubject = 'Booking Confirmation - VibeCoding';
    const emailHtml = `
    <h2>Booking Confirmed!</h2>
    <p>Your booking reference: <strong>${reference}</strong></p>
    <p>Trip: ${tripInfo.origin} → ${tripInfo.destination}</p>
    <p>Date: ${tripInfo.departureTime}</p>
    <p>Seat: ${tripInfo.seatNumber}</p>
    <p>Download your e-ticket and present it at the station.</p>
  `;

    // Send SMS and email (non-blocking)
    Promise.all([
        sendSMS(passengerPhone, smsMessage),
        sendEmail(passengerEmail, emailSubject, emailHtml),
    ]).catch((error) => {
        console.error('Error sending notifications:', error);
    });
};

export const notifyPaymentCompleted = async (paymentData) => {
    const { passengerEmail, passengerPhone, reference, amount } = paymentData;

    const smsMessage = `Payment received for booking ${reference}. Amount: ${amount} XAF`;
    const emailSubject = 'Payment Received - VibeCoding';
    const emailHtml = `
    <h2>Payment Confirmed</h2>
    <p>Booking Reference: <strong>${reference}</strong></p>
    <p>Amount: <strong>${amount} XAF</strong></p>
    <p>Your e-ticket is ready. Download it from your account.</p>
  `;

    Promise.all([
        sendSMS(passengerPhone, smsMessage),
        sendEmail(passengerEmail, emailSubject, emailHtml),
    ]).catch((error) => {
        console.error('Error sending notifications:', error);
    });
};

export default { setupNotificationListeners };
