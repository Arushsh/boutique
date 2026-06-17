import React from 'react';
import { useNavigate } from 'react-router-dom';
import Header from './Header';
import './Hero.css';

const Hero = () => {
  const navigate = useNavigate();
  return (
    <div className="hero-wrapper">
      <Header />
      <div className="hero-content">
        <div className="hero-text-col">
          <p className="hero-badge">New Collection Just Arrived</p>
          <h1 className="hero-title">
            Timeless Boutique Fashion For Every Occasion
          </h1>
          <p className="hero-subtitle">
            Curated designer outfits, handcrafted collections, and elegant styles designed to make every woman feel confident and beautiful.
          </p>
          
          <div className="hero-cta-group">
            <button className="btn-primary" onClick={() => navigate('/collections')}>Explore Collection</button>
            <button className="btn-secondary" onClick={() => navigate('/contact')}>Book Appointment</button>
          </div>

          <div className="hero-trust-card">
            <div className="avatars">
              <img src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=100" alt="Customer 1" />
              <img src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=100" alt="Customer 2" />
              <img src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=100" alt="Customer 3" />
            </div>
            <div className="trust-info">
              <p className="trust-title">5000+ Happy Boutique Clients</p>
              <div className="stars">
                ⭐⭐⭐⭐⭐ <span>4.9 Rating</span>
              </div>
              <p className="trust-subtitle">Verified Customer Reviews</p>
            </div>
          </div>
        </div>
        
        <div className="hero-image-col">
          <div className="hero-image-circle">
            <img 
              src="https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&q=80&w=800" 
              alt="Luxury boutique model wearing elegant designer clothing" 
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;
