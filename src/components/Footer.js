import React from 'react';

const Footer = () => {
  return (
    <footer className="footer">
      <p>
        &copy; {new Date().getFullYear()} SmartRent. All rights reserved.
      </p>
    </footer>
  );
};

export default Footer;