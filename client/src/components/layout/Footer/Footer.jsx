import React from 'react';
import './Footer.css';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer__content">
        <div className="footer__section">
          <h3>DriveSync</h3>
          <p>Your premium car showroom management solution</p>
          <div className="footer__social">
            <a href="#"><i className="fab fa-facebook"></i></a>
            <a href="#"><i className="fab fa-twitter"></i></a>
            <a href="#"><i className="fab fa-instagram"></i></a>
            <a href="#"><i className="fab fa-linkedin"></i></a>
          </div>
        </div>
        
        <div className="footer__section">
          <h4>Contact</h4>
          <p><i className="fas fa-phone"></i> +1 234 567 890</p>
          <p><i className="fas fa-envelope"></i> info@drivesync.com</p>
          <p><i className="fas fa-map-marker-alt"></i> 123 Car Street, Auto City</p>
        </div>
        
        <div className="footer__section">
          <h4>Legal</h4>
          <a href="#">Terms of Service</a>
          <a href="#">Privacy Policy</a>
          <a href="#">Cookie Policy</a>
        </div>
      </div>
      
      <div className="footer__bottom">
        <p>&copy; 2024 DriveSync. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer; 