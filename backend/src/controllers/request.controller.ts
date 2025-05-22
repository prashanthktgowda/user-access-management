import { Response as ExpressResponse } from 'express';
import { AppDataSource } from '../config/data-source';
import { Request as AccessRequestEntity, AccessType, RequestStatus } from '../entities/Request';
import { Software } from '../entities/Software';
import { User } from '../entities/User';
import { AuthenticatedRequest } from '../middleware/auth.middleware';

const requestRepository = AppDataSource.getRepository(AccessRequestEntity);
const softwareRepository = AppDataSource.getRepository(Software);
const userRepository = AppDataSource.getRepository(User);

// POST /api/requests - Employee or Admin
export const submitRequest = async (req: AuthenticatedRequest, res: ExpressResponse): Promise<void> => {
    const { softwareId, accessType, reason } = req.body;
    const userId = req.user?.id;

    if (!userId) {
        res.status(401).json({ message: 'User not authenticated' });
        return;
    }
    if (!softwareId || !accessType || !reason) {
        res.status(400).json({ message: 'Software ID, access type, and reason are required' });
        return;
    }
    if (!['Read', 'Write', 'Admin'].includes(accessType)) {
        res.status(400).json({ message: 'Invalid access type' });
        return;
    }

    try {
        const software = await softwareRepository.findOneBy({ id: parseInt(softwareId) });
        if (!software) {
            res.status(404).json({ message: 'Software not found' });
            return;
        }
        if (!software.accessLevels.includes(accessType)) {
            res.status(400).json({
                message: `Access type '${accessType}' is not available for this software. Available: ${software.accessLevels.join(', ')}`
            });
            return;
        }

        const user = await userRepository.findOneBy({ id: userId });
        if (!user) {
            // This case should ideally not be reachable if JWT authentication is working correctly
            res.status(404).json({ message: 'User not found (authentication issue)' });
            return;
        }

        const newRequest = requestRepository.create({
            user,
            software,
            accessType: accessType as AccessType,
            reason,
            status: 'Pending' as RequestStatus,
        });

        await requestRepository.save(newRequest);

        // Fetch the saved request with relations for a clean response, excluding sensitive user data
        const responseRequest = await requestRepository.findOne({
            where: { id: newRequest.id },
            relations: ["user", "software"]
        });

        if (responseRequest && responseRequest.user) {
            // @ts-ignore - Dynamically deleting a property
            delete responseRequest.user.password;
        }

        res.status(201).json({ message: 'Access request submitted successfully', request: responseRequest });
        return;
    } catch (error) {
        console.error("Submit request error:", error);
        res.status(500).json({ message: 'Error submitting request', error: (error as Error).message });
        return;
    }
};

// GET /api/requests/my - Employee or Admin
export const getMyRequests = async (req: AuthenticatedRequest, res: ExpressResponse): Promise<void> => {
    const userId = req.user?.id;
    if (!userId) {
        // Should be caught by authenticateJWT, but good for robustness
        res.status(401).json({ message: "Unauthorized" });
        return;
    }

    try {
        const requests = await requestRepository.find({
            where: { user: { id: userId } },
            relations: ["software"],
            order: { createdAt: "DESC" }
        });
        res.status(200).json(requests);
        return;
    } catch (error) {
        console.error("Get my requests error:", error);
        res.status(500).json({ message: "Error fetching your requests", error: (error as Error).message });
        return;
    }
};

// GET /api/requests/pending - Manager or Admin
export const getPendingRequests = async (req: AuthenticatedRequest, res: ExpressResponse): Promise<void> => {
    try {
        const pendingRequests = await requestRepository.find({
            where: { status: 'Pending' as RequestStatus },
            relations: ['user', 'software'],
            order: { createdAt: 'ASC'}
        });

        const sanitizedRequests = pendingRequests.map(request => {
            if (request.user) {
                // @ts-ignore
                delete request.user.password;
            }
            return request;
        });
        res.status(200).json(sanitizedRequests);
        return;
    } catch (error) {
        console.error("Get pending requests error:", error);
        res.status(500).json({ message: 'Error fetching pending requests', error: (error as Error).message });
        return;
    }
};

// PATCH /api/requests/:id - Manager or Admin
export const approveOrRejectRequest = async (req: AuthenticatedRequest, res: ExpressResponse): Promise<void> => {
    const { id } = req.params;
    const { status } = req.body;

    if (!['Approved', 'Rejected'].includes(status)) {
        res.status(400).json({ message: "Invalid status. Must be 'Approved' or 'Rejected'." });
        return;
    }

    try {
        const requestId = parseInt(id);
        if (isNaN(requestId)) {
            res.status(400).json({ message: 'Invalid request ID format.' });
            return;
        }

        const requestToUpdate = await requestRepository.findOne({
            where: { id: requestId },
            relations: ["user", "software"]
        });

        if (!requestToUpdate) {
            res.status(404).json({ message: 'Request not found' });
            return;
        }

        if (requestToUpdate.status !== 'Pending') {
            res.status(400).json({ message: `Request is already ${requestToUpdate.status.toLowerCase()}` });
            return;
        }

        requestToUpdate.status = status as RequestStatus;
        await requestRepository.save(requestToUpdate);

        if (requestToUpdate.user) {
            // @ts-ignore
            delete requestToUpdate.user.password;
        }

        res.status(200).json({ message: `Request ${status.toLowerCase()}`, request: requestToUpdate });
        return;
    } catch (error) {
        console.error("Approve/reject request error:", error);
        res.status(500).json({ message: 'Error updating request status', error: (error as Error).message });
        return;
    }
};

// GET /api/requests/all - Admin only (Optional)
export const getAllRequests = async (req: AuthenticatedRequest, res: ExpressResponse): Promise<void> => {
    try {
        const allRequests = await requestRepository.find({
            relations: ['user', 'software'],
            order: { createdAt: 'DESC' }
        });

        const sanitizedRequests = allRequests.map(request => {
            if (request.user) {
                // @ts-ignore
                delete request.user.password;
            }
            return request;
        });
        res.status(200).json(sanitizedRequests);
        return;
    } catch (error) {
        console.error("Get all requests error:", error);
        res.status(500).json({ message: 'Error fetching all requests', error: (error as Error).message });
        return;
    }
};