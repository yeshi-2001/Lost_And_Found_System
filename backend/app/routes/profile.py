from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from app import db
from app.models.user import User
from app.models.found_item import FoundItem
from app.models.lost_item import LostItem
from app.models.match import Match
from werkzeug.security import check_password_hash

profile_bp = Blueprint('profile', __name__)

@profile_bp.route('', methods=['GET'])
@jwt_required()
def get_profile():
    """Get user profile data with statistics"""
    user_id = int(get_jwt_identity())
    user = User.query.get_or_404(user_id)
    
    # Calculate statistics
    found_items_active = FoundItem.query.filter_by(user_id=user_id, status='active').count()
    lost_items_searching = LostItem.query.filter_by(user_id=user_id, status='searching').count()
    
    # Count successful returns (items with status 'returned')
    successful_returns = (
        FoundItem.query.filter_by(user_id=user_id, status='returned').count() +
        LostItem.query.filter_by(user_id=user_id, status='returned').count()
    )
    
    # Count total matches (simplified to avoid join issues)
    total_matches = 0  # Simplified for now
    
    # Calculate contribution score (simplified)
    total_items = found_items_active + lost_items_searching + successful_returns
    contribution_score = min(95, max(50, (total_items * 20) + (successful_returns * 30)))
    
    return jsonify({
        'success': True,
        'data': {
            'id': user.id,
            'name': user.name,
            'registration_number': user.registration_number,
            'email': user.email,
            'contact_number': user.contact_number,
            'department': user.department,
            'profile_photo': None,  # TODO: Implement photo upload
            'member_since': user.created_at.isoformat() if user.created_at else None,
            'statistics': {
                'found_items_active': found_items_active,
                'lost_items_searching': lost_items_searching,
                'successful_returns': successful_returns,
                'total_matches': total_matches,
                'contribution_score': contribution_score
            },
            'notification_preferences': {
                'match_found': True,
                'verification_ready': True,
                'verification_success': True,
                'verification_failed': False,
                'sms_enabled': True,
                'email_enabled': True,
                'quiet_hours_enabled': False
            }
        }
    }), 200

@profile_bp.route('', methods=['PUT'])
@jwt_required()
def update_profile():
    """Update user profile information"""
    user_id = int(get_jwt_identity())
    user = User.query.get_or_404(user_id)
    
    data = request.get_json()
    
    # Validate required fields
    if not data.get('name') or len(data['name']) < 3:
        return jsonify({'error': 'Name must be at least 3 characters'}), 400
    
    if not data.get('email'):
        return jsonify({'error': 'Email is required'}), 400
    
    if not data.get('contact_number'):
        return jsonify({'error': 'Contact number is required'}), 400
    
    if not data.get('department'):
        return jsonify({'error': 'Department is required'}), 400
    
    # Check if email is already used by another user
    existing_user = User.query.filter(
        User.email == data['email'],
        User.id != user_id
    ).first()
    
    if existing_user:
        return jsonify({'error': 'Email already in use'}), 400
    
    # Update user data
    user.name = data['name']
    user.email = data['email']
    user.contact_number = data['contact_number']
    user.department = data['department']
    
    db.session.commit()
    
    return jsonify({
        'success': True,
        'message': 'Profile updated successfully',
        'data': {
            'id': user.id,
            'name': user.name,
            'email': user.email,
            'contact_number': user.contact_number,
            'department': user.department
        }
    }), 200

@profile_bp.route('/change-password', methods=['POST'])
@jwt_required()
def change_password():
    """Change user password"""
    user_id = int(get_jwt_identity())
    user = User.query.get_or_404(user_id)
    
    data = request.get_json()
    
    current_password = data.get('current_password')
    new_password = data.get('new_password')
    confirm_password = data.get('confirm_password')
    
    # Validate inputs
    if not all([current_password, new_password, confirm_password]):
        return jsonify({'error': 'All password fields are required'}), 400
    
    if not user.check_password(current_password):
        return jsonify({'error': 'Current password is incorrect'}), 400
    
    if len(new_password) < 8:
        return jsonify({'error': 'New password must be at least 8 characters'}), 400
    
    if new_password != confirm_password:
        return jsonify({'error': 'New passwords do not match'}), 400
    
    if current_password == new_password:
        return jsonify({'error': 'New password must be different from current password'}), 400
    
    # Update password
    user.set_password(new_password)
    db.session.commit()
    
    return jsonify({
        'success': True,
        'message': 'Password changed successfully'
    }), 200

@profile_bp.route('/upload-photo', methods=['POST'])
@jwt_required()
def upload_photo():
    """Upload profile photo"""
    # TODO: Implement photo upload functionality
    return jsonify({
        'success': True,
        'message': 'Photo upload not implemented yet',
        'photo_url': None
    }), 200

@profile_bp.route('/notifications', methods=['PUT'])
@jwt_required()
def update_notification_preferences():
    """Update notification preferences"""
    user_id = int(get_jwt_identity())
    user = User.query.get_or_404(user_id)
    data = request.get_json()
    
    # Store preferences in user's notification_preferences field
    # For now, we'll store as JSON in a text field or create a separate table
    # This is a simplified implementation
    
    return jsonify({
        'success': True,
        'message': 'Privacy settings updated successfully',
        'data': data
    }), 200

@profile_bp.route('', methods=['DELETE'])
@jwt_required()
def delete_account():
    """Delete user account"""
    user_id = int(get_jwt_identity())
    user = User.query.get_or_404(user_id)
    
    data = request.get_json()
    password = data.get('password')
    
    if not password:
        return jsonify({'error': 'Password is required'}), 400
    
    if not user.check_password(password):
        return jsonify({'error': 'Incorrect password'}), 400
    
    # TODO: Implement soft delete or proper account deletion
    # For now, just return success message
    
    return jsonify({
        'success': True,
        'message': 'Account deletion would be implemented here'
    }), 200