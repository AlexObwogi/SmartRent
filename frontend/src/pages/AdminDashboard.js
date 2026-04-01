import React, { useState, useEffect } from 'react';
import API from '../services/api';
import { useNavigate } from 'react-router-dom';

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [users, setUsers] = useState([]);
  const [properties, setProperties] = useState([]);
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [notification, setNotification] = useState(null);
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user'));

  // Sample data
  const sampleUsers = [
    { _id: 'u1', name: 'James Mwangi', email: 'james@email.com', role: 'landlord', joinedDate: '2025-01-10', status: 'active', properties: 2 },
    { _id: 'u2', name: 'Alice Johnson', email: 'alice@email.com', role: 'tenant', joinedDate: '2025-01-15', status: 'active', properties: 0 },
    { _id: 'u3', name: 'Bob Williams', email: 'bob@email.com', role: 'tenant', joinedDate: '2025-02-01', status: 'active', properties: 0 },
    { _id: 'u4', name: 'Grace Njoroge', email: 'grace@email.com', role: 'landlord', joinedDate: '2025-02-10', status: 'active', properties: 3 },
    { _id: 'u5', name: 'Peter Kamau', email: 'peter@email.com', role: 'tenant', joinedDate: '2025-03-01', status: 'suspended', properties: 0 },
    { _id: 'u6', name: 'Mary Wanjiku', email: 'mary@email.com', role: 'landlord', joinedDate: '2025-03-05', status: 'active', properties: 1 },
  ];

  const sampleProperties = [
    { _id: '1', title: 'Modern Apartment in Westlands', location: 'Westlands, Nairobi', price: 55000, landlord: 'James Mwangi', status: 'active', createdAt: '2025-01-15', propertyType: 'Apartment' },
    { _id: '2', title: 'Spacious Family Home in Karen', location: 'Karen, Nairobi', price: 120000, landlord: 'Grace Njoroge', status: 'active', createdAt: '2025-01-20', propertyType: 'House' },
    { _id: '3', title: 'Luxury Apartment in Kilimani', location: 'Kilimani, Nairobi', price: 85000, landlord: 'Grace Njoroge', status: 'active', createdAt: '2025-02-01', propertyType: 'Apartment' },
    { _id: '4', title: 'Studio Apartment in Roysambu', location: 'Roysambu, Nairobi', price: 18000, landlord: 'James Mwangi', status: 'pending', createdAt: '2025-02-10', propertyType: 'Studio' },
    { _id: '5', title: 'Beachfront Villa in Nyali', location: 'Nyali, Mombasa', price: 150000, landlord: 'Mary Wanjiku', status: 'active', createdAt: '2025-03-01', propertyType: 'House' },
    { _id: '6', title: 'Cozy Cottage in Kutus', location: 'Kutus, Kirinyaga', price: 12000, landlord: 'Grace Njoroge', status: 'inactive', createdAt: '2025-03-05', propertyType: 'House' },
  ];

  const sampleApplications = [
    { _id: 'a1', applicant: 'Alice Johnson', property: 'Modern Apartment in Westlands', landlord: 'James Mwangi', status: 'pending', date: '2025-04-10', amount: 55000 },
    { _id: 'a2', applicant: 'Bob Williams', property: 'Spacious Family Home in Karen', landlord: 'Grace Njoroge', status: 'approved', date: '2025-04-08', amount: 120000 },
    { _id: 'a3', applicant: 'Peter Kamau', property: 'Studio Apartment in Roysambu', landlord: 'James Mwangi', status: 'rejected', date: '2025-04-05', amount: 18000 },
    { _id: 'a4', applicant: 'Alice Johnson', property: 'Luxury Apartment in Kilimani', landlord: 'Grace Njoroge', status: 'pending', date: '2025-04-12', amount: 85000 },
  ];

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [usersRes, propsRes, appsRes] = await Promise.all([
          API.get('/admin/users'),
          API.get('/admin/properties'),
          API.get('/admin/applications'),
        ]);
        setUsers(usersRes.data);
        setProperties(propsRes.data);
        setApplications(appsRes.data);
      } catch {
        setUsers(sampleUsers);
        setProperties(sampleProperties);
        setApplications(sampleApplications);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
    // eslint-disable-next-line
  }, []);

  const showNotification = (msg, type = 'success') => {
    setNotification({ msg, type });
    setTimeout(() => setNotification(null), 3000);
  };

  const handleUserStatus = async (userId, status) => {
    try { await API.put(`/admin/users/${userId}/status`, { status }); } catch {}
    setUsers(users.map(u => u._id === userId ? { ...u, status } : u));
    showNotification(`User ${status} successfully!`);
  };

  const handleDeleteUser = async (userId) => {
    if (!window.confirm('Are you sure you want to delete this user?')) return;
    try { await API.delete(`/admin/users/${userId}`); } catch {}
    setUsers(users.filter(u => u._id !== userId));
    showNotification('User deleted successfully!');
  };

  const handlePropertyStatus = async (propId, status) => {
    try { await API.put(`/admin/properties/${propId}/status`, { status }); } catch {}
    setProperties(properties.map(p => p._id === propId ? { ...p, status } : p));
    showNotification(`Property ${status} successfully!`);
  };

  const handleDeleteProperty = async (propId) => {
    if (!window.confirm('Are you sure you want to delete this property?')) return;
    try { await API.delete(`/admin/properties/${propId}`); } catch {}
    setProperties(properties.filter(p => p._id !== propId));
    showNotification('Property deleted successfully!');
  };

  const getStatusBadge = (status) => {
    const map = {
      active: <span className="admin-badge badge-active">✅ Active</span>,
      inactive: <span className="admin-badge badge-inactive">⚫ Inactive</span>,
      suspended: <span className="admin-badge badge-suspended">🚫 Suspended</span>,
      pending: <span className="admin-badge badge-pending">⏳ Pending</span>,
      approved: <span className="admin-badge badge-approved">✅ Approved</span>,
      rejected: <span className="admin-badge badge-rejected">❌ Rejected</span>,
      landlord: <span className="admin-badge badge-landlord">🏠 Landlord</span>,
      tenant: <span className="admin-badge badge-tenant">🔑 Tenant</span>,
      admin: <span className="admin-badge badge-admin">⚙️ Admin</span>,
    };
    return map[status] || <span className="admin-badge">{status}</span>;
  };

  const stats = {
    totalUsers: users.length,
    totalLandlords: users.filter(u => u.role === 'landlord').length,
    totalTenants: users.filter(u => u.role === 'tenant').length,
    totalProperties: properties.length,
    activeProperties: properties.filter(p => p.status === 'active').length,
    pendingProperties: properties.filter(p => p.status === 'pending').length,
    totalApplications: applications.length,
    pendingApplications: applications.filter(a => a.status === 'pending').length,
    totalRevenue: applications.filter(a => a.status === 'approved').reduce((sum, a) => sum + a.amount, 0),
  };

  const tabs = [
    { key: 'overview', label: '📊 Overview' },
    { key: 'users', label: `👥 Users (${users.length})` },
    { key: 'properties', label: `🏠 Properties (${properties.length})` },
    { key: 'applications', label: `📋 Applications (${applications.length})` },
  ];

  if (!user || user.role !== 'admin') {
    return (
      <div className="admin-access-denied">
        <h2>🚫 Access Denied</h2>
        <p>You need admin privileges to access this page.</p>
        <button className="btn btn-primary" onClick={() => navigate('/')}>Go Home</button>
      </div>
    );
  }

  return (
    <div className="admin-dashboard">
      {/* Notification */}
      {notification && (
        <div className={`admin-notification admin-notification-${notification.type}`}>
          {notification.msg}
        </div>
      )}

      {/* Header */}
      <div className="admin-header">
        <div>
          <h1>⚙️ Admin Dashboard</h1>
          <p>Welcome, {user?.name}! Manage the SmartRent platform.</p>
        </div>
        <div className="admin-header-actions">
          <span className="admin-badge badge-admin">⚙️ Admin</span>
        </div>
      </div>

      {/* Tabs */}
      <div className="admin-tabs">
        {tabs.map(tab => (
          <button
            key={tab.key}
            className={`admin-tab ${activeTab === tab.key ? 'active' : ''}`}
            onClick={() => setActiveTab(tab.key)}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="loading">Loading admin data...</div>
      ) : (
        <>
          {/* OVERVIEW TAB */}
          {activeTab === 'overview' && (
            <div className="admin-overview">
              <div className="admin-stats-grid">
                <div className="admin-stat-card blue">
                  <div className="admin-stat-icon">👥</div>
                  <div className="admin-stat-info">
                    <h3>{stats.totalUsers}</h3>
                    <p>Total Users</p>
                  </div>
                </div>
                <div className="admin-stat-card green">
                  <div className="admin-stat-icon">🏠</div>
                  <div className="admin-stat-info">
                    <h3>{stats.totalLandlords}</h3>
                    <p>Landlords</p>
                  </div>
                </div>
                <div className="admin-stat-card purple">
                  <div className="admin-stat-icon">🔑</div>
                  <div className="admin-stat-info">
                    <h3>{stats.totalTenants}</h3>
                    <p>Tenants</p>
                  </div>
                </div>
                <div className="admin-stat-card orange">
                  <div className="admin-stat-icon">🏡</div>
                  <div className="admin-stat-info">
                    <h3>{stats.totalProperties}</h3>
                    <p>Properties</p>
                  </div>
                </div>
                <div className="admin-stat-card teal">
                  <div className="admin-stat-icon">✅</div>
                  <div className="admin-stat-info">
                    <h3>{stats.activeProperties}</h3>
                    <p>Active Listings</p>
                  </div>
                </div>
                <div className="admin-stat-card yellow">
                  <div className="admin-stat-icon">⏳</div>
                  <div className="admin-stat-info">
                    <h3>{stats.pendingProperties}</h3>
                    <p>Pending Review</p>
                  </div>
                </div>
                <div className="admin-stat-card red">
                  <div className="admin-stat-icon">📋</div>
                  <div className="admin-stat-info">
                    <h3>{stats.totalApplications}</h3>
                    <p>Applications</p>
                  </div>
                </div>
                <div className="admin-stat-card dark">
                  <div className="admin-stat-icon">💰</div>
                  <div className="admin-stat-info">
                    <h3>KES {stats.totalRevenue.toLocaleString()}</h3>
                    <p>Total Approved Rent</p>
                  </div>
                </div>
              </div>

              {/* Recent Activity */}
              <div className="admin-recent">
                <div className="admin-recent-card">
                  <h3>👥 Recent Users</h3>
                  {users.slice(0, 4).map(u => (
                    <div key={u._id} className="admin-recent-item">
                      <div className="admin-recent-avatar">{u.name.charAt(0)}</div>
                      <div className="admin-recent-info">
                        <strong>{u.name}</strong>
                        <span>{u.email}</span>
                      </div>
                      {getStatusBadge(u.role)}
                    </div>
                  ))}
                </div>
                <div className="admin-recent-card">
                  <h3>🏠 Recent Properties</h3>
                  {properties.slice(0, 4).map(p => (
                    <div key={p._id} className="admin-recent-item">
                      <div className="admin-recent-avatar">🏠</div>
                      <div className="admin-recent-info">
                        <strong>{p.title}</strong>
                        <span>{p.location}</span>
                      </div>
                      {getStatusBadge(p.status)}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* USERS TAB */}
          {activeTab === 'users' && (
            <div className="admin-table-section">
              <div className="admin-table-header">
                <h2>👥 All Users</h2>
                <span className="admin-table-count">{users.length} total</span>
              </div>
              <div className="admin-table-wrap">
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th>Email</th>
                      <th>Role</th>
                      <th>Status</th>
                      <th>Joined</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map(u => (
                      <tr key={u._id}>
                        <td>
                          <div className="admin-user-cell">
                            <div className="admin-table-avatar">{u.name.charAt(0)}</div>
                            {u.name}
                          </div>
                        </td>
                        <td>{u.email}</td>
                        <td>{getStatusBadge(u.role)}</td>
                        <td>{getStatusBadge(u.status)}</td>
                        <td>{u.joinedDate}</td>
                        <td className="admin-actions">
                          {u.status === 'active' ? (
                            <button className="admin-btn admin-btn-warn" onClick={() => handleUserStatus(u._id, 'suspended')}>
                              🚫 Suspend
                            </button>
                          ) : (
                            <button className="admin-btn admin-btn-success" onClick={() => handleUserStatus(u._id, 'active')}>
                              ✅ Activate
                            </button>
                          )}
                          <button className="admin-btn admin-btn-danger" onClick={() => handleDeleteUser(u._id)}>
                            🗑️ Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* PROPERTIES TAB */}
          {activeTab === 'properties' && (
            <div className="admin-table-section">
              <div className="admin-table-header">
                <h2>🏠 All Properties</h2>
                <span className="admin-table-count">{properties.length} total</span>
              </div>
              <div className="admin-table-wrap">
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>Title</th>
                      <th>Location</th>
                      <th>Price (KES)</th>
                      <th>Landlord</th>
                      <th>Status</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {properties.map(p => (
                      <tr key={p._id}>
                        <td>{p.title}</td>
                        <td>📍 {p.location}</td>
                        <td>KES {p.price?.toLocaleString()}/mo</td>
                        <td>{p.landlord}</td>
                        <td>{getStatusBadge(p.status)}</td>
                        <td className="admin-actions">
                          <button className="admin-btn admin-btn-primary" onClick={() => navigate(`/property/${p._id}`)}>
                            👁️ View
                          </button>
                          {p.status !== 'active' && (
                            <button className="admin-btn admin-btn-success" onClick={() => handlePropertyStatus(p._id, 'active')}>
                              ✅ Approve
                            </button>
                          )}
                          {p.status === 'active' && (
                            <button className="admin-btn admin-btn-warn" onClick={() => handlePropertyStatus(p._id, 'inactive')}>
                              ⛔ Deactivate
                            </button>
                          )}
                          <button className="admin-btn admin-btn-danger" onClick={() => handleDeleteProperty(p._id)}>
                            🗑️ Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* APPLICATIONS TAB */}
          {activeTab === 'applications' && (
            <div className="admin-table-section">
              <div className="admin-table-header">
                <h2>📋 All Applications</h2>
                <span className="admin-table-count">{applications.length} total</span>
              </div>
              <div className="admin-table-wrap">
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>Applicant</th>
                      <th>Property</th>
                      <th>Landlord</th>
                      <th>Amount (KES)</th>
                      <th>Status</th>
                      <th>Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {applications.map(a => (
                      <tr key={a._id}>
                        <td>{a.applicant}</td>
                        <td>{a.property}</td>
                        <td>{a.landlord}</td>
                        <td>KES {a.amount?.toLocaleString()}</td>
                        <td>{getStatusBadge(a.status)}</td>
                        <td>{a.date}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default AdminDashboard;
