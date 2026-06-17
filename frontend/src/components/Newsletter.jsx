import React from 'react';
import './Newsletter.css';

const Newsletter = () => {
  return (
    <section className="newsletter container">
      <div className="section-header">
        <h2 className="section-title">Join Our Style Community</h2>
        <div className="section-divider">
          <span className="dot"></span>
          <span className="dot"></span>
          <span className="dot"></span>
          <span className="dot"></span>
          <span className="dot"></span>
        </div>
      </div>
      
      <p className="newsletter-desc">
        Subscribe to receive exclusive boutique launches, styling tips, seasonal collections, and special member-only offers.
      </p>
      
      <form className="newsletter-form" onSubmit={(e) => e.preventDefault()}>
        <input type="email" placeholder="Enter Your Email" required />
        <button type="submit">Subscribe</button>
      </form>
    </section>
  );
};

export default Newsletter;
