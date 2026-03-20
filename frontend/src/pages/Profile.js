import React, { useState, useEffect } from 'react';
import API from '../services/api';
import DarkModeToggle from '../components/DarkModeToggle';

const Profile = () => {
  const [user, setUser] = useState(null);
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    bio: '',
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Get user from localStorage
    const storedUser = JSON.parse(localStorage.getItem('user'));
    if (storedUser) {
      const userData = {
        name: storedUser.name || '',
        email: storedUser.email || '',
        phone: storedUser.phone || '555-0101',
        address: storedUser.address || 'New York, NY',
        bio: storedUser.bio || 'SmartRent user looking for the perfect home.',
        role: storedUser.role || 'tenant',
        joinedDate: storedUser.joinedDate || '2024-01-15',
        avatar: storedUser.avatar || null,
      };
      setUser(userData);
      setFormData({
        name: userData.name,
        email: userData.email,
        phone: userData.phone,
        address: userData.address,
        bio: userData.bio,
      });
    }
  }, []);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      await API.put('/auth/profile', formData);
      // Update localStorage
      const updatedUser = { ...user, ...formData };
      localStorage.setItem('user', JSON.stringify(updatedUser));
      setUser(updatedUser);
      setSuccess('Profile updated successfully!');
      setEditing(false);
    } catch (err) {
      // Demo mode - still update locally
      const updatedUser = { ...user, ...formData };
      localStorage.setItem('user', JSON.stringify(updatedUser));
      setUser(updatedUser);
      setSuccess('Profile updated successfully! (Demo Mode)');
      setEditing(false);
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordChange = async () => {
    alert('Password change feature coming soon!');
  };

  if (!user) {
    return <div className="loading">Loading profile...</div>;
  }

  return (
    <div className="profile-page">
      <div className="profile-container">
        {/* Profile Header */}
        <div className="profile-header-card">
          <div className="profile-avatar">
            <div className="avatar-circle">
              {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
            </div>
          </div>
          <div className="profile-header-info">
            <h1>{user.name}</h1>
            <p className="profile-role">
              {user.role === 'landlord' ? '🏠 Landlord' : '🔑 Tenant'}
            </p>
            <p className="profile-joined">
              📅 Member since {user.joinedDate}
            </p>
          </div>
          {!editing && (
            <button
              className="btn btn-primary"
              onClick={() => setEditing(true)}
            >
              ✏️ Edit Profile
            </button>
          )}
        </div>

        {/* Messages */}
        {error && <div className="error-message">{error}</div>}
        {success && <div className="success-message">{success}</div>}

        <div className="profile-content">
          {/* Profile Info / Edit Form */}
          <div className="profile-main-card">
            {editing ? (
              <>
                <h2>Edit Your Profile</h2>
                <form onSubmit={handleSubmit}>
                  <div className="form-group">
                    <label>Full Name</label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="Your full name"
                    />
                  </div>
                  <div className="form-group">
                    <label>Email</label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="Your email"
                    />
                  </div>
                  <div className="form-group">
                    <label>Phone</label>
                    <input
                      type="text"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder="Your phone number"
                    />
                  </div>
                  <div className="form-group">
                    <label>Address</label>
                    <input
                      type="text"
                      name="address"
                      value={formData.address}
                      onChange={handleChange}
                      placeholder="Your address"
                    />
                  </div>
                  <div className="form-group">
                    <label>Bio</label>
                    <textarea
                      name="bio"
                      value={formData.bio}
                      onChange={handleChange}
                      placeholder="Tell us about yourself..."
                      rows="3"
                    />
                  </div>
                  <div className="form-buttons">
                    <button type="submit" disabled={loading}>
                      {loading ? 'Saving...' : 'Save Changes'}
                    </button>
                    <button
                      type="button"
                      className="btn-cancel"
                      onClick={() => {
                        setEditing(false);
                        setFormData({
                          name: user.name,
                          email: user.email,
                          phone: user.phone,
                          address: user.address,
                          bio: user.bio,
                        });
                      }}
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              </>
            ) : (
              <>
                <h2>Profile Information</h2>
                <div className="profile-info-grid">
                  <div className="info-item">
                    <label>Full Name</label>
                    <p>👤 {user.name}</p>
                  </div>
                  <div className="info-item">
                    <label>Email</label>
                    <p>📧 {user.email}</p>
                  </div>
                  <div className="info-item">
                    <label>Phone</label>
                    <p>📞 {user.phone}</p>
                  </div>
                  <div className="info-item">
                    <label>Address</label>
                    <p>📍 {user.address}</p>
                  </div>
                  <div className="info-item info-full">
                    <label>Bio</label>
                    <p>{user.bio}</p>
                  </div>
                </div>
              </>
            )}
          </div>

          {/* Sidebar */}
          <div className="profile-sidebar">
            <div className="profile-sidebar-card">
              <h3>Account Settings</h3>
              <button className="btn-setting" onClick={handlePasswordChange}>🔒 Change Password</button>
              <button className="btn-setting">🔔 Notification Settings</button>
              <div className="btn-setting dark-mode-setting">
                <span>🌙 Dark Mode</span>
                <DarkModeToggle />
              </div>
            </div>

            <div className="profile-sidebar-card">
              <h3>Quick Stats</h3>
              {user.role === 'landlord' ? (
                <div className="quick-stats">
                  <div className="quick-stat">
                    <span className="stat-number">2</span>
                    <span className="stat-label">Properties</span>
                  </div>
                  <div className="quick-stat">
                    <span className="stat-number">5</span>
                    <span className="stat-label">Views</span>
                  </div>
                  <div className="quick-stat">
                    <span className="stat-number">1</span>
                    <span className="stat-label">Applications</span>
                  </div>
                </div>
              ) : (
                <div className="quick-stats">
                  <div className="quick-stat">
                    <span className="stat-number">3</span>
                    <span className="stat-label">Saved</span>
                  </div>
                  <div className="quick-stat">
                    <span className="stat-number">1</span>
                    <span className="stat-label">Applied</span>
                  </div>
                  <div className="quick-stat">
                    <span className="stat-number">12</span>
                    <span className="stat-label">Viewed</span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;