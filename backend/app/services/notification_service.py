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
        
        # Send email notification
        try:
            from app.services.email_service import EmailService
            from app.models.user import User
            email_service = EmailService()
            user = User.query.get(user_id)
            if user:
                html = f"""
                <html><body style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;">
                <div style="background:linear-gradient(135deg,#3E2723,#6D4C41);padding:30px;border-radius:10px 10px 0 0;text-align:center;">
                  <h1 style="color:white;margin:0;">&#127881; Match Found!</h1>
                </div>
                <div style="background:#EFEBE9;padding:30px;border-radius:0 0 10px 10px;">
                  <p>Hi <strong>{user.name}</strong>,</p>
                  <p>We found a potential match for your lost item <strong>{lost_item.item_name}</strong>!</p>
                  <div style="background:#D7CCC8;padding:15px;border-radius:8px;margin:20px 0;">
                    <p style="margin:0;"><strong>Match Score:</strong> {round(float(match.similarity_score))}%</p>
                    <p style="margin:5px 0 0;"><strong>Found at:</strong> {found_item.location}</p>
                    <p style="margin:5px 0 0;"><strong>Found on:</strong> {found_item.date_found}</p>
                  </div>
                  <div style="text-align:center;margin:25px 0;">
                    <a href="http://localhost:3000/matches" style="background:#3E2723;color:white;padding:12px 30px;text-decoration:none;border-radius:8px;font-weight:bold;">Verify Ownership Now</a>
                  </div>
                  <p style="color:#6D4C41;font-size:13px;">Back2U Team</p>
                </div>
                </body></html>
                """
                email_service.send_email(user.email, f'Match Found for {lost_item.item_name} - Back2U', html)
        except Exception as e:
            print(f"Match notification email error: {e}")
        
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
        
        # Send emails to both parties
        try:
            from app.services.email_service import EmailService
            email_service = EmailService()
            owner = lost_item.user
            finder = found_item.user
            
            if owner:
                owner_html = f"""
                <html><body style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;">
                <div style="background:linear-gradient(135deg,#3E2723,#6D4C41);padding:30px;border-radius:10px 10px 0 0;text-align:center;">
                  <h1 style="color:white;margin:0;">&#127881; Your Item is Verified!</h1>
                </div>
                <div style="background:#EFEBE9;padding:30px;border-radius:0 0 10px 10px;">
                  <p>Hi <strong>{owner.name}</strong>,</p>
                  <p>You have been verified as the owner of <strong>{lost_item.item_name}</strong>. Here are the finder's contact details:</p>
                  <div style="background:#D7CCC8;padding:15px;border-radius:8px;margin:20px 0;">
                    <p style="margin:0;"><strong>Name:</strong> {finder.name if finder else 'N/A'}</p>
                    <p style="margin:5px 0 0;"><strong>Email:</strong> {finder.email if finder else 'N/A'}</p>
                    <p style="margin:5px 0 0;"><strong>Phone:</strong> {finder.contact_number if finder else 'N/A'}</p>
                    <p style="margin:5px 0 0;"><strong>Registration:</strong> {finder.registration_number if finder else 'N/A'}</p>
                  </div>
                  <p>Please contact the finder to arrange pickup of your item.</p>
                  <div style="text-align:center;margin:25px 0;">
                    <a href="http://localhost:3000/matches" style="background:#3E2723;color:white;padding:12px 30px;text-decoration:none;border-radius:8px;font-weight:bold;">View Matches</a>
                  </div>
                  <p style="color:#6D4C41;font-size:13px;">Back2U Team</p>
                </div></body></html>
                """
                email_service.send_email(owner.email, f'Ownership Verified - Contact Details for {lost_item.item_name}', owner_html)
            
            if finder:
                finder_html = f"""
                <html><body style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;">
                <div style="background:linear-gradient(135deg,#3E2723,#6D4C41);padding:30px;border-radius:10px 10px 0 0;text-align:center;">
                  <h1 style="color:white;margin:0;">&#9989; Owner Verified!</h1>
                </div>
                <div style="background:#EFEBE9;padding:30px;border-radius:0 0 10px 10px;">
                  <p>Hi <strong>{finder.name}</strong>,</p>
                  <p>The owner of <strong>{found_item.item_name}</strong> has been verified. Here are their contact details:</p>
                  <div style="background:#D7CCC8;padding:15px;border-radius:8px;margin:20px 0;">
                    <p style="margin:0;"><strong>Name:</strong> {owner.name if owner else 'N/A'}</p>
                    <p style="margin:5px 0 0;"><strong>Email:</strong> {owner.email if owner else 'N/A'}</p>
                    <p style="margin:5px 0 0;"><strong>Phone:</strong> {owner.contact_number if owner else 'N/A'}</p>
                    <p style="margin:5px 0 0;"><strong>Registration:</strong> {owner.registration_number if owner else 'N/A'}</p>
                  </div>
                  <p>The owner will contact you soon to arrange pickup. Thank you for helping!</p>
                  <div style="text-align:center;margin:25px 0;">
                    <a href="http://localhost:3000/matches" style="background:#3E2723;color:white;padding:12px 30px;text-decoration:none;border-radius:8px;font-weight:bold;">View Matches</a>
                  </div>
                  <p style="color:#6D4C41;font-size:13px;">Back2U Team</p>
                </div></body></html>
                """
                email_service.send_email(finder.email, f'Owner Verified - Contact Details Shared for {found_item.item_name}', finder_html)
        except Exception as e:
            print(f"Verification success email error: {e}")
        
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