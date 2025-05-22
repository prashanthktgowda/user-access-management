import React, { useState, FormEvent, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '/home/prashanthktgowda/user-access-management/frontend/src/contexts/AuthContext.tsx'; // Relative path is standard

const SignupPage: React.FC = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [localError, setLocalError] = useState<string | null>(null);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);
    const { signup, error: authError, clearError, isAuthenticated, loading: authLoading } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        if (isAuthenticated) {
            navigate('/', { replace: true });
        }
        return () => {
            clearError();
        };
    }, [isAuthenticated, navigate, clearError]);

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        clearError(); setLocalError(null); setSuccessMessage(null);
        if (password !== confirmPassword) { setLocalError("Passwords do not match!"); return; }
        if (password.length < 6) { setLocalError("Password must be at least 6 characters long."); return; }
        try {
            await signup(username, password);
            setSuccessMessage('Signup successful! Please proceed to login.');
            setUsername(''); setPassword(''); setConfirmPassword('');
        } catch (signupError: any) {  }
    };

    if (authLoading && !authError && !localError && !successMessage) {
        return <div style={{ textAlign: 'center', padding: '50px'}}>Processing...</div>;
    }

    return (
        <div style={{ maxWidth: '400px', margin: '50px auto', padding: '20px', border: '1px solid #ccc', borderRadius: '8px', boxShadow: '0 0 10px rgba(0,0,0,0.1)' }}>
            <h2>Sign Up</h2>
            {localError && <p style={{ color: 'red', marginBottom: '15px', border: '1px solid red', padding: '10px', borderRadius: '4px' }}>{localError}</p>}
            {authError && <p style={{ color: 'red', marginBottom: '15px', border: '1px solid red', padding: '10px', borderRadius: '4px' }}>{authError}</p>}
            {successMessage && <p style={{ color: 'green', marginBottom: '15px', border: '1px solid green', padding: '10px', borderRadius: '4px' }}>{successMessage}</p>}
            {!successMessage && (
                <form onSubmit={handleSubmit}>
                    <div><label htmlFor="username">Username:</label><input type="text" id="username" value={username} onChange={(e) => setUsername(e.target.value)} required autoFocus disabled={authLoading} /></div>
                    <div><label htmlFor="password">Password:</label><input type="password" id="password" value={password} onChange={(e) => setPassword(e.target.value)} required disabled={authLoading} /></div>
                    <div><label htmlFor="confirmPassword">Confirm Password:</label><input type="password" id="confirmPassword" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required disabled={authLoading} /></div>
                    <button type="submit" disabled={authLoading} style={{ width: '100%', marginTop: '10px' }}>{authLoading ? 'Signing up...' : 'Sign Up'}</button>
                </form>
            )}
            <p style={{ textAlign: 'center', marginTop: '20px' }}>Already have an account? <Link to="/login">Login</Link></p>
        </div>
    );
};
export default SignupPage;
