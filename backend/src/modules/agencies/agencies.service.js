import * as agenciesModel from './agencies.model.js';
import { ERROR_CODES } from '../../config/constants.js';

class ApiError extends Error {
    constructor(code, message, statusCode = 400) {
        super(message);
        this.code = code;
        this.statusCode = statusCode;
    }
}

// Agency service
export const createAgency = async (agencyData) => {
    return agenciesModel.createAgency(agencyData);
};

export const getAgency = async (agencyId) => {
    const agency = await agenciesModel.getAgencyById(agencyId);
    if (!agency) {
        throw new ApiError(
            ERROR_CODES.AGENCY_NOT_FOUND,
            'Agency not found',
            404
        );
    }
    return agency;
};

export const listAgencies = async (page = 1, pageSize = 10) => {
    const offset = (page - 1) * pageSize;
    const agencies = await agenciesModel.getAllAgencies(pageSize, offset);
    const total = await agenciesModel.countAgencies();

    return {
        agencies,
        pagination: { page, pageSize, total },
    };
};

export const updateAgency = async (agencyId, agencyData) => {
    await getAgency(agencyId); // Verify exists
    return agenciesModel.updateAgency(agencyId, agencyData);
};

// Bus service
export const createBus = async (agencyId, busData) => {
    await getAgency(agencyId); // Verify agency exists
    return agenciesModel.createBus(agencyId, busData);
};

export const getBus = async (busId) => {
    const bus = await agenciesModel.getBusById(busId);
    if (!bus) {
        throw new ApiError(
            ERROR_CODES.NOT_FOUND,
            'Bus not found',
            404
        );
    }
    return bus;
};

export const listBusesByAgency = async (agencyId, page = 1, pageSize = 20) => {
    await getAgency(agencyId); // Verify agency exists

    const offset = (page - 1) * pageSize;
    const buses = await agenciesModel.getBusesByAgency(agencyId, pageSize, offset);
    const total = await agenciesModel.countBusesByAgency(agencyId);

    return {
        buses,
        pagination: { page, pageSize, total },
    };
};

// Route service
export const createRoute = async (agencyId, routeData) => {
    await getAgency(agencyId); // Verify agency exists
    return agenciesModel.createRoute(agencyId, routeData);
};

export const getRoute = async (routeId) => {
    const route = await agenciesModel.getRouteById(routeId);
    if (!route) {
        throw new ApiError(
            ERROR_CODES.NOT_FOUND,
            'Route not found',
            404
        );
    }
    return route;
};

export const listRoutesByAgency = async (agencyId, page = 1, pageSize = 20) => {
    await getAgency(agencyId); // Verify agency exists

    const offset = (page - 1) * pageSize;
    const routes = await agenciesModel.getRoutesByAgency(agencyId, pageSize, offset);
    const total = await agenciesModel.countRoutesByAgency(agencyId);

    return {
        routes,
        pagination: { page, pageSize, total },
    };
};

export default {
    createAgency,
    getAgency,
    listAgencies,
    updateAgency,
    createBus,
    getBus,
    listBusesByAgency,
    createRoute,
    getRoute,
    listRoutesByAgency,
};
