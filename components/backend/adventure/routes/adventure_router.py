from datetime import UTC

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from adventure.schemas.adventure import (
    AdventureHistoryResponse,
    AdventureQuotaResponse,
    AdventureRecommendations,
    AdventureRequest,
    AdventureResponse,
    ItineraryItem,
    PackingList,
    PublicAdventureResponse,
    RouteInfo,
    ShareAdventureRequest,
    ShareAdventureResponse,
    WeatherForecast,
)
from adventure.services.adventure_domain_service import adventure_domain_service
from adventure.services.adventure_service import (
    create_adventure_quota,
    get_adventure_quota,
    get_public_adventure_by_token,
    get_user_adventures,
    reset_quota_if_needed,
    toggle_adventure_sharing,
)
from auth.services.auth_service import get_current_active_user
from core.database import get_db
from user.models.user import User

router = APIRouter(prefix="/adventures", tags=["Adventures"])


@router.post(
    "/generate",
    response_model=AdventureResponse,
    summary="Generate personalized microadventure recommendations",
)
async def generate_adventure(
    request: AdventureRequest,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db),
) -> AdventureResponse:
    """
    Generate personalized microadventure recommendations using AI.

    - **location**: Starting location for the adventure
    - **destination**: Optional destination (if not provided, recommendations will be around the starting location)
    - **duration**: Duration of the adventure (few-hours, half-day, full-day, few-days)
    - **activity_type**: Type of activity or 'surprise-me' for AI to choose
    - **is_round_trip**: Whether this should be a round trip adventure
    - **custom_activity**: Custom activity description if activity_type is 'custom'

    Each user has a daily quota of adventure recommendations they can generate.
    """
    try:
        # Use domain service for complete business logic
        new_adventure = adventure_domain_service.generate_adventure_for_user(
            db, current_user.id, request
        )

        return AdventureResponse(
            id=new_adventure.id,
            title=new_adventure.title,
            description=new_adventure.description,
            image_url=new_adventure.image_url,
            location=new_adventure.location,
            destination=new_adventure.destination,
            duration=new_adventure.duration,
            activity_type=new_adventure.activity_type,
            is_round_trip=new_adventure.is_round_trip,
            itinerary=[ItineraryItem(**item) for item in new_adventure.itinerary],
            route=RouteInfo(**new_adventure.route),
            weather_forecast=WeatherForecast(**new_adventure.weather_forecast),
            packing_list=PackingList(**new_adventure.packing_list),
            recommendations=AdventureRecommendations(**new_adventure.recommendations),
            estimated_cost=new_adventure.estimated_cost,
            difficulty_level=new_adventure.difficulty_level,
            best_season=new_adventure.best_season,
            accessibility=new_adventure.accessibility,
            created_at=new_adventure.created_at,
        )

    except ValueError as e:
        if "quota exhausted" in str(e):
            raise HTTPException(status_code=status.HTTP_429_TOO_MANY_REQUESTS, detail=str(e)) from e
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(e)) from e
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to generate adventure recommendations: {str(e)}",
        ) from e


@router.get(
    "/my-history", response_model=AdventureHistoryResponse, summary="Get user's adventure history"
)
async def get_my_history(
    current_user: User = Depends(get_current_active_user), db: Session = Depends(get_db)
) -> AdventureHistoryResponse:
    """
    Get the current user's adventure recommendation history.
    """
    try:
        adventures = get_user_adventures(db, current_user.id)

        adventure_responses = []
        for adventure in adventures:
            try:
                # Handle itinerary conversion
                itinerary_items = []
                if adventure.itinerary:
                    for item in adventure.itinerary:
                        if isinstance(item, dict):
                            itinerary_items.append(ItineraryItem(**item))
                        else:
                            itinerary_items.append(item)

                # Handle route conversion
                route_info = None
                if adventure.route:
                    if isinstance(adventure.route, dict):
                        route_info = RouteInfo(**adventure.route)
                    else:
                        route_info = adventure.route

                # Handle weather forecast conversion
                weather_forecast = None
                if adventure.weather_forecast:
                    if isinstance(adventure.weather_forecast, dict):
                        weather_forecast = WeatherForecast(**adventure.weather_forecast)
                    else:
                        weather_forecast = adventure.weather_forecast

                # Handle packing list conversion
                packing_list = None
                if adventure.packing_list:
                    if isinstance(adventure.packing_list, dict):
                        packing_list = PackingList(**adventure.packing_list)
                    else:
                        packing_list = adventure.packing_list

                # Handle recommendations conversion
                recommendations = None
                if adventure.recommendations:
                    if isinstance(adventure.recommendations, dict):
                        recommendations = AdventureRecommendations(**adventure.recommendations)
                    else:
                        recommendations = adventure.recommendations

                adventure_response = AdventureResponse(
                    id=adventure.id,
                    title=adventure.title,
                    description=adventure.description,
                    image_url=adventure.image_url,
                    location=adventure.location,
                    destination=adventure.destination,
                    duration=adventure.duration,
                    activity_type=adventure.activity_type,
                    is_round_trip=adventure.is_round_trip,
                    itinerary=itinerary_items,
                    route=route_info,
                    weather_forecast=weather_forecast,
                    packing_list=packing_list,
                    recommendations=recommendations,
                    estimated_cost=adventure.estimated_cost,
                    difficulty_level=adventure.difficulty_level,
                    best_season=adventure.best_season,
                    accessibility=adventure.accessibility,
                    # Include sharing fields
                    is_public=getattr(adventure, "is_public", False),
                    share_token=getattr(adventure, "share_token", None),
                    shared_at=getattr(adventure, "shared_at", None),
                    created_at=adventure.created_at,
                )
                adventure_responses.append(adventure_response)
            except Exception as e:
                # Skip this adventure if there's a conversion error and log it
                print(f"Error converting adventure {adventure.id}: {str(e)}")
                continue

        return AdventureHistoryResponse(adventures=adventure_responses)

    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to fetch adventure history: {str(e)}",
        ) from e


