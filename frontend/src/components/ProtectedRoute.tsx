import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '/home/prashanthktgowda/user-access-management/frontend/src/contexts/AuthContext.tsx';
import { UserRole } from '/home/prashanthktgowda/user-access-management/frontend/src/types/auth.types.ts'; // Assuming UserRole is exported from types/index.ts or types/auth.types.ts

interface ProtectedRouteProps {
    children: React.ReactElement;
    allowedRoles?: UserRole[]; 
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, allowedRoles }) => {
    const { isAuthenticated, user, loading } = useAuth();
    const location = useLocation();

    if (loading) {
        return <div style={{ textAlign: 'center', padding: '50px', fontSize: '1.2em' }}>Loading Authentication...</div>;
    }

    if (!isAuthenticated) {
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    if (allowedRoles && allowedRoles.length > 0 && (!user || !allowedRoles.includes(user.role))) {
        console.warn(`Access denied: User role "${user?.role}" not in allowed roles: ${allowedRoles.join(', ')} for path ${location.pathname}`);
        let fallbackDashboard = "/"; 
        if (user) {
            switch (user.role) {
                case "Admin": fallbackDashboard = "/admin/dashboard"; break;
                case "Manager": fallbackDashboard = "/manager/dashboard"; break;
                case "Employee": fallbackDashboard = "/employee/dashboard"; break;
            }
        }
        return <Navigate to={fallbackDashboard} replace />;
    }

    return children;
};

export default ProtectedRoute;