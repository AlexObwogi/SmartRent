import React, { useState, useEffect } from 'react';
import API from '../services/api';
import { useNavigate } from 'react-router-dom';

const MyApplications = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const sampleApplications = [
    {
      _id: '1',
      property: {
        _id: '1',
        title: 'Modern Apartment in Westlands',
        location: 'Westlands, Nairobi',
        price: 55000,
        images: ['https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=400'],
      },
      status: 'pending',
      moveInDate: '2025-05-01',
      createdAt: '2025-04-10',
    },
    {
      _id: '2',
      property: {
        _id: '3',
        title: 'Luxury Apartment in Kilimani',
        location: 'Kilimani, Nairobi',
        price: 85000,
        images: ['https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=400'],
      },
      status: 'approved',
      moveInDate: '2025-06-01',
      createdAt: '2025-04-05',
    },
    {
      _id: '3',
      property: {
        _id: '4',
        title: 'Studio Apartment in Roysambu',
        location: 'Roysambu, Nairobi',
        price: 18000,
        images: ['https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=400'],
      },
      status: 'rejected',
      moveInDate: '2025-04-15',
      createdAt: '2025-03-20',
    },
  ];

  useEffect(() => {
    const fetchApplications = async () => {
      setLoading(true);
      try {
        const response = await API.get('/applications/my-applications');
        setApplications(response.data.applications || response.data);
      } catch (err) {
        setApplications(sampleApplications);
      } finally {
        setLoading(false);
      }
    };
    fetchApplications();
    // eslint-disable-next-line
  }, []);

  const getStatusBadge = (status) => {
    switch (status) {
      case 'pending': return <span className="status-badge status-pending">⏳ Pending</span>;
      case 'approved': return <span className="status-badge status-approved">✅ Approved</span>;
      case 'rejected': return <span className="status-badge status-rejected">❌ Rejected</span>;
      default: return <span className="status-badge">{status}</span>;
    }
  };

  return (
    <div className="applications-page">
      <h1>My Applications</h1>
      <p className="page-subtitle">Track the status of your rental applications</p>

      {loading ? (
        <div className="loading">Loading applications...</div>
      ) : applications.length > 0 ? (
        <div className="applications-list">
          {applications.map((app) => (
            <div key={app._id} className="application-card">
              <div className="application-image">
                <img
                  src={app.property.images && app.property.images.length > 0 ? app.property.images[0] : 'https://via.placeholder.com/150x100?text=No+Image'}
                  alt={app.property.title}
                />
              </div>
              <div className="application-info">
                <h3>{app.property.title}</h3>
                <p>📍 {app.property.location}</p>
                <p>💰 KES {app.property.price?.toLocaleString()}/month</p>
                <p>📅 Move-in: {app.moveInDate}</p>
              </div>
              <div className="application-status">
                {getStatusBadge(app.status)}
                <p className="application-date">Applied: {app.createdAt}</p>
                <button className="btn-view-property" onClick={() => navigate(`/property/${app.property._id}`)}>
                  View Property
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="no-applications">
          <h3>No Applications Yet</h3>
          <p>You haven't applied for any properties yet.</p>
          <button className="btn btn-primary" onClick={() => navigate('/properties')}>
            Browse Properties
          </button>
        </div>
      )}
    </div>
  );
};

export default MyApplications;
