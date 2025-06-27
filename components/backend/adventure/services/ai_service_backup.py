import os
import json
from typing import Dict, Any, Optional
from openai import OpenAI
from core.config_loader import settings

# Initialize OpenAI client
client = OpenAI(api_key=settings.OPENAI_API_KEY if hasattr(settings, 'OPENAI_API_KEY') else os.getenv("OPENAI_API_KEY"))

def generate_adventure_recommendations(
    location: str,
    destination: Optional[str],
    duration: str,
    activity_type: str,
    is_round_trip: bool = False,
    custom_activity: Optional[str] = None
) -> Dict[str, Any]:
    """
    Generate microadventure recommendations using OpenAI API
    
    Args:
        location: Starting location
        destination: Destination (if specified)
        duration: Duration of the adventure (few-hours, half-day, full-day, few-days)
        activity_type: Type of activity or 'surprise-me'
        is_round_trip: Whether it's a round trip
        custom_activity: Custom activity if specified
        
    Returns:
        Dictionary containing the adventure recommendations
    """
    
    # Build the context for the AI
    trip_type = "round trip" if is_round_trip else "one way"
    activity_context = custom_activity if custom_activity else activity_type
    
    system_prompt = """You are an enthusiastic local discovery guide and adventure curator who specializes in finding the extraordinary within the ordinary. 
    Your mission is to help people escape their routine and discover amazing, overlooked gems hiding in plain sight around them.
    
    A microadventure should be:
    - A delightful escape from routine that's accessible and spontaneous
    - A chance to see familiar places with fresh, curious eyes
    - An exploration of hidden gems, quirky spots, and local treasures
    - A way to add excitement and wonder to everyday life
    - Easy to do without extensive planning or special equipment
    - Perfect for when you want an adventure RIGHT NOW
    
    FOCUS ON DISCOVERY AND DELIGHT:
    - Fascinating local stories, legends, and interesting histories
    - Hidden or overlooked beautiful spots and unique architecture
    - Charming local businesses with character and backstories
    - Unusual art installations, murals, or creative expressions
    - Peaceful nature spots or surprising green spaces
    - Quirky landmarks, monuments, or historical markers
    - Interesting neighborhoods with distinct personalities
    - Local food scenes, markets, or unique culinary experiences
    - Photo-worthy spots that most people walk right past
    - Seasonal features like blooming trees, views, or events
    
    ADVENTURE PHILOSOPHY:
    - Make the familiar feel magical and new
    - Encourage curiosity and spontaneous exploration
    - Show how adventure is always within reach, not requiring big trips
    - Help people become tourists in their own area
    - Create moments of joy, wonder, and pleasant surprises
    - Build confidence for future independent exploration
    - Inspire people to slow down and notice their surroundings
    
    Your tone should be: Enthusiastic local friend who knows all the cool spots. Encouraging, warm, and excited to share discoveries. Like a combination of a passionate tour guide and an adventurous best friend."""
    
    Return the itinerary in the following JSON structure:
    {
        "title": "Fun adventure title that sparks curiosity and excitement",
        "description": "Engaging description that highlights the joy of discovery and local exploration",
        "image_prompt": "Detailed prompt for generating a bright, inviting adventure scene that captures exploration joy, local charm, and discovery excitement",
        "itinerary": [
            {
                "time": "9:00",
                "activity": "Activity with hidden story revelation",
                "location": "Specific location name",
                "duration": "30 minutes",
                "notes": "Interesting stories, local insights, hidden gems, fun facts, and delightful discoveries about this location that make it special and worth visiting"
            }
        ],
        "route": {
            "start_coordinates": "lat,lng",
            "end_coordinates": "lat,lng", 
            "waypoints": ["location1", "location2"],
            "map_embed_url": "https://www.google.com/maps/dir/START_ADDRESS/END_ADDRESS",
            "estimated_distance": "5.2 km",
            "estimated_travel_time": "1 hour walking"
        },
        "weather_forecast": {
            "temperature": "22°C",
            "conditions": "Partly cloudy",
            "precipitation": "10%",
            "wind": "15 km/h",
            "uv_index": "6 (High)",
            "best_time_outdoors": "Morning and early afternoon"
        },
        "packing_list": {
            "essential": ["Item 1", "Item 2", "Item 3"],
            "weather_specific": ["Weather item 1", "Weather item 2"],
            "optional": ["Optional item 1", "Optional item 2"],
            "food_and_drink": ["Food item 1", "Drink item 1"]
        },
        "recommendations": {
            "food_spots": ["Food spot 1", "Food spot 2"],
            "photo_opportunities": ["Photo spot 1", "Photo spot 2"],
            "local_tips": ["Tip 1", "Tip 2", "Tip 3"]
        },
        "estimated_cost": "Cost range (e.g., '$0-20', '$20-50')",
        "difficulty_level": "easy/moderate/challenging",
        "best_season": "Spring/Summer/Fall/Winter or year-round",
        "accessibility": "Wheelchair accessible/Moderate walking required/Challenging terrain"
    }
    
    Make the itinerary detailed, time-specific, and actionable. Include realistic coordinates and create a proper Google Maps embed URL for the route. Base weather forecasts on typical seasonal conditions for the location and adjust packing lists accordingly.
    """
    
    user_prompt = f"""CLASSIFIED INTEL REQUEST: Design a reality-shattering microadventure that exposes the REAL power structures and hidden operations of:
    - Starting location: {location}
    - Destination: {destination if destination else 'flexible/explore from starting location'}
    - Duration: {duration}
    - Activity type: {activity_context}
    - Trip type: {trip_type}
    
    � INTELLIGENCE MISSION PARAMETERS �
    Turn this person into a citizen journalist investigating their own neighborhood's shadow network.
    
    OPERATIONAL REQUIREMENTS:
    
    � FOLLOW THE MONEY:
    - Which corporations/developers REALLY control each area
    - What backroom deals shaped the neighborhood
    - How gentrification was engineered and by whom
    - Which "community improvements" were actually power grabs
    - What financial interests are behind major local businesses
    - How public space was privatized or monetized
    
    🔍 DECODE THE CONTROL SYSTEMS:
    - Surveillance networks (cameras, sensors, tracking systems)
    - Architectural psychology (how spaces control behavior)
    - Information warfare (how narratives are shaped)
    - Economic manipulation (how money flows are controlled)
    - Social engineering (how communities are managed)
    
    🕵️ EXPOSE THE HIDDEN NETWORKS:
    - Secret societies and elite clubs operating locally
    - Underground economies (legal and illegal)
    - Information brokers and influence peddlers
    - Organized crime connections to legitimate businesses
    - Government/corporate partnerships and their real agendas
    - Academic/research institutions doing classified work
    
    📊 REVEAL THE SUPPRESSED HISTORIES:
    - What communities were destroyed for "development"
    - Which protests, strikes, or resistance movements were crushed
    - How local leaders were bought, blackmailed, or eliminated
    - What environmental crimes were covered up
    - Which cultural/artistic movements were co-opted or destroyed
    
    🎯 ADVENTURE INTELLIGENCE PROFILE:
    - Like a Netflix conspiracy documentary but you're the investigator
    - Every location is a piece of evidence in a larger puzzle
    - Connect local dots to national/international power structures
    - Show how ordinary people are surveilled, controlled, and manipulated
    - Expose the mechanisms that keep people distracted and compliant
    
    🖼️ VISUAL INTELLIGENCE REQUIREMENT:
    Create an image prompt that would generate a scene like a still frame from a gritty investigative documentary. Think: shadowy urban landscapes, mysterious figures, hidden camera angles, architectural secrets, coded messages, underground passages, or surveillance equipment. The image should make viewers feel like they're about to uncover a major conspiracy or witness something they weren't supposed to see.
    
    � DEEP STATE LOCAL EXAMPLES:
    - "This Starbucks location was chosen because it's the perfect surveillance hub for monitoring [target group]"
    - "The 'random' placement of these benches creates a dead zone that prevents [type of gathering]"
    - "This building's architecture incorporates [hidden technology] for [covert purpose]"
    - "The timing of this construction project perfectly coincided with [political event] - not a coincidence"
    - "This 'community center' is actually a front for [intelligence operation]"
    - "The reason they closed [previous business] was to install [surveillance/control system]"
    
    Make them feel like Neo seeing the Matrix for the first time. Every mundane detail should reveal layers of control, manipulation, and hidden agendas.
    
    CLASSIFICATION LEVEL: EYES ONLY - FOR AWAKENED CITIZENS WHO CAN HANDLE THE TRUTH"""
    
    try:
        response = client.chat.completions.create(
            model="gpt-3.5-turbo-0125",
            messages=[
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": user_prompt}
            ],
            response_format={"type": "json_object"},
            temperature=0.7  # Moderate temperature for creative but practical recommendations
        )

        content = response.choices[0].message.content
        adventure_data = json.loads(content)

        # Validate required fields
        required_fields = ["title", "description", "itinerary", "route", "weather_forecast", "packing_list", "recommendations", "estimated_cost", "difficulty_level"]
        for field in required_fields:
            if field not in adventure_data:
                raise ValueError(f"Missing required field: {field}")
                
        # Validate structure
        if not isinstance(adventure_data["itinerary"], list):
            raise ValueError("Itinerary must be a list")
        if not isinstance(adventure_data["route"], dict):
            raise ValueError("Route must be a dictionary")
        if not isinstance(adventure_data["weather_forecast"], dict):
            raise ValueError("Weather forecast must be a dictionary")
        if not isinstance(adventure_data["packing_list"], dict):
            raise ValueError("Packing list must be a dictionary")
        if not isinstance(adventure_data["recommendations"], dict):
            raise ValueError("Recommendations must be a dictionary")

        # Generate image using DALL-E if image_prompt is provided
        if "image_prompt" in adventure_data and adventure_data["image_prompt"]:
            try:
                # Enhanced image prompt for more inviting and cheerful images
                enhanced_prompt = f"""Adventure discovery photography: {adventure_data['image_prompt']}
                
                Style: Bright, inviting, joyful exploration aesthetic. Crisp details, warm lighting, welcoming atmosphere.
                
                Lighting: Golden hour, warm sunlight, or bright daylight creating inviting and cheerful mood.
                
                Composition: Welcoming perspectives, interesting architecture, charming street scenes, people enjoying spaces.
                
                Mood: Inspiring, curious, joyful, discovery-focused. The feeling of finding hidden gems and exciting places.
                
                Quality: Professional photography, vibrant colors, clear focus, Instagram-worthy composition."""
                
                image_response = client.images.generate(
                    model="dall-e-3",
                    prompt=enhanced_prompt,
                    size="1792x1024",  # Landscape format perfect for adventure hero images
                    quality="hd",  # High quality for better details
                    style="vivid",  # More vivid and dramatic style
                    n=1
                )
                adventure_data["image_url"] = image_response.data[0].url
            except Exception as e:
                print(f"Failed to generate image: {str(e)}")
                # Continue without image if generation fails
                adventure_data["image_url"] = None
        else:
            adventure_data["image_url"] = None

        return adventure_data

    except Exception as e:
        # Fallback adventure if OpenAI fails
        print(f"AI generation failed: {e}")
        return {
            "title": f"Local Adventure from {location}",
            "description": f"Discover hidden gems and enjoy a {duration} adventure starting from {location}.",
            "itinerary": [
                {
                    "time": "9:00 AM",
                    "activity": "Start your adventure with a visit to a local park or green space",
                    "location": location,
                    "duration": "1 hour",
                    "notes": "Great for morning photos and fresh air"
                },
                {
                    "time": "10:30 AM", 
                    "activity": "Explore nearby walking trails or city streets",
                    "location": f"Near {location}",
                    "duration": "1.5 hours",
                    "notes": "Take your time to discover hidden spots"
                },
                {
                    "time": "12:00 PM",
                    "activity": "Lunch break at a local cafe or picnic spot",
                    "location": f"Local cafe near {location}",
                    "duration": "1 hour", 
                    "notes": "Try local specialties"
                }
            ],
            "route": {
                "start_coordinates": "0,0",
                "end_coordinates": "0,0",
                "waypoints": [location],
                "map_embed_url": "https://www.google.com/maps/embed?pb=1!1m18!1m12!1m3!1d3024.1!2d0!3d0!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1",
                "estimated_distance": "2-5 km",
                "estimated_travel_time": "2-3 hours walking"
            },
            "weather_forecast": {
                "temperature": "20-25°C",
                "conditions": "Pleasant",
                "precipitation": "Low chance",
                "wind": "Light breeze",
                "uv_index": "Moderate",
                "best_time_outdoors": "Morning to afternoon"
            },
            "packing_list": {
                "essential": [
                    "Comfortable walking shoes",
                    "Water bottle",
                    "Phone with camera"
                ],
                "weather_specific": [
                    "Light jacket or sweater",
                    "Sunglasses",
                    "Sun hat"
                ],
                "optional": [
                    "Backpack",
                    "Portable phone charger",
                    "Notebook for memories"
                ],
                "food_and_drink": [
                    "Light snacks",
                    "Extra water",
                    "Local currency for cafes"
                ]
            },
            "recommendations": {
                "food_spots": [
                    "Local cafes",
                    "Street food vendors",
                    "Markets"
                ],
                "photo_opportunities": [
                    "Scenic viewpoints",
                    "Interesting architecture",
                    "Nature scenes"
                ],
                "local_tips": [
                    "Check weather conditions before heading out",
                    "Start early to avoid crowds",
                    "Bring a camera to capture memories",
                    "Be open to spontaneous discoveries"
                ]
            },
            "estimated_cost": "$0-25",
            "difficulty_level": "easy",
            "best_season": "year-round",
            "accessibility": "Moderate walking required"
        }
