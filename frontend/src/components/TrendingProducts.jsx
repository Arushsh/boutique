import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Heart, ShoppingBag } from 'lucide-react';
import { useCart } from '../context/CartContext';
import './TrendingProducts.css';
import api from '../api/axios';

const TrendingProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const { addToCart, addToWishlist } = useCart();
  
  useEffect(() => {
    const fetchTrending = async () => {
      try {
        const { data } = await api.get('/products?hot=true&limit=4');
        // If not enough hot products, fetch some regular ones to fill
        if (data.products.length < 4) {
          const fallbackData = await api.get('/products?limit=4');
          setProducts(fallbackData.data.products.slice(0, 4));
        } else {
          setProducts(data.products.slice(0, 4));
        }
      } catch (err) {
        console.error('Failed to fetch trending products', err);
      } finally {
        setLoading(false);
      }
    };
    fetchTrending();
  }, []);
  
  return (
    <section className="trending-products container">
      <div className="section-header-row">
        <div className="section-title-wrapper">
          <h2 className="section-title">Trending Boutique Styles</h2>
          <div className="section-divider">
            <span className="dot"></span>
            <span className="dot"></span>
            <span className="dot"></span>
            <span className="dot"></span>
            <span className="dot"></span>
          </div>
        </div>
        <div className="pagination-numbers">
          <span className="active">01</span>
          <span>02</span>
          <span>03</span>
          <span>04</span>
        </div>
      </div>

      {loading ? (
        <div style={{ padding: 40, textAlign: 'center', color: 'var(--text-secondary)' }}>Loading trending styles...</div>
      ) : (
        <div className="trending-grid">
          {products.map((product) => (
            <div key={product._id} className="trending-card">
              <div className="trending-image-container">
                <div className="hot-bg"></div>
                <img src={product.image} alt={product.name} className="trending-img" />
                {product.isHot && <span className="hot-badge">Hot</span>}
              </div>
              <div className="trending-info">
                <h3 className="trending-name">{product.name}</h3>
                <p className="trending-price">₹{product.price.toFixed(2)}</p>
                
                <div className="trending-actions">
                  <button onClick={() => addToWishlist({ id: product._id, ...product })} className="trending-btn" aria-label="Add to Wishlist"><Heart size={20} /></button>
                  <button onClick={() => addToCart({ id: product._id, ...product })} className="trending-btn" aria-label="Add to Bag"><ShoppingBag size={20} /></button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
      
      <div className="see-all-container">
        <Link to="/new-arrivals" className="see-all-link">See all products <span>›</span></Link>
      </div>
    </section>
  );
};

export default TrendingProducts;
