from app import db
from app.models.match import Match
from app.models.found_item import FoundItem
from app.models.lost_item import LostItem
from datetime import datetime, timedelta
import re
from difflib import SequenceMatcher

class MatchingService:
    def __init__(self):
        # Location zones and adjacencies
        self.location_zones = {
            'academic': ['Main Entrance', 'IT Building', 'Library', 'Faculty of Applied Science', 
                        'Faculty of Communication and Business Studies', 'Faculty of Siddha Medicine'],
            'dining': ['Old Main Cafeteria', 'Green Cafeteria'],
            'recreation': ['Play Ground', 'Sport Complex', 'Playground'],
            'residential_girls': ['Girls Hostel - New Saraswathi', 'Girls Hostel - Old Saraswathi', 'Girls Hostel - Marbel'],
            'residential_boys': ['Boys Hostel']
        }
        
        self.adjacent_locations = {
            'Library': ['IT Building', 'Faculty of Applied Science'],
            'IT Building': ['Library', 'Main Entrance'],
            'Old Main Cafeteria': ['Green Cafeteria', 'Library']
        }
        
        # Similar colors
        self.similar_colors = {
            'Black': ['Dark Grey', 'Navy'],
            'White': ['Light Grey', 'Cream'],
            'Blue': ['Navy', 'Light Blue'],
            'Red': ['Maroon', 'Pink'],
            'Green': ['Dark Green', 'Light Green']
        }
        
        # Synonyms for description matching
        self.synonyms = {
            'phone': ['mobile', 'cellphone', 'smartphone'],
            'bag': ['backpack', 'purse', 'handbag'],
            'notebook': ['notepad', 'journal']
        }
    
    def find_matches_for_lost_item(self, lost_item):
        """Find matches when lost item is submitted"""
        # Pre-filter found items - RELAXED FILTERING
        found_items = FoundItem.query.filter(
            FoundItem.category == lost_item.category,
            FoundItem.status == 'active'
        ).all()
        
        print(f"DEBUG: Found {len(found_items)} potential matches for lost item {lost_item.id}")
        
        matches = []
        for found_item in found_items:
            similarity_score, score_breakdown = self._calculate_similarity(lost_item, found_item)
            
            print(f"DEBUG: Similarity score for items L{lost_item.id}-F{found_item.id}: {similarity_score}%")
            if similarity_score >= 60.0:  # Lowered from 80% to catch more matches
                match = Match(
                    found_item_id=found_item.id,
                    lost_item_id=lost_item.id,
                    similarity_score=similarity_score,
                    category_score=score_breakdown['category'],
                    brand_score=score_breakdown['brand'],
                    color_score=score_breakdown['color'],
                    location_score=score_breakdown['location'],
                    date_score=score_breakdown['date'],
                    name_score=score_breakdown['name'],
                    description_score=score_breakdown['description']
                )
                db.session.add(match)
                matches.append(match)
        
        if matches:
            db.session.commit()
            matches.sort(key=lambda x: x.similarity_score, reverse=True)
        
        return matches
    
    def find_matches_for_found_item(self, found_item):
        """Find matches when found item is submitted"""
        print(f"\n=== MATCHING DEBUG START for Found Item {found_item.id} ===")
        print(f"Found Item Details: {found_item.category}, {found_item.item_name}, {found_item.color}, {found_item.location}")
        
        # Pre-filter lost items - RELAXED FILTERING  
        lost_items = LostItem.query.filter(
            LostItem.category == found_item.category,
            LostItem.status == 'searching'
        ).all()
        
        print(f"DEBUG: Found {len(lost_items)} potential lost items with same category '{found_item.category}'")
        
        if len(lost_items) == 0:
            print("DEBUG: No lost items found with matching category - checking all lost items")
            all_lost_items = LostItem.query.filter(LostItem.status == 'searching').all()
            print(f"DEBUG: Total active lost items: {len(all_lost_items)}")
            for item in all_lost_items:
                print(f"  - Lost Item {item.id}: {item.category}, {item.item_name}")
        
        matches = []
        for lost_item in lost_items:
            print(f"\n--- Comparing F{found_item.id} vs L{lost_item.id} ---")
            print(f"Lost Item: {lost_item.item_name}, {lost_item.color}, {lost_item.location}")
            
            similarity_score, score_breakdown = self._calculate_similarity(lost_item, found_item)
            
            print(f"Score Breakdown: {score_breakdown}")
            print(f"Total Similarity: {similarity_score}%")
            
            if similarity_score >= 60.0:  # Lowered from 80% to catch more matches
                print(f"✅ MATCH FOUND! Score: {similarity_score}%")
                match = Match(
                    found_item_id=found_item.id,
                    lost_item_id=lost_item.id,
                    similarity_score=similarity_score,
                    category_score=score_breakdown['category'],
                    brand_score=score_breakdown['brand'],
                    color_score=score_breakdown['color'],
                    location_score=score_breakdown['location'],
                    date_score=score_breakdown['date'],
                    name_score=score_breakdown['name'],
                    description_score=score_breakdown['description']
                )
                try:
                    db.session.add(match)
                    matches.append(match)
                    print(f"✅ Match added to session")
                except Exception as e:
                    print(f"❌ Error adding match to session: {e}")
            else:
                print(f"❌ Score too low: {similarity_score}% < 60%")
        
        print(f"\nDEBUG: Total matches found: {len(matches)}")
        
        if matches:
            try:
                db.session.commit()
                print(f"✅ {len(matches)} matches committed to database")
                matches.sort(key=lambda x: x.similarity_score, reverse=True)
            except Exception as e:
                print(f"❌ Error committing matches: {e}")
                db.session.rollback()
                matches = []
        else:
            print("❌ No matches to commit")
        
        print(f"=== MATCHING DEBUG END ===\n")
        return matches
    
    def _calculate_similarity(self, lost_item, found_item):
        """Calculate similarity score using 7 criteria"""
        scores = {}
        
        # 1. Category Match (20%)
        scores['category'] = (100 if lost_item.category == found_item.category else 0) * 0.20
        
        # 2. Brand Match (15%)
        scores['brand'] = self._compare_brands(lost_item.brand, found_item.brand) * 0.15
        
        # 3. Color Match (15%)
        scores['color'] = self._compare_colors(lost_item.color, found_item.color) * 0.15
        
        # 4. Location Proximity (15%)
        scores['location'] = self._compare_locations(lost_item.location, found_item.location) * 0.15
        
        # 5. Date Proximity (10%)
        scores['date'] = self._calculate_date_proximity(lost_item.date_lost, found_item.date_found) * 0.10
        
        # 6. Item Name Similarity (10%)
        scores['name'] = self._calculate_string_similarity(lost_item.item_name, found_item.item_name) * 0.10
        
        # 7. Description Keywords (15%)
        scores['description'] = self._compare_descriptions(lost_item.description, found_item.description) * 0.15
        
        total_score = sum(scores.values())
        return round(total_score, 1), scores
    
    def _compare_brands(self, brand1, brand2):
        """Compare brand similarity"""
        if not brand1 or not brand2:
            return 50  # Neutral when one is missing
        
        if brand1.lower() == brand2.lower():
            return 100  # Exact match
        
        similarity = SequenceMatcher(None, brand1.lower(), brand2.lower()).ratio()
        if similarity > 0.8:
            return 80  # Similar
        
        return 0  # Different
    
    def _compare_colors(self, color1, color2):
        """Compare color similarity"""
        if color1 == "Don't Remember" or color2 == "Don't Remember":
            return 50  # Neutral
        
        if color1.lower() == color2.lower():
            return 100  # Exact match
        
        # Check similar colors
        for base_color, similar_list in self.similar_colors.items():
            if ((color1 == base_color and color2 in similar_list) or
                (color2 == base_color and color1 in similar_list) or
                (color1 in similar_list and color2 in similar_list)):
                return 70  # Similar colors
        
        return 0  # Different colors
    
    def _compare_locations(self, location1, location2):
        """Compare location proximity"""
        if location1 == "Not Sure" or location2 == "Not Sure":
            return 40  # Neutral
        
        if location1 == location2:
            return 100  # Exact match
        
        # Check adjacent locations
        if (location1 in self.adjacent_locations.get(location2, []) or
            location2 in self.adjacent_locations.get(location1, [])):
            return 70  # Adjacent
        
        # Check same zone
        for zone, locations in self.location_zones.items():
            if location1 in locations and location2 in locations:
                return 80  # Same zone (increased from 50)
        
        return 20  # Different zones
    
    def _calculate_date_proximity(self, date1, date2):
        """Calculate date proximity score"""
        if not date1 or not date2:
            return 0
        
        diff = abs((date1 - date2).days)
        
        if diff == 0:
            return 100  # Same day
        elif diff == 1:
            return 90   # 1 day
        elif diff <= 3:
            return 70   # 2-3 days
        elif diff <= 7:
            return 50   # 4-7 days
        else:
            return 20   # More than 7 days
    
    def _calculate_string_similarity(self, str1, str2):
        """Calculate string similarity using Levenshtein distance"""
        if not str1 or not str2:
            return 0
        
        similarity = SequenceMatcher(None, str1.lower(), str2.lower()).ratio()
        
        if similarity >= 0.8:
            return 100  # Very similar
        elif similarity >= 0.5:
            return 80   # Somewhat similar
        else:
            return 20   # Different
    
    def _compare_descriptions(self, desc1, desc2):
        """Compare description keywords"""
        if not desc1 or not desc2:
            return 0
        
        keywords1 = self._extract_keywords(desc1)
        keywords2 = self._extract_keywords(desc2)
        
        if not keywords1 or not keywords2:
            return 0
        
        # Count matching keywords (including synonyms)
        matching_count = 0
        for keyword in keywords1:
            if keyword in keywords2 or self._has_synonym_match(keyword, keywords2):
                matching_count += 1
        
        total_keywords = max(len(keywords1), len(keywords2))
        match_percentage = (matching_count / total_keywords) * 100
        
        return min(match_percentage, 100)
    
    def _extract_keywords(self, description):
        """Extract meaningful keywords from description"""
        stop_words = {'the', 'a', 'an', 'is', 'was', 'has', 'have', 'with', 'in', 'on', 'at'}
        words = re.findall(r'\w+', description.lower())
        return [word for word in words if len(word) > 3 and word not in stop_words]
    
    def _has_synonym_match(self, keyword, keywords_list):
        """Check if keyword has synonym match in list"""
        for base_word, synonyms in self.synonyms.items():
            if keyword == base_word and any(syn in keywords_list for syn in synonyms):
                return True
            if keyword in synonyms and base_word in keywords_list:
                return True
        return False