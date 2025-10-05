import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { authAPI } from '../services/api';

const ResetPassword = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    password: '',
    confirmPassword: ''
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

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      setLoading(false);
      return;
    }

    try {
      await authAPI.resetPassword({ token, password: formData.password });
      alert('Password reset successful! Please login with your new password.');
      navigate('/login');
    } catch (error) {
      setError(error.response?.data?.error || 'Failed to reset password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{width: '100vw', height: '832px', position: 'relative', background: '#EBF5FD', overflow: 'hidden'}}>
      <div style={{width: '100%', height: '146px', left: 0, top: 0, position: 'absolute', background: '#03045E'}} />
      <div style={{width: 1119, height: 673, left: 188, top: 74, position: 'absolute', background: 'white', boxShadow: '0px 4px 4px 3px rgba(0, 0, 0, 0.25)', borderRadius: 20}} />
      <div style={{left: 377, top: 130, position: 'absolute', color: '#03045E', fontSize: 50, fontFamily: 'Calibri', fontWeight: '700', wordWrap: 'break-word'}}>Create New</div>
      <div style={{left: 377, top: 202, position: 'absolute', color: 'black', fontSize: 50, fontFamily: 'Calibri', fontWeight: '700', wordWrap: 'break-word'}}>Password</div>
      <img style={{width: 827, height: 552, left: -49, top: 399, position: 'absolute', opacity: 0.60}} src="../../image/bg.png" />
      <div style={{width: 301, left: 820, top: 144, position: 'absolute', textAlign: 'center'}}><span style={{color: 'black', fontSize: 28, fontFamily: 'Calibri', fontWeight: '400', wordWrap: 'break-word'}}>Enter your new</span><span style={{color: 'black', fontSize: 24, fontFamily: 'Calibri', fontWeight: '400', wordWrap: 'break-word'}}> password below</span></div>
      <div style={{width: 220, height: 220, left: 113, top: 17, position: 'absolute', background: 'white', borderRadius: 9999}} />
      <img style={{width: 220, height: 220, left: 113, top: 17, position: 'absolute', objectFit: 'cover', objectPosition: 'center', borderRadius: 9999}} src="image/logo2_1.png" />
      <div style={{width: 295, left: 377, top: 294, position: 'absolute', color: 'black', fontSize: 24, fontFamily: 'Calibri', fontWeight: '400', wordWrap: 'break-word'}}>Your trusted space to recover and return rightful owners</div>
      
      {error && <div className="alert alert-error" style={{position: 'absolute', top: 200, left: 760, width: 420, color: 'red', textAlign: 'center'}}>{error}</div>}
      
      <form onSubmit={handleSubmit}>
        <div style={{width: 420, height: 80, left: 760, top: 280, position: 'absolute', background: 'rgba(235, 245, 253, 0.50)', border: '1px rgba(0, 0, 0, 0.60) solid', borderRadius: 4}}>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="New Password"
            style={{width: '100%', height: '100%', border: 'none', backgroundColor: 'transparent', padding: '0 20px', fontSize: '24px', fontFamily: 'Calibri', color: formData.password ? 'black' : 'rgba(0, 0, 0, 0.50)', outline: 'none'}}
            required
          />
        </div>
        
        <div style={{width: 420, height: 80, left: 760, top: 380, position: 'absolute', background: 'rgba(235, 245, 253, 0.50)', border: '1px rgba(0, 0, 0, 0.60) solid', borderRadius: 4}}>
          <input
            type="password"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
            placeholder="Confirm New Password"
            style={{width: '100%', height: '100%', border: 'none', backgroundColor: 'transparent', padding: '0 20px', fontSize: '24px', fontFamily: 'Calibri', color: formData.confirmPassword ? 'black' : 'rgba(0, 0, 0, 0.50)', outline: 'none'}}
            required
          />
        </div>
        
        <button 
          type="submit" 
          style={{width: 420, height: 66, left: 760, top: 500, position: 'absolute', background: '#2E72F9', borderRadius: 10, border: 'none', color: 'white', fontSize: 28, fontFamily: 'Calibri', cursor: 'pointer'}}
          disabled={loading}
        >
          {loading ? 'Resetting...' : 'Reset Password'}
        </button>
      </form>
    </div>
  );
};

export default ResetPassword;