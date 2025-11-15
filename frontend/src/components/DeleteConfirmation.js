import React, { useState } from 'react';

const DeleteConfirmation = ({ isOpen, onClose, onConfirm, itemName, itemType }) => {
  const [reason, setReason] = useState('');
  const [loading, setLoading] = useState(false);

  const handleConfirm = async () => {
    setLoading(true);
    await onConfirm(reason || 'User requested deletion');
    setLoading(false);
    setReason('');
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: 'rgba(0,0,0,0.5)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000,
      padding: 20
    }}>
      <div style={{
        background: 'white',
        borderRadius: 16,
        padding: 30,
        maxWidth: 500,
        width: '100%',
        textAlign: 'center'
      }}>
        <div style={{fontSize: 48, marginBottom: 20}}>⚠️</div>
        
        <h2 style={{fontSize: 24, fontWeight: '700', marginBottom: 15, color: '#DC2626'}}>
          Delete {itemType} Item?
        </h2>
        
        <p style={{fontSize: 16, color: '#374151', marginBottom: 20}}>
          Are you sure you want to delete "<strong>{itemName}</strong>"?
        </p>
        
        <div style={{background: '#FEF3C7', padding: 15, borderRadius: 8, marginBottom: 20, textAlign: 'left'}}>
          <h4 style={{margin: '0 0 10px 0', color: '#92400E'}}>Important:</h4>
          <ul style={{margin: 0, paddingLeft: 20, fontSize: 14, color: '#92400E'}}>
            <li>This item will be hidden from your dashboard</li>
            <li>You can restore it within 30 days</li>
            <li>After 30 days, it will be permanently deleted</li>
            <li>Items with active matches cannot be deleted</li>
          </ul>
        </div>
        
        <div style={{marginBottom: 20, textAlign: 'left'}}>
          <label style={{display: 'block', fontSize: 14, fontWeight: '600', color: '#374151', marginBottom: 8}}>
            Reason for deletion (optional):
          </label>
          <select
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            style={{
              width: '100%',
              padding: '10px 12px',
              border: '1px solid #D1D5DB',
              borderRadius: 6,
              fontSize: 14,
              boxSizing: 'border-box'
            }}
          >
            <option value="">Select a reason</option>
            <option value="Item found/returned">Item found/returned</option>
            <option value="No longer needed">No longer needed</option>
            <option value="Duplicate posting">Duplicate posting</option>
            <option value="Posted by mistake">Posted by mistake</option>
            <option value="Other">Other</option>
          </select>
        </div>
        
        <div style={{display: 'flex', gap: 12, justifyContent: 'center'}}>
          <button
            onClick={onClose}
            disabled={loading}
            style={{
              background: 'transparent',
              color: '#374151',
              border: '2px solid #D1D5DB',
              padding: '12px 24px',
              borderRadius: 8,
              fontSize: 16,
              cursor: loading ? 'not-allowed' : 'pointer',
              opacity: loading ? 0.6 : 1
            }}
          >
            Cancel
          </button>
          
          <button
            onClick={handleConfirm}
            disabled={loading}
            style={{
              background: '#DC2626',
              color: 'white',
              border: 'none',
              padding: '12px 24px',
              borderRadius: 8,
              fontSize: 16,
              fontWeight: '600',
              cursor: loading ? 'not-allowed' : 'pointer',
              opacity: loading ? 0.6 : 1
            }}
          >
            {loading ? 'Deleting...' : 'Delete Item'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteConfirmation;