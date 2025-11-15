import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const ItemCleanup = ({ user, token }) => {
  const [cleanupData, setCleanupData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    loadCleanupPreview();
  }, []);

  const loadCleanupPreview = async () => {
    try {
      const response = await fetch('/api/cleanup/preview', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        setCleanupData(data);
      }
    } catch (error) {
      console.error('Failed to load cleanup preview:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCleanupResolved = async () => {
    if (!window.confirm('Delete all resolved items? This action cannot be undone after 30 days.')) {
      return;
    }

    setDeleting(true);
    try {
      const response = await fetch('/api/cleanup/resolved', {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (response.ok) {
        const result = await response.json();
        setMessage(result.message);
        loadCleanupPreview();
      } else {
        const error = await response.json();
        setMessage(error.error);
      }
    } catch (error) {
      setMessage('Failed to delete items');
    } finally {
      setDeleting(false);
    }
  };

  const handleCleanupOld = async () => {
    if (!window.confirm('Delete old unmatched items (60+ days)? This action cannot be undone after 30 days.')) {
      return;
    }

    setDeleting(true);
    try {
      const response = await fetch('/api/cleanup/old', {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (response.ok) {
        const result = await response.json();
        setMessage(result.message);
        loadCleanupPreview();
      } else {
        const error = await response.json();
        setMessage(error.error);
      }
    } catch (error) {
      setMessage('Failed to delete items');
    } finally {
      setDeleting(false);
    }
  };

  if (loading) {
    return (
      <div style={{minHeight: '100vh', background: '#EFF6FF', padding: 20, fontFamily: 'Inter, sans-serif'}}>
        <div style={{maxWidth: 800, margin: '0 auto'}}>
          <p>Loading cleanup options...</p>
        </div>
      </div>
    );
  }

  return (
    <div style={{minHeight: '100vh', background: '#EFF6FF', padding: 20, fontFamily: 'Inter, sans-serif'}}>
      <div style={{maxWidth: 800, margin: '0 auto'}}>
        <div style={{marginBottom: 30}}>
          <Link 
            to="/dashboard" 
            style={{background: 'none', border: 'none', color: '#03045E', fontSize: 16, cursor: 'pointer', marginBottom: 20, display: 'flex', alignItems: 'center', gap: 8, textDecoration: 'none'}}
          >
            ← Back to Dashboard
          </Link>
          <h1 style={{fontSize: 32, fontWeight: '800', margin: '0 0 10px 0'}}>🗑️ Clean Up My Items</h1>
          <p style={{fontSize: 18, color: '#666', margin: 0}}>Organize your account by removing old and resolved items</p>
        </div>

        {message && (
          <div style={{background: '#D1FAE5', color: '#065F46', padding: 15, borderRadius: 8, marginBottom: 20}}>
            {message}
          </div>
        )}

        <div style={{background: 'white', borderRadius: 16, padding: 30, boxShadow: '0 4px 6px rgba(0,0,0,0.1)', marginBottom: 20}}>
          <h2 style={{fontSize: 24, fontWeight: '700', marginBottom: 20, color: '#03045E'}}>Cleanup Summary</h2>
          
          {cleanupData && cleanupData.total_items > 0 ? (
            <>
              <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 20, marginBottom: 30}}>
                <div style={{background: '#FEF3C7', padding: 20, borderRadius: 12, textAlign: 'center'}}>
                  <div style={{fontSize: 32, fontWeight: 'bold', color: '#92400E'}}>{cleanupData.resolved_matches_count}</div>
                  <div style={{color: '#92400E'}}>Resolved Items</div>
                  <div style={{fontSize: 12, color: '#92400E', marginTop: 5}}>Successfully returned</div>
                </div>
                
                <div style={{background: '#DBEAFE', padding: 20, borderRadius: 12, textAlign: 'center'}}>
                  <div style={{fontSize: 32, fontWeight: 'bold', color: '#1E40AF'}}>{cleanupData.old_found_items_count}</div>
                  <div style={{color: '#1E40AF'}}>Old Found Items</div>
                  <div style={{fontSize: 12, color: '#1E40AF', marginTop: 5}}>60+ days, no matches</div>
                </div>
                
                <div style={{background: '#FEE2E2', padding: 20, borderRadius: 12, textAlign: 'center'}}>
                  <div style={{fontSize: 32, fontWeight: 'bold', color: '#DC2626'}}>{cleanupData.old_lost_items_count}</div>
                  <div style={{color: '#DC2626'}}>Old Lost Items</div>
                  <div style={{fontSize: 12, color: '#DC2626', marginTop: 5}}>60+ days, no matches</div>
                </div>
              </div>

              <div style={{display: 'flex', gap: 15, flexWrap: 'wrap'}}>
                {cleanupData.resolved_matches_count > 0 && (
                  <button
                    onClick={handleCleanupResolved}
                    disabled={deleting}
                    style={{
                      background: '#F59E0B',
                      color: 'white',
                      border: 'none',
                      padding: '12px 24px',
                      borderRadius: 8,
                      fontSize: 16,
                      fontWeight: '600',
                      cursor: deleting ? 'not-allowed' : 'pointer',
                      opacity: deleting ? 0.6 : 1
                    }}
                  >
                    {deleting ? 'Deleting...' : `Clean Up ${cleanupData.resolved_matches_count} Resolved Items`}
                  </button>
                )}

                {(cleanupData.old_found_items_count > 0 || cleanupData.old_lost_items_count > 0) && (
                  <button
                    onClick={handleCleanupOld}
                    disabled={deleting}
                    style={{
                      background: '#DC2626',
                      color: 'white',
                      border: 'none',
                      padding: '12px 24px',
                      borderRadius: 8,
                      fontSize: 16,
                      fontWeight: '600',
                      cursor: deleting ? 'not-allowed' : 'pointer',
                      opacity: deleting ? 0.6 : 1
                    }}
                  >
                    {deleting ? 'Deleting...' : `Clean Up ${cleanupData.old_found_items_count + cleanupData.old_lost_items_count} Old Items`}
                  </button>
                )}
              </div>
            </>
          ) : (
            <div style={{textAlign: 'center', padding: 40}}>
              <div style={{fontSize: 48, marginBottom: 20}}>✨</div>
              <h3 style={{color: '#03045E', marginBottom: 10}}>Your account is clean!</h3>
              <p style={{color: '#666'}}>No items need cleanup at this time.</p>
            </div>
          )}
        </div>

        <div style={{background: 'white', borderRadius: 16, padding: 30, boxShadow: '0 4px 6px rgba(0,0,0,0.1)'}}>
          <h3 style={{fontSize: 20, fontWeight: '700', marginBottom: 15, color: '#03045E'}}>ℹ️ Important Information</h3>
          
          <div style={{background: '#EFF6FF', padding: 15, borderRadius: 8, marginBottom: 15}}>
            <h4 style={{margin: '0 0 10px 0', color: '#1E40AF'}}>🔄 Soft Delete (Reversible)</h4>
            <p style={{margin: 0, fontSize: 14, color: '#1E40AF'}}>
              Deleted items are hidden but can be restored within 30 days. After 30 days, they're permanently removed.
            </p>
          </div>
          
          <div style={{background: '#FEF3C7', padding: 15, borderRadius: 8, marginBottom: 15}}>
            <h4 style={{margin: '0 0 10px 0', color: '#92400E'}}>⚠️ What Gets Deleted</h4>
            <ul style={{margin: 0, paddingLeft: 20, fontSize: 14, color: '#92400E'}}>
              <li>Resolved items: Items that were successfully returned (30+ days old)</li>
              <li>Old items: Unmatched items with no activity for 60+ days</li>
              <li>Items with active matches are protected and won't be deleted</li>
            </ul>
          </div>
          
          <div style={{background: '#D1FAE5', padding: 15, borderRadius: 8}}>
            <h4 style={{margin: '0 0 10px 0', color: '#065F46'}}>✅ Benefits</h4>
            <ul style={{margin: 0, paddingLeft: 20, fontSize: 14, color: '#065F46'}}>
              <li>Cleaner dashboard with only active items</li>
              <li>Better performance and faster loading</li>
              <li>Privacy protection by removing old data</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ItemCleanup;