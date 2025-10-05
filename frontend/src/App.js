import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './components/Login';
import Register from './components/Register';
import ForgotPassword from './components/ForgotPassword';
import ResetPassword from './components/ResetPassword';
import Home from './components/Home';
import Dashboard from './components/Dashboard';
import FoundItemForm from './components/FoundItemForm';
import LostItemForm from './components/LostItemForm';
import Matches from './components/Matches';
import Verification from './components/Verification';
import Navbar from './components/Navbar';
import './App.css';

function App() {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token'));

  useEffect(() => {
    if (token) {
      const userData = localStorage.getItem('user');
      if (userData) {
        setUser(JSON.parse(userData));
      }
    }
  }, [token]);

  const login = (userData, authToken) => {
    setUser(userData);
    setToken(authToken);
    localStorage.setItem('token', authToken);
    localStorage.setItem('user', JSON.stringify(userData));
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  };

  return (
    <Router>
      <div className="App">
        {user && <Navbar user={user} onLogout={logout} />}
        
        <Routes>
          <Route 
            path="/login" 
            element={!user ? <Login onLogin={login} /> : <Navigate to="/home" />} 
          />
          <Route 
            path="/register" 
            element={!user ? <Register onLogin={login} /> : <Navigate to="/dashboard" />} 
          />
          <Route 
            path="/forgot-password" 
            element={!user ? <ForgotPassword /> : <Navigate to="/dashboard" />} 
          />
          <Route 
            path="/reset-password/:token" 
            element={!user ? <ResetPassword /> : <Navigate to="/dashboard" />} 
          />
          <Route 
            path="/home" 
            element={<Home user={user} onLogout={logout} />} 
          />
          <Route 
            path="/dashboard" 
            element={user ? <Dashboard user={user} /> : <Navigate to="/login" />} 
          />
          <Route 
            path="/found-item" 
            element={user ? <FoundItemForm token={token} /> : <Navigate to="/login" />} 
          />
          <Route 
            path="/lost-item" 
            element={user ? <LostItemForm token={token} /> : <Navigate to="/login" />} 
          />
          <Route 
            path="/matches" 
            element={user ? <Matches user={user} token={token} /> : <Navigate to="/login" />} 
          />
          <Route 
            path="/verification/:matchId" 
            element={user ? <Verification token={token} /> : <Navigate to="/login" />} 
          />
          <Route 
            path="/" 
            element={<Navigate to="/home" />} 
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;