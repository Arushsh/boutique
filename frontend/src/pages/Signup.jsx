import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Auth.css';

const Signup = () => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
  const { register, error, loading, clearError } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const result = await register(firstName, lastName, email, password);
    if (result.success) {
      navigate('/');
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-layout">
        <div className="auth-image">
          <img src="https://images.unsplash.com/photo-1529139574466-a303027c1d8b?auto=format&fit=crop&q=80&w=1000" alt="Fashion Signup" />
          <div className="auth-image-overlay">
            <h1>Join Aura</h1>
            <p>Unlock premium collections and exclusive early access.</p>
          </div>
        </div>
        
        <div className="auth-form-side">
          <div className="auth-form-container glass-panel">
            <h2>Create Account</h2>
            <p className="auth-subtitle">Already have an account? <Link to="/login">Sign in</Link></p>
            
            {error && <div className="auth-error" style={{ color: '#ef4444', background: 'rgba(239,68,68,0.1)', padding: '10px 15px', borderRadius: 8, marginBottom: 20, fontSize: '0.9rem', border: '1px solid rgba(239,68,68,0.2)' }}>{error}</div>}
            
            <form className="auth-form" onSubmit={handleSubmit}>
              <div className="form-row">
                <div className="form-group half">
                  <label>First Name</label>
                  <input 
                    type="text" 
                    placeholder="Jane" 
                    required 
                    className="glass-input" 
                    value={firstName}
                    onChange={(e) => { setFirstName(e.target.value); clearError(); }}
                  />
                </div>
                <div className="form-group half">
                  <label>Last Name</label>
                  <input 
                    type="text" 
                    placeholder="Doe" 
                    required 
                    className="glass-input" 
                    value={lastName}
                    onChange={(e) => { setLastName(e.target.value); clearError(); }}
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Email Address</label>
                <input 
                  type="email" 
                  placeholder="jane@example.com" 
                  required 
                  className="glass-input" 
                  value={email}
                  onChange={(e) => { setEmail(e.target.value); clearError(); }}
                />
              </div>
              
              <div className="form-group">
                <label>Password</label>
                <input 
                  type="password" 
                  placeholder="Create a password (min 6 chars)" 
                  required 
                  className="glass-input" 
                  value={password}
                  onChange={(e) => { setPassword(e.target.value); clearError(); }}
                  minLength={6}
                />
              </div>
              
              <button type="submit" className="btn-primary w-100 mt-4" disabled={loading}>
                {loading ? 'Creating Account...' : 'Create Account'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signup;
