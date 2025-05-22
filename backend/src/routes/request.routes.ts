// backend/src/routes/request.routes.ts
import { Router } from 'express';
import {
    submitRequest,
    getMyRequests,
    getPendingRequests,
    approveOrRejectRequest,
    getAllRequests // Optional: For Admin to see all requests (ensure controller function exists)
} from '../controllers/request.controller'; // Ensure path is correct
import { authenticateJWT, authorizeRole } from '../middleware/auth.middleware'; // Ensure path is correct

const router = Router();

// === Employee Routes ===

// POST /api/requests – Employee submits a new access request
// Also accessible by Admin for testing or on behalf of others.
router.post(
    '/',
    authenticateJWT,
    authorizeRole(['Employee', 'Admin']),
    submitRequest // This function in request.controller.ts should be async and return Promise<void>
);

// GET /api/requests/my – Employee views their own submitted requests
// Also accessible by Admin.
router.get(
    '/my',
    authenticateJWT,
    authorizeRole(['Employee', 'Admin']),
    getMyRequests // This function in request.controller.ts should be async and return Promise<void>
);

// === Manager Routes ===

// GET /api/requests/pending – Manager views all requests with 'Pending' status
// Also accessible by Admin.
router.get(
    '/pending',
    authenticateJWT,
    authorizeRole(['Manager', 'Admin']),
    getPendingRequests // This function in request.controller.ts should be async and return Promise<void>
);

// PATCH /api/requests/:id – Manager approves or rejects a specific request
// Also accessible by Admin.
router.patch(
    '/:id', // The :id parameter will be the ID of the request to update
    authenticateJWT,
    authorizeRole(['Manager', 'Admin']),
    approveOrRejectRequest // This function in request.controller.ts should be async and return Promise<void>
);


// === Admin Routes (Optional - if Admin needs to see ALL requests regardless of status) ===
// This was not explicitly in the original spec but can be useful for full visibility.
// If you don't need this, ensure 'getAllRequests' is removed from imports if not implemented in controller.
router.get(
    '/all', // Example route for Admin to see all requests
    authenticateJWT,
    authorizeRole(['Admin']),
    getAllRequests // This function in request.controller.ts should be async and return Promise<void>
);


export default router;