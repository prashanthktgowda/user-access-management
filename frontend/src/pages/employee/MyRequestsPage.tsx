// frontend/src/pages/employee/MyRequestsPage.tsx
import React, { useState, useEffect } from 'react';
import api from '/home/prashanthktgowda/user-access-management/frontend/src/services/api.ts';
import { AccessRequest } from '../../types';
import { Link } from 'react-router-dom';

const MyRequestsPage: React.FC = () => {
    const [requests, setRequests] = useState<AccessRequest[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchMyRequests = async () => {
            setIsLoading(true);
            setError(null);
            try {
                const response = await api.get<AccessRequest[]>('/requests/my');
                setRequests(response.data);
            } catch (err) {
                console.error("Error fetching my requests:", err);
                setError('Failed to load your requests. Please try again later.');
            } finally {
                setIsLoading(false);
            }
        };

        fetchMyRequests();
    }, []); // Empty dependency array means this runs once on component mount

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric', month: 'long', day: 'numeric',
            hour: '2-digit', minute: '2-digit'
        });
    };

    if (isLoading) {
        return <p>Loading your requests...</p>;
    }

    if (error) {
        return <p style={{ color: 'red' }}>{error}</p>;
    }

    return (
        <div>
            <h2>My Software Access Requests</h2>
            {requests.length === 0 ? (
                <p>You have not made any software access requests yet. <Link to="/employee/request-access">Request Access</Link></p>
            ) : (
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead>
                        <tr>
                            <th style={tableHeaderStyle}>Software</th>
                            <th style={tableHeaderStyle}>Access Type</th>
                            <th style={tableHeaderStyle}>Reason</th>
                            <th style={tableHeaderStyle}>Status</th>
                            <th style={tableHeaderStyle}>Submitted On</th>
                            <th style={tableHeaderStyle}>Last Updated</th>
                        </tr>
                    </thead>
                    <tbody>
                        {requests.map((request) => (
                            <tr key={request.id}>
                                <td style={tableCellStyle}>{request.software?.name || 'N/A'}</td>
                                <td style={tableCellStyle}>{request.accessType}</td>
                                <td style={tableCellStyle}>{request.reason}</td>
                                <td style={tableCellStyle}>
                                    <span style={getStatusChipStyle(request.status)}>
                                        {request.status}
                                    </span>
                                </td>
                                <td style={tableCellStyle}>{formatDate(request.createdAt)}</td>
                                <td style={tableCellStyle}>{formatDate(request.updatedAt)}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    );
};

const tableHeaderStyle: React.CSSProperties = {
    borderBottom: '2px solid #ddd',
    padding: '10px',
    textAlign: 'left',
    background: '#f7f7f7',
};

const tableCellStyle: React.CSSProperties = {
    borderBottom: '1px solid #eee',
    padding: '10px',
    textAlign: 'left',
};

const getStatusChipStyle = (status: AccessRequest['status']): React.CSSProperties => {
    let backgroundColor = '#eee';
    let color = '#333';
    switch (status) {
        case 'Pending':
            backgroundColor = '#fffbe6'; color = '#cfa000'; break;
        case 'Approved':
            backgroundColor = '#e6ffed'; color = 'green'; break;
        case 'Rejected':
            backgroundColor = '#ffe6e6'; color = 'red'; break;
    }
    return {
        padding: '4px 8px',
        borderRadius: '12px',
        backgroundColor,
        color,
        fontWeight: 'bold',
        fontSize: '0.9em',
        display: 'inline-block',
    };
};

export default MyRequestsPage;