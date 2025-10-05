from flask import Flask, request, jsonify
from flask_cors import CORS
from flask_jwt_extended import JWTManager, create_access_token, jwt_required, get_jwt_identity
import os
from datetime import datetime
from werkzeug.utils import secure_filename
import uuid
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
import psycopg2
from psycopg2.extras import RealDictCursor
from werkzeug.security import generate_password_hash, check_password_hash
from dotenv import load_dotenv
from matching_service import MatchingService
from ai_verification_service import AIVerificationService
import json

load_dotenv()

app = Flask(__name__)
app.config['SECRET_KEY'] = os.getenv('SECRET_KEY', 'dev-secret-key')
app.config['JWT_SECRET_KEY'] = os.getenv('JWT_SECRET_KEY', 'jwt-secret-key')
app.config['MAX_CONTENT_LENGTH'] = 25 * 1024 * 1024  # 25MB max file size

CORS(app)
jwt = JWTManager(app)

# Database connection
DATABASE_URL = os.getenv('DATABASE_URL')

# Initialize services
matching_service = MatchingService(DATABASE_URL)
ai_service = AIVerificationService()

def get_db_connection():
    try:
        conn = psycopg2.connect(DATABASE_URL, cursor_factory=RealDictCursor)
        print("✅ Database connected successfully")
        return conn
    except Exception as e:
        print(f"❌ Database connection failed: {e}")
        raise

# Create uploads directory
UPLOAD_FOLDER = 'uploads'
if not os.path.exists(UPLOAD_FOLDER):
    os.makedirs(UPLOAD_FOLDER)

ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg'}

def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

# AUTHENTICATION ENDPOINTS
@app.route('/api/auth/register', methods=['POST'])
def register():
    data = request.get_json()
    
    # Validate required fields
    required_fields = ['name', 'registration_number', 'department', 'email', 'password', 'contact_number']
    for field in required_fields:
        if not data.get(field):
            return jsonify({'error': f'{field} is required'}), 400
    
    try:
        conn = get_db_connection()
        cur = conn.cursor()
        
        # Check if user already exists
        cur.execute("SELECT id FROM users WHERE email = %s OR registration_number = %s", 
                   (data['email'], data['registration_number']))
        if cur.fetchone():
            return jsonify({'error': 'Email or registration number already exists'}), 400
        
        # Create user
        password_hash = generate_password_hash(data['password'])
        cur.execute("""
            INSERT INTO users (name, registration_number, department, email, password_hash, contact_number)
            VALUES (%s, %s, %s, %s, %s, %s) RETURNING id
        """, (data['name'], data['registration_number'], data['department'], 
              data['email'], password_hash, data['contact_number']))
        
        user_id = cur.fetchone()['id']
        conn.commit()
        
        # Get user data
        cur.execute("SELECT * FROM users WHERE id = %s", (user_id,))
        user = cur.fetchone()
        
        cur.close()
        conn.close()
        
        # Create access token
        access_token = create_access_token(identity=str(user_id))
        
        return jsonify({
            'message': 'User registered successfully',
            'access_token': access_token,
            'user': {
                'id': user['id'],
                'name': user['name'],
                'registration_number': user['registration_number'],
                'department': user['department'],
                'email': user['email'],
                'contact_number': user['contact_number']
            }
        }), 201
        
    except Exception as e:
        return jsonify({'error': f'Database error: {str(e)}'}), 500

@app.route('/api/auth/login', methods=['POST'])
def login():
    data = request.get_json()
    
    if not data.get('login') or not data.get('password'):
        return jsonify({'error': 'Login and password are required'}), 400
    
    try:
        conn = get_db_connection()
        cur = conn.cursor()
        
        # Find user by email or registration number
        cur.execute("""
            SELECT * FROM users 
            WHERE email = %s OR registration_number = %s
        """, (data['login'], data['login']))
        
        user = cur.fetchone()
        cur.close()
        conn.close()
        
        if not user or not check_password_hash(user['password_hash'], data['password']):
            return jsonify({'error': 'Invalid credentials'}), 401
        
        access_token = create_access_token(identity=str(user['id']))
        
        return jsonify({
            'message': 'Login successful',
            'access_token': access_token,
            'user': {
                'id': user['id'],
                'name': user['name'],
                'registration_number': user['registration_number'],
                'department': user['department'],
                'email': user['email'],
                'contact_number': user['contact_number']
            }
        }), 200
        
    except Exception as e:
        return jsonify({'error': f'Database error: {str(e)}'}), 500

