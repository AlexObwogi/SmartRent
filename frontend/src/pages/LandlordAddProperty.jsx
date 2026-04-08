import React, { useState } from 'react';
import { useDropzone } from 'react-dropzone';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const LandlordAddProperty = () => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
    location: '',
    bedrooms: '',
    bathrooms: '',
    amenities: []
  });
  const [images, setImages] = useState([]);
  const [uploading, setUploading] = useState(false);
  const navigate = useNavigate();

  const { getRootProps, getInputProps } = useDropzone({
    accept: { 'image/*': [] },
    onDrop: (acceptedFiles) => {
      setImages(prev => [...prev, ...acceptedFiles]);
    }
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setUploading(true);
    
    const token = localStorage.getItem('token');
    const formDataObj = new FormData();
    
    // Add images
    images.forEach(image => {
      formDataObj.append('images', image);
    });
    
    // Add property data
    formDataObj.append('data', JSON.stringify(formData));
    
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/properties`,
        formDataObj,
        { headers: { 'Content-Type': 'multipart/form-data', Authorization: `Bearer ${token}` } }
      );
      
      navigate(`/properties/${response.data._id}`);
    } catch (error) {
      console.error('Upload error:', error);
      alert('Failed to add property');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Add New Property</h1>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          placeholder="Property Title"
          className="w-full p-2 border rounded"
          value={formData.title}
          onChange={(e) => setFormData({...formData, title: e.target.value})}
          required
        />
        
        <textarea
          placeholder="Description"
          className="w-full p-2 border rounded"
          rows="4"
          value={formData.description}
          onChange={(e) => setFormData({...formData, description: e.target.value})}
          required
        />
        
        <input
          type="number"
          placeholder="Price (KES)"
          className="w-full p-2 border rounded"
          value={formData.price}
          onChange={(e) => setFormData({...formData, price: e.target.value})}
          required
        />
        
        <input
          type="text"
          placeholder="Location"
          className="w-full p-2 border rounded"
          value={formData.location}
          onChange={(e) => setFormData({...formData, location: e.target.value})}
          required
        />
        
        <div className="grid grid-cols-2 gap-4">
          <input
            type="number"
            placeholder="Bedrooms"
            className="w-full p-2 border rounded"
            value={formData.bedrooms}
            onChange={(e) => setFormData({...formData, bedrooms: e.target.value})}
            required
          />
          <input
            type="number"
            placeholder="Bathrooms"
            className="w-full p-2 border rounded"
            value={formData.bathrooms}
            onChange={(e) => setFormData({...formData, bathrooms: e.target.value})}
            required
          />
        </div>
        
        {/* Image Upload */}
        <div {...getRootProps()} className="border-2 border-dashed rounded p-4 text-center cursor-pointer">
          <input {...getInputProps()} />
          <p>Drag & drop images here, or click to select</p>
          <p className="text-sm text-gray-500">(Max 10 images)</p>
        </div>
        
        {images.length > 0 && (
          <div className="grid grid-cols-3 gap-2">
            {images.map((img, idx) => (
              <img key={idx} src={URL.createObjectURL(img)} alt="preview" className="h-20 w-full object-cover rounded" />
            ))}
          </div>
        )}
        
        <button
          type="submit"
          disabled={uploading}
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
        >
          {uploading ? 'Uploading...' : 'Add Property'}
        </button>
      </form>
    </div>
  );
};

export default LandlordAddProperty;