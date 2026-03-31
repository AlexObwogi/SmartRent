import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import API from '../services/api';

const MyApplications = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchApplications();
  }, []);

  const fetchApplications = async () => {
    try {
      setLoading(true);
      const response = await API.get('/bookings/my-bookings');
      setApplications(response.data);
      setError(null);
    } catch (err) {
      console.error('Error fetching applications:', err);
      setError(err.response?.data?.message || 'Failed to load applications');
    } finally {
      setLoading(false);
    }
  };

  // Helper function to get display location
  const getDisplayLocation = (property) => {
    if (!property) return 'Location not specified';
    if (property.address) return property.address;
    if (property.location && property.location.coordinates) {
      return property.location.coordinates[1] + ', ' + property.location.coordinates[0];
    }
    return 'Location not specified';
  };

  // Helper function to get image URL
  const getImageUrl = (property) => {
    if (!property) return 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=200';
    if (property.images && property.images.length > 0 && property.images[0]) {
      return property.images[0];
    }
    return 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=200';
  };

  if (loading) return <div style={{ textAlign: 'center', padding: '50px' }}>Loading your applications...</div>;

  if (error) return <div style={{ textAlign: 'center', padding: '50px', color: 'red' }}>Error: {error}</div>;

  return (
    <div style={{ padding: '20px', maxWidth: '1200px', margin: '0 auto' }}>
      <h1>My Applications</h1>
      
      {applications.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '50px', backgroundColor: '#f9f9f9', borderRadius: '8px' }}>
          <p>You haven't submitted any applications yet.</p>
          <Link to="/properties">
            <button style={{ backgroundColor: '#4CAF50', color: 'white', padding: '10px 20px', marginTop: '10px', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
              Browse Properties
            </button>
          </Link>
        </div>
      ) : (
        <div style={{ display: 'grid', gap: '20px' }}>
          {applications.map((app) => (
            <div key={app._id} style={{ border: '1px solid #ddd', borderRadius: '8px', padding: '15px', backgroundColor: 'white', display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
              {/* Property Image */}
              <div style={{ width: '150px', height: '150px', flexShrink: 0 }}>
                <img
                  src={getImageUrl(app.property)}
                  alt={app.property?.title || 'Property'}
                  style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '8px' }}
                  onError={(e) => {
                    e.target.src = 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=200';
                  }}
                />
              </div>
              
              {/* Application Details */}
              <div style={{ flex: 1 }}>
                <h3 style={{ margin: '0 0 10px 0' }}>{app.property?.title || 'Property'}</h3>
                <p style={{ margin: '5px 0', color: '#666' }}>
                  📍 {getDisplayLocation(app.property)}
                </p>
                <p style={{ margin: '5px 0' }}>
                  <strong>Status:</strong>{' '}
                  <span style={{ 
                    color: app.status === 'approved' ? 'green' : app.status === 'rejected' ? 'red' : 'orange',
                    fontWeight: 'bold'
                  }}>
                    {app.status}
                  </span>
                </p>
                <p style={{ margin: '5px 0' }}>
                  <strong>Move-in Date:</strong> {new Date(app.moveInDate).toLocaleDateString()}
                </p>
                {app.message && (
                  <p style={{ margin: '5px 0' }}>
                    <strong>Message:</strong> {app.message}
                  </p>
                )}
                <Link to={`/property/${app.property?._id}`}>
                  <button style={{ marginTop: '10px', padding: '8px 16px', backgroundColor: '#2196F3', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
                    View Property
                  </button>
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyApplications;