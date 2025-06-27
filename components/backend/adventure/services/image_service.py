import requests
import random
from typing import Optional
from urllib.parse import quote


class UnsplashImageService:
    """Free image service using Unsplash API"""
    
    def __init__(self):
        # Unsplash allows up to 50 requests per hour without an API key
        # For production, you should register for a free API key at https://unsplash.com/developers
        self.base_url = "https://api.unsplash.com"
        self.client_id = None  # Add your Unsplash Access Key here if you want higher limits
        
    def get_adventure_image(self, activity_type: str, location: str, description: str = "", title: str = "") -> Optional[str]:
        """
        Get a relevant image URL for the adventure based on activity type, location, and content
        
        Args:
            activity_type: The type of activity (hiking, cycling, etc.)
            location: The location of the adventure
            description: Optional description for more context
            title: Optional title for more context
            
        Returns:
            Image URL or None if no suitable image found
        """
        try:
            # Create search terms based on all available content
            search_terms = self._get_search_terms(activity_type, location, description, title)
            
            # Try each search term until we find a good image
            for search_term in search_terms:
                image_url = self._search_unsplash(search_term)
                if image_url:
                    return image_url
                    
            # Fallback to generic adventure/exploration images
            return self._search_unsplash("adventure exploration")
            
        except Exception as e:
            print(f"Error getting image from Unsplash: {e}")
            return None
    
    def _get_search_terms(self, activity_type: str, location: str, description: str = "", title: str = "") -> list[str]:
        """Generate relevant search terms based on activity type, location, and content"""
        search_terms = []
        
        # Analyze description and title for keywords
        content_keywords = self._extract_content_keywords(description, title)
        
        # Priority 1: Content-specific terms (from description/title analysis)
        search_terms.extend(content_keywords)
        
        # Priority 2: Activity + Location combinations
        location_keywords = self._extract_location_keywords(location)
        activity_keywords = self._get_activity_keywords(activity_type)
        
        # Combine activity with location
        for activity_term in activity_keywords[:2]:  # Top 2 activity terms
            for location_term in location_keywords[:2]:  # Top 2 location terms
                search_terms.append(f"{activity_term} {location_term}")
        
        # Priority 3: Activity-specific terms
        search_terms.extend(activity_keywords)
        
        # Priority 4: Location-specific terms
        search_terms.extend(location_keywords)
        
        # Priority 5: Fallback terms
        search_terms.extend([
            "outdoor adventure", "exploration", "local discovery", 
            "travel photography", "wanderlust", "adventure lifestyle"
        ])
        
        return search_terms[:15]  # Limit to avoid too many API calls
    
    def _extract_content_keywords(self, description: str, title: str) -> list[str]:
        """Extract relevant keywords from adventure description and title"""
        keywords = []
        content = f"{title} {description}".lower()
        
        # Look for specific activities and locations mentioned
        activity_indicators = {
            "museum": ["museum", "gallery", "exhibition", "cultural center", "art museum"],
            "market": ["market", "farmers market", "food market", "bazaar", "vendor"],
            "park": ["park", "garden", "botanical", "green space", "playground"],
            "beach": ["beach", "coastline", "ocean", "seaside", "shore", "waterfront"],
            "mountain": ["mountain", "hill", "peak", "summit", "overlook", "vista", "cliff"],
            "architecture": ["building", "architecture", "historic", "cathedral", "church", "temple"],
            "street art": ["mural", "street art", "graffiti", "sculpture", "public art"],
            "food": ["cafe", "restaurant", "food", "dining", "culinary", "bakery", "brewery"],
            "shopping": ["shop", "store", "boutique", "vintage", "market", "mall"],
            "nature": ["trail", "path", "forest", "trees", "wildlife", "bird", "flower"],
            "urban": ["downtown", "city", "urban", "street", "neighborhood", "district"],
            "water": ["river", "lake", "waterfront", "pier", "bridge", "fountain"],
            "sunset": ["sunset", "golden hour", "evening", "dusk", "sunrise", "dawn"],
            "photography": ["photo", "view", "scenic", "panoramic", "viewpoint", "lookout"],
            "history": ["historic", "heritage", "monument", "memorial", "old", "ancient"],
            "festival": ["festival", "event", "celebration", "concert", "performance"],
            "coffee": ["coffee", "cafe", "espresso", "barista", "roastery"],
            "local": ["local", "neighborhood", "community", "hidden", "secret", "authentic"]
        }
        
        for category, terms in activity_indicators.items():
            matches = 0
            found_terms = []
            for term in terms:
                if term in content:
                    matches += 1
                    found_terms.append(term)
            
            # If we found multiple matching terms, this is likely relevant
            if matches >= 1:
                keywords.append(category)
                # Add the most specific matching term
                if found_terms:
                    keywords.append(found_terms[0])
        
        # Look for specific places or landmarks mentioned
        landmark_patterns = [
            "golden gate", "brooklyn bridge", "central park", "times square",
            "eiffel tower", "big ben", "colosseum", "statue of liberty",
            "hollywood", "venice beach", "fisherman's wharf", "pier 39"
        ]
        
        for landmark in landmark_patterns:
            if landmark in content:
                keywords.append(landmark)
        
        # Look for specific activities or verbs that indicate type of adventure
        activity_verbs = {
            "explore": ["exploration", "urban exploration", "discovery"],
            "walk": ["walking", "city walk", "street walk"],
            "visit": ["sightseeing", "tourist attraction", "landmark"],
            "discover": ["discovery", "hidden gems", "local secrets"],
            "taste": ["food photography", "culinary", "local cuisine"],
            "climb": ["climbing", "hiking", "mountain"],
            "relax": ["peaceful", "serene", "calm"],
            "adventure": ["adventure", "exciting", "thrilling"]
        }
        
        for verb, related_terms in activity_verbs.items():
            if verb in content:
                keywords.extend(related_terms[:2])  # Add top 2 related terms
        
        return keywords[:8]  # Top 8 content-based keywords
    
    def _extract_location_keywords(self, location: str) -> list[str]:
        """Extract and enhance location-based keywords"""
        keywords = []
        location_lower = location.lower()
        
        # Major cities with specific characteristics
        city_mappings = {
            "san francisco": ["san francisco bay", "golden gate", "sf hills", "california coast"],
            "new york": ["manhattan", "brooklyn", "nyc skyline", "central park"],
            "london": ["london streets", "uk architecture", "british", "thames"],
            "paris": ["parisian", "france", "european city", "seine"],
            "tokyo": ["japanese", "urban japan", "tokyo streets"],
            "los angeles": ["california", "la", "west coast", "southern california"],
            "chicago": ["midwest", "windy city", "lake michigan"],
            "seattle": ["pacific northwest", "coffee culture", "emerald city"],
            "boston": ["new england", "historic", "east coast"],
            "miami": ["tropical", "art deco", "beach city", "florida"]
        }
        
        # Check for major cities
        for city, terms in city_mappings.items():
            if city in location_lower:
                keywords.extend(terms)
                break
        
        # Geographic features
        if any(word in location_lower for word in ["beach", "coast", "ocean"]):
            keywords.extend(["coastal", "seaside", "ocean view", "beach walk"])
        elif any(word in location_lower for word in ["mountain", "hill"]):
            keywords.extend(["mountain", "hiking", "nature", "landscape"])
        elif any(word in location_lower for word in ["park", "garden"]):
            keywords.extend(["park", "green space", "nature walk", "gardens"])
        elif any(word in location_lower for word in ["downtown", "city"]):
            keywords.extend(["urban", "city", "metropolitan", "street"])
        
        # Add the original location
        keywords.append(location)
        
        return keywords[:5]
    
    def _get_activity_keywords(self, activity_type: str) -> list[str]:
        """Get enhanced activity-specific keywords"""
        activity_map = {
            "hiking": ["hiking trail", "mountain hiking", "forest path", "nature walk", "outdoor adventure"],
            "cycling": ["cycling path", "bike trail", "urban cycling", "bicycle adventure", "bike tour"],
            "walking": ["city walk", "urban exploration", "street photography", "walking path", "pedestrian"],
            "photography": ["urban photography", "street art", "architectural photography", "city landscape", "photo walk"],
            "sightseeing": ["city view", "urban landscape", "tourist attraction", "landmark", "scenic view"],
            "nature": ["nature photography", "natural landscape", "outdoor adventure", "scenic view", "wilderness"],
            "urban": ["urban exploration", "city streets", "modern architecture", "street scene", "metropolitan"],
            "historical": ["historical building", "old architecture", "heritage site", "historic landmark", "ancient"],
            "art": ["street art", "public art", "urban art", "creative space", "gallery"],
            "food": ["local market", "street food", "food photography", "culinary adventure", "dining"],
            "surprise-me": ["adventure", "exploration", "discovery", "wanderlust", "hidden gems"]
        }
        
        keywords = []
        activity_lower = activity_type.lower()
        
        # Find matching activity keywords
        for key, terms in activity_map.items():
            if key in activity_lower or activity_lower in key:
                keywords.extend(terms)
                break
        
        # If no specific match found, use generic adventure terms
        if not keywords:
            keywords = ["adventure", "exploration", "outdoor", "discovery", "travel"]
        
        return keywords[:5]
        
        return search_terms
    
    def _search_unsplash(self, query: str) -> Optional[str]:
        """Search Unsplash for images matching the query"""
        try:
            # Encode the search query
            encoded_query = quote(query)
            
            # Build the search URL
            url = f"{self.base_url}/search/photos"
            params = {
                "query": query,
                "page": 1,
                "per_page": 10,
                "orientation": "landscape",  # Get landscape images for better hero image display
                "order_by": "relevant"
            }
            
            # Add client ID if available (for higher rate limits)
            if self.client_id:
                params["client_id"] = self.client_id
            
            # Make the request
            response = requests.get(url, params=params, timeout=10)
            
            if response.status_code == 200:
                data = response.json()
                if data.get("results"):
                    # Get a random image from the results
                    image = random.choice(data["results"])
                    
                    # Return the regular-sized image URL (good quality, reasonable size)
                    return image["urls"]["regular"]
                    
            elif response.status_code == 403:
                print("Unsplash API rate limit exceeded")
                return None
            else:
                print(f"Unsplash API error: {response.status_code}")
                return None
                
        except Exception as e:
            print(f"Error searching Unsplash: {e}")
            return None
    
    def get_fallback_image(self) -> str:
        """Get a fallback image URL for when Unsplash fails"""
        # Use a curated list of free, beautiful adventure/exploration images
        fallback_urls = [
            "https://images.unsplash.com/photo-1501594907352-04cda38ebc29?w=1200&h=675&fit=crop",  # Mountain adventure
            "https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=1200&h=675&fit=crop",  # Forest path
            "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1200&h=675&fit=crop",  # City exploration
            "https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?w=1200&h=675&fit=crop",  # Urban adventure
            "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1200&h=675&fit=crop",  # Street photography
        ]
        return random.choice(fallback_urls)


# Global instance
unsplash_service = UnsplashImageService()


def get_adventure_image(activity_type: str, location: str, description: str = "", title: str = "") -> str:
    """
    Get an adventure image URL
    
    Args:
        activity_type: The type of activity
        location: The location of the adventure
        description: Optional description for context
        title: Optional title for context
        
    Returns:
        Image URL (never None, falls back to default if needed)
    """
    # Try to get image from Unsplash
    image_url = unsplash_service.get_adventure_image(activity_type, location, description, title)
    
    # If that fails, use a fallback image
    if not image_url:
        image_url = unsplash_service.get_fallback_image()
    
    return image_url
