import Joi from 'joi';

export const searchTripsSchema = Joi.object({
    query: Joi.object({
        origin: Joi.string().required(),
        destination: Joi.string().required(),
        departureDate: Joi.date().required(),
        page: Joi.number().min(1),
        pageSize: Joi.number().min(1).max(100),
    }),
});

export const getTripSchema = Joi.object({
    params: Joi.object({
        tripId: Joi.number().required(),
    }),
});

export const createTripSchema = Joi.object({
    body: Joi.object({
        routeId: Joi.number().required(),
        busId: Joi.number().required(),
        departureTime: Joi.date().required(),
        basePrice: Joi.number().min(0).required(),
        availableSeats: Joi.number().min(0),
        status: Joi.string(),
    }),
});
