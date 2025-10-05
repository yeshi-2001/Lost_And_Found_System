# FREE ALTERNATIVE: Using Gmail SMTP instead of SendGrid
# Gmail allows 500 free emails per day with app passwords
import smtplib
import os
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart

class EmailService:
    def __init__(self):
        # Gmail SMTP configuration (free alternative to SendGrid)
        self.smtp_server = 'smtp.gmail.com'
        self.smtp_port = 587  # TLS port
        self.email = os.getenv('GMAIL_EMAIL')  # Your Gmail address
        self.password = os.getenv('GMAIL_APP_PASSWORD')  # 16-character app password
        self.from_email = self.email or 'noreply@lostfound.com'
    
    def send_email(self, to_email: str, subject: str, html_content: str):
        """Send email using Gmail SMTP"""
        # Check if Gmail credentials are configured
        if not self.email or not self.password:
            print("Gmail credentials not configured - emails will be skipped")
            return False
            
        try:
            # Create email message with HTML content
            msg = MIMEMultipart('alternative')
            msg['Subject'] = subject
            msg['From'] = self.from_email
            msg['To'] = to_email
            
            # Attach HTML content
            html_part = MIMEText(html_content, 'html')
            msg.attach(html_part)
            
            # Connect to Gmail SMTP server
            server = smtplib.SMTP(self.smtp_server, self.smtp_port)
            server.starttls()  # Enable TLS encryption
            server.login(self.email, self.password)  # Login with app password
            server.send_message(msg)  # Send the email
            server.quit()  # Close connection
            return True
        except Exception as e:
            print(f"Error sending email: {e}")
            return False
    
    def send_match_notification(self, user_email: str, item_title: str):
        """Send notification when a potential match is found"""
        html_content = f'''
        <h2>Great News!</h2>
        <p>We found a potential match for your lost item: <strong>{item_title}</strong></p>
        <p>Please log in to your account to verify ownership by answering verification questions.</p>
        <p><a href="http://localhost:3000/matches">View Matches</a></p>
        '''
        
        return self.send_email(user_email, f'Potential Match Found for {item_title}', html_content)
    
    def send_contact_details(self, owner_email: str, founder_details: dict, item_title: str):
        """Send founder's contact details to verified owner"""
        html_content = f'''
        <h2>Your Item Has Been Found!</h2>
        <p>Congratulations! Your item <strong>{item_title}</strong> has been verified and found.</p>
        <h3>Finder's Contact Information:</h3>
        <ul>
            <li><strong>Name:</strong> {founder_details.get('name', 'N/A')}</li>
            <li><strong>Email:</strong> {founder_details.get('email', 'N/A')}</li>
            <li><strong>Phone:</strong> {founder_details.get('phone', 'N/A')}</li>
            <li><strong>Location:</strong> {founder_details.get('location', 'N/A')}</li>
        </ul>
        <p>Please contact them to arrange pickup of your item.</p>
        '''
        
        return self.send_email(owner_email, f'Contact Details for Your Found Item: {item_title}', html_content)
    
    def notify_founder_contact_shared(self, founder_email: str, item_title: str, owner_name: str):
        """Notify founder that contact details were shared"""
        html_content = f'''
        <h2>Owner Verification Complete</h2>
        <p>The owner of <strong>{item_title}</strong> has been successfully verified.</p>
        <p>Your contact details have been shared with <strong>{owner_name}</strong>.</p>
        <p>They should contact you soon to arrange pickup.</p>
        <p>Thank you for being a good Samaritan!</p>
        '''
        
        return self.send_email(founder_email, f'Owner Verified for {item_title}', html_content)