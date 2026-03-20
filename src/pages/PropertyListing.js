import React, { useState, useEffect } from 'react';
import API from '../services/api';
import PropertyCard from '../components/PropertyCard';
import SearchFilter from '../components/SearchFilter';

const PropertyListing = () => {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filters, setFilters] = useState({
    location: '',
    minPrice: '',
    maxPrice: '',
    propertyType: '',
    bedrooms: '',
  });

  // Sample data for testing (we'll remove this when backend is ready)
  const sampleProperties = [
    {
      _id: '1',
      title: 'Modern Apartment in Westlands',
      location: 'Westlands, Nairobi',
      price: 55000,
      description: 'Beautiful modern apartment in the heart of Westlands with amazing city views, fully furnished with all amenities included. Features hardwood floors, modern kitchen and a private balcony.',
      bedrooms: 2,
      bathrooms: 1,
      propertyType: 'Apartment',
      images: ['https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=400'],
    },
    {
      _id: '2',
      title: 'Spacious Family Home in Karen',
      location: 'Karen, Nairobi',
      price: 120000,
      description: 'Spacious family house in the quiet leafy suburb of Karen with a large garden, modern kitchen and ample parking. Perfect for families seeking a serene environment.',
      bedrooms: 4,
      bathrooms: 3,
      propertyType: 'House',
      images: ['https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=400'],
    },
    {
      _id: '3',
      title: 'Luxury Apartment in Kilimani',
      location: 'Kilimani, Nairobi',
      price: 85000,
      description: 'Stunning luxury apartment in Kilimani with rooftop pool, gym and premium finishes throughout. Enjoy city views and easy access to Ngong Road shopping.',
      bedrooms: 3,
      bathrooms: 2,
      propertyType: 'Apartment',
      images: ['https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=400'],
    },
    {
      _id: '4',
      title: 'Studio Apartment in Roysambu',
      location: 'Roysambu, Nairobi',
      price: 18000,
      description: 'Affordable studio apartment perfect for students and young professionals. Close to TRM Mall and public transport. Features kitchenette and shared amenities.',
      bedrooms: 1,
      bathrooms: 1,
      propertyType: 'Studio',
      images: ['https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=400'],
    },
    {
      _id: '5',
      title: 'Beachfront Villa in Nyali',
      location: 'Nyali, Mombasa',
      price: 150000,
      description: 'Exclusive beachfront villa in Nyali with ocean views, private pool and rooftop terrace. Features designer finishes and smart home technology.',
      bedrooms: 4,
      bathrooms: 3,
      propertyType: 'House',
      images: ['https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=400'],
    },
    {
      _id: '6',
      title: 'Cozy Cottage in Kutus',
      location: 'Kutus, Kirinyaga',
      price: 12000,
      description: 'Charming cottage in Kutus town, Kirinyaga County. Close to local amenities, schools and public transport. Ideal for a small family or working professional.',
      bedrooms: 2,
      bathrooms: 1,
      propertyType: 'House',
      images: ['https://images.unsplash.com/photo-1499793983690-e29da59ef1c2?w=400'],
    },
    {
      _id: '7',
      title: 'Modern Flat in Milimani',
      location: 'Milimani, Kisumu',
      price: 30000,
      description: 'Modern flat in the upmarket Milimani area of Kisumu with lake views, spacious rooms and a secure compound with 24hr security.',
      bedrooms: 2,
      bathrooms: 1,
      propertyType: 'Apartment',
      images: ['https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=400'],
    },
    {
      _id: '8',
      title: 'Townhouse in Ruaka',
      location: 'Ruaka, Kiambu',
      price: 65000,
      description: 'Well-maintained townhouse in Ruaka with easy access to Nairobi via the Northern Bypass. Features a garden, 2 parking spaces and a backup generator.',
      bedrooms: 3,
      bathrooms: 2,
      propertyType: 'House',
      images: ['https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=400'],
    },
  ];

  const fetchProperties = async (searchFilters = {}) => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (searchFilters.location)
        params.append('location', searchFilters.location);
      if (searchFilters.minPrice)
        params.append('minPrice', searchFilters.minPrice);
      if (searchFilters.maxPrice)
        params.append('maxPrice', searchFilters.maxPrice);
      if (searchFilters.propertyType)
        params.append('propertyType', searchFilters.propertyType);
      if (searchFilters.bedrooms)
        params.append('bedrooms', searchFilters.bedrooms);

      const response = await API.get(`/properties?${params.toString()}`);
      setProperties(response.data.properties || response.data);
    } catch (err) {
      // If backend is not ready, use sample data
      console.log('Backend not available, using sample data');
      let filtered = [...sampleProperties];

      if (searchFilters.location) {
        filtered = filtered.filter((p) =>
          p.location.toLowerCase().includes(searchFilters.location.toLowerCase())
        );
      }
      if (searchFilters.minPrice) {
        filtered = filtered.filter(
          (p) => p.price >= Number(searchFilters.minPrice)
        );
      }
      if (searchFilters.maxPrice) {
        filtered = filtered.filter(
          (p) => p.price <= Number(searchFilters.maxPrice)
        );
      }
      if (searchFilters.propertyType) {
        filtered = filtered.filter(
          (p) => p.propertyType.toLowerCase() === searchFilters.propertyType.toLowerCase()
        );
      }
      if (searchFilters.bedrooms) {
        filtered = filtered.filter(
          (p) => p.bedrooms >= Number(searchFilters.bedrooms)
        );
      }

      setProperties(filtered);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProperties();
    // eslint-disable-next-line
  }, []);

  const handleSearch = (newFilters) => {
    setFilters(newFilters);
    fetchProperties(newFilters);
  };

  return (
    <div className="property-listing-page">
      <h1>Available Properties</h1>
      <SearchFilter filters={filters} onSearch={handleSearch} />
      {loading ? (
        <div className="loading">Loading properties...</div>
      ) : error ? (
        <div className="error-message">{error}</div>
      ) : (
        <div className="property-grid">
          {properties.length > 0 ? (
            properties.map((property) => (
              <PropertyCard key={property._id} property={property} />
            ))
          ) : (
            <p className="no-results">No properties found. Try different filters.</p>
          )}
        </div>
      )}
    </div>
  );
};

export default PropertyListing;