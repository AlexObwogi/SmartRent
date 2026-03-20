import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

const featuredProperties = [
  {
    _id: '1',
    title: 'Modern Apartment in Westlands',
    location: 'Westlands, Nairobi',
    price: 55000,
    propertyType: 'Apartment',
    bedrooms: 2,
    images: ['https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=400'],
  },
  {
    _id: '3',
    title: 'Luxury Apartment in Kilimani',
    location: 'Kilimani, Nairobi',
    price: 85000,
    propertyType: 'Apartment',
    bedrooms: 3,
    images: ['https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=400'],
  },
  {
    _id: '6',
    title: 'Cozy Cottage in Kutus',
    location: 'Kutus, Kirinyaga',
    price: 12000,
    propertyType: 'House',
    bedrooms: 2,
    images: ['https://images.unsplash.com/photo-1499793983690-e29da59ef1c2?w=400'],
  },
];

const Home = () => {
  const navigate = useNavigate();

  return (
    <div className="home-container">

      {/* ── HERO ── */}
      <div className="hero-section">
        <div className="hero-content">
          <h1>Find Your Perfect Home with <span className="hero-brand">SmartRent</span></h1>
          <p className="hero-subtitle">
            AI-powered rental platform connecting tenants with verified landlords.
            Search smarter, move faster.
          </p>
          <div className="hero-buttons">
            <Link to="/properties" className="btn btn-primary btn-lg">
              🔍 Browse Properties
            </Link>
            <Link to="/register" className="btn btn-secondary btn-lg">
              Get Started Free
            </Link>
          </div>
          <div className="hero-stats">
            <div className="hero-stat"><strong>500+</strong><span>Listings</span></div>
            <div className="hero-stat"><strong>200+</strong><span>Landlords</span></div>
            <div className="hero-stat"><strong>1,000+</strong><span>Happy Tenants</span></div>
          </div>
        </div>
      </div>

      {/* ── HOW IT WORKS ── */}
      <section className="how-it-works">
        <h2>How SmartRent Works</h2>
        <p className="section-subtitle">Three simple steps to find your next home</p>
        <div className="steps-grid">
          <div className="step-card">
            <div className="step-number">1</div>
            <h3>🔍 Search & Filter</h3>
            <p>Use our smart search to filter by location, price, property type, and number of bedrooms.</p>
          </div>
          <div className="step-card">
            <div className="step-number">2</div>
            <h3>🏠 View Properties</h3>
            <p>Browse detailed listings with photos, amenities, landlord info, and tenant reviews.</p>
          </div>
          <div className="step-card">
            <div className="step-number">3</div>
            <h3>📨 Apply Online</h3>
            <p>Submit your rental application directly through the platform. No brokers, no hassle.</p>
          </div>
        </div>
      </section>

      {/* ── FEATURED PROPERTIES ── */}
      <section className="featured-section">
        <div className="featured-header">
          <h2>Featured Properties</h2>
          <Link to="/properties" className="view-all-link">View All →</Link>
        </div>
        <div className="featured-grid">
          {featuredProperties.map((property) => (
            <div
              key={property._id}
              className="featured-card"
              onClick={() => navigate(`/property/${property._id}`)}
            >
              <div className="featured-img-wrap">
                <img src={property.images[0]} alt={property.title} />
                <span className="featured-type-badge">{property.propertyType}</span>
              </div>
              <div className="featured-info">
                <h3>{property.title}</h3>
                <p className="featured-location">📍 {property.location}</p>
                <div className="featured-meta">
                  <span>🛏 {property.bedrooms} Beds</span>
                  <span className="featured-price">KES {property.price?.toLocaleString()}<small>/mo</small></span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── FEATURES ── */}
      <section className="features-section">
        <h2>Why Choose SmartRent?</h2>
        <div className="features-grid">
          <div className="feature-card">
            <div className="feature-icon">🤖</div>
            <h3>AI-Powered</h3>
            <p>Smart recommendations that match your budget, location, and lifestyle preferences.</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">🔍</div>
            <h3>Advanced Filters</h3>
            <p>Filter by property type, bedrooms, price range, and location all at once.</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">⭐</div>
            <h3>Verified Reviews</h3>
            <p>Read real tenant reviews before making your decision.</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">🏡</div>
            <h3>Landlord Tools</h3>
            <p>Manage listings, track applications, and communicate with tenants — all in one place.</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">❤️</div>
            <h3>Save Favourites</h3>
            <p>Save properties you love and come back to compare them later.</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">🔒</div>
            <h3>Secure Platform</h3>
            <p>Your data and applications are safe with our secure, authenticated platform.</p>
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="cta-section">
        <h2>Ready to Find Your New Home?</h2>
        <p>Join thousands of tenants and landlords on SmartRent today.</p>
        <div className="cta-buttons">
          <Link to="/register" className="btn btn-primary btn-lg">Sign Up Free</Link>
          <Link to="/properties" className="btn btn-outline btn-lg">Browse Listings</Link>
        </div>
      </section>

    </div>
  );
};

export default Home;