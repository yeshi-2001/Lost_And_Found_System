from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from app import db
from app.models.match import Match
from app.services.matching_service import MatchingService
from app.services.notification_service import NotificationService

matches_bp = Blueprint('matches', __name__)
matching_service = MatchingService()
notification_service = NotificationService()

@matches_bp.route('/trigger', methods=['POST'])
@jwt_required()
def trigger_matching():
    """Manually trigger matching for a lost item"""
    data = request.get_json()
    lost_item_id = data.get('lost_item_id')
    
    if not lost_item_id:
        return jsonify({'error': 'lost_item_id required'}), 400
    
    from app.models.lost_item import LostItem
    lost_item = LostItem.query.get_or_404(lost_item_id)
    
    # Check if user owns this item
    user_id = int(get_jwt_identity())
    if lost_item.user_id != user_id:
        return jsonify({'error': 'Unauthorized'}), 403
    
    matches = matching_service.find_matches_for_lost_item(lost_item)
    
    # Send notifications for matches
    for match in matches:
        notification_service.send_match_notification(user_id, match)
    
    return jsonify({
        'success': True,
        'matches_found': len(matches),
        'matches': [{
            'match_id': match.id,
            'found_item_ref': match.found_item.reference_id,
            'similarity_score': float(match.similarity_score),
            'found_location': match.found_item.location,
            'found_date': match.found_item.date_found.isoformat(),
            'status': match.status
        } for match in matches]
    }), 200

@matches_bp.route('/<int:match_id>', methods=['GET'])
@jwt_required()
def get_match_details(match_id):
    """Get detailed match information"""
    user_id = int(get_jwt_identity())
    match = Match.query.get_or_404(match_id)
    
    # Check if user is involved in this match
    if (match.lost_item.user_id != user_id and 
        match.found_item.user_id != user_id):
        return jsonify({'error': 'Unauthorized'}), 403
    
    return jsonify(match.to_dict()), 200

@matches_bp.route('/user', methods=['GET'])
@jwt_required()
def get_user_matches():
    """Get all matches for current user"""
    user_id = int(get_jwt_identity())
    
    matches = Match.query.join(Match.lost_item).join(Match.found_item).filter(
        db.or_(
            Match.lost_item.has(user_id=user_id),
            Match.found_item.has(user_id=user_id)
        )
    ).order_by(Match.created_at.desc()).all()
    
    match_list = []
    for match in matches:
        # Determine user role
        user_role = 'owner' if match.lost_item.user_id == user_id else 'finder'
        
        match_data = {
            'id': match.id,
            'similarity_score': float(match.similarity_score),
            'status': match.status,
            'found_item_name': match.found_item.item_name,
            'lost_item_name': match.lost_item.item_name,
            'location_lost': match.lost_item.location,
            'location_found': match.found_item.location,
            'date_lost': match.lost_item.date_lost.isoformat(),
            'date_found': match.found_item.date_found.isoformat(),
            'lost_description': match.lost_item.description or '',
            'found_description': match.found_item.description or '',
            'user_role': user_role
        }
        match_list.append(match_data)
    
    return jsonify({
        'matches': match_list
    }), 200