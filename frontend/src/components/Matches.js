import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { verificationAPI, returnsAPI } from '../services/api';

const Matches = ({ user, token }) => {
  const navigate = useNavigate();
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [contactInfo, setContactInfo] = useState({});
  const [showingContact, setShowingContact] = useState({});

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

  const handleViewContact = async (matchId) => {
    try {
      const response = await verificationAPI.getContactInfo(matchId);
      setContactInfo(prev => ({ ...prev, [matchId]: response.data }));
      setShowingContact(prev => ({ ...prev, [matchId]: true }));
    } catch (error) {
      setError(error.response?.data?.error || 'Failed to load contact information');
    }
  };

  const hideContact = (matchId) => {
    setShowingContact(prev => ({ ...prev, [matchId]: false }));
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
    <div style={{minHeight: '100vh', background: 'linear-gradient(145deg, #0f0a2e 0%, #2a0a5e 35%, #5a1060 65%, #8b2060 100%)', padding: 20, paddingTop: window.innerWidth <= 768 ? 80 : 20, fontFamily: 'Inter, sans-serif', marginLeft: window.innerWidth > 768 ? 280 : 0, position: 'relative'}}>
      {/* Orbs */}
      <div style={{position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 0}}>
        <div style={{position: 'absolute', top: '-10%', right: '-5%', width: '40%', height: '40%', background: 'radial-gradient(ellipse, rgba(166,77,121,0.3) 0%, transparent 70%)', filter: 'blur(50px)'}} />
        <div style={{position: 'absolute', bottom: '10%', left: '10%', width: '35%', height: '35%', background: 'radial-gradient(ellipse, rgba(79,28,81,0.35) 0%, transparent 70%)', filter: 'blur(40px)'}} />
        <div style={{position: 'absolute', inset: 0, backgroundImage: 'repeating-linear-gradient(135deg, rgba(255,255,255,0.025) 0px, rgba(255,255,255,0.025) 1px, transparent 1px, transparent 60px)'}} />
      </div>
      <div style={{maxWidth: 1200, margin: '0 auto', position: 'relative', zIndex: 1}}>
        <div style={{marginBottom: 30}}>
          <h1 style={{fontSize: 32, fontWeight: '700', margin: '0 0 10px 0', fontFamily: 'Roboto Slab, serif', color: 'white'}}>Your Potential Matches</h1>
        </div>

        {error && <div style={{background: '#FEE2E2', color: '#991B1B', padding: 15, borderRadius: 8, marginBottom: 20}}>{error}</div>}

        {matches.length === 0 ? (
          <div style={{background: 'linear-gradient(135deg, rgba(166,77,121,0.2), rgba(79,28,81,0.35))', backdropFilter: 'blur(10px)', border: '1px solid rgba(255,255,255,0.15)', borderRadius: 20, padding: 20, textAlign: 'center'}}>
            <h3 style={{color: 'white'}}>No matches found yet</h3>
            <p style={{ color: 'rgba(255,255,255,0.7)', marginBottom: '20px' }}>
              We haven't found any potential matches yet. 
              Don't worry, we'll notify you as soon as there's a match!
            </p>
            <Link to="/lost-item" style={{background: '#03045E', color: 'white', padding: '12px 24px', borderRadius: 8, textDecoration: 'none', display: 'inline-block'}}>
              Report Another Lost Item
            </Link>
          </div>
        ) : (
          <>
            {matches.some(m => m.user_role === 'owner' && m.status === 'pending_verification') && (
              <div style={{background: '#EFF6FF', color: '#1F2937', padding: 15, borderRadius: 8, marginBottom: 30}}>
                <strong>Great news!</strong> We found {matches.filter(m => m.user_role === 'owner' && m.status === 'pending_verification').length} potential match(es) for your lost items. 
                Click "Verify Ownership" to answer questions and confirm if it's your item.
              </div>
            )}
            
            {matches.some(m => m.user_role === 'owner' && m.status === 'verified') && (
              <div style={{background: '#D1FAE5', color: '#065F46', padding: 15, borderRadius: 8, marginBottom: 30}}>
                <strong>Verification Complete!</strong> You've been verified as the owner. 
                Contact the finder to arrange pickup, then confirm when you receive your item.
              </div>
            )}
            


            {matches.map(match => (
              <div key={match.id} style={{background: 'linear-gradient(135deg, rgba(166,77,121,0.2), rgba(79,28,81,0.35))', backdropFilter: 'blur(10px)', border: '1px solid rgba(255,255,255,0.15)', borderRadius: 20, padding: 20, marginBottom: 20}}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '15px' }}>
                <div>
                  <span className="similarity-score">
                    {Math.round(match.similarity_score)}% Match
                  </span>
                  <h3 style={{ margin: '10px 0 5px 0', color: 'white' }}>
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
                        style={{background: '#03045E', color: 'white', padding: '8px 16px', borderRadius: 6, textDecoration: 'none', fontSize: 14}}
                      >
                        Verify Ownership
                      </Link>
                    )}
                    {match.status === 'verified' && (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', alignItems: 'flex-end' }}>
                        <button
                          onClick={() => handleViewContact(match.id)}
                          style={{
                            background: '#28a745',
                            color: 'white',
                            padding: '8px 16px',
                            borderRadius: '6px',
                            border: 'none',
                            fontSize: '14px',
                            cursor: 'pointer',
                            fontWeight: 'bold'
                          }}
                        >
                          View Contact
                        </button>
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
                      </div>
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
                        Item Returned Successfully
                      </div>
                    )}
                  </div>
                ) : (
                  <div style={{ textAlign: 'right' }}>
                    {match.status === 'verified' && (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', alignItems: 'flex-end', marginBottom: '8px' }}>
                        <button
                          onClick={() => handleViewContact(match.id)}
                          style={{
                            background: '#28a745',
                            color: 'white',
                            padding: '8px 16px',
                            borderRadius: '6px',
                            border: 'none',
                            fontSize: '14px',
                            cursor: 'pointer',
                            fontWeight: 'bold'
                          }}
                        >
                          View Contact
                        </button>
                        <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                          <input 
                            type="checkbox"
                            onChange={() => handleConfirmReturn(match.id)}
                            style={{ transform: 'scale(1.2)' }}
                          />
                          <span style={{ fontSize: '14px', fontWeight: 'bold', color: '#28a745' }}>
                            Mark as Returned
                          </span>
                        </label>
                      </div>
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
                      {match.status === 'verified' ? 'Verified - Contact Shared' : 
                       (match.status === 'returned_to_owner' || match.status === 'returned_by_finder') ? 'Item Returned' :
                       'Awaiting Verification'}
                    </div>
                  </div>
                )}
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px' }}>
                {/* Your Lost Item */}
                <div>
                  <h4 style={{ color: '#dc3545', marginBottom: '10px' }}>
                    Your Lost Item
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
                    Found Item Match
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

              {/* Contact Information Display */}
              {showingContact[match.id] && contactInfo[match.id] && (
                <div style={{ marginTop: '20px', padding: '20px', background: '#e8f5e8', borderRadius: '12px', border: '2px solid #28a745' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
                    <h4 style={{ margin: 0, color: '#155724', display: 'flex', alignItems: 'center', gap: '8px' }}>
                      Contact Information - {contactInfo[match.id].role === 'finder' ? 'Finder' : 'Owner'}
                    </h4>
                    <button
                      onClick={() => hideContact(match.id)}
                      style={{
                        background: 'transparent',
                        border: 'none',
                        fontSize: '20px',
                        cursor: 'pointer',
                        color: '#666'
                      }}
                    >
                      ×
                    </button>
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '15px' }}>
                    <div>
                      <strong style={{ color: '#155724' }}>Name:</strong>
                      <p style={{ margin: '5px 0', fontSize: '16px', fontWeight: 'bold' }}>
                        {contactInfo[match.id].contact_name}
                      </p>
                    </div>
                    <div>
                      <strong style={{ color: '#155724' }}>Phone:</strong>
                      <p style={{ margin: '5px 0', fontSize: '16px', fontWeight: 'bold' }}>
                        <a href={`tel:${contactInfo[match.id].contact_number}`} style={{ color: '#28a745', textDecoration: 'none' }}>
                          {contactInfo[match.id].contact_number}
                        </a>
                      </p>
                    </div>
                    <div>
                      <strong style={{ color: '#155724' }}>Email:</strong>
                      <p style={{ margin: '5px 0', fontSize: '16px', fontWeight: 'bold' }}>
                        <a href={`mailto:${contactInfo[match.id].contact_email}`} style={{ color: '#28a745', textDecoration: 'none' }}>
                          {contactInfo[match.id].contact_email}
                        </a>
                      </p>
                    </div>
                  </div>
                  <div style={{ marginTop: '15px', padding: '10px', background: '#d4edda', borderRadius: '6px' }}>
                    <p style={{ margin: 0, fontSize: '14px', color: '#155724' }}>
                      <strong>Next Step:</strong> Contact them to arrange {match.user_role === 'owner' ? 'pickup' : 'handover'} of the item.
                    </p>
                  </div>
                </div>
              )}

              {/* Show different next steps based on match status and user role */}
              {match.user_role === 'owner' ? (
                <div>
                  {match.status === 'pending_verification' && (
                    <div style={{ marginTop: '15px', padding: '15px', background: '#e7f3ff', borderRadius: '8px' }}>
                      <h5 style={{ margin: '0 0 10px 0', color: '#0066cc' }}>
                        Next Step: Ownership Verification
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
                        Next Step: Contact Finder & Arrange Pickup
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
                        Case Closed Successfully!
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
                        Next Step: Wait for Verification
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
                        Next Step: Arrange Pickup with Owner
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
                        Item Successfully Returned!
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

            <div style={{background: 'linear-gradient(135deg, rgba(166,77,121,0.2), rgba(79,28,81,0.35))', backdropFilter: 'blur(10px)', border: '1px solid rgba(255,255,255,0.15)', borderRadius: 20, padding: 30, textAlign: 'center', marginTop: 30}}>
              <h4 style={{color: 'white'}}>Need Help?</h4>
              <p style={{ color: 'rgba(255,255,255,0.7)', marginBottom: '20px' }}>
                If you're having trouble with verification or think there's an error, 
                you can update your lost item description with more details.
              </p>
              <div style={{ display: 'flex', gap: '10px', justifyContent: 'center', flexWrap: 'wrap' }}>
                <Link to="/lost-item" style={{background: 'transparent', color: '#374151', border: '2px solid #D1D5DB', padding: '12px 24px', borderRadius: 8, textDecoration: 'none'}}>
                  Report Another Item
                </Link>
                <Link to="/dashboard" style={{background: '#03045E', color: 'white', padding: '12px 24px', borderRadius: 8, textDecoration: 'none'}}>
                  Back to Dashboard
                </Link>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Matches;