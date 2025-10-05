import React from 'react';
import { Link } from 'react-router-dom';

const Navbar = ({ user, onLogout }) => {
  return (
    <nav className="navbar">
      <div className="navbar-content">
        <Link to="/dashboard" className="navbar-brand">
          Back2U
        </Link>
        
        <ul className="navbar-nav">
          <li><Link to="/dashboard">Dashboard</Link></li>
          <li><Link to="/found-item">Report Found</Link></li>
          <li><Link to="/lost-item">Report Lost</Link></li>
          <li><Link to="/matches">My Matches</Link></li>
          <li>
            <span style={{ marginRight: '10px' }}>
              Hi, {user.name}
            </span>
          </li>
          <li>
            <button 
              onClick={onLogout}
              className="btn btn-secondary"
              style={{ padding: '8px 16px', fontSize: '14px' }}
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