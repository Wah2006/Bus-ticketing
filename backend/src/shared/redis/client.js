import { createClient } from 'redis';
import dotenv from 'dotenv';

dotenv.config();

const client = createClient({
    host: process.env.REDIS_HOST || 'localhost',
    port: process.env.REDIS_PORT || 6379,
});

client.on('error', (err) => {
    console.error('Redis client error', err);
});

client.on('connect', () => {
    console.log('Redis client connected');
});

export const connect = async () => {
    await client.connect();
};

export const disconnect = async () => {
    await client.quit();
};

export default client;
