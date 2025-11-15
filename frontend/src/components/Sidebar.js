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
    { path: '/dashboard', label: 'Dashboard', icon: '🏠' },
    { path: '/lost-item', label: 'Report Lost Item', icon: '🔍' },
    { path: '/found-item', label: 'Report Found Item', icon: '📦' },
    { path: '/my-items', label: 'My Items', icon: '📋' },
    { path: '/matches', label: 'Matches', icon: '🎯' },
    { path: '/notifications', label: 'Notifications', icon: '🔔' },
    { path: '/messages', label: 'Messages', icon: '💬' }
  ];

  const bottomItems = [
    { path: '/profile', label: 'Settings', icon: '⚙️' },
    { path: '/help', label: 'Help & Support', icon: '❓' }
  ];

  const handleLogout = () => {
    onLogout();
    navigate('/login');
  };

  const SidebarContent = () => (
    <>
      {/* Logo Section */}
      <div style={{padding: '20px', borderBottom: '1px solid #E5E7EB'}}>
        <div style={{display: 'flex', alignItems: 'center', marginBottom: '20px'}}>
          <img style={{width: 40, height: 40, marginRight: 12}} src="/image/logo2%201.png" alt="Logo" />
          <h1 style={{color: '#03045E', fontSize: 24, fontWeight: '800', margin: 0}}>Back2U</h1>
        </div>
        
        {/* User Profile */}
        <div style={{display: 'flex', alignItems: 'center', gap: 12}}>
          <div style={{width: 40, height: 40, borderRadius: '50%', background: '#EBF5FD', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18}}>
            {user?.name?.charAt(0) || 'U'}
          </div>
          <div>
            <div style={{fontSize: 14, fontWeight: '600', color: '#1F2937'}}>{user?.name || 'User'}</div>
            <div style={{fontSize: 12, color: '#6B7280'}}>Student</div>
          </div>
        </div>
      </div>

      {/* Main Navigation */}
      <div style={{padding: '20px 0', flex: 1}}>
        {menuItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 12,
              padding: '12px 20px',
              textDecoration: 'none',
              color: location.pathname === item.path ? '#03045E' : '#6B7280',
              background: location.pathname === item.path ? '#EBF5FD' : 'transparent',
              borderRight: location.pathname === item.path ? '3px solid #03045E' : 'none',
              fontSize: 14,
              fontWeight: location.pathname === item.path ? '600' : '500',
              transition: 'all 0.2s'
            }}
            onMouseEnter={(e) => {
              if (location.pathname !== item.path) {
                e.target.style.background = '#F9FAFB';
              }
            }}
            onMouseLeave={(e) => {
              if (location.pathname !== item.path) {
                e.target.style.background = 'transparent';
              }
            }}
            onClick={() => setIsMobileOpen(false)}
          >
            <span style={{fontSize: 16}}>{item.icon}</span>
            {item.label}
          </Link>
        ))}
      </div>

      {/* Bottom Section */}
      <div style={{borderTop: '1px solid #E5E7EB', padding: '20px 0'}}>
        {bottomItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 12,
              padding: '12px 20px',
              textDecoration: 'none',
              color: location.pathname === item.path ? '#03045E' : '#6B7280',
              background: location.pathname === item.path ? '#EBF5FD' : 'transparent',
              fontSize: 14,
              fontWeight: location.pathname === item.path ? '600' : '500',
              transition: 'all 0.2s'
            }}
            onMouseEnter={(e) => {
              if (location.pathname !== item.path) {
                e.target.style.background = '#F9FAFB';
              }
            }}
            onMouseLeave={(e) => {
              if (location.pathname !== item.path) {
                e.target.style.background = 'transparent';
              }
            }}
            onClick={() => setIsMobileOpen(false)}
          >
            <span style={{fontSize: 16}}>{item.icon}</span>
            {item.label}
          </Link>
        ))}
        
        <button
          onClick={handleLogout}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 12,
            padding: '12px 20px',
            width: '100%',
            border: 'none',
            background: 'transparent',
            color: '#6B7280',
            fontSize: 14,
            fontWeight: '500',
            cursor: 'pointer',
            transition: 'all 0.2s'
          }}
          onMouseEnter={(e) => {
            e.target.style.background = '#FEF2F2';
            e.target.style.color = '#EF4444';
          }}
          onMouseLeave={(e) => {
            e.target.style.background = 'transparent';
            e.target.style.color = '#6B7280';
          }}
        >
          <span style={{fontSize: 16}}>🚪</span>
          Logout
        </button>
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
          background: 'white',
          borderRight: '1px solid #E5E7EB',
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
              background: 'white',
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