@router.get(
    "/quota", response_model=AdventureQuotaResponse, summary="Get user's adventure generation quota"
)
async def get_quota(
    current_user: User = Depends(get_current_active_user), db: Session = Depends(get_db)
) -> AdventureQuotaResponse:
    """
    Get the current user's adventure generation quota status.
    """
    try:
        quota = get_adventure_quota(db, current_user.id)
        if not quota:
            quota = create_adventure_quota(db, current_user.id)

        # Reset quota if needed
        quota = reset_quota_if_needed(db, quota)

        # Calculate reset time (24 hours from last reset)
        from datetime import datetime, timedelta

        # Ensure last_reset_date is timezone-aware
        last_reset = quota.last_reset_date
        if last_reset.tzinfo is None:
            last_reset = last_reset.replace(tzinfo=UTC)

        reset_time = last_reset + timedelta(hours=24)
        now = datetime.now(UTC)
        time_until_reset = max(0, int((reset_time - now).total_seconds()))

        return AdventureQuotaResponse(
            adventures_remaining=quota.quota_remaining,
            total_quota=10,  # Default quota per day
            reset_time=reset_time,
            time_until_reset=time_until_reset,
        )

    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to fetch quota information: {str(e)}",
        ) from e


@router.post(
    "/{adventure_id}/share",
    response_model=ShareAdventureResponse,
    summary="Toggle public sharing for an adventure",
)
async def share_adventure(
    adventure_id: int,
    share_request: ShareAdventureRequest,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db),
) -> ShareAdventureResponse:
    """
    Toggle public sharing for an adventure. When enabled, generates a public share URL.
    """
    try:
        adventure = toggle_adventure_sharing(
            db, adventure_id, current_user.id, share_request.make_public
        )

        if not adventure:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Adventure not found or you don't have permission to modify it",
            )

        share_url = None
        message = "Adventure sharing disabled"

        if adventure.is_public and adventure.share_token:
            # In production, this would be your actual domain
            share_url = f"/shared/{adventure.share_token}"
            message = "Adventure is now publicly shareable"

        return ShareAdventureResponse(success=True, share_url=share_url, message=message)

    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to update sharing settings: {str(e)}",
        ) from e


@router.get(
    "/shared/{share_token}",
    response_model=PublicAdventureResponse,
    summary="Get a publicly shared adventure",
)
async def get_shared_adventure(
    share_token: str, db: Session = Depends(get_db)
) -> PublicAdventureResponse:
    """
    Get a publicly shared adventure by its share token. No authentication required.
    """
    try:
        adventure = get_public_adventure_by_token(db, share_token)

        if not adventure:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Shared adventure not found or no longer public",
            )

        # Convert to public response (excludes private information)
        return PublicAdventureResponse(
            id=adventure.id,
            title=adventure.title,
            description=adventure.description,
            image_url=adventure.image_url,
            location=adventure.location,
            destination=adventure.destination,
            duration=adventure.duration,
            activity_type=adventure.activity_type,
            is_round_trip=adventure.is_round_trip,
            itinerary=(
                [
                    ItineraryItem(**item) if isinstance(item, dict) else item
                    for item in adventure.itinerary
                ]
                if adventure.itinerary
                else []
            ),
            route=RouteInfo(**adventure.route) if adventure.route else None,
            weather_forecast=(
                WeatherForecast(**adventure.weather_forecast)
                if adventure.weather_forecast
                else None
            ),
            packing_list=PackingList(**adventure.packing_list) if adventure.packing_list else None,
            recommendations=(
                AdventureRecommendations(**adventure.recommendations)
                if adventure.recommendations
                else None
            ),
            estimated_cost=adventure.estimated_cost,
            difficulty_level=adventure.difficulty_level,
            best_season=adventure.best_season,
            accessibility=adventure.accessibility,
            created_at=adventure.created_at,
            shared_at=adventure.shared_at,
        )

    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to fetch shared adventure: {str(e)}",
        ) from e
