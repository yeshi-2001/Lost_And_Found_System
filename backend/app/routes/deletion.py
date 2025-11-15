from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from app.services.deletion_service import DeletionService

deletion_bp = Blueprint('deletion', __name__)

@deletion_bp.route('/api/items/<int:item_id>/delete', methods=['DELETE'])
@jwt_required()
def delete_item(item_id):
    """Delete a specific item"""
    user_id = get_jwt_identity()
    data = request.get_json() or {}
    
    item_type = data.get('type', 'found')  # 'found' or 'lost'
    reason = data.get('reason', 'User requested deletion')
    
    success, message = DeletionService.soft_delete_item(item_id, item_type, user_id, reason)
    
    if success:
        return jsonify({'message': message}), 200
    else:
        return jsonify({'error': message}), 400

@deletion_bp.route('/api/items/<int:item_id>/restore', methods=['POST'])
@jwt_required()
def restore_item(item_id):
    """Restore a deleted item"""
    user_id = get_jwt_identity()
    data = request.get_json() or {}
    
    item_type = data.get('type', 'found')
    
    success, message = DeletionService.restore_item(item_id, item_type, user_id)
    
    if success:
        return jsonify({'message': message}), 200
    else:
        return jsonify({'error': message}), 400

@deletion_bp.route('/api/cleanup/preview', methods=['GET'])
@jwt_required()
def preview_cleanup():
    """Preview items that can be cleaned up"""
    user_id = get_jwt_identity()
    
    try:
        cleanup_data = DeletionService.get_user_items_for_cleanup(user_id)
        
        return jsonify({
            'resolved_matches_count': len(cleanup_data['resolved_matches']),
            'old_found_items_count': len(cleanup_data['old_found_items']),
            'old_lost_items_count': len(cleanup_data['old_lost_items']),
            'total_items': len(cleanup_data['resolved_matches']) + 
                          len(cleanup_data['old_found_items']) + 
                          len(cleanup_data['old_lost_items'])
        }), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@deletion_bp.route('/api/cleanup/resolved', methods=['DELETE'])
@jwt_required()
def cleanup_resolved_items():
    """Delete all resolved items for user"""
    user_id = get_jwt_identity()
    
    try:
        cleanup_data = DeletionService.get_user_items_for_cleanup(user_id)
        deleted_count = 0
        
        # Delete resolved matches
        for match in cleanup_data['resolved_matches']:
            if match.found_item and match.found_item.student_id == user_id:
                success, _ = DeletionService.soft_delete_item(
                    match.found_item.id, 'found', user_id, 'Bulk cleanup - resolved'
                )
                if success:
                    deleted_count += 1
            
            if match.lost_item and match.lost_item.student_id == user_id:
                success, _ = DeletionService.soft_delete_item(
                    match.lost_item.id, 'lost', user_id, 'Bulk cleanup - resolved'
                )
                if success:
                    deleted_count += 1
        
        return jsonify({
            'message': f'Successfully deleted {deleted_count} resolved items',
            'deleted_count': deleted_count
        }), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@deletion_bp.route('/api/cleanup/old', methods=['DELETE'])
@jwt_required()
def cleanup_old_items():
    """Delete old unmatched items for user"""
    user_id = get_jwt_identity()
    
    try:
        cleanup_data = DeletionService.get_user_items_for_cleanup(user_id)
        deleted_count = 0
        
        # Delete old found items
        for item in cleanup_data['old_found_items']:
            success, _ = DeletionService.soft_delete_item(
                item.id, 'found', user_id, 'Bulk cleanup - old unmatched'
            )
            if success:
                deleted_count += 1
        
        # Delete old lost items
        for item in cleanup_data['old_lost_items']:
            success, _ = DeletionService.soft_delete_item(
                item.id, 'lost', user_id, 'Bulk cleanup - old unmatched'
            )
            if success:
                deleted_count += 1
        
        return jsonify({
            'message': f'Successfully deleted {deleted_count} old items',
            'deleted_count': deleted_count
        }), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500