import Joi from 'joi';

export const registerSchema = Joi.object({
    body: Joi.object({
        firstName: Joi.string().required(),
        lastName: Joi.string().required(),
        email: Joi.string().email().required(),
        phone: Joi.string().required(),
        password: Joi.string().min(8).required(),
        confirmPassword: Joi.string().valid(Joi.ref('password')).required(),
    }),
});

export const loginSchema = Joi.object({
    body: Joi.object({
        email: Joi.string().email().required(),
        password: Joi.string().required(),
    }),
});

export const staffLoginSchema = Joi.object({
    body: Joi.object({
        email: Joi.string().email().required(),
        password: Joi.string().required(),
    }),
});

export const refreshTokenSchema = Joi.object({
    body: Joi.object({
        refreshToken: Joi.string().required(),
    }),
});