# FOUND ITEMS ENDPOINTS
@app.route('/api/found-items', methods=['POST'])
@jwt_required()
def create_found_item():
    user_id = int(get_jwt_identity())
    data = request.get_json()
    
    # Validation (same as before)
    required_fields = ['category', 'item_name', 'color', 'location_found', 'date_found', 'description']
    for field in required_fields:
        if not data.get(field):
            return jsonify({'error': f'{field} is required'}), 400
    
    try:
        conn = get_db_connection()
        cur = conn.cursor()
        
        # Get user details
        cur.execute("SELECT * FROM users WHERE id = %s", (user_id,))
        user = cur.fetchone()
        if not user:
            return jsonify({'error': 'User not found'}), 404
        
        # Generate reference number
        cur.execute("SELECT COUNT(*) FROM found_items")
        count = cur.fetchone()['count']
        reference_number = f"FND-{datetime.now().year}-{count + 1:04d}"
        
        # Handle location
        location = data['location_found']
        if location == 'Other' and data.get('specify_location'):
            location = data['specify_location']
        
        # Insert found item
        cur.execute("""
            INSERT INTO found_items 
            (reference_number, user_id, category, item_name, brand, color, location_found, 
             date_found, description, contact_number, image_urls)
            VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
            RETURNING *
        """, (reference_number, user_id, data['category'], data['item_name'], 
              data.get('brand', ''), data['color'], location, data['date_found'],
              data['description'], user['contact_number'], data.get('image_urls', [])))
        
        found_item = cur.fetchone()
        conn.commit()
        cur.close()
        conn.close()
        
        confirmation_message = f"Hi {user['name']}! Your found item \"{data['item_name']}\" has been successfully reported. Reference: {reference_number}. We'll notify you if someone claims it. Keep the item safe! - University Lost & Found System"
        
        return jsonify({
            'message': 'Found item submitted successfully',
            'confirmation_notification': confirmation_message,
            'reference_number': reference_number,
            'item': dict(found_item)
        }), 201
        
    except Exception as e:
        return jsonify({'error': f'Database error: {str(e)}'}), 500

# LOST ITEMS ENDPOINTS
@app.route('/api/lost-items', methods=['POST'])
@jwt_required()
def create_lost_item():
    user_id = int(get_jwt_identity())
    data = request.get_json()
    
    # Validation (same as before)
    required_fields = ['category', 'item_name', 'color', 'location_lost', 'date_lost', 'description']
    for field in required_fields:
        if not data.get(field):
            return jsonify({'error': f'{field} is required'}), 400
    
    try:
        conn = get_db_connection()
        cur = conn.cursor()
        
        # Get user details
        cur.execute("SELECT * FROM users WHERE id = %s", (user_id,))
        user = cur.fetchone()
        if not user:
            return jsonify({'error': 'User not found'}), 404
        
        # Generate reference number
        cur.execute("SELECT COUNT(*) FROM lost_items")
        count = cur.fetchone()['count']
        reference_number = f"LST-{datetime.now().year}-{count + 1:04d}"
        
        # Handle location
        location = data['location_lost']
        location_details = ''
        if location == 'Other' and data.get('specify_location'):
            location_details = data['specify_location']
        elif location == 'Not Sure' and data.get('location_description'):
            location_details = data['location_description']
        
        # Insert lost item
        cur.execute("""
            INSERT INTO lost_items 
            (reference_number, user_id, category, item_name, brand, color, location_lost, 
             location_details, date_lost, description, additional_information, contact_number, image_urls)
            VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
            RETURNING *
        """, (reference_number, user_id, data['category'], data['item_name'], 
              data.get('brand', ''), data['color'], location, location_details,
              data['date_lost'], data['description'], data.get('additional_information', ''),
              user['contact_number'], data.get('image_urls', [])))
        
        lost_item = cur.fetchone()
        conn.commit()
        cur.close()
        conn.close()
        
        # Find potential matches
        lost_item_id = lost_item['id']
        matches = matching_service.find_matches_for_lost_item(lost_item_id)
        match_found = len(matches) > 0
        
        # Create match records for high similarity items
        for match in matches:
            matching_service.create_match_record(
                match['found_item_id'], 
                lost_item_id, 
                match['similarity_score']
            )
        
        if match_found:
            confirmation_message = f"🎉 GREAT NEWS {user['name']}! We found {len(matches)} potential match(es) for your \"{data['item_name']}\"! Please check your matches to verify ownership. Reference: {reference_number}"
        else:
            confirmation_message = f"Hi {user['name']}! Your lost item report for \"{data['item_name']}\" has been submitted. Reference: {reference_number}. We'll notify you if someone finds a matching item. - University Lost & Found System"
        
        return jsonify({
            'message': 'Lost item report submitted successfully',
            'confirmation_notification': confirmation_message,
            'reference_number': reference_number,
            'item': dict(lost_item)
        }), 201
        
    except Exception as e:
        return jsonify({'error': f'Database error: {str(e)}'}), 500

