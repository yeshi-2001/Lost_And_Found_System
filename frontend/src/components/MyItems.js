import React, { useState, useEffect } from 'react';
import { itemsAPI } from '../services/api';

const MyItems = ({ user, token }) => {
  const [items, setItems] = useState({ found: [], lost: [] });
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('found');
  const [deletingId, setDeletingId] = useState(null);
  const [confirmDelete, setConfirmDelete] = useState(null); // { id, type }

  useEffect(() => {
    fetchMyItems();
  }, []);

  const fetchMyItems = async () => {
    try {
      const [foundResponse, lostResponse] = await Promise.all([
        itemsAPI.getFoundItems().catch(() => ({ data: { items: [] } })),
        itemsAPI.getLostItems().catch(() => ({ data: { items: [] } }))
      ]);

      setItems({
        found: foundResponse.data.items || [],
        lost: lostResponse.data.items || []
      });
    } catch (error) {
      console.error('Error fetching items:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!confirmDelete) return;
    const { id, type } = confirmDelete;
    setDeletingId(id);
    setConfirmDelete(null);
    try {
      if (type === 'found') {
        await itemsAPI.deleteFoundItem(id);
        setItems(prev => ({ ...prev, found: prev.found.filter(i => i.id !== id) }));
      } else {
        await itemsAPI.deleteLostItem(id);
        setItems(prev => ({ ...prev, lost: prev.lost.filter(i => i.id !== id) }));
      }
    } catch (error) {
      alert(error.response?.data?.error || 'Failed to delete item');
    } finally {
      setDeletingId(null);
    }
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <div>Loading your items...</div>
      </div>
    );
  }

  return (
    <div style={{marginLeft: window.innerWidth > 768 ? 280 : 0, flex: 1, padding: window.innerWidth > 768 ? 30 : 20, paddingTop: window.innerWidth <= 768 ? 80 : 30, minHeight: '100vh', background: 'linear-gradient(190deg, #2a0845 0%, #5c1070 40%, #4a1a50 70%, #7a2858 100%)', position: 'relative'}}>

      {/* Orbs */}
      <div style={{position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 0}}>
        <div style={{position: 'absolute', top: '0%', right: '-5%', width: '38%', height: '42%', background: 'radial-gradient(ellipse, rgba(166,77,121,0.3) 0%, transparent 70%)', filter: 'blur(55px)'}} />
        <div style={{position: 'absolute', bottom: '5%', left: '5%', width: '32%', height: '38%', background: 'radial-gradient(ellipse, rgba(79,28,81,0.4) 0%, transparent 70%)', filter: 'blur(45px)'}} />
        <div style={{position: 'absolute', inset: 0, backgroundImage: 'repeating-linear-gradient(135deg, rgba(255,255,255,0.025) 0px, rgba(255,255,255,0.025) 1px, transparent 1px, transparent 60px)'}} />
      </div>

      {/* Delete Confirmation Modal */}
      {confirmDelete && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ background: 'white', borderRadius: 12, padding: 30, maxWidth: 380, width: '90%', textAlign: 'center' }}>
            <div style={{ fontSize: 40, marginBottom: 12 }}></div>
            <h3 style={{ margin: '0 0 10px', color: '#333' }}>Delete Item?</h3>
            <p style={{ color: '#666', marginBottom: 24, fontSize: 14 }}>This action cannot be undone.</p>
            <div style={{ display: 'flex', gap: 12, justifyContent: 'center' }}>
              <button onClick={() => setConfirmDelete(null)} style={{ padding: '10px 24px', border: '1px solid #ddd', borderRadius: 8, background: 'white', cursor: 'pointer', fontWeight: '600' }}>Cancel</button>
              <button onClick={handleDelete} style={{ padding: '10px 24px', border: 'none', borderRadius: 8, background: '#dc3545', color: 'white', cursor: 'pointer', fontWeight: '600' }}>Delete</button>
            </div>
          </div>
        </div>
      )}
      <div style={{marginBottom: 30, position: 'relative', zIndex: 1}}>
        <h1 style={{fontSize: 32, fontWeight: '700', margin: '0 0 10px 0', color: 'white', fontFamily: 'Roboto Slab, serif'}}>My Items</h1>
        <p style={{fontSize: 18, color: 'rgba(237,200,255,0.8)', margin: 0}}>Manage your reported lost and found items</p>
      </div>

      {/* Tab Navigation */}
      <div style={{display: 'flex', marginBottom: 30, background: 'rgba(255,255,255,0.1)', borderRadius: 12, padding: 4, boxShadow: '0 2px 10px rgba(0,0,0,0.2)', position: 'relative', zIndex: 1}}>
        <button
          onClick={() => setActiveTab('found')}
          style={{
            flex: 1,
            padding: '12px 20px',
            border: 'none',
            borderRadius: 8,
            background: activeTab === 'found' ? '#03045E' : 'transparent',
            color: activeTab === 'found' ? 'white' : '#666',
            fontSize: 16,
            fontWeight: '600',
            cursor: 'pointer',
            transition: 'all 0.2s ease'
          }}
        >
          Found Items ({items.found.length})
        </button>
        <button
          onClick={() => setActiveTab('lost')}
          style={{
            flex: 1,
            padding: '12px 20px',
            border: 'none',
            borderRadius: 8,
            background: activeTab === 'lost' ? '#03045E' : 'transparent',
            color: activeTab === 'lost' ? 'white' : '#666',
            fontSize: 16,
            fontWeight: '600',
            cursor: 'pointer',
            transition: 'all 0.2s ease'
          }}
        >
          Lost Items ({items.lost.length})
        </button>
      </div>

      {/* Items Display */}
      <div style={{background: 'linear-gradient(135deg, rgba(166,77,121,0.2), rgba(79,28,81,0.35))', backdropFilter: 'blur(10px)', border: '1px solid rgba(255,255,255,0.15)', borderRadius: 15, padding: 20, position: 'relative', zIndex: 1}}>
        {items[activeTab].length === 0 ? (
          <div style={{textAlign: 'center', padding: 40, color: '#666'}}>
            <div style={{fontSize: 48, marginBottom: 20}}></div>
            <div style={{fontSize: 18, fontWeight: '600', marginBottom: 10}}>
              No {activeTab} items yet
            </div>
            <div style={{fontSize: 14}}>
              {activeTab === 'found' 
                ? 'When you report found items, they will appear here'
                : 'When you report lost items, they will appear here'
              }
            </div>
          </div>
        ) : (
          <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 20}}>
            {items[activeTab].map((item) => (
              <div 
                key={item.id}
                style={{
                  border: '2px solid #e9ecef',
                  borderRadius: 12,
                  padding: 20,
                  background: activeTab === 'found' ? '#f8fff9' : '#fff8f8',
                  transition: 'all 0.2s ease'
                }}
              >
                <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 15}}>
                  <div style={{
                    background: activeTab === 'found' ? '#28a745' : '#dc3545',
                    color: 'white',
                    padding: '4px 8px',
                    borderRadius: 6,
                    fontSize: 12,
                    fontWeight: '600'
                  }}>
                    {activeTab === 'found' ? 'FOUND' : 'LOST'}
                  </div>
                  <div style={{fontSize: 12, color: '#999'}}>
                    {new Date(item.created_at || item.date_found || item.date_lost).toLocaleDateString()}
                  </div>
                </div>

                <h3 style={{fontSize: 18, fontWeight: '700', margin: '0 0 10px 0', color: '#333'}}>
                  {item.item_name}
                </h3>

                <div style={{marginBottom: 10}}>
                  <div style={{fontSize: 14, color: '#666', marginBottom: 5}}>
                    <strong>Category:</strong> {item.category}
                  </div>
                  <div style={{fontSize: 14, color: '#666', marginBottom: 5}}>
                    <strong>Location:</strong> {item.location || item.location_found || item.location_lost}
                  </div>
                  <div style={{fontSize: 14, color: '#666', marginBottom: 10}}>
                    <strong>Description:</strong> {(item.description || '').substring(0, 100)}
                    {(item.description || '').length > 100 ? '...' : ''}
                  </div>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 10 }}>
                  <div style={{
                    padding: '6px 12px',
                    background: '#f8f9fa',
                    borderRadius: 6,
                    fontSize: 12,
                    color: '#666'
                  }}>
                    Status: {item.status || 'Active'}
                  </div>
                  <button
                    onClick={() => setConfirmDelete({ id: item.id, type: activeTab })}
                    disabled={deletingId === item.id}
                    style={{
                      padding: '6px 14px',
                      background: '#dc3545',
                      color: 'white',
                      border: 'none',
                      borderRadius: 6,
                      fontSize: 12,
                      fontWeight: '600',
                      cursor: 'pointer',
                      opacity: deletingId === item.id ? 0.6 : 1
                    }}
                  >
                    {deletingId === item.id ? 'Deleting...' : 'Delete'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyItems;