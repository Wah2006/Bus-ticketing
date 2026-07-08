import express from 'express';
import * as authController from './auth.controller.js';
import authGuard from '../../shared/middleware/authGuard.js';
import validate from '../../shared/middleware/validate.js';
import { authLimiter } from '../../shared/middleware/rateLimiter.js';
import {
    registerSchema,
    loginSchema,
    staffLoginSchema,
    refreshTokenSchema,
} from './auth.validation.js';

const router = express.Router();

// Public routes
router.post(
    '/register',
    authLimiter,
    validate(registerSchema),
    authController.register
);

router.post(
    '/login',
    authLimiter,
    validate(loginSchema),
    authController.login
);

router.post(
    '/staff/login',
    authLimiter,
    validate(staffLoginSchema),
    authController.staffLogin
);

router.post(
    '/refresh-token',
    validate(refreshTokenSchema),
    authController.refreshToken
);

// Protected routes
router.post(
    '/logout',
    authGuard,
    authController.logout
);

router.get(
    '/me',
    authGuard,
    authController.getCurrentUser
);

export default router;
