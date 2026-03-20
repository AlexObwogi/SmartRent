import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { saveProperty, removeSavedProperty, isPropertySaved } from '../services/savedService';

const PropertyCard = ({ property, onUnsave }) => {
  const navigate = useNavigate();
  const [saved, setSaved] = useState(isPropertySaved(property._id));

  const handleSaveToggle = (e) => {
    e.stopPropagation();
    if (saved) {
      removeSavedProperty(property._id);
      setSaved(false);
      if (onUnsave) onUnsave(property._id);
    } else {
      saveProperty(property);
      setSaved(true);
    }
  };

  return (
    <div className="property-card">
      <div className="property-image">
        <img
          src={
            property.images && property.images.length > 0
              ? property.images[0]
              : 'https://via.placeholder.com/300x200?text=No+Image'
          }
          alt={property.title}
        />
        <span className="property-type-badge">
          {property.propertyType || 'Rental'}
        </span>
        <button
          className={`save-btn ${saved ? 'saved' : ''}`}
          onClick={handleSaveToggle}
          title={saved ? 'Remove from saved' : 'Save property'}
        >
          {saved ? '❤️' : '🤍'}
        </button>
      </div>
      <div className="property-details">
        <h3>{property.title}</h3>
        <p className="property-location">📍 {property.location}</p>
        <p className="property-price">KES {property.price?.toLocaleString()}/month</p>
        <p className="property-description">
          {property.description
            ? property.description.substring(0, 100) + '...'
            : 'No description available'}
        </p>
        <div className="property-features">
          {property.bedrooms && (
            <span className="feature">🛏 {property.bedrooms} Beds</span>
          )}
          {property.bathrooms && (
            <span className="feature">🚿 {property.bathrooms} Baths</span>
          )}
        </div>
        <button
          className="btn-view-details"
          onClick={() => navigate(`/property/${property._id}`)}
        >
          View Details
        </button>
      </div>
    </div>
  );
};

export default PropertyCard;