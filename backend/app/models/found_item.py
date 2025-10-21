from app import db
from datetime import datetime


class FoundItem(db.Model):
    __tablename__ = 'found_items'
    
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    category = db.Column(db.String(100), nullable=False)
    item_name = db.Column(db.String(255), nullable=False)
    brand = db.Column(db.String(100))
    color = db.Column(db.String(50), nullable=False)
    location = db.Column(db.String(255), nullable=False)
    date_found = db.Column(db.Date, nullable=False)
    description = db.Column(db.Text, nullable=False)
    image_urls = db.Column(db.ARRAY(db.Text))

    reference_id = db.Column(db.String(50), unique=True)
    status = db.Column(db.String(50), default='active')
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    # Relationships
    matches = db.relationship('Match', foreign_keys='Match.found_item_id', back_populates='found_item', lazy=True)
    

    
    def to_dict(self):
        return {
            'id': self.id,
            'user_id': self.user_id,
            'category': self.category,
            'item_name': self.item_name,
            'brand': self.brand,
            'color': self.color,
            'location': self.location,
            'date_found': self.date_found.isoformat() if self.date_found else None,
            'description': self.description,
            'image_urls': self.image_urls or [],
            'reference_id': self.reference_id,
            'status': self.status,
            'created_at': self.created_at.isoformat() if self.created_at else None
        }