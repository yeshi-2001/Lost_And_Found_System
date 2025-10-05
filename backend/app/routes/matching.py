from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from app import db
from app.models.match import Match
from app.models.user import User
from app.services.matching_service import MatchingService
from app.services.email_service import EmailService
from datetime import datetime

matching_bp = Blueprint('matching', __name__)
matching_service = MatchingService()
email_service = EmailService()

@matching_bp.route('/<int:match_id>/questions', methods=['GET'])
@jwt_required()
def get_verification_questions(match_id):
    user_id = get_jwt_identity()
    match = Match.query.get(match_id)
    
    if not match:
        return jsonify({'error': 'Match not found'}), 404
    
    # Verify user owns the lost item
    if match.lost_item.user_id != user_id:
        return jsonify({'error': 'Unauthorized'}), 403
    
    return jsonify({
        'match_id': match_id,
        'questions': match.verification_questions,
        'found_item': {
            'title': match.found_item.title,
            'location': match.found_item.location,
            'found_date': match.found_item.found_date.isoformat() if match.found_item.found_date else None,
            'image_urls': match.found_item.image_urls
        }
    }), 200

@matching_bp.route('/<int:match_id>/verify', methods=['POST'])
@jwt_required()
def verify_match(match_id):
    user_id = get_jwt_identity()
    data = request.get_json()
    
    if not data.get('answers'):
        return jsonify({'error': 'Answers are required'}), 400
    
    match = Match.query.get(match_id)
    if not match:
        return jsonify({'error': 'Match not found'}), 404
    
    # Verify user owns the lost item
    if match.lost_item.user_id != user_id:
        return jsonify({'error': 'Unauthorized'}), 403
    
    # Verify the match
    is_verified = matching_service.verify_match(match_id, data['answers'])
    
    if is_verified:
        # Share contact details
        founder = match.found_item.user
        owner = match.lost_item.user
        
        founder_details = {
            'name': founder.username,
            'email': founder.email,
            'phone': founder.phone,
            'location': match.found_item.location
        }
        
        # Send contact details to owner
        email_service.send_contact_details(
            owner.email,
            founder_details,
            match.found_item.title
        )
        
        # Notify founder
        email_service.notify_founder_contact_shared(
            founder.email,
            match.found_item.title,
            owner.username
        )
        
        # Update match status
        match.contact_shared = True
        db.session.commit()
        
        return jsonify({
            'message': 'Verification successful! Contact details have been shared.',
            'verified': True,
            'contact_details': founder_details
        }), 200
    else:
        return jsonify({
            'message': 'Verification failed. Your answers do not match the item details.',
            'verified': False
        }), 400

@matching_bp.route('/<int:match_id>', methods=['GET'])
@jwt_required()
def get_match_details(match_id):
    user_id = get_jwt_identity()
    match = Match.query.get(match_id)
    
    if not match:
        return jsonify({'error': 'Match not found'}), 404
    
    # Verify user is involved in this match
    if match.lost_item.user_id != user_id and match.found_item.user_id != user_id:
        return jsonify({'error': 'Unauthorized'}), 403
    
    match_data = match.to_dict()
    match_data['found_item'] = match.found_item.to_dict()
    match_data['lost_item'] = match.lost_item.to_dict()
    
    return jsonify({'match': match_data}), 200

@matching_bp.route('/user', methods=['GET'])
@jwt_required()
def get_user_matches():
    user_id = get_jwt_identity()
    
    # Get matches where user is either the finder or the loser
    matches = db.session.query(Match).join(
        Match.found_item
    ).join(
        Match.lost_item
    ).filter(
        db.or_(
            Match.found_item.has(user_id=user_id),
            Match.lost_item.has(user_id=user_id)
        )
    ).order_by(Match.created_at.desc()).all()
    
    match_list = []
    for match in matches:
        match_data = match.to_dict()
        match_data['found_item'] = match.found_item.to_dict()
        match_data['lost_item'] = match.lost_item.to_dict()
        match_data['user_role'] = 'finder' if match.found_item.user_id == user_id else 'owner'
        match_list.append(match_data)
    
    return jsonify({'matches': match_list}), 200