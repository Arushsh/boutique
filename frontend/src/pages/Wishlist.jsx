import React from 'react';
import { Link } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import './Wishlist.css';
import { Heart, ShoppingBag, Trash2, ArrowRight } from 'lucide-react';
import { useCart } from '../context/CartContext';

const Wishlist = () => {
  const { wishlistItems, removeFromWishlist, addToCart } = useCart();

  const handleMoveToCart = (item) => {
    addToCart(item);
    removeFromWishlist(item.id);
  };

  return (
    <div className="page-wishlist">
      <Header />

      <main className="wishlist-main container">
        <div className="wishlist-header">
          <h1>My Wishlist</h1>
          <p className="wishlist-count">{wishlistItems.length} {wishlistItems.length === 1 ? 'item' : 'items'} saved</p>
        </div>

        {wishlistItems.length === 0 ? (
          <div className="glass-panel empty-wishlist">
            <div className="empty-heart-icon">
              <Heart size={64} strokeWidth={1} />
            </div>
            <h2>Your wishlist is empty</h2>
            <p>Save items you love and come back to them anytime.</p>
            <Link to="/new-arrivals" className="btn-primary">
              Start Shopping <ArrowRight size={18} />
            </Link>
          </div>
        ) : (
          <div className="wishlist-grid">
            {wishlistItems.map(item => (
              <div key={item.id} className="wishlist-card glass-panel">
                <div className="wishlist-img-wrap">
                  <img src={item.image} alt={item.name} />
                  <button
                    className="wishlist-remove-btn"
                    onClick={() => removeFromWishlist(item.id)}
                    title="Remove from wishlist"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
                <div className="wishlist-info">
                  {item.category && <p className="wishlist-category">{item.category}</p>}
                  <h3 className="wishlist-name">{item.name}</h3>
                  {item.price > 0 && (
                    <p className="wishlist-price">${item.price.toFixed(2)}</p>
                  )}
                  <button
                    className="btn-primary wishlist-add-btn"
                    onClick={() => handleMoveToCart(item)}
                  >
                    <ShoppingBag size={16} /> Move to Bag
                  </button>
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

export default Wishlist;
