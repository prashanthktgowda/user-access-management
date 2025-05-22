
import React, { useState, useEffect, useCallback } from 'react';
import api from '/home/prashanthktgowda/user-access-management/frontend/src/services/api.ts';
import { AccessRequest } from '../../types';

const PendingRequestsPage: React.FC = () => {
    const [requests, setRequests] = useState<AccessRequest[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [actionMessage, setActionMessage] = useState<{ id: number; text: string; type: 'success' | 'error' } | null>(null);


    const fetchPendingRequests = useCallback(async () => {
        setIsLoading(true);
        setError(null);
        try {
            const response = await api.get<AccessRequest[]>('/requests/pending');
            setRequests(response.data);
        } catch (err) {
            console.error("Error fetching pending requests:", err);
            setError('Failed to load pending requests. Please try again later.');
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchPendingRequests();
    }, [fetchPendingRequests]);

    const handleAction = async (requestId: number, newStatus: 'Approved' | 'Rejected') => {
        setActionMessage(null);
        const requestToUpdate = requests.find(req => req.id === requestId);
        if (!requestToUpdate) return;


        const originalRequests = [...requests];
        setRequests(prevRequests =>
            prevRequests.map(req =>
                req.id === requestId ? { ...req, status: 'Processing...' as any } : req 
            )
        );


        try {
            await api.patch(`/requests/${requestId}`, { status: newStatus });
            setActionMessage({ id: requestId, text: `Request successfully ${newStatus.toLowerCase()}.`, type: 'success' });
            fetchPendingRequests();
        } catch (err: any) {
            setActionMessage({
                id: requestId,
                text: err.response?.data?.message || `Failed to ${newStatus.toLowerCase()} request.`,
                type: 'error'
            });
            console.error(`Error ${newStatus.toLowerCase()}ing request:`, err.response?.data || err.message);
            setRequests(originalRequests);
        }
    };


    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric', month: 'long', day: 'numeric',
            hour: '2-digit', minute: '2-digit'
        });
    };


    if (isLoading && requests.length === 0) { 
        return <p>Loading pending requests...</p>;
    }

    if (error) {
        return <p style={{ color: 'red' }}>{error}</p>;
    }

    return (
        <div>
            <h2>Pending Software Access Requests</h2>
            {requests.length === 0 && !isLoading ? (
                <p>There are no pending access requests at the moment.</p>
            ) : (
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead>
                        <tr>
                            <th style={tableHeaderStyle}>User</th>
                            <th style={tableHeaderStyle}>Software</th>
                            <th style={tableHeaderStyle}>Access Type</th>
                            <th style={tableHeaderStyle}>Reason</th>
                            <th style={tableHeaderStyle}>Submitted On</th>
                            <th style={tableHeaderStyle}>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {requests.map((request) => (
                            <tr key={request.id}>
                                <td style={tableCellStyle}>{request.user?.username || 'N/A'}</td>
                                <td style={tableCellStyle}>{request.software?.name || 'N/A'}</td>
                                <td style={tableCellStyle}>{request.accessType}</td>
                                <td style={tableCellStyle}>{request.reason}</td>
                                <td style={tableCellStyle}>{formatDate(request.createdAt)}</td>
                                <td style={tableCellStyle}>
                                    {request.status === 'Pending' ? (
                                        <>
                                            <button
                                                onClick={() => handleAction(request.id, 'Approved')}
                                                style={{ ...actionButtonStyle, backgroundColor: 'green', marginRight: '5px' }}
                                            >
                                                Approve
                                            </button>
                                            <button
                                                onClick={() => handleAction(request.id, 'Rejected')}
                                                style={{ ...actionButtonStyle, backgroundColor: 'red' }}
                                            >
                                                Reject
                                            </button>
                                        </>
                                    ) : (
                                        <span style={getStatusChipStyle(request.status)}>{request.status}</span> // Show status if not pending (e.g. after optimistic update or error)
                                    )}
                                    {actionMessage && actionMessage.id === request.id && (
                                        <p style={{ fontSize: '0.8em', color: actionMessage.type === 'success' ? 'green' : 'red', margin: '5px 0 0 0' }}>
                                            {actionMessage.text}
                                        </p>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    );
};

const tableHeaderStyle: React.CSSProperties = {
    borderBottom: '2px solid #ddd', padding: '10px', textAlign: 'left', background: '#f7f7f7',
};
const tableCellStyle: React.CSSProperties = {
    borderBottom: '1px solid #eee', padding: '10px', textAlign: 'left', verticalAlign: 'top'
};
const actionButtonStyle: React.CSSProperties = {
    color: 'white', border: 'none', padding: '6px 10px', borderRadius: '4px', cursor: 'pointer', fontSize: '0.9em',
};
const getStatusChipStyle = (status: AccessRequest['status']): React.CSSProperties => { 
    let backgroundColor = '#eee'; let color = '#333';
    switch (status) {
        case 'Pending': backgroundColor = '#fffbe6'; color = '#cfa000'; break;
        case 'Approved': backgroundColor = '#e6ffed'; color = 'green'; break;
        case 'Rejected': backgroundColor = '#ffe6e6'; color = 'red'; break;
    }
    return { padding: '4px 8px', borderRadius: '12px', backgroundColor, color, fontWeight: 'bold', fontSize: '0.9em', display: 'inline-block' };
};

export default PendingRequestsPage;