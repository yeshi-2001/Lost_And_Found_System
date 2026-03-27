import React from 'react';
import { useNavigate } from 'react-router-dom';

const C = {
  cream:      '#FFF8F0',
  gold:       '#C08552',
  brown:      '#8C5A3C',
  dark:       '#4B2E2B',
  goldLight:  'rgba(192,133,82,0.15)',
  goldBorder: 'rgba(192,133,82,0.35)',
};

const AboutUs = () => {
  const navigate = useNavigate();

  return (
    <div style={{ width: '100vw', minHeight: '100vh', background: 'linear-gradient(160deg, #4B2E2B 0%, #8C5A3C 35%, #C08552 70%, #FFF8F0 100%)', display: 'flex', flexDirection: 'column', position: 'relative', overflow: 'hidden', fontFamily: "'Poppins', sans-serif" }}>

      {/* Blur orbs */}
      <div style={{ position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 0 }}>
        <div style={{ position: 'absolute', top: '-10%', right: '-10%', width: '50%', height: '50%', background: 'radial-gradient(ellipse, rgba(192,133,82,0.3) 0%, transparent 70%)', filter: 'blur(60px)' }} />
        <div style={{ position: 'absolute', bottom: '10%', left: '-10%', width: '45%', height: '45%', background: 'radial-gradient(ellipse, rgba(75,46,43,0.5) 0%, transparent 70%)', filter: 'blur(50px)' }} />
        <div style={{ position: 'absolute', inset: 0, backgroundImage: 'repeating-linear-gradient(135deg, rgba(255,255,255,0.02) 0px, rgba(255,255,255,0.02) 1px, transparent 1px, transparent 60px)', filter: 'blur(1.5px)' }} />
      </div>

      {/* Header banner */}
      <div style={{ width: '100%', height: '45vh', background: 'rgba(75,46,43,0.45)', position: 'relative', flexShrink: 0, zIndex: 1 }} />

      {/* Main card */}
      <div style={{ background: C.cream, margin: '0 auto', marginTop: '-32vh', borderRadius: 24, boxShadow: '0 8px 40px rgba(75,46,43,0.35)', position: 'relative', zIndex: 5, marginBottom: '50px', width: 'fit-content', maxWidth: '90%' }}>

        {/* Logo circle */}
        <div style={{ width: 140, height: 140, background: C.cream, borderRadius: '50%', zIndex: 2000, boxShadow: '0 4px 16px rgba(75,46,43,0.3)', position: 'absolute', top: '-28px', left: '-28px' }}>
          <img style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '50%', transform: 'translateY(-5px)' }} src="image/logo_black.png" alt="Logo" />
        </div>

        <div style={{ maxWidth: '700px', margin: '0 auto', padding: '44px 36px' }}>

          <h1 style={{ color: C.brown, fontSize: '30px', fontWeight: '800', textAlign: 'center', marginBottom: '8px' }}>About Back2U</h1>
          <p style={{ color: C.gold, lineHeight: '1.6', marginBottom: '32px', marginTop: '12px', textAlign: 'center', fontWeight: '500' }}>
            Reconnecting Students with Their Lost Items — A secure, AI-powered lost and found platform built for university students
          </p>

          {/* Our Story */}
          <h3 style={{ color: C.brown, fontSize: '20px', fontWeight: '700', marginBottom: '12px' }}>Our Story</h3>
          <p style={{ color: C.dark, marginBottom: '12px', lineHeight: '1.7' }}>
            Back2U was created to solve a common problem on university campuses — students losing valuable items like phones, laptops, and wallets. Traditional lost &amp; found systems have limited hours, manual processes, and privacy concerns.
          </p>
          <p style={{ color: C.dark, marginBottom: '28px', lineHeight: '1.7' }}>
            Our digital platform uses intelligent matching and AI verification to help students recover lost items quickly and securely. Our mission is simple: help students get their belongings back while maintaining privacy and security.
          </p>

          {/* What Makes Us Different */}
          <h3 style={{ color: C.brown, fontSize: '20px', fontWeight: '700', marginBottom: '12px' }}>What Makes Us Different</h3>
          <ul style={{ paddingLeft: '20px', marginBottom: '28px', color: C.dark, lineHeight: '1.8' }}>
            {['Privacy First: Found items are never publicly listed', 'AI-Powered: Automatic matching and intelligent verification', 'Real-Time: Instant notifications when matches are found', 'Accurate: 80%+ similarity matching algorithm', 'Secure: Contact info only shared after verification', 'Student Community: Built by students, for students'].map(item => (
              <li key={item} style={{ marginBottom: '6px' }}>{item}</li>
            ))}
          </ul>

          {/* How It Works */}
          <h3 style={{ color: C.brown, fontSize: '20px', fontWeight: '700', marginBottom: '16px' }}>How It Works</h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '16px', marginBottom: '28px' }}>
            {[
              { title: 'For Finders:', steps: ['Report found item privately', 'System searches for matches automatically', 'Verify owner and exchange contact info'] },
              { title: 'For Owners:', steps: ['Report lost item with details', 'Get notified when match is found', 'Answer verification questions to prove ownership'] }
            ].map(({ title, steps }) => (
              <div key={title} style={{ background: C.goldLight, border: `1px solid ${C.goldBorder}`, borderRadius: '14px', padding: '18px 20px' }}>
                <h4 style={{ color: C.brown, marginBottom: '10px', fontWeight: '700' }}>{title}</h4>
                <ol style={{ paddingLeft: '18px', color: C.dark, lineHeight: '1.8' }}>
                  {steps.map(s => <li key={s} style={{ marginBottom: '4px' }}>{s}</li>)}
                </ol>
              </div>
            ))}
          </div>

          {/* Our Values */}
          <h3 style={{ color: C.brown, fontSize: '20px', fontWeight: '700', marginBottom: '12px' }}>Our Values</h3>
          <ul style={{ paddingLeft: '20px', marginBottom: '28px', color: C.dark, lineHeight: '1.8' }}>
            {['Trust: Building a safe campus community', 'Privacy: Protecting personal information', 'Innovation: Using AI to solve real problems', 'Community: Students helping students', 'Integrity: Honest reporting and verification'].map(item => (
              <li key={item} style={{ marginBottom: '6px' }}>{item}</li>
            ))}
          </ul>

          {/* Highlight banners */}
          <div style={{ background: C.goldLight, border: `1px solid ${C.goldBorder}`, borderRadius: '10px', padding: '14px 18px', color: C.dark, textAlign: 'center', marginBottom: '12px', fontWeight: '500' }}>
            Free forever for university students — Built by students, for students
          </div>
          <div style={{ background: C.goldLight, border: `1px solid ${C.goldBorder}`, borderRadius: '10px', padding: '14px 18px', color: C.dark, textAlign: 'center', marginBottom: '20px', fontWeight: '500' }}>
            Your privacy is our priority — AI-powered but human-centered
          </div>

          {/* Commitment box */}
          <div style={{ background: 'rgba(75,46,43,0.07)', border: `1px solid ${C.goldBorder}`, borderRadius: '10px', padding: '16px 20px', color: C.dark, marginBottom: '8px', lineHeight: '1.8' }}>
            <strong style={{ color: C.brown }}>Our Commitment:</strong>
            <br />• Free forever for university students
            <br />• Continuous improvements based on feedback
            <br />• Dedicated to student safety and privacy
            <br />• Supporting campus community building
          </div>

          {/* Buttons */}
          <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', marginTop: '32px' }}>
            <button onClick={() => navigate(-1)}
              style={{ padding: '13px 28px', background: 'transparent', color: C.brown, border: `2px solid ${C.gold}`, borderRadius: '50px', cursor: 'pointer', fontSize: '15px', fontWeight: '600' }}
              onMouseOver={e => { e.target.style.background = C.goldLight; }}
              onMouseOut={e => { e.target.style.background = 'transparent'; }}>
              Go Back
            </button>
            <button onClick={() => navigate('/register')}
              style={{ padding: '13px 28px', background: C.dark, color: C.cream, border: 'none', borderRadius: '50px', cursor: 'pointer', fontSize: '15px', fontWeight: '600' }}
              onMouseOver={e => { e.target.style.background = C.brown; }}
              onMouseOut={e => { e.target.style.background = C.dark; }}>
              Get Started
            </button>
          </div>

        </div>
      </div>
    </div>
  );
};

export default AboutUs;


