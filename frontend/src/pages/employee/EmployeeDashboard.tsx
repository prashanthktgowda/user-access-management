import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '/home/prashanthktgowda/user-access-management/frontend/src/contexts/AuthContext.tsx';

const EmployeeDashboard: React.FC = () => {
    const { user } = useAuth();

    return (
        <div>
            <h2>Employee Dashboard</h2>
            <p>Welcome, {user?.username || 'Employee'}!</p>
            <p>This is your central hub for managing software access.</p>
            <hr style={{ margin: '20px 0' }} />

            <h3>Quick Actions:</h3>
            <ul style={{ listStyleType: 'none', paddingLeft: 0 }}>
                <li style={{ marginBottom: '10px' }}>
                    <Link to="/employee/request-access" style={linkStyle}>
                        Request New Software Access
                    </Link>
                </li>
                <li style={{ marginBottom: '10px' }}>
                    <Link to="/employee/my-requests" style={linkStyle}>
                        View My Access Requests
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

export default EmployeeDashboard;