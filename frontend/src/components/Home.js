import React from 'react';
import { useNavigate } from 'react-router-dom';

const Home = ({ user, onLogout }) => {
  const navigate = useNavigate();

  const handleLostItemClick = () => {
    if (user) {
      navigate('/lost-item');
    } else {
      navigate('/login');
    }
  };

  const handleFoundItemClick = () => {
    if (user) {
      navigate('/found-item');
    } else {
      navigate('/login');
    }
  };

  const handleLogout = () => {
    onLogout();
    navigate('/login');
  };

  return (
    <div style={{width: '100vw', height: '100vh', position: 'relative', background: 'linear-gradient(135deg, #f9f0ff 0%, #f0e0f8 40%, #fce8f3 100%)', overflow: 'hidden'}}>
      {/* Soft purple orbs */}
      <div style={{position: 'absolute', top: '-10%', right: '-5%', width: '45%', height: '50%', background: 'radial-gradient(ellipse, rgba(166,77,121,0.15) 0%, transparent 70%)', filter: 'blur(50px)', pointerEvents: 'none'}} />
      <div style={{position: 'absolute', bottom: '10%', left: '-5%', width: '40%', height: '40%', background: 'radial-gradient(ellipse, rgba(79,28,81,0.12) 0%, transparent 70%)', filter: 'blur(40px)', pointerEvents: 'none'}} />



      <div style={{width: '100%', bottom: '20px', position: 'absolute', display: 'flex', justifyContent: 'space-around', alignItems: 'center'}}>
        <div style={{color: 'rgba(0, 0, 0, 0.60)', fontSize: '1vw', fontFamily: 'Calibri', fontWeight: '700', wordWrap: 'break-word', cursor: 'pointer'}} onClick={() => navigate('/about-us')}>About Us</div>
        <div style={{color: 'rgba(0, 0, 0, 0.60)', fontSize: '1vw', fontFamily: 'Calibri', fontWeight: '700', wordWrap: 'break-word'}}>Contact Us</div>
        <div style={{color: 'rgba(0, 0, 0, 0.50)', fontSize: '1vw', fontFamily: 'Calibri', fontWeight: '700', wordWrap: 'break-word'}}>2025 Back2U - Lost & Found system</div>
      </div>
      {/* Sign Up button */}
      {!user && (
        <div style={{position: 'absolute', top: '2vw', right: '3vw', cursor: 'pointer', color: '#3b0764', fontSize: '1.8vw', fontFamily: 'Calibri', fontWeight: '700'}} onClick={() => navigate('/register')}>Sign Up</div>
      )}

      {/* Centered layout */}
      <div style={{width: '100%', height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '1.5vw', paddingBottom: '4vw'}}>

        {/* Logo - fixed, not moved */}
        <img style={{width: '17.2vw', height: '17.2vw', objectFit: 'contain', flexShrink: 0}} src="image/logo.png" />

        {/* Title + Subtitle + Cards shifted up */}
        <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1.5vw', marginTop: '-6px'}}>
          {/* Title */}
          <div style={{color: 'black', fontSize: '3.1vw', fontFamily: 'Calibri', fontWeight: '700', textAlign: 'center'}}>Welcome to Back2U</div>

          {/* Subtitle */}
          <div style={{color: 'black', fontSize: '2vw', fontFamily: 'Calibri', fontWeight: '400', textAlign: 'center'}}>Lost or found something ?<br/>Let's get it back to the right hands</div>

          {/* Cards */}
          <div style={{display: 'flex', gap: '3vw', marginTop: '1vw'}}>
            {/* Lost Item Card */}
            <div style={{width: '14vw', height: '16vw', opacity: 0.85, background: '#90E0EF', boxShadow: '0px 4px 4px rgba(0,0,0,0.25)', borderRadius: '2.3vw', cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '0.8vw'}} onClick={handleLostItemClick}>
              <div style={{color: 'black', fontSize: '2vw', fontFamily: 'Calibri', fontWeight: '700'}}>Lost Item</div>
              <img style={{width: '8vw', height: '6vw', objectFit: 'contain'}} src="image/icon1.png" />
              <div style={{color: 'black', fontSize: '1.3vw', fontFamily: 'Calibri', fontWeight: '400'}}>Report lost item</div>
            </div>

            {/* Found Item Card */}
            <div style={{width: '14vw', height: '16vw', opacity: 0.85, background: '#90EFA5', boxShadow: '0px 4px 4px rgba(0,0,0,0.25)', borderRadius: '2.3vw', cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '0.8vw'}} onClick={handleFoundItemClick}>
              <div style={{color: 'black', fontSize: '2vw', fontFamily: 'Calibri', fontWeight: '700'}}>Found Item</div>
              <img style={{width: '8vw', height: '6vw', objectFit: 'contain'}} src="image/icon_g1.png" />
              <div style={{color: 'black', fontSize: '1.3vw', fontFamily: 'Calibri', fontWeight: '400'}}>Report found item</div>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
};

export default Home;