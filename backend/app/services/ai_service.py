# FREE ALTERNATIVE: Using Hugging Face models instead of OpenAI
from sentence_transformers import SentenceTransformer
from transformers import pipeline
import os
from typing import List, Dict

class AIService:
    def __init__(self):
        # FREE: Using sentence-transformers for embeddings (replaces OpenAI text-embedding-ada-002)
        # This model generates 384-dimensional vectors instead of OpenAI's 1536
        self.embedding_model = SentenceTransformer('all-MiniLM-L6-v2')
        # Optional: Text generation pipeline (not currently used but available)
        self.qa_pipeline = pipeline('text-generation', model='microsoft/DialoGPT-medium', max_length=100)
    
    def generate_embedding(self, text: str) -> List[float]:
        """Generate embedding for text using Sentence Transformers"""
        try:
            # FREE: Using local sentence transformer model instead of OpenAI API
            # This runs on your machine, no API calls or costs
            embedding = self.embedding_model.encode(text)
            return embedding.tolist()  # Convert numpy array to list
        except Exception as e:
            print(f"Error generating embedding: {e}")
            return []
    
    def generate_verification_questions(self, found_item_data: Dict) -> List[str]:
        """Generate verification questions based on found item details"""
        # FREE ALTERNATIVE: Using template-based questions instead of GPT-4
        # This avoids OpenAI API costs while still providing good verification
        questions = [
            f"What is the exact color of your {found_item_data.get('title', 'item')}?",
            f"What brand is your {found_item_data.get('title', 'item')}?",
            "Where did you lose this item?",
            "When did you lose this item?",
            "What was inside the item when you lost it?",
            "Are there any unique marks or scratches on the item?",
            "What size is the item?"
        ]
        
        # Dynamically add questions based on available item details
        if found_item_data.get('description'):
            questions.append("Can you describe any specific details about your item?")
        if found_item_data.get('location'):
            questions.append(f"Is {found_item_data['location']} near where you lost it?")
            
        return questions[:7]  # Return maximum 7 questions
    
    def verify_ownership(self, questions: List[str], answers: List[str], found_item_data: Dict) -> float:
        """Verify ownership based on answers to questions"""
        # FREE ALTERNATIVE: Using keyword matching instead of GPT-4 verification
        # This provides basic verification without API costs
        score = 0.0
        total_questions = len(questions)
        
        if total_questions == 0:
            return 0.0
        
        for i, (question, answer) in enumerate(zip(questions, answers)):
            if not answer or len(answer.strip()) < 2:
                continue  # Skip empty answers
                
            # Convert to lowercase for case-insensitive matching
            answer_lower = answer.lower().strip()
            
            # Check for exact matches with item details
            if 'color' in question.lower():
                # Full points for correct color match
                if found_item_data.get('color', '').lower() in answer_lower:
                    score += 1.0
            elif 'brand' in question.lower():
                # Full points for correct brand match
                if found_item_data.get('brand', '').lower() in answer_lower:
                    score += 1.0
            elif 'location' in question.lower() or 'where' in question.lower():
                # Partial points for location (might be nearby, not exact)
                if found_item_data.get('location', '').lower() in answer_lower:
                    score += 0.8
            else:
                # Give partial credit for detailed answers (shows genuine knowledge)
                if len(answer_lower) > 10:
                    score += 0.6
        
        # Return confidence score between 0.0 and 1.0
        return min(score / total_questions, 1.0)