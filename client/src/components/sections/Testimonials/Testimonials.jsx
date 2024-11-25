import React from 'react';
import './Testimonials.css';

const Testimonials = () => {
  const testimonials = [
    {
      id: 1,
      name: 'John Doe',
      feedback: 'DriveSync has transformed the way we manage our showroom. The analytics and customer management features are top-notch!',
      image: '/images/testimonials/john-doe.jpg'
    },
    {
      id: 2,
      name: 'Jane Smith',
      feedback: 'The best car showroom management system we have ever used. Highly recommend DriveSync for its ease of use and powerful features.',
      image: '/images/testimonials/jane-smith.jpg'
    },
    {
      id: 3,
      name: 'Michael Brown',
      feedback: 'Our sales have increased significantly since we started using DriveSync. The team loves the intuitive interface and robust features.',
      image: '/images/testimonials/michael-brown.jpg'
    }
  ];

  return (
    <section className="testimonials">
      <div className="container">
        <h2>What Our Clients Say</h2>
        <div className="testimonials__grid">
          {testimonials.map(testimonial => (
            <div key={testimonial.id} className="testimonial-card">
              <img src={testimonial.image} alt={testimonial.name} className="testimonial-card__image" />
              <p className="testimonial-card__feedback">"{testimonial.feedback}"</p>
              <h3 className="testimonial-card__name">- {testimonial.name}</h3>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials; 