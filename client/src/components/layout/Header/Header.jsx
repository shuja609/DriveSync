import React from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../../common/Button';
import './Header.css';

const Header = () => {
  const navigate = useNavigate();

  return (
    <header className="header">
      <div className="header__container">
        <div className="header__logo">
          <i className="fas fa-car-side"></i>
          <h1>DriveSync</h1>
        </div>
        
        <nav className="header__nav">
          <Button 
            variant="outline"
            onClick={() => navigate('/login')}
          >
            Login
          </Button>
          <Button 
            variant="primary"
            onClick={() => navigate('/register')}
          >
            Register
          </Button>
        </nav>
      </div>
    </header>
  );
};

export default Header; 