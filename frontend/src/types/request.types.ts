import { Software } from './software.types'; 
import { User } from './auth.types';       

export type AccessType = 'Read' | 'Write' | 'Admin'; 
export type RequestStatus = 'Pending' | 'Approved' | 'Rejected';

export interface AccessRequestFormData {
    softwareId: number;
    accessType: AccessType;
    reason: string;
}

export interface AccessRequest {
    id: number;
    user: Pick<User, 'id' | 'username'>; 
    software: Software;
    accessType: AccessType;
    reason: string;
    status: RequestStatus;
    createdAt: string; 
    updatedAt: string; 
}