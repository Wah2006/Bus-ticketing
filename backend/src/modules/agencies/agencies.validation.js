import Joi from 'joi';

export const createAgencySchema = Joi.object({
    body: Joi.object({
        name: Joi.string().required(),
        email: Joi.string().email().required(),
        phone: Joi.string().required(),
        address: Joi.string(),
        city: Joi.string(),
        logo: Joi.string(),
    }),
});

export const updateAgencySchema = Joi.object({
    body: Joi.object({
        name: Joi.string(),
        email: Joi.string().email(),
        phone: Joi.string(),
        address: Joi.string(),
        city: Joi.string(),
        logo: Joi.string(),
    }),
});

export const createBusSchema = Joi.object({
    body: Joi.object({
        registrationNumber: Joi.string().required(),
        name: Joi.string().required(),
        type: Joi.string().valid('sedan', 'coaster', 'luxury').required(),
        totalSeats: Joi.number().min(1).required(),
        status: Joi.string().valid('active', 'inactive', 'maintenance'),
    }),
});

export const createRouteSchema = Joi.object({
    body: Joi.object({
        origin: Joi.string().required(),
        destination: Joi.string().required(),
        distance: Joi.number().min(0),
        estimatedDuration: Joi.number().min(0),
    }),
});

export const createTripSchema = Joi.object({
    body: Joi.object({
        routeId: Joi.number().required(),
        busId: Joi.number().required(),
        departureTime: Joi.date().required(),
        basePrice: Joi.number().min(0).required(),
        availableSeats: Joi.number().min(0),
    }),
});
