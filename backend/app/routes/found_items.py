from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from app import db
from app.models.found_item import FoundItem
from app.services.image_service import ImageService
from app.services.vector_service import VectorService
from datetime import datetime

found_items_bp = Blueprint('found_items', __name__)
image_service = ImageService()
vector_service = VectorService()

@found_items_bp.route('', methods=['POST'])
@jwt_required()
def create_found_item():
    user_id = int(get_jwt_identity())
    data = request.get_json()
    
    # Debug logging
    print(f"DEBUG: Received JSON data: {data}")
    print(f"DEBUG: Request content type: {request.content_type}")
    
    # Validate required fields
    if not data.get('item_name'):
        return jsonify({'error': 'Item name is required'}), 400
    
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
    
    # Create found item
    found_item = FoundItem(
        user_id=user_id,
        item_name=data['item_name'],
        description=data.get('description'),
        category=data.get('category'),
        brand=data.get('brand'),
        color=data.get('color'),
        location_found=data.get('location'),
        found_date=datetime.strptime(data['found_date'], '%Y-%m-%d').date() if data.get('found_date') else None,
        image_urls=image_urls
    )
    
    # Generate embedding
    embedding = vector_service.generate_item_embedding(data)
    found_item.embedding = embedding
    
    db.session.add(found_item)
    db.session.commit()
    
    return jsonify({
        'message': 'Found item created successfully',
        'item': found_item.to_dict()
    }), 201

@found_items_bp.route('', methods=['GET'])
@jwt_required()
def get_found_items():
    user_id = int(get_jwt_identity())
    items = FoundItem.query.filter_by(user_id=user_id).order_by(FoundItem.created_at.desc()).all()
    
    return jsonify({
        'items': [item.to_dict() for item in items]
    }), 200

@found_items_bp.route('/<int:item_id>', methods=['GET'])
@jwt_required()
def get_found_item(item_id):
    user_id = int(get_jwt_identity())
    item = FoundItem.query.filter_by(id=item_id, user_id=user_id).first()
    
    if not item:
        return jsonify({'error': 'Item not found'}), 404
    
    return jsonify({'item': item.to_dict()}), 200

@found_items_bp.route('/<int:item_id>', methods=['PUT'])
@jwt_required()
def update_found_item(item_id):
    user_id = int(get_jwt_identity())
    item = FoundItem.query.filter_by(id=item_id, user_id=user_id).first()
    
    if not item:
        return jsonify({'error': 'Item not found'}), 404
    
    data = request.get_json()
    
    # Update fields
    if 'title' in data:
        item.title = data['title']
    if 'description' in data:
        item.description = data['description']
    if 'category' in data:
        item.category = data['category']
    if 'brand' in data:
        item.brand = data['brand']
    if 'color' in data:
        item.color = data['color']
    if 'location' in data:
        item.location = data['location']
    if 'status' in data:
        item.status = data['status']
    
    # Regenerate embedding if content changed
    if any(field in data for field in ['title', 'description', 'brand', 'color', 'category']):
        embedding = vector_service.generate_item_embedding(data)
        item.embedding = embedding
    
    db.session.commit()
    
    return jsonify({
        'message': 'Item updated successfully',
        'item': item.to_dict()
    }), 200

@found_items_bp.route('/<int:item_id>', methods=['DELETE'])
@jwt_required()
def delete_found_item(item_id):
    user_id = int(get_jwt_identity())
    item = FoundItem.query.filter_by(id=item_id, user_id=user_id).first()
    
    if not item:
        return jsonify({'error': 'Item not found'}), 404
    
    db.session.delete(item)
    db.session.commit()
    
    return jsonify({'message': 'Item deleted successfully'}), 200