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

app = Flask(__name__)
app.config['SECRET_KEY'] = 'dev-secret-key'
app.config['JWT_SECRET_KEY'] = 'jwt-secret-key'
app.config['MAX_CONTENT_LENGTH'] = 25 * 1024 * 1024  # 25MB max file size

CORS(app)
jwt = JWTManager(app)

# Create uploads directory
UPLOAD_FOLDER = 'uploads'
if not os.path.exists(UPLOAD_FOLDER):
    os.makedirs(UPLOAD_FOLDER)

ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg'}

def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

def send_notification_email(user_email, user_name, item_name, reference_number):
    """Send confirmation email notification"""
    gmail_email = os.getenv('GMAIL_EMAIL')
    gmail_password = os.getenv('GMAIL_APP_PASSWORD')
    
    if not gmail_email or not gmail_password:
        print("Gmail credentials not configured - email notification skipped")
        return False
    
    try:
        msg = MIMEMultipart()
        msg['Subject'] = f'Found Item Reported - {reference_number}'
        msg['From'] = gmail_email
        msg['To'] = user_email
        
        body = f"""
        Hi {user_name}!
        
        Your found item "{item_name}" has been successfully reported.
        
        Reference: {reference_number}
        
        We'll notify you if someone claims it. Keep the item safe!
        
        - University Lost & Found System
        """
        
        msg.attach(MIMEText(body, 'plain'))
        
        server = smtplib.SMTP('smtp.gmail.com', 587)
        server.starttls()
        server.login(gmail_email, gmail_password)
        server.send_message(msg)
        server.quit()
        return True
    except Exception as e:
        print(f"Error sending email: {e}")
        return False

def send_lost_item_notification(user_email, user_name, item_name, reference_number):
    """Send lost item report confirmation email"""
    gmail_email = os.getenv('GMAIL_EMAIL')
    gmail_password = os.getenv('GMAIL_APP_PASSWORD')
    
    if not gmail_email or not gmail_password:
        print("Gmail credentials not configured - email notification skipped")
        return False
    
    try:
        msg = MIMEMultipart()
        msg['Subject'] = f'Lost Item Report Submitted - {reference_number}'
        msg['From'] = gmail_email
        msg['To'] = user_email
        
        body = f"""
        Hi {user_name}!
        
        Your lost item report for "{item_name}" has been submitted successfully.
        
        Reference: {reference_number}
        
        We'll notify you if someone finds a matching item. Keep checking your email and our system for updates.
        
        - University Lost & Found System
        """
        
        msg.attach(MIMEText(body, 'plain'))
        
        server = smtplib.SMTP('smtp.gmail.com', 587)
        server.starttls()
        server.login(gmail_email, gmail_password)
        server.send_message(msg)
        server.quit()
        return True
    except Exception as e:
        print(f"Error sending email: {e}")
        return False

# In-memory storage (for testing without database)
users = []
found_items = []
lost_items = []

@app.route('/api/auth/register', methods=['POST'])
def register():
    data = request.get_json()
    
    # Validate required fields
    required_fields = ['name', 'registration_number', 'department', 'email', 'password', 'contact_number']
    for field in required_fields:
        if not data.get(field):
            return jsonify({'error': f'{field} is required'}), 400
    
    # Check if user exists
    for user in users:
        if user['email'] == data['email']:
            return jsonify({'error': 'Email already registered'}), 400
        if user['registration_number'] == data['registration_number']:
            return jsonify({'error': 'Registration number already taken'}), 400
    
    # Create user
    user = {
        'id': len(users) + 1,
        'name': data['name'],
        'registration_number': data['registration_number'],
        'department': data['department'],
        'email': data['email'],
        'password': data['password'],  # In real app, hash this
        'contact_number': data['contact_number']
    }
    users.append(user)
    
    # Create token
    access_token = create_access_token(identity=user['id'])
    
    return jsonify({
        'message': 'User registered successfully',
        'access_token': access_token,
        'user': {k: v for k, v in user.items() if k != 'password'}
    }), 201

@app.route('/api/auth/login', methods=['POST'])
def login():
    data = request.get_json()
    
    if not data.get('login') or not data.get('password'):
        return jsonify({'error': 'Login and password are required'}), 400
    
    # Find user
    user = None
    for u in users:
        if u['email'] == data['login'] or u['registration_number'] == data['login']:
            if u['password'] == data['password']:
                user = u
                break
    
    if not user:
        return jsonify({'error': 'Invalid credentials'}), 401
    
    access_token = create_access_token(identity=user['id'])
    
    return jsonify({
        'message': 'Login successful',
        'access_token': access_token,
        'user': {k: v for k, v in user.items() if k != 'password'}
    }), 200

