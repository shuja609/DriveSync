import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-background-default text-text-primary py-16 px-6">
      <div className="container mx-auto max-w-7xl">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {/* Quick Links */}
          <div>
            <h3 className="text-xl font-semibold mb-6 text-primary-light">Quick Links</h3>
            <ul className="space-y-3">
              <li>
                <Link 
                  to="/" 
                  className="text-text-primary opacity-80 hover:opacity-100 hover:text-secondary-light transition-colors"
                >
                  Home
                </Link>
              </li>
              <li>
                <Link 
                  to="/about" 
                  className="text-text-primary opacity-80 hover:opacity-100 hover:text-secondary-light transition-colors"
                >
                  About
                </Link>
              </li>
              <li>
                <Link 
                  to="/features" 
                  className="text-text-primary opacity-80 hover:opacity-100 hover:text-secondary-light transition-colors"
                >
                  Features
                </Link>
              </li>
              <li>
                <Link 
                  to="/contact" 
                  className="text-text-primary opacity-80 hover:opacity-100 hover:text-secondary-light transition-colors"
                >
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Social Links */}
          <div>
            <h3 className="text-xl font-semibold mb-6 text-primary-light">Connect With Us</h3>
            <div className="flex space-x-6">
              <a 
                href="https://twitter.com/drivesync" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-text-primary opacity-80 hover:opacity-100 hover:text-secondary-light transition-colors"
              >
                Twitter
              </a>
              <a 
                href="https://facebook.com/drivesync"
                target="_blank"
                rel="noopener noreferrer"
                className="text-text-primary opacity-80 hover:opacity-100 hover:text-secondary-light transition-colors"
              >
                Facebook
              </a>
              <a 
                href="https://linkedin.com/company/drivesync"
                target="_blank"
                rel="noopener noreferrer"
                className="text-text-primary opacity-80 hover:opacity-100 hover:text-secondary-light transition-colors"
              >
                LinkedIn
              </a>
            </div>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-xl font-semibold mb-6 text-primary-light">Contact Info</h3>
            <address className="not-italic space-y-3">
              <p>
                Email: 
                <a 
                  href="mailto:contact@drivesync.com" 
                  className="ml-2 text-text-primary opacity-80 hover:opacity-100 hover:text-secondary-light transition-colors"
                >
                  contact@drivesync.com
                </a>
              </p>
              <p>
                Phone: 
                <a 
                  href="tel:+1234567890" 
                  className="ml-2 text-text-primary opacity-80 hover:opacity-100 hover:text-secondary-light transition-colors"
                >
                  (123) 456-7890
                </a>
              </p>
            </address>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-background-light text-center">
          <p className="text-text-primary opacity-60">
            &copy; {new Date().getFullYear()} DriveSync. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer; 