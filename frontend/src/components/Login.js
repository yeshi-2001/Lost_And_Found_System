import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { authAPI } from '../services/api';

const Login = ({ onLogin }) => {
  const [formData, setFormData] = useState({
    login: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await authAPI.login(formData);
      const { access_token, user } = response.data;
      onLogin(user, access_token);
    } catch (error) {
      setError(error.response?.data?.error || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{width: '100vw', minHeight: '100vh', background: 'linear-gradient(120deg, #1a0533 0%, #5c1a6e 40%, #a0306a 100%)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', position: 'relative', overflow: 'hidden'}}>
      {/* Mesh orbs */}
      <div style={{position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 0}}>
        <div style={{position: 'absolute', top: '-20%', left: '-10%', width: '60%', height: '60%', background: 'radial-gradient(ellipse, rgba(166,77,121,0.35) 0%, transparent 65%)', filter: 'blur(80px)'}} />
        <div style={{position: 'absolute', bottom: '-10%', right: '-10%', width: '55%', height: '55%', background: 'radial-gradient(ellipse, rgba(33,15,55,0.6) 0%, transparent 70%)', filter: 'blur(60px)'}} />
        <div style={{position: 'absolute', inset: 0, backgroundImage: 'repeating-linear-gradient(135deg, rgba(255,255,255,0.03) 0px, rgba(255,255,255,0.03) 1px, transparent 1px, transparent 55px), repeating-linear-gradient(45deg, rgba(255,255,255,0.02) 0px, rgba(255,255,255,0.02) 1px, transparent 1px, transparent 80px)'}} />
      </div>
      <div style={{width: '90%', maxWidth: 1200, display: 'flex', padding: '20px 5%', gap: '40px', background: '#f5eef8', borderRadius: 20, boxShadow: '0px 4px 4px 3px rgba(0, 0, 0, 0.25)', position: 'relative', minHeight: '80vh', zIndex: 5}}>
        {/* Logo Circle - Left Upper Corner */}
        <div style={{width: 155, height: 155, background: '#f5eef8', borderRadius: '50%', zIndex: 1980, boxShadow: '0 4px 8px rgba(0,0,0,0.3)', position: 'absolute', top: '-30px', left: '-30px', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden'}}>
          <img style={{width: '100%', height: '100%', objectFit: 'contain', transform: 'none'}} src="image/logo.png" alt="Logo" />
        </div>
        
        {/* Background Image */}
        <img style={{position: 'absolute', bottom: 0, left: 0, width: '60%', height: '70%', objectFit: 'cover', opacity: 0.6, zIndex: 0}} src="image/final.png" alt="Background" />
        
        {/* Left Side - Welcome Text */}
        <div style={{flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', zIndex: 1, marginTop: '3px'}}>
          <div style={{color: '#3b0764', fontSize: 'clamp(32px, 4vw, 50px)', fontFamily: 'Calibri', fontWeight: '700', marginBottom: '10px', textAlign: 'center'}}>Welcome Back to</div>
          <div style={{color: '#3b0764', fontSize: 'clamp(32px, 4vw, 50px)', fontFamily: 'Calibri', fontWeight: '700', marginBottom: '20px', textAlign: 'center'}}>Back2U</div>
          <div style={{color: 'black', fontSize: 'clamp(18px, 2vw, 24px)', fontFamily: 'Calibri', maxWidth: '400px', textAlign: 'center', animation: 'fadeInSlide 2s ease-in-out'}}>Your trusted space to recover and return rightful owners</div>
          <style>{`
            @keyframes fadeInSlide {
              0% { 
                opacity: 0;
                transform: translateY(20px);
              }
              100% { 
                opacity: 1;
                transform: translateY(0);
              }
            }
          `}</style>
        </div>
        
        {/* Right Side - Login Form */}
        <div style={{flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', padding: '20px', zIndex: 1}}>
          <div style={{textAlign: 'center', marginBottom: '30px', maxWidth: '400px'}}>
            <span style={{color: 'black', fontSize: 'clamp(22px, 2.5vw, 28px)', fontFamily: 'Calibri', fontWeight: '400'}}>Log in</span>
            <span style={{color: 'black', fontSize: 'clamp(18px, 2vw, 24px)', fontFamily: 'Calibri', fontWeight: '400'}}> to report lost items or find belongings</span>
          </div>
          
          {error && <div style={{width: '100%', maxWidth: '400px', padding: '10px', marginBottom: '20px', background: '#ffebee', border: '1px solid #f44336', borderRadius: '4px', color: '#d32f2f', textAlign: 'center'}}>{error}</div>}
          
          <style>{`
            .login-input { background: #ede0f7 !important; border: 1px solid rgba(161,22,220,0.4) !important; border-radius: 4px; padding: 0 20px; font-size: clamp(18px, 2vw, 24px); font-family: Calibri; outline: none; width: 100%; height: 60px; color: black; }
            .login-input:-webkit-autofill, .login-input:-webkit-autofill:hover, .login-input:-webkit-autofill:focus { -webkit-box-shadow: 0 0 0px 1000px #ede0f7 inset !important; box-shadow: 0 0 0px 1000px #ede0f7 inset !important; }
          `}</style>
          <form onSubmit={handleSubmit} style={{width: '100%', maxWidth: '400px', display: 'flex', flexDirection: 'column', gap: '20px'}}>
            <input
              type="text"
              name="login"
              value={formData.login}
              onChange={handleChange}
              placeholder="Email or Registration number"
              className="login-input"
              required
            />
            
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Password"
              className="login-input"
              required
            />
            
            <Link to="/forgot-password" style={{alignSelf: 'flex-end', color: 'black', fontSize: 'clamp(16px, 1.8vw, 20px)', fontFamily: 'Calibri', textDecoration: 'none', marginBottom: '10px'}}>Forgot password ?</Link>
            
            <button 
              type="submit" 
              style={{width: '100%', height: '60px', background: '#3b0764', borderRadius: 10, border: 'none', color: 'white', fontSize: 'clamp(20px, 2.2vw, 28px)', fontFamily: 'Calibri', cursor: 'pointer', marginBottom: '20px'}}
              disabled={loading}
            >
              {loading ? 'Logging in...' : 'Login'}
            </button>
            
            <div style={{textAlign: 'center', color: 'black', fontSize: 'clamp(16px, 1.8vw, 20px)', fontFamily: 'Calibri'}}>Don't have an account? 
              <Link to="/register" style={{color: '#3b0764', textDecoration: 'none', fontWeight: '500'}}>Sign Up</Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;