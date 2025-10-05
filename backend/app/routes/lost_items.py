from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from app import db
from app.models.lost_item import LostItem
from app.services.image_service import ImageService
from app.services.vector_service import VectorService
from app.services.matching_service import MatchingService
from app.services.email_service import EmailService
from datetime import datetime

lost_items_bp = Blueprint('lost_items', __name__)
image_service = ImageService()
vector_service = VectorService()
matching_service = MatchingService()
email_service = EmailService()

@lost_items_bp.route('', methods=['POST'])
@jwt_required()
def create_lost_item():
    user_id = int(get_jwt_identity())
    data = request.form.to_dict()
    
    # Validate required fields
    if not data.get('title'):
        return jsonify({'error': 'Title is required'}), 400
    
    # Handle image upload
    image_urls = []
    if 'images' in request.files:
        files = request.files.getlist('images')
        for file in files:
            if file.filename:
                is_valid, message = image_service.validate_image(file)
                if not is_valid:
                    return jsonify({'error': message}), 400
                
                image_url = image_service.process_and_upload_image(file)
                if image_url:
                    image_urls.append(image_url)
    
    # Create lost item
    lost_item = LostItem(
        user_id=user_id,
        title=data['title'],
        description=data.get('description'),
        category=data.get('category'),
        brand=data.get('brand'),
        color=data.get('color'),
        last_seen_location=data.get('last_seen_location'),
        lost_date=datetime.strptime(data['lost_date'], '%Y-%m-%d').date() if data.get('lost_date') else None,
        image_urls=image_urls
    )
    
    # Generate embedding
    embedding = vector_service.generate_item_embedding(data)
    lost_item.embedding = embedding
    
    db.session.add(lost_item)
    db.session.commit()
    
    # Search for matches
    matches = matching_service.find_matches(lost_item)
    
    # Create match records for high similarity items
    created_matches = []
    for match_data in matches:
        if match_data['similarity_score'] >= 0.8:
            match = matching_service.create_match(
                match_data['found_item'].id,
                lost_item.id,
                match_data['similarity_score']
            )
            created_matches.append(match)
            
            # Send notification email
            from app.models.user import User
            user = User.query.get(user_id)
            email_service.send_match_notification(user.email, lost_item.title)
    
    return jsonify({
        'message': 'Lost item created successfully',
        'item': lost_item.to_dict(),
        'matches_found': len(created_matches)
    }), 201

@lost_items_bp.route('', methods=['GET'])
@jwt_required()
def get_lost_items():
    user_id = int(get_jwt_identity())
    items = LostItem.query.filter_by(user_id=user_id).order_by(LostItem.created_at.desc()).all()
    
    return jsonify({
        'items': [item.to_dict() for item in items]
    }), 200

@lost_items_bp.route('/<int:item_id>/matches', methods=['GET'])
@jwt_required()
def get_item_matches(item_id):
    user_id = int(get_jwt_identity())
    lost_item = LostItem.query.filter_by(id=item_id, user_id=user_id).first()
    
    if not lost_item:
        return jsonify({'error': 'Item not found'}), 404
    
    matches = []
    for match in lost_item.matches:
        match_data = match.to_dict()
        match_data['found_item'] = match.found_item.to_dict()
        matches.append(match_data)
    
    return jsonify({'matches': matches}), 200