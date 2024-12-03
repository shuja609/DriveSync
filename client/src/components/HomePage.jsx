import React from 'react';
import { useAuth } from '../context/AuthContext';
import Header from './header/Header';  // Authenticated user header
import PublicHeader from './layout/Header';  // Public header for non-authenticated users
import Hero from './sections/Hero';
import Features from './sections/Features';
import Showcase from './sections/Showcase';
import Testimonials from './sections/Testimonials';
import Contact from './sections/Contact';
import Footer from './layout/Footer';
//import './HomePage.css';

const HomePage = () => {
  const { isAuthenticated } = useAuth();

  return (
    <div className="min-h-screen bg-background-dark">
      {isAuthenticated ? <Header /> : <PublicHeader />}
      
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