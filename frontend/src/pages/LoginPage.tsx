import React, { useState, FormEvent, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useAuth } from '/home/prashanthktgowda/user-access-management/frontend/src/contexts/AuthContext.tsx'; // Relative path is standard

const LoginPage: React.FC = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const { login, isAuthenticated, error, clearError, user, loading: authLoading } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    const from = location.state?.from?.pathname || (
        user ? (
            user.role === 'Admin' ? '/admin/dashboard' :
            user.role === 'Manager' ? '/manager/dashboard' :
            '/employee/dashboard'
        ) : "/" 
    );

    useEffect(() => {
        if (isAuthenticated) {
            navigate(from, { replace: true });
        }
        return () => {
            clearError(); 
        };
    }, [isAuthenticated, navigate, from, clearError]);

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        clearError();
        try {
            await login(username, password);
        } catch (loginError: any) {
            console.error("Login error:", loginError);}
    };

    if (authLoading && !error) {
        return <div style={{ textAlign: 'center', padding: '50px'}}>Loading...</div>;
    }

    return (
        <div style={{ maxWidth: '400px', margin: '50px auto', padding: '20px', border: '1px solid #ccc', borderRadius: '8px', boxShadow: '0 0 10px rgba(0,0,0,0.1)' }}>
            <h2>Login</h2>
            {error && <p style={{ color: 'red', marginBottom: '15px', border: '1px solid red', padding: '10px', borderRadius: '4px' }}>{error}</p>}
            <form onSubmit={handleSubmit}>
                <div>
                    <label htmlFor="username">Username:</label>
                    <input
                        type="text"
                        id="username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                        autoFocus
                        disabled={authLoading}
                    />
                </div>
                <div>
                    <label htmlFor="password">Password:</label>
                    <input
                        type="password"
                        id="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        disabled={authLoading}
                    />
                </div>
                <button type="submit" disabled={authLoading} style={{ width: '100%', marginTop: '10px' }}>
                    {authLoading ? 'Logging in...' : 'Login'}
                </button>
            </form>
            <p style={{ textAlign: 'center', marginTop: '20px' }}>
                Don't have an account? <Link to="/signup">Sign Up</Link>
            </p>
        </div>
    );
};

export default LoginPage;