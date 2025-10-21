import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { authAPI } from '../services/api';

const Register = ({ onLogin }) => {
  const [formData, setFormData] = useState({
    name: '',
    registration_number: '',
    department: '',
    email: '',
    password: '',
    contact_number: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const departments = [
    'Department of Computer Science',
    'Department of Physical Science',
    'Department of Business and Management Studies',
    'Department of Languages and Communication Studies',
    'Department of Information & Technology',
    'Faculty of Siddha Medicine'
  ];

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
      const response = await authAPI.register(formData);
      // Show success message and redirect to login
      alert('Registration successful! Please login with your credentials.');
      window.location.href = '/login';
    } catch (error) {
      setError(error.response?.data?.error || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  const handleSignInClick = () => {
    window.location.href = '/login';
  };

  return (
    <div style={{width: '100vw', height: '100vh', position: 'relative', backgroundColor: '#EBF5FD', overflow: 'hidden'}}>
      <div style={{width: '100%', height: '18vh', left: 0, top: 0, position: 'absolute', background: '#03045E'}} />
      <div style={{width: 'calc(100vw - 160px)', height: 'calc(100vh - 120px)', left: '80px', top: '9vh', position: 'absolute', backgroundColor: 'white', borderRadius: '20px', boxShadow: '0px 4px 4px 3px rgba(0,0,0,0.25)'}} />
      <img style={{width: '827px', height: '552px', left: '-28px', top: '382px', position: 'absolute', opacity: 0.6}} src="../../image/bg.png" />
      <div style={{width: '224px', height: '224px', left: '113px', top: '17px', position: 'absolute', backgroundColor: 'white', borderRadius: '50%'}} />
      <img style={{width: '224px', height: '224px', left: '113px', top: '17px', position: 'absolute', objectFit: 'cover', objectPosition: 'center', borderRadius: '50%'}} src="image/logo2_1.png" />
      
      {error && <div className="alert alert-error" style={{position: 'absolute', top: '100px', left: '760px', width: '384px'}}>{error}</div>}
      
      <form onSubmit={handleSubmit}>
        <div style={{width: '384px', height: '48px', left: '760px', top: '143px', position: 'absolute', backgroundColor: 'rgba(239, 245, 253, 0.5)', border: '1px solid rgba(0,0,0,0.6)', borderRadius: '4px'}}>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Enter your full name"
            style={{width: '100%', height: '100%', border: 'none', backgroundColor: 'transparent', padding: '0 45px', fontSize: '18px', fontFamily: 'Calibri', color: 'black', outline: 'none'}}
            required
          />
        </div>
        
        <div style={{width: '384px', height: '48px', left: '760px', top: '215px', position: 'absolute', backgroundColor: 'rgba(239, 245, 253, 0.5)', border: '1px solid rgba(0,0,0,0.6)', borderRadius: '4px'}}>
          <input
            type="text"
            name="registration_number"
            value={formData.registration_number}
            onChange={handleChange}
            placeholder="Enter your Registration number"
            style={{width: '100%', height: '100%', border: 'none', backgroundColor: 'transparent', padding: '0 45px', fontSize: '18px', fontFamily: 'Calibri', color: 'black', outline: 'none'}}
            required
          />
        </div>
        
        <div style={{width: '384px', height: '48px', left: '760px', top: '286px', position: 'absolute', backgroundColor: 'rgba(239, 245, 253, 0.5)', border: '1px solid rgba(0,0,0,0.6)', borderRadius: '4px'}}>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Enter your email"
            style={{width: '100%', height: '100%', border: 'none', backgroundColor: 'transparent', padding: '0 45px', fontSize: '18px', fontFamily: 'Calibri', color: 'black', outline: 'none'}}
            required
          />
        </div>
        
        <div style={{width: '384px', height: '48px', left: '760px', top: '363px', position: 'absolute', backgroundColor: 'rgba(239, 245, 253, 0.5)', border: '1px solid rgba(0,0,0,0.6)', borderRadius: '4px'}}>
          <select
            name="department"
            value={formData.department}
            onChange={handleChange}
            style={{width: '100%', height: '100%', border: 'none', backgroundColor: 'transparent', padding: '0 45px', fontSize: '18px', fontFamily: 'Calibri', color: formData.department ? 'black' : 'rgba(0,0,0,0.5)', outline: 'none', backgroundPosition: 'calc(100% - 55px) center'}}
            required
          >
            <option value="">Select your department</option>
            {departments.map(dept => (
              <option key={dept} value={dept}>{dept}</option>
            ))}
          </select>
        </div>
        
        <div style={{width: '384px', height: '48px', left: '760px', top: '434px', position: 'absolute', backgroundColor: 'rgba(239, 245, 253, 0.5)', border: '1px solid rgba(0,0,0,0.6)', borderRadius: '4px'}}>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="Create a Strong password"
            style={{width: '100%', height: '100%', border: 'none', backgroundColor: 'transparent', padding: '0 45px', fontSize: '18px', fontFamily: 'Calibri', color: 'black', outline: 'none'}}
            required
          />
        </div>
        
        <div style={{width: '384px', height: '48px', left: '760px', top: '514px', position: 'absolute', backgroundColor: 'rgba(239, 245, 253, 0.5)', border: '1px solid rgba(0,0,0,0.6)', borderRadius: '4px'}}>
          <input
            type="tel"
            name="contact_number"
            value={formData.contact_number}
            onChange={handleChange}
            placeholder="Enter your contact number"
            style={{width: '100%', height: '100%', border: 'none', backgroundColor: 'transparent', padding: '0 45px', fontSize: '18px', fontFamily: 'Calibri', color: 'black', outline: 'none'}}
            required
          />
        </div>
        
        <button 
          type="submit" 
          style={{width: '384px', height: '64px', left: '760px', top: '582px', position: 'absolute', backgroundColor: '#03045E', borderRadius: '10px', border: 'none', color: 'white', fontSize: '24px', fontFamily: 'Calibri', cursor: 'pointer'}}
          disabled={loading}
        >
          {loading ? 'Signing Up...' : 'Sign Up'}
        </button>
      </form>
      
      <div style={{left: '815px', top: '672px', position: 'absolute', textAlign: 'center', color: 'black', fontSize: '24px', fontFamily: 'Calibri'}}>
        Already have an account? 
        <span style={{color: '#03045E', cursor: 'pointer', marginLeft: '5px'}} onClick={handleSignInClick}>Sign In</span>
      </div>
      
      <div style={{width: '384px', height: '56px', left: '377px', top: '143px', position: 'absolute', color: '#03045E', fontSize: '48px', fontWeight: 'bold', fontFamily: 'Calibri'}}>Welcome Back to</div>
      <div style={{width: '160px', height: '56px', left: '377px', top: '217px', position: 'absolute', color: 'black', fontSize: '48px', fontWeight: 'bold', fontFamily: 'Calibri'}}>Back2U</div>
      <div style={{width: '288px', height: '56px', left: '377px', top: '299px', position: 'absolute', color: 'black', fontSize: '24px', fontFamily: 'Calibri'}}>Your trusted space to recover and return rightful owners</div>
      <div style={{width: '192px', height: '28px', left: '375px', top: '397px', position: 'absolute', textAlign: 'center', color: 'black', fontSize: '28px', fontWeight: 'bold', fontFamily: 'Calibri'}}>Create your account</div>
    </div>
  );
};

export default Register;