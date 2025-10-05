import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { verificationAPI } from '../services/api';

const Matches = ({ user, token }) => {
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadMatches();
  }, []);

  const loadMatches = async () => {
    try {
      const response = await verificationAPI.getMatches(user.id);
      setMatches(response.data.matches);
    } catch (error) {
      setError(error.response?.data?.error || 'Failed to load matches');
    } finally {
      setLoading(false);
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
            We haven't found any potential matches for your lost items yet. 
            Don't worry, we'll notify you as soon as someone reports a matching item!
          </p>
          <Link to="/lost-item" className="btn btn-primary">
            Report Another Lost Item
          </Link>
        </div>
      ) : (
        <>
          <div className="alert alert-info" style={{ marginBottom: '30px' }}>
            🎉 <strong>Great news!</strong> We found {matches.length} potential match(es) for your lost items. 
            Click "Verify Ownership" to answer questions and confirm if it's your item.
          </div>

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
                </div>
                <Link 
                  to={`/verification/${match.id}`}
                  className="btn btn-primary"
                >
                  Verify Ownership
                </Link>
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
                    <p><strong>Description:</strong> {match.lost_description.substring(0, 100)}...</p>
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

              <div style={{ marginTop: '15px', padding: '15px', background: '#e7f3ff', borderRadius: '8px' }}>
                <h5 style={{ margin: '0 0 10px 0', color: '#0066cc' }}>
                  🔐 Next Step: Ownership Verification
                </h5>
                <p style={{ margin: '0', fontSize: '14px', color: '#333' }}>
                  To confirm this is your item, you'll need to answer verification questions 
                  based on details only the real owner would know. You need 75% accuracy to verify ownership.
                </p>
              </div>
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