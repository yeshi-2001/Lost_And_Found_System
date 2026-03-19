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
  const [fieldErrors, setFieldErrors] = useState({});
  const navigate = useNavigate();

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
    if (!email) return { isValid: false, message: '' };
    if (!isValid) return { isValid: false, message: 'Please enter a valid email address' };
    return { isValid: true, message: 'Valid email format' };
  };

  const validateRegistrationNumber = (regNumber) => {
    const regNumberRegex = /^\d{2}[a-zA-Z]+\d+$/;
    const isValid = regNumberRegex.test(regNumber);
    if (!regNumber) return { isValid: false, message: '' };
    if (!isValid) return { isValid: false, message: 'Format: 2 digits + letters + digits (e.g., 21com76)' };
    return { isValid: true, message: 'Valid registration number format' };
  };

  useEffect(() => {
    const savedFormData = localStorage.getItem('registrationFormData');
    if (savedFormData) {
      const parsed = JSON.parse(savedFormData);
      setFormData(parsed);
      // Re-run validations on restored data
      setPasswordValidation(validatePassword(parsed.password || ''));
      setEmailValidation(validateEmail(parsed.email || ''));
      setRegNumberValidation(validateRegistrationNumber(parsed.registration_number || ''));
    }
    
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


  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    // Clear field error when user starts typing
    if (fieldErrors[name]) setFieldErrors(prev => ({ ...prev, [name]: '' }));
    if (name === 'password') setPasswordValidation(validatePassword(value));
    else if (name === 'email') setEmailValidation(validateEmail(value));
    else if (name === 'registration_number') setRegNumberValidation(validateRegistrationNumber(value));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const errors = {};
    if (!formData.registration_number) errors.registration_number = 'Registration number is required';
    else if (!regNumberValidation.isValid) errors.registration_number = 'Format: 2 digits + letters + digits (e.g., 21com76)';

    if (!formData.email) errors.email = 'Email is required';
    else if (!emailValidation.isValid) errors.email = 'Please enter a valid email address';

    const isPasswordValid = Object.values(passwordValidation).every(Boolean);
    if (!formData.password) errors.password = 'Password is required';
    else if (!isPasswordValid) errors.password = 'Password does not meet all requirements';

    if (!formData.name) errors.name = 'Full name is required';
    if (!formData.department) errors.department = 'Please select your department';
    if (!formData.contact_number) errors.contact_number = 'Contact number is required';
    if (!termsAccepted) errors.terms = 'Please accept the Terms & Conditions to continue';

    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      setError('Please fix the errors below before submitting.');
      setLoading(false);
      return;
    }

    setFieldErrors({});
    try {
      await authAPI.register(formData);
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
    <div style={{width: '100vw', minHeight: '100vh', background: 'linear-gradient(170deg, #0e0630 0%, #2d1060 40%, #6b1f7a 70%, #9b2d6f 100%)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', position: 'relative', overflow: 'hidden'}}>
      {/* Mesh orbs */}
      <div style={{position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 0}}>
        <div style={{position: 'absolute', top: '-20%', left: '-10%', width: '60%', height: '60%', background: 'radial-gradient(ellipse, rgba(166,77,121,0.35) 0%, transparent 65%)', filter: 'blur(80px)'}} />
        <div style={{position: 'absolute', bottom: '-10%', right: '-10%', width: '55%', height: '55%', background: 'radial-gradient(ellipse, rgba(33,15,55,0.6) 0%, transparent 70%)', filter: 'blur(60px)'}} />
        <div style={{position: 'absolute', inset: 0, backgroundImage: 'repeating-linear-gradient(135deg, rgba(255,255,255,0.03) 0px, rgba(255,255,255,0.03) 1px, transparent 1px, transparent 55px), repeating-linear-gradient(45deg, rgba(255,255,255,0.02) 0px, rgba(255,255,255,0.02) 1px, transparent 1px, transparent 80px)'}} />
      </div>
      <div style={{width: '90%', maxWidth: 1200, display: 'flex', padding: '20px 5%', gap: '40px', background: '#f5eef8', borderRadius: 20, boxShadow: '0px 4px 4px 3px rgba(0, 0, 0, 0.25)', position: 'relative', minHeight: '80vh', zIndex: 5}}>
        {/* Logo Circle - Left Upper Corner */}
        <div style={{width: 150, height: 150, background: '#f5eef8', borderRadius: '50%', zIndex: 2000, boxShadow: '0 4px 8px rgba(0,0,0,0.3)', position: 'absolute', top: '-30px', left: '-30px', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden'}}>
          <img style={{width: '100%', height: '100%', objectFit: 'contain'}} src="image/logo.png" alt="Logo" />
        </div>
        {/* Background Image */}
        <img style={{position: 'absolute', bottom: 0, left: 0, width: '70%', height: '80%', objectFit: 'cover', opacity: 0.6, zIndex: 0}} src="image/final.png" alt="Background" />
        
        {/* Left Side - Welcome Text */}
        <div style={{flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', zIndex: 1}}>
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
        
        {/* Right Side - Registration Form */}
        <div style={{flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '20px', zIndex: 1, overflowY: 'auto', maxHeight: '100%'}}>
          {error && <div style={{width: '100%', maxWidth: '400px', padding: '10px', marginBottom: '15px', background: '#ffebee', border: '1px solid #f44336', borderRadius: '4px', color: '#d32f2f', textAlign: 'center', fontSize: '14px'}}>{error}</div>}
          
          <style>{`
            .reg-input { background: #ede0f7 !important; border: 1px solid rgba(161,22,220,0.4) !important; border-radius: 4px; padding: 0 15px; font-size: 16px; font-family: Calibri; outline: none; width: 100%; height: 50px; color: black; }
            .reg-input:-webkit-autofill, .reg-input:-webkit-autofill:hover, .reg-input:-webkit-autofill:focus { -webkit-box-shadow: 0 0 0px 1000px #ede0f7 inset !important; box-shadow: 0 0 0px 1000px #ede0f7 inset !important; }
          `}</style>
          <form onSubmit={handleSubmit} style={{width: '100%', maxWidth: '400px', display: 'flex', flexDirection: 'column', gap: '15px'}}>
            <div style={{display: 'flex', flexDirection: 'column', gap: 4}}>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Enter your full name"
              className="reg-input"
              style={{border: `1px solid ${fieldErrors.name ? '#dc3545' : 'rgba(161,22,220,0.4)'}`}}
              required
            />
            {fieldErrors.name && <div style={{fontSize: 12, color: '#dc3545'}}>✗ {fieldErrors.name}</div>}
            </div>

            <div style={{display: 'flex', flexDirection: 'column', gap: 4}}>
            <input
              type="text"
              name="registration_number"
              value={formData.registration_number}
              onChange={handleChange}
              placeholder="Registration number (e.g., 21com76, 21computerscience123)"
              className="reg-input"
              style={{border: `1px solid ${formData.registration_number ? (regNumberValidation.isValid ? '#28a745' : '#dc3545') : (fieldErrors.registration_number ? '#dc3545' : 'rgba(161,22,220,0.4)')}`}}
              required
            />
            {(fieldErrors.registration_number || (formData.registration_number && regNumberValidation.message)) && (
              <div style={{fontSize: 12, color: regNumberValidation.isValid ? '#28a745' : '#dc3545'}}>
                {regNumberValidation.isValid ? '✓' : '✗'} {fieldErrors.registration_number || regNumberValidation.message}
              </div>
            )}
            </div>

            <div style={{display: 'flex', flexDirection: 'column', gap: 4}}>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter your email (e.g., student@university.edu)"
              className="reg-input"
              style={{border: `1px solid ${formData.email ? (emailValidation.isValid ? '#28a745' : '#dc3545') : (fieldErrors.email ? '#dc3545' : 'rgba(161,22,220,0.4)')}`}}
              required
            />
            {(fieldErrors.email || (formData.email && emailValidation.message)) && (
              <div style={{fontSize: 12, color: emailValidation.isValid ? '#28a745' : '#dc3545'}}>
                {emailValidation.isValid ? '✓' : '✗'} {fieldErrors.email || emailValidation.message}
              </div>
            )}
            </div>
            
            <div style={{display: 'flex', flexDirection: 'column', gap: 4}}>
            <select
              name="department"
              value={formData.department}
              onChange={handleChange}
              style={{width: '100%', height: '50px', background: '#ede0f7', border: `1px solid ${fieldErrors.department ? '#dc3545' : 'rgba(161,22,220,0.4)'}`, borderRadius: '4px', padding: '0 15px', fontSize: '16px', fontFamily: 'Calibri', color: formData.department ? 'black' : 'rgba(0,0,0,0.5)', outline: 'none'}}
              required
            >
              <option value="">Select your department</option>
              {departments.map(dept => (
                <option key={dept} value={dept}>{dept}</option>
              ))}
            </select>
            {fieldErrors.department && <div style={{fontSize: 12, color: '#dc3545'}}>✗ {fieldErrors.department}</div>}
            </div>

            <div style={{display: 'flex', flexDirection: 'column', gap: 4}}>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              onFocus={() => setPasswordFocused(true)}
              onBlur={() => setPasswordFocused(false)}
              placeholder="Create a Strong password"
              className="reg-input"
              style={{border: `1px solid ${formData.password ? (Object.values(passwordValidation).every(Boolean) ? '#28a745' : '#dc3545') : (fieldErrors.password ? '#dc3545' : 'rgba(161,22,220,0.4)')}`}}
              required
            />
            {fieldErrors.password && !passwordFocused && <div style={{fontSize: 12, color: '#dc3545'}}>✗ {fieldErrors.password}</div>}
            
            {passwordFocused && formData.password && (
              <div style={{background: '#f5eef8', border: '1px solid #ddd', borderRadius: '4px', padding: '10px', fontSize: '12px', fontFamily: 'Calibri', marginTop: '-10px'}}>
                <div style={{fontWeight: 'bold', marginBottom: '5px', color: '#3b0764'}}>Password Requirements:</div>
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
            </div>

            <div style={{display: 'flex', flexDirection: 'column', gap: 4}}>
            <input
              type="tel"
              name="contact_number"
              value={formData.contact_number}
              onChange={handleChange}
              placeholder="Enter your contact number"
              className="reg-input"
              style={{border: `1px solid ${fieldErrors.contact_number ? '#dc3545' : 'rgba(161,22,220,0.4)'}`}}
              required
            />
            {fieldErrors.contact_number && <div style={{fontSize: 12, color: '#dc3545'}}>✗ {fieldErrors.contact_number}</div>}
            </div>
            
            {/* Terms and Conditions Checkbox */}
            <div style={{background: fieldErrors.terms ? 'rgba(220,53,69,0.1)' : 'rgba(148,102,153,0.15)', border: `1px solid ${fieldErrors.terms ? '#dc3545' : '#ddd'}`, borderRadius: '8px', padding: '15px', fontSize: '12px', fontFamily: 'Calibri'}}>
              <label style={{display: 'flex', alignItems: 'flex-start', cursor: 'pointer', color: '#333'}}>
                <input
                  type="checkbox"
                  checked={termsAccepted}
                  onChange={(e) => {
                    if (!termsAccepted) {
                      localStorage.setItem('registrationFormData', JSON.stringify(formData));
                      navigate('/terms');
                    } else {
                      setTermsAccepted(false);
                    }
                    if (fieldErrors.terms) setFieldErrors(prev => ({ ...prev, terms: '' }));
                  }}
                  style={{marginRight: '8px', marginTop: '2px'}}
                />
                <span>
                  I have read and agree to the{' '}
                  <span
                    style={{color: '#3b0764', textDecoration: 'underline', cursor: 'pointer'}}
                    onClick={() => {
                      localStorage.setItem('registrationFormData', JSON.stringify(formData));
                      navigate('/terms');
                    }}
                  >
                    Terms & Conditions
                  </span>
                </span>
              </label>
              {fieldErrors.terms && <div style={{fontSize: 12, color: '#dc3545', marginTop: 6}}>✗ {fieldErrors.terms}</div>}
            </div>
            
            <button 
              type="submit" 
              style={{width: '100%', height: '55px', background: termsAccepted ? '#3b0764' : '#9CA3AF', borderRadius: '10px', border: 'none', color: 'white', fontSize: '20px', fontFamily: 'Calibri', cursor: termsAccepted ? 'pointer' : 'not-allowed', marginTop: '10px', opacity: termsAccepted ? 1 : 0.6}}
              disabled={loading || !termsAccepted}
            >
              {loading ? 'Signing Up...' : 'Sign Up'}
            </button>
            
            <div style={{textAlign: 'center', color: 'black', fontSize: '16px', fontFamily: 'Calibri', marginTop: '15px'}}>
              Already have an account? 
              <span style={{color: '#3b0764', cursor: 'pointer', marginLeft: '5px', fontWeight: '500'}} onClick={handleSignInClick}>Sign In</span>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Register;