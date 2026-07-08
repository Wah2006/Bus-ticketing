import { error } from '../utils/response.js';
import { ERROR_CODES } from '../../config/constants.js';

export const roleGuard = (...allowedRoles) => {
    return (req, res, next) => {
        if (!req.user) {
            return res.status(401).json(
                error(ERROR_CODES.UNAUTHORIZED, 'Authentication required')
            );
        }

        if (!allowedRoles.includes(req.user.role)) {
            return res.status(403).json(
                error(ERROR_CODES.FORBIDDEN, 'Insufficient permissions')
            );
        }

        next();
    };
};

export default roleGuard;
