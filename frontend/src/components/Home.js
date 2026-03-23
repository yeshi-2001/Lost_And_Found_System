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
    <div style={{width: '100vw', height: '100vh', position: 'relative', overflow: 'hidden'}}>




      <div style={{width: '100%', bottom: '20px', position: 'absolute', display: 'flex', justifyContent: 'space-around', alignItems: 'center'}}>
        <div style={{color: 'rgba(255,255,255,0.7)', fontSize: '1vw', fontFamily: 'Calibri', fontWeight: '700', wordWrap: 'break-word', cursor: 'pointer'}} onClick={() => navigate('/about-us')}>About Us</div>
        <div style={{color: 'rgba(255,255,255,0.7)', fontSize: '1vw', fontFamily: 'Calibri', fontWeight: '700', wordWrap: 'break-word'}}>Contact Us</div>
        <div style={{color: 'rgba(255,255,255,0.5)', fontSize: '1vw', fontFamily: 'Calibri', fontWeight: '700', wordWrap: 'break-word'}}>2025 Back2U - Lost & Found system</div>
      </div>
      {/* Sign Up button */}
      {!user && (
        <div style={{position: 'absolute', top: '2vw', right: '3vw', cursor: 'pointer', color: '#D495FF', fontSize: '1.8vw', fontFamily: 'Calibri', fontWeight: '700'}} onClick={() => navigate('/register')}>Sign Up</div>
      )}

      {/* Centered layout */}
      <div style={{width: '100%', height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '1.5vw', paddingBottom: '4vw'}}>

        {/* Logo - fixed, not moved */}
        <img style={{width: '17.2vw', height: '17.2vw', objectFit: 'contain', flexShrink: 0, cursor: 'pointer'}} src="image/logo.png" onClick={() => navigate('/dashboard')} />

        {/* Title + Subtitle + Cards shifted up */}
        <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1.5vw', marginTop: '-6px'}}>
          {/* Title */}
          <div style={{color: '#e9d5ff', fontSize: '3.1vw', fontFamily: 'Calibri', fontWeight: '700', textAlign: 'center'}}>Welcome to Back2U</div>

          {/* Subtitle */}
          <div style={{color: '#c4b5d4', fontSize: '2vw', fontFamily: 'Calibri', fontWeight: '400', textAlign: 'center'}}>Lost or found something ?<br/>Let's get it back to the right hands</div>

          {/* Cards */}
          <div style={{display: 'flex', gap: '3vw', marginTop: '1vw'}}>
            {/* Lost Item Card */}
            <div style={{width: '14vw', height: '16vw', opacity: 0.9, background: 'linear-gradient(135deg, #602495, #9a00d6)', boxShadow: '0px 4px 20px rgba(154,0,214,0.4)', borderRadius: '2.3vw', cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '0.8vw'}} onClick={handleLostItemClick}>
              <div style={{color: 'white', fontSize: '2vw', fontFamily: 'Calibri', fontWeight: '700'}}>Lost Item</div>
              <img style={{width: '8vw', height: '6vw', objectFit: 'contain'}} src="image/icon1.png" />
              <div style={{color: '#D495FF', fontSize: '1.3vw', fontFamily: 'Calibri', fontWeight: '400'}}>Report lost item</div>
            </div>

            {/* Found Item Card */}
            <div style={{width: '14vw', height: '16vw', opacity: 0.9, background: 'linear-gradient(135deg, #7445BE, #BF32BA)', boxShadow: '0px 4px 20px rgba(191,50,186,0.4)', borderRadius: '2.3vw', cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '0.8vw'}} onClick={handleFoundItemClick}>
              <div style={{color: 'white', fontSize: '2vw', fontFamily: 'Calibri', fontWeight: '700'}}>Found Item</div>
              <img style={{width: '8vw', height: '6vw', objectFit: 'contain'}} src="image/icon_g1.png" />
              <div style={{color: '#D495FF', fontSize: '1.3vw', fontFamily: 'Calibri', fontWeight: '400'}}>Report found item</div>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
};

export default Home;