# GET ENDPOINTS
@app.route('/api/found-items', methods=['GET'])
@jwt_required()
def get_found_items():
    user_id = int(get_jwt_identity())
    try:
        conn = get_db_connection()
        cur = conn.cursor()
        cur.execute("SELECT * FROM found_items WHERE user_id = %s ORDER BY created_at DESC", (user_id,))
        items = cur.fetchall()
        cur.close()
        conn.close()
        return jsonify({'items': [dict(item) for item in items]}), 200
    except Exception as e:
        return jsonify({'error': f'Database error: {str(e)}'}), 500

@app.route('/api/lost-items', methods=['GET'])
@jwt_required()
def get_lost_items():
    user_id = int(get_jwt_identity())
    try:
        conn = get_db_connection()
        cur = conn.cursor()
        cur.execute("SELECT * FROM lost_items WHERE user_id = %s ORDER BY created_at DESC", (user_id,))
        items = cur.fetchall()
        cur.close()
        conn.close()
        return jsonify({'items': [dict(item) for item in items]}), 200
    except Exception as e:
        return jsonify({'error': f'Database error: {str(e)}'}), 500

# FORM OPTIONS
@app.route('/api/form-options', methods=['GET'])
def get_form_options():
    return jsonify({
        'categories': ['Electronics', 'Personal Items', 'Bags & Accessories', 'Books & Stationery', 'Clothing', 'Sports Equipment', 'Other'],
        'colors': {
            'found_items': ['Black', 'White', 'Blue', 'Red', 'Green', 'Yellow', 'Grey', 'Brown', 'Pink', 'Multi-color', 'Other'],
            'lost_items': ['Black', 'White', 'Blue', 'Red', 'Green', 'Yellow', 'Grey', 'Brown', 'Pink', 'Multi-color', 'Other', "Don't Remember"]
        },
        'locations': {
            'found_items': [
                'Main Entrance', 'IT Building', 'Library', 'Old Main Cafeteria', 'Green Cafeteria',
                'Faculty of Applied Science', 'Faculty of Communication and Business Studies',
                'Faculty of Siddha Medicine', 'Play Ground', 'Sport Complex',
                'Girls Hostel - New Saraswathi', 'Girls Hostel - Old Saraswathi',
                'Girls Hostel - Marbel', 'Boys Hostel', 'Other'
            ],
            'lost_items': [
                'Main Entrance', 'IT Building', 'Library', 'Old Main Cafeteria', 'Green Cafeteria',
                'Faculty of Applied Science', 'Faculty of Communication and Business Studies',
                'Faculty of Siddha Medicine', 'Play Ground', 'Sport Complex',
                'Girls Hostel - New Saraswathi', 'Girls Hostel - Old Saraswathi',
                'Girls Hostel - Marbel', 'Boys Hostel', 'Not Sure', 'Other'
            ]
        }
    }), 200

