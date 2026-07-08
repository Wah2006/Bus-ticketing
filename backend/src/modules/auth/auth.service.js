import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import * as authModel from './auth.model.js';
import { ERROR_CODES } from '../../config/constants.js';

class ApiError extends Error {
    constructor(code, message, statusCode = 400) {
        super(message);
        this.code = code;
        this.statusCode = statusCode;
    }
}

export const register = async (userData) => {
    const { firstName, lastName, email, phone, password } = userData;

    // Check if user already exists
    const existingUser = await authModel.findUserByEmail(email);
    if (existingUser) {
        throw new ApiError(
            ERROR_CODES.ALREADY_EXISTS,
            'Email already registered',
            400
        );
    }

    // Hash password
    const passwordHash = await bcrypt.hash(password, 10);

    // Create user
    const user = await authModel.createUser({
        firstName,
        lastName,
        email,
        phone,
        passwordHash,
        role: 'passenger',
    });

    // Generate tokens
    const { accessToken, refreshToken } = generateTokens(user);

    // Store refresh token
    await authModel.updateRefreshToken(user.id, refreshToken);

    return {
        user: {
            id: user.id,
            email: user.email,
            firstName: user.first_name,
            lastName: user.last_name,
            role: user.role,
        },
        accessToken,
        refreshToken,
    };
};

export const login = async (email, password) => {
    // Find user
    const user = await authModel.findUserByEmail(email);
    if (!user) {
        throw new ApiError(
            ERROR_CODES.INVALID_CREDENTIALS,
            'Invalid email or password',
            401
        );
    }

    // Check password
    const isPasswordValid = await bcrypt.compare(password, user.password_hash);
    if (!isPasswordValid) {
        throw new ApiError(
            ERROR_CODES.INVALID_CREDENTIALS,
            'Invalid email or password',
            401
        );
    }

    // Generate tokens
    const { accessToken, refreshToken } = generateTokens(user);

    // Store refresh token
    await authModel.updateRefreshToken(user.id, refreshToken);

    return {
        user: {
            id: user.id,
            email: user.email,
            firstName: user.first_name,
            lastName: user.last_name,
            role: user.role,
            agencyId: user.agency_id,
        },
        accessToken,
        refreshToken,
    };
};

export const staffLogin = async (email, password) => {
    // Find staff user
    const user = await authModel.findStaffByEmail(email);
    if (!user) {
        throw new ApiError(
            ERROR_CODES.INVALID_CREDENTIALS,
            'Invalid email or password',
            401
        );
    }

    // Check password
    const isPasswordValid = await bcrypt.compare(password, user.password_hash);
    if (!isPasswordValid) {
        throw new ApiError(
            ERROR_CODES.INVALID_CREDENTIALS,
            'Invalid email or password',
            401
        );
    }

    // Generate tokens
    const { accessToken, refreshToken } = generateTokens(user);

    // Store refresh token
    await authModel.updateRefreshToken(user.id, refreshToken);

    return {
        user: {
            id: user.id,
            email: user.email,
            firstName: user.first_name,
            lastName: user.last_name,
            role: user.role,
            agencyId: user.agency_id,
        },
        accessToken,
        refreshToken,
    };
};

export const refreshTokens = async (refreshToken) => {
    try {
        const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
        const user = await authModel.findUserById(decoded.sub);

        if (!user) {
            throw new ApiError(ERROR_CODES.USER_NOT_FOUND, 'User not found', 404);
        }

        // Verify refresh token matches stored token
        const storedToken = await authModel.getRefreshToken(user.id);
        if (storedToken !== refreshToken) {
            throw new ApiError(ERROR_CODES.INVALID_TOKEN, 'Refresh token invalid', 401);
        }

        // Generate new tokens
        const tokens = generateTokens(user);
        await authModel.updateRefreshToken(user.id, tokens.refreshToken);

        return tokens;
    } catch (error) {
        if (error.code) throw error;
        throw new ApiError(ERROR_CODES.INVALID_TOKEN, 'Invalid refresh token', 401);
    }
};

export const logout = async (userId) => {
    await authModel.clearRefreshToken(userId);
    return { success: true };
};

export const getCurrentUser = async (userId) => {
    const user = await authModel.findUserById(userId);
    if (!user) {
        throw new ApiError(ERROR_CODES.USER_NOT_FOUND, 'User not found', 404);
    }

    return {
        id: user.id,
        email: user.email,
        firstName: user.first_name,
        lastName: user.last_name,
        phone: user.phone,
        role: user.role,
        agencyId: user.agency_id,
    };
};

// Helper functions
const generateTokens = (user) => {
    const accessToken = jwt.sign(
        {
            sub: user.id,
            email: user.email,
            role: user.role,
            agencyId: user.agency_id,
        },
        process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_ACCESS_EXPIRY || '15m' }
    );

    const refreshToken = jwt.sign(
        { sub: user.id },
        process.env.JWT_REFRESH_SECRET,
        { expiresIn: process.env.JWT_REFRESH_EXPIRY || '7d' }
    );

    return { accessToken, refreshToken };
};

export default {
    register,
    login,
    staffLogin,
    refreshTokens,
    logout,
    getCurrentUser,
};
