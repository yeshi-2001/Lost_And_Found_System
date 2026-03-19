import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import MobileMenuButton from './MobileMenuButton';

const Sidebar = ({ user, onLogout, token }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deletePassword, setDeletePassword] = useState('');

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
      if (window.innerWidth > 768) {
        setIsMobileOpen(false);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const menuItems = [
    { path: '/dashboard', label: 'Dashboard' },
    { path: '/lost-item', label: 'Report Lost Item' },
    { path: '/found-item', label: 'Report Found Item' },
    { path: '/my-items', label: 'My Items' },
    { path: '/matches', label: 'Matches' },
    { path: '/notifications', label: 'Notifications' }
  ];


  const handleLogout = () => {
    onLogout();
    navigate('/login');
  };

  const handleDeleteAccount = async () => {
    if (!deletePassword) {
      alert('Please enter your password to confirm.');
      return;
    }
    try {
      const response = await fetch('http://localhost:5000/api/profile', {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ password: deletePassword })
      });
      const data = await response.json();
      if (response.ok) {
        onLogout();
        navigate('/login');
      } else {
        alert(data.error || 'Failed to delete account.');
      }
    } catch (error) {
      alert('Failed to delete account. Please try again.');
    }
    setShowDeleteModal(false);
    setDeletePassword('');
  };

  const SidebarContent = () => (
    <>
      {/* Logo Section */}
      <div style={{padding: '20px'}}>
        <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: '20px'}}>
          <img style={{width: 80, height: 80, objectFit: 'contain', marginBottom: 10}} src="/image/logo.png" alt="Logo" />
          <h1 style={{color: 'white', fontSize: 38, fontWeight: '700', margin: 0, fontFamily: 'Roboto Slab, serif'}}>Back2U</h1>
        </div>
      </div>

      {/* Main Navigation */}
      <nav style={{flex: 1, padding: '0 15px'}}>
        {menuItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <Link
              key={item.path}
              to={item.path}
              style={{
                textDecoration: 'none',
                display: 'block',
                padding: '16px 20px',
                margin: '8px 0',
                borderRadius: 12,
                background: isActive ? 'rgba(255,255,255,0.25)' : 'transparent',
                color: isActive ? 'white' : 'rgba(255,255,255,0.75)',
                fontSize: 15,
                fontWeight: isActive ? '700' : '600',
                boxShadow: isActive ? '0 4px 12px rgba(0,0,0,0.15)' : 'none',
                transition: 'all 0.3s ease',
                border: isActive ? 'none' : '1px solid rgba(255,255,255,0.2)'
              }}
              onClick={() => setIsMobileOpen(false)}
              onMouseEnter={(e) => {
                if (!isActive) {
                  e.target.style.background = 'rgba(255,255,255,0.1)';
                  e.target.style.transform = 'translateX(4px)';
                }
              }}
              onMouseLeave={(e) => {
                if (!isActive) {
                  e.target.style.background = 'transparent';
                  e.target.style.transform = 'translateX(0)';
                }
              }}
            >
              {item.label}
            </Link>
          );
        })}
      </nav>

      {/* Bottom Section */}
      <div style={{marginTop: 'auto', padding: '0 20px 20px'}}>
        
        <div 
          style={{
            padding: '12px 20px',
            margin: '4px 0 0 0',
            borderRadius: 8,
            background: 'transparent',
            color: '#dc2626',
            fontSize: 14,
            fontWeight: '600',
            cursor: 'pointer',
            transition: 'all 0.2s ease',
            border: '1px solid rgba(220, 38, 38, 0.3)'
          }}
          onClick={handleLogout}
          onMouseEnter={(e) => {
            e.target.style.background = 'rgba(220, 38, 38, 0.1)';
            e.target.style.borderColor = '#dc2626';
          }}
          onMouseLeave={(e) => {
            e.target.style.background = 'transparent';
            e.target.style.borderColor = 'rgba(220, 38, 38, 0.3)';
          }}
        >
          Log Out
        </div>

        <div 
          style={{
            padding: '12px 20px',
            margin: '6px 0 0 0',
            borderRadius: 8,
            background: 'transparent',
            color: '#ff4444',
            fontSize: 14,
            fontWeight: '600',
            cursor: 'pointer',
            transition: 'all 0.2s ease',
            border: '1px solid rgba(255, 68, 68, 0.3)'
          }}
          onClick={() => setShowDeleteModal(true)}
          onMouseEnter={(e) => {
            e.target.style.background = 'rgba(255, 68, 68, 0.15)';
            e.target.style.borderColor = '#ff4444';
          }}
          onMouseLeave={(e) => {
            e.target.style.background = 'transparent';
            e.target.style.borderColor = 'rgba(255, 68, 68, 0.3)';
          }}
        >
          Delete Account
        </div>
      </div>
    </>
  );

  return (
    <>
      {/* Mobile Menu Button */}
      <MobileMenuButton 
        onToggle={() => setIsMobileOpen(!isMobileOpen)}
        isOpen={isMobileOpen}
      />

      {/* Desktop Sidebar */}
      <div
        style={{
          position: 'fixed',
          left: 0,
          top: 0,
          width: 280,
          height: '100vh',
          background: 'linear-gradient(160deg, #3a1a5e 0%, #6b2370 35%, #7e2a65 65%, #b85c8a 100%)',
          display: 'flex',
          flexDirection: 'column',
          zIndex: 1000,
          transform: isMobile ? 'translateX(-100%)' : 'translateX(0)',
          transition: 'transform 0.3s ease',
          overflow: 'hidden'
        }}
      >
        {/* Layered blur design */}
        <div style={{position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 0}}>
          <div style={{position: 'absolute', top: '-15%', left: '-20%', width: '140%', height: '50%', background: 'radial-gradient(ellipse, rgba(184,92,138,0.35) 0%, transparent 70%)', filter: 'blur(40px)'}} />
          <div style={{position: 'absolute', bottom: '-10%', right: '-20%', width: '130%', height: '45%', background: 'radial-gradient(ellipse, rgba(59,26,94,0.5) 0%, transparent 70%)', filter: 'blur(50px)'}} />
          <div style={{position: 'absolute', top: '40%', left: '-10%', width: '120%', height: '30%', background: 'radial-gradient(ellipse, rgba(107,35,112,0.3) 0%, transparent 70%)', filter: 'blur(35px)'}} />
          {/* Diagonal lines */}
          <div style={{position: 'absolute', inset: 0, backgroundImage: 'repeating-linear-gradient(135deg, rgba(255,255,255,0.04) 0px, rgba(255,255,255,0.04) 1px, transparent 1px, transparent 55px)'}} />
          <div style={{position: 'absolute', inset: 0, backgroundImage: 'repeating-linear-gradient(45deg, rgba(255,255,255,0.025) 0px, rgba(255,255,255,0.025) 1px, transparent 1px, transparent 75px)'}} />
        </div>
        <div style={{position: 'relative', zIndex: 1, display: 'flex', flexDirection: 'column', height: '100%'}}>
          <SidebarContent />
        </div>
      </div>

      {/* Mobile Sidebar Overlay */}
      {isMobile && isMobileOpen && (
        <>
          <div
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: 'rgba(0,0,0,0.5)',
              zIndex: 1001
            }}
            onClick={() => setIsMobileOpen(false)}
          />
          <div
            style={{
              position: 'fixed',
              left: 0,
              top: 0,
              width: 280,
              height: '100vh',
              background: 'linear-gradient(160deg, #3a1a5e 0%, #6b2370 35%, #7e2a65 65%, #b85c8a 100%)',
              display: 'flex',
              flexDirection: 'column',
              zIndex: 1002,
              transform: 'translateX(0)',
              transition: 'transform 0.3s ease',
              overflow: 'hidden'
            }}
          >
            <div style={{position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 0}}>
              <div style={{position: 'absolute', top: '-15%', left: '-20%', width: '140%', height: '50%', background: 'radial-gradient(ellipse, rgba(184,92,138,0.35) 0%, transparent 70%)', filter: 'blur(40px)'}} />
              <div style={{position: 'absolute', bottom: '-10%', right: '-20%', width: '130%', height: '45%', background: 'radial-gradient(ellipse, rgba(59,26,94,0.5) 0%, transparent 70%)', filter: 'blur(50px)'}} />
              <div style={{position: 'absolute', inset: 0, backgroundImage: 'repeating-linear-gradient(135deg, rgba(255,255,255,0.04) 0px, rgba(255,255,255,0.04) 1px, transparent 1px, transparent 55px)'}} />
              <div style={{position: 'absolute', inset: 0, backgroundImage: 'repeating-linear-gradient(45deg, rgba(255,255,255,0.025) 0px, rgba(255,255,255,0.025) 1px, transparent 1px, transparent 75px)'}} />
            </div>
            <div style={{position: 'relative', zIndex: 1, display: 'flex', flexDirection: 'column', height: '100%'}}>
              <SidebarContent />
            </div>
          </div>
        </>
      )}

      {/* Delete Account Modal */}
      {showDeleteModal && (
        <div style={{position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999, padding: 20}}>
          <div style={{background: '#2d1245', border: '1px solid rgba(255,68,68,0.4)', borderRadius: 16, padding: 30, maxWidth: 420, width: '100%', textAlign: 'center', color: 'white'}}>
            <div style={{fontSize: 40, marginBottom: 12}}>⚠️</div>
            <h3 style={{color: '#ff4444', fontSize: 20, margin: '0 0 12px 0'}}>Delete Account</h3>
            <p style={{color: 'rgba(255,255,255,0.8)', marginBottom: 16}}>Are you sure you want to delete your account?</p>
            <div style={{textAlign: 'left', background: 'rgba(255,68,68,0.1)', borderRadius: 8, padding: '12px 16px', marginBottom: 16, fontSize: 13, color: 'rgba(255,255,255,0.7)'}}>
              This will permanently delete:
              <ul style={{margin: '8px 0 0 0', paddingLeft: 20}}>
                <li>All your found items</li>
                <li>All your lost items</li>
                <li>Your match history</li>
                <li>Your profile information</li>
              </ul>
            </div>
            <p style={{color: '#ff4444', fontWeight: 'bold', fontSize: 13, marginBottom: 16}}>This action CANNOT be undone!</p>
            <input
              type="password"
              placeholder="Enter your password to confirm"
              value={deletePassword}
              onChange={(e) => setDeletePassword(e.target.value)}
              style={{ width: '100%', padding: '10px 14px', borderRadius: 8, border: '1px solid rgba(255,255,255,0.2)', background: 'rgba(255,255,255,0.08)', color: 'white', fontSize: 14, marginBottom: 20, boxSizing: 'border-box', outline: 'none' }}
            />
            <div style={{display: 'flex', gap: 12, justifyContent: 'center'}}>
              <button
                style={{padding: '10px 24px', borderRadius: 8, border: '1px solid rgba(255,255,255,0.3)', background: 'transparent', color: 'white', fontSize: 14, cursor: 'pointer'}}
                onClick={() => { setShowDeleteModal(false); setDeletePassword(''); }}
              >
                Cancel
              </button>
              <button
                style={{padding: '10px 24px', borderRadius: 8, border: 'none', background: '#ff4444', color: 'white', fontSize: 14, fontWeight: '600', cursor: 'pointer'}}
                onClick={handleDeleteAccount}
              >
                Delete Account
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Sidebar;
