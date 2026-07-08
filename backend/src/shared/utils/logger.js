import winston from 'winston';
import dotenv from 'dotenv';

dotenv.config();

const logger = winston.createLogger({
    level: process.env.LOG_LEVEL || 'info',
    format: process.env.LOG_FORMAT === 'json' ? winston.format.json() : winston.format.simple(),
    defaultMeta: { service: 'vibecoding-api' },
    transports: [
        new winston.transports.File({ filename: 'error.log', level: 'error' }),
        new winston.transports.File({ filename: 'combined.log' }),
        new winston.transports.Console({
            format: winston.format.combine(
                winston.format.colorize(),
                winston.format.simple()
            ),
        }),
    ],
});

// Never log sensitive data
export const sanitize = (data) => {
    const sensitive = ['password', 'token', 'cardNumber', 'cvv', 'phone', 'email'];
    const result = { ...data };
    sensitive.forEach((key) => {
        if (result[key]) {
            result[key] = '***REDACTED***';
        }
    });
    return result;
};

export const logRequest = (req, res, next) => {
    const requestId = req.id || `${Date.now()}-${Math.random()}`;
    req.id = requestId;

    const start = Date.now();
    res.on('finish', () => {
        const duration = Date.now() - start;
        logger.info({
            requestId,
            method: req.method,
            path: req.path,
            statusCode: res.statusCode,
            duration: `${duration}ms`,
        });
    });

    next();
};

export default logger;
