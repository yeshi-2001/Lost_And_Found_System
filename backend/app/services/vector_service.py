from app.services.ai_service import AIService
from typing import List

class VectorService:
    def __init__(self):
        self.ai_service = AIService()
    
    def generate_item_embedding(self, item_data: dict) -> List[float]:
        """Generate embedding for an item based on its attributes"""
        # Combine all relevant text fields
        text_parts = []
        
        if item_data.get('title'):
            text_parts.append(item_data['title'])
        if item_data.get('description'):
            text_parts.append(item_data['description'])
        if item_data.get('brand'):
            text_parts.append(f"Brand: {item_data['brand']}")
        if item_data.get('color'):
            text_parts.append(f"Color: {item_data['color']}")
        if item_data.get('category'):
            text_parts.append(f"Category: {item_data['category']}")
        
        combined_text = " ".join(text_parts)
        
        return self.ai_service.generate_embedding(combined_text)