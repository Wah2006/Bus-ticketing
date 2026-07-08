import jwt from 'jsonwebtoken';
import { error } from '../utils/response.js';
import { ERROR_CODES } from '../../config/constants.js';

export const authGuard = (req, res, next) => {
    try {
        const token = req.headers.authorization?.split(' ')[1];

        if (!token) {
            return res.status(401).json(
                error(ERROR_CODES.UNAUTHORIZED, 'No token provided')
            );
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        req.user.id = decoded.sub; // Subject claim is user ID
        next();
    } catch (err) {
        if (err.name === 'TokenExpiredError') {
            return res.status(401).json(
                error(ERROR_CODES.TOKEN_EXPIRED, 'Token has expired')
            );
        }
        return res.status(401).json(
            error(ERROR_CODES.INVALID_TOKEN, 'Invalid token')
        );
    }
};

export default authGuard;
