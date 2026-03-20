import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getSavedProperties } from '../services/savedService';
import DarkModeToggle from './DarkModeToggle';

const Header = () => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user'));
  const savedCount = getSavedProperties().length;

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  return (
    <header className="header">
      <div className="header-container">
        <Link to="/" className="logo">
          🏠 SmartRent
        </Link>
        <nav className="nav-links">
          <Link to="/properties">Properties</Link>
          {user ? (
            <>
              {user.role === 'landlord' && (
                <>
                  <Link to="/dashboard">Dashboard</Link>
                  <Link to="/create-property">Add Property</Link>
                </>
              )}
              {user.role === 'tenant' && (
                <Link to="/my-applications">My Applications</Link>
              )}
              <Link to="/saved" className="saved-link">
                ❤️ Saved
                {savedCount > 0 && (
                  <span className="saved-count-badge">{savedCount}</span>
                )}
              </Link>
              <Link to="/profile" className="profile-link">
                👤 {user.name}
              </Link>
              <DarkModeToggle />
              <button onClick={handleLogout} className="logout-btn">
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login">Login</Link>
              <Link to="/register">Register</Link>
              <DarkModeToggle />
            </>
          )}
        </nav>
      </div>
    </header>
  );
};

export default Header;