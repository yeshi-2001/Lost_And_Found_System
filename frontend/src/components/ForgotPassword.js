import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { authAPI } from '../services/api';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setMessage('');

    try {
      const response = await authAPI.forgotPassword({ email });
      setMessage('Password reset link has been sent to your email address.');
    } catch (error) {
      setError(error.response?.data?.error || 'Failed to send reset email');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{width: '100vw', height: '832px', position: 'relative', background: 'linear-gradient(225deg, #1b0a2e 0%, #4a0e5c 45%, #7a1f55 100%)', overflow: 'hidden'}}>
      {/* Orbs */}
      <div style={{position: 'absolute', top: '-15%', right: '-10%', width: '50%', height: '60%', background: 'radial-gradient(ellipse, rgba(166,77,121,0.4) 0%, transparent 65%)', filter: 'blur(60px)', pointerEvents: 'none', zIndex: 0}} />
      <div style={{position: 'absolute', bottom: '-10%', left: '-5%', width: '45%', height: '50%', background: 'radial-gradient(ellipse, rgba(79,28,81,0.5) 0%, transparent 70%)', filter: 'blur(50px)', pointerEvents: 'none', zIndex: 0}} />
      <div style={{position: 'absolute', inset: 0, backgroundImage: 'repeating-linear-gradient(135deg, rgba(255,255,255,0.03) 0px, rgba(255,255,255,0.03) 1px, transparent 1px, transparent 60px)', pointerEvents: 'none', zIndex: 0}} />
      <div style={{width: '100%', height: '146px', left: 0, top: 0, position: 'absolute', background: 'rgba(33,15,55,0.5)', zIndex: 1}} />
      <div style={{width: 1119, height: 673, left: 188, top: 74, position: 'absolute', background: 'rgba(245,238,248,0.97)', boxShadow: '0px 4px 20px rgba(0,0,0,0.4)', borderRadius: 20, zIndex: 2}} />
      <div style={{left: 377, top: 130, position: 'absolute', color: '#03045E', fontSize: 50, fontFamily: 'Calibri', fontWeight: '700', wordWrap: 'break-word'}}>Reset Your</div>
      <div style={{left: 377, top: 202, position: 'absolute', color: 'black', fontSize: 50, fontFamily: 'Calibri', fontWeight: '700', wordWrap: 'break-word'}}>Password</div>
      <img style={{width: 827, height: 552, left: -49, top: 399, position: 'absolute', opacity: 0.60}} src="../../image/bg.png" />
      <div style={{width: 301, left: 820, top: 144, position: 'absolute', textAlign: 'center'}}><span style={{color: 'black', fontSize: 28, fontFamily: 'Calibri', fontWeight: '400', wordWrap: 'break-word'}}>Enter your email</span><span style={{color: 'black', fontSize: 24, fontFamily: 'Calibri', fontWeight: '400', wordWrap: 'break-word'}}> to receive reset link</span></div>
      <div style={{width: 220, height: 220, left: 113, top: 17, position: 'absolute', background: 'rgba(245,238,248,0.97)', borderRadius: 9999, zIndex: 3}} />
      <img style={{width: 220, height: 220, left: 113, top: 17, position: 'absolute', objectFit: 'cover', objectPosition: 'center', borderRadius: 9999, zIndex: 4}} src="image/logo.png" />
      <div style={{width: 295, left: 377, top: 294, position: 'absolute', color: 'black', fontSize: 24, fontFamily: 'Calibri', fontWeight: '400', wordWrap: 'break-word'}}>Your trusted space to recover and return rightful owners</div>
      
      {error && <div className="alert alert-error" style={{position: 'absolute', top: 200, left: 760, width: 420, color: 'red', textAlign: 'center'}}>{error}</div>}
      {message && <div className="alert alert-success" style={{position: 'absolute', top: 200, left: 760, width: 420, color: 'green', textAlign: 'center'}}>{message}</div>}
      
      <form onSubmit={handleSubmit}>
        <div style={{width: 420, height: 80, left: 760, top: 300, position: 'absolute', background: 'rgba(235, 245, 253, 0.50)', border: '1px rgba(0, 0, 0, 0.60) solid', borderRadius: 4}}>
          <input
            type="email"
            name="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email address"
            style={{width: '100%', height: '100%', border: 'none', backgroundColor: 'transparent', padding: '0 20px', fontSize: '24px', fontFamily: 'Calibri', color: email ? 'black' : 'rgba(0, 0, 0, 0.50)', outline: 'none'}}
            required
          />
        </div>
        
        <button 
          type="submit" 
          style={{width: 420, height: 66, left: 760, top: 420, position: 'absolute', background: '#2E72F9', borderRadius: 10, border: 'none', color: 'white', fontSize: 28, fontFamily: 'Calibri', cursor: 'pointer'}}
          disabled={loading}
        >
          {loading ? 'Sending...' : 'Send Reset Link'}
        </button>
      </form>
      
      <div style={{left: 850, top: 520, position: 'absolute', textAlign: 'center', color: 'black', fontSize: 24, fontFamily: 'Calibri', fontWeight: '400', wordWrap: 'break-word'}}>
        Remember your password? <Link to="/login" style={{color: '#2E72F9', textDecoration: 'none'}}>Sign In</Link>
      </div>
    </div>
  );
};

export default ForgotPassword;