import React from 'react';
import './Features.css';

const Features = () => {
  const features = [
    {
      icon: 'fa-car',
      title: 'Browse Cars',
      description: 'Explore our extensive collection of premium vehicles'
    },
    {
      icon: 'fa-calendar-check',
      title: 'Manage Bookings',
      description: 'Efficiently handle test drives and appointments'
    },
    {
      icon: 'fa-chart-line',
      title: 'Showroom Analytics',
      description: 'Track performance and inventory in real-time'
    }
  ];

  return (
    <section className="features">
      <h2>Why Choose DriveSync</h2>
      <div className="features__grid">
        {features.map((feature, index) => (
          <div key={index} className="feature-card">
            <i className={`fas ${feature.icon}`}></i>
            <h3>{feature.title}</h3>
            <p>{feature.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Features; 