# DEBUG ENDPOINT - View database data
@app.route('/api/debug/database', methods=['GET'])
def view_database():
    try:
        conn = get_db_connection()
        cur = conn.cursor()
        
        # Get users count
        cur.execute("SELECT COUNT(*) as count FROM users")
        users_count = cur.fetchone()['count']
        
        # Get found items count
        cur.execute("SELECT COUNT(*) as count FROM found_items")
        found_count = cur.fetchone()['count']
        
        # Get lost items count
        cur.execute("SELECT COUNT(*) as count FROM lost_items")
        lost_count = cur.fetchone()['count']
        
        # Get recent data
        cur.execute("SELECT id, name, email, registration_number FROM users ORDER BY created_at DESC LIMIT 5")
        recent_users = cur.fetchall()
        
        cur.execute("SELECT id, reference_number, item_name, category, status FROM found_items ORDER BY created_at DESC LIMIT 5")
        recent_found = cur.fetchall()
        
        cur.execute("SELECT id, reference_number, item_name, category, status FROM lost_items ORDER BY created_at DESC LIMIT 5")
        recent_lost = cur.fetchall()
        
        cur.close()
        conn.close()
        
        return jsonify({
            'database': 'lost_found_db',
            'tables': {
                'users': users_count,
                'found_items': found_count,
                'lost_items': lost_count
            },
            'recent_data': {
                'users': [dict(user) for user in recent_users],
                'found_items': [dict(item) for item in recent_found],
                'lost_items': [dict(item) for item in recent_lost]
            }
        }), 200
        
    except Exception as e:
        return jsonify({'error': f'Database error: {str(e)}'}), 500

# VERIFICATION ENDPOINTS
@app.route('/api/matches/<int:user_id>', methods=['GET'])
@jwt_required()
def get_user_matches(user_id):
    current_user = int(get_jwt_identity())
    if current_user != user_id:
        return jsonify({'error': 'Unauthorized'}), 403
    
    try:
        conn = get_db_connection()
        cur = conn.cursor()
        
        # Get matches for user's lost items
        cur.execute("""
            SELECT m.*, li.item_name as lost_item_name, fi.item_name as found_item_name,
                   li.description as lost_description, fi.description as found_description,
                   fi.location_found, li.location_lost, fi.date_found, li.date_lost
            FROM matches m
            JOIN lost_items li ON m.lost_item_id = li.id
            JOIN found_items fi ON m.found_item_id = fi.id
            WHERE li.user_id = %s AND m.status = 'pending_verification'
            ORDER BY m.similarity_score DESC
        """, (user_id,))
        
        matches = cur.fetchall()
        cur.close()
        conn.close()
        
        return jsonify({'matches': [dict(match) for match in matches]}), 200
        
    except Exception as e:
        return jsonify({'error': f'Database error: {str(e)}'}), 500

@app.route('/api/verification/questions/<int:match_id>', methods=['POST'])
@jwt_required()
def generate_verification_questions(match_id):
    try:
        conn = get_db_connection()
        cur = conn.cursor()
        
        # Get match details
        cur.execute("""
            SELECT m.*, fi.description, fi.category, fi.item_name
            FROM matches m
            JOIN found_items fi ON m.found_item_id = fi.id
            WHERE m.id = %s
        """, (match_id,))
        
        match = cur.fetchone()
        if not match:
            return jsonify({'error': 'Match not found'}), 404
        
        # Generate questions using AI
        questions = ai_service.generate_verification_questions(
            match['description'],
            match['category'], 
            match['item_name']
        )
        
        # Save questions to database
        cur.execute("""
            INSERT INTO verification_attempts (match_id, questions)
            VALUES (%s, %s) RETURNING id
        """, (match_id, json.dumps(questions)))
        
        attempt_id = cur.fetchone()['id']
        conn.commit()
        cur.close()
        conn.close()
        
        return jsonify({
            'attempt_id': attempt_id,
            'questions': questions,
            'match_info': {
                'similarity_score': float(match['similarity_score']),
                'item_name': match['item_name'],
                'category': match['category']
            }
        }), 200
        
    except Exception as e:
        return jsonify({'error': f'Database error: {str(e)}'}), 500

