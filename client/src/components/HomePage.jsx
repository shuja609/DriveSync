import React from 'react';
import Header from './layout/Header/Header';
import Hero from './sections/Hero/Hero';
import Features from './sections/Features/Features';
import Showcase from './sections/Showcase/Showcase';
import Testimonials from './sections/Testimonials/Testimonials';
import Contact from './sections/Contact/Contact';
import Footer from './layout/Footer/Footer';
import './HomePage.css';

const HomePage = () => {
  return (
    <div className="App">
      <Header />
      <main>
        <Hero />
        <Features />
        <Showcase />
        <Testimonials />
        <Contact />
      </main>
      <Footer />
    </div>
  );
};

export default HomePage; 