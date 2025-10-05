from app import db
from datetime import datetime
from pgvector.sqlalchemy import Vector

class LostItem(db.Model):
    __tablename__ = 'lost_items'
    
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    title = db.Column(db.String(255), nullable=False)
    description = db.Column(db.Text)
    category = db.Column(db.String(100))
    brand = db.Column(db.String(100))
    color = db.Column(db.String(50))
    last_seen_location = db.Column(db.String(255))
    lost_date = db.Column(db.Date)
    image_urls = db.Column(db.ARRAY(db.Text))
    # CHANGED: Vector size from 1536 (OpenAI) to 384 (sentence-transformers)
    embedding = db.Column(Vector(384))
    status = db.Column(db.String(50), default='searching')
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    # Relationships
    matches = db.relationship('Match', foreign_keys='Match.lost_item_id', backref='lost_item', lazy=True)
    
    def to_dict(self):
        return {
            'id': self.id,
            'user_id': self.user_id,
            'title': self.title,
            'description': self.description,
            'category': self.category,
            'brand': self.brand,
            'color': self.color,
            'last_seen_location': self.last_seen_location,
            'lost_date': self.lost_date.isoformat() if self.lost_date else None,
            'image_urls': self.image_urls or [],
            'status': self.status,
            'created_at': self.created_at.isoformat() if self.created_at else None
        }