import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { itemsAPI, verificationAPI } from '../services/api';
import DeleteConfirmation from './DeleteConfirmation';

const Dashboard = ({ user }) => {
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
  const [deleteModal, setDeleteModal] = useState({ isOpen: false, itemId: null, itemType: null, itemName: '' });
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
    <div style={{display: 'flex', minHeight: '100vh', fontFamily: 'Roboto, sans-serif'}}>
      {/* Main Content */}
      <div style={{marginLeft: window.innerWidth > 768 ? 280 : 0, flex: 1, padding: window.innerWidth > 768 ? 30 : 20, paddingTop: window.innerWidth <= 768 ? 80 : 30, overflow: 'auto', position: 'relative', background: 'linear-gradient(150deg, #2d1245 0%, #4a1060 40%, #5e1a58 70%, #8b3a6e 100%)'}} onClick={() => setShowResults(false)}>
        {/* Layered blur background design */}
        <div style={{position: 'fixed', top: 0, left: window.innerWidth > 768 ? 280 : 0, right: 0, bottom: 0, zIndex: 0, pointerEvents: 'none'}}>
          <div style={{position: 'absolute', top: '-10%', right: '-5%', width: '55%', height: '50%', background: 'radial-gradient(ellipse, rgba(139,58,110,0.4) 0%, transparent 70%)', filter: 'blur(65px)'}} />
          <div style={{position: 'absolute', bottom: '-10%', left: '-5%', width: '50%', height: '50%', background: 'radial-gradient(ellipse, rgba(45,18,69,0.6) 0%, transparent 70%)', filter: 'blur(75px)'}} />
          <div style={{position: 'absolute', top: '35%', left: '20%', width: '45%', height: '35%', background: 'radial-gradient(ellipse, rgba(94,26,88,0.35) 0%, transparent 70%)', filter: 'blur(55px)'}} />
          {/* Diagonal lines */}
          <div style={{position: 'absolute', inset: 0, backgroundImage: 'repeating-linear-gradient(135deg, rgba(255,255,255,0.03) 0px, rgba(255,255,255,0.03) 1px, transparent 1px, transparent 60px)'}} />
          <div style={{position: 'absolute', inset: 0, backgroundImage: 'repeating-linear-gradient(45deg, rgba(255,255,255,0.02) 0px, rgba(255,255,255,0.02) 1px, transparent 1px, transparent 80px)'}} />
          {/* bg image overlay */}
          <div style={{position: 'absolute', inset: 0, backgroundImage: 'url(/image/bg.png)', backgroundSize: '80%', backgroundPosition: 'center', backgroundRepeat: 'no-repeat', opacity: 0.18}} />
        </div>
        <div style={{position: 'relative', zIndex: 1}}>
          <div style={{marginBottom: 30}}>
          <h1 style={{fontSize: 32, fontWeight: '700', margin: '0 0 10px 0', fontFamily: 'Roboto Slab, serif', color: '#e9d5ff'}}>{welcomeInfo.welcome_message} {user?.name || 'User'}</h1>
          <p style={{fontSize: 18, color: '#c4b5d4', margin: '0 0 10px 0'}}>{welcomeInfo.activity_message}</p>
          {welcomeInfo.change_details.length > 0 && (
            <div style={{background: '#3d2b4e', padding: 15, borderRadius: 10, border: '1px solid #7C3AED'}}>
              <div style={{fontSize: 14, fontWeight: '600', color: '#e9d5ff', marginBottom: 8}}>What's New:</div>
              <div style={{fontSize: 14, color: '#c4b5d4'}}>{welcomeInfo.change_details.join(' • ')}</div>
              <div style={{marginTop: 10, display: 'flex', gap: 10}}>
                {welcomeInfo.changes.new_matches > 0 && (
                  <Link to="/matches" style={{background: '#806699', color: 'white', padding: '6px 12px', borderRadius: 6, textDecoration: 'none', fontSize: 12}}>View Matches</Link>
                )}
                {welcomeInfo.changes.pending_verifications > 0 && (
                  <Link to="/matches" style={{background: '#F59E0B', color: 'white', padding: '6px 12px', borderRadius: 6, textDecoration: 'none', fontSize: 12}}>Complete Verification</Link>
                )}
              </div>
            </div>
          )}
        </div>
        
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
                border: '1px solid #5c4d66', 
                borderRadius: 10, 
                fontSize: 14,
                boxSizing: 'border-box',
                background: '#3d2b4e',
                color: '#e9d5ff'
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
                background: '#3d2b4e',
                border: '1px solid #5c4d66',
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
                      <div style={{fontWeight: '600', marginBottom: 5, color: '#e9d5ff'}}>{item.item_name}</div>
                      <div style={{fontSize: 12, color: '#c4b5d4'}}>{item.category} • {item.location} • {item.type}</div>
                    </div>
                  ))
                ) : (
                  <div style={{padding: 15, color: '#c4b5d4', textAlign: 'center'}}>No items found</div>
                )}
              </div>
            )}
          </div>
          <div style={{padding: '10px 20px', border: '2px solid #5c4d66', borderRadius: 6, background: '#3d2b4e', fontSize: 12, display: 'flex', alignItems: 'center', color: '#e9d5ff'}}>
            📅 {new Date().toLocaleDateString('en-US', { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' })}
          </div>
        </div>
        
        {/* Statistics */}
        <div style={{background: 'rgba(109, 40, 217, 0.50)', borderRadius: 20, padding: 30, marginBottom: 30}}>
          <h2 style={{color: '#e9d5ff', fontSize: 20, fontWeight: '800', marginBottom: 20}}>Your Statistics</h2>
          <div style={{display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 20}}>
            <div style={{background: '#3d2b4e', padding: 20, borderRadius: 12, textAlign: 'center', border: '2px solid #7C3AED', boxShadow: '0 4px 8px rgba(0,0,0,0.4)'}}>
              <div style={{fontSize: 24, fontWeight: '600', color: '#e9d5ff', marginBottom: 5}}>{stats.foundItems}</div>
              <div style={{fontSize: 16, fontWeight: '600', color: '#c4b5d4'}}>Items Found</div>
            </div>
            <div style={{background: '#3d2b4e', padding: 20, borderRadius: 12, textAlign: 'center', border: '2px solid #7C3AED', boxShadow: '0 4px 8px rgba(0,0,0,0.4)'}}>
              <div style={{fontSize: 24, fontWeight: '600', color: '#e9d5ff', marginBottom: 5}}>{stats.lostItems}</div>
              <div style={{fontSize: 16, fontWeight: '600', color: '#c4b5d4'}}>Items Lost</div>
            </div>
            <div style={{background: '#3d2b4e', padding: 20, borderRadius: 12, textAlign: 'center', border: '2px solid #7C3AED', boxShadow: '0 4px 8px rgba(0,0,0,0.4)'}}>
              <div style={{fontSize: 24, fontWeight: '600', color: '#e9d5ff', marginBottom: 5}}>{stats.matches}</div>
              <div style={{fontSize: 16, fontWeight: '600', color: '#c4b5d4'}}>Potential Matches</div>
            </div>
          </div>
        </div>
        
        {/* Action Cards */}
        <div style={{display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 20, marginBottom: 30, position: 'relative', zIndex: 1}}>
          <Link to="/found-item" style={{textDecoration: 'none'}}>
            <div style={{
              background: 'linear-gradient(135deg, rgba(166,77,121,0.25) 0%, rgba(79,28,81,0.4) 100%)',
              backdropFilter: 'blur(10px)',
              padding: 25, borderRadius: 20,
              border: '1px solid rgba(255,255,255,0.15)',
              cursor: 'pointer', height: 120,
              display: 'flex', flexDirection: 'column', justifyContent: 'space-between',
              boxShadow: '0 8px 32px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.1)',
              transition: 'transform 0.2s, box-shadow 0.2s'
            }}
            onMouseEnter={e => { e.currentTarget.style.transform='translateY(-4px)'; e.currentTarget.style.boxShadow='0 12px 40px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.15)'; }}
            onMouseLeave={e => { e.currentTarget.style.transform='translateY(0)'; e.currentTarget.style.boxShadow='0 8px 32px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.1)'; }}
            >
              <div style={{fontSize: 16, fontWeight: '800', color: '#00e676', textAlign: 'center', letterSpacing: 0.3, textShadow: '-1px -1px 0 #000, 1px -1px 0 #000, -1px 1px 0 #000, 1px 1px 0 #000'}}>Report Found Item</div>
              <div style={{fontSize: 13, color: 'rgba(237,200,255,0.85)', textAlign: 'center', lineHeight: 1.5}}>Found something?<br/>Help someone get their item back!</div>
            </div>
          </Link>

          <Link to="/lost-item" style={{textDecoration: 'none'}}>
            <div style={{
              background: 'linear-gradient(135deg, rgba(166,77,121,0.25) 0%, rgba(79,28,81,0.4) 100%)',
              backdropFilter: 'blur(10px)',
              padding: 25, borderRadius: 20,
              border: '1px solid rgba(255,255,255,0.15)',
              cursor: 'pointer', height: 120,
              display: 'flex', flexDirection: 'column', justifyContent: 'space-between',
              boxShadow: '0 8px 32px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.1)',
              transition: 'transform 0.2s, box-shadow 0.2s'
            }}
            onMouseEnter={e => { e.currentTarget.style.transform='translateY(-4px)'; e.currentTarget.style.boxShadow='0 12px 40px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.15)'; }}
            onMouseLeave={e => { e.currentTarget.style.transform='translateY(0)'; e.currentTarget.style.boxShadow='0 8px 32px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.1)'; }}
            >
              <div style={{fontSize: 16, fontWeight: '800', color: '#ff4444', textAlign: 'center', letterSpacing: 0.3, textShadow: '-1px -1px 0 #000, 1px -1px 0 #000, -1px 1px 0 #000, 1px 1px 0 #000'}}>Report Lost Item</div>
              <div style={{fontSize: 13, color: 'rgba(237,200,255,0.85)', textAlign: 'center', lineHeight: 1.5}}>Lost something?<br/>Let others know what you're looking for!</div>
            </div>
          </Link>

          <Link to="/matches" style={{textDecoration: 'none'}}>
            <div style={{
              background: 'linear-gradient(135deg, rgba(166,77,121,0.25) 0%, rgba(79,28,81,0.4) 100%)',
              backdropFilter: 'blur(10px)',
              padding: 25, borderRadius: 20,
              border: '1px solid rgba(255,255,255,0.15)',
              cursor: 'pointer', height: 120,
              display: 'flex', flexDirection: 'column', justifyContent: 'space-between',
              boxShadow: '0 8px 32px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.1)',
              transition: 'transform 0.2s, box-shadow 0.2s'
            }}
            onMouseEnter={e => { e.currentTarget.style.transform='translateY(-4px)'; e.currentTarget.style.boxShadow='0 12px 40px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.15)'; }}
            onMouseLeave={e => { e.currentTarget.style.transform='translateY(0)'; e.currentTarget.style.boxShadow='0 8px 32px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.1)'; }}
            >
              <div style={{fontSize: 16, fontWeight: '800', color: '#4fc3f7', textAlign: 'center', letterSpacing: 0.3, textShadow: '-1px -1px 0 #000, 1px -1px 0 #000, -1px 1px 0 #000, 1px 1px 0 #000'}}>View Matches</div>
              <div style={{fontSize: 13, color: 'rgba(237,200,255,0.85)', textAlign: 'center', lineHeight: 1.5}}>Check potential matches and verify ownership</div>
            </div>
          </Link>
        </div>
        
        {/* Recent Items */}
        <div style={{display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 20}}>
          {/* Recent Found Items */}
          <div style={{background: '#3d2b4e', border: '1px solid #5c4d66', borderRadius: 20, padding: 20, position: 'relative'}}>
            <div style={{position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundImage: 'url(/image/icon_g1.png)', backgroundSize: '50%', backgroundPosition: 'center', backgroundRepeat: 'no-repeat', opacity: 0.1, borderRadius: 20, zIndex: 0}}></div>
            <div style={{position: 'relative', zIndex: 1}}>
            <h3 style={{fontSize: 16, fontWeight: '800', marginBottom: 15, color: '#e9d5ff'}}>Recent Found Items</h3>
            {recentItems.found.length > 0 ? (
              recentItems.found.map((item, index) => (
                <div key={item.id || index} style={{marginBottom: 15, paddingBottom: 10, borderBottom: index < recentItems.found.length - 1 ? '1px solid #eee' : 'none'}}>
                  <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                    <div>
                      <div style={{fontSize: 14, fontWeight: '600', color: '#e9d5ff', marginBottom: 2}}>{item.item_name || 'Unknown Item'}</div>
                      <div style={{fontSize: 12, color: '#c4b5d4'}}>{item.category || 'Category'} • {item.location || 'Location'}</div>
                    </div>
                    <button 
                      style={{background: '#EF4444', color: 'white', border: 'none', borderRadius: 4, padding: '4px 8px', fontSize: 12, cursor: 'pointer'}}
                      onClick={() => handleDeleteItem(item.id, 'found', item.item_name)}
                    >
                      ✗
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <div style={{fontSize: 12, color: '#c4b5d4', textAlign: 'center', padding: 20}}>No found items yet</div>
            )}
            </div>
          </div>
          
          {/* Recent Lost Items */}
          <div style={{background: '#3d2b4e', border: '1px solid #5c4d66', borderRadius: 20, padding: 20, position: 'relative'}}>
            <div style={{position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundImage: 'url(/image/icon1.png)', backgroundSize: '50%', backgroundPosition: 'center', backgroundRepeat: 'no-repeat', opacity: 0.1, borderRadius: 20, zIndex: 0}}></div>
            <div style={{position: 'relative', zIndex: 1}}>
            <h3 style={{fontSize: 16, fontWeight: '800', marginBottom: 15, color: '#e9d5ff'}}>Recent Lost Items</h3>
            {recentItems.lost.length > 0 ? (
              recentItems.lost.map((item, index) => (
                <div key={item.id || index} style={{marginBottom: 15, paddingBottom: 10, borderBottom: index < recentItems.lost.length - 1 ? '1px solid #eee' : 'none'}}>
                  <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                    <div>
                      <div style={{fontSize: 14, fontWeight: '600', color: '#e9d5ff', marginBottom: 2}}>{item.item_name || 'Unknown Item'}</div>
                      <div style={{fontSize: 12, color: '#c4b5d4'}}>{item.category || 'Category'} • {item.location || 'Location'}</div>
                    </div>
                    <button 
                      style={{background: '#EF4444', color: 'white', border: 'none', borderRadius: 4, padding: '4px 8px', fontSize: 12, cursor: 'pointer'}}
                      onClick={() => handleDeleteItem(item.id, 'lost', item.item_name)}
                    >
                      ✗
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <div style={{fontSize: 12, color: '#c4b5d4', textAlign: 'center', padding: 20}}>No lost items yet</div>
            )}
            </div>
          </div>
        </div>
        </div>
      </div>
      
      <DeleteConfirmation
        isOpen={deleteModal.isOpen}
        onClose={() => setDeleteModal({ isOpen: false, itemId: null, itemType: null, itemName: '' })}
        onConfirm={confirmDelete}
        itemName={deleteModal.itemName}
        itemType={deleteModal.itemType}
      />
    </div>
  );
};

export default Dashboard;
