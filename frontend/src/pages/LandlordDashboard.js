import React, { useState, useEffect } from 'react';
import { getMyProperties, deleteProperty } from '../services/propertyService';
import { getLandlordApplications, updateApplicationStatus } from '../services/landlordService';

const LandlordDashboard = () => {
    const [properties, setProperties] = useState([]);
    const [applications, setApplications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            setLoading(true);
            setError(null);
            
            const [props, apps] = await Promise.all([
                getMyProperties(),
                getLandlordApplications()
            ]);
            
            setProperties(props || []);
            setApplications(apps || []);
        } catch (error) {
            console.error('Error fetching data:', error);
            setError(error.response?.data?.message || 'Failed to load data');
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteProperty = async (id) => {
        if (window.confirm('Are you sure you want to delete this property?')) {
            try {
                await deleteProperty(id);
                const updatedProps = await getMyProperties();
                setProperties(updatedProps);
            } catch (error) {
                console.error('Error deleting property:', error);
                alert('Failed to delete property');
            }
        }
    };

    const handleStatusUpdate = async (applicationId, newStatus) => {
        try {
            await updateApplicationStatus(applicationId, newStatus);
            const updatedApps = await getLandlordApplications();
            setApplications(updatedApps);
        } catch (error) {
            console.error('Error updating status:', error);
            alert('Failed to update application status');
        }
    };

    if (loading) {
        return <div style={{ padding: '20px', textAlign: 'center' }}>Loading dashboard...</div>;
    }

    if (error) {
        return <div style={{ padding: '20px', color: 'red' }}>Error: {error}</div>;
    }

    return (
        <div style={{ padding: '20px' }}>
            <h1>Landlord Dashboard</h1>
            
            <section>
                <h2>My Properties ({properties.length})</h2>
                {properties.length === 0 ? (
                    <p>No properties yet. Click "Add Property" to create your first listing.</p>
                ) : (
                    <div style={{ display: 'grid', gap: '20px', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))' }}>
                        {properties.map(prop => (
                            <div key={prop._id} style={{ border: '1px solid #ddd', padding: '15px', borderRadius: '8px' }}>
                                <h3>{prop.title}</h3>
                                <p>📍 {prop.address}</p>
                                <p>💰 KES {prop.price}</p>
                                <p>🛏️ {prop.bedrooms} beds | 🚽 {prop.bathrooms} baths</p>
                                <p>Status: <span style={{ fontWeight: 'bold', color: prop.status === 'available' ? 'green' : 'orange' }}>
                                    {prop.status}
                                </span></p>
                                <button 
                                    onClick={() => handleDeleteProperty(prop._id)}
                                    style={{ backgroundColor: '#ff4444', color: 'white', padding: '5px 10px', marginTop: '10px' }}
                                >
                                    Delete
                                </button>
                            </div>
                        ))}
                    </div>
                )}
            </section>

            <section style={{ marginTop: '40px' }}>
                <h2>Applications ({applications.length})</h2>
                {applications.length === 0 ? (
                    <p>No applications yet.</p>
                ) : (
                    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                        <thead>
                            <tr style={{ backgroundColor: '#f0f0f0' }}>
                                <th style={{ padding: '10px', border: '1px solid #ddd' }}>Property</th>
                                <th style={{ padding: '10px', border: '1px solid #ddd' }}>Tenant</th>
                                <th style={{ padding: '10px', border: '1px solid #ddd' }}>Move-in Date</th>
                                <th style={{ padding: '10px', border: '1px solid #ddd' }}>Status</th>
                                <th style={{ padding: '10px', border: '1px solid #ddd' }}>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {applications.map(app => (
                                <tr key={app._id}>
                                    <td style={{ padding: '10px', border: '1px solid #ddd' }}>{app.property?.title}</td>
                                    <td style={{ padding: '10px', border: '1px solid #ddd' }}>{app.tenant?.name}</td>
                                    <td style={{ padding: '10px', border: '1px solid #ddd' }}>{new Date(app.moveInDate).toLocaleDateString()}</td>
                                    <td style={{ padding: '10px', border: '1px solid #ddd' }}>
                                        <span style={{ 
                                            color: app.status === 'approved' ? 'green' : app.status === 'rejected' ? 'red' : 'orange',
                                            fontWeight: 'bold'
                                        }}>
                                            {app.status}
                                        </span>
                                    </td>
                                    <td style={{ padding: '10px', border: '1px solid #ddd' }}>
                                        {app.status === 'pending' && (
                                            <div>
                                                <button 
                                                    onClick={() => handleStatusUpdate(app._id, 'approved')}
                                                    style={{ backgroundColor: '#4CAF50', color: 'white', padding: '5px 10px', marginRight: '5px' }}
                                                >
                                                    Approve
                                                </button>
                                                <button 
                                                    onClick={() => handleStatusUpdate(app._id, 'rejected')}
                                                    style={{ backgroundColor: '#ff4444', color: 'white', padding: '5px 10px' }}
                                                >
                                                    Reject
                                                </button>
                                            </div>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </section>
        </div>
    );
};

export default LandlordDashboard;
