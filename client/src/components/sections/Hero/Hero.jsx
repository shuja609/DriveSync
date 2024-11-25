import React from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../../common/Button';
import './Hero.css';

const Hero = () => {
  const navigate = useNavigate();

  return (
    <section className="hero">
      <div className="hero__content">
        <h1>Drive Your Dreams with Us</h1>
        <p>Experience luxury and performance in our premium car showroom</p>
        <div className="hero__buttons">
          <Button 
            variant="primary"
            onClick={() => navigate('/showroom')}
          >
            Explore Showroom
          </Button>
          <Button 
            variant="outline"
            onClick={() => navigate('/contact')}
          >
            Contact Sales
          </Button>
        </div>
      </div>
    </section>
  );
};

export default Hero; 