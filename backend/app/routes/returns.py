from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from app import db
from app.models.match import Match
from datetime import datetime

returns_bp = Blueprint('returns', __name__)

@returns_bp.route('/confirm/<int:match_id>', methods=['POST'])
@jwt_required()
def confirm_return(match_id):
    user_id = int(get_jwt_identity())
    data = request.get_json()
    
    match = Match.query.get_or_404(match_id)
    
    # Check if user is involved in this match
    if (match.lost_item.user_id != user_id and 
        match.found_item.user_id != user_id):
        return jsonify({'error': 'Unauthorized'}), 403
    
    # Determine who is confirming
    confirmer_role = 'owner' if match.lost_item.user_id == user_id else 'finder'
    
    # Update match status
    if confirmer_role == 'owner':
        match.status = 'returned_to_owner'
    else:
        match.status = 'returned_by_finder'
    
    # Update item statuses
    match.lost_item.status = 'recovered'
    match.found_item.status = 'returned'
    
    db.session.commit()
    
    return jsonify({
        'message': f'Return confirmed by {confirmer_role}',
        'match_status': match.status,
        'confirmer_role': confirmer_role
    }), 200

@returns_bp.route('/status/<int:match_id>', methods=['GET'])
@jwt_required()
def get_return_status(match_id):
    user_id = int(get_jwt_identity())
    
    match = Match.query.get_or_404(match_id)
    
    # Check if user is involved in this match
    if (match.lost_item.user_id != user_id and 
        match.found_item.user_id != user_id):
        return jsonify({'error': 'Unauthorized'}), 403
    
    return jsonify({
        'match_id': match_id,
        'status': match.status,
        'lost_item_status': match.lost_item.status,
        'found_item_status': match.found_item.status,
        'can_confirm_return': match.status == 'verified'
    }), 200