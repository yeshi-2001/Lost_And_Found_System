from app import db
from datetime import datetime

class Notification(db.Model):
    __tablename__ = 'notifications'
    
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    type = db.Column(db.String(50), nullable=False)
    title = db.Column(db.String(100), nullable=False)
    message = db.Column(db.Text, nullable=False)
    data = db.Column(db.JSON)
    action_url = db.Column(db.String(500))
    priority = db.Column(db.String(20), default='medium')
    read = db.Column(db.Boolean, default=False)
    read_at = db.Column(db.DateTime)
    delivered = db.Column(db.Boolean, default=False)
    delivered_at = db.Column(db.DateTime)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    # Relationships
    user = db.relationship('User', backref='notifications')
    
    def to_dict(self):
        return {
            'id': self.id,
            'type': self.type,
            'title': self.title,
            'message': self.message,
            'data': self.data,
            'action_url': self.action_url,
            'priority': self.priority,
            'read': self.read,
            'created_at': self.created_at.isoformat()
        }