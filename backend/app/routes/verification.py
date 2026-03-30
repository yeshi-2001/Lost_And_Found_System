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
        
        # Generate questions from founder's full item details
        result = ai_service.generate_verification_questions(
            item_name=found_item.item_name,
            category=found_item.category,
            brand=found_item.brand,
            color=found_item.color,
            location=found_item.location,
            date_found=str(found_item.date_found),
            description=found_item.description
        )
        
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
        
        # Only the lost item owner can verify ownership
        user_id = int(get_jwt_identity())
        if match.lost_item.user_id != user_id:
            return jsonify({
                "success": False,
                "error": "Only the lost item owner can verify ownership"
            }), 403
        
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
            founder_description=f"Item: {found_item.item_name}, Category: {found_item.category}, Brand: {found_item.brand or 'Not provided'}, Color: {found_item.color}, Location: {found_item.location}, Date: {found_item.date_found}, Description: {found_item.description}",
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
            # Notify finder that owner was verified and will contact them
            try:
                from app.services.email_service import EmailService
                from app.models.user import User
                email_service = EmailService()
                finder = User.query.get(found_item.user_id)
                owner = User.query.get(match.lost_item.user_id)
                if finder and owner:
                    html = f"""
                    <html><body style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;">
                    <div style="background:linear-gradient(135deg,#3E2723,#6D4C41);padding:30px;border-radius:10px 10px 0 0;text-align:center;">
                      <h1 style="color:white;margin:0;">&#9989; Ownership Verified!</h1>
                    </div>
                    <div style="background:#EFEBE9;padding:30px;border-radius:0 0 10px 10px;">
                      <p>Hi <strong>{finder.name}</strong>,</p>
                      <p>The owner of <strong>{found_item.item_name}</strong> has successfully verified their ownership.</p>
                      <div style="background:#D7CCC8;padding:15px;border-radius:8px;margin:20px 0;">
                        <p style="margin:0;"><strong>Owner Name:</strong> {owner.name}</p>
                        <p style="margin:5px 0 0;"><strong>Owner Email:</strong> {owner.email}</p>
                        <p style="margin:5px 0 0;"><strong>Owner Phone:</strong> {owner.contact_number}</p>
                      </div>
                      <p>&#128222; <strong>{owner.name}</strong> will be contacting you soon to arrange the handover. Please be available!</p>
                      <p>Thank you for your honesty and for helping return this item to its rightful owner.</p>
                      <div style="text-align:center;margin:25px 0;">
                        <a href="http://localhost:3000/matches" style="background:#3E2723;color:white;padding:12px 30px;text-decoration:none;border-radius:8px;font-weight:bold;">View Matches</a>
                      </div>
                      <p style="color:#6D4C41;font-size:13px;">Back2U Team</p>
                    </div></body></html>
                    """
                    email_service.send_email(finder.email, f'Owner Verified - {owner.name} Will Contact You Soon', html)
            except Exception as e:
                print(f"Finder notification email error: {e}")
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