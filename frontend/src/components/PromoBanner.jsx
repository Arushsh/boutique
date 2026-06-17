import React from 'react';
import { useNavigate } from 'react-router-dom';
import './PromoBanner.css';

const PromoBanner = ({ headline, subheadline, ctaText, image, reverse = false }) => {
  const navigate = useNavigate();
  return (
    <section className="promo-banner container">
      <div className={`promo-container ${reverse ? 'reverse' : ''}`}>
        <div className="promo-content">
          <p className="promo-subheadline">{subheadline}</p>
          <h2 className="promo-headline">{headline}</h2>
          <button className="promo-cta" onClick={() => navigate('/collections')}>
            {ctaText} <span className="arrow-icon">›</span>
          </button>
        </div>
        
        <div className="promo-image-wrapper">
          <div className="promo-image-circle">
            <img src={image} alt="Promotional Banner" />
            <div className="reaction-widget">
              👍 😲 ❤️
            </div>
          </div>
          <div className="bg-circles">
            <div className="bg-circle c1"></div>
            <div className="bg-circle c2"></div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PromoBanner;
