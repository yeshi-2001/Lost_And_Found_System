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
    <div style={{width: '100vw', minHeight: '100vh', background: '#EBF5FD', display: 'flex', flexDirection: 'column'}}>
      {/* Header */}
      <div style={{width: '100%', height: '50vh', background: '#03045E', position: 'relative', flexShrink: 0, zIndex: 1}}>
      </div>
      
      {/* Main Content */}
      <div style={{flex: 1, display: 'flex', padding: '20px 5%', gap: '40px', background: 'white', margin: '0 5%', marginTop: '-35vh', borderRadius: 20, boxShadow: '0px 4px 4px 3px rgba(0, 0, 0, 0.25)', position: 'relative', minHeight: 'calc(100vh - 15vh)', zIndex: 5}}>
        {/* Logo Circle - Left Upper Corner */}
        <div style={{width: 150, height: 150, background: 'white', borderRadius: '50%', zIndex: 2000, boxShadow: '0 4px 8px rgba(0,0,0,0.3)', position: 'absolute', top: '-30px', left: '-30px'}}>
          <img style={{width: '100%', height: '100%', objectFit: 'cover', borderRadius: '50%', transform: 'translateY(-5px)'}} src="image/logo2_1.png" alt="Logo" />
        </div>
        
        {/* Background Image */}
        <img style={{position: 'absolute', bottom: 0, left: 0, width: '60%', height: '70%', objectFit: 'cover', opacity: 0.6, zIndex: 0}} src="../../image/bg.png" alt="Background" />
        
        {/* Left Side - Welcome Text */}
        <div style={{flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', paddingLeft: '5%', zIndex: 1, marginTop: '-10px'}}>
          <div style={{color: '#03045E', fontSize: 'clamp(32px, 4vw, 50px)', fontFamily: 'Calibri', fontWeight: '700', marginBottom: '10px', textAlign: 'center'}}>Welcome Back to</div>
          <div style={{color: 'black', fontSize: 'clamp(32px, 4vw, 50px)', fontFamily: 'Calibri', fontWeight: '700', marginBottom: '20px', textAlign: 'center'}}>Back2U</div>
          <div style={{color: 'black', fontSize: 'clamp(18px, 2vw, 24px)', fontFamily: 'Calibri', maxWidth: '400px', textAlign: 'center', marginLeft: '20px', animation: 'fadeInSlide 2s ease-in-out'}}>Your trusted space to recover and return rightful owners</div>
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
          
          <form onSubmit={handleSubmit} style={{width: '100%', maxWidth: '400px', display: 'flex', flexDirection: 'column', gap: '20px'}}>
            <input
              type="text"
              name="login"
              value={formData.login}
              onChange={handleChange}
              placeholder="Email or Registration number"
              style={{width: '100%', height: '60px', background: 'rgba(235, 245, 253, 0.50)', border: '1px rgba(0, 0, 0, 0.60) solid', borderRadius: 4, padding: '0 20px', fontSize: 'clamp(18px, 2vw, 24px)', fontFamily: 'Calibri', outline: 'none'}}
              required
            />
            
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Password"
              style={{width: '100%', height: '60px', background: 'rgba(235, 245, 253, 0.50)', border: '1px rgba(0, 0, 0, 0.60) solid', borderRadius: 4, padding: '0 20px', fontSize: 'clamp(18px, 2vw, 24px)', fontFamily: 'Calibri', outline: 'none'}}
              required
            />
            
            <Link to="/forgot-password" style={{alignSelf: 'flex-end', color: 'black', fontSize: 'clamp(16px, 1.8vw, 20px)', fontFamily: 'Calibri', textDecoration: 'none', marginBottom: '10px'}}>Forgot password ?</Link>
            
            <button 
              type="submit" 
              style={{width: '100%', height: '60px', background: '#03045E', borderRadius: 10, border: 'none', color: 'white', fontSize: 'clamp(20px, 2.2vw, 28px)', fontFamily: 'Calibri', cursor: 'pointer', marginBottom: '20px'}}
              disabled={loading}
            >
              {loading ? 'Logging in...' : 'Login'}
            </button>
            
            <div style={{textAlign: 'center', color: 'black', fontSize: 'clamp(16px, 1.8vw, 20px)', fontFamily: 'Calibri'}}>Don't have an account? 
              <Link to="/register" style={{color: '#03045E', textDecoration: 'none', fontWeight: '500'}}>Sign Up</Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;