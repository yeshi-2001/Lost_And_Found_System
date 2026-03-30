import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const NAV_ITEMS = [
  { path: '/dashboard',  label: 'Dashboard' },
  { path: '/lost-item',  label: 'Report Lost' },
  { path: '/found-item', label: 'Report Found' },
  { path: '/my-items',   label: 'My Items' },
  { path: '/matches',    label: 'Matches' },
  { path: '/notifications', label: 'Notifications' },
];

const AppNavbar = ({ user, onLogout }) => {
  const location = useLocation();

  return (
    <div style={{width: '100%', height: 80, background: 'linear-gradient(135deg, #1a0f0d 0%, #3E2723 35%, #6D4C41 70%, #8D6E63 100%)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 30px', boxSizing: 'border-box', position: 'sticky', top: 0, zIndex: 100, borderRadius: '0 0 24px 24px', overflow: 'visible'}}>
      {/* Left placeholder for balance */}
      <div style={{display: 'flex', alignItems: 'center', gap: 16, minWidth: 160}}></div>

      {/* Nav Links - centered pill */}
      <div style={{display: 'flex', alignItems: 'center', background: 'rgba(0,0,0,0.25)', borderRadius: 30, padding: '5px 8px', gap: 2, border: '1px solid rgba(255,255,255,0.15)', flex: 1, justifyContent: 'center', maxWidth: 700}}>
        {NAV_ITEMS.map(item => (
          <Link
            key={item.path}
            to={item.path}
            style={{
              color: location.pathname === item.path ? '#3E2723' : 'rgba(255,255,255,0.88)',
              background: location.pathname === item.path ? '#EFEBE9' : 'transparent',
              textDecoration: 'none',
              padding: '7px 15px',
              borderRadius: 22,
              fontSize: 15,
              fontWeight: location.pathname === item.path ? '700' : '500',
              transition: 'all 0.2s',
              whiteSpace: 'nowrap'
            }}
          >{item.label}</Link>
        ))}
      </div>

      {/* Right: placeholder for balance */}
      <div style={{display: 'flex', alignItems: 'center', gap: 12, minWidth: 160, justifyContent: 'flex-end'}}>
      </div>
    </div>
  );
};

export default AppNavbar;


