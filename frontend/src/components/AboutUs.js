import React from 'react';
import { useNavigate } from 'react-router-dom';

const AboutUs = () => {
  const navigate = useNavigate();

  const handleGoBack = () => {
    navigate(-1);
  };

  return (
    <div style={{width: '100vw', minHeight: '100vh', background: 'linear-gradient(200deg, #0d0221 0%, #3b0764 45%, #6d1a7a 100%)', display: 'flex', flexDirection: 'column', position: 'relative', overflow: 'hidden'}}>
      {/* Blur orbs */}
      <div style={{position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 0}}>
        <div style={{position: 'absolute', top: '-10%', right: '-10%', width: '50%', height: '50%', background: 'radial-gradient(ellipse, rgba(166,77,121,0.4) 0%, transparent 70%)', filter: 'blur(60px)'}} />
        <div style={{position: 'absolute', bottom: '10%', left: '-10%', width: '45%', height: '45%', background: 'radial-gradient(ellipse, rgba(79,28,81,0.5) 0%, transparent 70%)', filter: 'blur(50px)'}} />
        <div style={{position: 'absolute', inset: 0, backgroundImage: 'repeating-linear-gradient(135deg, rgba(255,255,255,0.03) 0px, rgba(255,255,255,0.03) 1px, transparent 1px, transparent 60px)'}} />
      </div>
      {/* Header */}
      <div style={{width: '100%', height: '50vh', background: 'rgba(33,15,55,0.6)', position: 'relative', flexShrink: 0, zIndex: 1}}>
      </div>
      
      {/* Main Content */}
      <div style={{background: 'rgba(245,238,248,0.97)', margin: '0 auto', marginTop: '-35vh', borderRadius: 20, boxShadow: '0px 4px 20px rgba(0,0,0,0.4)', position: 'relative', zIndex: 5, marginBottom: '40px', width: 'fit-content', maxWidth: '90%'}}>
        {/* Logo Circle - Left Upper Corner */}
        <div style={{width: 150, height: 150, background: 'rgba(245,238,248,0.97)', borderRadius: '50%', zIndex: 2000, boxShadow: '0 4px 8px rgba(0,0,0,0.3)', position: 'absolute', top: '-30px', left: '-30px'}}>
          <img style={{width: '100%', height: '100%', objectFit: 'cover', borderRadius: '50%', transform: 'translateY(-5px)'}} src="image/logo.png" alt="Logo" />
        </div>
        <div style={{maxWidth: '700px', margin: '0 auto', padding: '40px 30px'}}>
          <h1 style={{color: '#03045E', fontSize: '32px', fontWeight: 'bold', textAlign: 'center', marginBottom: '30px'}}>
            About Back2U
          </h1>
          
          <div style={{marginBottom: '30px'}}>
            <p style={{color: 'red', lineHeight: '1.6', margin: 0, marginTop: '30px', textAlign: 'center'}}>
              Reconnecting Students with Their Lost Items - A secure, AI-powered lost and found platform built for university students
            </p>
          </div>

          <div style={{marginBottom: '30px', lineHeight: '1.6', color: '#333'}}>
            <h3 style={{color: '#03045E', fontSize: '24px', marginBottom: '15px'}}>Our Story</h3>
            <p style={{marginBottom: '15px'}}>
              Back2U was created to solve a common problem on university campuses - students losing valuable items like phones, laptops, and wallets. 
              Traditional lost & found systems have limited hours, manual processes, and privacy concerns.
            </p>
            <p style={{marginBottom: '15px'}}>
              Our digital platform uses intelligent matching and AI verification to help students recover lost items quickly and securely. 
              Our mission is simple: help students get their belongings back while maintaining privacy and security.
            </p>
            
            <h3 style={{color: '#03045E', fontSize: '24px', marginTop: '30px', marginBottom: '15px'}}>What Makes Us Different</h3>
            <ul style={{paddingLeft: '20px', marginBottom: '20px'}}>
              <li style={{marginBottom: '8px'}}>Privacy First: Found items are never publicly listed</li>
              <li style={{marginBottom: '8px'}}>AI-Powered: Automatic matching and intelligent verification</li>
              <li style={{marginBottom: '8px'}}>Real-Time: Instant notifications when matches are found</li>
              <li style={{marginBottom: '8px'}}>Accurate: 80%+ similarity matching algorithm</li>
              <li style={{marginBottom: '8px'}}>Secure: Contact info only shared after verification</li>
              <li style={{marginBottom: '8px'}}>Student Community: Built by students, for students</li>
            </ul>
            
            <h3 style={{color: '#03045E', fontSize: '24px', marginTop: '30px', marginBottom: '15px'}}>How It Works</h3>
            <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px', marginBottom: '20px'}}>
              <div>
                <h4 style={{color: '#03045E', marginBottom: '10px'}}>For Finders:</h4>
                <ol style={{paddingLeft: '20px'}}>
                  <li style={{marginBottom: '5px'}}>Report found item privately</li>
                  <li style={{marginBottom: '5px'}}>System searches for matches automatically</li>
                  <li style={{marginBottom: '5px'}}>Verify owner and exchange contact info</li>
                </ol>
              </div>
              <div>
                <h4 style={{color: '#03045E', marginBottom: '10px'}}>For Owners:</h4>
                <ol style={{paddingLeft: '20px'}}>
                  <li style={{marginBottom: '5px'}}>Report lost item with details</li>
                  <li style={{marginBottom: '5px'}}>Get notified when match is found</li>
                  <li style={{marginBottom: '5px'}}>Answer verification questions to prove ownership</li>
                </ol>
              </div>
            </div>
            
            <h3 style={{color: '#03045E', fontSize: '24px', marginTop: '30px', marginBottom: '15px'}}>Our Values</h3>
            <ul style={{paddingLeft: '20px', marginBottom: '20px'}}>
              <li style={{marginBottom: '8px'}}>Trust: Building a safe campus community</li>
              <li style={{marginBottom: '8px'}}>Privacy: Protecting personal information</li>
              <li style={{marginBottom: '8px'}}>Innovation: Using AI to solve real problems</li>
              <li style={{marginBottom: '8px'}}>Community: Students helping students</li>
              <li style={{marginBottom: '8px'}}>Integrity: Honest reporting and verification</li>
            </ul>

            <div className="animated-warning" style={{borderRadius: '6px', padding: '15px', color: 'red', border: '1px solid #ddd', textAlign: 'center'}}>
              Free forever for university students - Built by students, for students
            </div>
            
            <div className="animated-warning" style={{borderRadius: '6px', padding: '15px', color: 'red', border: '1px solid #ddd', marginTop: '20px', textAlign: 'center'}}>
              Your privacy is our priority - AI-powered but human-centered
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
                  background-color: #d4edda;
                  border-color: #28a745;
                }
                100% { 
                  background-color: transparent;
                  border-color: #ddd;
                }
              }
            `}</style>

            <div style={{backgroundColor: '#d1ecf1', border: '1px solid #bee5eb', borderRadius: '6px', padding: '15px', color: '#0c5460', marginTop: '20px'}}>
              <strong>Our Commitment:</strong>
              <br />• Free forever for university students
              <br />• Continuous improvements based on feedback
              <br />• Dedicated to student safety and privacy
              <br />• Supporting campus community building
            </div>
          </div>
          
          <div style={{display: 'flex', gap: '20px', justifyContent: 'center', marginTop: '30px'}}>
            <button 
              onClick={handleGoBack}
              style={{padding: '15px 30px', backgroundColor: '#6B7280', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontSize: '16px', fontWeight: '500'}}
            >
              Go Back
            </button>
            <button 
              onClick={() => navigate('/register')}
              style={{padding: '15px 30px', backgroundColor: '#03045E', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontSize: '16px', fontWeight: '500'}}
            >
              Get Started
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutUs;