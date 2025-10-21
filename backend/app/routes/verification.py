from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from app.models.match import Match
from app.models.found_item import FoundItem
from app.services.ai_verification_service import AIVerificationService
from app import db
from datetime import datetime

verification_bp = Blueprint('verification', __name__)

@verification_bp.route('/generate-questions', methods=['POST'])
@jwt_required()
def generate_questions():
    """Generate verification questions from founder's description"""
    
    try:
        data = request.json
        match_id = data.get('match_id')
        
        if not match_id:
            return jsonify({
                "success": False,
                "error": "match_id is required"
            }), 400
        
        # Get match and found item
        match = Match.query.get(match_id)
        if not match:
            return jsonify({
                "success": False,
                "error": "Match not found"
            }), 404
        
        found_item = FoundItem.query.get(match.found_item_id)
        if not found_item:
            return jsonify({
                "success": False,
                "error": "Found item not found"
            }), 404
        
        # Initialize AI service
        ai_service = AIVerificationService()
        
        # Generate questions from founder's description
        result = ai_service.generate_verification_questions(found_item.description)
        
        if not result['success']:
            return jsonify({
                "success": False,
                "error": result.get('error', 'Failed to generate questions')
            }), 500
        
        # Store questions in match for later verification
        match.verification_questions = result['questions']
        match.verification_generated_at = datetime.utcnow()
        db.session.commit()
        
        return jsonify({
            "success": True,
            "match_id": match_id,
            "questions": result['questions'],
            "count": result['count'],
            "time_limit": 3600,  # 1 hour
            "timestamp": result['timestamp']
        }), 200
    
    except Exception as e:
        return jsonify({
            "success": False,
            "error": str(e)
        }), 500


@verification_bp.route('/verify-answers', methods=['POST'])
@jwt_required()
def verify_answers():
    """Verify owner's answers against founder's description"""
    
    try:
        data = request.json
        match_id = data.get('match_id')
        answers = data.get('answers', [])
        
        if not match_id:
            return jsonify({
                "success": False,
                "error": "match_id is required"
            }), 400
        
        if not answers:
            return jsonify({
                "success": False,
                "error": "answers are required"
            }), 400
        
        # Get match and found item
        match = Match.query.get(match_id)
        if not match:
            return jsonify({
                "success": False,
                "error": "Match not found"
            }), 404
        
        if not match.verification_questions:
            return jsonify({
                "success": False,
                "error": "No verification questions found"
            }), 404
        
        found_item = FoundItem.query.get(match.found_item_id)
        if not found_item:
            return jsonify({
                "success": False,
                "error": "Found item not found"
            }), 404
        
        # Initialize AI service
        ai_service = AIVerificationService()
        
        # Verify answers using AI
        verification_result = ai_service.verify_answers(
            founder_description=found_item.description,
            questions=match.verification_questions,
            answers=answers
        )
        
        # Store verification result
        match.verification_answers = answers
        match.verification_score = verification_result['overall_percentage']
        match.verification_verified = verification_result['verified']
        match.verification_explanation = verification_result['explanation']
        match.verification_completed_at = datetime.utcnow()
        
        # Update match status based on verification
        if verification_result['verified']:
            match.status = 'verified'
        else:
            match.status = 'verification_failed'
        
        db.session.commit()
        
        return jsonify({
            "success": True,
            "match_id": match_id,
            "verified": verification_result['verified'],
            "score": verification_result['overall_percentage'],
            "message": verification_result['explanation']
        }), 200
    
    except Exception as e:
        return jsonify({
            "success": False,
            "error": str(e)
        }), 500