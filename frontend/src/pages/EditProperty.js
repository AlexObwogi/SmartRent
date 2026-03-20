import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import API from '../services/api';

const EditProperty = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    location: '',
    price: '',
    bedrooms: '',
    bathrooms: '',
    propertyType: 'apartment',
    images: '',
    videoUrl: '',
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Sample data for testing
  const sampleProperties = [
    {
      _id: '1',
      title: 'Modern Apartment in Westlands',
      description: 'Beautiful modern apartment in the heart of downtown with amazing city views.',
      location: 'Westlands, Nairobi',
      price: 55000,
      bedrooms: 2,
      bathrooms: 1,
      propertyType: 'Apartment',
      images: ['https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=600'],
    },
    {
      _id: '2',
      title: 'Spacious Family Home in Karen',
      description: 'Spacious family house in a quiet neighborhood.',
      location: 'Karen, Nairobi',
      price: 120000,
      bedrooms: 4,
      bathrooms: 2,
      propertyType: 'House',
      images: ['https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=600'],
    },
  ];

  useEffect(() => {
    const fetchProperty = async () => {
      setLoading(true);
      try {
        const response = await API.get(`/properties/${id}`);
        const property = response.data;
        setFormData({
          title: property.title || '',
          description: property.description || '',
          location: property.location || '',
          price: property.price || '',
          bedrooms: property.bedrooms || '',
          bathrooms: property.bathrooms || '',
          propertyType: property.propertyType || 'apartment',
          images: property.images ? property.images.join(', ') : '',
          videoUrl: property.videoUrl || '',
        });
      } catch (err) {
        // Use sample data if backend not available
        const found = sampleProperties.find((p) => p._id === id);
        if (found) {
          setFormData({
            title: found.title,
            description: found.description,
            location: found.location,
            price: found.price,
            bedrooms: found.bedrooms,
            bathrooms: found.bathrooms,
            propertyType: found.propertyType,
            images: found.images ? found.images.join(', ') : '',
          videoUrl: found.videoUrl || '',
          });
        }
      } finally {
        setLoading(false);
      }
    };

    fetchProperty();
    // eslint-disable-next-line
  }, [id]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const validateForm = () => {
    if (!formData.title || !formData.location || !formData.price) {
      setError('Title, location, and price are required');
      return false;
    }
    if (formData.price <= 0) {
      setError('Price must be a positive number');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!validateForm()) return;

    setSaving(true);
    try {
      const propertyData = {
        ...formData,
        price: Number(formData.price),
        bedrooms: Number(formData.bedrooms),
        bathrooms: Number(formData.bathrooms),
        images: formData.images
          ? formData.images.split(',').map((url) => url.trim())
          : [],
      };

      await API.put(`/properties/${id}`, propertyData);
      setSuccess('Property updated successfully!');
      setTimeout(() => navigate('/dashboard'), 2000);
    } catch (err) {
      // Demo mode
      setSuccess('Property updated successfully! (Demo Mode)');
      setTimeout(() => navigate('/dashboard'), 2000);
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="loading">Loading property data...</div>;

  return (
    <div className="create-property-page">
      <div className="create-property-card">
        <h2>✏️ Edit Property</h2>
        {error && <div className="error-message">{error}</div>}
        {success && <div className="success-message">{success}</div>}
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Title *</label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="e.g. Modern Downtown Apartment"
              required
            />
          </div>
          <div className="form-group">
            <label>Description</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Describe your property..."
              rows="4"
            />
          </div>
          <div className="form-group">
            <label>Location *</label>
            <input
              type="text"
              name="location"
              value={formData.location}
              onChange={handleChange}
              placeholder="e.g. New York, NY"
              required
            />
          </div>
          <div className="form-row">
            <div className="form-group">
              <label>Price ($/month) *</label>
              <input
                type="number"
                name="price"
                value={formData.price}
                onChange={handleChange}
                placeholder="e.g. 2500"
                required
              />
            </div>
            <div className="form-group">
              <label>Property Type</label>
              <select
                name="propertyType"
                value={formData.propertyType}
                onChange={handleChange}
              >
                <option value="apartment">Apartment</option>
                <option value="house">House</option>
                <option value="condo">Condo</option>
                <option value="studio">Studio</option>
              </select>
            </div>
          </div>
          <div className="form-row">
            <div className="form-group">
              <label>Bedrooms</label>
              <input
                type="number"
                name="bedrooms"
                value={formData.bedrooms}
                onChange={handleChange}
                placeholder="e.g. 2"
              />
            </div>
            <div className="form-group">
              <label>Bathrooms</label>
              <input
                type="number"
                name="bathrooms"
                value={formData.bathrooms}
                onChange={handleChange}
                placeholder="e.g. 1"
              />
            </div>
          </div>
          <div className="form-group">
            <label>Image URLs (comma separated)</label>
            <input
              type="text"
              name="images"
              value={formData.images}
              onChange={handleChange}
              placeholder="e.g. https://image1.jpg, https://image2.jpg"
            />
          </div>
          <div className="form-group">
            <label>🎥 Video Tour URL (optional)</label>
            <input
              type="text"
              name="videoUrl"
              value={formData.videoUrl}
              onChange={handleChange}
              placeholder="e.g. https://youtube.com/embed/... or https://video.mp4"
            />
          </div>
          <div className="form-buttons">
            <button type="submit" disabled={saving}>
              {saving ? 'Saving...' : 'Save Changes'}
            </button>
            <button
              type="button"
              className="btn-cancel"
              onClick={() => navigate('/dashboard')}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditProperty;