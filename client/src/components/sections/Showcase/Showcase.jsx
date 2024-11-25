import React from 'react';
import './Showcase.css';

const Showcase = () => {
  const cars = [
    {
      id: 1,
      name: 'Luxury Sedan',
      image: '/images/cars/showroom-bg.jpg',
      price: '$75,000',
      category: 'Sedan'
    },
    {
      id: 2,
      name: 'Sports Car',
      image: '/images/cars/showroom-bg.jpg',
      price: '$120,000',
      category: 'Sports'
    },
    {
      id: 3,
      name: 'Electric SUV',
      image: '/images/cars/showroom-bg.jpg',
      price: '$95,000',
      category: 'SUV'
    }
  ];

  return (
    <section className="showcase">
      <div className="container">
        <h2>Featured Vehicles</h2>
        <div className="showcase__grid">
          {cars.map(car => (
            <div key={car.id} className="car-card">
              <div className="car-card__image">
                <img src={car.image} alt={car.name} />
              </div>
              <div className="car-card__content">
                <h3>{car.name}</h3>
                <p className="car-card__category">{car.category}</p>
                <p className="car-card__price">{car.price}</p>
                <button className="car-card__button">View Details</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Showcase; 