# FOUND ITEMS ENDPOINTS
@app.route('/api/found-items', methods=['POST'])
@jwt_required()
def create_found_item():
    user_id = get_jwt_identity()
    data = request.get_json()
    
    # Define valid options
    valid_categories = ['Electronics', 'Personal Items', 'Bags & Accessories', 'Books & Stationery', 'Clothing', 'Sports Equipment', 'Other']
    valid_colors = ['Black', 'White', 'Blue', 'Red', 'Green', 'Yellow', 'Grey', 'Brown', 'Pink', 'Multi-color', 'Other']
    valid_locations = ['Main Entrance', 'IT Building', 'Library', 'Old Main Cafeteria', 'Green Cafeteria', 'Faculty of Applied Science', 'Faculty of Communication and Business Studies', 'Faculty of Siddha Medicine', 'Play Ground', 'Sport Complex', 'Girls Hostel - New Saraswathi', 'Girls Hostel - Old Saraswathi', 'Girls Hostel - Marbel', 'Boys Hostel', 'Other']
    
    # Validate required fields
    required_fields = {
        'category': 'Item category is required',
        'item_name': 'Item name is required',
        'color': 'Color is required',
        'location_found': 'Location found is required',
        'date_found': 'Date found is required',
        'description': 'Description is required'
    }
    
    for field, message in required_fields.items():
        if not data.get(field):
            return jsonify({'error': message}), 400
    
    # Validate field values
    if data['category'] not in valid_categories:
        return jsonify({'error': 'Invalid category selected'}), 400
    
    if data['color'] not in valid_colors:
        return jsonify({'error': 'Invalid color selected'}), 400
    
    if data['location_found'] not in valid_locations:
        return jsonify({'error': 'Invalid location selected'}), 400
    
    # Validate item name length
    if len(data['item_name'].strip()) < 3:
        return jsonify({'error': 'Item name must be at least 3 characters'}), 400
    
    # Validate description length
    description = data['description'].strip()
    if len(description) < 20:
        return jsonify({'error': 'Description must be at least 20 characters'}), 400
    if len(description) > 500:
        return jsonify({'error': 'Description cannot exceed 500 characters'}), 400
    
    # Validate date (not future)
    try:
        found_date = datetime.strptime(data['date_found'], '%Y-%m-%d').date()
        if found_date > datetime.now().date():
            return jsonify({'error': 'Found date cannot be in the future'}), 400
    except ValueError:
        return jsonify({'error': 'Invalid date format. Use YYYY-MM-DD'}), 400
    
    # If location is "Other", check for specify_location
    if data['location_found'] == 'Other':
        if not data.get('specify_location'):
            return jsonify({'error': 'Please specify the location when selecting "Other"'}), 400
        location = data['specify_location'].strip()
    else:
        location = data['location_found']
    
    # Get user contact number
    user = next((u for u in users if u['id'] == user_id), None)
    if not user:
        return jsonify({'error': 'User not found'}), 404
    
    # Generate reference number
    item_id = len(found_items) + 1
    reference_number = f"FND-{datetime.now().year}-{item_id:04d}"
    
    # Create found item
    found_item = {
        'id': item_id,
        'reference_number': reference_number,
        'user_id': user_id,
        'category': data['category'],
        'item_name': data['item_name'].strip(),
        'brand': data.get('brand', '').strip(),
        'color': data['color'],
        'location_found': location,
        'date_found': data['date_found'],
        'description': description,
        'contact_number': user['contact_number'],
        'image_urls': data.get('image_urls', []),
        'status': 'active',
        'created_at': datetime.now().isoformat()
    }
    
    found_items.append(found_item)
    
    # Send confirmation notification
    confirmation_message = f"Hi {user['name']}! Your found item \"{data['item_name'].strip()}\" has been successfully reported. Reference: {reference_number}. We'll notify you if someone claims it. Keep the item safe! - University Lost & Found System"
    
    # Try to send email notification
    email_sent = send_notification_email(
        user['email'], 
        user['name'], 
        data['item_name'].strip(), 
        reference_number
    )
    
    return jsonify({
        'message': 'Found item submitted successfully',
        'confirmation_notification': confirmation_message,
        'reference_number': reference_number,
        'email_sent': email_sent,
        'item': found_item
    }), 201

