from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from app import db
from app.models.lost_item import LostItem
from app.services.image_service import ImageService
from app.services.matching_service import MatchingService
from app.services.notification_service import NotificationService

from datetime import datetime
import uuid

lost_items_bp = Blueprint('lost_items', __name__)
image_service = ImageService()
matching_service = MatchingService()
notification_service = NotificationService()


@lost_items_bp.route('', methods=['POST'])
@jwt_required()
def create_lost_item():
    try:
        user_id = int(get_jwt_identity())
        
        # Handle form data
        category = request.form.get('category')
        item_name = request.form.get('item_name')
        brand = request.form.get('brand', '')
        color = request.form.get('color')
        location = request.form.get('location')
        date_lost = request.form.get('date_lost')
        description = request.form.get('description')
        additional_info = request.form.get('additional_info', '')
        
        print(f"DEBUG: Received data - category: {category}, item_name: {item_name}, color: {color}")
        
        # Validate required fields
        if not all([category, item_name, color, location, date_lost, description]):
            return jsonify({'error': 'Missing required fields'}), 400
        
        # Validate field lengths
        if len(item_name) < 3:
            return jsonify({'error': 'Item name must be at least 3 characters'}), 400
        
        if len(description) < 30:
            return jsonify({'error': 'Description must be at least 30 characters for better verification'}), 400
        
        if len(description) > 500:
            return jsonify({'error': 'Description cannot exceed 500 characters'}), 400
        
        # Handle optional image uploads
        image_urls = []
        if 'images' in request.files:
            files = request.files.getlist('images')
            
            if len(files) > 5:
                return jsonify({'error': 'Maximum 5 images allowed'}), 400
            
            for file in files:
                if file.filename:
                    # Validate image
                    is_valid, message = image_service.validate_image(file)
                    if not is_valid:
                        return jsonify({'error': message}), 400
                    
                    # Process and save image
                    image_url = image_service.process_and_upload_image(file)
                    if image_url:
                        image_urls.append(image_url)
        
        # Generate reference ID
        reference_id = f"LST-{datetime.now().year}-{str(uuid.uuid4())[:8].upper()}"
        
        # Create lost item
        lost_item = LostItem(
            user_id=user_id,
            category=category,
            item_name=item_name,
            brand=brand if brand else None,
            color=color,
            location=location,
            date_lost=datetime.strptime(date_lost, '%Y-%m-%d').date(),
            description=description,
            additional_info=additional_info if additional_info else None,
            image_urls=image_urls,
            reference_id=reference_id
        )
        
        db.session.add(lost_item)
        db.session.commit()
        
        # Find matches automatically
        matches = []
        try:
            matches = matching_service.find_matches_for_lost_item(lost_item)
            # Send notifications to user
            for match in matches:
                notification_service.send_match_notification(user_id, match)
        except Exception as e:
            print(f"ERROR: Matching failed: {e}")
        
        response_data = {
            'message': 'Lost item report submitted successfully!',
            'reference_id': reference_id,
            'item': lost_item.to_dict(),
            'matches_found': len(matches),
            'matches': [{
                'match_id': match.id,
                'similarity_score': float(match.similarity_score),
                'found_item_ref': match.found_item.reference_id,
                'found_location': match.found_item.location,
                'found_date': match.found_item.date_found.isoformat(),
                'status': match.status
            } for match in matches]
        }
        
        return jsonify(response_data), 201
        
    except Exception as e:
        print(f"ERROR: Failed to create lost item: {str(e)}")
        db.session.rollback()
        return jsonify({'error': f'Failed to create lost item: {str(e)}'}), 500

@lost_items_bp.route('', methods=['GET'])
@jwt_required()
def get_lost_items():
    user_id = int(get_jwt_identity())
    items = LostItem.query.filter_by(user_id=user_id).order_by(LostItem.created_at.desc()).all()
    
    return jsonify({
        'items': [item.to_dict() for item in items]
    }), 200

@lost_items_bp.route('/<int:item_id>', methods=['GET'])
@jwt_required()
def get_lost_item(item_id):
    user_id = int(get_jwt_identity())
    item = LostItem.query.filter_by(id=item_id, user_id=user_id).first()
    
    if not item:
        return jsonify({'error': 'Item not found'}), 404
    
    return jsonify({'item': item.to_dict()}), 200

@lost_items_bp.route('/<int:item_id>', methods=['PUT'])
@jwt_required()
def update_lost_item(item_id):
    user_id = int(get_jwt_identity())
    item = LostItem.query.filter_by(id=item_id, user_id=user_id).first()
    
    if not item:
        return jsonify({'error': 'Item not found'}), 404
    
    data = request.get_json()
    
    # Update fields
    if 'item_name' in data:
        item.item_name = data['item_name']
    if 'description' in data:
        item.description = data['description']
    if 'additional_info' in data:
        item.additional_info = data['additional_info']
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
    
    db.session.commit()
    
    return jsonify({
        'message': 'Item updated successfully',
        'item': item.to_dict()
    }), 200

@lost_items_bp.route('/<int:item_id>', methods=['DELETE'])
@jwt_required()
def delete_lost_item(item_id):
    user_id = int(get_jwt_identity())
    item = LostItem.query.filter_by(id=item_id, user_id=user_id).first()
    
    if not item:
        return jsonify({'error': 'Item not found'}), 404
    
    # Delete associated images
    if item.image_urls:
        for image_url in item.image_urls:
            try:
                image_service.delete_image(image_url)
            except Exception as e:
                print(f"Warning: Could not delete image {image_url}: {e}")
    
    db.session.delete(item)
    db.session.commit()
    
    return jsonify({'message': 'Item deleted successfully'}), 200

