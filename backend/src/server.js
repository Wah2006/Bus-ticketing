import dotenv from 'dotenv';
import app from './app.js';
import redisClient from './shared/redis/client.js';

dotenv.config();

const PORT = process.env.PORT || 3000;

let server;

const startServer = async () => {
    try {
        // Connect to Redis
        await redisClient.connect();
        console.log('✓ Redis connected');

        // Start Express server
        server = app.listen(PORT, () => {
            console.log(`✓ Server running on port ${PORT}`);
            console.log(`✓ API available at http://localhost:${PORT}/api/v1`);
            console.log(`✓ Health check: http://localhost:${PORT}/health`);
        });
    } catch (error) {
        console.error('Failed to start server:', error);
        process.exit(1);
    }
};

const gracefulShutdown = async () => {
    console.log('\nShutting down gracefully...');

    if (server) {
        server.close(async () => {
            console.log('✓ Server closed');

            try {
                await redisClient.disconnect();
                console.log('✓ Redis disconnected');
            } catch (error) {
                console.error('Redis disconnect error:', error);
            }

            process.exit(0);
        });

        // Force shutdown after 10 seconds
        setTimeout(() => {
            console.error('Forced shutdown after 10 seconds');
            process.exit(1);
        }, 10000);
    }
};

process.on('SIGTERM', gracefulShutdown);
process.on('SIGINT', gracefulShutdown);

startServer();
