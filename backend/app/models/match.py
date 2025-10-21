from app import db
from datetime import datetime

class Match(db.Model):
    __tablename__ = 'matches'
    
    id = db.Column(db.Integer, primary_key=True)
    found_item_id = db.Column(db.Integer, db.ForeignKey('found_items.id'), nullable=False)
    lost_item_id = db.Column(db.Integer, db.ForeignKey('lost_items.id'), nullable=False)
    similarity_score = db.Column(db.Numeric(5,2), nullable=False)
    
    # Score breakdown for transparency
    category_score = db.Column(db.Numeric(5,2), default=0)
    brand_score = db.Column(db.Numeric(5,2), default=0)
    color_score = db.Column(db.Numeric(5,2), default=0)
    location_score = db.Column(db.Numeric(5,2), default=0)
    date_score = db.Column(db.Numeric(5,2), default=0)
    name_score = db.Column(db.Numeric(5,2), default=0)
    description_score = db.Column(db.Numeric(5,2), default=0)
    
    status = db.Column(db.String(50), default='pending_verification')
    
    # Verification fields for AI-generated questions
    verification_questions = db.Column(db.JSON)  # Store AI-generated questions
    verification_answers = db.Column(db.JSON)    # Store user's answers
    verification_score = db.Column(db.Numeric(5,2))  # AI verification score
    verification_verified = db.Column(db.Boolean, default=False)  # Final verification result
    verification_explanation = db.Column(db.Text)  # AI explanation
    verification_generated_at = db.Column(db.DateTime)  # When questions were generated
    verification_completed_at = db.Column(db.DateTime)  # When verification was completed
    
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Relationships
    found_item = db.relationship('FoundItem', back_populates='matches')
    lost_item = db.relationship('LostItem', back_populates='matches')
    
    __table_args__ = (db.UniqueConstraint('found_item_id', 'lost_item_id'),)
    
    def to_dict(self):
        return {
            'match_id': self.id,
            'similarity_score': float(self.similarity_score),
            'score_breakdown': {
                'category': float(self.category_score),
                'brand': float(self.brand_score),
                'color': float(self.color_score),
                'location': float(self.location_score),
                'date': float(self.date_score),
                'name': float(self.name_score),
                'description': float(self.description_score)
            },
            'status': self.status,
            'created_at': self.created_at.isoformat()
        }