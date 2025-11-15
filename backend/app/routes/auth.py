from flask import Blueprint, request, jsonify
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity
from app import db
from app.models.user import User
from email_validator import validate_email, EmailNotValidError
import secrets
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from datetime import datetime, timedelta
import os

auth_bp = Blueprint('auth', __name__)

@auth_bp.route('/register', methods=['POST'])
def register():
    data = request.get_json()
    
    # Validate required fields
    required_fields = ['name', 'registration_number', 'department', 'email', 'password', 'contact_number']
    for field in required_fields:
        if not data.get(field):
            return jsonify({'error': f'{field} is required'}), 400
    
    # Validate email format
    try:
        validate_email(data['email'])
    except EmailNotValidError:
        return jsonify({'error': 'Invalid email format'}), 400
    
    # Check if user already exists
    if User.query.filter_by(email=data['email']).first():
        return jsonify({'error': 'Email already registered'}), 400
    
    if User.query.filter_by(registration_number=data['registration_number']).first():
        return jsonify({'error': 'Registration number already taken'}), 400
    
    # Create new user
    user = User(
        name=data['name'],
        registration_number=data['registration_number'],
        department=data['department'],
        email=data['email'],
        contact_number=data['contact_number']
    )
    user.set_password(data['password'])
    
    db.session.add(user)
    db.session.commit()
    
    # Create access token
    access_token = create_access_token(identity=str(user.id))
    
    return jsonify({
        'message': 'User registered successfully',
        'access_token': access_token,
        'user': user.to_dict()
    }), 201

@auth_bp.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    
    if not data.get('login') or not data.get('password'):
        return jsonify({'error': 'Login (email or registration number) and password are required'}), 400
    
    # Allow login with either email or registration number
    user = User.query.filter(
        (User.email == data['login']) | (User.registration_number == data['login'])
    ).first()
    
    if not user or not user.check_password(data['password']):
        return jsonify({'error': 'Invalid credentials'}), 401
    
    # Update last_login timestamp
    user.last_login = datetime.utcnow()
    db.session.commit()
    
    access_token = create_access_token(identity=str(user.id))
    
    return jsonify({
        'message': 'Login successful',
        'access_token': access_token,
        'user': user.to_dict()
    }), 200

@auth_bp.route('/profile', methods=['GET'])
@jwt_required()
def get_profile():
    user_id = get_jwt_identity()
    user = User.query.get(user_id)
    
    if not user:
        return jsonify({'error': 'User not found'}), 404
    
    return jsonify({'user': user.to_dict()}), 200

@auth_bp.route('/forgot-password', methods=['POST'])
def forgot_password():
    data = request.get_json()
    
    if not data.get('email'):
        return jsonify({'error': 'Email is required'}), 400
    
    user = User.query.filter_by(email=data['email']).first()
    if not user:
        return jsonify({'error': 'User not found'}), 404
    
    # Generate reset token
    reset_token = secrets.token_urlsafe(32)
    reset_token_expiry = datetime.utcnow() + timedelta(hours=1)
    
    user.reset_password_token = reset_token
    user.reset_password_expiry = reset_token_expiry
    db.session.commit()
    
    # Send email
    try:
        send_reset_email(user.email, user.name, reset_token)
        return jsonify({'message': 'Password reset email sent successfully'}), 200
    except Exception as e:
        print(f"Email sending error: {str(e)}")
        return jsonify({'error': f'Failed to send email: {str(e)}'}), 500

@auth_bp.route('/reset-password', methods=['POST'])
def reset_password():
    data = request.get_json()
    
    if not data.get('token') or not data.get('password'):
        return jsonify({'error': 'Token and password are required'}), 400
    
    user = User.query.filter(
        User.reset_password_token == data['token'],
        User.reset_password_expiry > datetime.utcnow()
    ).first()
    
    if not user:
        return jsonify({'error': 'Invalid or expired reset token'}), 400
    
    # Update password
    user.set_password(data['password'])
    user.reset_password_token = None
    user.reset_password_expiry = None
    db.session.commit()
    
    return jsonify({'message': 'Password reset successfully'}), 200

def send_reset_email(email, name, token):
    smtp_server = "smtp.gmail.com"
    smtp_port = 587
    sender_email = os.getenv('GMAIL_EMAIL')
    sender_password = os.getenv('GMAIL_APP_PASSWORD')
    
    print(f"Email config - Sender: {sender_email}, Password configured: {bool(sender_password)}")
    
    if not sender_email or not sender_password:
        raise Exception('Email credentials not configured')
    
    # Remove spaces from app password if any
    sender_password = sender_password.replace(' ', '')
    
    reset_url = f"{os.getenv('FRONTEND_URL', 'http://localhost:3000')}/reset-password/{token}"
    
    message = MIMEMultipart("alternative")
    message["Subject"] = "Password Reset - Back2U"
    message["From"] = sender_email
    message["To"] = email
    
    html = f"""
    <html>
      <body style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #03045E;">Password Reset Request</h2>
        <p>Hello {name},</p>
        <p>You requested a password reset for your Back2U account. Click the button below to reset your password:</p>
        <div style="text-align: center; margin: 30px 0;">
          <a href="{reset_url}" style="background-color: #2E72F9; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; display: inline-block;">Reset Password</a>
        </div>
        <p>This link will expire in 1 hour.</p>
        <p>If you didn't request this password reset, please ignore this email.</p>
        <p>Best regards,<br>Back2U Team</p>
      </body>
    </html>
    """
    
    part = MIMEText(html, "html")
    message.attach(part)
    
    with smtplib.SMTP(smtp_server, smtp_port) as server:
        server.starttls()
        server.login(sender_email, sender_password)
        server.sendmail(sender_email, email, message.as_string())