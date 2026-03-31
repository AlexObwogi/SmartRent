import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import API from '../services/api';
import { saveProperty, removeSavedProperty, isPropertySaved } from '../services/savedService';
import ReviewSection from '../components/ReviewSection';

const PropertyDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeImage, setActiveImage] = useState(0);
  const [saved, setSaved] = useState(false);
  const [media, setMedia] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const user = JSON.parse(localStorage.getItem('user'));
  const isOwner = user && property && (user.role === 'admin' || user.id === property.landlord?._id || user.id === property.landlord);

  useEffect(() => {
    fetchData();
  }, [id]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      
      // Fetch property details
      const propertyRes = await API.get(`/houses/${id}`, {
        headers: { 'Authorization': token ? `Bearer ${token}` : '' }
      });
      setProperty(propertyRes.data);
      
      // Fetch media (images and videos)
      await fetchMedia();
      
      setSaved(await isPropertySaved(id));
    } catch (err) {
      console.error('Error fetching property:', err);
      setProperty(null);
    } finally {
      setLoading(false);
    }
  };

  const fetchMedia = async () => {
    try {
      const mediaRes = await API.get(`/media/property/${id}`);
      setMedia(mediaRes.data);
    } catch (err) {
      console.log('No media found for this property');
      setMedia([]);
    }
  };

  const handleSaveToggle = async () => {
    if (saved) {
      await removeSavedProperty(property._id);
      setSaved(false);
    } else {
      await saveProperty(property);
      setSaved(true);
    }
  };

  const handleFileUpload = async (e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;
    
    setUploading(true);
    setUploadProgress(0);
    
    const formData = new FormData();
    files.forEach(file => {
      formData.append('files', file);
    });
    
    try {
      const token = localStorage.getItem('token');
      const response = await API.post(`/media/upload/${id}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer ${token}`
        },
        onUploadProgress: (progressEvent) => {
          const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          setUploadProgress(percentCompleted);
        }
      });
      
      // Refresh media list
      await fetchMedia();
      // Refresh property to update images array
      const propertyRes = await API.get(`/houses/${id}`);
      setProperty(propertyRes.data);
      
      alert(`Successfully uploaded ${response.data.files.length} file(s)!`);
    } catch (error) {
      console.error('Upload error:', error);
      alert('Failed to upload files: ' + (error.response?.data?.message || error.message));
    } finally {
      setUploading(false);
      setUploadProgress(0);
      e.target.value = '';
    }
  };

  const handleDeleteMedia = async (mediaId, mediaType) => {
    if (!window.confirm(`Are you sure you want to delete this ${mediaType}? This action cannot be undone.`)) {
      return;
    }
    
    try {
      const token = localStorage.getItem('token');
      await API.delete(`/media/${mediaId}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      // Refresh media list
      await fetchMedia();
      // Refresh property to update images array
      const propertyRes = await API.get(`/houses/${id}`);
      setProperty(propertyRes.data);
      
      alert(`${mediaType} deleted successfully!`);
    } catch (error) {
      console.error('Delete error:', error);
      alert('Failed to delete media: ' + (error.response?.data?.message || error.message));
    }
  };

  const getDisplayLocation = () => {
    if (property?.address) return property.address;
    if (property?.location?.coordinates) {
      return property.location.coordinates[1] + ', ' + property.location.coordinates[0];
    }
    if (typeof property?.location === 'string') return property.location;
    return 'Location not specified';
  };

  const getMapLocation = () => {
    if (property?.address) return property.address;
    if (property?.location?.coordinates) {
      return property.location.coordinates[1] + ', ' + property.location.coordinates[0];
    }
    if (typeof property?.location === 'string') return property.location;
    return 'Nairobi, Kenya';
  };

  // Separate images and videos from media
  const images = media.filter(m => m.mediaType === 'image');
  const videos = media.filter(m => m.mediaType === 'video');
  
  // Also check property.images array
  const propertyImages = property?.images?.filter(img => !img.includes('cloudinary.com/demo')) || [];
  const allImages = [...propertyImages, ...images.map(i => i.url)];
  
  // Get video URL from media or property
  const videoUrl = videos.length > 0 ? videos[0].url : (property?.videoUrl || null);

  if (loading) return <div className="loading">Loading property details...</div>;

  if (!property) {
    return (
      <div className="not-found">
        <h2>Property Not Found</h2>
        <p>The property you are looking for does not exist.</p>
        <button onClick={() => navigate('/properties')} className="btn btn-primary">
          Back to Properties
        </button>
      </div>
    );
  }

  const displayLocation = getDisplayLocation();
  const mapLocation = getMapLocation();
  const detailSaveBtnClass = 'detail-save-btn ' + (saved ? 'saved' : '');
  const badgeClass = 'badge';
  const badgeAvailableClass = 'badge badge-available';
  const amenityTagClass = 'amenity-tag';
  const thumbnailClass = (index) => 'thumbnail ' + (index === activeImage ? 'active-thumbnail' : '');
  const btnFullClass = 'btn btn-full ' + (saved ? 'btn-unsave' : 'btn-save');
  const btnPrimaryFullClass = 'btn btn-primary btn-full';
  const btnSecondaryFullClass = 'btn btn-secondary btn-full';

  const getImageUrl = (imageIndex) => {
    if (allImages.length > 0 && allImages[imageIndex]) {
      return allImages[imageIndex];
    }
    return 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=600';
  };

  return (
    <div className="property-detail-page">
      {/* Upload Section for Owner */}
      {isOwner && (
        <div style={{ marginBottom: '20px', padding: '15px', backgroundColor: '#f0f8ff', borderRadius: '8px', border: '1px dashed #4CAF50' }}>
          <h3>📤 Manage Media</h3>
          <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap', alignItems: 'center' }}>
            <div>
              <label style={{ display: 'inline-block', padding: '8px 16px', backgroundColor: '#4CAF50', color: 'white', borderRadius: '4px', cursor: 'pointer' }}>
                📸 Upload Images/Videos
                <input
                  type="file"
                  accept="image/*,video/*"
                  multiple
                  onChange={handleFileUpload}
                  disabled={uploading}
                  style={{ display: 'none' }}
                />
              </label>
            </div>
            {uploading && (
              <div style={{ flex: 1 }}>
                <progress value={uploadProgress} max="100" style={{ width: '100%' }} />
                <span style={{ marginLeft: '10px' }}>{uploadProgress}%</span>
              </div>
            )}
          </div>
          <p style={{ fontSize: '12px', color: '#666', marginTop: '10px' }}>
            Supported formats: JPG, PNG, GIF, MP4, MOV, WebM (Max 10 files per upload)
          </p>
        </div>
      )}

      {/* Image Gallery */}
      <div className="detail-gallery">
        <div className="main-image" style={{ position: 'relative' }}>
          <img
            src={getImageUrl(activeImage)}
            alt={property.title}
            onError={(e) => {
              e.target.src = 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=600';
            }}
          />
          <button className={detailSaveBtnClass} onClick={handleSaveToggle}>
            {saved ? '❤️ Saved' : '🤍 Save'}
          </button>
        </div>
        {allImages.length > 1 && (
          <div className="thumbnail-row">
            {allImages.map((img, index) => (
              <div key={index} style={{ position: 'relative', display: 'inline-block' }}>
                <img
                  src={img}
                  alt={property.title + ' ' + (index + 1)}
                  className={thumbnailClass(index)}
                  onClick={() => setActiveImage(index)}
                />
                {isOwner && images[index] && (
                  <button
                    onClick={() => handleDeleteMedia(images[index]._id, 'image')}
                    style={{
                      position: 'absolute',
                      top: '-5px',
                      right: '-5px',
                      background: 'red',
                      color: 'white',
                      border: 'none',
                      borderRadius: '50%',
                      width: '20px',
                      height: '20px',
                      cursor: 'pointer',
                      fontSize: '12px',
                      lineHeight: '1'
                    }}
                  >
                    ×
                  </button>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Video Section */}
      {videos.length > 0 && (
        <div className="detail-section">
          <h3>🎥 Property Video Tour</h3>
          {videos.map((video, idx) => (
            <div key={video._id} style={{ marginBottom: '20px', position: 'relative' }}>
              <video controls width="100%" style={{ borderRadius: '8px' }} controlsList="nodownload">
                <source src={video.url} type="video/mp4" />
                <source src={video.url} type="video/webm" />
                Your browser does not support the video tag.
              </video>
              {isOwner && (
                <button
                  onClick={() => handleDeleteMedia(video._id, 'video')}
                  style={{
                    position: 'absolute',
                    top: '10px',
                    right: '10px',
                    background: 'red',
                    color: 'white',
                    border: 'none',
                    borderRadius: '50%',
                    width: '30px',
                    height: '30px',
                    cursor: 'pointer',
                    fontSize: '16px'
                  }}
                >
                  ×
                </button>
              )}
            </div>
          ))}
        </div>
      )}

      <div className="detail-content">
        <div className="detail-main">
          <div className="detail-header">
            <div>
              <h1>{property.title}</h1>
              <p className="detail-location">📍 {displayLocation}</p>
            </div>
            <div className="detail-price">
              <h2>KES {property.price?.toLocaleString()}</h2>
              <span>/month</span>
            </div>
          </div>

          <div className="detail-badges">
            <span className={badgeClass}>{property.propertyType || 'Property'}</span>
            <span className={badgeClass}>🛏 {property.bedrooms} Bedrooms</span>
            <span className={badgeClass}>🚿 {property.bathrooms} Bathrooms</span>
            {property.status === 'available' && <span className={badgeAvailableClass}>✅ Available</span>}
          </div>

          <div className="detail-section">
            <h3>Description</h3>
            <p>{property.description}</p>
          </div>

          {property.amenities && property.amenities.length > 0 && (
            <div className="detail-section">
              <h3>Amenities</h3>
              <div className="amenities-grid">
                {property.amenities.map((amenity, index) => (
                  <span key={index} className={amenityTagClass}>✓ {amenity}</span>
                ))}
              </div>
            </div>
          )}

          <div className="detail-section">
            <h3>📍 Location & Navigation</h3>
            <div className="maps-container">
              <iframe
                title="Property Location"
                width="100%"
                height="300"
                style={{ border: 0, borderRadius: '8px' }}
                loading="lazy"
                src={'https://maps.google.com/maps?q=' + encodeURIComponent(mapLocation) + '&output=embed'}
              ></iframe>
              <a
                href={'https://www.google.com/maps/search/?api=1&query=' + encodeURIComponent(mapLocation)}
                target="_blank"
                rel="noopener noreferrer"
                className={btnSecondaryFullClass}
                style={{ marginTop: '10px', display: 'block', textAlign: 'center' }}
              >
                🗺️ Open in Google Maps
              </a>
            </div>
          </div>
        </div>

        <div className="detail-sidebar">
          <div className="contact-card">
            <h3>Contact Landlord</h3>
            {property.landlord && (
              <div className="landlord-info">
                <p className="landlord-name">👤 {property.landlord.name}</p>
                <p>📧 {property.landlord.email}</p>
                <p>📞 {property.landlord.phone || 'Not provided'}</p>
              </div>
            )}
            {user ? (
              <>
                <button className={btnPrimaryFullClass} onClick={() => navigate(`/apply/${property._id}`)}>
                  Apply Now
                </button>
                <button
                  className={btnFullClass}
                  onClick={handleSaveToggle}
                  style={{ marginTop: '10px' }}
                >
                  {saved ? '❤️ Remove from Saved' : '🤍 Save Property'}
                </button>
                {isOwner && (
                  <button
                    onClick={() => navigate(`/edit-property/${property._id}`)}
                    style={{ width: '100%', marginTop: '10px', padding: '10px', backgroundColor: '#ff9800', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
                  >
                    ✏️ Edit Property Details
                  </button>
                )}
              </>
            ) : (
              <div>
                <p className="login-prompt">Login to apply for this property</p>
                <button className={btnPrimaryFullClass} onClick={() => navigate('/login')}>
                  Login to Apply
                </button>
              </div>
            )}
          </div>
          <button className={btnSecondaryFullClass} onClick={() => navigate('/properties')}>
            ← Back to Properties
          </button>
        </div>
      </div>

      <ReviewSection propertyId={id} />
    </div>
  );
};

export default PropertyDetail;