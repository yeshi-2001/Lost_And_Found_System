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
    <div style={{width: '100vw', height: '832px', position: 'relative', background: 'white', overflow: 'auto'}}>



      <div style={{width: '100%', top: 'calc(52vw - 50px)', position: 'absolute', display: 'flex', justifyContent: 'space-around', alignItems: 'center'}}>
        <div style={{color: 'rgba(0, 0, 0, 0.60)', fontSize: '2vw', fontFamily: 'Calibri', fontWeight: '700', wordWrap: 'break-word'}}>About Us</div>
        <div style={{color: 'rgba(0, 0, 0, 0.60)', fontSize: '2vw', fontFamily: 'Calibri', fontWeight: '700', wordWrap: 'break-word'}}>Contact Us</div>
        <div style={{color: 'rgba(0, 0, 0, 0.50)', fontSize: '2vw', fontFamily: 'Calibri', fontWeight: '700', wordWrap: 'break-word'}}>2025 Back2U - Lost & Found system</div>
      </div>
      <div style={{width: '17.2vw', height: '17.2vw', left: '3.8vw', top: '10px', position: 'absolute', background: 'white', borderRadius: '50%', zIndex: 1000}} />
      <img style={{width: '17.2vw', height: '17.2vw', left: '4.2vw', top: '6px', position: 'absolute', objectFit: 'cover', objectPosition: 'center', borderRadius: '50%', zIndex: 1001}} src="image/logo2_1.png" />
      <div style={{left: '3.8vw', top: '20vw', position: 'absolute', color: 'black', fontSize: '3.1vw', fontFamily: 'Calibri', fontWeight: '700', wordWrap: 'break-word'}}>Welcome to Back2U</div>
      <div style={{width: '32.3vw', left: '7.3vw', top: '26vw', position: 'absolute', color: 'black', fontSize: '2.2vw', fontFamily: 'Calibri', fontWeight: '400', wordWrap: 'break-word'}}>Lost or found something ?<br/>Let's get it back to the right hands</div>

      {!user && (
        <div style={{width: '7vw', height: '2.7vw', left: '88vw', top: '4.9vw', position: 'absolute', overflow: 'hidden', cursor: 'pointer'}} onClick={() => navigate('/register')}>
          <div style={{left: 0, top: 0, position: 'absolute', color: 'white', fontSize: '2vw', fontFamily: 'Calibri', fontWeight: '700', wordWrap: 'break-word'}}>Sign Up</div>
        </div>
      )}
      <div style={{width: '100.02vw', height: 0, left: '-0.01vw', top: '45vw', position: 'absolute', boxShadow: '4px 4px 4px ', outline: '1px rgba(0, 0, 0, 0.50) solid', outlineOffset: '-0.50px', filter: 'blur(2px)'}}></div>
      <div style={{width: '22vw', height: '24.1vw', left: '43.4vw', top: 'calc(22.2vw - 200px)', position: 'absolute', opacity: 0.50, background: '#90E0EF', boxShadow: '0px 4px 4px rgba(0, 0, 0, 0.25)', borderRadius: '2.3vw', cursor: 'pointer'}} onClick={handleLostItemClick} />
      <div style={{left: '49.8vw', top: 'calc(25.4vw - 200px)', position: 'absolute', color: 'black', fontSize: '2.5vw', fontFamily: 'Calibri', fontWeight: '700', wordWrap: 'break-word', cursor: 'pointer'}} onClick={handleLostItemClick}>Lost Item</div>
      <img style={{width: '15.5vw', height: '12.2vw', left: '47.3vw', top: 'calc(27.6vw - 200px)', position: 'absolute', cursor: 'pointer'}} src="image/icon1.png" onClick={handleLostItemClick} />
      <div style={{left: '47.7vw', top: 'calc(41.8vw - 200px)', position: 'absolute', color: 'black', fontSize: '1.9vw', fontFamily: 'Calibri', fontWeight: '400', wordWrap: 'break-word', cursor: 'pointer'}} onClick={handleLostItemClick}>Report lost item</div>
      <div style={{width: '22vw', height: '24.1vw', left: '71.2vw', top: 'calc(22.2vw - 200px)', position: 'absolute', opacity: 0.50, background: '#90EFA5', boxShadow: '0px 4px 4px rgba(0, 0, 0, 0.25)', borderRadius: '2.3vw', cursor: 'pointer'}} onClick={handleFoundItemClick} />
      <div style={{left: '76.2vw', top: 'calc(25.4vw - 200px)', position: 'absolute', color: 'black', fontSize: '2.3vw', fontFamily: 'Calibri', fontWeight: '700', wordWrap: 'break-word', cursor: 'pointer'}} onClick={handleFoundItemClick}>Found Item</div>
      <div style={{left: '75.5vw', top: 'calc(41.8vw - 200px)', position: 'absolute', color: 'black', fontSize: '1.9vw', fontFamily: 'Calibri', fontWeight: '400', wordWrap: 'break-word', cursor: 'pointer'}} onClick={handleFoundItemClick}>Report found item</div>
      <img style={{width: '15.5vw', height: '12.2vw', left: '74.6vw', top: 'calc(28.5vw - 200px)', position: 'absolute', cursor: 'pointer'}} src="image/icon_g1.png" onClick={handleFoundItemClick} />

    </div>
  );
};

export default Home;