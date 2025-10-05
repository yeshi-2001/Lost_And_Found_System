from flask import Flask, send_from_directory
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate
from flask_cors import CORS
from flask_jwt_extended import JWTManager
import os
import logging

db = SQLAlchemy()
migrate = Migrate()
jwt = JWTManager()

def create_app():
    app = Flask(__name__)
    
    # Configuration
    app.config['SECRET_KEY'] = os.getenv('SECRET_KEY', 'dev-secret-key')
    app.config['JWT_SECRET_KEY'] = os.getenv('JWT_SECRET_KEY', 'jwt-secret-key')
    app.config['SQLALCHEMY_DATABASE_URI'] = os.getenv('DATABASE_URL', 'postgresql://localhost/lost_found_db')
    app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
    app.config['JWT_ACCESS_TOKEN_EXPIRES'] = False
    
    # Initialize extensions
    db.init_app(app)
    migrate.init_app(app, db)
    jwt.init_app(app)
    CORS(app)
    
    # Test database connection
    with app.app_context():
        try:
            from sqlalchemy import text
            db.session.execute(text('SELECT 1'))
            print("✅ Database connection successful!")
            print(f"📊 Connected to: {app.config['SQLALCHEMY_DATABASE_URI']}")
        except Exception as e:
            print("❌ Database connection failed!")
            print(f"Error: {str(e)}")
            print(f"Database URI: {app.config['SQLALCHEMY_DATABASE_URI']}")
    
    # Register blueprints
    from app.routes.auth import auth_bp
    from app.routes.found_items import found_items_bp
    from app.routes.lost_items import lost_items_bp
    from app.routes.matching import matching_bp
    from app.routes.form_options import form_options_bp
    
    app.register_blueprint(auth_bp, url_prefix='/api/auth')
    app.register_blueprint(found_items_bp, url_prefix='/api/found-items')
    app.register_blueprint(lost_items_bp, url_prefix='/api/lost-items')
    app.register_blueprint(matching_bp, url_prefix='/api/matches')
    app.register_blueprint(form_options_bp, url_prefix='/api')
    
    # Log all requests
    @app.before_request
    def log_request():
        from flask import request
        print(f"🚀 {request.method} {request.path} - Frontend connected")
    
    # ADDED: Route to serve locally stored images (replaces AWS S3 URLs)
    # This allows images to be accessed via /uploads/filename.jpg
    @app.route('/uploads/<filename>')
    def uploaded_file(filename):
        return send_from_directory('uploads', filename)
    
    return app