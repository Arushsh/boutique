import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Auth.css';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login, error, loading, clearError } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const result = await login(email, password);
    if (result.success) {
      if (result.user.role === 'admin') {
        navigate('/admin');
      } else {
        navigate('/');
      }
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-layout">
        <div className="auth-image">
          <img src="https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&q=80&w=1000" alt="Fashion Login" />
          <div className="auth-image-overlay">
            <h1>Welcome Back</h1>
            <p>Access your exclusive boutique account.</p>
          </div>
        </div>
        
        <div className="auth-form-side">
          <div className="auth-form-container glass-panel">
            <h2>Sign In</h2>
            <p className="auth-subtitle">Don't have an account? <Link to="/signup">Create one</Link></p>
            
            {error && <div className="auth-error" style={{ color: '#ef4444', background: 'rgba(239,68,68,0.1)', padding: '10px 15px', borderRadius: 8, marginBottom: 20, fontSize: '0.9rem', border: '1px solid rgba(239,68,68,0.2)' }}>{error}</div>}
            
            <form className="auth-form" onSubmit={handleSubmit}>
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
                <div className="forgot-password-row">
                  <label>Password</label>
                  <a href="#" className="forgot-link">Forgot?</a>
                </div>
                <input 
                  type="password" 
                  placeholder="••••••••" 
                  required 
                  className="glass-input" 
                  value={password}
                  onChange={(e) => { setPassword(e.target.value); clearError(); }}
                />
              </div>
              
              <button type="submit" className="btn-primary w-100 mt-4" disabled={loading}>
                {loading ? 'Signing in...' : 'Sign In'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
