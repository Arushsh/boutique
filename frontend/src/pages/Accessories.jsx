import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import Header from '../components/Header';
import Footer from '../components/Footer';
import './Accessories.css';
import { Heart, ShoppingBag } from 'lucide-react';
import api from '../api/axios';

const Accessories = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const { addToCart, addToWishlist } = useCart();
  
  useEffect(() => {
    const fetchAccessories = async () => {
      try {
        const { data } = await api.get('/products?category=Accessories&limit=20');
        setProducts(data.products || []);
      } catch (err) {
        console.error('Failed to fetch accessories', err);
      } finally {
        setLoading(false);
      }
    };
    fetchAccessories();
  }, []);
  
  return (
    <div className="page-accessories">
      <Header />
      
      <div className="accessories-hero">
        <div className="container">
          <h1 className="glass-panel text-center">Premium Accessories</h1>
          <p className="glass-panel text-center hero-subtitle">The perfect finishing touches to elevate any look.</p>
        </div>
      </div>

      <main className="accessories-main container">
        {loading ? (
          <div style={{ padding: 40, textAlign: 'center', color: 'var(--text-secondary)' }}>Loading accessories...</div>
        ) : (
          <div className="accessories-grid">
            {products.map(item => (
              <div key={item._id} className="accessory-card">
                <div className="accessory-img-container">
                  <img src={item.image} alt={item.name} />
                  <div className="glass-panel accessory-actions">
                    <button onClick={() => addToWishlist({ id: item._id, ...item })} className="icon-btn"><Heart size={18} /></button>
                    <button onClick={() => addToCart({ id: item._id, ...item })} className="icon-btn"><ShoppingBag size={18} /></button>
                  </div>
                </div>
                <div className="accessory-info">
                  <h3>{item.name}</h3>
                  <p className="accessory-price">₹{item.price.toFixed(2)}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
};

export default Accessories;
