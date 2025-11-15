import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
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
  const [passwordValidation, setPasswordValidation] = useState({
    length: false,
    uppercase: false,
    lowercase: false,
    number: false,
    special: false
  });
  const [emailValidation, setEmailValidation] = useState({
    isValid: false,
    message: ''
  });
  const [regNumberValidation, setRegNumberValidation] = useState({
    isValid: false,
    message: ''
  });
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [passwordFocused, setPasswordFocused] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Restore form data when returning from terms page
    const savedFormData = localStorage.getItem('registrationFormData');
    if (savedFormData) {
      setFormData(JSON.parse(savedFormData));
    }
    
    // Check if terms were accepted
    const accepted = localStorage.getItem('termsAccepted');
    if (accepted === 'true') {
      setTermsAccepted(true);
      localStorage.removeItem('termsAccepted');
      localStorage.removeItem('registrationFormData');
    }
  }, []);

  const departments = [
    'Department of Computer Science',
    'Department of Physical Science',
    'Department of Business and Management Studies',
    'Department of Languages and Communication Studies',
    'Department of Information & Technology',
    'Faculty of Siddha Medicine'
  ];

  const validatePassword = (password) => {
    return {
      length: password.length >= 8,
      uppercase: /[A-Z]/.test(password),
      lowercase: /[a-z]/.test(password),
      number: /\d/.test(password),
      special: /[!@#$%^&*(),.?":{}|<>]/.test(password)
    };
  };

  const validateEmail = (email) => {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    const isValid = emailRegex.test(email);
    
    if (!email) {
      return { isValid: false, message: '' };
    } else if (!isValid) {
      return { isValid: false, message: 'Please enter a valid email address' };
    } else {
      return { isValid: true, message: 'Valid email format' };
    }
  };

  const validateRegistrationNumber = (regNumber) => {
    // Format: 2 digits + 3 letters + 2 digits (e.g., 21com76)
    const regNumberRegex = /^\d{2}[a-zA-Z]{3}\d{2}$/;
    const isValid = regNumberRegex.test(regNumber);
    
    if (!regNumber) {
      return { isValid: false, message: '' };
    } else if (!isValid) {
      return { isValid: false, message: 'Format: 2 digits + 3 letters + 2 digits (e.g., 21com76)' };
    } else {
      return { isValid: true, message: 'Valid registration number format' };
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
    
    if (name === 'password') {
      setPasswordValidation(validatePassword(value));
    } else if (name === 'email') {
      setEmailValidation(validateEmail(value));
    } else if (name === 'registration_number') {
      setRegNumberValidation(validateRegistrationNumber(value));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // Check registration number validation
    if (!regNumberValidation.isValid && formData.registration_number) {
      setError('Please enter a valid registration number format (e.g., 21com76)');
      setLoading(false);
      return;
    }

    // Check email validation
    if (!emailValidation.isValid && formData.email) {
      setError('Please enter a valid email address');
      setLoading(false);
      return;
    }

    // Check password validation
    const isPasswordValid = Object.values(passwordValidation).every(Boolean);
    if (!isPasswordValid) {
      setError('Please ensure your password meets all security requirements');
      setLoading(false);
      return;
    }

    // Check terms acceptance
    if (!termsAccepted) {
      setError('Please accept the Terms & Conditions and Privacy Policy to continue');
      setLoading(false);
      return;
    }

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
        <img style={{position: 'absolute', bottom: 0, left: 0, width: '70%', height: '80%', objectFit: 'cover', opacity: 0.6, zIndex: 0}} src="../../image/bg.png" alt="Background" />
        
        {/* Left Side - Welcome Text */}
        <div style={{flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', paddingLeft: '5%', zIndex: 1}}>
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
        
        {/* Right Side - Registration Form */}
        <div style={{flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '20px', zIndex: 1, overflowY: 'auto', maxHeight: '100%'}}>
          {error && <div style={{width: '100%', maxWidth: '400px', padding: '10px', marginBottom: '15px', background: '#ffebee', border: '1px solid #f44336', borderRadius: '4px', color: '#d32f2f', textAlign: 'center', fontSize: '14px'}}>{error}</div>}
          
          <form onSubmit={handleSubmit} style={{width: '100%', maxWidth: '400px', display: 'flex', flexDirection: 'column', gap: '15px'}}>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Enter your full name"
              style={{width: '100%', height: '50px', background: 'rgba(239, 245, 253, 0.5)', border: '1px solid rgba(0,0,0,0.6)', borderRadius: '4px', padding: '0 15px', fontSize: '16px', fontFamily: 'Calibri', outline: 'none'}}
              required
            />
            
            <input
              type="text"
              name="registration_number"
              value={formData.registration_number}
              onChange={handleChange}
              placeholder="Registration number (e.g., 21com76)"
              style={{width: '100%', height: '50px', background: 'rgba(239, 245, 253, 0.5)', border: `1px solid ${formData.registration_number ? (regNumberValidation.isValid ? '#28a745' : '#dc3545') : 'rgba(0,0,0,0.6)'}`, borderRadius: '4px', padding: '0 15px', fontSize: '16px', fontFamily: 'Calibri', outline: 'none'}}
              required
            />
            
            {formData.registration_number && regNumberValidation.message && (
              <div style={{fontSize: '12px', fontFamily: 'Calibri', color: regNumberValidation.isValid ? '#28a745' : '#dc3545', marginTop: '-10px'}}>
                {regNumberValidation.isValid ? '✓' : '✗'} {regNumberValidation.message}
              </div>
            )}
            
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter your email (e.g., student@university.edu)"
              style={{width: '100%', height: '50px', background: 'rgba(239, 245, 253, 0.5)', border: `1px solid ${formData.email ? (emailValidation.isValid ? '#28a745' : '#dc3545') : 'rgba(0,0,0,0.6)'}`, borderRadius: '4px', padding: '0 15px', fontSize: '16px', fontFamily: 'Calibri', outline: 'none'}}
              required
            />
            
            {formData.email && emailValidation.message && (
              <div style={{fontSize: '12px', fontFamily: 'Calibri', color: emailValidation.isValid ? '#28a745' : '#dc3545', marginTop: '-10px'}}>
                {emailValidation.isValid ? '✓' : '✗'} {emailValidation.message}
              </div>
            )}
            
            <select
              name="department"
              value={formData.department}
              onChange={handleChange}
              style={{width: '100%', height: '50px', background: 'rgba(239, 245, 253, 0.5)', border: '1px solid rgba(0,0,0,0.6)', borderRadius: '4px', padding: '0 15px', fontSize: '16px', fontFamily: 'Calibri', color: formData.department ? 'black' : 'rgba(0,0,0,0.5)', outline: 'none'}}
              required
            >
              <option value="">Select your department</option>
              {departments.map(dept => (
                <option key={dept} value={dept}>{dept}</option>
              ))}
            </select>
            
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              onFocus={() => setPasswordFocused(true)}
              onBlur={() => setPasswordFocused(false)}
              placeholder="Create a Strong password"
              style={{width: '100%', height: '50px', background: 'rgba(239, 245, 253, 0.5)', border: '1px solid rgba(0,0,0,0.6)', borderRadius: '4px', padding: '0 15px', fontSize: '16px', fontFamily: 'Calibri', outline: 'none'}}
              required
            />
            
            {passwordFocused && formData.password && (
              <div style={{background: 'white', border: '1px solid #ddd', borderRadius: '4px', padding: '10px', fontSize: '12px', fontFamily: 'Calibri', marginTop: '-10px'}}>
                <div style={{fontWeight: 'bold', marginBottom: '5px', color: '#03045E'}}>Password Requirements:</div>
                <div style={{color: passwordValidation.length ? '#28a745' : '#dc3545'}}>
                  {passwordValidation.length ? '✓' : '✗'} At least 8 characters
                </div>
                <div style={{color: passwordValidation.uppercase ? '#28a745' : '#dc3545'}}>
                  {passwordValidation.uppercase ? '✓' : '✗'} One uppercase letter
                </div>
                <div style={{color: passwordValidation.lowercase ? '#28a745' : '#dc3545'}}>
                  {passwordValidation.lowercase ? '✓' : '✗'} One lowercase letter
                </div>
                <div style={{color: passwordValidation.number ? '#28a745' : '#dc3545'}}>
                  {passwordValidation.number ? '✓' : '✗'} One number
                </div>
                <div style={{color: passwordValidation.special ? '#28a745' : '#dc3545'}}>
                  {passwordValidation.special ? '✓' : '✗'} One special character (!@#$%^&*)
                </div>
              </div>
            )}
            
            <input
              type="tel"
              name="contact_number"
              value={formData.contact_number}
              onChange={handleChange}
              placeholder="Enter your contact number"
              style={{width: '100%', height: '50px', background: 'rgba(239, 245, 253, 0.5)', border: '1px solid rgba(0,0,0,0.6)', borderRadius: '4px', padding: '0 15px', fontSize: '16px', fontFamily: 'Calibri', outline: 'none'}}
              required
            />
            
            {/* Terms and Conditions Checkbox */}
            <div style={{background: 'rgba(255, 255, 255, 0.9)', border: '1px solid #ddd', borderRadius: '8px', padding: '15px', fontSize: '12px', fontFamily: 'Calibri'}}>
              <label style={{display: 'flex', alignItems: 'flex-start', cursor: 'pointer', color: '#333'}}>
                <input
                  type="checkbox"
                  checked={termsAccepted}
                  onChange={(e) => {
                    if (!termsAccepted) {
                      // Save form data before navigating to terms
                      localStorage.setItem('registrationFormData', JSON.stringify(formData));
                      navigate('/terms');
                    } else {
                      setTermsAccepted(false);
                    }
                  }}
                  style={{marginRight: '8px', marginTop: '2px'}}
                />
                <span>
                  I have read and agree to the{' '}
                  <span 
                    style={{color: '#03045E', textDecoration: 'underline', cursor: 'pointer'}}
                    onClick={() => {
                      localStorage.setItem('registrationFormData', JSON.stringify(formData));
                      navigate('/terms');
                    }}
                  >
                    Terms & Conditions
                  </span>
                </span>
              </label>
            </div>
            
            <button 
              type="submit" 
              style={{width: '100%', height: '55px', background: termsAccepted ? '#03045E' : '#9CA3AF', borderRadius: '10px', border: 'none', color: 'white', fontSize: '20px', fontFamily: 'Calibri', cursor: termsAccepted ? 'pointer' : 'not-allowed', marginTop: '10px', opacity: termsAccepted ? 1 : 0.6}}
              disabled={loading || !termsAccepted}
            >
              {loading ? 'Signing Up...' : 'Sign Up'}
            </button>
            
            <div style={{textAlign: 'center', color: 'black', fontSize: '16px', fontFamily: 'Calibri', marginTop: '15px'}}>
              Already have an account? 
              <span style={{color: '#03045E', cursor: 'pointer', marginLeft: '5px', fontWeight: '500'}} onClick={handleSignInClick}>Sign In</span>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Register;