import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '/home/prashanthktgowda/user-access-management/frontend/src/contexts/AuthContext.tsx';

const ManagerDashboard: React.FC = () => {
    const { user } = useAuth();

    return (
        <div>
            <h2>Manager Dashboard</h2>
            <p>Welcome, {user?.username || 'Manager'}!</p>
            <p>Manage your team's software access requests from here.</p>
            <hr style={{ margin: '20px 0' }} />

            <h3>Key Tasks:</h3>
            <ul style={{ listStyleType: 'none', paddingLeft: 0 }}>
                <li style={{ marginBottom: '10px' }}>
                    <Link to="/manager/pending-requests" style={linkStyle}>
                        Review Pending Access Requests
                    </Link>
                </li>
            </ul>
        </div>
    );
};

const linkStyle: React.CSSProperties = {
    display: 'inline-block',
    padding: '10px 15px',
    backgroundColor: '#007bff',
    color: 'white',
    textDecoration: 'none',
    borderRadius: '4px',
    textAlign: 'center',
};

export default ManagerDashboard;
