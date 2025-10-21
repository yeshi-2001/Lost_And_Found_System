from app import db
from datetime import datetime

class LostItem(db.Model):
    __tablename__ = 'lost_items'
    
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    category = db.Column(db.String(100), nullable=False)
    item_name = db.Column(db.String(255), nullable=False)
    brand = db.Column(db.String(100))
    color = db.Column(db.String(50), nullable=False)
    location = db.Column(db.String(255), nullable=False)
    date_lost = db.Column(db.Date, nullable=False)
    description = db.Column(db.Text, nullable=False)
    additional_info = db.Column(db.Text)
    image_urls = db.Column(db.ARRAY(db.Text))
    reference_id = db.Column(db.String(50), unique=True)
    status = db.Column(db.String(50), default='searching')
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    # Relationships
    matches = db.relationship('Match', foreign_keys='Match.lost_item_id', back_populates='lost_item', lazy=True)
    

    
    def to_dict(self):
        return {
            'id': self.id,
            'user_id': self.user_id,
            'category': self.category,
            'item_name': self.item_name,
            'brand': self.brand,
            'color': self.color,
            'location': self.location,
            'date_lost': self.date_lost.isoformat() if self.date_lost else None,
            'description': self.description,
            'additional_info': self.additional_info,
            'image_urls': self.image_urls or [],
            'reference_id': self.reference_id,
            'status': self.status,
            'created_at': self.created_at.isoformat() if self.created_at else None
        }