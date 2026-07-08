// Seed data for development
import bcrypt from 'bcryptjs';
import { query } from '../db/pool.js';

export const seedDatabase = async () => {
    try {
        console.log('Seeding database...');

        // Seed agencies
        const agencies = [
            { name: 'Moghamo Express', email: 'admin@moghamo.com', city: 'Douala' },
            { name: 'Vatican Express', email: 'admin@vatican.com', city: 'Yaoundé' },
            { name: 'Touristique Express', email: 'admin@touristique.com', city: 'Douala' },
        ];

        const agencyIds = [];
        for (const agency of agencies) {
            const result = await query(
                `INSERT INTO agencies (name, email, city, status, created_at, updated_at)
         VALUES ($1, $2, $3, 'active', NOW(), NOW())
         ON CONFLICT DO NOTHING
         RETURNING id`,
                [agency.name, agency.email, agency.city]
            );
            if (result.rows[0]) {
                agencyIds.push(result.rows[0].id);
            }
        }

        // Seed users
        const passwordHash = await bcrypt.hash('password123', 10);

        const users = [
            { email: 'passenger@example.com', firstName: 'John', lastName: 'Doe', phone: '+237123456789', role: 'passenger', agencyId: null },
            { email: 'staff@moghamo.com', firstName: 'Jane', lastName: 'Smith', phone: '+237123456790', role: 'agency_staff', agencyId: agencyIds[0] },
            { email: 'admin@vibecoding.com', firstName: 'Admin', lastName: 'User', phone: '+237123456791', role: 'superadmin', agencyId: null },
        ];

        for (const user of users) {
            await query(
                `INSERT INTO users (email, password_hash, first_name, last_name, phone, role, agency_id, created_at, updated_at)
         VALUES ($1, $2, $3, $4, $5, $6, $7, NOW(), NOW())
         ON CONFLICT DO NOTHING`,
                [user.email, passwordHash, user.firstName, user.lastName, user.phone, user.role, user.agencyId]
            );
        }

        // Seed buses
        if (agencyIds.length > 0) {
            const buses = [
                { agencyId: agencyIds[0], registration: 'CM001ABC', name: 'Moghamo Luxury 1', type: 'luxury', seats: 32 },
                { agencyId: agencyIds[0], registration: 'CM002ABC', name: 'Moghamo Coaster 1', type: 'coaster', seats: 50 },
                { agencyId: agencyIds[1], registration: 'CM003ABC', name: 'Vatican Express 1', type: 'luxury', seats: 32 },
            ];

            for (const bus of buses) {
                await query(
                    `INSERT INTO buses (agency_id, registration_number, name, type, total_seats, status, created_at, updated_at)
           VALUES ($1, $2, $3, $4, $5, 'active', NOW(), NOW())
           ON CONFLICT DO NOTHING`,
                    [bus.agencyId, bus.registration, bus.name, bus.type, bus.seats]
                );
            }
        }

        // Seed routes
        if (agencyIds.length > 0) {
            const routes = [
                { agencyId: agencyIds[0], origin: 'Douala', destination: 'Yaoundé', distance: 250, duration: 240 },
                { agencyId: agencyIds[0], origin: 'Douala', destination: 'Bamenda', distance: 350, duration: 420 },
                { agencyId: agencyIds[1], origin: 'Yaoundé', destination: 'Bamenda', distance: 400, duration: 480 },
            ];

            for (const route of routes) {
                await query(
                    `INSERT INTO routes (agency_id, origin, destination, distance, estimated_duration, created_at, updated_at)
           VALUES ($1, $2, $3, $4, $5, NOW(), NOW())
           ON CONFLICT DO NOTHING`,
                    [route.agencyId, route.origin, route.destination, route.distance, route.duration]
                );
            }
        }

        console.log('✓ Database seeded successfully');
    } catch (error) {
        console.error('Seeding error:', error);
        throw error;
    }
};

// Run seed if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
    seedDatabase()
        .then(() => process.exit(0))
        .catch((error) => {
            console.error(error);
            process.exit(1);
        });
}

export default seedDatabase;
