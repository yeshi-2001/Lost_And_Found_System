import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Terms = () => {
  const navigate = useNavigate();
  const [agreed, setAgreed] = useState(false);

  const handleAccept = () => {
    // Store acceptance in localStorage and navigate back to register
    localStorage.setItem('termsAccepted', 'true');
    navigate('/register');
  };

  const handleGoBack = () => {
    // Go back without accepting terms
    navigate('/register');
  };

  return (
    <div style={{width: '100vw', minHeight: '100vh', background: 'linear-gradient(135deg, #3E2723 0%, #5D3A2A 45%, #A07850 80%, #EFEBE9 100%)', display: 'flex', flexDirection: 'column', position: 'relative', overflow: 'hidden'}}>
      {/* Radial burst orbs */}
      <div style={{position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 0}}>
        <div style={{position: 'absolute', top: '20%', left: '50%', transform: 'translateX(-50%)', width: '80%', height: '60%', background: 'radial-gradient(ellipse, rgba(215,168,110,0.25) 0%, transparent 65%)', filter: 'blur(70px)'}} />
        <div style={{position: 'absolute', bottom: '-5%', right: '-5%', width: '40%', height: '40%', background: 'radial-gradient(ellipse, rgba(62,39,35,0.6) 0%, transparent 70%)', filter: 'blur(40px)'}} />
        <div style={{position: 'absolute', inset: 0, backgroundImage: 'repeating-linear-gradient(45deg, rgba(255,255,255,0.025) 0px, rgba(255,255,255,0.025) 1px, transparent 1px, transparent 70px)'}} />
      </div>
      {/* Header */}
      <div style={{width: '100%', height: '50vh', background: 'rgba(62,39,35,0.5)', position: 'relative', flexShrink: 0, zIndex: 1}}>
      </div>
      
      {/* Main Content */}
      <div style={{background: 'rgba(239,235,233,0.97)', margin: '0 auto', marginTop: '-35vh', borderRadius: 20, boxShadow: '0px 4px 20px rgba(0,0,0,0.4)', position: 'relative', zIndex: 5, marginBottom: '40px', width: 'fit-content', maxWidth: '90%'}}>
        {/* Logo Circle - Left Upper Corner */}
        <div style={{width: 150, height: 150, background: 'rgba(239,235,233,0.97)', borderRadius: '50%', zIndex: 2000, boxShadow: '0 4px 8px rgba(0,0,0,0.3)', position: 'absolute', top: '-30px', left: '-30px'}}>
          <img style={{width: '100%', height: '100%', objectFit: 'cover', borderRadius: '50%', transform: 'translateY(-5px)'}} src="image/logo_black.png" alt="Logo" />
        </div>
        <div style={{maxWidth: '700px', margin: '0 auto', padding: '40px 30px'}}>
          <h1 style={{color: '#3E2723', fontSize: '32px', fontWeight: 'bold', textAlign: 'center', marginBottom: '30px'}}>
            Terms & Conditions - Back2U
          </h1>
          
          <div style={{marginBottom: '30px'}}>
            <p style={{color: 'red', lineHeight: '1.6', margin: 0, marginTop: '30px', textAlign: 'center'}}>
              By creating an account on Back2U, you are entering into a trust-based system designed to help students recover their lost belongings. 
              The accuracy of your information is crucial for the system to work effectively and maintain trust within our community.
            </p>
          </div>

          <div style={{marginBottom: '30px', lineHeight: '1.6', color: '#333'}}>
            <h3 style={{color: '#3E2723', fontSize: '24px', marginBottom: '15px'}}>Data Accuracy Requirements</h3>
            <ul style={{paddingLeft: '20px', marginBottom: '20px'}}>
              <li style={{marginBottom: '8px'}}>Users must provide correct and truthful information</li>
              <li style={{marginBottom: '8px'}}>Accurate mobile number is mandatory for match notifications</li>
              <li style={{marginBottom: '8px'}}>Valid university email required for verification</li>
              <li style={{marginBottom: '8px'}}>Real name must match university records</li>
              <li style={{marginBottom: '8px'}}>Correct student registration number required</li>
            </ul>
            <div className="animated-warning" style={{borderRadius: '6px', padding: '15px', color: 'red', border: '1px solid #ddd', textAlign: 'center'}}>
              False information may result in account suspension or termination
            </div>
            
            <div className="animated-warning" style={{borderRadius: '6px', padding: '15px', color: 'red', border: '1px solid #ddd', marginTop: '20px', textAlign: 'center'}}>
              Legal action for fraud or theft attempts may be taken
            </div>
            
            <style>{`
              .animated-warning {
                animation: highlight 2s ease-in-out infinite;
              }
              
              @keyframes highlight {
                0% { 
                  background-color: transparent;
                  border-color: #ddd;
                }
                50% { 
                  background-color: #fff3cd;
                  border-color: #ffc107;
                }
                100% { 
                  background-color: transparent;
                  border-color: #ddd;
                }
              }
            `}</style>
            
            <h3 style={{color: '#3E2723', fontSize: '24px', marginTop: '30px', marginBottom: '15px'}}>User Responsibilities</h3>
            <ul style={{paddingLeft: '20px', marginBottom: '20px'}}>
              <li style={{marginBottom: '8px'}}>Report items honestly and accurately</li>
              <li style={{marginBottom: '8px'}}>Describe lost/found items truthfully</li>
              <li style={{marginBottom: '8px'}}>Answer verification questions honestly</li>
              <li style={{marginBottom: '8px'}}>Update contact information when changed</li>
              <li style={{marginBottom: '8px'}}>Respond promptly to match notifications</li>
              <li style={{marginBottom: '8px'}}>Meet finders/owners in safe campus locations</li>
              <li style={{marginBottom: '8px'}}>Not misuse the system for fraudulent claims</li>
            </ul>
            
            <h3 style={{color: '#3E2723', fontSize: '24px', marginTop: '30px', marginBottom: '15px'}}>Privacy & Data Protection</h3>
            <ul style={{paddingLeft: '20px', marginBottom: '20px'}}>
              <li style={{marginBottom: '8px'}}>Contact information only shared after verification</li>
              <li style={{marginBottom: '8px'}}>Found items remain private (not publicly listed)</li>
              <li style={{marginBottom: '8px'}}>Personal data encrypted and secured</li>
              <li style={{marginBottom: '8px'}}>No data sold to third parties</li>
              <li style={{marginBottom: '8px'}}>Users can request data deletion</li>
            </ul>
            
            <h3 style={{color: '#3E2723', fontSize: '24px', marginTop: '30px', marginBottom: '15px'}}>Consequences of False Information</h3>
            <ul style={{paddingLeft: '20px', marginBottom: '20px'}}>
              <li style={{marginBottom: '8px'}}>Account may be suspended or terminated</li>
              <li style={{marginBottom: '8px'}}>Loss of access to platform</li>
              <li style={{marginBottom: '8px'}}>Reported to university administration</li>
              <li style={{marginBottom: '8px'}}>Legal action for fraud or theft attempts</li>
            </ul>

            <div style={{backgroundColor: '#EFEBE9', border: '1px solid #D7CCC8', borderRadius: '6px', padding: '15px', color: '#3E2723', marginTop: '20px'}}>
              <strong>By accepting these terms:</strong>
              <br />• You acknowledge that you have read and understood all requirements
              <br />• You agree to provide only accurate and truthful information
              <br />• You understand the consequences of providing false information
              <br />• You commit to using the platform responsibly and ethically
            </div>
          </div>
          
          {/* Terms Acceptance Checkbox */}
          <div style={{backgroundColor: 'rgba(109,76,65,0.08)', border: '2px solid #6D4C41', borderRadius: '12px', padding: '25px', marginTop: '30px'}}>
            <label style={{display: 'flex', alignItems: 'flex-start', cursor: 'pointer', fontSize: '16px', fontWeight: '500'}}>
              <input
                type="checkbox"
                checked={agreed}
                onChange={(e) => setAgreed(e.target.checked)}
                style={{marginRight: '12px', marginTop: '3px', transform: 'scale(1.2)'}}
              />
              <span style={{color: '#3E2723'}}>
                I have read and agree to these Terms & Conditions
              </span>
            </label>
          </div>
          
          <div style={{display: 'flex', gap: '20px', justifyContent: 'center', marginTop: '30px'}}>
            <button 
              onClick={handleGoBack}
              style={{padding: '15px 30px', backgroundColor: '#6B7280', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontSize: '16px', fontWeight: '500'}}
            >
              Go Back
            </button>
            <button 
              onClick={handleAccept}
              disabled={!agreed}
              style={{padding: '15px 30px', backgroundColor: agreed ? '#3E2723' : '#9CA3AF', color: 'white', border: 'none', borderRadius: '8px', cursor: agreed ? 'pointer' : 'not-allowed', fontSize: '16px', fontWeight: '500', opacity: agreed ? 1 : 0.6}}
            >
              I Agree & Continue
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Terms;


