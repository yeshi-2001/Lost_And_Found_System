from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from app.services.notification_service import NotificationService

notifications_bp = Blueprint('notifications', __name__)
notification_service = NotificationService()

@notifications_bp.route('', methods=['GET'])
@jwt_required()
def get_notifications():
    """Get all notifications for current user"""
    user_id = int(get_jwt_identity())
    unread_only = request.args.get('unread_only', 'false').lower() == 'true'
    
    notifications = notification_service.get_user_notifications(user_id, unread_only)
    
    return jsonify({
        'notifications': [notification.to_dict() for notification in notifications],
        'total_count': len(notifications),
        'unread_count': len([n for n in notifications if not n.read])
    }), 200

@notifications_bp.route('/<int:notification_id>/read', methods=['POST'])
@jwt_required()
def mark_notification_read(notification_id):
    """Mark notification as read"""
    user_id = int(get_jwt_identity())
    
    success = notification_service.mark_notification_read(notification_id, user_id)
    
    if success:
        return jsonify({'message': 'Notification marked as read'}), 200
    else:
        return jsonify({'error': 'Notification not found'}), 404

@notifications_bp.route('/unread-count', methods=['GET'])
@jwt_required()
def get_unread_count():
    """Get count of unread notifications"""
    user_id = int(get_jwt_identity())
    
    notifications = notification_service.get_user_notifications(user_id, unread_only=True)
    
    return jsonify({
        'unread_count': len(notifications)
    }), 200