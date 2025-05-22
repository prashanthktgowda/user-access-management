import React, { useState, FormEvent } from 'react';
import api from '/home/prashanthktgowda/user-access-management/frontend/src/services/api.ts';
import { Software } from '/home/prashanthktgowda/user-access-management/frontend/src/types/software.types';

interface SoftwareFormData {
    name: string;
    description: string;
    accessLevels: string[];
}

const CreateSoftwarePage: React.FC = () => {
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [accessLevelsInput, setAccessLevelsInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [message, setMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setMessage(null);
        setIsLoading(true);

        if (!name.trim() || !description.trim() || !accessLevelsInput.trim()) {
            setMessage({ text: 'All fields are required.', type: 'error' });
            setIsLoading(false);
            return;
        }

        const levelsArray = accessLevelsInput
            .split(',')
            .map(level => level.trim())
            .filter(level => level !== '');

        if (levelsArray.length === 0) {
            setMessage({ text: 'Please provide at least one valid access level.', type: 'error' });
            setIsLoading(false);
            return;
        }

        const softwareData: SoftwareFormData = {
            name,
            description,
            accessLevels: levelsArray,
        };

        try {
            const response = await api.post<{ software: Software, message: string }>('/software', softwareData);
            setMessage({ text: response.data.message || 'Software created successfully!', type: 'success' });
            setName('');
            setDescription('');
            setAccessLevelsInput('');
        } catch (err: any) {
            setMessage({ text: err.response?.data?.message || 'An error occurred while creating software.', type: 'error' });
            console.error("Create software error:", err.response?.data || err.message);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div>
            <h2>Create New Software</h2>
            {message && (
                <div style={{
                    padding: '10px',
                    marginBottom: '15px',
                    borderRadius: '4px',
                    border: `1px solid ${message.type === 'success' ? 'green' : 'red'}`,
                    color: message.type === 'success' ? 'green' : 'red',
                    background: message.type === 'success' ? '#e6ffed' : '#ffe6e6',
                }}>
                    {message.text}
                </div>
            )}
            <form onSubmit={handleSubmit}>
                <div>
                    <label htmlFor="name">Software Name:</label>
                    <input
                        type="text"
                        id="name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                        disabled={isLoading}
                    />
                </div>
                <div>
                    <label htmlFor="description">Description:</label>
                    <textarea
                        id="description"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        required
                        rows={4}
                        disabled={isLoading}
                    />
                </div>
                <div>
                    <label htmlFor="accessLevels">
                        Access Levels (comma-separated, e.g., Read, Write, Admin):
                    </label>
                    <input
                        type="text"
                        id="accessLevels"
                        value={accessLevelsInput}
                        onChange={(e) => setAccessLevelsInput(e.target.value)}
                        placeholder="e.g., Read, Write, Admin"
                        required
                        disabled={isLoading}
                    />
                </div>
                <button type="submit" disabled={isLoading} style={{ marginTop: '10px' }}>
                    {isLoading ? 'Creating...' : 'Create Software'}
                </button>
            </form>
        </div>
    );
};

export default CreateSoftwarePage;
