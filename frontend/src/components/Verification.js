import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { verificationAPI } from '../services/api';

const Verification = ({ token }) => {
  const { matchId } = useParams();
  const navigate = useNavigate();
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState([]);
  const [attemptId, setAttemptId] = useState(null);
  const [matchInfo, setMatchInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [result, setResult] = useState(null);

  useEffect(() => {
    generateQuestions();
  }, [matchId]);

  const generateQuestions = async () => {
    try {
      const response = await verificationAPI.generateQuestions(matchId);
      setQuestions(response.data.questions);
      setAnswers(new Array(response.data.questions.length).fill(''));
      setAttemptId(response.data.attempt_id);
      setMatchInfo(response.data.match_info);
    } catch (error) {
      setError(error.response?.data?.error || 'Failed to generate questions');
    } finally {
      setLoading(false);
    }
  };

  const handleAnswerChange = (index, value) => {
    const newAnswers = [...answers];
    newAnswers[index] = value;
    setAnswers(newAnswers);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Check if all questions are answered
    const unansweredQuestions = answers.filter(answer => !answer.trim()).length;
    if (unansweredQuestions > 0) {
      setError(`Please answer all questions. ${unansweredQuestions} question(s) remaining.`);
      return;
    }

    setSubmitting(true);
    setError('');

    try {
      const response = await verificationAPI.submitAnswers(attemptId, answers);
      setResult(response.data);
    } catch (error) {
      setError(error.response?.data?.error || 'Failed to submit answers');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="loading">
        <div className="spinner"></div>
        <p>Generating verification questions...</p>
      </div>
    );
  }

  if (result) {
    return (
      <div className="verification-container">
        <div className="card" style={{ textAlign: 'center' }}>
          {result.verified ? (
            <>
              <h2 style={{ color: '#28a745', marginBottom: '20px' }}>
                ✅ Verification Successful!
              </h2>
              <p style={{ fontSize: '18px', marginBottom: '20px' }}>
                Congratulations! You've been verified as the owner of the item.
              </p>
              
              <div style={{ background: '#d4edda', padding: '20px', borderRadius: '10px', marginBottom: '20px' }}>
                <h3>Verification Results:</h3>
                <p><strong>Questions Answered:</strong> {questions.length} of {questions.length}</p>
                <p><strong>Accuracy:</strong> {Math.round(result.verification_result.overall_percentage)}%</p>
                <p><strong>Status:</strong> ✅ VERIFIED</p>
              </div>

              {result.contact_info && (
                <div style={{ background: '#f8f9fa', padding: '20px', borderRadius: '10px', marginBottom: '20px' }}>
                  <h3>Finder's Contact Information:</h3>
                  <p><strong>📱 Name:</strong> {result.contact_info.finder.name}</p>
                  <p><strong>📞 Phone:</strong> {result.contact_info.finder.phone}</p>
                  <p><strong>📧 Registration:</strong> {result.contact_info.finder.registration}</p>
                  
                  <div style={{ marginTop: '20px', padding: '15px', background: '#e7f3ff', borderRadius: '8px' }}>
                    <h4>Next Steps:</h4>
                    <ol style={{ textAlign: 'left', margin: '10px 0' }}>
                      <li>Contact the finder to arrange pickup</li>
                      <li>Verify the item in person</li>
                      <li>Mark as "Successfully Recovered" after receiving</li>
                    </ol>
                  </div>
                </div>
              )}

              <div style={{ display: 'flex', gap: '10px', justifyContent: 'center', flexWrap: 'wrap' }}>
                <a 
                  href={`tel:${result.contact_info?.finder.phone}`}
                  className="btn btn-success"
                >
                  📞 Call Finder
                </a>
                <button 
                  onClick={() => navigate('/dashboard')}
                  className="btn btn-primary"
                >
                  Back to Dashboard
                </button>
              </div>
            </>
          ) : (
            <>
              <h2 style={{ color: '#dc3545', marginBottom: '20px' }}>
                ❌ Verification Unsuccessful
              </h2>
              <p style={{ fontSize: '18px', marginBottom: '20px' }}>
                Unfortunately, your answers don't match the item details well enough.
              </p>
              
              <div style={{ background: '#f8d7da', padding: '20px', borderRadius: '10px', marginBottom: '20px' }}>
                <h3>Verification Results:</h3>
                <p><strong>Questions Answered:</strong> {questions.length} of {questions.length}</p>
                <p><strong>Accuracy:</strong> {Math.round(result.verification_result.overall_percentage)}%</p>
                <p><strong>Status:</strong> ❌ NOT VERIFIED</p>
              </div>

              <div style={{ background: '#fff3cd', padding: '20px', borderRadius: '10px', marginBottom: '20px' }}>
                <h4>This might mean:</h4>
                <ul style={{ textAlign: 'left', margin: '10px 0' }}>
                  <li>This isn't your item</li>
                  <li>You don't remember the details clearly</li>
                  <li>The descriptions don't match</li>
                </ul>
              </div>

              <div style={{ display: 'flex', gap: '10px', justifyContent: 'center', flexWrap: 'wrap' }}>
                <button 
                  onClick={() => window.location.reload()}
                  className="btn btn-secondary"
                >
                  Try Again
                </button>
                <button 
                  onClick={() => navigate('/matches')}
                  className="btn btn-primary"
                >
                  Back to Matches
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="verification-container">
      <div className="card" style={{ marginBottom: '30px' }}>
        <h2 style={{ textAlign: 'center', marginBottom: '20px' }}>
          🔐 Ownership Verification
        </h2>
        
        {matchInfo && (
          <div style={{ background: '#e7f3ff', padding: '20px', borderRadius: '10px', marginBottom: '20px' }}>
            <p><strong>Match Reference:</strong> {matchId}</p>
            <p><strong>Similarity Score:</strong> {Math.round(matchInfo.similarity_score)}%</p>
            <p><strong>Item:</strong> {matchInfo.item_name} ({matchInfo.category})</p>
          </div>
        )}

        <div className="alert alert-info">
          <h4>Instructions:</h4>
          <p>Please answer the following questions about your lost item. Your answers will be verified to confirm you are the rightful owner.</p>
          <p><strong>💡 TIP:</strong> Be specific and honest. Only the real owner would know these details.</p>
          <p><strong>You need to answer at least 75% correctly to verify ownership.</strong></p>
        </div>
      </div>

      {error && <div className="alert alert-error">{error}</div>}

      <form onSubmit={handleSubmit}>
        {questions.map((question, index) => (
          <div key={index} className="question-card">
            <div className="question-number">{index + 1}</div>
            <h4 style={{ marginBottom: '15px' }}>
              Question {index + 1} of {questions.length}
            </h4>
            <p style={{ marginBottom: '15px', fontSize: '16px', fontWeight: '500' }}>
              {question}
            </p>
            <textarea
              value={answers[index]}
              onChange={(e) => handleAnswerChange(index, e.target.value)}
              placeholder="Be as specific as possible..."
              rows="3"
              style={{ width: '100%', padding: '12px', border: '2px solid #ddd', borderRadius: '5px' }}
              required
            />
            <small style={{ color: '#666' }}>Be specific and detailed</small>
          </div>
        ))}

        <div className="card" style={{ textAlign: 'center' }}>
          <div className="alert alert-info" style={{ marginBottom: '20px' }}>
            ⚠️ <strong>Warning:</strong> Make sure all answers are accurate before submitting. 
            You can only attempt verification a limited number of times.
          </div>
          
          <div style={{ display: 'flex', gap: '10px', justifyContent: 'center', flexWrap: 'wrap' }}>
            <button 
              type="button"
              onClick={() => navigate('/matches')}
              className="btn btn-secondary"
            >
              Cancel
            </button>
            <button 
              type="submit"
              className="btn btn-primary"
              disabled={submitting}
            >
              {submitting ? 'Verifying...' : 'Submit Answers'}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default Verification;