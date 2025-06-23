from fastapi import HTTPException
import os
from dotenv import load_dotenv, find_dotenv

load_dotenv(find_dotenv())


def authenticate_and_get_user_details(request):
    try:
        request_state = clerk_sdk.authenticate_request(
            request,
            AuthenticateRequestOptions(
                authorized_parties=["http://localhost:5173", "http://localhost:5174"], #TODO add others
                jwt_key=os.getenv("JWT_KEY")
            )
        )
        if not request_state.is_signed_in:
            raise HTTPException(status_code=401, detail="Invalid token")

        user_id = request_state.payload.get("sub")

        return {"user_id": user_id}

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
