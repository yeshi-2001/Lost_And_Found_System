from app import db
from datetime import datetime
from pgvector.sqlalchemy import Vector

class FoundItem(db.Model):
    __tablename__ = 'found_items'
    
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    item_name = db.Column(db.String(255), nullable=False)
    description = db.Column(db.Text)
    category = db.Column(db.String(100))
    brand = db.Column(db.String(100))
    color = db.Column(db.String(50))
    location_found = db.Column(db.String(255))
    found_date = db.Column(db.Date)
    image_urls = db.Column(db.ARRAY(db.Text))
    # CHANGED: Vector size from 1536 (OpenAI) to 384 (sentence-transformers)
    embedding = db.Column(Vector(384))
    status = db.Column(db.String(50), default='active')
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    # Relationships
    matches = db.relationship('Match', foreign_keys='Match.found_item_id', backref='found_item', lazy=True)
    
    def to_dict(self):
        return {
            'id': self.id,
            'user_id': self.user_id,
            'item_name': self.item_name,
            'description': self.description,
            'category': self.category,
            'brand': self.brand,
            'color': self.color,
            'location_found': self.location_found,
            'found_date': self.found_date.isoformat() if self.found_date else None,
            'image_urls': self.image_urls or [],
            'status': self.status,
            'created_at': self.created_at.isoformat() if self.created_at else None
        }