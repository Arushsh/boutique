import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import Header from '../components/Header';
import Footer from '../components/Footer';
import './Lookbook.css';
import { Eye, Heart, ShoppingBag } from 'lucide-react';

const Lookbook = () => {
  const [activeLook, setActiveLook] = useState(null);
  const { addToCart, addToWishlist } = useCart();

  const looks = [
    { id: 1, title: 'Summer Breeze', img: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&q=80&w=800', height: '500px', items: ['Floral Top - $120', 'Linen Pants - $180'] },
    { id: 2, title: 'Midnight Glamour', img: 'https://images.unsplash.com/photo-1529139574466-a303027c1d8b?auto=format&fit=crop&q=80&w=800', height: '600px', items: ['Sequin Dress - $450'] },
    { id: 3, title: 'Urban Chic', img: 'https://images.unsplash.com/photo-1539008835657-9e8e9680c956?auto=format&fit=crop&q=80&w=800', height: '400px', items: ['Silk Blouse - $220', 'Tailored Skirt - $190'] },
    { id: 4, title: 'Resort Getaway', img: 'https://images.unsplash.com/photo-1566174053879-31528523f8ae?auto=format&fit=crop&q=80&w=800', height: '550px', items: ['Maxi Dress - $380'] },
    { id: 5, title: 'Power Dressing', img: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=800', height: '450px', items: ['Blazer - $350', 'Trousers - $220'] },
    { id: 6, title: 'Evening Elegance', img: 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?auto=format&fit=crop&q=80&w=800', height: '650px', items: ['Couture Gown - $1200'] },
  ];

  return (
    <div className="page-lookbook-new">
      <Header />
      <div className="lookbook-hero">
        <div className="container" style={{flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center'}}>
          <h1 className="glass-panel text-center">Season Lookbook</h1>
          <p className="glass-panel text-center hero-subtitle">Explore our curated styles. Click any look to shop the pieces.</p>
        </div>
      </div>

      <main className="lookbook-main container">
        <div className="masonry-grid-interactive">
          {looks.map((look) => (
            <div 
              key={look.id} 
              className="masonry-item-interactive"
              style={{ height: look.height }}
              onMouseEnter={() => setActiveLook(look.id)}
              onMouseLeave={() => setActiveLook(null)}
            >
              <img src={look.img} alt={look.title} />
              
              <div className={`glass-panel look-overlay ${activeLook === look.id ? 'active' : ''}`}>
                <div className="overlay-header">
                  <h3>{look.title}</h3>
                  <button onClick={() => addToWishlist({ id: `look-${look.id}`, name: look.title, price: 0, image: look.img })} className="icon-btn"><Heart size={20} /></button>
                </div>
                
                <div className="look-items">
                  {look.items.map((item, i) => {
                    const [name, priceStr] = item.split(' - ');
                    const price = parseFloat(priceStr.replace('$', ''));
                    return (
                      <div key={i} className="look-item-row">
                        <span>{item}</span>
                        <button onClick={() => addToCart({ id: `look-${look.id}-${i}`, name, price, image: look.img })} className="add-btn"><ShoppingBag size={14} /> Add</button>
                      </div>
                    )
                  })}
                </div>
                
                <button className="btn-primary w-100 mt-3"><Eye size={16} /> View Full Details</button>
              </div>
            </div>
          ))}
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Lookbook;
