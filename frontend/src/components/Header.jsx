import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Heart, ShoppingBag, User, Menu, X, LogOut, Settings } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import './Header.css';
import ThemeToggle from './ThemeToggle';

const Header = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { user, isAuthenticated, isAdmin, logout } = useAuth();
  const { cartItems, wishlistItems } = useCart();
  
  const isHome = location.pathname === '/';
  const isAuth = location.pathname === '/login' || location.pathname === '/signup';
  const isActive = (path) => location.pathname === path ? 'active' : '';
  const cartCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);
  const wishlistCount = wishlistItems?.length || 0;

  // Close menu on route change
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location]);

  // Lock body scroll when menu open
  useEffect(() => {
    document.body.style.overflow = mobileMenuOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [mobileMenuOpen]);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const navLinks = [
    { name: 'Home', to: '/' },
    { name: 'New Arrivals', to: '/new-arrivals' },
    { name: 'Collections', to: '/collections' },
    { name: 'Boutique Story', to: '/story' },
    { name: 'Lookbook', to: '/lookbook' },
    { name: 'Contact', to: '/contact' },
  ];

  const mobileMenu = mobileMenuOpen ? createPortal(
    <div className="mobile-menu-portal">
      <div className="mobile-backdrop" onClick={() => setMobileMenuOpen(false)} />
      <div className="mobile-panel">
        <button className="mobile-close-btn" onClick={() => setMobileMenuOpen(false)} aria-label="Close menu">
          <X size={28} />
        </button>

        <Link to="/" className="mobile-menu-logo" onClick={() => setMobileMenuOpen(false)}>
          Aura Boutique
        </Link>

        <nav className="mobile-nav">
          <ul>
            {navLinks.map(link => (
              <li key={link.name} className={isActive(link.to)}>
                <Link to={link.to} onClick={() => setMobileMenuOpen(false)}>{link.name}</Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="mobile-menu-footer">
          {isAuthenticated ? (
            <div style={{ padding: '10px 0', borderBottom: '1px solid var(--border)', marginBottom: 10 }}>
              <div style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: 5 }}>Welcome, {user.firstName}</div>
              {isAdmin && (
                <Link to="/admin" className="mobile-footer-link" onClick={() => setMobileMenuOpen(false)}>
                  <Settings size={18} /> Admin Dashboard
                </Link>
              )}
              <button onClick={handleLogout} className="mobile-footer-link" style={{ background: 'none', border: 'none', width: '100%', textAlign: 'left', cursor: 'pointer', padding: 0 }}>
                <LogOut size={18} /> Sign Out
              </button>
            </div>
          ) : (
            <Link to="/login" className="mobile-footer-link" onClick={() => setMobileMenuOpen(false)}>
              <User size={18} /> Account Login
            </Link>
          )}
          
          {isAuthenticated && (
            <>
              <Link to="/wishlist" className="mobile-footer-link" onClick={() => setMobileMenuOpen(false)}>
                <Heart size={18} /> Wishlist ({wishlistCount})
              </Link>
              <Link to="/cart" className="mobile-footer-link" onClick={() => setMobileMenuOpen(false)}>
                <ShoppingBag size={18} /> Bag ({cartCount})
              </Link>
            </>
          )}
        </div>
      </div>
    </div>,
    document.body
  ) : null;

  return (
    <>
      <header className={`header ${!isHome && !isAuth ? 'glass-nav' : ''}`}>
        <div className="header-container">
          <div className="logo">
            <Link to="/">Aura Boutique</Link>
          </div>

          <nav className="nav desktop-nav">
            <ul>
              {navLinks.map(link => (
                <li key={link.name} className={isActive(link.to)}>
                  <Link to={link.to}>{link.name}</Link>
                </li>
              ))}
            </ul>
          </nav>

          <div className="header-actions desktop-nav">
            <div className="icons" style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
              <ThemeToggle />
              {isAuthenticated && (
                <>
                  <Link to="/wishlist" aria-label="Wishlist" style={{ position: 'relative' }}>
                    <Heart size={20} />
                    {wishlistCount > 0 && (
                      <span style={{ position: 'absolute', top: -8, right: -10, background: 'var(--color-accent)', color: '#fff', fontSize: '0.65rem', padding: '2px 6px', borderRadius: '10px', fontWeight: 700 }}>
                        {wishlistCount}
                      </span>
                    )}
                  </Link>
                  <Link to="/cart" aria-label="Cart" style={{ position: 'relative' }}>
                    <ShoppingBag size={20} />
                    {cartCount > 0 && (
                      <span style={{ position: 'absolute', top: -8, right: -10, background: 'var(--accent)', color: '#fff', fontSize: '0.65rem', padding: '2px 6px', borderRadius: '10px', fontWeight: 700 }}>
                        {cartCount}
                      </span>
                    )}
                  </Link>
                </>
              )}
              
              {isAuthenticated ? (
                <div style={{ position: 'relative', display: 'flex', alignItems: 'center', gap: 15 }}>
                  {isAdmin && (
                    <Link to="/admin" style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--accent)', textDecoration: 'none' }}>Admin</Link>
                  )}
                  <span style={{ fontSize: '0.9rem', fontWeight: 500, color: 'var(--text-primary)' }}>{user.firstName}</span>
                  <button onClick={handleLogout} aria-label="Log Out" style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'inherit', display: 'flex' }}>
                    <LogOut size={18} />
                  </button>
                </div>
              ) : (
                <Link to="/login" aria-label="Account"><User size={20} /></Link>
              )}
            </div>
          </div>

          <div className="mobile-right">
            <ThemeToggle style={{ marginRight: '10px' }} />
            {isAuthenticated && (
              <Link to="/cart" aria-label="Cart" className="mobile-icon" style={{ position: 'relative' }}>
                <ShoppingBag size={22} />
                {cartCount > 0 && (
                  <span style={{ position: 'absolute', top: -5, right: -8, background: 'var(--accent)', color: '#fff', fontSize: '0.65rem', padding: '2px 6px', borderRadius: '10px', fontWeight: 700 }}>
                    {cartCount}
                  </span>
                )}
              </Link>
            )}
            <button
              className="hamburger-btn"
              onClick={() => setMobileMenuOpen(true)}
              aria-label="Open menu"
            >
              <Menu size={26} />
            </button>
          </div>
        </div>
      </header>

      {mobileMenu}
    </>
  );
};

export default Header;
