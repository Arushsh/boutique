import React from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import './Ecommerce.css';
import { Minus, Plus, Trash2, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';

const Cart = () => {
  const { cartItems, updateQuantity, removeFromCart } = useCart();
  
  const subtotal = cartItems.reduce((acc, item) => acc + (item.price * item.quantity), 0);
  const shipping = cartItems.length > 0 ? 15.00 : 0;
  const total = subtotal + shipping;

  return (
    <div className="page-cart">
      <Header />
      
      <main className="ecommerce-main container">
        <h1 className="ecommerce-title">Your Bag</h1>
        
        {cartItems.length === 0 ? (
          <div className="empty-state text-center glass-panel" style={{padding: '50px', borderRadius: '20px'}}>
            <h2>Your cart is empty</h2>
            <p style={{margin: '20px 0'}}>Looks like you haven't added anything to your cart yet.</p>
            <Link to="/collections" className="btn-primary">Shop Collections</Link>
          </div>
        ) : (
          <div className="ecommerce-layout">
            <div className="cart-items-list">
              {cartItems.map(item => (
                <div key={item.id} className="cart-item glass-panel">
                  <img src={item.image} alt={item.name} className="cart-item-img" />
                  
                  <div className="cart-item-details">
                    <div className="item-header">
                      <h3>{item.name}</h3>
                      <p className="item-price">${item.price.toFixed(2)}</p>
                    </div>
                    <p className="item-size">Size: {item.size}</p>
                    
                    <div className="item-actions">
                      <div className="quantity-selector">
                        <button onClick={() => updateQuantity(item.id, -1)}><Minus size={14} /></button>
                        <span>{item.quantity}</span>
                        <button onClick={() => updateQuantity(item.id, 1)}><Plus size={14} /></button>
                      </div>
                      <button className="remove-btn" onClick={() => removeFromCart(item.id)}><Trash2 size={16} /> Remove</button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="order-summary-side">
              <div className="glass-panel summary-box">
                <h2>Order Summary</h2>
                
                <div className="summary-row">
                  <span>Subtotal</span>
                  <span>${subtotal.toFixed(2)}</span>
                </div>
                <div className="summary-row">
                  <span>Estimated Shipping</span>
                  <span>${shipping.toFixed(2)}</span>
                </div>
                <div className="summary-row">
                  <span>Tax</span>
                  <span>Calculated at checkout</span>
                </div>
                
                <div className="summary-divider"></div>
                
                <div className="summary-row total">
                  <span>Total</span>
                  <span>${total.toFixed(2)}</span>
                </div>
                
                <Link to="/checkout" className="btn-primary w-100 checkout-btn">
                  Proceed to Checkout <ArrowRight size={18} />
                </Link>
              </div>
            </div>
          </div>
        )}
      </main>
      
      <Footer />
    </div>
  );
};

export default Cart;
