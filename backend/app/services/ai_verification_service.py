import google.generativeai as genai
import os
from datetime import datetime

class AIVerificationService:
    """Dynamic AI verification service using Google Generative AI"""
    
    def __init__(self):
        """Initialize with Google Generative AI API key"""
        api_key = os.environ.get('GOOGLE_API_KEY')
        if not api_key:
            raise ValueError("GOOGLE_API_KEY environment variable is required")
        
        genai.configure(api_key=api_key)
        self.model = genai.GenerativeModel('gemini-2.0-flash')
    
    def generate_verification_questions(self, founder_description):
        """Generate verification questions from founder's description using AI"""
        
        system_prompt = """You are a verification expert for a lost and found system.
Your job is to generate questions that ONLY the real owner would know the answer to.

IMPORTANT RULES:
1. Generate exactly 5-7 verification questions
2. Questions must be based ONLY on details in the description
3. Each question should target one specific detail
4. Mix question types (color, location, condition, accessories, etc.)
5. Make questions specific - not generic
6. Avoid yes/no questions - use open-ended questions
7. Questions should be natural and conversational
8. Focus on unique/identifying features mentioned
9. Output ONLY the questions, one per line, numbered 1-7

QUESTION GENERATION STRATEGY:
- Extract key details from description
- Create questions about: colors, damage, accessories, condition, markings
- Make questions that require specific knowledge
- Avoid questions about obvious information
- Focus on details only the owner would remember

Remember: The goal is to verify REAL ownership.
Generate questions accordingly."""
        
        user_message = f"""Based on this found item description, generate verification questions:

FOUND ITEM DESCRIPTION:
{founder_description}

Generate 5-7 verification questions that ONLY the real owner would know.
Remember: Questions must be specific to details mentioned in the description above.
Output format: Number the questions 1-7, one per line."""
        
        try:
            response = self.model.generate_content(
                f"{system_prompt}\n\n{user_message}",
                generation_config=genai.types.GenerationConfig(
                    temperature=0.7,
                    top_p=0.8,
                    max_output_tokens=1000
                )
            )
            
            questions_text = response.text.strip()
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
        
        verification_prompt = f"""You are a verification expert. Evaluate if these answers prove the person is the REAL owner.

FOUNDER'S DESCRIPTION:
{founder_description}

QUESTIONS ASKED:
{self._format_questions_for_prompt(questions)}

OWNER'S ANSWERS:
{self._format_answers_for_prompt(answers)}

TASK:
1. Check if answers match key details from description
2. Score each answer (0-100):
   - 100: Perfect match with specific details
   - 75-99: Good match, mostly correct
   - 50-74: Partial match, some correct details
   - 25-49: Weak match, minimal correct details
   - 0-24: No match or incorrect
3. Calculate AVERAGE score of all answers
4. If average >= 75%, set verified = true, else false
5. Provide brief explanation

OUTPUT FORMAT (ONLY):
SCORE: [number]
VERIFIED: [true/false]
EXPLANATION: [brief reason]"""
        
        try:
            response = self.model.generate_content(verification_prompt)
            result = self._parse_verification_response(response.text)
            
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