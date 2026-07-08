import { query } from '../../shared/db/pool.js';

export const createUser = async (userData) => {
    const {
        firstName, lastName, email, phone, passwordHash, role = 'passenger', agencyId = null
    } = userData;

    const result = await query(
        `INSERT INTO users (first_name, last_name, email, phone, password_hash, role, agency_id, created_at, updated_at)
     VALUES ($1, $2, $3, $4, $5, $6, $7, NOW(), NOW())
     RETURNING id, email, first_name, last_name, role, agency_id, created_at`,
        [firstName, lastName, email, phone, passwordHash, role, agencyId]
    );

    return result.rows[0];
};

export const findUserByEmail = async (email) => {
    const result = await query(
        `SELECT * FROM users WHERE email = $1`,
        [email]
    );
    return result.rows[0];
};

export const findUserById = async (userId) => {
    const result = await query(
        `SELECT id, email, first_name, last_name, phone, role, agency_id, created_at, updated_at
     FROM users WHERE id = $1`,
        [userId]
    );
    return result.rows[0];
};

export const findStaffByEmail = async (email) => {
    const result = await query(
        `SELECT * FROM users 
     WHERE email = $1 AND role IN ('agency_staff', 'superadmin')`,
        [email]
    );
    return result.rows[0];
};

export const updateRefreshToken = async (userId, refreshToken) => {
    await query(
        `UPDATE users SET refresh_token = $1, updated_at = NOW() WHERE id = $2`,
        [refreshToken, userId]
    );
};

export const getRefreshToken = async (userId) => {
    const result = await query(
        `SELECT refresh_token FROM users WHERE id = $1`,
        [userId]
    );
    return result.rows[0]?.refresh_token;
};

export const clearRefreshToken = async (userId) => {
    await query(
        `UPDATE users SET refresh_token = NULL, updated_at = NOW() WHERE id = $1`,
        [userId]
    );
};
