# FREE ALTERNATIVE: Using local file storage instead of AWS S3
# Images are stored in 'uploads' folder on your server
import os
from PIL import Image
from werkzeug.utils import secure_filename
import uuid

class ImageService:
    def __init__(self):
        # Create uploads directory for local image storage (replaces AWS S3)
        self.upload_folder = os.path.join(os.getcwd(), 'uploads')
        os.makedirs(self.upload_folder, exist_ok=True)  # Create folder if it doesn't exist
    
    def process_and_upload_image(self, image_file):
        """Process and save image locally"""
        try:
            # Open uploaded image file
            image = Image.open(image_file)
            
            # Resize image to reduce storage space and improve performance
            max_size = (1024, 1024)  # Maximum dimensions
            image.thumbnail(max_size, Image.Resampling.LANCZOS)
            
            # Convert to RGB format for consistent JPEG saving
            if image.mode in ('RGBA', 'P'):
                image = image.convert('RGB')
            
            # Generate unique filename to avoid conflicts
            filename = f"{uuid.uuid4()}.jpg"
            filepath = os.path.join(self.upload_folder, filename)
            
            # Save image to local uploads folder (replaces AWS S3 upload)
            image.save(filepath, format='JPEG', quality=85)
            
            # Return URL path that can be served by Flask
            image_url = f"/uploads/{filename}"
            return image_url
            
        except Exception as e:
            print(f"Error processing image: {e}")
            return None
    
    def validate_image(self, image_file):
        """Validate uploaded image"""
        allowed_extensions = {'png', 'jpg', 'jpeg', 'gif'}
        max_size = 5 * 1024 * 1024  # 5MB
        
        # Check file extension
        filename = secure_filename(image_file.filename)
        if '.' not in filename or filename.rsplit('.', 1)[1].lower() not in allowed_extensions:
            return False, "Invalid file type. Please upload PNG, JPG, JPEG, or GIF."
        
        # Check file size
        image_file.seek(0, 2)  # Seek to end
        size = image_file.tell()
        image_file.seek(0)  # Reset to beginning
        
        if size > max_size:
            return False, "File too large. Maximum size is 5MB."
        
        return True, "Valid image"