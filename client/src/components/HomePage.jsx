import React from 'react';
import Header from './layout/Header';
import Hero from './sections/Hero';
import Features from './sections/Features';
import Showcase from './sections/Showcase';
import Testimonials from './sections/Testimonials';
import Contact from './sections/Contact';
import Footer from './layout/Footer';
//import './HomePage.css';

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