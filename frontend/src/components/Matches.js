import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { verificationAPI, returnsAPI } from '../services/api';

const Matches = ({ user, token }) => {
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadMatches();
  }, []);

  const loadMatches = async () => {
    try {
      const response = await verificationAPI.getMatches();
      setMatches(response.data.matches);
    } catch (error) {
      setError(error.response?.data?.error || 'Failed to load matches');
    } finally {
      setLoading(false);
    }
  };

  const handleConfirmReturn = async (matchId) => {
    try {
      await returnsAPI.confirmReturn(matchId);
      // Reload matches to show updated status
      loadMatches();
    } catch (error) {
      setError(error.response?.data?.error || 'Failed to confirm return');
    }
  };

  if (loading) {
    return (
      <div className="loading">
        <div className="spinner"></div>
        <p>Loading your matches...</p>
      </div>
    );
  }

  return (
    <div className="container matches-container">
      <h1 style={{ textAlign: 'center', marginBottom: '30px' }}>
        🎯 Your Potential Matches
      </h1>

      {error && <div className="alert alert-error">{error}</div>}

      {matches.length === 0 ? (
        <div className="card" style={{ textAlign: 'center', padding: '40px' }}>
          <h3>No matches found yet</h3>
          <p style={{ color: '#666', marginBottom: '20px' }}>
            We haven't found any potential matches yet. 
            Don't worry, we'll notify you as soon as there's a match!
          </p>
          <Link to="/lost-item" className="btn btn-primary">
            Report Another Lost Item
          </Link>
        </div>
      ) : (
        <>
          {matches.some(m => m.user_role === 'owner' && m.status === 'pending_verification') && (
            <div className="alert alert-info" style={{ marginBottom: '30px' }}>
              🎉 <strong>Great news!</strong> We found {matches.filter(m => m.user_role === 'owner' && m.status === 'pending_verification').length} potential match(es) for your lost items. 
              Click "Verify Ownership" to answer questions and confirm if it's your item.
            </div>
          )}
          
          {matches.some(m => m.user_role === 'owner' && m.status === 'verified') && (
            <div className="alert alert-success" style={{ marginBottom: '30px' }}>
              ✅ <strong>Verification Complete!</strong> You've been verified as the owner. 
              Contact the finder to arrange pickup, then confirm when you receive your item.
            </div>
          )}
          
          {matches.some(m => m.user_role === 'owner' && (m.status === 'returned_to_owner' || m.status === 'returned_by_finder')) && (
            <div className="alert alert-success" style={{ marginBottom: '30px' }}>
              🎊 <strong>Success!</strong> Your item has been successfully returned. Case closed!
            </div>
          )}
          
          {matches.some(m => m.user_role === 'finder') && (
            <div className="alert alert-success" style={{ marginBottom: '30px' }}>
              📱 <strong>Match Alert!</strong> Someone has claimed {matches.filter(m => m.user_role === 'finder').length} of your found items. 
              They are currently going through verification. You'll be contacted if verified.
            </div>
          )}

          {matches.map(match => (
            <div key={match.id} className="match-card">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '15px' }}>
                <div>
                  <span className="similarity-score">
                    {Math.round(match.similarity_score)}% Match
                  </span>
                  <h3 style={{ margin: '10px 0 5px 0' }}>
                    {match.found_item_name}
                  </h3>
                  <span style={{ 
                    background: match.user_role === 'owner' ? '#e7f3ff' : '#e8f5e8',
                    color: match.user_role === 'owner' ? '#0066cc' : '#28a745',
                    padding: '4px 8px',
                    borderRadius: '4px',
                    fontSize: '12px',
                    fontWeight: 'bold'
                  }}>
                    {match.user_role === 'owner' ? 'YOUR LOST ITEM' : 'YOUR FOUND ITEM'}
                  </span>
                </div>
                
                {match.user_role === 'owner' ? (
                  <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                    {match.status === 'pending_verification' && (
                      <Link 
                        to={`/verification/${match.id}`}
                        className="btn btn-primary"
                      >
                        Verify Ownership
                      </Link>
                    )}
                    {match.status === 'verified' && (
                      <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                        <input 
                          type="checkbox"
                          onChange={() => handleConfirmReturn(match.id)}
                          style={{ transform: 'scale(1.2)' }}
                        />
                        <span style={{ fontSize: '14px', fontWeight: 'bold', color: '#28a745' }}>
                          Mark as Received
                        </span>
                      </label>
                    )}
                    {(match.status === 'returned_to_owner' || match.status === 'returned_by_finder') && (
                      <div style={{ 
                        background: '#d4edda',
                        color: '#155724',
                        padding: '8px 12px',
                        borderRadius: '4px',
                        fontSize: '14px',
                        fontWeight: 'bold'
                      }}>
                        ✅ Item Returned Successfully
                      </div>
                    )}
                  </div>
                ) : (
                  <div style={{ textAlign: 'right' }}>
                    {match.status === 'verified' && (
                      <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', marginBottom: '8px' }}>
                        <input 
                          type="checkbox"
                          onChange={() => handleConfirmReturn(match.id)}
                          style={{ transform: 'scale(1.2)' }}
                        />
                        <span style={{ fontSize: '14px', fontWeight: 'bold', color: '#28a745' }}>
                          Mark as Returned
                        </span>
                      </label>
                    )}
                    <div style={{ 
                      background: match.status === 'verified' ? '#d4edda' : 
                                 (match.status === 'returned_to_owner' || match.status === 'returned_by_finder') ? '#d4edda' : '#fff3cd',
                      color: match.status === 'verified' ? '#155724' : 
                             (match.status === 'returned_to_owner' || match.status === 'returned_by_finder') ? '#155724' : '#856404',
                      padding: '8px 12px',
                      borderRadius: '4px',
                      fontSize: '14px',
                      fontWeight: 'bold'
                    }}>
                      {match.status === 'verified' ? '✅ Verified - Contact Shared' : 
                       (match.status === 'returned_to_owner' || match.status === 'returned_by_finder') ? '✅ Item Returned' :
                       '⏳ Awaiting Verification'}
                    </div>
                  </div>
                )}
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px' }}>
                {/* Your Lost Item */}
                <div>
                  <h4 style={{ color: '#dc3545', marginBottom: '10px' }}>
                    🔍 Your Lost Item
                  </h4>
                  <div style={{ background: '#f8f9fa', padding: '15px', borderRadius: '8px' }}>
                    <p><strong>Item:</strong> {match.lost_item_name}</p>
                    <p><strong>Lost at:</strong> {match.location_lost}</p>
                    <p><strong>Date:</strong> {new Date(match.date_lost).toLocaleDateString()}</p>
                    <p><strong>Description:</strong> {(match.lost_description || '').substring(0, 100)}{(match.lost_description || '').length > 100 ? '...' : ''}</p>
                  </div>
                </div>

                {/* Found Item Match */}
                <div>
                  <h4 style={{ color: '#28a745', marginBottom: '10px' }}>
                    📱 Found Item Match
                  </h4>
                  <div style={{ background: '#f8f9fa', padding: '15px', borderRadius: '8px' }}>
                    <p><strong>Item:</strong> {match.found_item_name}</p>
                    <p><strong>Found at:</strong> {match.location_found}</p>
                    <p><strong>Date:</strong> {new Date(match.date_found).toLocaleDateString()}</p>
                    <p><strong>Status:</strong> 
                      <span style={{ 
                        color: match.status === 'pending_verification' ? '#ffc107' : '#28a745',
                        fontWeight: 'bold',
                        marginLeft: '5px'
                      }}>
                        {match.status === 'pending_verification' ? 'Pending Verification' : 'Verified'}
                      </span>
                    </p>
                  </div>
                </div>
              </div>

              {/* Show different next steps based on match status and user role */}
              {match.user_role === 'owner' ? (
                <div>
                  {match.status === 'pending_verification' && (
                    <div style={{ marginTop: '15px', padding: '15px', background: '#e7f3ff', borderRadius: '8px' }}>
                      <h5 style={{ margin: '0 0 10px 0', color: '#0066cc' }}>
                        🔐 Next Step: Ownership Verification
                      </h5>
                      <p style={{ margin: '0', fontSize: '14px', color: '#333' }}>
                        To confirm this is your item, you'll need to answer verification questions 
                        based on details only the real owner would know. You need 60% accuracy to verify ownership.
                      </p>
                    </div>
                  )}
                  
                  {match.status === 'verified' && (
                    <div style={{ marginTop: '15px', padding: '15px', background: '#d4edda', borderRadius: '8px' }}>
                      <h5 style={{ margin: '0 0 10px 0', color: '#155724' }}>
                        📞 Next Step: Contact Finder & Arrange Pickup
                      </h5>
                      <p style={{ margin: '0', fontSize: '14px', color: '#333' }}>
                        You've been verified! Contact the finder to arrange pickup. 
                        After receiving your item, click "Confirm Received" to close this case.
                      </p>
                    </div>
                  )}
                  
                  {(match.status === 'returned_to_owner' || match.status === 'returned_by_finder') && (
                    <div style={{ marginTop: '15px', padding: '15px', background: '#d1ecf1', borderRadius: '8px' }}>
                      <h5 style={{ margin: '0 0 10px 0', color: '#0c5460' }}>
                        🎊 Case Closed Successfully!
                      </h5>
                      <p style={{ margin: '0', fontSize: '14px', color: '#333' }}>
                        Your item has been successfully returned. Thank you for using our Lost & Found system!
                      </p>
                    </div>
                  )}
                </div>
              ) : (
                <div>
                  {match.status === 'pending_verification' && (
                    <div style={{ marginTop: '15px', padding: '15px', background: '#e8f5e8', borderRadius: '8px' }}>
                      <h5 style={{ margin: '0 0 10px 0', color: '#28a745' }}>
                        📞 Next Step: Wait for Verification
                      </h5>
                      <p style={{ margin: '0', fontSize: '14px', color: '#333' }}>
                        The person claiming this item is answering verification questions. 
                        If they pass, you'll receive their contact details to arrange pickup.
                      </p>
                    </div>
                  )}
                  
                  {match.status === 'verified' && (
                    <div style={{ marginTop: '15px', padding: '15px', background: '#d4edda', borderRadius: '8px' }}>
                      <h5 style={{ margin: '0 0 10px 0', color: '#155724' }}>
                        📞 Next Step: Arrange Pickup with Owner
                      </h5>
                      <p style={{ margin: '0', fontSize: '14px', color: '#333' }}>
                        The owner has been verified! They should contact you soon to arrange pickup. 
                        After handing over the item, click "Confirm Returned" to close this case.
                      </p>
                    </div>
                  )}
                  
                  {(match.status === 'returned_to_owner' || match.status === 'returned_by_finder') && (
                    <div style={{ marginTop: '15px', padding: '15px', background: '#d1ecf1', borderRadius: '8px' }}>
                      <h5 style={{ margin: '0 0 10px 0', color: '#0c5460' }}>
                        🎊 Item Successfully Returned!
                      </h5>
                      <p style={{ margin: '0', fontSize: '14px', color: '#333' }}>
                        Great job helping someone recover their lost item! Thank you for being part of our community.
                      </p>
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}

          <div className="card" style={{ textAlign: 'center', marginTop: '30px' }}>
            <h4>Need Help?</h4>
            <p style={{ color: '#666', marginBottom: '20px' }}>
              If you're having trouble with verification or think there's an error, 
              you can update your lost item description with more details.
            </p>
            <div style={{ display: 'flex', gap: '10px', justifyContent: 'center', flexWrap: 'wrap' }}>
              <Link to="/lost-item" className="btn btn-secondary">
                Report Another Item
              </Link>
              <Link to="/dashboard" className="btn btn-primary">
                Back to Dashboard
              </Link>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Matches;