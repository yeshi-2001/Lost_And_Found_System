# AI Verification System Setup Guide

## What I've Implemented

✅ **Dynamic AI Question Generation** - Uses Google Generative AI to create specific questions from founder's description
✅ **AI Answer Verification** - Compares answers with original description using AI
✅ **Backend Endpoints** - `/api/verification/generate-questions` and `/api/verification/verify-answers`
✅ **React Component** - `VerificationQuestions.js` for displaying questions
✅ **Database Schema** - Added verification fields to matches table

## Setup Steps

### 1. Install Dependencies
```bash
cd backend
pip install google-generativeai==0.3.2
```

### 2. Get Free Google API Key
1. Go to: https://ai.google.dev
2. Click "Get API Key"
3. Create new API key
4. Copy the key

### 3. Update Environment Variables
Edit `backend/.env`:
```
GOOGLE_API_KEY=your_actual_api_key_here
```

### 4. Add Database Fields
Run this SQL in your PostgreSQL database:
```sql
-- Add verification fields to matches table
ALTER TABLE matches ADD COLUMN IF NOT EXISTS verification_questions JSONB;
ALTER TABLE matches ADD COLUMN IF NOT EXISTS verification_answers JSONB;
ALTER TABLE matches ADD COLUMN IF NOT EXISTS verification_score DECIMAL(5,2);
ALTER TABLE matches ADD COLUMN IF NOT EXISTS verification_verified BOOLEAN DEFAULT FALSE;
ALTER TABLE matches ADD COLUMN IF NOT EXISTS verification_explanation TEXT;
ALTER TABLE matches ADD COLUMN IF NOT EXISTS verification_generated_at TIMESTAMP;
ALTER TABLE matches ADD COLUMN IF NOT EXISTS verification_completed_at TIMESTAMP;
```

### 5. Test the System

**Example Flow:**
1. Founder reports: "Black iPhone 12 with blue case, university logo sticker, scratches on top right"
2. AI generates questions like:
   - "What color is the protective case?"
   - "What sticker is on the back?"
   - "Where are the scratches located?"
3. Owner answers questions
4. AI verifies answers against description
5. If 75%+ match → Verified ✅

## How to Use

### In Your Frontend
```javascript
import VerificationQuestions from './components/VerificationQuestions';

// When user wants to verify ownership
<VerificationQuestions 
  matchId={matchId}
  onVerificationComplete={(result) => {
    if (result.verified) {
      // Show contact info to both parties
    } else {
      // Ask to try again
    }
  }}
/>
```

### API Usage
```javascript
// Generate questions
const response = await fetch('/api/verification/generate-questions', {
  method: 'POST',
  headers: { 'Authorization': `Bearer ${token}` },
  body: JSON.stringify({ match_id: 123 })
});

// Verify answers
const response = await fetch('/api/verification/verify-answers', {
  method: 'POST',
  headers: { 'Authorization': `Bearer ${token}` },
  body: JSON.stringify({ 
    match_id: 123,
    answers: ["Blue", "University logo", "Top right corner"]
  })
});
```

## Key Features

🎯 **Dynamic Questions** - Each item gets unique questions based on founder's description
🤖 **AI-Powered** - Uses Google Gemini (free tier: 60 requests/minute)
🔒 **Secure Verification** - Only real owner would know specific details
💰 **Free** - No monthly costs, uses free Google AI API
⚡ **Fast** - Instant question generation and verification

## Files Created/Modified

- `backend/app/services/ai_verification_service.py` - AI service for questions/verification
- `backend/app/routes/verification.py` - API endpoints
- `backend/app/models/match.py` - Added verification fields
- `frontend/src/components/VerificationQuestions.js` - React component
- `backend/requirements.txt` - Added google-generativeai dependency
- `backend/.env` - Added GOOGLE_API_KEY

## Next Steps

1. Get your Google API key
2. Run the SQL script to add database fields
3. Test with a real found item description
4. Integrate the VerificationQuestions component into your match flow

The system is ready to use! Just need the API key and database update.