import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { itemsAPI, verificationAPI } from '../services/api';

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
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      const [foundResponse, lostResponse, matchesResponse] = await Promise.all([
        itemsAPI.getFoundItems().catch(err => ({ data: { items: [] } })),
        itemsAPI.getLostItems().catch(err => ({ data: { items: [] } })),
        verificationAPI.getMatches(user.id).catch(err => ({ data: { matches: [] } }))
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
      setStats({ foundItems: 0, lostItems: 0, matches: 0 });
      setRecentItems({ found: [], lost: [] });
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="loading">
        <div className="spinner"></div>
        <p>Loading dashboard...</p>
      </div>
    );
  }

  return (
    <div className="container dashboard">
      <div className="dashboard-header">
        <h1>Welcome back, {user.name}! 👋</h1>
        <p>Manage your lost and found items from your dashboard</p>
      </div>

      {/* Quick Actions */}
      <div className="dashboard-actions">
        <div className="action-card">
          <h3>📱 Report Found Item</h3>
          <p>Found something? Help someone get their item back!</p>
          <Link to="/found-item" className="btn btn-primary">
            Report Found Item
          </Link>
        </div>

        <div className="action-card">
          <h3>🔍 Report Lost Item</h3>
          <p>Lost something? Let others know what you're looking for!</p>
          <Link to="/lost-item" className="btn btn-success">
            Report Lost Item
          </Link>
        </div>

        <div className="action-card">
          <h3>🎯 View Matches</h3>
          <p>Check potential matches and verify ownership</p>
          <Link to="/matches" className="btn btn-secondary">
            View Matches ({stats.matches})
          </Link>
        </div>
      </div>

      {/* Statistics */}
      <div className="card">
        <div className="card-header">
          <h3 className="card-title">📊 Your Statistics</h3>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px' }}>
          <div style={{ textAlign: 'center', padding: '20px', background: '#f8f9fa', borderRadius: '10px' }}>
            <h2 style={{ color: '#28a745', margin: '0' }}>{stats.foundItems}</h2>
            <p style={{ margin: '5px 0 0 0' }}>Items Found</p>
          </div>
          <div style={{ textAlign: 'center', padding: '20px', background: '#f8f9fa', borderRadius: '10px' }}>
            <h2 style={{ color: '#dc3545', margin: '0' }}>{stats.lostItems}</h2>
            <p style={{ margin: '5px 0 0 0' }}>Items Lost</p>
          </div>
          <div style={{ textAlign: 'center', padding: '20px', background: '#f8f9fa', borderRadius: '10px' }}>
            <h2 style={{ color: '#007bff', margin: '0' }}>{stats.matches}</h2>
            <p style={{ margin: '5px 0 0 0' }}>Potential Matches</p>
          </div>
        </div>
      </div>

      {/* Recent Items */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '20px' }}>
        {/* Recent Found Items */}
        <div className="card">
          <div className="card-header">
            <h3 className="card-title">📱 Recent Found Items</h3>
          </div>
          {recentItems.found.length > 0 ? (
            recentItems.found.map(item => (
              <div key={item.id} style={{ padding: '15px', borderBottom: '1px solid #eee' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <h4 style={{ margin: '0 0 5px 0' }}>{item.item_name}</h4>
                    <p style={{ margin: '0', color: '#666', fontSize: '14px' }}>
                      {item.category} • {item.location} • {item.reference_id}
                    </p>
                  </div>
                  <span style={{
                    padding: '4px 8px',
                    borderRadius: '4px',
                    fontSize: '12px',
                    fontWeight: 'bold',
                    background: item.status === 'returned' ? '#d4edda' : '#e7f3ff',
                    color: item.status === 'returned' ? '#155724' : '#0066cc'
                  }}>
                    {item.status === 'returned' ? '✅ Returned' : '📱 Active'}
                  </span>
                </div>
              </div>
            ))
          ) : (
            <p style={{ textAlign: 'center', color: '#666', padding: '20px' }}>
              No found items yet
            </p>
          )}
        </div>

        {/* Recent Lost Items */}
        <div className="card">
          <div className="card-header">
            <h3 className="card-title">🔍 Recent Lost Items</h3>
          </div>
          {recentItems.lost.length > 0 ? (
            recentItems.lost.map(item => (
              <div key={item.id} style={{ padding: '15px', borderBottom: '1px solid #eee' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <h4 style={{ margin: '0 0 5px 0' }}>{item.item_name}</h4>
                    <p style={{ margin: '0', color: '#666', fontSize: '14px' }}>
                      {item.category} • {item.location} • {item.reference_id}
                    </p>
                  </div>
                  <span style={{
                    padding: '4px 8px',
                    borderRadius: '4px',
                    fontSize: '12px',
                    fontWeight: 'bold',
                    background: item.status === 'recovered' ? '#d4edda' : '#fff3cd',
                    color: item.status === 'recovered' ? '#155724' : '#856404'
                  }}>
                    {item.status === 'recovered' ? '✅ Recovered' : '🔍 Searching'}
                  </span>
                </div>
              </div>
            ))
          ) : (
            <p style={{ textAlign: 'center', color: '#666', padding: '20px' }}>
              No lost items yet
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;