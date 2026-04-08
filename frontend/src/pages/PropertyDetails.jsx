import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

const PropertyDetails = () => {
  const { id } = useParams();
  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(0);

  useEffect(() => {
    fetchProperty();
  }, [id]);

  const fetchProperty = async () => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_API_URL}/properties/${id}`);
      setProperty(response.data);
    } catch (error) {
      console.error('Error fetching property:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="text-center py-8">Loading...</div>;
  if (!property) return <div className="text-center py-8">Property not found</div>;

  return (
    <div className="container mx-auto p-4">
      {/* Image Gallery */}
      <div className="mb-6">
        <div className="bg-gray-100 rounded-lg overflow-hidden mb-2">
          {property.images?.[selectedImage] && (
            <img src={property.images[selectedImage].url} alt={property.title} className="w-full h-96 object-cover" />
          )}
        </div>
        <div className="grid grid-cols-5 gap-2">
          {property.images?.map((img, idx) => (
            <img
              key={idx}
              src={img.url}
              alt={`View ${idx + 1}`}
              className={`h-20 w-full object-cover rounded cursor-pointer ${selectedImage === idx ? 'border-2 border-blue-600' : ''}`}
              onClick={() => setSelectedImage(idx)}
            />
          ))}
        </div>
      </div>

      {/* Videos */}
      {property.videos?.length > 0 && (
        <div className="mb-6">
          <h2 className="text-2xl font-bold mb-3">Property Tour</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {property.videos.map((video, idx) => (
              <video key={idx} controls className="w-full rounded shadow">
                <source src={video.url} type="video/mp4" />
              </video>
            ))}
          </div>
        </div>
      )}

      {/* Property Info */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2">
          <h1 className="text-3xl font-bold mb-2">{property.title}</h1>
          <p className="text-gray-600 mb-4">📍 {property.location}</p>
          <p className="text-gray-700 mb-6">{property.description}</p>
          
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="bg-gray-50 p-3 rounded">
              <span className="text-gray-500">Bedrooms</span>
              <p className="text-xl font-bold">{property.bedrooms}</p>
            </div>
            <div className="bg-gray-50 p-3 rounded">
              <span className="text-gray-500">Bathrooms</span>
              <p className="text-xl font-bold">{property.bathrooms}</p>
            </div>
          </div>

          {property.amenities?.length > 0 && (
            <div>
              <h3 className="font-bold mb-2">Amenities</h3>
              <div className="flex flex-wrap gap-2">
                {property.amenities.map((amenity, idx) => (
                  <span key={idx} className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">
                    {amenity}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="md:col-span-1">
          <div className="bg-white rounded-lg shadow p-6 sticky top-4">
            <p className="text-3xl font-bold text-green-600 mb-4">
              KSh {property.price.toLocaleString()}/month
            </p>
            <button className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 mb-3">
              Contact Landlord
            </button>
            <button className="w-full border border-blue-600 text-blue-600 py-3 rounded-lg hover:bg-blue-50">
              Schedule Viewing
            </button>
            
            <div className="mt-4 pt-4 border-t">
              <p className="text-sm text-gray-500">Listed by: {property.landlordId?.fullName}</p>
              <p className="text-sm text-gray-500">📧 {property.landlordId?.email}</p>
              <p className="text-sm text-gray-500">👁️ {property.views} views</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PropertyDetails;