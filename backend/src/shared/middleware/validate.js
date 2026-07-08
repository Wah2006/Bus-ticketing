import { error } from '../utils/response.js';
import { ERROR_CODES } from '../../config/constants.js';

export const validate = (schema) => {
    return (req, res, next) => {
        const { error: validationError, value } = schema.validate(
            {
                body: req.body,
                params: req.params,
                query: req.query,
            },
            { abortEarly: false }
        );

        if (validationError) {
            const details = validationError.details.map((err) => ({
                field: err.path.join('.'),
                message: err.message,
            }));

            return res.status(400).json(
                error(ERROR_CODES.VALIDATION_ERROR, 'Request validation failed', { details })
            );
        }

        req.validated = value;
        next();
    };
};

export default validate;
