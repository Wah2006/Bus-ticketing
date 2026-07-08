import express from 'express';
import * as agenciesController from './agencies.controller.js';
import authGuard from '../../shared/middleware/authGuard.js';
import roleGuard from '../../shared/middleware/roleGuard.js';
import validate from '../../shared/middleware/validate.js';
import { CONSTANTS } from '../../config/constants.js';
import {
    createAgencySchema,
    updateAgencySchema,
    createBusSchema,
    createRouteSchema,
} from './agencies.validation.js';

const router = express.Router();

// Agency routes
router.post(
    '/',
    authGuard,
    roleGuard(CONSTANTS.ROLES.SUPERADMIN),
    validate(createAgencySchema),
    agenciesController.createAgency
);

router.get('/', agenciesController.listAgencies);

router.get('/:agencyId', agenciesController.getAgency);

router.put(
    '/:agencyId',
    authGuard,
    roleGuard(CONSTANTS.ROLES.SUPERADMIN, CONSTANTS.ROLES.AGENCY_STAFF),
    validate(updateAgencySchema),
    agenciesController.updateAgency
);

// Bus routes
router.post(
    '/:agencyId/buses',
    authGuard,
    roleGuard(CONSTANTS.ROLES.AGENCY_STAFF, CONSTANTS.ROLES.SUPERADMIN),
    validate(createBusSchema),
    agenciesController.createBus
);

router.get('/:agencyId/buses', agenciesController.listBusesByAgency);

// Route routes
router.post(
    '/:agencyId/routes',
    authGuard,
    roleGuard(CONSTANTS.ROLES.AGENCY_STAFF, CONSTANTS.ROLES.SUPERADMIN),
    validate(createRouteSchema),
    agenciesController.createRoute
);

router.get('/:agencyId/routes', agenciesController.listRoutesByAgency);

export default router;
