import React from 'react';
import { Link } from 'react-router-dom';

const NotFound = () => {
  return (
    <div className="not-found-page">
      <div className="not-found-content">
        <h1 className="not-found-code">404</h1>
        <h2>Page Not Found</h2>
        <p>The page you're looking for doesn't exist or has been moved.</p>
        <div className="not-found-buttons">
          <Link to="/" className="btn btn-primary">🏠 Go Home</Link>
          <Link to="/properties" className="btn btn-secondary">Browse Properties</Link>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
