import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import MobileMenuButton from './MobileMenuButton';

const Sidebar = ({ user, onLogout }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

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
    { path: '/dashboard', label: 'Dashboard', icon: '⌂' },
    { path: '/lost-item', label: 'Report Lost Item', icon: '⚠' },
    { path: '/found-item', label: 'Report Found Item', icon: '⊞' },
    { path: '/my-items', label: 'My Items', icon: '☰' },
    { path: '/matches', label: 'Matches', icon: '◉' },
    { path: '/notifications', label: 'Notifications', icon: '◐' },
    { path: '/messages', label: 'Messages', icon: '✉' }
  ];

  const bottomItems = [
    { path: '/profile', label: 'Settings', icon: '⚙' },
    { path: '/help', label: 'Help & Support', icon: '?' }
  ];

  const handleLogout = () => {
    onLogout();
    navigate('/login');
  };

  const SidebarContent = () => (
    <>
      {/* Logo Section */}
      <div style={{padding: '20px'}}>
        <div style={{display: 'flex', alignItems: 'center', marginBottom: '40px'}}>
          <img style={{width: 80, height: 80, objectFit: 'contain', marginRight: 15}} src="/image/logo2_1.png" alt="Logo" />
          <h1 style={{color: '#03045E', fontSize: 28, fontWeight: '800', margin: 0}}>Back2U</h1>
        </div>
      </div>

      {/* Main Navigation */}
      <nav style={{flex: 1, padding: '0 20px'}}>
        {menuItems.map((item) => {
          const isActive = location.pathname === item.path;
          return isActive ? (
            <div key={item.path} style={{background: 'white', padding: 15, borderRadius: 15, marginBottom: 20, boxShadow: '0 4px 8px rgba(0,0,0,0.1)'}}>
              <div style={{color: '#03045E', fontSize: 16, fontWeight: '700', display: 'flex', alignItems: 'center', gap: 8}}>
                <span style={{color: '#03045E', fontSize: 18}}>{item.icon}</span>
                {item.label}
              </div>
            </div>
          ) : (
            <Link
              key={item.path}
              to={item.path}
              style={{
                textDecoration: 'none',
                display: 'flex',
                alignItems: 'center',
                gap: 8,
                padding: '15px 0',
                color: '#03045E',
                fontSize: 16,
                fontWeight: '700'
              }}
              onClick={() => setIsMobileOpen(false)}
            >
              <span style={{color: '#03045E', fontSize: 18}}>{item.icon}</span>
              {item.label}
            </Link>
          );
        })}
      </nav>

      {/* Bottom Section */}
      <div style={{marginTop: 'auto', padding: '0 20px 20px'}}>
        {bottomItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <Link
              key={item.path}
              to={item.path}
              style={{
                textDecoration: 'none',
                display: 'flex',
                alignItems: 'center',
                gap: 10,
                padding: '10px 0',
                color: '#03045E',
                fontSize: 16,
                fontWeight: '700'
              }}
              onClick={() => setIsMobileOpen(false)}
            >
              <span style={{color: '#03045E', fontSize: 18}}>{item.icon}</span>
              {item.label}
            </Link>
          );
        })}
        
        <div 
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 10,
            padding: '10px 0',
            color: '#03045E',
            fontSize: 16,
            fontWeight: '700',
            cursor: 'pointer'
          }}
          onClick={handleLogout}
        >
          <span style={{color: '#03045E', fontSize: 18}}>⏻</span>
          Log Out
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
          background: '#D1E7F5',
          display: 'flex',
          flexDirection: 'column',
          zIndex: 1000,
          transform: isMobile ? 'translateX(-100%)' : 'translateX(0)',
          transition: 'transform 0.3s ease'
        }}
      >
        <SidebarContent />
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
              background: '#D1E7F5',
              display: 'flex',
              flexDirection: 'column',
              zIndex: 1002,
              transform: 'translateX(0)',
              transition: 'transform 0.3s ease'
            }}
          >
            <SidebarContent />
          </div>
        </>
      )}
    </>
  );
};

export default Sidebar;