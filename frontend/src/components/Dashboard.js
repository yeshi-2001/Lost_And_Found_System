import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { itemsAPI, verificationAPI } from '../services/api';
import DeleteConfirmation from './DeleteConfirmation';

const Dashboard = ({ user, onLogout }) => {
  const [stats, setStats] = useState({
    foundItems: 0,
    lostItems: 0,
    matches: 0
  });
  const [recentItems, setRecentItems] = useState({
    found: [],
    lost: []
  });
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [showResults, setShowResults] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deletePassword, setDeletePassword] = useState('');
  const [deleteModal, setDeleteModal] = useState({ isOpen: false, itemId: null, itemType: null, itemName: '' });
  const [activeRecentTab, setActiveRecentTab] = useState('lost');
  const [welcomeInfo, setWelcomeInfo] = useState({
    welcome_message: 'Welcome back',
    activity_message: 'Everything is just as you left it ',
    change_details: [],
    changes: {}
  });

  useEffect(() => {
    loadDashboardData();
    loadWelcomeInfo();
  }, []);

  const loadDashboardData = async () => {
    try {
      const [foundResponse, lostResponse, matchesResponse] = await Promise.all([
        itemsAPI.getFoundItems().catch(err => ({ data: { items: [] } })),
        itemsAPI.getLostItems().catch(err => ({ data: { items: [] } })),
        verificationAPI.getMatches().catch(err => ({ data: { matches: [] } }))
      ]);

      setStats({
        foundItems: foundResponse.data.items?.length || 0,
        lostItems: lostResponse.data.items?.length || 0,
        matches: matchesResponse.data.matches?.length || 0
      });

      setRecentItems({
        found: foundResponse.data.items?.slice(0, 3) || [],
        lost: lostResponse.data.items?.slice(0, 3) || []
      });
    } catch (error) {
      console.error('Error loading dashboard data:', error);
    }
  };

  const loadWelcomeInfo = async () => {
    try {
      const response = await fetch('/api/dashboard/welcome-info', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      
      if (response.ok) {
        const data = await response.json();

        setWelcomeInfo(data);
      }
    } catch (error) {
      console.error('Error loading welcome info:', error);
    }
  };



  const handleLogout = () => { onLogout(); navigate('/login'); };

  const handleDeleteAccount = async () => {
    if (!deletePassword) { alert('Please enter your password to confirm.'); return; }
    try {
      const response = await fetch('http://localhost:5000/api/profile', {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({ password: deletePassword })
      });
      const data = await response.json();
      if (response.ok) { onLogout(); navigate('/login'); }
      else alert(data.error || 'Failed to delete account.');
    } catch { alert('Failed to delete account. Please try again.'); }
    setShowDeleteModal(false); setDeletePassword('');
  };

  const handleDeleteItem = (itemId, itemType, itemName) => {
    setDeleteModal({ isOpen: true, itemId, itemType, itemName });
  };

  const confirmDelete = async (reason) => {
    try {
      const response = await fetch(`/api/items/${deleteModal.itemId}/delete`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ type: deleteModal.itemType, reason })
      });
      
      if (response.ok) {
        // Reload dashboard data
        loadDashboardData();
      } else {
        console.error('Failed to delete item');
      }
    } catch (error) {
      console.error('Delete error:', error);
    }
  };

  const handleSearch = async (term) => {
    if (!term.trim()) {
      setSearchResults([]);
      return;
    }

    try {
      // Search in both found and lost items
      const [foundResponse, lostResponse] = await Promise.all([
        itemsAPI.getFoundItems().catch(() => ({ data: { items: [] } })),
        itemsAPI.getLostItems().catch(() => ({ data: { items: [] } }))
      ]);

      const allItems = [
        ...(foundResponse.data.items || []).map(item => ({ ...item, type: 'Found' })),
        ...(lostResponse.data.items || []).map(item => ({ ...item, type: 'Lost' }))
      ];

      // Filter items based on search term
      const filtered = allItems.filter(item => 
        item.item_name?.toLowerCase().includes(term.toLowerCase()) ||
        item.category?.toLowerCase().includes(term.toLowerCase()) ||
        item.location?.toLowerCase().includes(term.toLowerCase()) ||
        item.description?.toLowerCase().includes(term.toLowerCase())
      );

      setSearchResults(filtered.slice(0, 10)); // Limit to 10 results
    } catch (error) {
      console.error('Search error:', error);
      setSearchResults([]);
    }
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <div>Loading dashboard...</div>
      </div>
    );
  }

  return (
    <>
    <div style={{display: 'flex', minHeight: '100vh', fontFamily: 'Roboto, sans-serif', background: '#1a0f0d'}}>
      {/* Main Content */}
      <div style={{marginLeft: 0, flex: 1, padding: 0, overflow: 'auto', position: 'relative', background: 'none'}} onClick={() => setShowResults(false)}>

        {/* Top gradient navbar */}
        <div style={{width: '100%', height: 80, background: 'linear-gradient(135deg, #1a0f0d 0%, #3E2723 35%, #6D4C41 70%, #8D6E63 100%)', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 30px', boxSizing: 'border-box', position: 'sticky', top: 0, zIndex: 100, borderRadius: '0 0 24px 24px', overflow: 'visible'}}>
          {/* Left placeholder for balance */}
          <div style={{display: 'flex', alignItems: 'center', minWidth: 160}} />

          {/* Nav Links - centered */}
          <div style={{display: 'flex', alignItems: 'center', background: 'rgba(0,0,0,0.25)', borderRadius: 30, padding: '5px 8px', gap: 2, border: '1px solid rgba(255,255,255,0.15)', flex: 1, justifyContent: 'center', maxWidth: 700}}>
            {[
              { path: '/dashboard', label: 'Dashboard' },
              { path: '/lost-item', label: 'Report Lost' },
              { path: '/found-item', label: 'Report Found' },
              { path: '/my-items', label: 'My Items' },
              { path: '/matches', label: 'Matches' },
              { path: '/notifications', label: 'Notifications' }
            ].map(item => (
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

          {/* Right: logout + delete */}
          <div style={{display: 'flex', alignItems: 'center', gap: 12, minWidth: 160, justifyContent: 'flex-end'}}>
            <button onClick={handleLogout} style={{padding: '7px 16px', borderRadius: 20, border: '1px solid rgba(255,255,255,0.5)', background: 'transparent', color: 'white', fontSize: 13, fontWeight: '600', cursor: 'pointer'}}>Log Out</button>
            <button onClick={() => setShowDeleteModal(true)} style={{padding: '7px 16px', borderRadius: 20, border: '1px solid rgba(255,68,68,0.6)', background: 'transparent', color: '#ff8a80', fontSize: 13, fontWeight: '600', cursor: 'pointer'}}>Delete Account</button>
          </div>
        </div>

        {/* Welcome text on Layer 1 */}
        <div style={{padding: '30px 30px 60px', position: 'relative', zIndex: 2, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 20}}>
          <div style={{width: 73, height: 73, background: 'white', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 12px rgba(0,0,0,0.3)', overflow: 'hidden', flexShrink: 0, cursor: 'pointer'}} onClick={() => navigate('/home')}>
            <img src="/image/logo_black.png" alt="Logo" style={{width: 77, height: 77, objectFit: 'contain', display: 'block', margin: 'auto'}} />
          </div>
          <div>
            <h1 style={{fontSize: 32, fontWeight: '700', margin: '0 0 6px 0', fontFamily: 'Roboto Slab, serif', color: '#EFEBE9'}}>{welcomeInfo.welcome_message} {user?.name || 'User'}</h1>
            <p style={{fontSize: 18, color: '#D7CCC8', margin: 0, textAlign: 'center'}}>{welcomeInfo.activity_message}</p>
          </div>
        </div>
        <div style={{marginTop: -32, borderRadius: '24px 24px 0 0', background: 'linear-gradient(160deg, #4E342E 0%, #6D4C41 40%, #A1887F 80%, #D7CCC8 100%)', minHeight: 'calc(100vh - 48px)', boxShadow: '0 -6px 30px rgba(0,0,0,0.25)', position: 'relative', zIndex: 10, padding: window.innerWidth > 768 ? 30 : 20}}>
          {/* Corner fills */}
          <div style={{position: 'absolute', top: -32, left: 0, width: 24, height: 32, background: '#1a0f0d', zIndex: 9}} />
          <div style={{position: 'absolute', top: -32, right: 0, width: 24, height: 32, background: '#1a0f0d', zIndex: 9}} />

        {/* Layer 3 - content card, lightest layer */}
        <div style={{borderRadius: 20, background: 'linear-gradient(160deg, #8D6E63 0%, #A1887F 30%, #BCAAA4 65%, #EFEBE9 100%)', boxShadow: '0 4px 24px rgba(0,0,0,0.18)', padding: window.innerWidth > 768 ? 24 : 16, position: 'relative', overflow: 'hidden'}}>
          <div style={{position: 'absolute', inset: 0, backgroundImage: "url('/image/bg_new.png')", backgroundSize: 'cover', backgroundPosition: 'center', backgroundRepeat: 'no-repeat', opacity: 0.2, zIndex: 0, pointerEvents: 'none', borderRadius: 20}} />
          <div style={{position: 'relative', zIndex: 1}}>

          {welcomeInfo.change_details.length > 0 && (
            <div style={{background: 'rgba(255,255,255,0.25)', padding: 15, borderRadius: 10, border: '1px solid rgba(255,255,255,0.3)', marginBottom: 24}}>
              <div style={{fontSize: 14, fontWeight: '600', color: '#3E2723', marginBottom: 8}}>What's New:</div>
              <div style={{fontSize: 14, color: '#4E342E'}}>{welcomeInfo.change_details.join(' • ')}</div>
              <div style={{marginTop: 10, display: 'flex', gap: 10}}>
                {welcomeInfo.changes.new_matches > 0 && (
                  <Link to="/matches" style={{background: '#6D4C41', color: 'white', padding: '6px 12px', borderRadius: 6, textDecoration: 'none', fontSize: 12}}>View Matches</Link>
                )}
                {welcomeInfo.changes.pending_verifications > 0 && (
                  <Link to="/matches" style={{background: '#4E342E', color: 'white', padding: '6px 12px', borderRadius: 6, textDecoration: 'none', fontSize: 12}}>Complete Verification</Link>
                )}
              </div>
            </div>
          )}
        
        {/* Search Bar */}
        <div style={{display: 'flex', gap: 20, marginBottom: 30}}>
          <div style={{flex: 1, position: 'relative'}}>
            <input 
              type="text" 
              placeholder="Search items, categories, locations..." 
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                handleSearch(e.target.value);
              }}
              onFocus={() => setShowResults(true)}
              style={{
                width: '100%', 
                padding: '12px 40px 12px 15px', 
                border: '1px solid #8D6E63', 
                borderRadius: 10, 
                fontSize: 14,
                boxSizing: 'border-box',
                background: '#EFEBE9',
                color: '#3E2723'
              }} 
            />
            <img style={{position: 'absolute', right: 15, top: '50%', transform: 'translateY(-50%)', width: 16, height: 16}} src="/image/si_search-duotone.svg" alt="Search" />
            
            {/* Search Results Dropdown */}
            {showResults && searchTerm && (
              <div style={{
                position: 'absolute',
                top: '100%',
                left: 0,
                right: 0,
                background: '#6D4C41',
                border: '1px solid #8D6E63',
                borderRadius: 10,
                marginTop: 5,
                maxHeight: 300,
                overflowY: 'auto',
                zIndex: 1000,
                boxShadow: '0 4px 8px rgba(0,0,0,0.1)'
              }}>
                {searchResults.length > 0 ? (
                  searchResults.map((item, index) => (
                    <div key={index} style={{
                      padding: 15,
                      borderBottom: index < searchResults.length - 1 ? '1px solid #eee' : 'none',
                      cursor: 'pointer',
                      ':hover': {background: '#f5f5f5'}
                    }}>
                      <div style={{fontWeight: '600', marginBottom: 5, color: '#EFEBE9'}}>{item.item_name}</div>
                      <div style={{fontSize: 12, color: '#D7CCC8'}}>{item.category} • {item.location} • {item.type}</div>
                    </div>
                  ))
                ) : (
                  <div style={{padding: 15, color: '#D7CCC8', textAlign: 'center'}}>No items found</div>
                )}
              </div>
            )}
          </div>
          <div style={{padding: '10px 20px', border: '2px solid #8D6E63', borderRadius: 6, background: '#EFEBE9', fontSize: 12, display: 'flex', alignItems: 'center', color: '#3E2723'}}>
            {new Date().toLocaleDateString('en-US', { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' })}
          </div>
        </div>
        
          {/* Recent Items - Tabbed Interface */}
          <div style={{marginBottom: 24}}>
            {/* Tab Header */}
            <div style={{display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16}}>
              <div style={{display: 'flex', gap: 4, background: 'rgba(255,255,255,0.2)', borderRadius: 12, padding: 4}}>
                <button onClick={() => setActiveRecentTab('lost')} style={{padding: '8px 20px', borderRadius: 10, border: 'none', cursor: 'pointer', fontSize: 14, fontWeight: '600', transition: 'all 0.2s', background: activeRecentTab === 'lost' ? '#3E2723' : 'transparent', color: activeRecentTab === 'lost' ? 'white' : '#4E342E'}}>
                  Recent Lost
                </button>
                <button onClick={() => setActiveRecentTab('found')} style={{padding: '8px 20px', borderRadius: 10, border: 'none', cursor: 'pointer', fontSize: 14, fontWeight: '600', transition: 'all 0.2s', background: activeRecentTab === 'found' ? '#3E2723' : 'transparent', color: activeRecentTab === 'found' ? 'white' : '#4E342E'}}>
                  Recent Found
                </button>
              </div>
              <Link to="/my-items" style={{fontSize: 13, color: 'white', fontWeight: '600', textDecoration: 'none', background: '#3E2723', padding: '6px 16px', borderRadius: 20, border: '1px solid rgba(255,255,255,0.2)'}}>View All</Link>
            </div>

            {/* Tab Content */}
            <div style={{background: 'rgba(30,15,10,0.55)', borderRadius: 16, overflow: 'hidden', border: '1px solid rgba(255,255,255,0.1)'}}>
              {/* Table Header */}
              <div style={{display: 'grid', gridTemplateColumns: '2fr 1.2fr 1.2fr 1fr', padding: '12px 16px', background: 'rgba(20,8,4,0.7)', borderBottom: '1px solid rgba(255,255,255,0.15)'}}>
                <span style={{fontSize: 12, fontWeight: '700', color: '#EFEBE9', textTransform: 'uppercase', letterSpacing: 1}}>Item</span>
                <span style={{fontSize: 12, fontWeight: '700', color: '#EFEBE9', textTransform: 'uppercase', letterSpacing: 1}}>Category</span>
                <span style={{fontSize: 12, fontWeight: '700', color: '#EFEBE9', textTransform: 'uppercase', letterSpacing: 1}}>Location</span>
                <span style={{fontSize: 12, fontWeight: '700', color: '#EFEBE9', textTransform: 'uppercase', letterSpacing: 1}}>Date</span>
              </div>

              {/* Rows */}
              {(activeRecentTab === 'lost' ? recentItems.lost : recentItems.found).length > 0 ? (
                (activeRecentTab === 'lost' ? recentItems.lost : recentItems.found).map((item, index, arr) => (
                  <div key={item.id || index}
                    style={{display: 'grid', gridTemplateColumns: '2fr 1.2fr 1.2fr 1fr', padding: '12px 16px', borderBottom: index < arr.length - 1 ? '1px solid rgba(255,255,255,0.08)' : 'none', alignItems: 'center', transition: 'background 0.15s', cursor: 'default'}}
                    onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.08)'}
                    onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                  >
                    <div style={{display: 'flex', alignItems: 'center', gap: 10}}>
                      <span style={{fontSize: 18}}>{activeRecentTab === 'lost' ? '🔍' : '📦'}</span>
                      <span style={{fontSize: 14, fontWeight: '600', color: '#FFFFFF'}}>{item.item_name || 'Unknown Item'}</span>
                    </div>
                    <span style={{fontSize: 13, color: '#EFEBE9'}}>{item.category || '—'}</span>
                    <span style={{fontSize: 13, color: '#EFEBE9'}}>{item.location || item.location_found || item.location_lost || '—'}</span>
                    <span style={{fontSize: 12, color: '#D7CCC8'}}>{item.date_found || item.date_lost ? new Date(item.date_found || item.date_lost).toLocaleDateString('en-US', {month: 'short', day: 'numeric'}) : '—'}</span>
                  </div>
                ))
              ) : (
                <div style={{padding: '30px 16px', textAlign: 'center', color: '#EFEBE9', fontSize: 13}}>
                  {activeRecentTab === 'lost' ? '🔍 No lost items reported yet' : '📦 No found items reported yet'}
                </div>
              )}
            </div>
          </div>

          {/* Statistics */}
          <div style={{background: 'rgba(255,255,255,0.3)', borderRadius: 16, padding: 24, marginBottom: 24, border: '1px solid rgba(255,255,255,0.4)'}}>
            <h2 style={{color: '#3E2723', fontSize: 20, fontWeight: '800', marginBottom: 20}}>Your Statistics</h2>
            <div style={{display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16}}>
              {[
                { label: 'Items Found', value: stats.foundItems, color: '#4ade80', bg: 'rgba(74,222,128,0.15)', icon: '📦' },
                { label: 'Items Lost', value: stats.lostItems, color: '#ec4899', bg: 'rgba(236,72,153,0.15)', icon: '🔍' },
                { label: 'Matches', value: stats.matches, color: '#A1887F', bg: 'rgba(161,136,127,0.2)', icon: '🤝' }
              ].map((stat, i) => (
                <div key={i} style={{background: stat.bg, borderRadius: 14, padding: '20px 16px', textAlign: 'center', border: `1px solid ${stat.color}40`}}>
                  <div style={{fontSize: 28, marginBottom: 8}}>{stat.icon}</div>
                  <div style={{fontSize: 36, fontWeight: '900', color: stat.color, lineHeight: 1, marginBottom: 6}}>{stat.value}</div>
                  <div style={{fontSize: 13, fontWeight: '600', color: '#3E2723'}}>{stat.label}</div>
                  {/* Mini bar */}
                  <div style={{marginTop: 12, background: 'rgba(62,39,35,0.15)', borderRadius: 4, height: 6, overflow: 'hidden'}}>
                    <div style={{height: '100%', borderRadius: 4, background: stat.color, width: `${Math.min((stat.value / (Math.max(stats.foundItems, stats.lostItems, stats.matches, 1))) * 100, 100)}%`, transition: 'width 0.6s ease'}} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        
          </div> {/* end zIndex:1 wrapper */}
        </div> {/* end layer 3 */}
        </div> {/* end layer 2 */}
      </div> {/* end main content */}
    </div> {/* end outer */}

    <DeleteConfirmation
      isOpen={deleteModal.isOpen}
      onClose={() => setDeleteModal({ isOpen: false, itemId: null, itemType: null, itemName: '' })}
      onConfirm={confirmDelete}
      itemName={deleteModal.itemName}
      itemType={deleteModal.itemType}
    />

    {/* Delete Account Modal */}
    {showDeleteModal && (
      <div style={{position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999, padding: 20}}>
        <div style={{background: '#EFEBE9', border: '1px solid rgba(255,68,68,0.4)', borderRadius: 16, padding: 30, maxWidth: 420, width: '100%', textAlign: 'center'}}>
          <h3 style={{color: '#ff4444', fontSize: 20, margin: '0 0 12px 0'}}>Delete Account</h3>
          <p style={{color: '#5D4037', marginBottom: 16}}>Are you sure you want to permanently delete your account?</p>
          <p style={{color: '#ff4444', fontWeight: 'bold', fontSize: 13, marginBottom: 16}}>This action CANNOT be undone!</p>
          <input
            type="password"
            placeholder="Enter your password to confirm"
            value={deletePassword}
            onChange={(e) => setDeletePassword(e.target.value)}
            style={{width: '100%', padding: '10px 14px', borderRadius: 8, border: '1px solid #D7CCC8', background: '#D7CCC8', color: '#2C1810', fontSize: 14, marginBottom: 20, boxSizing: 'border-box', outline: 'none'}}
          />
          <div style={{display: 'flex', gap: 12, justifyContent: 'center'}}>
            <button style={{padding: '10px 24px', borderRadius: 8, border: '1px solid #6D4C41', background: 'transparent', color: '#3E2723', fontSize: 14, cursor: 'pointer'}} onClick={() => { setShowDeleteModal(false); setDeletePassword(''); }}>Cancel</button>
            <button style={{padding: '10px 24px', borderRadius: 8, border: 'none', background: '#ff4444', color: 'white', fontSize: 14, fontWeight: '600', cursor: 'pointer'}} onClick={handleDeleteAccount}>Delete Account</button>
          </div>
        </div>
      </div>
    )}
    </>
  );
};

export default Dashboard;



