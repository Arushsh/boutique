import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import './ProductShowcase.css';
import { Heart, ShoppingBag, ArrowRight } from 'lucide-react';
import api from '../api/axios';

const ProductShowcase = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);
  const { addToCart, addToWishlist } = useCart();
  
  const fetchShowcaseProducts = async (pageNum) => {
    if (pageNum === 1) setLoading(true); else setLoadingMore(true);
    try {
      const { data } = await api.get(`/products?limit=8&page=${pageNum}`);
      if (pageNum === 1) {
        setProducts(data.products || []);
      } else {
        setProducts(prev => [...prev, ...(data.products || [])]);
      }
      setHasMore(data.page < data.pages);
    } catch (err) {
      console.error('Failed to fetch showcase products', err);
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  };

  useEffect(() => {
    fetchShowcaseProducts(1);
  }, []);

  const handleLoadMore = () => {
    const nextPage = page + 1;
    setPage(nextPage);
    fetchShowcaseProducts(nextPage);
  };
  
  return (
    <section className="product-showcase container">
      {loading ? (
        <div style={{ padding: 40, textAlign: 'center', color: 'var(--text-secondary)' }}>Loading showcase...</div>
      ) : (
        <div className="products-grid">
          {products.map(product => (
            <div key={product._id} className="product-card">
              <div className="product-image">
                <img src={product.image} alt={product.name} />
                {product.isFeatured && (
                  <span className="badge badge-hot">Featured</span>
                )}
                
                <div className="product-overlay">
                  {product.isHot && <span className="overlay-badge">Hot 👜</span>}
                  <h3 className="product-name">{product.name}</h3>
                  <p className="product-desc">{product.description?.substring(0, 50)}...</p>
                  <p className="product-price">₹{product.price.toFixed(2)}</p>
                  <div className="product-actions">
                    <button onClick={() => addToWishlist({ id: product._id, ...product })} className="action-btn" aria-label="Add to Wishlist"><Heart size={20} /></button>
                    <button onClick={() => addToCart({ id: product._id, ...product })} className="action-btn" aria-label="Add to Bag"><ShoppingBag size={20} /></button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
      
      {hasMore && (
        <div style={{ textAlign: 'center', marginTop: 40 }}>
          <button 
            onClick={handleLoadMore}
            className="click-now-btn"
            disabled={loadingMore}
            style={{ padding: '14px 36px', cursor: 'pointer', opacity: loadingMore ? 0.7 : 1 }}
          >
            {loadingMore ? 'Loading...' : 'Load More Products'}
          </button>
        </div>
      )}
    </section>
  );
};

export default ProductShowcase;
