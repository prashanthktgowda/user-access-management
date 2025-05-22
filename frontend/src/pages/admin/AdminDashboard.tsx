// frontend/src/pages/admin/AdminDashboard.tsx
import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '/home/prashanthktgowda/user-access-management/frontend/src/contexts/AuthContext.tsx';

const AdminDashboard: React.FC = () => {
    const { user } = useAuth();

    return (
        <div>
            <h2>Administrator Dashboard</h2>
            <p>Welcome, {user?.username || 'Admin'}!</p>
            <p>System administration and overview.</p>
            <hr style={{ margin: '20px 0' }} />

            <h3>Administrative Functions:</h3>
            <ul style={{ listStyleType: 'none', paddingLeft: 0 }}>
                <li style={{ marginBottom: '10px' }}>
                    <Link to="/admin/create-software" style={linkStyle}>
                        Create New Software
                    </Link>
                </li>
                {/* As an Admin, you can also view pages typically for other roles */}
                <li style={{ marginBottom: '10px' }}>
                    <Link to="/manager/pending-requests" style={{...linkStyle, backgroundColor: '#6c757d'}}>
                        View Pending Requests (as Manager/Admin)
                    </Link>
                </li>
                <li style={{ marginBottom: '10px' }}>
                    <Link to="/employee/my-requests" style={{...linkStyle, backgroundColor: '#6c757d'}}>
                        View "My Requests" (as Admin/Employee)
                    </Link>
                </li>
                <li style={{ marginBottom: '10px' }}>
                    <Link to="/admin/manage-users" style={linkStyle}>
                        Manage Users
                    </Link>
                </li>
                <li style={{ marginBottom: '10px' }}>
                    <Link to="/admin/view-logs" style={linkStyle}>
                        View System Logs
                    </Link>
                </li>
                <li style={{ marginBottom: '10px' }}>
                    <Link to="/admin/manage-roles" style={linkStyle}>
                        Manage User Roles
                    </Link>
                </li>
                <li style={{ marginBottom: '10px' }}>   
                    <Link to="/admin/system-settings" style={linkStyle}>
                        System Settings
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

export default AdminDashboard;