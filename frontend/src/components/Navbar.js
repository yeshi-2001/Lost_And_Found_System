import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const Navbar = ({ user, onLogout }) => {
  const location = useLocation();
  
  return (
    <nav className="navbar">
      <div className="navbar-content">
        <Link to="/dashboard" className="navbar-brand">
          Back2U
        </Link>
        
        <ul className="navbar-nav">
          <li>
            <Link 
              to="/dashboard" 
              style={{
                backgroundColor: location.pathname === '/dashboard' ? '#001D3D' : 'transparent',
                fontWeight: location.pathname === '/dashboard' ? 'bold' : 'normal'
              }}
            >
              Dashboard
            </Link>
          </li>
          <li>
            <Link 
              to="/found-item" 
              style={{
                backgroundColor: location.pathname === '/found-item' ? '#001D3D' : 'transparent',
                fontWeight: location.pathname === '/found-item' ? 'bold' : 'normal'
              }}
            >
              Report Found
            </Link>
          </li>
          <li>
            <Link 
              to="/lost-item" 
              style={{
                backgroundColor: location.pathname === '/lost-item' ? '#001D3D' : 'transparent',
                fontWeight: location.pathname === '/lost-item' ? 'bold' : 'normal'
              }}
            >
              Report Lost
            </Link>
          </li>
          <li>
            <Link 
              to="/matches" 
              style={{
                backgroundColor: location.pathname === '/matches' ? '#001D3D' : 'transparent',
                fontWeight: location.pathname === '/matches' ? 'bold' : 'normal'
              }}
            >
              My Matches
            </Link>
          </li>
          <li>
            <Link 
              to="/profile" 
              style={{
                backgroundColor: location.pathname === '/profile' ? '#001D3D' : 'transparent',
                fontWeight: location.pathname === '/profile' ? 'bold' : 'normal'
              }}
            >
              Profile
            </Link>
          </li>
          <li>
            <span style={{ marginRight: '10px' }}>
              Hi, {user.name}
            </span>
          </li>
          <li>
            <button 
              onClick={onLogout}
              style={{ 
                padding: '8px 16px', 
                fontSize: '14px',
                backgroundColor: '#ff6b6b',
                color: 'white',
                border: 'none',
                borderRadius: '5px',
                cursor: 'pointer',
                transition: 'background-color 0.3s',
                fontWeight: '600'
              }}
              onMouseEnter={(e) => e.target.style.backgroundColor = '#ff5252'}
              onMouseLeave={(e) => e.target.style.backgroundColor = '#ff6b6b'}
            >
              Logout
            </button>
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;