@app.route('/api/found-items', methods=['GET'])
@jwt_required()
def get_found_items():
    user_id = get_jwt_identity()
    user_items = [item for item in found_items if item['user_id'] == user_id]
    
    return jsonify({'items': user_items}), 200

# Get dropdown options for frontend
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

# Image upload endpoint
@app.route('/api/upload-images', methods=['POST'])
@jwt_required()
def upload_images():
    if 'images' not in request.files:
        return jsonify({'error': 'No images provided'}), 400
    
    files = request.files.getlist('images')
    
    if len(files) == 0:
        return jsonify({'error': 'No images selected'}), 400
    
    if len(files) > 5:
        return jsonify({'error': 'Maximum 5 images allowed'}), 400
    
    uploaded_urls = []
    
    for file in files:
        if file.filename == '':
            continue
            
        if not allowed_file(file.filename):
            return jsonify({'error': f'Invalid file type: {file.filename}. Only JPG, PNG, JPEG allowed'}), 400
        
        # Check file size (5MB max per file)
        file.seek(0, 2)  # Seek to end
        size = file.tell()
        file.seek(0)  # Reset to beginning
        
        if size > 5 * 1024 * 1024:  # 5MB
            return jsonify({'error': f'File {file.filename} is too large. Maximum 5MB per image'}), 400
        
        # Save file
        filename = f"{uuid.uuid4()}_{secure_filename(file.filename)}"
        filepath = os.path.join(UPLOAD_FOLDER, filename)
        file.save(filepath)
        
        # Return URL that can be accessed
        image_url = f"/uploads/{filename}"
        uploaded_urls.append(image_url)
    
    if len(uploaded_urls) == 0:
        return jsonify({'error': 'No valid images uploaded'}), 400
    
    return jsonify({
        'message': f'{len(uploaded_urls)} images uploaded successfully',
        'image_urls': uploaded_urls
    }), 200

# Serve uploaded images
@app.route('/uploads/<filename>')
def uploaded_file(filename):
    from flask import send_from_directory
    return send_from_directory(UPLOAD_FOLDER, filename)

# DEBUG ENDPOINTS - View all data
@app.route('/api/debug/users', methods=['GET'])
def view_all_users():
    return jsonify({
        'total_users': len(users),
        'users': [{k: v for k, v in user.items() if k != 'password'} for user in users]
    }), 200

@app.route('/api/debug/found-items', methods=['GET'])
def view_all_found_items():
    return jsonify({
        'total_found_items': len(found_items),
        'found_items': found_items
    }), 200

@app.route('/api/debug/lost-items', methods=['GET'])
def view_all_lost_items():
    return jsonify({
        'total_lost_items': len(lost_items),
        'lost_items': lost_items
    }), 200

@app.route('/api/debug/all-data', methods=['GET'])
def view_all_data():
    return jsonify({
        'users': len(users),
        'found_items': len(found_items),
        'lost_items': len(lost_items),
        'data': {
            'users': [{k: v for k, v in user.items() if k != 'password'} for user in users],
            'found_items': found_items,
            'lost_items': lost_items
        }
    }), 200

