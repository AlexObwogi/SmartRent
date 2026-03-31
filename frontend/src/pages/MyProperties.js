import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import API from '../services/api';

const MyProperties = () => {
  const navigate = useNavigate();
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchMyProperties();
  }, []);

  const fetchMyProperties = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const response = await API.get('/houses/my-properties', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      setProperties(response.data);
      setError(null);
    } catch (err) {
      console.error('Error fetching properties:', err);
      setError(err.response?.data?.message || 'Failed to load properties');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this property? This action cannot be undone.')) {
      try {
        const token = localStorage.getItem('token');
        await API.delete(`/houses/${id}`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        setProperties(properties.filter(p => p._id !== id));
        alert('Property deleted successfully!');
      } catch (err) {
        console.error('Error deleting property:', err);
        alert('Failed to delete property: ' + (err.response?.data?.message || err.message));
      }
    }
  };

  const handleViewDetails = (id) => {
    navigate(`/property/${id}`);
  };

  const getImageUrl = (property) => {
    if (property.images && property.images.length > 0 && property.images[0]) {
      return property.images[0];
    }
    if (property.media && property.media.length > 0) {
      const imageMedia = property.media.find(m => m.mediaType === 'image');
      if (imageMedia) return imageMedia.url;
    }
    return 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=400';
  };

  if (loading) return <div style={{ textAlign: 'center', padding: '50px' }}>Loading your properties...</div>;

  if (error) return <div style={{ textAlign: 'center', padding: '50px', color: 'red' }}>Error: {error}</div>;

  return (
    <div style={{ padding: '20px', maxWidth: '1200px', margin: '0 auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
        <h1>My Properties</h1>
        <Link to="/create-property">
          <button style={{ backgroundColor: '#4CAF50', color: 'white', padding: '10px 20px', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '16px' }}>
            + Add New Property
          </button>
        </Link>
      </div>

      {properties.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '50px', backgroundColor: '#f9f9f9', borderRadius: '8px' }}>
          <p>You haven't added any properties yet.</p>
          <Link to="/create-property">
            <button style={{ backgroundColor: '#4CAF50', color: 'white', padding: '10px 20px', marginTop: '10px', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
              Create Your First Property
            </button>
          </Link>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: '20px' }}>
          {properties.map(property => (
            <div key={property._id} style={{ border: '1px solid #ddd', borderRadius: '8px', overflow: 'hidden', backgroundColor: 'white', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
              <div style={{ position: 'relative', height: '200px', overflow: 'hidden' }}>
                <img
                  src={getImageUrl(property)}
                  alt={property.title}
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  onError={(e) => {
                    e.target.src = 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=400';
                  }}
                />
                {property.mediaCount > 1 && (
                  <span style={{
                    position: 'absolute',
                    bottom: '10px',
                    right: '10px',
                    background: 'rgba(0,0,0,0.6)',
                    color: 'white',
                    padding: '2px 6px',
                    borderRadius: '4px',
                    fontSize: '12px'
                  }}>
                    +{property.mediaCount} media
                  </span>
                )}
              </div>
              <div style={{ padding: '15px' }}>
                <h3 style={{ margin: '0 0 10px 0' }}>{property.title}</h3>
                <p style={{ color: '#666', marginBottom: '10px', fontSize: '14px' }}>📍 {property.address}</p>
                <p style={{ fontSize: '20px', fontWeight: 'bold', color: '#4CAF50', marginBottom: '10px' }}>
                  KES {property.price?.toLocaleString()}<span style={{ fontSize: '14px', fontWeight: 'normal' }}>/month</span>
                </p>
                <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
                  <button
                    onClick={() => handleViewDetails(property._id)}
                    style={{
                      flex: 1,
                      padding: '8px 12px',
                      backgroundColor: '#2196F3',
                      color: 'white',
                      border: 'none',
                      borderRadius: '4px',
                      cursor: 'pointer',
                      fontSize: '14px'
                    }}
                  >
                    View Details
                  </button>
                  <button
                    onClick={() => handleDelete(property._id)}
                    style={{
                      flex: 1,
                      padding: '8px 12px',
                      backgroundColor: '#ff4444',
                      color: 'white',
                      border: 'none',
                      borderRadius: '4px',
                      cursor: 'pointer',
                      fontSize: '14px'
                    }}
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyProperties;