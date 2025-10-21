from app.services.ai_verification_service import AIVerificationService
from dotenv import load_dotenv

load_dotenv()

# Test the AI verification system
service = AIVerificationService()

# Test description from a found item
test_description = """Black iPhone 12 with blue protective case. Case has 
university logo sticker on back. Screen has minor scratches on top 
right corner. Phone was locked when I found it. There's a small dent 
on bottom left corner of the case. The charger was not with it."""

print("Testing AI Question Generation...")
print("=" * 50)

# Generate questions
result = service.generate_verification_questions(test_description)

if result['success']:
    print(f"Generated {result['count']} questions:")
    for i, question in enumerate(result['questions'], 1):
        print(f"{i}. {question}")
    
    print("\n" + "=" * 50)
    print("Testing AI Answer Verification...")
    
    # Test answers (simulating real owner responses)
    test_answers = [
        "Blue",
        "University logo sticker", 
        "Top right corner",
        "Bottom left corner",
        "No, the charger was not with it"
    ]
    
    # Verify answers
    verification = service.verify_answers(
        test_description, 
        result['questions'][:len(test_answers)], 
        test_answers
    )
    
    print(f"Verification Score: {verification['overall_percentage']}%")
    print(f"Verified: {verification['verified']}")
    print(f"Explanation: {verification['explanation']}")
    
else:
    print(f"Error: {result['error']}")