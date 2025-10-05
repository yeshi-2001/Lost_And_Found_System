from app import db
from datetime import datetime

class Match(db.Model):
    __tablename__ = 'matches'
    
    id = db.Column(db.Integer, primary_key=True)
    found_item_id = db.Column(db.Integer, db.ForeignKey('found_items.id'), nullable=False)
    lost_item_id = db.Column(db.Integer, db.ForeignKey('lost_items.id'), nullable=False)
    similarity_score = db.Column(db.Float)
    verification_questions = db.Column(db.JSON)
    verification_answers = db.Column(db.JSON)
    ai_confidence_score = db.Column(db.Float)
    contact_shared = db.Column(db.Boolean, default=False)
    status = db.Column(db.String(50), default='pending')  # 'pending', 'verified', 'rejected'
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    verified_at = db.Column(db.DateTime)
    
    def to_dict(self):
        return {
            'id': self.id,
            'found_item_id': self.found_item_id,
            'lost_item_id': self.lost_item_id,
            'similarity_score': self.similarity_score,
            'verification_questions': self.verification_questions,
            'ai_confidence_score': self.ai_confidence_score,
            'contact_shared': self.contact_shared,
            'status': self.status,
            'created_at': self.created_at.isoformat() if self.created_at else None,
            'verified_at': self.verified_at.isoformat() if self.verified_at else None
        }