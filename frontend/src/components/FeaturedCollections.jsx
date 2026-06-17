import React from 'react';
import { useNavigate } from 'react-router-dom';
import './FeaturedCollections.css';

const collections = [
  {
    id: 1,
    title: 'Ethnic Elegance',
    color: '#fca5a5', // Pinkish
    image: 'https://images.unsplash.com/photo-1539008835657-9e8e9680c956?auto=format&fit=crop&q=80&w=300',
    hasButton: true
  },
  {
    id: 2,
    title: 'Contemporary Chic',
    color: '#facc15', // Mustard Yellow
    image: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&q=80&w=300',
    hasButton: false
  },
  {
    id: 3,
    title: 'Festive Wear',
    color: '#e5e7eb', // Light Grey/Beige
    image: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&q=80&w=300',
    hasButton: false
  },
  {
    id: 4,
    title: 'Designer Exclusives',
    color: '#78350f', // Brown
    image: 'https://images.unsplash.com/photo-1529139574466-a303027c1d8b?auto=format&fit=crop&q=80&w=300',
    hasButton: false
  }
];

const FeaturedCollections = () => {
  const navigate = useNavigate();
  return (
    <section className="featured-collections container">
      <div className="section-header">
        <h2 className="section-title">Featured Collections</h2>
        <div className="section-divider">
          <span className="dot"></span>
          <span className="dot"></span>
          <span className="dot"></span>
          <span className="dot"></span>
          <span className="dot"></span>
        </div>
      </div>

      <div className="collections-grid">
        {collections.map((item, index) => (
          <div 
            key={item.id} 
            className={`collection-card ${index === 0 ? 'large' : 'regular'}`}
            style={{ backgroundColor: item.color }}
          >
            <div className="collection-info">
              <h3 style={{ color: index === 3 ? '#FFF' : '#2B2B2B' }}>{item.title}</h3>
              {item.hasButton && <button className="click-now-btn" onClick={() => navigate('/collections')}>Explore Collection</button>}
            </div>
            <div className="collection-image">
              <img src={item.image} alt={item.title} />
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default FeaturedCollections;
