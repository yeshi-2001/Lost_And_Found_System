from app import db
from app.models.notification import Notification
from datetime import datetime

class NotificationService:
    
    def send_match_notification(self, user_id, match):
        """Send match found notification to lost item owner"""
        lost_item = match.lost_item
        found_item = match.found_item
        
        notification = Notification(
            user_id=user_id,
            type='match_found',
            title='Match Found! 🎉',
            message=f'We found an item matching your lost {lost_item.item_name}!',
            data={
                'match_id': match.id,
                'similarity_score': float(match.similarity_score),
                'item_name': lost_item.item_name,
                'found_location': found_item.location,
                'found_date': found_item.date_found.isoformat(),
                'found_item_ref': found_item.reference_id
            },
            action_url=f'/verification/{match.id}',
            priority='high'
        )
        
        db.session.add(notification)
        db.session.commit()
        
        # TODO: Send SMS and email
        return notification
    
    def send_verification_ready_notification(self, user_id, match):
        """Send verification questions ready notification"""
        notification = Notification(
            user_id=user_id,
            type='verification_ready',
            title='Verification Questions Ready ✅',
            message=f'Please answer 5 questions to confirm ownership of your {match.lost_item.item_name}',
            data={
                'match_id': match.id,
                'similarity_score': float(match.similarity_score),
                'estimated_time': '2 minutes'
            },
            action_url=f'/verification/{match.id}',
            priority='high'
        )
        
        db.session.add(notification)
        db.session.commit()
        return notification
    
    def send_verification_success_notifications(self, match):
        """Send success notifications to both parties"""
        lost_item = match.lost_item
        found_item = match.found_item
        
        # Notification to lost item owner
        owner_notification = Notification(
            user_id=lost_item.user_id,
            type='verification_success',
            title='Verified! 🎊',
            message=f'Congratulations! You\'ve been verified as the owner of the {lost_item.item_name}!',
            data={
                'match_id': match.id,
                'finder_name': found_item.user.name if found_item.user else 'Unknown',
                'finder_phone': found_item.user.contact_number if found_item.user else 'Unknown',
                'finder_registration': found_item.user.registration_number if found_item.user else 'Unknown'
            },
            priority='high'
        )
        
        # Notification to finder
        finder_notification = Notification(
            user_id=found_item.user_id,
            type='owner_verified',
            title='Owner Verified! ✅',
            message=f'{lost_item.user.name if lost_item.user else "Someone"} has been verified as the owner of the {found_item.item_name}',
            data={
                'match_id': match.id,
                'owner_name': lost_item.user.name if lost_item.user else 'Unknown',
                'owner_phone': lost_item.user.contact_number if lost_item.user else 'Unknown',
                'owner_registration': lost_item.user.registration_number if lost_item.user else 'Unknown'
            },
            priority='high'
        )
        
        db.session.add(owner_notification)
        db.session.add(finder_notification)
        db.session.commit()
        
        return owner_notification, finder_notification
    
    def send_verification_failed_notification(self, user_id, match, accuracy_score):
        """Send verification failed notification"""
        notification = Notification(
            user_id=user_id,
            type='verification_failed',
            title='Verification Unsuccessful ❌',
            message=f'Your answers didn\'t match well enough ({accuracy_score}% accuracy)',
            data={
                'match_id': match.id,
                'accuracy_score': accuracy_score,
                'attempts_remaining': 1,
                'suggestions': [
                    'Try again (1 attempt remaining)',
                    'Update your description',
                    'Wait for other matches'
                ]
            },
            action_url=f'/verification/{match.id}',
            priority='medium'
        )
        
        db.session.add(notification)
        db.session.commit()
        return notification
    
    def send_return_confirmation_reminder(self, match):
        """Send return confirmation reminder to both parties"""
        lost_item = match.lost_item
        found_item = match.found_item
        
        # Same message to both parties
        message = f'Just checking - did you successfully exchange the {lost_item.item_name}?'
        
        owner_notification = Notification(
            user_id=lost_item.user_id,
            type='return_reminder',
            title='Did You Meet? 📦',
            message=message,
            data={'match_id': match.id},
            priority='low'
        )
        
        finder_notification = Notification(
            user_id=found_item.user_id,
            type='return_reminder',
            title='Did You Meet? 📦',
            message=message,
            data={'match_id': match.id},
            priority='low'
        )
        
        db.session.add(owner_notification)
        db.session.add(finder_notification)
        db.session.commit()
        
        return owner_notification, finder_notification
    
    def get_user_notifications(self, user_id, unread_only=False):
        """Get notifications for a user"""
        query = Notification.query.filter_by(user_id=user_id)
        
        if unread_only:
            query = query.filter_by(read=False)
        
        return query.order_by(Notification.created_at.desc()).all()
    
    def mark_notification_read(self, notification_id, user_id):
        """Mark notification as read"""
        notification = Notification.query.filter_by(id=notification_id, user_id=user_id).first()
        if notification:
            notification.read = True
            notification.read_at = datetime.utcnow()
            db.session.commit()
            return True
        return False