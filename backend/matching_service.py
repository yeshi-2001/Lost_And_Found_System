import psycopg2
from psycopg2.extras import RealDictCursor
from datetime import datetime, timedelta
import re
from difflib import SequenceMatcher

class MatchingService:
    def __init__(self, database_url):
        self.database_url = database_url
    
    def get_db_connection(self):
        return psycopg2.connect(self.database_url, cursor_factory=RealDictCursor)
    
    def calculate_similarity(self, lost_item, found_item):
        """Calculate similarity score between lost and found items"""
        score = 0.0
        
        # Category match (20% weight)
        if lost_item['category'].lower() == found_item['category'].lower():
            score += 20
        
        # Brand match (15% weight)
        if lost_item.get('brand') and found_item.get('brand'):
            if lost_item['brand'].lower() == found_item['brand'].lower():
                score += 15
            elif self.similar_strings(lost_item['brand'], found_item['brand']) > 0.8:
                score += 10
        
        # Color match (15% weight)
        if lost_item['color'].lower() == found_item['color'].lower():
            score += 15
        elif self.similar_colors(lost_item['color'], found_item['color']):
            score += 10
        
        # Location proximity (15% weight)
        location_score = self.calculate_location_similarity(
            lost_item.get('location_lost', ''), 
            found_item.get('location_found', '')
        )
        score += location_score * 15
        
        # Date proximity (10% weight)
        date_score = self.calculate_date_similarity(
            lost_item.get('date_lost'), 
            found_item.get('date_found')
        )
        score += date_score * 10
        
        # Item name similarity (10% weight)
        name_score = self.similar_strings(
            lost_item.get('item_name', ''), 
            found_item.get('item_name', '')
        )
        score += name_score * 10
        
        # Description keywords (15% weight)
        desc_score = self.calculate_description_similarity(
            lost_item.get('description', ''), 
            found_item.get('description', '')
        )
        score += desc_score * 15
        
        return min(score, 100.0)
    
    def similar_strings(self, str1, str2):
        """Calculate string similarity using SequenceMatcher"""
        if not str1 or not str2:
            return 0.0
        return SequenceMatcher(None, str1.lower(), str2.lower()).ratio()
    
    def similar_colors(self, color1, color2):
        """Check if colors are similar"""
        color_groups = [
            ['black', 'dark'],
            ['white', 'light'],
            ['blue', 'navy', 'dark blue'],
            ['red', 'maroon', 'dark red'],
            ['green', 'dark green'],
            ['brown', 'tan', 'beige'],
            ['grey', 'gray', 'silver']
        ]
        
        color1_lower = color1.lower()
        color2_lower = color2.lower()
        
        for group in color_groups:
            if color1_lower in group and color2_lower in group:
                return True
        return False
    
    def calculate_location_similarity(self, loc1, loc2):
        """Calculate location similarity"""
        if not loc1 or not loc2:
            return 0.0
        
        # Exact match
        if loc1.lower() == loc2.lower():
            return 1.0
        
        # Check if locations are related
        location_groups = [
            ['library', 'study area', 'reading room'],
            ['cafeteria', 'canteen', 'food court'],
            ['hostel', 'dormitory', 'residence'],
            ['it building', 'computer lab', 'tech building'],
            ['playground', 'sports complex', 'gym']
        ]
        
        loc1_lower = loc1.lower()
        loc2_lower = loc2.lower()
        
        for group in location_groups:
            if any(term in loc1_lower for term in group) and any(term in loc2_lower for term in group):
                return 0.8
        
        # String similarity
        return self.similar_strings(loc1, loc2)
    
    def calculate_date_similarity(self, date1, date2):
        """Calculate date similarity"""
        if not date1 or not date2:
            return 0.0
        
        try:
            if isinstance(date1, str):
                date1 = datetime.strptime(date1, '%Y-%m-%d').date()
            if isinstance(date2, str):
                date2 = datetime.strptime(date2, '%Y-%m-%d').date()
            
            diff = abs((date1 - date2).days)
            
            if diff == 0:
                return 1.0
            elif diff <= 1:
                return 0.9
            elif diff <= 3:
                return 0.7
            elif diff <= 7:
                return 0.5
            else:
                return 0.2
        except:
            return 0.0
    
    def calculate_description_similarity(self, desc1, desc2):
        """Calculate description similarity based on keywords"""
        if not desc1 or not desc2:
            return 0.0
        
        # Extract keywords (remove common words)
        common_words = {'the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of', 'with', 'by', 'is', 'was', 'are', 'were', 'has', 'have', 'had'}
        
        words1 = set(re.findall(r'\w+', desc1.lower())) - common_words
        words2 = set(re.findall(r'\w+', desc2.lower())) - common_words
        
        if not words1 or not words2:
            return 0.0
        
        # Calculate Jaccard similarity
        intersection = len(words1.intersection(words2))
        union = len(words1.union(words2))
        
        return intersection / union if union > 0 else 0.0
    
    def find_matches_for_lost_item(self, lost_item_id):
        """Find potential matches for a lost item"""
        try:
            conn = self.get_db_connection()
            cur = conn.cursor()
            
            # Get lost item details
            cur.execute("SELECT * FROM lost_items WHERE id = %s", (lost_item_id,))
            lost_item = cur.fetchone()
            
            if not lost_item:
                return []
            
            # Get all active found items
            cur.execute("SELECT * FROM found_items WHERE status = 'active'")
            found_items = cur.fetchall()
            
            matches = []
            for found_item in found_items:
                similarity = self.calculate_similarity(lost_item, found_item)
                
                if similarity >= 80.0:  # 80% threshold
                    matches.append({
                        'found_item_id': found_item['id'],
                        'lost_item_id': lost_item_id,
                        'similarity_score': similarity,
                        'found_item': dict(found_item),
                        'lost_item': dict(lost_item)
                    })
            
            # Sort by similarity score (highest first)
            matches.sort(key=lambda x: x['similarity_score'], reverse=True)
            
            cur.close()
            conn.close()
            
            return matches
            
        except Exception as e:
            print(f"Error finding matches: {e}")
            return []
    
    def create_match_record(self, found_item_id, lost_item_id, similarity_score):
        """Create a match record in database"""
        try:
            conn = self.get_db_connection()
            cur = conn.cursor()
            
            # Check if match already exists
            cur.execute("""
                SELECT id FROM matches 
                WHERE found_item_id = %s AND lost_item_id = %s
            """, (found_item_id, lost_item_id))
            
            if cur.fetchone():
                cur.close()
                conn.close()
                return None  # Match already exists
            
            # Create new match
            cur.execute("""
                INSERT INTO matches (found_item_id, lost_item_id, similarity_score)
                VALUES (%s, %s, %s) RETURNING id
            """, (found_item_id, lost_item_id, similarity_score))
            
            match_id = cur.fetchone()['id']
            conn.commit()
            cur.close()
            conn.close()
            
            return match_id
            
        except Exception as e:
            print(f"Error creating match record: {e}")
            return None