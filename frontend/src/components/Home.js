import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import './Home.css';

const STEPS = [
  { icon: '📋', badge: '✏️', title: 'Report Your Item', desc: 'Describe your lost or found item with details and photos.' },
  { icon: '🤖', badge: '⚡', title: 'AI Matches Items', desc: 'Our system finds matches using 80%+ similarity scoring.' },
  { icon: '🤝', badge: '✅', title: 'Connect & Recover', desc: 'Verify ownership and exchange contact info securely.' },
];

function useFadeInUp(ref) {
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { el.classList.add('visible'); obs.disconnect(); } },
      { threshold: 0.15 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [ref]);
}

const FadeSection = ({ children, className = '' }) => {
  const ref = useRef(null);
  useFadeInUp(ref);
  return <div ref={ref} className={`fade-in-up ${className}`}>{children}</div>;
};

const Home = ({ user, onLogout }) => {
  const navigate = useNavigate();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const goLost  = () => navigate(user ? '/lost-item'  : '/login');
  const goFound = () => navigate(user ? '/found-item' : '/login');
  const goStart = () => navigate(user ? '/dashboard'  : '/register');


  return (
    <div className="home-page">

      {/* ── NAVBAR ── */}
      <nav className={`home-nav ${scrolled ? 'scrolled' : ''}`}>
        {/* Background image */}
        <div style={{position: 'fixed', inset: 0, backgroundImage: "url('/image/bg_new.png')", backgroundSize: 'contain', backgroundPosition: 'center', backgroundRepeat: 'no-repeat', opacity: 0.3, zIndex: 0, pointerEvents: 'none'}} />
        <button className="nav-logo" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
          <img src="/image/logo_black.png" alt="Back2U Logo" style={{width: 70, height: 70, objectFit: 'contain'}} />
        </button>
        <ul className="nav-links">
          <li><button className="nav-btn" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>Home</button></li>
          <li><button className="nav-btn" onClick={() => navigate('/about-us')}>About</button></li>
          <li><a href="#how-it-works">How It Works</a></li>
          {user
            ? <li><button className="nav-btn nav-cta" onClick={() => navigate('/dashboard')}>Dashboard</button></li>
            : <li><button className="nav-btn nav-cta" onClick={() => navigate('/login')}>Sign In</button></li>
          }
        </ul>
      </nav>

      {/* ── HERO ── */}
      <section className="hero">
        <h1>Lost Something?<br /><em>We'll Help You Find It.</em></h1>
        <p>Report lost items or return found items quickly, safely, and easily <br /><br /> powered by AI matching.</p>
        <div className="hero-btns" style={{marginTop: 40}}>
          <button className="btn-gold" onClick={goLost}>I Lost Something</button>
          <button className="btn-outline" onClick={goFound}>I Found Something</button>
        </div>
        <div className="hero-badge">Built for University Students</div>


      </section>

      {/* ── WAVE ── */}
      <div className="wave-divider">
        <svg viewBox="0 0 1440 80" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none">
          <path d="M0,40 C360,80 1080,0 1440,40 L1440,80 L0,80 Z" fill="#EFEBE9" />
        </svg>
      </div>

      {/* ── ACTION CARDS ── */}
      <section className="action-section">
        <FadeSection>
          <p className="section-tag">Get Started</p>
          <h2 className="section-title">What Would You Like to Do?</h2>
          <p className="section-sub">Choose your situation and let Back2U guide you through the process.</p>
        </FadeSection>
        <div className="action-cards">
          <FadeSection>
            <div className="action-card lost" onClick={goLost}>
              <div className="card-bg-img" style={{ backgroundImage: "url('/image/icon1.png')" }} />
              <h3>I Lost Something</h3>
              <p>Report your lost item and our AI will search for matches instantly.</p>
              <button className="card-btn">Report Lost Item</button>
            </div>
          </FadeSection>
          <FadeSection>
            <div className="action-card found" onClick={goFound}>
              <div className="card-bg-img" style={{ backgroundImage: "url('/image/icon_g1.png')" }} />
              <h3>I Found Something</h3>
              <p>Help return an item to its rightful owner quickly and securely.</p>
              <button className="card-btn">Report Found Item</button>
            </div>
          </FadeSection>
        </div>
      </section>

      {/* ── ABOUT PREVIEW ── */}
      <section className="about-preview">
        <div className="about-inner">
          <FadeSection>
            <div className="about-text">
              <p className="section-tag">Who We Are</p>
              <h2 className="section-title">Reconnecting Students with Their Belongings</h2>
              <p>
                Back2U is an AI-powered lost &amp; found platform built for university students.
                We use intelligent matching and secure verification to help you recover lost items
                — while keeping your privacy fully protected.
              </p>
              <button className="btn-gold-outline" onClick={() => navigate('/about-us')}>Read More →</button>
            </div>
          </FadeSection>
          <FadeSection>
            <div className="about-stats">
              {[
                { icon: '🎯', num: '80%+', desc: 'Matching Accuracy' },
                { icon: '🔒', num: '100%', desc: 'Privacy Protected' },
                { icon: '⚡', num: '< 2s',  desc: 'Search Response Time' },
              ].map(({ icon, num, desc }) => (
                <div className="stat-pill" key={desc}>
                  <span className="stat-icon">{icon}</span>
                  <div>
                    <div className="stat-num">{num}</div>
                    <div className="stat-desc">{desc}</div>
                  </div>
                </div>
              ))}
            </div>
          </FadeSection>
        </div>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section className="how-section" id="how-it-works">
        <FadeSection>
          <p className="section-tag">Simple Process</p>
          <h2 className="section-title">How Back2U Works</h2>
          <p className="section-sub">Three easy steps to recover your lost item or return a found one.</p>
        </FadeSection>
        <div className="steps">
          {STEPS.map(({ icon, badge, title, desc }, i) => (
            <div className="step" key={title}>
              <div className="step-num">
                {icon}
                <span className="step-icon-badge">{badge}</span>
              </div>
              {i < STEPS.length - 1 && <div className="step-connector" />}
              <h4>{title}</h4>
              <p>{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer className="home-footer" id="contact">
        <div className="footer-top">
          <div className="footer-brand">
            <div className="footer-logo">Back<span>2U</span></div>
            <p>AI-powered lost &amp; found for university students. Helping reunite people with their belongings.</p>
          </div>
          <div className="footer-col">
            <h5>Quick Links</h5>
            <ul>
              <li><button className="footer-btn" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>Home</button></li>
              <li><button className="footer-btn" onClick={() => navigate('/about-us')}>About Us</button></li>
              <li><a href="#how-it-works">How It Works</a></li>
              <li><button className="footer-btn" onClick={goStart}>Get Started</button></li>
            </ul>
          </div>
          <div className="footer-col">
            <h5>Account</h5>
            <ul>
              <li><button className="footer-btn" onClick={() => navigate('/login')}>Sign In</button></li>
              <li><button className="footer-btn" onClick={() => navigate('/register')}>Register</button></li>
              <li><button className="footer-btn" onClick={() => navigate('/terms')}>Terms of Service</button></li>
            </ul>
          </div>

        </div>
        <div className="footer-bottom">
          <span>© 2025 Back2U — Lost &amp; Found System. All rights reserved.</span>
          <div style={{ display: 'flex', gap: '20px' }}>
            <button className="footer-btn" onClick={() => navigate('/terms')}>Privacy Policy</button>
            <button className="footer-btn" onClick={() => navigate('/terms')}>Terms</button>
          </div>
        </div>
      </footer>

    </div>
  );
};

export default Home;


