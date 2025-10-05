# Test Gmail SMTP setup
from app.services.email_service import EmailService
from dotenv import load_dotenv

load_dotenv()

email_service = EmailService()
success = email_service.send_email(
    "cartooncomics277@gmail.com",  # Your email for testing
    "Test Email",
    "<h1>Gmail SMTP Working!</h1><p>Your Lost & Found system can send emails.</p>"
)

print("Email sent successfully!" if success else "Email failed - check credentials")