# LOST ITEMS ENDPOINTS
@app.route('/api/lost-items', methods=['POST'])
@jwt_required()
def create_lost_item():
    user_id = get_jwt_identity()
    data = request.get_json()
    
    # Define valid options
    valid_categories = ['Electronics', 'Personal Items', 'Bags & Accessories', 'Books & Stationery', 'Clothing', 'Sports Equipment', 'Other']
    valid_colors = ['Black', 'White', 'Blue', 'Red', 'Green', 'Yellow', 'Grey', 'Brown', 'Pink', 'Multi-color', 'Other', "Don't Remember"]
    valid_locations = ['Main Entrance', 'IT Building', 'Library', 'Old Main Cafeteria', 'Green Cafeteria', 'Faculty of Applied Science', 'Faculty of Communication and Business Studies', 'Faculty of Siddha Medicine', 'Play Ground', 'Sport Complex', 'Girls Hostel - New Saraswathi', 'Girls Hostel - Old Saraswathi', 'Girls Hostel - Marbel', 'Boys Hostel', 'Not Sure', 'Other']
    
    # Validate required fields
    required_fields = {
        'category': 'Item category is required',
        'item_name': 'Item name is required',
        'color': 'Color is required',
        'location_lost': 'Location lost is required',
        'date_lost': 'Date lost is required',
        'description': 'Description is required'
    }
    
    for field, message in required_fields.items():
        if not data.get(field):
            return jsonify({'error': message}), 400
    
    # Validate field values
    if data['category'] not in valid_categories:
        return jsonify({'error': 'Invalid category selected'}), 400
    
    if data['color'] not in valid_colors:
        return jsonify({'error': 'Invalid color selected'}), 400
    
    if data['location_lost'] not in valid_locations:
        return jsonify({'error': 'Invalid location selected'}), 400
    
    # Validate item name length
    if len(data['item_name'].strip()) < 3:
        return jsonify({'error': 'Item name must be at least 3 characters'}), 400
    
    # Validate description length (more detailed for lost items)
    description = data['description'].strip()
    if len(description) < 30:
        return jsonify({'error': 'Description must be at least 30 characters for better verification'}), 400
    if len(description) > 500:
        return jsonify({'error': 'Description cannot exceed 500 characters'}), 400
    
    # Validate additional information length (optional)
    additional_info = data.get('additional_information', '').strip()
    if additional_info and len(additional_info) > 300:
        return jsonify({'error': 'Additional information cannot exceed 300 characters'}), 400
    
    # Validate date (not future, within last 30 days recommended)
    try:
        lost_date = datetime.strptime(data['date_lost'], '%Y-%m-%d').date()
        if lost_date > datetime.now().date():
            return jsonify({'error': 'Lost date cannot be in the future'}), 400
        
        # Check if date is more than 30 days ago (warning, not error)
        days_ago = (datetime.now().date() - lost_date).days
        date_warning = None
        if days_ago > 30:
            date_warning = 'Items lost more than 30 days ago are less likely to be found'
    except ValueError:
        return jsonify({'error': 'Invalid date format. Use YYYY-MM-DD'}), 400
    
    # Handle location-specific fields
    location = data['location_lost']
    location_details = ''
    
    if location == 'Other':
        if not data.get('specify_location'):
            return jsonify({'error': 'Please specify the location when selecting "Other"'}), 400
        location_details = data['specify_location'].strip()
    elif location == 'Not Sure':
        if not data.get('location_description'):
            return jsonify({'error': 'Please describe where you think you lost it when selecting "Not Sure"'}), 400
        location_details = data['location_description'].strip()
    
    # Get user details
    user = next((u for u in users if u['id'] == user_id), None)
    if not user:
        return jsonify({'error': 'User not found'}), 404
    
    # Generate reference number
    item_id = len(lost_items) + 1
    reference_number = f"LST-{datetime.now().year}-{item_id:04d}"
    
    # Create lost item
    lost_item = {
        'id': item_id,
        'reference_number': reference_number,
        'user_id': user_id,
        'category': data['category'],
        'item_name': data['item_name'].strip(),
        'brand': data.get('brand', '').strip(),
        'color': data['color'],
        'location_lost': location,
        'location_details': location_details,
        'date_lost': data['date_lost'],
        'description': description,
        'additional_information': additional_info,
        'contact_number': user['contact_number'],
        'image_urls': data.get('image_urls', []),
        'status': 'searching',
        'created_at': datetime.now().isoformat()
    }
    
    lost_items.append(lost_item)
    
    # Send confirmation notification
    confirmation_message = f"Hi {user['name']}! Your lost item report for \"{data['item_name'].strip()}\" has been submitted. Reference: {reference_number}. We'll notify you if someone finds a matching item. - University Lost & Found System"
    
    # Try to send email notification
    email_sent = send_lost_item_notification(
        user['email'], 
        user['name'], 
        data['item_name'].strip(), 
        reference_number
    )
    
    response_data = {
        'message': 'Lost item report submitted successfully',
        'confirmation_notification': confirmation_message,
        'reference_number': reference_number,
        'email_sent': email_sent,
        'item': lost_item
    }
    
    # Add warning if applicable
    if 'date_warning' in locals():
        response_data['warning'] = date_warning
    
    return jsonify(response_data), 201

@app.route('/api/lost-items', methods=['GET'])
@jwt_required()
def get_lost_items():
    user_id = get_jwt_identity()
    user_items = [item for item in lost_items if item['user_id'] == user_id]
    
    return jsonify({'items': user_items}), 200

if __name__ == '__main__':
    app.run(debug=True, port=5000, host='0.0.0.0')