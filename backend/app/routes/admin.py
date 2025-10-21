from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from app import db
from app.models.found_item import FoundItem
from app.models.lost_item import LostItem
from app.services.matching_service import MatchingService

admin_bp = Blueprint('admin', __name__)
matching_service = MatchingService()

@admin_bp.route('/trigger-matching', methods=['POST'])
@jwt_required()
def trigger_matching():
    """Manually trigger matching for all active items"""
    
    # Get all active found items
    found_items = FoundItem.query.filter_by(status='active').all()
    total_matches = 0
    
    for found_item in found_items:
        try:
            matches = matching_service.find_matches_for_found_item(found_item)
            total_matches += len(matches)
        except Exception as e:
            print(f"Error matching found item {found_item.id}: {e}")
    
    return jsonify({
        'message': f'Matching triggered for {len(found_items)} found items',
        'total_matches_created': total_matches
    }), 200

@admin_bp.route('/force-match/<int:found_id>/<int:lost_id>', methods=['POST'])
@jwt_required()
def force_specific_match(found_id, lost_id):
    """Force create a match between specific items"""
    
    found_item = FoundItem.query.get_or_404(found_id)
    lost_item = LostItem.query.get_or_404(lost_id)
    
    # Calculate similarity
    similarity_score, score_breakdown = matching_service._calculate_similarity(lost_item, found_item)
    
    # Create match regardless of score
    from app.models.match import Match
    match = Match(
        found_item_id=found_item.id,
        lost_item_id=lost_item.id,
        similarity_score=similarity_score,
        category_score=score_breakdown['category'],
        brand_score=score_breakdown['brand'],
        color_score=score_breakdown['color'],
        location_score=score_breakdown['location'],
        date_score=score_breakdown['date'],
        name_score=score_breakdown['name'],
        description_score=score_breakdown['description']
    )
    
    db.session.add(match)
    db.session.commit()
    
    return jsonify({
        'message': 'Match created successfully',
        'match_id': match.id,
        'similarity_score': float(similarity_score),
        'score_breakdown': score_breakdown
    }), 200