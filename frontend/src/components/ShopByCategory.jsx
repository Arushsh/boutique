import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './ShopByCategory.css';
import { Grid, Sparkles, Shirt, Scissors, Layers, Crown, Gem } from 'lucide-react';

const categories = [
  { id: 'all',         name: 'All',         Icon: Grid,     nav: '/new-arrivals' },
  { id: 'Traditional', name: 'Sarees',      Icon: Sparkles, nav: '/new-arrivals?category=Traditional' },
  { id: 'Tops',        name: 'Kurtis',      Icon: Shirt,    nav: '/new-arrivals?category=Tops' },
  { id: 'Dresses',     name: 'Dresses',     Icon: Scissors, nav: '/new-arrivals?category=Dresses' },
  { id: 'Sets',        name: 'Co-ord Sets', Icon: Layers,   nav: '/new-arrivals?category=Sets' },
  { id: 'Outerwear',   name: 'Gowns',       Icon: Crown,    nav: '/new-arrivals?category=Outerwear' },
  { id: 'Accessories', name: 'Accessories', Icon: Gem,      nav: '/collections/accessories' },
];

const ShopByCategory = () => {
  const [activeCat, setActiveCat] = useState('all');
  const navigate = useNavigate();

  const handleClick = (cat) => {
    setActiveCat(cat.id);
    navigate(cat.nav);
  };

  return (
    <section className="shop-category container">
      <div className="section-header">
        <h2 className="section-title">Shop By Category</h2>
        <div className="section-divider">
          <span className="dot"></span>
          <span className="dot"></span>
          <span className="dot"></span>
          <span className="dot"></span>
          <span className="dot"></span>
        </div>
      </div>

      <div className="category-list">
        {categories.map(cat => (
          <div 
            key={cat.id} 
            className={`category-item ${activeCat === cat.id ? 'active' : ''}`}
            onClick={() => handleClick(cat)}
            style={{ cursor: 'pointer' }}
          >
            <div className="category-icon">
              <cat.Icon size={28} color={activeCat === cat.id ? "var(--color-accent)" : "var(--color-text)"} />
            </div>
            <p className="category-name">{cat.name}</p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default ShopByCategory;
