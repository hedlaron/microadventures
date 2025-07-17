import json
import os
from datetime import datetime
from typing import Any

from openai import OpenAI

from adventure.services.image_service import get_adventure_image
from core.config_loader import settings

# Initialize OpenAI client
client = OpenAI(
    api_key=(
        settings.OPENAI_API_KEY
        if hasattr(settings, "OPENAI_API_KEY")
        else os.getenv("OPENAI_API_KEY")
    )
)


def generate_adventure_recommendations(
    location: str,
    destination: str | None,
    duration: str,
    activity_type: str,
    is_round_trip: bool = False,
    custom_activity: str | None = None,
    start_time: datetime | None = None,
    is_immediate: bool = False,
) -> dict[str, Any]:
    """
    Generate microadventure recommendations using OpenAI API

    Args:
        location: Starting location
        destination: Destination (if specified)
        duration: Duration of the adventure (few-hours, half-day, full-day, few-days)
        activity_type: Type of activity or 'surprise-me'
        is_round_trip: Whether it's a round trip
        custom_activity: Custom activity if specified
        start_time: When the adventure should start (optional)
        is_immediate: True if "Let's go now" was selected for immediate adventures

    Returns:
        Dictionary containing the adventure recommendations
    """

    # Build the context for the AI
    trip_type = "round trip" if is_round_trip else "one way"
    activity_context = custom_activity if custom_activity else activity_type

    # Create time context for the AI
    time_context = ""
    if is_immediate:
        current_time = datetime.now()
        time_context = f"\n\n⏰ IMPORTANT TIME CONTEXT:\nThis is an IMMEDIATE adventure - the user wants to go RIGHT NOW!\nCurrent time: {current_time.strftime('%A, %B %d, %Y at %H:%M (%I:%M %p)')}\n"
        time_context += f"Day of week: {current_time.strftime('%A')}\n"
        time_context += f"Time of day: {current_time.strftime('%H:%M')} (24-hour format)\n\n"
        time_context += "🚨 ADJUST THE ITINERARY FOR THE CURRENT TIME:\n"
        time_context += "- Start the adventure at or shortly after the current time\n"
        time_context += "- Consider what's open/available right now\n"
        time_context += "- Account for typical business hours, meal times, and daylight\n"
        time_context += "- Make sure the timing is practical and realistic\n"
        time_context += "- If it's evening/night, focus on evening-appropriate activities\n"
        time_context += "- If it's morning, suggest morning-friendly activities\n"
        time_context += "- Consider traffic patterns and peak hours\n\n"
    elif start_time:
        time_context = f"\n\n⏰ SCHEDULED ADVENTURE:\nStart time: {start_time.strftime('%A, %B %d, %Y at %H:%M (%I:%M %p)')}\n"
        time_context += f"Day of week: {start_time.strftime('%A')}\n"
        time_context += f"Time of day: {start_time.strftime('%H:%M')} (24-hour format)\n\n"
        time_context += "📅 SCHEDULE THE ITINERARY ACCORDINGLY:\n"
        time_context += "- Start the adventure at the specified time\n"
        time_context += "- Plan activities appropriate for that time of day\n"
        time_context += "- Consider what will be open/available at that time\n\n"

    system_prompt = """You are an enthusiastic local discovery guide and adventure curator who specializes in finding the extraordinary within the ordinary.
    Your mission is to help people escape their routine and discover amazing, overlooked gems hiding in plain sight around them.

    A microadventure should be:
    - A delightful escape from routine that's accessible and spontaneous
    - A chance to see familiar places with fresh, curious eyes
    - An exploration of hidden gems, quirky spots, and local treasures
    - A way to add excitement and wonder to everyday life
    - Easy to do without extensive planning or special equipment
    - Perfect for when you want an adventure RIGHT NOW
    - COMPLETELY FREE OR VERY LOW COST (under $5 total)

    FOCUS ON FREE DISCOVERY AND DELIGHT:
    - Fascinating local stories, legends, and interesting histories
    - Hidden or overlooked beautiful spots and unique architecture
    - Public art installations, murals, or creative expressions
    - Peaceful nature spots or surprising green spaces
    - Quirky landmarks, monuments, or historical markers
    - Interesting neighborhoods with distinct personalities
    - Photo-worthy spots that most people walk right past
    - Seasonal features like blooming trees, views, or events
    - Free public spaces, parks, trails, and viewpoints
    - Street art, community gardens, and local character

    ADVENTURE PHILOSOPHY:
    - Make the familiar feel magical and new
    - Encourage curiosity and spontaneous exploration
    - Show how adventure is always within reach, not requiring big trips
    - Help people become tourists in their own area
    - Create moments of joy, wonder, and pleasant surprises
    - Build confidence for future independent exploration
    - Inspire people to slow down and notice their surroundings
    - Focus on experiences, not purchases

    IMPORTANT: DO NOT suggest restaurants, cafes, bars, shops, or any places that require spending money.
    The adventurer will handle their own food and drink needs. Focus purely on FREE experiences, sights, and discoveries.

    Your tone should be: Enthusiastic local friend who knows all the cool spots. Encouraging, warm, and excited to share discoveries. Like a combination of a passionate tour guide and an adventurous best friend.

    Return the itinerary in the following JSON structure:
    {
        "title": "Fun adventure title that sparks curiosity and excitement",
        "description": "Engaging description that highlights the joy of discovery and local exploration",
        "itinerary": [
            {
                "time": "9:00",
                "activity": "Activity with interesting local discovery",
                "location": "Specific location name or address",
                "duration": "30 minutes",
                "notes": "Interesting stories, local insights, hidden gems, fun facts, and delightful discoveries about this location that make it special and worth visiting"
            }
        ],
        "route": {
            "start_address": "Full street address of starting point",
            "end_address": "Full street address of ending point",
            "waypoints": ["Address 1", "Address 2"],
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
            "food_and_drink": ["Bring your own water", "Pack snacks if needed"]
        },
        "recommendations": {
            "photo_opportunities": ["Photo spot 1", "Photo spot 2"],
            "local_tips": ["Free tip 1", "Free tip 2", "Free tip 3"],
            "hidden_gems": ["Hidden gem 1", "Hidden gem 2"]
        },
        "estimated_cost": "FREE (bring your own food/water)",
        "difficulty_level": "easy/moderate/challenging",
        "best_season": "Spring/Summer/Fall/Winter or year-round",
        "accessibility": "Wheelchair accessible/Moderate walking required/Challenging terrain"
    }
    Make the itinerary detailed, time-specific, and actionable. Use full street addresses instead of coordinates for start_address, end_address, and waypoints. Create a proper Google Maps embed URL for the route. Base weather forecasts on typical seasonal conditions for the location and adjust packing lists accordingly.
    """

    user_prompt = f"""🌟 ADVENTURE DISCOVERY REQUEST: Design a delightful microadventure that reveals the hidden gems and exciting discoveries around:
    - Starting location: {location}
    - Destination: {destination if destination else "flexible/explore from starting location"}
    - Duration: {duration}
    - Activity type: {activity_context}
    - Trip type: {trip_type}
    {time_context}
    ✨ MAKE THIS A MAGICAL ESCAPE ✨
    Turn this person into a curious explorer who sees their familiar surroundings with wonder and excitement!

    ADVENTURE REQUIREMENTS:

    🔍 FREE DISCOVERY FOCUS:
    - What makes each location special, unique, or surprisingly interesting
    - Hidden gems that locals love but visitors often miss
    - Fascinating local stories, legends, or interesting historical tidbits
    - Beautiful views, photo spots, or aesthetically pleasing areas
    - Public art, street art, murals, or creative installations
    - Interesting architecture that can be admired from public spaces
    - Peaceful spots perfect for reflection or people-watching
    - Seasonal features like gardens, trees, or natural beauty
    - Public parks, trails, viewpoints, and green spaces
    - Historical markers, monuments, and community features

    🎯 BUDGET-CONSCIOUS EXPLORATION:
    - Encourage curiosity and wonder about everyday surroundings
    - Show how adventure is accessible without spending money
    - Help them become a tourist in their own area
    - Create moments of joy, discovery, and pleasant surprises
    - Focus ONLY on completely free experiences and sights
    - Make familiar places feel fresh and exciting through new perspectives
    - Avoid any suggestions that require purchasing anything

    📱 SPONTANEOUS ADVENTURE VIBES:
    - Easy to do right now without special preparation or money
    - Perfect for when you want to break routine and add excitement
    - Accessible by walking, public transport, or short drives
    - Suitable for solo exploration or sharing with friends
    - Creates Instagram-worthy moments and great memories
    - No entrance fees, purchases, or monetary commitments required

    🌈 EXAMPLES OF FREE DELIGHTFUL DISCOVERIES:
    - "This mural tells the story of the neighborhood's artistic renaissance"
    - "This hidden public garden has the best sunset views in the area"
    - "The old theater has original Art Deco features you can admire from the street"
    - "This overlook provides stunning views of the city skyline"
    - "The walking path along this creek reveals unexpected wildlife and peaceful spots"

    Make them fall in love with exploration and feel excited about what's possible in their own backyard!"""

    try:
        response = client.chat.completions.create(
            model="gpt-3.5-turbo-0125",
            messages=[
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": user_prompt},
            ],
            response_format={"type": "json_object"},
            temperature=0.7,  # Moderate temperature for creative but practical recommendations
        )

        content = response.choices[0].message.content
        adventure_data = json.loads(content)

        # Validate required fields
        required_fields = [
            "title",
            "description",
            "itinerary",
            "route",
            "weather_forecast",
            "packing_list",
            "recommendations",
            "estimated_cost",
            "difficulty_level",
        ]
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

        # Generate image using our free image service
        try:
            image_url = get_adventure_image(
                activity_type=activity_context,
                location=location,
                description=adventure_data.get("description", ""),
                title=adventure_data.get("title", ""),
            )
            adventure_data["image_url"] = image_url
        except Exception as e:
            print(f"Failed to get adventure image: {str(e)}")
            # Use a fallback image if service fails
            from adventure.services.image_service import unsplash_service

            adventure_data["image_url"] = unsplash_service.get_fallback_image()

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
                    "notes": "Great for morning photos and fresh air - completely free to enjoy",
                },
                {
                    "time": "10:30 AM",
                    "activity": "Explore nearby walking trails or interesting neighborhoods",
                    "location": f"Near {location}",
                    "duration": "1.5 hours",
                    "notes": "Take your time to discover hidden spots and public art",
                },
                {
                    "time": "12:00 PM",
                    "activity": "Find a scenic spot for a picnic break",
                    "location": f"Public space near {location}",
                    "duration": "1 hour",
                    "notes": "Bring your own food and enjoy the views",
                },
            ],
            "route": {
                "start_address": location,
                "end_address": location,
                "waypoints": [location],
                "map_embed_url": "https://www.google.com/maps/embed?pb=1!1m18!1m12!1m3!1d3024.1!2d0!3d0!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1",
                "estimated_distance": "2-5 km",
                "estimated_travel_time": "2-3 hours walking",
            },
            "weather_forecast": {
                "temperature": "20-25°C",
                "conditions": "Pleasant",
                "precipitation": "Low chance",
                "wind": "Light breeze",
                "uv_index": "Moderate",
                "best_time_outdoors": "Morning to afternoon",
            },
            "packing_list": {
                "essential": ["Comfortable walking shoes", "Water bottle", "Phone with camera"],
                "weather_specific": ["Light jacket or sweater", "Sunglasses", "Sun hat"],
                "optional": ["Backpack", "Portable phone charger", "Notebook for memories"],
                "food_and_drink": [
                    "Bring your own water bottle",
                    "Pack snacks from home",
                    "Extra water for longer walks",
                ],
            },
            "recommendations": {
                "photo_opportunities": [
                    "Scenic viewpoints",
                    "Interesting architecture",
                    "Public art and murals",
                ],
                "local_tips": [
                    "Check weather conditions before heading out",
                    "Start early to avoid crowds",
                    "Bring a camera to capture memories",
                    "Be open to spontaneous discoveries",
                ],
                "hidden_gems": [
                    "Local parks with great views",
                    "Historic neighborhoods",
                    "Public gardens and green spaces",
                ],
            },
            "estimated_cost": "FREE (bring your own food/water)",
            "difficulty_level": "easy",
            "best_season": "year-round",
            "accessibility": "Moderate walking required",
            "image_url": None,
        }
