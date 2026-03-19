from groq import Groq
import os
from datetime import datetime

class AIVerificationService:
    """Dynamic AI verification service using Groq"""
    
    def __init__(self):
        """Initialize with Groq API key"""
        api_key = os.environ.get('GROQ_API_KEY')
        if not api_key:
            raise ValueError("GROQ_API_KEY environment variable is required")
        
        self.client = Groq(api_key=api_key)
        self.model = 'llama-3.3-70b-versatile'
    
    def _chat(self, prompt, max_tokens=1000):
        """Helper to call Groq chat completion"""
        response = self.client.chat.completions.create(
            model=self.model,
            messages=[{"role": "user", "content": prompt}],
            temperature=0.7,
            max_tokens=max_tokens
        )
        return response.choices[0].message.content
    
    def generate_verification_questions(self, item_name, category, brand, color, location, date_found, description):
        """Generate verification questions strictly from founder's uploaded details"""

        founder_details = f"""Item Name: {item_name}
Category: {category}
Brand: {brand or 'Not provided'}
Color: {color}
Location Found: {location}
Date Found: {date_found}
Description: {description}"""

        prompt = f"""You are a verification assistant for a lost and found system.

A finder uploaded these details about an item they found:

{founder_details}

Generate 5 simple, short questions based ONLY on the details above.

RULES:
- Questions must come ONLY from the details provided above
- Questions should be simple - answers should be one word or a short phrase (e.g. "Black", "Library", "Nike")
- Do NOT ask for detailed explanations
- Do NOT invent details not mentioned above
- Skip fields that say "Not provided"
- Number each question 1-5, one per line
- Output ONLY the questions, nothing else"""

        try:
            questions_text = self._chat(prompt).strip()
            questions = self._parse_questions(questions_text)
            
            return {
                "success": True,
                "questions": questions,
                "count": len(questions),
                "timestamp": datetime.now().isoformat()
            }
        
        except Exception as e:
            return {
                "success": False,
                "error": str(e),
                "message": "Failed to generate questions"
            }
    
    def _parse_questions(self, response_text):
        """Parse AI response into list of questions"""
        questions = []
        lines = response_text.split('\n')
        
        for line in lines:
            line = line.strip()
            
            if not line:
                continue
            
            # Remove numbering (1., 2., etc.)
            if line[0].isdigit() and '.' in line[:3]:
                line = line[line.index('.')+1:].strip()
            
            if len(line) < 10:
                continue
            
            questions.append(line)
        
        return questions[:7]
    
    def verify_answers(self, founder_description, questions, answers):
        """Verify answers using AI by comparing with founder's description"""
        
        if not answers or len(answers) == 0:
            return {
                'overall_percentage': 0,
                'verified': False,
                'explanation': 'No answers provided'
            }
        
        verification_prompt = f"""You are a verification assistant. Check if the answers match the founder's item details.

FOUNDER'S ITEM DETAILS:
{founder_description}

QUESTIONS ASKED:
{self._format_questions_for_prompt(questions)}

OWNER'S ANSWERS:
{self._format_answers_for_prompt(answers)}

TASK:
- Compare each answer against the item details
- Accept simple, partial, or approximate answers (e.g. "black" matches "Black", "lib" matches "Library")
- Be lenient - the owner may not remember exact wording
- Score overall match (0-100)
- If score >= 60, set verified = true

OUTPUT FORMAT (ONLY):
SCORE: [number]
VERIFIED: [true/false]
EXPLANATION: [brief reason]"""
        
        try:
            result_text = self._chat(verification_prompt)
            result = self._parse_verification_response(result_text)
            
            return {
                'overall_percentage': result['score'],
                'verified': result['verified'],
                'explanation': result['message']
            }
        
        except Exception as e:
            return {
                'overall_percentage': 0,
                'verified': False,
                'explanation': f'Verification error: {str(e)}'
            }
    
    def _format_questions_for_prompt(self, questions):
        """Format questions for AI prompt"""
        formatted = ""
        for i, q in enumerate(questions, 1):
            formatted += f"{i}. {q}\n"
        return formatted
    
    def _format_answers_for_prompt(self, answers):
        """Format answers for AI prompt"""
        formatted = ""
        for i, a in enumerate(answers, 1):
            formatted += f"{i}. {a}\n"
        return formatted
    
    def _parse_verification_response(self, response_text):
        """Parse AI verification response"""
        lines = response_text.strip().split('\n')
        
        score = 0
        verified = False
        explanation = ""
        
        for line in lines:
            if 'SCORE:' in line:
                try:
                    score = int(line.split(':')[1].strip())
                except:
                    score = 0
            
            elif 'VERIFIED:' in line:
                verified = 'true' in line.lower()
            
            elif 'EXPLANATION:' in line:
                explanation = line.split(':', 1)[1].strip()
        
        return {
            "score": score,
            "verified": verified,
            "message": explanation if explanation else (
                f"Your answers were {score}% accurate. " + 
                ("✅ Ownership verified!" if verified else "❌ Not verified. Please try again.")
            )
        }