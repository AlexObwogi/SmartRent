import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { saveProperty, removeSavedProperty, isPropertySaved } from '../services/savedService';

const PropertyCard = ({ property, onUnsave }) => {
  const navigate = useNavigate();
  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const checkSaved = async () => {
      try {
        const isSaved = await isPropertySaved(property._id);
        setSaved(isSaved);
      } catch (error) {
        console.error('Error checking saved status:', error);
      }
    };
    checkSaved();
  }, [property._id]);

  const handleSaveToggle = async (e) => {
    e.stopPropagation();
    if (loading) return;
    
    setLoading(true);
    try {
      if (saved) {
        await removeSavedProperty(property._id);
        setSaved(false);
        if (onUnsave) onUnsave(property._id);
      } else {
        await saveProperty(property);
        setSaved(true);
      }
    } catch (error) {
      console.error('Error toggling save:', error);
      if (error.response?.status === 401) {
        alert('Please login to save properties');
        navigate('/login');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleViewDetails = (e) => {
    e.stopPropagation();
    navigate(`/property/${property._id}`);
  };

  const getDisplayLocation = () => {
    if (property.address) {
      return property.address;
    }
    if (property.location && property.location.coordinates) {
      return property.location.coordinates[1] + ', ' + property.location.coordinates[0];
    }
    return 'Location not specified';
  };

  const getImageUrl = () => {
    if (property.images && property.images.length > 0 && property.images[0]) {
      return property.images[0];
    }
    if (property.media && property.media.length > 0) {
      const imageMedia = property.media.find(m => m.mediaType === 'image');
      if (imageMedia) return imageMedia.url;
    }
    return 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=400';
  };

  return (
    <div className="property-card" style={{ border: '1px solid #ddd', borderRadius: '8px', overflow: 'hidden', marginBottom: '20px', backgroundColor: 'white' }}>
      <div className="property-image" style={{ position: 'relative' }}>
        <img
          src={getImageUrl()}
          alt={property.title}
          style={{ width: '100%', height: '200px', objectFit: 'cover' }}
          onError={(e) => {
            e.target.src = 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=400';
          }}
        />
        <span className="property-type-badge" style={{ position: 'absolute', top: '10px', left: '10px', background: 'rgba(0,0,0,0.6)', color: 'white', padding: '4px 8px', borderRadius: '4px', fontSize: '12px' }}>
          {property.propertyType || 'Rental'}
        </span>
        <button
          className={`save-btn ${saved ? 'saved' : ''}`}
          onClick={handleSaveToggle}
          disabled={loading}
          title={saved ? 'Remove from saved' : 'Save property'}
          style={{
            position: 'absolute',
            bottom: '10px',
            right: '10px',
            background: 'white',
            border: 'none',
            borderRadius: '50%',
            width: '32px',
            height: '32px',
            fontSize: '18px',
            cursor: loading ? 'wait' : 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 2px 4px rgba(0,0,0,0.2)'
          }}
        >
          {saved ? '❤️' : '🤍'}
        </button>
      </div>
      <div className="property-details" style={{ padding: '15px' }}>
        <h3 style={{ margin: '0 0 10px 0', fontSize: '18px' }}>{property.title}</h3>
        <p className="property-location" style={{ color: '#666', marginBottom: '10px', fontSize: '14px' }}>📍 {getDisplayLocation()}</p>
        <p className="property-price" style={{ fontSize: '18px', fontWeight: 'bold', color: '#4CAF50', marginBottom: '10px' }}>
          KES {property.price?.toLocaleString()}<span style={{ fontSize: '14px', fontWeight: 'normal' }}>/month</span>
        </p>
        <p className="property-description" style={{ color: '#666', fontSize: '14px', marginBottom: '10px' }}>
          {property.description
            ? property.description.substring(0, 100) + '...'
            : 'No description available'}
        </p>
        <div className="property-features" style={{ display: 'flex', gap: '10px', marginBottom: '15px' }}>
          {property.bedrooms && (
            <span className="feature" style={{ fontSize: '12px', color: '#666' }}>🛏 {property.bedrooms} Beds</span>
          )}
          {property.bathrooms && (
            <span className="feature" style={{ fontSize: '12px', color: '#666' }}>🚿 {property.bathrooms} Baths</span>
          )}
        </div>
        <button
          className="btn-view-details"
          onClick={handleViewDetails}
          style={{
            width: '100%',
            padding: '10px',
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
      </div>
    </div>
  );
};

export default PropertyCard;