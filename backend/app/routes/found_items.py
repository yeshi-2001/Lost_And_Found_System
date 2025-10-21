from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from app import db
from app.models.found_item import FoundItem
from app.services.image_service import ImageService
from app.services.matching_service import MatchingService
from app.services.notification_service import NotificationService

from datetime import datetime
import uuid

found_items_bp = Blueprint('found_items', __name__)
image_service = ImageService()
matching_service = MatchingService()
notification_service = NotificationService()


@found_items_bp.route('', methods=['POST'])
@jwt_required()
def create_found_item():
    try:
        user_id = int(get_jwt_identity())
        print(f"DEBUG: Creating found item for user {user_id}")
        
        # Handle both JSON and form data
        if request.is_json:
            data = request.get_json()
            category = data.get('category')
            item_name = data.get('item_name')
            brand = data.get('brand', '')
            color = data.get('color')
            location = data.get('location')
            date_found = data.get('date_found')
            description = data.get('description')
            image_urls = data.get('image_urls', [])  # Accept image URLs for JSON requests
        else:
            # Handle form data
            category = request.form.get('category')
            item_name = request.form.get('item_name')
            brand = request.form.get('brand', '')
            color = request.form.get('color')
            location = request.form.get('location')
            date_found = request.form.get('date_found')
            description = request.form.get('description')
        
        # Validate required fields
        if not all([category, item_name, color, location, date_found, description]):
            return jsonify({'error': 'Missing required fields'}), 400
        
        # Validate field lengths
        if len(item_name) < 3:
            return jsonify({'error': 'Item name must be at least 3 characters'}), 400
        
        if len(description) < 20:
            return jsonify({'error': 'Description must be at least 20 characters'}), 400
        
        if len(description) > 500:
            return jsonify({'error': 'Description cannot exceed 500 characters'}), 400
        
        # Handle image uploads (only for form data)
        if not request.is_json:
            image_urls = []
            if 'images' in request.files:
                files = request.files.getlist('images')
                
                if len(files) == 0:
                    return jsonify({'error': 'At least one image is required'}), 400
                
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
            
            if not image_urls:
                return jsonify({'error': 'At least one image is required'}), 400
        
        # Validate image URLs for JSON requests
        if request.is_json and not image_urls:
            return jsonify({'error': 'At least one image URL is required'}), 400
        
        # Generate reference ID
        reference_id = f"FND-{datetime.now().year}-{str(uuid.uuid4())[:8].upper()}"
        
        # Create found item
        found_item = FoundItem(
            user_id=user_id,
            category=category,
            item_name=item_name,
            brand=brand if brand else None,
            color=color,
            location=location,
            date_found=datetime.strptime(date_found, '%Y-%m-%d').date(),
            description=description,
            image_urls=image_urls,
            reference_id=reference_id
        )
        
        db.session.add(found_item)
        db.session.commit()
        
        # Find matches automatically
        matches = []
        try:
            matches = matching_service.find_matches_for_found_item(found_item)
            # Send notifications to lost item owners
            for match in matches:
                notification_service.send_match_notification(match.lost_item.user_id, match)
        except Exception as e:
            print(f"ERROR: Matching failed: {e}")
        
        response_data = {
            'message': 'Found item reported successfully',
            'reference_id': reference_id,
            'item': found_item.to_dict(),
            'matches_found': len(matches),
            'matches': [{
                'match_id': match.id,
                'similarity_score': float(match.similarity_score),
                'lost_item_ref': match.lost_item.reference_id,
                'lost_location': match.lost_item.location,
                'lost_date': match.lost_item.date_lost.isoformat(),
                'status': match.status
            } for match in matches]
        }
        
        print(f"DEBUG: Successfully created found item with ID {found_item.id}")
        return jsonify(response_data), 201
        
    except Exception as e:
        print(f"ERROR: Failed to create found item: {str(e)}")
        db.session.rollback()
        return jsonify({'error': f'Internal server error: {str(e)}'}), 500

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
    if 'item_name' in data:
        item.item_name = data['item_name']
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