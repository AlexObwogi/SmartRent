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
  const user = JSON.parse(localStorage.getItem('user'));

  const sampleProperties = [
    {
      _id: '1',
      title: 'Modern Apartment in Westlands',
      location: 'Westlands, Nairobi',
      price: 55000,
      description: 'Beautiful modern apartment in the heart of Westlands with amazing city views, fully furnished with all amenities included. Features include hardwood floors, modern kitchen, in-unit laundry and a private balcony overlooking the city skyline. Building amenities include a fitness center, rooftop deck, and 24-hour security.',
      bedrooms: 2,
      bathrooms: 1,
      propertyType: 'Apartment',
      images: [
        'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=600',
        'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=600',
        'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=600',
      ],
      landlord: { name: 'James Mwangi', email: 'james@email.com', phone: '0712 345 678' },
      amenities: ['WiFi', 'Parking', 'Gym', 'Laundry', 'Security', 'Water'],
      available: true,
      createdAt: '2025-01-15',
    },
    {
      _id: '2',
      title: 'Spacious Family Home in Karen',
      location: 'Karen, Nairobi',
      price: 120000,
      description: 'Spacious family house in the quiet leafy suburb of Karen with a large garden, modern kitchen and ample parking. This charming home features an open floor plan, updated bathrooms, a two-car garage, and a beautifully landscaped yard perfect for entertaining.',
      bedrooms: 4,
      bathrooms: 3,
      propertyType: 'House',
      images: [
        'https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=600',
        'https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=600',
      ],
      landlord: { name: 'Grace Njoroge', email: 'grace@email.com', phone: '0723 456 789' },
      amenities: ['Parking', 'Garden', 'Laundry', 'Pet Friendly', 'Security', 'Borehole'],
      available: true,
      createdAt: '2025-01-20',
    },
    {
      _id: '3',
      title: 'Luxury Apartment in Kilimani',
      location: 'Kilimani, Nairobi',
      price: 85000,
      description: 'Stunning luxury apartment in Kilimani with rooftop pool, gym and premium finishes throughout. Enjoy city views, marble countertops, floor-to-ceiling windows, and a spa-like master bathroom.',
      bedrooms: 3,
      bathrooms: 2,
      propertyType: 'Apartment',
      images: [
        'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=600',
        'https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=600',
      ],
      landlord: { name: 'Peter Kamau', email: 'peter@email.com', phone: '0734 567 890' },
      amenities: ['Pool', 'WiFi', 'Gym', 'Security', 'Rooftop', 'Backup Generator'],
      available: true,
      createdAt: '2025-02-01',
    },
    {
      _id: '4',
      title: 'Studio Apartment in Roysambu',
      location: 'Roysambu, Nairobi',
      price: 18000,
      description: 'Affordable studio apartment perfect for students and young professionals. Close to TRM Mall and public transport. Features a kitchenette, built-in closet, and shared laundry facilities.',
      bedrooms: 1,
      bathrooms: 1,
      propertyType: 'Studio',
      images: [
        'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=600',
      ],
      landlord: { name: 'Sarah Akinyi', email: 'sarah@email.com', phone: '0745 678 901' },
      amenities: ['WiFi', 'Laundry', 'Water', 'Security'],
      available: true,
      createdAt: '2025-02-10',
    },
    {
      _id: '5',
      title: 'Beachfront Villa in Nyali',
      location: 'Nyali, Mombasa',
      price: 150000,
      description: 'Exclusive beachfront villa in Nyali with ocean views, private pool and rooftop terrace. This one-of-a-kind residence features designer finishes, a gourmet kitchen, and smart home technology throughout.',
      bedrooms: 4,
      bathrooms: 3,
      propertyType: 'House',
      images: [
        'https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=600',
        'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=600',
      ],
      landlord: { name: 'Hassan Omar', email: 'hassan@email.com', phone: '0756 789 012' },
      amenities: ['Pool', 'Rooftop', 'Smart Home', 'Security', 'Parking', 'Ocean View'],
      available: true,
      createdAt: '2025-02-15',
    },
    {
      _id: '6',
      title: 'Cozy Cottage in Kutus',
      location: 'Kutus, Kirinyaga',
      price: 12000,
      description: 'Charming cottage in Kutus town, Kirinyaga County. Close to local amenities, schools and public transport. Features a wrap-around porch, updated kitchen and a small garden.',
      bedrooms: 2,
      bathrooms: 1,
      propertyType: 'House',
      images: [
        'https://images.unsplash.com/photo-1499793983690-e29da59ef1c2?w=600',
      ],
      landlord: { name: 'Mary Wanjiku', email: 'mary@email.com', phone: '0767 890 123' },
      amenities: ['Garden', 'Parking', 'Water', 'Security'],
      available: true,
      createdAt: '2025-02-20',
    },
    {
      _id: '7',
      title: 'Modern Flat in Milimani',
      location: 'Milimani, Kisumu',
      price: 30000,
      description: 'Modern flat in the upmarket Milimani area of Kisumu with lake views, spacious rooms and a secure compound with 24hr security. Close to Kisumu CBD and major amenities.',
      bedrooms: 2,
      bathrooms: 1,
      propertyType: 'Apartment',
      images: [
        'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=600',
      ],
      landlord: { name: 'David Odhiambo', email: 'david@email.com', phone: '0778 901 234' },
      amenities: ['WiFi', 'Security', 'Parking', 'Water', 'Lake View'],
      available: true,
      createdAt: '2025-03-01',
    },
    {
      _id: '8',
      title: 'Townhouse in Ruaka',
      location: 'Ruaka, Kiambu',
      price: 65000,
      description: 'Well-maintained townhouse in Ruaka with easy access to Nairobi via the Northern Bypass. Features a small garden, 2 parking spaces, backup generator and borehole water.',
      bedrooms: 3,
      bathrooms: 2,
      propertyType: 'House',
      images: [
        'https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=600',
        'https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=600',
      ],
      landlord: { name: 'John Kariuki', email: 'john@email.com', phone: '0789 012 345' },
      amenities: ['Parking', 'Garden', 'Backup Generator', 'Borehole', 'Security'],
      available: true,
      createdAt: '2025-03-05',
    },
  ];

  useEffect(() => {
    const fetchProperty = async () => {
      setLoading(true);
      try {
        const response = await API.get(`/properties/${id}`);
        setProperty(response.data);
      } catch (err) {
        const found = sampleProperties.find((p) => p._id === id);
        setProperty(found || null);
      } finally {
        setLoading(false);
      }
    };
    fetchProperty();
    setSaved(isPropertySaved(id));
    // eslint-disable-next-line
  }, [id]);

  const handleSaveToggle = () => {
    if (saved) {
      removeSavedProperty(property._id);
      setSaved(false);
    } else {
      saveProperty(property);
      setSaved(true);
    }
  };

  if (loading) return <div className="loading">Loading property details...</div>;

  if (!property) {
    return (
      <div className="not-found">
        <h2>Property Not Found</h2>
        <p>The property you're looking for doesn't exist.</p>
        <button onClick={() => navigate('/properties')} className="btn btn-primary">
          Back to Properties
        </button>
      </div>
    );
  }

  return (
    <div className="property-detail-page">
      <div className="detail-gallery">
        <div className="main-image">
          <img
            src={property.images && property.images.length > 0 ? property.images[activeImage] : 'https://via.placeholder.com/600x400?text=No+Image'}
            alt={property.title}
          />
          <button className={`detail-save-btn ${saved ? 'saved' : ''}`} onClick={handleSaveToggle}>
            {saved ? '❤️ Saved' : '🤍 Save'}
          </button>
        </div>
        {property.images && property.images.length > 1 && (
          <div className="thumbnail-row">
            {property.images.map((img, index) => (
              <img
                key={index}
                src={img}
                alt={`${property.title} ${index + 1}`}
                className={`thumbnail ${index === activeImage ? 'active-thumbnail' : ''}`}
                onClick={() => setActiveImage(index)}
              />
            ))}
          </div>
        )}
      </div>

      <div className="detail-content">
        <div className="detail-main">
          <div className="detail-header">
            <div>
              <h1>{property.title}</h1>
              <p className="detail-location">📍 {property.location}</p>
            </div>
            <div className="detail-price">
              <h2>KES {property.price?.toLocaleString()}</h2>
              <span>/month</span>
            </div>
          </div>

          <div className="detail-badges">
            <span className="badge">{property.propertyType}</span>
            <span className="badge">🛏 {property.bedrooms} Bedrooms</span>
            <span className="badge">🚿 {property.bathrooms} Bathrooms</span>
            {property.available && <span className="badge badge-available">✅ Available</span>}
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
                  <span key={index} className="amenity-tag">✓ {amenity}</span>
                ))}
              </div>
            </div>
          )}

          {/* Video Tour */}
          {property.videoUrl && (
            <div className="detail-section">
              <h3>🎥 Video Tour</h3>
              <div className="video-tour-container">
                {property.videoUrl.includes('youtube') || property.videoUrl.includes('youtu.be') ? (
                  <iframe width="100%" height="360" src={property.videoUrl} title="Property Video Tour"
                    frameBorder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen></iframe>
                ) : (
                  <video controls width="100%" style={{ borderRadius: '8px' }}>
                    <source src={property.videoUrl} />
                    Your browser does not support the video tag.
                  </video>
                )}
              </div>
            </div>
          )}

          {/* Google Maps */}
          <div className="detail-section">
            <h3>📍 Location & Navigation</h3>
            <div className="maps-container">
              <iframe
                title="Property Location"
                width="100%"
                height="300"
                style={{ border: 0, borderRadius: '8px' }}
                loading="lazy"
                src={`https://maps.google.com/maps?q=${encodeURIComponent(property.location)}&output=embed`}
              ></iframe>
              <a
                href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(property.location)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-secondary btn-full"
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
                <p>📞 {property.landlord.phone}</p>
              </div>
            )}
            {user ? (
              <>
                <button className="btn btn-primary btn-full" onClick={() => navigate(`/apply/${property._id}`)}>
                  Apply Now
                </button>
                <button
                  className={`btn btn-full ${saved ? 'btn-unsave' : 'btn-save'}`}
                  onClick={handleSaveToggle}
                  style={{ marginTop: '10px' }}
                >
                  {saved ? '❤️ Remove from Saved' : '🤍 Save Property'}
                </button>
              </>
            ) : (
              <div>
                <p className="login-prompt">Login to apply for this property</p>
                <button className="btn btn-primary btn-full" onClick={() => navigate('/login')}>
                  Login to Apply
                </button>
              </div>
            )}
          </div>
          <button className="btn btn-secondary btn-full" onClick={() => navigate('/properties')}>
            ← Back to Properties
          </button>
        </div>
      </div>

      <ReviewSection propertyId={id} />
    </div>
  );
};

export default PropertyDetail;
