import React from 'react';
import { Link } from 'react-router-dom';
import './Footer.css';
import { MapPin, Phone, Mail } from 'lucide-react';

const SocialIcon = ({ name, size = 20 }) => {
  if (name === 'Facebook') return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path></svg>;
  if (name === 'Twitter') return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"></path></svg>;
  if (name === 'Instagram') return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>;
  if (name === 'Youtube') return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33 2.78 2.78 0 0 0 1.94 2c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.33 29 29 0 0 0-.46-5.33z"></path><polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02"></polygon></svg>;
  return null;
};

const Footer = () => {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-grid">
          <div className="footer-col">
            <h3 className="footer-logo">Aura Boutique</h3>
            <p className="footer-desc">
              Curated designer outfits, handcrafted collections, and elegant styles designed to make every woman feel confident and beautiful.
            </p>
            <div className="contact-info">
              <p><MapPin size={16} /> 123 Fashion Avenue, NY 10001</p>
              <p><Phone size={16} /> +1 (555) 123-4567</p>
              <p><Mail size={16} /> hello@auraboutique.com</p>
            </div>
            <div className="social-links">
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer"><SocialIcon name="Facebook" /></a>
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer"><SocialIcon name="Twitter" /></a>
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer"><SocialIcon name="Instagram" /></a>
              <a href="https://youtube.com" target="_blank" rel="noopener noreferrer"><SocialIcon name="Youtube" /></a>
            </div>
          </div>
          
          <div className="footer-col">
            <h4 className="footer-heading">Collections</h4>
            <ul className="footer-links">
              <li><Link to="/new-arrivals">New Arrivals</Link></li>
              <li><Link to="/collections">Designer Wear</Link></li>
              <li><Link to="/collections">Festive Collection</Link></li>
              <li><Link to="/collections/accessories">Accessories</Link></li>
              <li><Link to="/new-arrivals">Sale</Link></li>
            </ul>
          </div>
          
          <div className="footer-col">
            <h4 className="footer-heading">Company</h4>
            <ul className="footer-links">
              <li><Link to="/story">About Boutique</Link></li>
              <li><Link to="/lookbook">Lookbook</Link></li>
              <li><Link to="/contact">Contact</Link></li>
              <li><Link to="/contact">FAQs</Link></li>
            </ul>
          </div>
          
          <div className="footer-col">
            <h4 className="footer-heading">Customer Services</h4>
            <ul className="footer-links">
              <li><Link to="/cart">Your Cart</Link></li>
              <li><Link to="/wishlist">Your Wishlist</Link></li>
              <li><Link to="/checkout">Checkout</Link></li>
              <li><Link to="/contact">Returns &amp; Exchanges</Link></li>
              <li><Link to="/login">My Account</Link></li>
            </ul>
          </div>
        </div>
        
        <div className="footer-bottom">
          <p>&copy; 2026 Aura Boutique. All Rights Reserved.</p>
          <div className="payment-methods">
            <span>Secure Payments</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
