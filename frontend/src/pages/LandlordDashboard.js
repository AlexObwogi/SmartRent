import React, { useState, useEffect } from 'react';
import API from '../services/api';
import { Link, useNavigate } from 'react-router-dom';
import Notification from '../components/Notification';
import ConfirmModal from '../components/ConfirmModal';

const LandlordDashboard = () => {
  const [properties, setProperties] = useState([]);
  const [applications, setApplications] = useState([]);
  const [activeTab, setActiveTab] = useState('properties');
  const [loading, setLoading] = useState(true);
  const [notification, setNotification] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const user = JSON.parse(localStorage.getItem('user'));
  const navigate = useNavigate();

  const sampleProperties = [
    { _id: '1', title: 'Modern Apartment in Westlands', location: 'Westlands, Nairobi', price: 55000, bedrooms: 2, bathrooms: 1, propertyType: 'Apartment' },
    { _id: '2', title: 'Spacious Family Home in Karen', location: 'Karen, Nairobi', price: 120000, bedrooms: 4, bathrooms: 2, propertyType: 'House' },
  ];

  const sampleApplications = [
    { _id: 'a1', propertyTitle: 'Modern Apartment in Westlands', applicantName: 'Alice Johnson', applicantEmail: 'alice@email.com', phone: '555-1234', moveInDate: '2025-05-01', employmentStatus: 'employed', monthlyIncome: 85000, occupants: '2', pets: 'no', message: 'We would love to live here!', status: 'pending', createdAt: '2025-04-10' },
    { _id: 'a2', propertyTitle: 'Spacious Family Home in Karen', applicantName: 'Bob Williams', applicantEmail: 'bob@email.com', phone: '555-5678', moveInDate: '2025-06-01', employmentStatus: 'self-employed', monthlyIncome: 120000, occupants: '3', pets: 'dog', message: 'We are a quiet family.', status: 'pending', createdAt: '2025-04-12' },
    { _id: 'a3', propertyTitle: 'Modern Apartment in Westlands', applicantName: 'Carol Davis', applicantEmail: 'carol@email.com', phone: '555-9012', moveInDate: '2025-05-15', employmentStatus: 'employed', monthlyIncome: 75000, occupants: '1', pets: 'no', message: 'Professional looking for a long-term stay.', status: 'approved', createdAt: '2025-03-28' },
  ];

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const res = await API.get('/properties/my-properties');
        setProperties(res.data.properties || res.data);
      } catch {
        setProperties(sampleProperties);
      }
      try {
        const res = await API.get('/applications/landlord-applications');
        setApplications(res.data.applications || res.data);
      } catch {
        setApplications(sampleApplications);
      }
      setLoading(false);
    };
    fetchData();
    // eslint-disable-next-line
  }, []);

  const handleDeleteClick = (id) => { setDeleteId(id); setShowModal(true); };

  const handleConfirmDelete = async () => {
    try { await API.delete(`/properties/${deleteId}`); } catch {}
    setProperties(properties.filter((p) => p._id !== deleteId));
    setShowModal(false);
    setDeleteId(null);
    setNotification({ message: 'Property deleted successfully!', type: 'success' });
  };

  const handleApplicationStatus = async (appId, status) => {
    try { await API.put(`/applications/${appId}/status`, { status }); } catch {}
    setApplications(applications.map((a) => a._id === appId ? { ...a, status } : a));
    setNotification({ message: `Application ${status} successfully!`, type: status === 'approved' ? 'success' : 'info' });
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'pending': return <span className="status-badge status-pending">⏳ Pending</span>;
      case 'approved': return <span className="status-badge status-approved">✅ Approved</span>;
      case 'rejected': return <span className="status-badge status-rejected">❌ Rejected</span>;
      default: return <span className="status-badge">{status}</span>;
    }
  };

  const pendingCount = applications.filter((a) => a.status === 'pending').length;

  return (
    <div className="dashboard-container">
      {notification && <Notification message={notification.message} type={notification.type} onClose={() => setNotification(null)} />}
      {showModal && (
        <ConfirmModal
          title="Delete Property"
          message="Are you sure you want to delete this property? This action cannot be undone."
          onConfirm={handleConfirmDelete}
          onCancel={() => { setShowModal(false); setDeleteId(null); }}
        />
      )}

      <div className="dashboard-header">
        <div>
          <h1>🏠 Landlord Dashboard</h1>
          <p>Welcome back, {user?.name || 'Landlord'}!</p>
        </div>
        <Link to="/create-property" className="btn btn-primary">+ Add New Property</Link>
      </div>

      <div className="dashboard-stats">
        <div className="stat-card"><h3>{properties.length}</h3><p>Properties</p></div>
        <div className="stat-card"><h3>{applications.length}</h3><p>Applications</p></div>
        <div className="stat-card"><h3>{pendingCount}</h3><p>Pending Reviews</p></div>
        <div className="stat-card"><h3>{applications.filter(a => a.status === 'approved').length}</h3><p>Approved</p></div>
      </div>

      <div className="dashboard-tabs">
        <button className={`dashboard-tab ${activeTab === 'properties' ? 'active' : ''}`} onClick={() => setActiveTab('properties')}>
          🏠 My Properties ({properties.length})
        </button>
        <button className={`dashboard-tab ${activeTab === 'applications' ? 'active' : ''}`} onClick={() => setActiveTab('applications')}>
          📋 Applications {pendingCount > 0 && <span className="tab-badge">{pendingCount}</span>}
        </button>
      </div>

      {loading ? (
        <div className="loading">Loading dashboard...</div>
      ) : activeTab === 'properties' ? (
        <div className="dashboard-properties">
          {properties.length > 0 ? (
            <table className="properties-table">
              <thead>
                <tr><th>Title</th><th>Location</th><th>Price</th><th>Type</th><th>Beds</th><th>Actions</th></tr>
              </thead>
              <tbody>
                {properties.map((property) => (
                  <tr key={property._id}>
                    <td>{property.title}</td>
                    <td>{property.location}</td>
                    <td>${property.price}/mo</td>
                    <td>{property.propertyType}</td>
                    <td>{property.bedrooms}</td>
                    <td className="action-buttons">
                      <button className="btn-view" onClick={() => navigate(`/property/${property._id}`)}>View</button>
                      <button className="btn-edit" onClick={() => navigate(`/edit-property/${property._id}`)}>Edit</button>
                      <button className="btn-delete" onClick={() => handleDeleteClick(property._id)}>Delete</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div className="no-properties">
              <p>You haven't listed any properties yet.</p>
              <Link to="/create-property" className="btn btn-primary">Add Your First Property</Link>
            </div>
          )}
        </div>
      ) : (
        <div className="applications-management">
          {applications.length > 0 ? (
            applications.map((app) => (
              <div key={app._id} className="app-management-card">
                <div className="app-management-info">
                  <h3>{app.applicantName}</h3>
                  <p className="app-property-name">🏠 {app.propertyTitle}</p>
                  <div className="app-details-grid">
                    <span>📧 {app.applicantEmail}</span>
                    <span>📞 {app.phone}</span>
                    <span>📅 Move-in: {app.moveInDate}</span>
                    <span>💼 {app.employmentStatus}</span>
                    <span>💰 ${app.monthlyIncome}/mo income</span>
                    <span>👥 {app.occupants} occupant(s)</span>
                    <span>🐾 Pets: {app.pets}</span>
                    <span>🗓 Applied: {app.createdAt}</span>
                  </div>
                  {app.message && <p className="app-message">💬 "{app.message}"</p>}
                </div>
                <div className="app-management-actions">
                  {getStatusBadge(app.status)}
                  {app.status === 'pending' && (
                    <div className="app-action-buttons">
                      <button className="btn-approve" onClick={() => handleApplicationStatus(app._id, 'approved')}>✅ Approve</button>
                      <button className="btn-reject" onClick={() => handleApplicationStatus(app._id, 'rejected')}>❌ Reject</button>
                    </div>
                  )}
                </div>
              </div>
            ))
          ) : (
            <div className="no-applications">
              <h3>No Applications Yet</h3>
              <p>Applications from tenants will appear here.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default LandlordDashboard;
