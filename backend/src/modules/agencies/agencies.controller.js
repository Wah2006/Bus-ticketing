import * as agenciesService from './agencies.service.js';
import { success, paginated } from '../../shared/utils/response.js';

export const createAgency = async (req, res, next) => {
    try {
        const agency = await agenciesService.createAgency(req.body);
        return res.status(201).json(success(agency));
    } catch (error) {
        next(error);
    }
};

export const getAgency = async (req, res, next) => {
    try {
        const agency = await agenciesService.getAgency(req.params.agencyId);
        return res.status(200).json(success(agency));
    } catch (error) {
        next(error);
    }
};

export const listAgencies = async (req, res, next) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const pageSize = parseInt(req.query.pageSize) || 10;

        const { agencies, pagination } = await agenciesService.listAgencies(page, pageSize);

        return res.status(200).json(
            paginated(agencies, pagination.page, pagination.pageSize, pagination.total)
        );
    } catch (error) {
        next(error);
    }
};

export const updateAgency = async (req, res, next) => {
    try {
        // Staff can only update their own agency
        if (req.user.role === 'agency_staff' && req.user.agencyId !== parseInt(req.params.agencyId)) {
            return res.status(403).json({ success: false, error: { code: 'FORBIDDEN', message: 'Forbidden' } });
        }

        const agency = await agenciesService.updateAgency(req.params.agencyId, req.body);
        return res.status(200).json(success(agency));
    } catch (error) {
        next(error);
    }
};

// Bus controllers
export const createBus = async (req, res, next) => {
    try {
        // Staff can only create buses for their agency
        if (req.user.role === 'agency_staff' && req.user.agencyId !== parseInt(req.params.agencyId)) {
            return res.status(403).json({ success: false, error: { code: 'FORBIDDEN', message: 'Forbidden' } });
        }

        const bus = await agenciesService.createBus(req.params.agencyId, req.body);
        return res.status(201).json(success(bus));
    } catch (error) {
        next(error);
    }
};

export const listBusesByAgency = async (req, res, next) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const pageSize = parseInt(req.query.pageSize) || 20;

        const { buses, pagination } = await agenciesService.listBusesByAgency(
            req.params.agencyId,
            page,
            pageSize
        );

        return res.status(200).json(
            paginated(buses, pagination.page, pagination.pageSize, pagination.total)
        );
    } catch (error) {
        next(error);
    }
};

// Route controllers
export const createRoute = async (req, res, next) => {
    try {
        // Staff can only create routes for their agency
        if (req.user.role === 'agency_staff' && req.user.agencyId !== parseInt(req.params.agencyId)) {
            return res.status(403).json({ success: false, error: { code: 'FORBIDDEN', message: 'Forbidden' } });
        }

        const route = await agenciesService.createRoute(req.params.agencyId, req.body);
        return res.status(201).json(success(route));
    } catch (error) {
        next(error);
    }
};

export const listRoutesByAgency = async (req, res, next) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const pageSize = parseInt(req.query.pageSize) || 20;

        const { routes, pagination } = await agenciesService.listRoutesByAgency(
            req.params.agencyId,
            page,
            pageSize
        );

        return res.status(200).json(
            paginated(routes, pagination.page, pagination.pageSize, pagination.total)
        );
    } catch (error) {
        next(error);
    }
};
