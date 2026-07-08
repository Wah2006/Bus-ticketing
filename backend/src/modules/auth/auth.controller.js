import * as authService from './auth.service.js';
import { success } from '../../shared/utils/response.js';
import { eventBus, EVENTS } from '../../shared/events/eventBus.js';

export const register = async (req, res, next) => {
    try {
        const result = await authService.register(req.body);
        eventBus.emit(EVENTS.USER_REGISTERED, { userId: result.user.id });
        return res.status(201).json(success(result));
    } catch (error) {
        next(error);
    }
};

export const login = async (req, res, next) => {
    try {
        const result = await authService.login(req.body.email, req.body.password);
        eventBus.emit(EVENTS.USER_LOGGED_IN, { userId: result.user.id });
        return res.status(200).json(success(result));
    } catch (error) {
        next(error);
    }
};

export const staffLogin = async (req, res, next) => {
    try {
        const result = await authService.staffLogin(req.body.email, req.body.password);
        eventBus.emit(EVENTS.USER_LOGGED_IN, { userId: result.user.id });
        return res.status(200).json(success(result));
    } catch (error) {
        next(error);
    }
};

export const refreshToken = async (req, res, next) => {
    try {
        const tokens = await authService.refreshTokens(req.body.refreshToken);
        return res.status(200).json(success(tokens));
    } catch (error) {
        next(error);
    }
};

export const logout = async (req, res, next) => {
    try {
        await authService.logout(req.user.id);
        eventBus.emit(EVENTS.USER_LOGGED_OUT, { userId: req.user.id });
        return res.status(200).json(success({ success: true }));
    } catch (error) {
        next(error);
    }
};

export const getCurrentUser = async (req, res, next) => {
    try {
        const user = await authService.getCurrentUser(req.user.id);
        return res.status(200).json(success(user));
    } catch (error) {
        next(error);
    }
};
