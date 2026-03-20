import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getSavedProperties, removeSavedProperty } from '../services/savedService';
import PropertyCard from '../components/PropertyCard';

const SavedProperties = () => {
  const [savedProperties, setSavedProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const saved = getSavedProperties();
    setSavedProperties(saved);
    setLoading(false);
  }, []);

  const handleUnsave = (propertyId) => {
    const updated = removeSavedProperty(propertyId);
    setSavedProperties(updated);
  };

  const handleClearAll = () => {
    if (window.confirm('Are you sure you want to remove all saved properties?')) {
      localStorage.removeItem('savedProperties');
      setSavedProperties([]);
    }
  };

  return (
    <div className="saved-properties-page">
      <div className="saved-header">
        <h1>❤️ Saved Properties</h1>
        <p className="page-subtitle">
          Properties you've saved for later
        </p>
        {savedProperties.length > 0 && (
          <button className="btn-clear-all" onClick={handleClearAll}>
            🗑️ Clear All
          </button>
        )}
      </div>

      {loading ? (
        <div className="loading">Loading saved properties...</div>
      ) : savedProperties.length > 0 ? (
        <>
          <div className="saved-count">
            Showing {savedProperties.length} saved{' '}
            {savedProperties.length === 1 ? 'property' : 'properties'}
          </div>
          <div className="property-grid">
            {savedProperties.map((property) => (
              <PropertyCard
                key={property._id}
                property={property}
                onUnsave={handleUnsave}
              />
            ))}
          </div>
        </>
      ) : (
        <div className="no-saved">
          <div className="no-saved-icon">💔</div>
          <h3>No Saved Properties</h3>
          <p>You haven't saved any properties yet. Browse available properties and click the heart icon to save them!</p>
          <button
            className="btn btn-primary"
            onClick={() => navigate('/properties')}
          >
            Browse Properties
          </button>
        </div>
      )}
    </div>
  );
};

export default SavedProperties;