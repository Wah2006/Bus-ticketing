import Joi from 'joi';

export const createBookingSchema = Joi.object({
    body: Joi.object({
        tripId: Joi.number().required(),
        seatNumber: Joi.number().min(1).required(),
        firstName: Joi.string().required(),
        lastName: Joi.string().required(),
        email: Joi.string().email().required(),
        phone: Joi.string().required(),
    }),
});

export const cancelBookingSchema = Joi.object({
    body: Joi.object({
        reason: Joi.string(),
    }),
});

export const staffCreateBookingSchema = Joi.object({
    body: Joi.object({
        tripId: Joi.number().required(),
        seatNumber: Joi.number().min(1).required(),
        passengerName: Joi.string().required(),
        passengerPhone: Joi.string().required(),
        paymentMethod: Joi.string().valid('cash', 'mobile_money', 'card'),
        amountPaid: Joi.number().min(0),
    }),
});