@app.route('/api/verification/submit/<int:attempt_id>', methods=['POST'])
@jwt_required()
def submit_verification_answers(attempt_id):
    data = request.get_json()
    answers = data.get('answers', [])
    
    if not answers:
        return jsonify({'error': 'Answers are required'}), 400
    
    try:
        conn = get_db_connection()
        cur = conn.cursor()
        
        # Get verification attempt and match details
        cur.execute("""
            SELECT va.*, m.*, fi.description
            FROM verification_attempts va
            JOIN matches m ON va.match_id = m.id
            JOIN found_items fi ON m.found_item_id = fi.id
            WHERE va.id = %s
        """, (attempt_id,))
        
        attempt = cur.fetchone()
        if not attempt:
            return jsonify({'error': 'Verification attempt not found'}), 404
        
        questions_data = attempt['questions']
        if isinstance(questions_data, str):
            questions = json.loads(questions_data)
        else:
            questions = questions_data
        
        # Verify answers using AI
        verification_result = ai_service.verify_answers(
            attempt['description'],
            questions,
            answers
        )
        
        # Update verification attempt
        cur.execute("""
            UPDATE verification_attempts 
            SET answers = %s, verification_score = %s, verification_result = %s, ai_response = %s
            WHERE id = %s
        """, (
            json.dumps(answers),
            verification_result['overall_percentage'],
            verification_result['verification_result'],
            json.dumps(verification_result),
            attempt_id
        ))
        
        # Update match status
        if verification_result['verification_result'] == 'VERIFIED':
            cur.execute(
                "UPDATE matches SET status = 'verified' WHERE id = %s",
                (attempt['match_id'],)
            )
            
            # Get contact information
            cur.execute("""
                SELECT u1.name as owner_name, u1.contact_number as owner_contact, u1.registration_number as owner_reg,
                       u2.name as finder_name, u2.contact_number as finder_contact, u2.registration_number as finder_reg
                FROM matches m
                JOIN lost_items li ON m.lost_item_id = li.id
                JOIN found_items fi ON m.found_item_id = fi.id
                JOIN users u1 ON li.user_id = u1.id
                JOIN users u2 ON fi.user_id = u2.id
                WHERE m.id = %s
            """, (attempt['match_id'],))
            
            contact_info = cur.fetchone()
        else:
            contact_info = None
        
        conn.commit()
        cur.close()
        conn.close()
        
        response_data = {
            'verification_result': verification_result,
            'verified': verification_result['verification_result'] == 'VERIFIED'
        }
        
        if contact_info:
            response_data['contact_info'] = {
                'finder': {
                    'name': contact_info['finder_name'],
                    'phone': contact_info['finder_contact'],
                    'registration': contact_info['finder_reg']
                },
                'owner': {
                    'name': contact_info['owner_name'],
                    'phone': contact_info['owner_contact'],
                    'registration': contact_info['owner_reg']
                }
            }
        
        return jsonify(response_data), 200
        
    except Exception as e:
        return jsonify({'error': f'Database error: {str(e)}'}), 500

# Test database connection on startup
def test_db_connection():
    try:
        conn = get_db_connection()
        cur = conn.cursor()
        cur.execute("SELECT version();")
        version = cur.fetchone()
        print(f"✅ PostgreSQL Database connected: {version['version'][:50]}...")
        cur.close()
        conn.close()
    except Exception as e:
        print(f"❌ Database connection test failed: {e}")

if __name__ == '__main__':
    print("🚀 Starting Lost & Found System...")
    test_db_connection()
    print("🌐 Server starting on http://localhost:5000")
    app.run(debug=True, port=5000, host='0.0.0.0')