export type UserRole = 'Employee' | 'Manager' | 'Admin';

export interface User {
    id: number;
    username: string;
    role: UserRole;
}

export interface AuthState {
    isAuthenticated: boolean;
    user: User | null;
    token: string | null;
    loading: boolean; 
    error: string | null;  
}

export interface AuthContextType extends AuthState {
    login: (username: string, password: string) => Promise<void>;
    signup: (username: string, password: string, role?: UserRole) => Promise<void>; 
    logout: () => void;
    clearError: () => void; 
}