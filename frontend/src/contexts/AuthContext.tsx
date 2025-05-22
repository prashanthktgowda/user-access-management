import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import api from '/home/prashanthktgowda/user-access-management/frontend/src/services/api.ts'; 
import { AuthState, AuthContextType, User, UserRole } from '../types/auth.types.ts';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [authState, setAuthState] = useState<AuthState>({
        isAuthenticated: false,
        user: null,
        token: null,
        loading: true, 
        error: null,
    });

    useEffect(() => {
        const loadUserFromStorage = () => {
            try {
                const token = localStorage.getItem('token');
                const storedUser = localStorage.getItem('user');

                if (token && storedUser) {
                    const user: User = JSON.parse(storedUser);
                    if (user && user.id && user.username && user.role) {
                         api.defaults.headers.common['Authorization'] = `Bearer ${token}`; 
                        setAuthState({
                            isAuthenticated: true,
                            user,
                            token,
                            loading: false,
                            error: null,
                        });
                    } else {
                        localStorage.removeItem('token');
                        localStorage.removeItem('user');
                        setAuthState(prev => ({ ...prev, loading: false }));
                    }
                } else {
                    setAuthState(prev => ({ ...prev, loading: false }));
                }
            } catch (e) {
                console.error("Error loading user from storage:", e);
                localStorage.removeItem('token');
                localStorage.removeItem('user');
                setAuthState(prev => ({ ...prev, loading: false, error: "Failed to load session." }));
            }
        };
        loadUserFromStorage();
    }, []);


    const login = useCallback(async (username: string, password: string) => {
        setAuthState(prev => ({ ...prev, loading: true, error: null }));
        try {
            const response = await api.post<{ token: string; user: User; message: string }>('/auth/login', { username, password });
            const { token, user } = response.data;

            localStorage.setItem('token', token);
            localStorage.setItem('user', JSON.stringify(user));
            api.defaults.headers.common['Authorization'] = `Bearer ${token}`; 

            setAuthState({
                isAuthenticated: true,
                user,
                token,
                loading: false,
                error: null,
            });
        } catch (err: any) {
            const errorMessage = err.response?.data?.message || 'Login failed. Please check your credentials.';
            setAuthState(prev => ({
                ...prev,
                isAuthenticated: false,
                user: null,
                token: null,
                loading: false,
                error: errorMessage,
            }));
            throw new Error(errorMessage); 
        }
    }, []);

    const signup = useCallback(async (username: string, password: string, role?: UserRole) => {
        setAuthState(prev => ({ ...prev, loading: true, error: null }));
        try {
            const payload: {username: string; password: string; role?: UserRole} = { username, password };
            if (role) payload.role = role;

            await api.post('/auth/signup', payload);
            setAuthState(prev => ({ ...prev, loading: false, error: null }));
        } catch (err: any) {
            const errorMessage = err.response?.data?.message || 'Signup failed. Please try again.';
            setAuthState(prev => ({ ...prev, loading: false, error: errorMessage }));
            throw new Error(errorMessage);
        }
    }, []);

    const logout = useCallback(() => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        delete api.defaults.headers.common['Authorization']; 
        setAuthState({
            isAuthenticated: false,
            user: null,
            token: null,
            loading: false,
            error: null,
        });
    }, []);

    const clearError = useCallback(() => {
        setAuthState(prev => ({ ...prev, error: null }));
    }, []);

    return (
        <AuthContext.Provider value={{ ...authState, login, signup, logout, clearError }}>
            {!authState.loading ? children : <div>Loading Application Authentication...</div> /* */}
        </AuthContext.Provider>
    );
};

export const useAuth = (): AuthContextType => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};