import React from 'react';

const LoadingSpinner = ({ message }) => {
  return (
    <div className="spinner-container">
      <div className="spinner"></div>
      <p>{message || 'Loading...'}</p>
    </div>
  );
};

export default LoadingSpinner;