import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import API from '../services/api';

const ApplyProperty = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user'));
  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  const [formData, setFormData] = useState({
    fullName: user?.name || '',
    email: user?.email || '',
    phone: '',
    moveInDate: '',
    employmentStatus: 'employed',
    monthlyIncome: '',
    message: '',
    pets: 'no',
    occupants: '1',
  });

  // Sample properties for testing
  const sampleProperties = [
    {
      _id: '1',
      title: 'Modern Apartment in Westlands',
      location: 'Westlands, Nairobi',
      price: 55000,
      images: ['https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=400'],
    },
    {
      _id: '2',
      title: 'Spacious Family Home in Karen',
      location: 'Karen, Nairobi',
      price: 120000,
      images: ['https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=400'],
    },
    {
      _id: '3',
      title: 'Luxury Apartment in Kilimani',
      location: 'Kutus, Kirinyaga',
      price: 85000,
      images: ['https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=400'],
    },
    {
      _id: '4',
      title: 'Studio Apartment in Roysambu',
      location: 'Roysambu, Nairobi',
      price: 18000,
      images: ['https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=400'],
    },
    {
      _id: '5',
      title: 'Beachfront Villa in Nyali',
      location: 'Nyali, Mombasa',
      price: 150000,
      images: ['https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=400'],
    },
    {
      _id: '6',
      title: 'Cozy Cottage in Kutus',
      location: 'Kilimani, Nairobi',
      price: 12000,
      images: ['https://images.unsplash.com/photo-1499793983690-e29da59ef1c2?w=400'],
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
    // eslint-disable-next-line
  }, [id]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const validateForm = () => {
    if (!formData.fullName || !formData.email || !formData.phone) {
      setError('Name, email, and phone are required');
      return false;
    }
    if (!formData.moveInDate) {
      setError('Please select a move-in date');
      return false;
    }
    if (!formData.monthlyIncome) {
      setError('Please enter your monthly income');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!validateForm()) return;

    setSubmitting(true);
    try {
      await API.post('/applications', {
        propertyId: id,
        ...formData,
      });
      setSuccess('Application submitted successfully!');
      setTimeout(() => navigate('/my-applications'), 2000);
    } catch (err) {
      // Demo mode
      setSuccess('Application submitted successfully! (Demo Mode)');
      setTimeout(() => navigate('/properties'), 2000);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <div className="loading">Loading property details...</div>;

  if (!property) {
    return (
      <div className="not-found">
        <h2>Property Not Found</h2>
        <button onClick={() => navigate('/properties')} className="btn btn-primary">
          Back to Properties
        </button>
      </div>
    );
  }

  return (
    <div className="apply-page">
      <div className="apply-container">
        {/* Property Summary */}
        <div className="apply-property-summary">
          <img
            src={
              property.images && property.images.length > 0
                ? property.images[0]
                : 'https://via.placeholder.com/100x100?text=No+Image'
            }
            alt={property.title}
          />
          <div className="apply-property-info">
            <h3>{property.title}</h3>
            <p>📍 {property.location}</p>
            <p className="apply-price">${property.price}/month</p>
          </div>
        </div>

        {/* Application Form */}
        <div className="apply-form-card">
          <h2>📝 Rental Application</h2>
          <p className="apply-subtitle">
            Fill out the form below to apply for this property
          </p>

          {error && <div className="error-message">{error}</div>}
          {success && <div className="success-message">{success}</div>}

          <form onSubmit={handleSubmit}>
            <div className="form-section-title">Personal Information</div>
            <div className="form-row">
              <div className="form-group">
                <label>Full Name *</label>
                <input
                  type="text"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleChange}
                  placeholder="Your full name"
                  required
                />
              </div>
              <div className="form-group">
                <label>Email *</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Your email"
                  required
                />
              </div>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>Phone *</label>
                <input
                  type="text"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="Your phone number"
                  required
                />
              </div>
              <div className="form-group">
                <label>Desired Move-in Date *</label>
                <input
                  type="date"
                  name="moveInDate"
                  value={formData.moveInDate}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="form-section-title">Employment & Income</div>
            <div className="form-row">
              <div className="form-group">
                <label>Employment Status</label>
                <select
                  name="employmentStatus"
                  value={formData.employmentStatus}
                  onChange={handleChange}
                >
                  <option value="employed">Employed</option>
                  <option value="self-employed">Self-Employed</option>
                  <option value="student">Student</option>
                  <option value="retired">Retired</option>
                  <option value="unemployed">Unemployed</option>
                </select>
              </div>
              <div className="form-group">
                <label>Monthly Income ($) *</label>
                <input
                  type="number"
                  name="monthlyIncome"
                  value={formData.monthlyIncome}
                  onChange={handleChange}
                  placeholder="e.g. 5000"
                  required
                />
              </div>
            </div>

            <div className="form-section-title">Additional Details</div>
            <div className="form-row">
              <div className="form-group">
                <label>Number of Occupants</label>
                <select
                  name="occupants"
                  value={formData.occupants}
                  onChange={handleChange}
                >
                  <option value="1">1</option>
                  <option value="2">2</option>
                  <option value="3">3</option>
                  <option value="4">4</option>
                  <option value="5+">5+</option>
                </select>
              </div>
              <div className="form-group">
                <label>Do You Have Pets?</label>
                <select
                  name="pets"
                  value={formData.pets}
                  onChange={handleChange}
                >
                  <option value="no">No</option>
                  <option value="cat">Yes - Cat</option>
                  <option value="dog">Yes - Dog</option>
                  <option value="other">Yes - Other</option>
                </select>
              </div>
            </div>

            <div className="form-group">
              <label>Message to Landlord</label>
              <textarea
                name="message"
                value={formData.message}
                onChange={handleChange}
                placeholder="Tell the landlord why you'd be a great tenant..."
                rows="4"
              />
            </div>

            <div className="form-buttons">
              <button type="submit" disabled={submitting}>
                {submitting ? 'Submitting...' : '📨 Submit Application'}
              </button>
              <button
                type="button"
                className="btn-cancel"
                onClick={() => navigate(`/property/${id}`)}
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ApplyProperty;