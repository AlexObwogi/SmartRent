import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createProperty } from '../services/propertyService';
import API from '../services/api';

const CreateProperty = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
    address: '',
    bedrooms: '',
    bathrooms: '',
    status: 'available',
    propertyType: 'Apartment'
  });
  
  const [images, setImages] = useState([]);
  const [videos, setVideos] = useState([]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    setImages([...images, ...files]);
  };

  const handleVideoChange = (e) => {
    const files = Array.from(e.target.files);
    setVideos([...videos, ...files]);
  };

  const removeImage = (index) => {
    setImages(images.filter((_, i) => i !== index));
  };

  const removeVideo = (index) => {
    setVideos(videos.filter((_, i) => i !== index));
  };

  const uploadMedia = async (propertyId, files) => {
    const formDataMedia = new FormData();
    files.forEach(file => {
      formDataMedia.append('files', file);
    });
    
    const token = localStorage.getItem('token');
    const response = await API.post('/media/upload/' + propertyId, formDataMedia, {
      headers: {
        'Content-Type': 'multipart/form-data',
        'Authorization': 'Bearer ' + token
      },
      onUploadProgress: (progressEvent) => {
        const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
        setUploadProgress(percentCompleted);
      }
    });
    return response.data;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    
    try {
      const propertyData = {
        ...formData,
        price: Number(formData.price),
        bedrooms: Number(formData.bedrooms),
        bathrooms: Number(formData.bathrooms),
        location: {
          type: 'Point',
          coordinates: [36.8172, -1.2864]
        }
      };
      
      const property = await createProperty(propertyData);
      
      if (images.length > 0) {
        setUploading(true);
        await uploadMedia(property._id, images);
      }
      
      if (videos.length > 0) {
        setUploading(true);
        await uploadMedia(property._id, videos);
      }
      
      setSuccess(true);
      setUploading(false);
      
      setFormData({
        title: '',
        description: '',
        price: '',
        address: '',
        bedrooms: '',
        bathrooms: '',
        status: 'available',
        propertyType: 'Apartment'
      });
      setImages([]);
      setVideos([]);
      
      setTimeout(() => {
        navigate('/my-properties');
      }, 2000);
      
    } catch (err) {
      setError(err.response?.data?.message || 'Error creating property');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', padding: '20px' }}>
      <h1>Add New Property</h1>
      
      {success && (
        <div style={{ backgroundColor: '#d4edda', color: '#155724', padding: '10px', borderRadius: '4px', marginBottom: '20px' }}>
          Property created successfully! Redirecting...
        </div>
      )}
      
      {error && (
        <div style={{ backgroundColor: '#f8d7da', color: '#721c24', padding: '10px', borderRadius: '4px', marginBottom: '20px' }}>
          {error}
        </div>
      )}
      
      {uploading && (
        <div style={{ backgroundColor: '#cce5ff', color: '#004085', padding: '10px', borderRadius: '4px', marginBottom: '20px' }}>
          Uploading media: {uploadProgress}% complete...
        </div>
      )}
      
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: '20px' }}>
          <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Title *</label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            required
            style={{ width: '100%', padding: '8px', border: '1px solid #ddd', borderRadius: '4px' }}
          />
        </div>
        
        <div style={{ marginBottom: '20px' }}>
          <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Description *</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            required
            rows="5"
            style={{ width: '100%', padding: '8px', border: '1px solid #ddd', borderRadius: '4px' }}
          />
        </div>
        
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px' }}>
          <div>
            <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Price (KES) *</label>
            <input
              type="number"
              name="price"
              value={formData.price}
              onChange={handleChange}
              required
              style={{ width: '100%', padding: '8px', border: '1px solid #ddd', borderRadius: '4px' }}
            />
          </div>
          
          <div>
            <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Property Type</label>
            <select
              name="propertyType"
              value={formData.propertyType}
              onChange={handleChange}
              style={{ width: '100%', padding: '8px', border: '1px solid #ddd', borderRadius: '4px' }}
            >
              <option value="Apartment">Apartment</option>
              <option value="House">House</option>
              <option value="Studio">Studio</option>
              <option value="Villa">Villa</option>
              <option value="Townhouse">Townhouse</option>
            </select>
          </div>
        </div>
        
        <div style={{ marginBottom: '20px' }}>
          <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Address *</label>
          <input
            type="text"
            name="address"
            value={formData.address}
            onChange={handleChange}
            required
            style={{ width: '100%', padding: '8px', border: '1px solid #ddd', borderRadius: '4px' }}
          />
        </div>
        
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px' }}>
          <div>
            <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Bedrooms</label>
            <input
              type="number"
              name="bedrooms"
              value={formData.bedrooms}
              onChange={handleChange}
              style={{ width: '100%', padding: '8px', border: '1px solid #ddd', borderRadius: '4px' }}
            />
          </div>
          
          <div>
            <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Bathrooms</label>
            <input
              type="number"
              name="bathrooms"
              value={formData.bathrooms}
              onChange={handleChange}
              style={{ width: '100%', padding: '8px', border: '1px solid #ddd', borderRadius: '4px' }}
            />
          </div>
        </div>
        
        <div style={{ marginBottom: '20px' }}>
          <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Status</label>
          <select
            name="status"
            value={formData.status}
            onChange={handleChange}
            style={{ width: '100%', padding: '8px', border: '1px solid #ddd', borderRadius: '4px' }}
          >
            <option value="available">Available</option>
            <option value="rented">Rented</option>
            <option value="maintenance">Maintenance</option>
          </select>
        </div>
        
        <div style={{ marginBottom: '20px', border: '1px dashed #ddd', padding: '15px', borderRadius: '8px' }}>
          <label style={{ display: 'block', marginBottom: '10px', fontWeight: 'bold' }}> Property Images</label>
          <input
            type="file"
            accept="image/*"
            multiple
            onChange={handleImageChange}
            style={{ marginBottom: '10px' }}
          />
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
            {images.map((img, index) => (
              <div key={index} style={{ position: 'relative', display: 'inline-block' }}>
                <img
                  src={URL.createObjectURL(img)}
                  alt={'Preview ' + (index + 1)}
                  style={{ width: '100px', height: '100px', objectFit: 'cover', borderRadius: '4px' }}
                />
                <button
                  type="button"
                  onClick={() => removeImage(index)}
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
                    cursor: 'pointer'
                  }}
                >
                  
                </button>
              </div>
            ))}
          </div>
          <small style={{ color: '#666' }}>Supported formats: JPG, PNG, GIF (Max 10 files)</small>
        </div>
        
        <div style={{ marginBottom: '20px', border: '1px dashed #ddd', padding: '15px', borderRadius: '8px' }}>
          <label style={{ display: 'block', marginBottom: '10px', fontWeight: 'bold' }}> Property Videos / Virtual Tour</label>
          <input
            type="file"
            accept="video/*"
            multiple
            onChange={handleVideoChange}
            style={{ marginBottom: '10px' }}
          />
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
            {videos.map((video, index) => (
              <div key={index} style={{ position: 'relative', display: 'inline-block' }}>
                <video
                  src={URL.createObjectURL(video)}
                  style={{ width: '100px', height: '100px', objectFit: 'cover', borderRadius: '4px' }}
                />
                <button
                  type="button"
                  onClick={() => removeVideo(index)}
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
                    cursor: 'pointer'
                  }}
                >
                  
                </button>
              </div>
            ))}
          </div>
          <small style={{ color: '#666' }}>Supported formats: MP4, MOV, WebM (Max 10 files)</small>
        </div>
        
        <button
          type="submit"
          disabled={loading || uploading}
          style={{
            width: '100%',
            padding: '12px',
            backgroundColor: (loading || uploading) ? '#ccc' : '#4CAF50',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            fontSize: '16px',
            cursor: (loading || uploading) ? 'not-allowed' : 'pointer'
          }}
        >
          {loading ? 'Creating Property...' : uploading ? 'Uploading Media...' : 'Create Property'}
        </button>
      </form>
    </div>
  );
};

export default CreateProperty;
