import React, { useState } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import './Contact.css';
import { MapPin, Phone, Mail, Clock, CheckCircle } from 'lucide-react';
import api from '../api/axios';

const Contact = () => {
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');
    
    try {
      const { data } = await api.post('/contact', form);
      setSuccess(data.message);
      setForm({ name: '', email: '', subject: '', message: '' });
    } catch (err) {
      setError(err.response?.data?.error || err.response?.data?.errors?.[0]?.msg || 'Failed to send message.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-contact-new">
      <Header />
      <div className="contact-hero-bg">
        <main className="contact-main container">
          <div className="contact-layout">
            
            <div className="contact-info-cards">
              <h1 className="contact-page-title text-white">Get in Touch</h1>
              <p className="contact-page-desc text-white">We'd love to hear from you. Whether you have a question about our collections, sizing, or styling advice, our team is ready to help.</p>
              
              <div className="glass-panel contact-card">
                <MapPin size={24} className="contact-icon" />
                <div>
                  <h3>Visit Our Flagship</h3>
                  <p>123 Fashion Avenue, Style District, NY 10001</p>
                </div>
              </div>
              
              <div className="glass-panel contact-card">
                <Phone size={24} className="contact-icon" />
                <div>
                  <h3>Call Us</h3>
                  <p>+1 (555) 123-4567</p>
                </div>
              </div>
              
              <div className="glass-panel contact-card">
                <Mail size={24} className="contact-icon" />
                <div>
                  <h3>Email Us</h3>
                  <p>hello@auraboutique.com</p>
                </div>
              </div>
            </div>

            <div className="contact-form-side">
              <form className="glass-panel contact-form" onSubmit={handleSubmit}>
                <h2>Send a Message</h2>
                
                {error && <div style={{ background: 'rgba(239,68,68,0.1)', color: '#ef4444', padding: 12, borderRadius: 8, marginBottom: 15, fontSize: '0.9rem', border: '1px solid rgba(239,68,68,0.3)' }}>{error}</div>}
                {success && <div style={{ background: 'rgba(34,197,94,0.1)', color: '#4ade80', padding: 12, borderRadius: 8, marginBottom: 15, fontSize: '0.9rem', border: '1px solid rgba(34,197,94,0.3)', display: 'flex', alignItems: 'center', gap: 8 }}><CheckCircle size={16} /> {success}</div>}

                <div className="form-group">
                  <label htmlFor="name">Full Name</label>
                  <input type="text" id="name" placeholder="Jane Doe" required className="glass-input" value={form.name} onChange={e => setForm({...form, name: e.target.value})} />
                </div>
                
                <div className="form-group">
                  <label htmlFor="email">Email Address</label>
                  <input type="email" id="email" placeholder="jane@example.com" required className="glass-input" value={form.email} onChange={e => setForm({...form, email: e.target.value})} />
                </div>
                
                <div className="form-group">
                  <label htmlFor="subject">Subject</label>
                  <select id="subject" className="glass-input" required value={form.subject} onChange={e => setForm({...form, subject: e.target.value})}>
                    <option value="">Select a topic...</option>
                    <option value="order">Order Inquiry</option>
                    <option value="styling">Styling Advice</option>
                    <option value="returns">Returns & Exchanges</option>
                    <option value="other">Other</option>
                  </select>
                </div>
                
                <div className="form-group">
                  <label htmlFor="message">Message</label>
                  <textarea id="message" rows="4" placeholder="How can we help?" required className="glass-input" value={form.message} onChange={e => setForm({...form, message: e.target.value})}></textarea>
                </div>
                
                <button type="submit" disabled={loading} className="btn-primary w-100">
                  {loading ? 'Sending...' : 'Send Message'}
                </button>
              </form>
            </div>
            
          </div>
        </main>
      </div>
      <Footer />
    </div>
  );
};

export default Contact;
