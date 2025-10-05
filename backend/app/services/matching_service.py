from app import db
from app.models import FoundItem, LostItem, Match
from app.services.ai_service import AIService
from app.services.vector_service import VectorService
from sqlalchemy import text
from typing import List, Dict

class MatchingService:
    def __init__(self):
        self.ai_service = AIService()
        self.vector_service = VectorService()
    
    def find_matches(self, lost_item: LostItem, threshold: float = 0.8) -> List[Dict]:
        """Find potential matches for a lost item"""
        if not lost_item.embedding:
            # Generate embedding if not exists
            description = f"{lost_item.title} {lost_item.description or ''} {lost_item.brand or ''} {lost_item.color or ''}"
            embedding = self.ai_service.generate_embedding(description)
            lost_item.embedding = embedding
            db.session.commit()
        
        # Vector similarity search
        query = text("""
            SELECT id, title, description, brand, color, location, 
                   1 - (embedding <=> :embedding) as similarity_score
            FROM found_items 
            WHERE status = 'active' 
              AND 1 - (embedding <=> :embedding) >= :threshold
            ORDER BY similarity_score DESC
            LIMIT 10
        """)
        
        results = db.session.execute(query, {
            'embedding': lost_item.embedding,
            'threshold': threshold
        }).fetchall()
        
        matches = []
        for result in results:
            found_item = FoundItem.query.get(result.id)
            if found_item:
                matches.append({
                    'found_item': found_item,
                    'similarity_score': float(result.similarity_score)
                })
        
        return matches
    
    def create_match(self, found_item_id: int, lost_item_id: int, similarity_score: float) -> Match:
        """Create a new match record"""
        # Check if match already exists
        existing_match = Match.query.filter_by(
            found_item_id=found_item_id,
            lost_item_id=lost_item_id
        ).first()
        
        if existing_match:
            return existing_match
        
        # Generate verification questions
        found_item = FoundItem.query.get(found_item_id)
        questions = self.ai_service.generate_verification_questions(found_item.to_dict())
        
        match = Match(
            found_item_id=found_item_id,
            lost_item_id=lost_item_id,
            similarity_score=similarity_score,
            verification_questions=questions,
            status='pending'
        )
        
        db.session.add(match)
        db.session.commit()
        
        return match
    
    def verify_match(self, match_id: int, answers: List[str]) -> bool:
        """Verify a match based on user answers"""
        match = Match.query.get(match_id)
        if not match:
            return False
        
        # Store answers
        match.verification_answers = answers
        
        # Get AI confidence score
        found_item = match.found_item
        confidence_score = self.ai_service.verify_ownership(
            match.verification_questions,
            answers,
            found_item.to_dict()
        )
        
        match.ai_confidence_score = confidence_score
        
        # Verify if confidence is high enough
        if confidence_score >= 0.85:
            match.status = 'verified'
            from datetime import datetime
            match.verified_at = datetime.utcnow()
            db.session.commit()
            return True
        else:
            match.status = 'rejected'
            db.session.commit()
            return False