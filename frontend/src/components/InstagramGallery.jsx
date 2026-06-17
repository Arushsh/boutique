import React from 'react';
import './InstagramGallery.css';

const InstagramIcon = ({ size = 24, color = "currentColor" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect width="20" height="20" x="2" y="2" rx="5" ry="5"></rect>
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
    <line x1="17.5" x2="17.51" y1="6.5" y2="6.5"></line>
  </svg>
);

const galleryImages = [
  'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&q=80&w=400',
  'https://images.unsplash.com/photo-1529139574466-a303027c1d8b?auto=format&fit=crop&q=80&w=400',
  'https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&q=80&w=400',
  'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=400',
  'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=400'
];

const InstagramGallery = () => {
  return (
    <section className="instagram-gallery container">
      <div className="section-header">
        <h2 className="section-title">Styled By Our Community</h2>
        <div className="section-divider">
          <span className="dot"></span>
          <span className="dot"></span>
          <span className="dot"></span>
          <span className="dot"></span>
          <span className="dot"></span>
        </div>
      </div>
      
      <div className="gallery-grid">
        {galleryImages.map((img, idx) => (
          <div key={idx} className="gallery-item">
            <img src={img} alt="Instagram Styled" />
            <div className="overlay">
              <InstagramIcon size={32} color="#FFF" />
            </div>
          </div>
        ))}
      </div>
      
      <div className="gallery-cta">
        <button className="insta-btn">
          <InstagramIcon size={20} />
          Follow Us On Instagram
        </button>
      </div>
    </section>
  );
};

export default InstagramGallery;
