import React, { useState, FormEvent, useEffect } from 'react';
import api from '/home/prashanthktgowda/user-access-management/frontend/src/services/api.ts';
import { Software, AccessRequestFormData, AccessType } from '../../types'; 

const RequestAccessPage: React.FC = () => {
    const [softwareList, setSoftwareList] = useState<Software[]>([]);
    const [selectedSoftwareId, setSelectedSoftwareId] = useState<string>('');
    const [selectedAccessType, setSelectedAccessType] = useState<AccessType | ''>('');
    const [reason, setReason] = useState('');

    const [isLoading, setIsLoading] = useState(false);
    const [fetchError, setFetchError] = useState<string | null>(null);
    const [submitMessage, setSubmitMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

    useEffect(() => {
        const fetchSoftware = async () => {
            setIsLoading(true);
            setFetchError(null);
            try {
                const response = await api.get<Software[]>('/software');
                setSoftwareList(response.data);
            } catch (err) {
                console.error("Error fetching software list:", err);
                setFetchError('Failed to load software list. Please try again later.');
            } finally {
                setIsLoading(false);
            }
        };
        fetchSoftware();
    }, []);
    const selectedSoftware = softwareList.find(s => s.id === parseInt(selectedSoftwareId));

    useEffect(() => {
        setSelectedAccessType('');
    }, [selectedSoftwareId]);


    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setSubmitMessage(null);

        if (!selectedSoftwareId || !selectedAccessType || !reason.trim()) {
            setSubmitMessage({ text: 'Please select software, access type, and provide a reason.', type: 'error' });
            return;
        }

        setIsLoading(true);
        const requestData: AccessRequestFormData = {
            softwareId: parseInt(selectedSoftwareId),
            accessType: selectedAccessType as AccessType, 
            reason,
        };

        try {
            await api.post('/requests', requestData);
            setSubmitMessage({ text: 'Access request submitted successfully!', type: 'success' });
            // Clear form
            setSelectedSoftwareId('');
            setSelectedAccessType('');
            setReason('');
        } catch (err: any) {
            setSubmitMessage({ text: err.response?.data?.message || 'Failed to submit request.', type: 'error' });
            console.error("Error submitting access request:", err.response?.data || err.message);
        } finally {
            setIsLoading(false);
        }
    };

    if (isLoading && softwareList.length === 0 && !fetchError) {
        return <p>Loading available software...</p>;
    }

    if (fetchError) {
        return <p style={{ color: 'red' }}>{fetchError}</p>;
    }

    return (
        <div>
            <h2>Request Software Access</h2>

            {submitMessage && (
                <div style={{
                    padding: '10px', marginBottom: '15px', borderRadius: '4px',
                    border: `1px solid ${submitMessage.type === 'success' ? 'green' : 'red'}`,
                    color: submitMessage.type === 'success' ? 'green' : 'red',
                    background: submitMessage.type === 'success' ? '#e6ffed' : '#ffe6e6',
                }}>
                    {submitMessage.text}
                </div>
            )}

            <form onSubmit={handleSubmit}>
                <div>
                    <label htmlFor="software">Select Software:</label>
                    <select
                        id="software"
                        value={selectedSoftwareId}
                        onChange={(e) => setSelectedSoftwareId(e.target.value)}
                        required
                        disabled={isLoading || softwareList.length === 0}
                    >
                        <option value="">-- Select Software --</option>
                        {softwareList.map((software) => (
                            <option key={software.id} value={software.id}>
                                {software.name}
                            </option>
                        ))}
                    </select>
                    {softwareList.length === 0 && !isLoading && <p>No software available.</p>}
                </div>

                {selectedSoftware && (
                    <div>
                        <label htmlFor="accessType">Select Access Type:</label>
                        <select
                            id="accessType"
                            value={selectedAccessType}
                            onChange={(e) => setSelectedAccessType(e.target.value as AccessType | '')}
                            required
                            disabled={isLoading}
                        >
                            <option value="">-- Select Access Type --</option>
                            {selectedSoftware.accessLevels.map((level) => (
                                <option key={level} value={level}>
                                    {level}
                                </option>
                            ))}
                        </select>
                        {!selectedSoftware.accessLevels.length && <p>No access levels defined for this software.</p>}
                    </div>
                )}

                <div>
                    <label htmlFor="reason">Reason for Request:</label>
                    <textarea
                        id="reason"
                        value={reason}
                        onChange={(e) => setReason(e.target.value)}
                        required
                        rows={4}
                        disabled={isLoading}
                    />
                </div>

                <button type="submit" disabled={isLoading || !selectedSoftwareId || !selectedAccessType} style={{ marginTop: '10px' }}>
                    {isLoading ? 'Submitting...' : 'Submit Request'}
                </button>
            </form>
        </div>
    );
};

export default RequestAccessPage;