import openai
import json
import os
from dotenv import load_dotenv

load_dotenv()

class AIVerificationService:
    def __init__(self):
        # Set OpenAI API key from environment
        openai.api_key = os.getenv('OPENAI_API_KEY')
        
    def generate_verification_questions(self, found_item_description, item_category, item_name):
        """Generate verification questions using OpenAI"""
        
        if not openai.api_key:
            # Fallback to template questions if no API key
            return self.generate_template_questions(found_item_description, item_category, item_name)
        
        try:
            prompt = f"""You are a verification assistant for a university lost and found system. 
A student has lost an item and someone has found a matching item.

FOUND ITEM DETAILS (Known by finder):
Category: {item_category}
Item: {item_name}
Description: "{found_item_description}"

TASK:
Generate 5 verification questions that only the real owner would know. 
Questions should be:
1. Specific to details in the description
2. Not too easy (not just "what color")
3. Not too hard (answerable by real owner)
4. Focus on unique features mentioned
5. Clear and direct

Format: Return ONLY the questions, numbered 1-5, no additional text."""

            response = openai.ChatCompletion.create(
                model="gpt-3.5-turbo",
                messages=[
                    {"role": "system", "content": "You are a verification assistant for a lost and found system."},
                    {"role": "user", "content": prompt}
                ],
                temperature=0.7,
                max_tokens=300
            )
            
            questions_text = response.choices[0].message.content.strip()
            questions = self.parse_questions(questions_text)
            
            return questions
            
        except Exception as e:
            print(f"OpenAI API error: {e}")
            # Fallback to template questions
            return self.generate_template_questions(found_item_description, item_category, item_name)
    
    def verify_answers(self, found_item_description, questions, answers):
        """Verify answers using OpenAI"""
        
        if not openai.api_key:
            # Fallback to simple keyword matching
            return self.simple_answer_verification(found_item_description, questions, answers)
        
        try:
            questions_formatted = "\n".join([f"{i+1}. {q}" for i, q in enumerate(questions)])
            answers_formatted = "\n".join([f"{i+1}. \"{a}\"" for i, a in enumerate(answers)])
            
            prompt = f"""You are verifying if someone is the real owner of a lost item.

ORIGINAL DESCRIPTION FROM FINDER:
"{found_item_description}"

QUESTIONS ASKED:
{questions_formatted}

ANSWERS PROVIDED BY CLAIMANT:
{answers_formatted}

TASK:
Evaluate each answer against the original description. For each answer, provide:
- CORRECT, PARTIALLY CORRECT, or INCORRECT
- Confidence level (0-100%)
- Brief reason

Then provide:
- Overall match percentage
- VERIFIED or NOT VERIFIED (need 75%+ to verify)

Format as JSON:
{{
  "answers": [
    {{"question": 1, "status": "CORRECT", "confidence": 100, "reason": "..."}},
    ...
  ],
  "overall_percentage": 85,
  "verification_result": "VERIFIED",
  "recommendation": "Strong match, confident this is the real owner"
}}"""

            response = openai.ChatCompletion.create(
                model="gpt-3.5-turbo",
                messages=[
                    {"role": "system", "content": "You are verifying ownership of lost items. Respond only with valid JSON."},
                    {"role": "user", "content": prompt}
                ],
                temperature=0.3,
                max_tokens=500
            )
            
            result_text = response.choices[0].message.content.strip()
            result = json.loads(result_text)
            
            return result
            
        except Exception as e:
            print(f"OpenAI verification error: {e}")
            # Fallback to simple verification
            return self.simple_answer_verification(found_item_description, questions, answers)
    
    def parse_questions(self, questions_text):
        """Parse questions from OpenAI response"""
        lines = questions_text.strip().split('\n')
        questions = []
        
        for line in lines:
            line = line.strip()
            if line and (line[0].isdigit() or line.startswith('-')):
                # Remove numbering
                question = line.split('.', 1)[-1].strip()
                if question:
                    questions.append(question)
        
        return questions[:5]  # Max 5 questions
    
    def generate_template_questions(self, description, category, item_name):
        """Generate template questions when OpenAI is not available"""
        questions = []
        
        # Extract key details from description
        desc_lower = description.lower()
        
        # Color questions
        if 'color' in desc_lower or 'black' in desc_lower or 'white' in desc_lower or 'blue' in desc_lower:
            questions.append(f"What is the exact color of your {item_name}?")
        
        # Case/cover questions
        if 'case' in desc_lower or 'cover' in desc_lower:
            questions.append(f"Describe the case or cover on your {item_name}.")
        
        # Damage/condition questions
        if 'scratch' in desc_lower or 'dent' in desc_lower or 'damage' in desc_lower:
            questions.append("Describe any damage, scratches, or marks on your item.")
        
        # Sticker/marking questions
        if 'sticker' in desc_lower or 'logo' in desc_lower:
            questions.append("Are there any stickers, logos, or markings on your item?")
        
        # Location questions
        questions.append("Where exactly did you lose this item?")
        
        # Contents questions (for bags, wallets, etc.)
        if category.lower() in ['personal items', 'bags & accessories']:
            questions.append("What was inside your item when you lost it?")
        
        # Brand questions
        questions.append(f"What brand is your {item_name}?")
        
        return questions[:5]
    
    def simple_answer_verification(self, description, questions, answers):
        """Simple keyword-based verification when OpenAI is not available"""
        desc_lower = description.lower()
        correct_answers = 0
        total_answers = len(answers)
        
        answer_results = []
        
        for i, answer in enumerate(answers):
            answer_lower = answer.lower().strip()
            confidence = 0
            status = "INCORRECT"
            reason = "Answer doesn't match description"
            
            # Simple keyword matching
            answer_words = set(answer_lower.split())
            desc_words = set(desc_lower.split())
            
            # Check for common words
            common_words = answer_words.intersection(desc_words)
            if len(common_words) > 0:
                confidence = min(len(common_words) * 20, 100)
                if confidence >= 60:
                    status = "CORRECT"
                    correct_answers += 1
                    reason = "Answer matches description details"
                elif confidence >= 30:
                    status = "PARTIALLY CORRECT"
                    correct_answers += 0.5
                    reason = "Answer partially matches description"
            
            answer_results.append({
                "question": i + 1,
                "status": status,
                "confidence": confidence,
                "reason": reason
            })
        
        overall_percentage = (correct_answers / total_answers) * 100 if total_answers > 0 else 0
        verification_result = "VERIFIED" if overall_percentage >= 75 else "NOT VERIFIED"
        
        return {
            "answers": answer_results,
            "overall_percentage": round(overall_percentage, 1),
            "verification_result": verification_result,
            "recommendation": f"Simple verification: {overall_percentage:.1f}% match"
        }