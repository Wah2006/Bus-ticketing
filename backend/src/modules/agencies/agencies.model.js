import { query } from '../../shared/db/pool.js';
import { CONSTANTS } from '../../config/constants.js';

// Agency queries
export const createAgency = async (agencyData) => {
    const { name, email, phone, address, city, logo } = agencyData;

    const result = await query(
        `INSERT INTO agencies (name, email, phone, address, city, logo, status, created_at, updated_at)
     VALUES ($1, $2, $3, $4, $5, $6, $7, NOW(), NOW())
     RETURNING id, name, email, phone, status, created_at`,
        [name, email, phone, address, city, logo, CONSTANTS.AGENCY_STATUS.ACTIVE]
    );

    return result.rows[0];
};

export const getAgencyById = async (agencyId) => {
    const result = await query(
        `SELECT * FROM agencies WHERE id = $1`,
        [agencyId]
    );
    return result.rows[0];
};

export const getAllAgencies = async (limit = 10, offset = 0) => {
    const result = await query(
        `SELECT * FROM agencies ORDER BY created_at DESC LIMIT $1 OFFSET $2`,
        [limit, offset]
    );
    return result.rows;
};

export const updateAgency = async (agencyId, agencyData) => {
    const { name, email, phone, address, city, logo } = agencyData;

    const result = await query(
        `UPDATE agencies 
     SET name = COALESCE($1, name),
         email = COALESCE($2, email),
         phone = COALESCE($3, phone),
         address = COALESCE($4, address),
         city = COALESCE($5, city),
         logo = COALESCE($6, logo),
         updated_at = NOW()
     WHERE id = $7
     RETURNING id, name, email, phone, status`,
        [name, email, phone, address, city, logo, agencyId]
    );

    return result.rows[0];
};

// Bus queries
export const createBus = async (agencyId, busData) => {
    const { registrationNumber, name, type, totalSeats, status } = busData;

    const result = await query(
        `INSERT INTO buses (agency_id, registration_number, name, type, total_seats, status, created_at, updated_at)
     VALUES ($1, $2, $3, $4, $5, $6, NOW(), NOW())
     RETURNING id, registration_number, name, type, total_seats, status`,
        [agencyId, registrationNumber, name, type, totalSeats, status || 'active']
    );

    return result.rows[0];
};

export const getBusById = async (busId) => {
    const result = await query(
        `SELECT * FROM buses WHERE id = $1`,
        [busId]
    );
    return result.rows[0];
};

export const getBusesByAgency = async (agencyId, limit = 20, offset = 0) => {
    const result = await query(
        `SELECT * FROM buses WHERE agency_id = $1 ORDER BY created_at DESC LIMIT $2 OFFSET $3`,
        [agencyId, limit, offset]
    );
    return result.rows;
};

// Route queries
export const createRoute = async (agencyId, routeData) => {
    const { origin, destination, distance, estimatedDuration } = routeData;

    const result = await query(
        `INSERT INTO routes (agency_id, origin, destination, distance, estimated_duration, created_at, updated_at)
     VALUES ($1, $2, $3, $4, $5, NOW(), NOW())
     RETURNING id, origin, destination, distance, estimated_duration`,
        [agencyId, origin, destination, distance, estimatedDuration]
    );

    return result.rows[0];
};

export const getRouteById = async (routeId) => {
    const result = await query(
        `SELECT * FROM routes WHERE id = $1`,
        [routeId]
    );
    return result.rows[0];
};

export const getRoutesByAgency = async (agencyId, limit = 20, offset = 0) => {
    const result = await query(
        `SELECT * FROM routes WHERE agency_id = $1 ORDER BY created_at DESC LIMIT $2 OFFSET $3`,
        [agencyId, limit, offset]
    );
    return result.rows;
};

// Count queries for pagination
export const countAgencies = async () => {
    const result = await query(`SELECT COUNT(*) as count FROM agencies`);
    return parseInt(result.rows[0].count);
};

export const countBusesByAgency = async (agencyId) => {
    const result = await query(
        `SELECT COUNT(*) as count FROM buses WHERE agency_id = $1`,
        [agencyId]
    );
    return parseInt(result.rows[0].count);
};

export const countRoutesByAgency = async (agencyId) => {
    const result = await query(
        `SELECT COUNT(*) as count FROM routes WHERE agency_id = $1`,
        [agencyId]
    );
    return parseInt(result.rows[0].count);
};
