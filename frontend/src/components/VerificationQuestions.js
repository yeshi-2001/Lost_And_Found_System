import React, { useState, useEffect } from 'react';

function VerificationQuestions({ matchId, onVerificationComplete }) {
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    generateQuestions();
  }, [matchId]);

  const generateQuestions = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/verification/generate-questions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ match_id: matchId })
      });

      const result = await response.json();

      if (result.success) {
        setQuestions(result.questions);
        setAnswers(Array(result.questions.length).fill(''));
      } else {
        setError(result.error || 'Failed to generate questions');
      }
    } catch (err) {
      setError('Error generating questions');
    } finally {
      setLoading(false);
    }
  };

  const handleAnswerChange = (index, value) => {
    const newAnswers = [...answers];
    newAnswers[index] = value;
    setAnswers(newAnswers);
  };

  const handleSubmit = async () => {
    // Validate all answers filled
    if (answers.some(a => !a.trim())) {
      setError('Please answer all questions');
      return;
    }

    setSubmitting(true);
    setError('');

    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/verification/verify-answers', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          match_id: matchId,
          answers: answers
        })
      });

      const result = await response.json();

      if (result.success) {
        onVerificationComplete(result);
      } else {
        setError(result.error || 'Verification failed');
      }
    } catch (err) {
      setError('Error submitting answers');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div style={{
        textAlign: 'center',
        padding: '40px',
        background: 'white',
        borderRadius: '12px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
      }}>
        <div style={{ fontSize: '18px', color: '#666' }}>
          🤖 Generating verification questions...
        </div>
        <div style={{ fontSize: '14px', color: '#999', marginTop: '10px' }}>
          Using AI to create questions only you would know
        </div>
      </div>
    );
  }

  return (
    <div style={{
      maxWidth: '700px',
      margin: '0 auto',
      padding: '30px',
      background: 'white',
      borderRadius: '12px',
      boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
    }}>
      <h2 style={{ 
        textAlign: 'center', 
        marginBottom: '20px',
        color: '#03045E'
      }}>
        🔐 Verify Ownership
      </h2>

      <p style={{ 
        fontSize: '16px', 
        color: '#666', 
        marginBottom: '25px',
        textAlign: 'center',
        lineHeight: '1.5'
      }}>
        Please answer the following questions to prove you're the real owner.
        These questions are based on the finder's description and only you would know these details.
      </p>

      {questions.map((question, index) => (
        <div key={index} style={{
          marginBottom: '25px',
          padding: '20px',
          background: '#f9fafb',
          borderRadius: '8px',
          border: '1px solid #e5e7eb'
        }}>
          <label style={{
            display: 'block',
            marginBottom: '10px',
            fontSize: '15px',
            fontWeight: '600',
            color: '#03045E'
          }}>
            Question {index + 1} of {questions.length}
          </label>

          <p style={{
            marginBottom: '15px',
            fontSize: '16px',
            color: '#374151',
            lineHeight: '1.4'
          }}>
            {question}
          </p>

          <textarea
            value={answers[index]}
            onChange={(e) => handleAnswerChange(index, e.target.value)}
            placeholder="Type your answer here..."
            style={{
              width: '100%',
              padding: '12px',
              fontSize: '14px',
              border: '1px solid #d1d5db',
              borderRadius: '6px',
              fontFamily: 'Calibri, sans-serif',
              minHeight: '80px',
              resize: 'vertical',
              boxSizing: 'border-box'
            }}
          />
        </div>
      ))}

      {error && (
        <div style={{
          padding: '12px 16px',
          background: '#fee2e2',
          color: '#991b1b',
          borderRadius: '6px',
          marginBottom: '20px',
          fontSize: '14px'
        }}>
          ❌ {error}
        </div>
      )}

      <button
        onClick={handleSubmit}
        disabled={submitting}
        style={{
          width: '100%',
          padding: '14px',
          fontSize: '16px',
          fontWeight: '600',
          color: 'white',
          background: submitting ? '#9CA3AF' : '#03045E',
          border: 'none',
          borderRadius: '8px',
          cursor: submitting ? 'not-allowed' : 'pointer',
          transition: 'all 0.3s'
        }}
      >
        {submitting ? '🔍 Verifying...' : '✅ Submit Answers'}
      </button>

      <div style={{
        marginTop: '15px',
        fontSize: '12px',
        color: '#999',
        textAlign: 'center'
      }}>
        Your answers will be verified using AI against the finder's description
      </div>
    </div>
  );
}

export default VerificationQuestions;