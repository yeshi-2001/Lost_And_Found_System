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
    <div style={{width: '100vw', height: '832px', position: 'relative', background: '#EBF5FD', overflow: 'hidden'}}>
      <div style={{width: '100%', height: '146px', left: 0, top: 0, position: 'absolute', background: '#03045E'}} />
      <div style={{width: 1119, height: 673, left: 188, top: 74, position: 'absolute', background: 'white', boxShadow: '0px 4px 4px 3px rgba(0, 0, 0, 0.25)', borderRadius: 20}} />
      <div style={{left: 377, top: 130, position: 'absolute', color: '#03045E', fontSize: 50, fontFamily: 'Calibri', fontWeight: '700', wordWrap: 'break-word'}}>Welcome Back to </div>
      <div style={{left: 377, top: 202, position: 'absolute', color: 'black', fontSize: 50, fontFamily: 'Calibri', fontWeight: '700', wordWrap: 'break-word'}}>Back2U</div>
      <img style={{width: 827, height: 552, left: -49, top: 399, position: 'absolute', opacity: 0.60}} src="../../image/bg.png" />
      <div style={{width: 301, left: 820, top: 144, position: 'absolute', textAlign: 'center'}}><span style={{color: 'black', fontSize: 28, fontFamily: 'Calibri', fontWeight: '400', wordWrap: 'break-word'}}>Log in</span><span style={{color: 'black', fontSize: 24, fontFamily: 'Calibri', fontWeight: '400', wordWrap: 'break-word'}}> to report lost items or find belongings</span></div>
      <div style={{width: 220, height: 220, left: 113, top: 17, position: 'absolute', background: 'white', borderRadius: 9999}} />
      <img style={{width: 220, height: 220, left: 113, top: 17, position: 'absolute', objectFit: 'cover', objectPosition: 'center', borderRadius: 9999}} src="image/logo2_1.png" />
      <div style={{width: 295, left: 377, top: 294, position: 'absolute', color: 'black', fontSize: 24, fontFamily: 'Calibri', fontWeight: '400', wordWrap: 'break-word'}}>Your trusted space to recover and return rightful owners</div>
      
      {error && <div className="alert alert-error" style={{position: 'absolute', top: 200, left: 760, width: 420}}>{error}</div>}
      
      <form onSubmit={handleSubmit}>
        <div style={{width: 420, height: 80, left: 760, top: 247, position: 'absolute', background: 'rgba(235, 245, 253, 0.50)', border: '1px rgba(0, 0, 0, 0.60) solid', borderRadius: 4}}>
          <input
            type="text"
            name="login"
            value={formData.login}
            onChange={handleChange}
            placeholder="Email or Registration number"
            style={{width: '100%', height: '100%', border: 'none', backgroundColor: 'transparent', padding: '0 20px', fontSize: '24px', fontFamily: 'Calibri', color: formData.login ? 'black' : 'rgba(0, 0, 0, 0.50)', outline: 'none'}}
            required
          />
        </div>
        
        <div style={{width: 420, height: 80, left: 760, top: 356, position: 'absolute', background: 'rgba(235, 245, 253, 0.50)', border: '1px rgba(0, 0, 0, 0.60) solid', borderRadius: 4}}>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="Password"
            style={{width: '100%', height: '100%', border: 'none', backgroundColor: 'transparent', padding: '0 20px', fontSize: '24px', fontFamily: 'Calibri', color: formData.password ? 'black' : 'rgba(0, 0, 0, 0.50)', outline: 'none'}}
            required
          />
        </div>
        
        <Link to="/forgot-password" style={{left: 985, top: 469, position: 'absolute', textAlign: 'center', color: 'black', fontSize: 24, fontFamily: 'Calibri', fontWeight: '400', wordWrap: 'break-word', cursor: 'pointer', textDecoration: 'none'}}>Forgot password ?</Link>
        
        <button 
          type="submit" 
          style={{width: 420, height: 66, left: 760, top: 515, position: 'absolute', background: '#2E72F9', borderRadius: 10, border: 'none', color: 'white', fontSize: 28, fontFamily: 'Calibri', cursor: 'pointer'}}
          disabled={loading}
        >
          {loading ? 'Logging in...' : 'Login'}
        </button>
      </form>
      
      <div style={{left: 802, top: 610, position: 'absolute', textAlign: 'center', color: 'black', fontSize: 24, fontFamily: 'Calibri', fontWeight: '400', wordWrap: 'break-word'}}>Don't have an account? 
        <Link to="/register" style={{color: '#2E72F9', textDecoration: 'none'}}>Sign Up</Link>
      </div>
    </div>
  );
};

export default Login;