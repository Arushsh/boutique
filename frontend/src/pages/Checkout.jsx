import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import './Ecommerce.css';
import { Lock, CheckCircle } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';

const Checkout = () => {
  const { cartItems, clearCart } = useCart();
  const { isAuthenticated, user } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    email: user?.email || '',
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    street: '',
    apartment: '',
    city: '',
    postalCode: '',
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [orderNum, setOrderNum] = useState('');

  const subtotal = cartItems.reduce((acc, item) => acc + (item.price * item.quantity), 0);
  const shipping = cartItems.length > 0 ? 15.00 : 0;
  const total = subtotal + shipping;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isAuthenticated) {
      setError('Please log in to place an order.');
      return;
    }
    if (cartItems.length === 0) {
      setError('Your cart is empty.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const payload = {
        items: cartItems.map(i => ({ productId: i._id || i.id, quantity: i.quantity, size: i.size })),
        shippingAddress: form,
        paymentMethod: 'card'
      };

      const { data } = await api.post('/orders', payload);
      
      // Clear cart
      clearCart();
      
      setOrderNum(data.order.orderNumber);
      setSuccess(true);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to place order. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="page-checkout">
        <Header />
        <main className="ecommerce-main container" style={{ minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div className="glass-panel" style={{ padding: 40, textAlign: 'center', maxWidth: 500, borderRadius: 20 }}>
            <CheckCircle size={60} color="#22c55e" style={{ margin: '0 auto 20px' }} />
            <h1 style={{ marginBottom: 10 }}>Order Confirmed!</h1>
            <p style={{ color: 'var(--text-secondary)', marginBottom: 20 }}>
              Thank you for your purchase. Your order number is <strong style={{ color: 'var(--accent)' }}>{orderNum}</strong>.
            </p>
            <Link to="/collections" className="btn-primary">Continue Shopping</Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="page-checkout">
      <Header />
      
      <main className="ecommerce-main container">
        <h1 className="ecommerce-title">Secure Checkout</h1>
        
        {error && <div style={{ background: 'rgba(239,68,68,0.1)', color: '#ef4444', padding: 15, borderRadius: 10, marginBottom: 20, border: '1px solid rgba(239,68,68,0.3)' }}>{error}</div>}
        {!isAuthenticated && <div style={{ background: 'rgba(201,169,110,0.1)', color: 'var(--accent)', padding: 15, borderRadius: 10, marginBottom: 20, border: '1px solid rgba(201,169,110,0.3)' }}>Please <Link to="/login" style={{ color: 'inherit', textDecoration: 'underline' }}>log in</Link> to complete your purchase.</div>}

        <div className="ecommerce-layout reverse-mobile">
          <div className="checkout-form-side">
            <form onSubmit={handleSubmit}>
              <div className="glass-panel checkout-section">
                <h2>1. Contact Information</h2>
                <div className="form-group">
                  <input type="email" placeholder="Email Address" required className="glass-input" value={form.email} onChange={e => setForm({...form, email: e.target.value})} />
                </div>
              </div>
              
              <div className="glass-panel checkout-section">
                <h2>2. Shipping Address</h2>
                <div className="form-row">
                  <div className="form-group half">
                    <input type="text" placeholder="First Name" required className="glass-input" value={form.firstName} onChange={e => setForm({...form, firstName: e.target.value})} />
                  </div>
                  <div className="form-group half">
                    <input type="text" placeholder="Last Name" required className="glass-input" value={form.lastName} onChange={e => setForm({...form, lastName: e.target.value})} />
                  </div>
                </div>
                <div className="form-group">
                  <input type="text" placeholder="Address Line 1" required className="glass-input" value={form.street} onChange={e => setForm({...form, street: e.target.value})} />
                </div>
                <div className="form-group">
                  <input type="text" placeholder="Apt, suite, etc. (optional)" className="glass-input" value={form.apartment} onChange={e => setForm({...form, apartment: e.target.value})} />
                </div>
                <div className="form-row">
                  <div className="form-group half">
                    <input type="text" placeholder="City" required className="glass-input" value={form.city} onChange={e => setForm({...form, city: e.target.value})} />
                  </div>
                  <div className="form-group half">
                    <input type="text" placeholder="Postal Code" required className="glass-input" value={form.postalCode} onChange={e => setForm({...form, postalCode: e.target.value})} />
                  </div>
                </div>
              </div>
              
              <div className="glass-panel checkout-section">
                <h2>3. Payment Method</h2>
                <div className="payment-secure-badge">
                  <Lock size={14} /> Encrypted and Secure
                </div>
                <div className="form-group">
                  <input type="text" placeholder="Card Number" required className="glass-input" />
                </div>
                <div className="form-row">
                  <div className="form-group half">
                    <input type="text" placeholder="MM/YY" required className="glass-input" />
                  </div>
                  <div className="form-group half">
                    <input type="text" placeholder="CVC" required className="glass-input" />
                  </div>
                </div>
                <button type="submit" disabled={loading || !isAuthenticated || cartItems.length === 0} className="btn-primary w-100 mt-4">
                  {loading ? 'Processing...' : `Place Order - ₹${total.toFixed(2)}`}
                </button>
              </div>
            </form>
          </div>
          
          <div className="order-summary-side">
            <div className="glass-panel summary-box">
              <h2>In Your Bag</h2>
              <div className="mini-cart-items">
                {cartItems.map(item => (
                  <div key={item.id} className="mini-cart-item">
                    <img src={item.image} alt={item.name} />
                    <div className="mini-details">
                      <h4>{item.name}</h4>
                      <p>Qty: {item.quantity}</p>
                      <p className="mini-price">₹{item.price.toFixed(2)}</p>
                    </div>
                  </div>
                ))}
                {cartItems.length === 0 && <p style={{ color: 'var(--text-secondary)' }}>Your bag is empty</p>}
              </div>
              
              <div className="summary-divider"></div>
              
              <div className="summary-row total">
                <span>Total</span>
                <span>₹{total.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Checkout;
