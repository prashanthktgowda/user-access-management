import { Routes, Route, Navigate, useNavigate, Link, useLocation } from 'react-router-dom';
import { AuthProvider, useAuth } from '/home/prashanthktgowda/user-access-management/frontend/src/contexts/AuthContext.tsx';

import LoginPage from '/home/prashanthktgowda/user-access-management/frontend/src/pages/LoginPage.tsx';
import SignupPage from '/home/prashanthktgowda/user-access-management/frontend/src/pages/SignupPage.tsx';

import EmployeeDashboard from '/home/prashanthktgowda/user-access-management/frontend/src/pages/employee/EmployeeDashboard.tsx';
import ManagerDashboard from '/home/prashanthktgowda/user-access-management/frontend/src/pages/manager/ManagerDashboard.tsx';
import AdminDashboard from '/home/prashanthktgowda/user-access-management/frontend/src/pages/admin/AdminDashboard.tsx';

import CreateSoftwarePage from '/home/prashanthktgowda/user-access-management/frontend/src/pages/admin/CreateSoftwarePage.tsx';
import RequestAccessPage from '/home/prashanthktgowda/user-access-management/frontend/src/pages/employee/RequestAccessPage.tsx';
import MyRequestsPage from '/home/prashanthktgowda/user-access-management/frontend/src/pages/employee/MyRequestsPage.tsx';
import PendingRequestsPage from '/home/prashanthktgowda/user-access-management/frontend/src/pages/manager/PendingRequestsPage.tsx';
import ProtectedRoute from '/home/prashanthktgowda/user-access-management/frontend/src/components/ProtectedRoute.tsx';

const Navbar = () => {
    const { isAuthenticated, user, logout } = useAuth();
    const navigate = useNavigate();
    const location = useLocation(); 

    const handleLogout = () => { logout(); navigate('/login'); };
    const getDashboardLink = () => {
        if (!user) return "/";
        switch (user.role) {
            case "Admin": return "/admin/dashboard";
            case "Manager": return "/manager/dashboard";
            case "Employee": return "/employee/dashboard";
            default: return "/";
        }
    };

    return (
        <nav style={{ padding: '10px 20px', background: '#333', color: 'white', display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <Link to={isAuthenticated ? getDashboardLink() : "/login"} style={{ fontSize: '1.5em', fontWeight: 'bold', color: 'white', textDecoration: 'none' }}>UAMS</Link>
            <div>
                {isAuthenticated && user ? (
                    <>
                        {user.role === 'Admin' && <Link to="/admin/create-software" className="nav-link">Create Software</Link>}
                        {user.role === 'Employee' && <Link to="/employee/request-access" className="nav-link">Request Access</Link>}
                        {user.role === 'Employee' && <Link to="/employee/my-requests" className="nav-link">My Requests</Link>}
                        {(user.role === 'Manager' || user.role === 'Admin') && <Link to="/manager/pending-requests" className="nav-link">Pending Requests</Link>}
                        <span style={{ margin: '0 15px' }}>Welcome, {user.username} ({user.role})</span>
                        <button onClick={handleLogout} className="logout-button">Logout</button>
                    </>
                ) : (
                    <>
                        {location.pathname !== '/login' && <Link to="/login" className="nav-link">Login</Link>}
                        {location.pathname !== '/signup' && location.pathname !== '/login' && <span style={{color: 'white', margin: '0 5px'}}>|</span>}
                        {location.pathname !== '/signup' && <Link to="/signup" className="nav-link">Sign Up</Link>}
                    </>
                )}
            </div>
            {}
            <style>{`
                .nav-link { color: white; margin-right: 10px; text-decoration: none; }
                .nav-link:hover { text-decoration: underline; }
                .logout-button { background: #dc3545; color: white; border: none; padding: 8px 12px; border-radius: 4px; cursor: pointer; }
            `}</style>
        </nav>
    );
};

const NotFoundPage = () => {
    const navigate = useNavigate();
    return (
        <div style={{ textAlign: 'center', marginTop: '50px' }}>
            <h2>404 - Page Not Found</h2>
            <p>Sorry, the page you are looking for does not exist.</p>
            <button onClick={() => navigate(-1)} style={{ padding: '10px 20px', cursor: 'pointer', marginTop: '15px' }}>Go Back</button>
        </div>
    );
};

const AppRoutes = () => {
    const { isAuthenticated, user, loading } = useAuth();
    const navigate = useNavigate();

    if (loading) return <div style={{ textAlign: 'center', marginTop: '50px', fontSize: '1.2em' }}>Loading Application Data...</div>;

    const getDefaultDashboardPath = () => {
        if (!user) return "/login";
        switch (user.role) {
            case "Admin": return "/admin/dashboard";
            case "Manager": return "/manager/dashboard";
            case "Employee": return "/employee/dashboard";
            default: return "/login";
        }
    };

    return (
        <>
            <Navbar />
            <div className="container">
                <Routes>
                    <Route path="/login" element={isAuthenticated ? <Navigate to={getDefaultDashboardPath()} replace /> : <LoginPage />} />
                    <Route path="/signup" element={isAuthenticated ? <Navigate to={getDefaultDashboardPath()} replace /> : <SignupPage />} />
                    <Route path="/" element={isAuthenticated ? <Navigate to={getDefaultDashboardPath()} replace /> : <Navigate to="/login" replace />} />

                    <Route path="/employee/dashboard" element={<ProtectedRoute allowedRoles={['Employee', 'Admin']}><EmployeeDashboard /></ProtectedRoute>} />
                    <Route path="/employee/request-access" element={<ProtectedRoute allowedRoles={['Employee', 'Admin']}><RequestAccessPage /></ProtectedRoute>} />
                    <Route path="/employee/my-requests" element={<ProtectedRoute allowedRoles={['Employee', 'Admin']}><MyRequestsPage /></ProtectedRoute>} />

                    <Route path="/manager/dashboard" element={<ProtectedRoute allowedRoles={['Manager', 'Admin']}><ManagerDashboard /></ProtectedRoute>} />
                    <Route path="/manager/pending-requests" element={<ProtectedRoute allowedRoles={['Manager', 'Admin']}><PendingRequestsPage /></ProtectedRoute>} />

                    <Route path="/admin/dashboard" element={<ProtectedRoute allowedRoles={['Admin']}><AdminDashboard /></ProtectedRoute>} />
                    <Route path="/admin/create-software" element={<ProtectedRoute allowedRoles={['Admin']}><CreateSoftwarePage /></ProtectedRoute>} />

                    <Route path="*" element={<NotFoundPage />} />
                </Routes>
            </div>
        </>
    );
};

function App() {
    return (
        <AuthProvider>
            <AppRoutes />
        </AuthProvider>
    );
}

export default App;