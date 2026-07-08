// Database migration runner
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { query } from '../db/pool.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const migrationsDir = path.join(__dirname, 'migrations');

export const runMigrations = async () => {
    try {
        // Create migrations table if it doesn't exist
        await query(`
      CREATE TABLE IF NOT EXISTS migrations (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) UNIQUE NOT NULL,
        executed_at TIMESTAMP DEFAULT NOW()
      )
    `);

        // Get all migration files
        const files = fs.readdirSync(migrationsDir)
            .filter(f => f.endsWith('.sql'))
            .sort();

        console.log(`Found ${files.length} migration files`);

        for (const file of files) {
            // Check if migration already executed
            const result = await query(
                'SELECT id FROM migrations WHERE name = $1',
                [file]
            );

            if (result.rows.length === 0) {
                console.log(`Running migration: ${file}`);

                // Read and execute migration
                const filePath = path.join(migrationsDir, file);
                const sql = fs.readFileSync(filePath, 'utf8');

                // Execute migration
                await query(sql);

                // Record migration
                await query(
                    'INSERT INTO migrations (name) VALUES ($1)',
                    [file]
                );

                console.log(`✓ Completed: ${file}`);
            } else {
                console.log(`⊘ Already executed: ${file}`);
            }
        }

        console.log('All migrations completed');
    } catch (error) {
        console.error('Migration error:', error);
        throw error;
    }
};

// Run migrations if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
    runMigrations()
        .then(() => process.exit(0))
        .catch((error) => {
            console.error(error);
            process.exit(1);
        });
}

export default runMigrations;
