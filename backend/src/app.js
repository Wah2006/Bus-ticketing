import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { logRequest, errorHandler } from './shared/middleware/errorHandler.js';
import { apiLimiter } from './shared/middleware/rateLimiter.js';
import { setupNotificationListeners } from './modules/notifications/notifications.service.js';

// Routes
import authRoutes from './modules/auth/auth.routes.js';
import agenciesRoutes from './modules/agencies/agencies.routes.js';
import tripsRoutes from './modules/trips/trips.routes.js';
import bookingsRoutes from './modules/bookings/bookings.routes.js';
import paymentsRoutes from './modules/payments/payments.routes.js';

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));

// Logging middleware
app.use(logRequest);

// Rate limiting
app.use('/api/v1', apiLimiter);

// Health check
app.get('/health', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// API v1 routes
const v1 = express.Router();

v1.use('/auth', authRoutes);
v1.use('/agencies', agenciesRoutes);
v1.use('/trips', tripsRoutes);
v1.use('/bookings', bookingsRoutes);
v1.use('/payments', paymentsRoutes);

app.use('/api/v1', v1);

// 404 handler
app.use((req, res) => {
    res.status(404).json({
        success: false,
        error: { code: 'NOT_FOUND', message: 'Endpoint not found' },
    });
});

// Error handler middleware (must be last)
app.use(errorHandler);

// Setup event listeners for notifications
setupNotificationListeners();

export default app;
