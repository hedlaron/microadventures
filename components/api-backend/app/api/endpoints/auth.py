from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
import jwt
from app.core.security import authenticate_user, get_current_user, get_password_hash
from app.core.config import settings
from app.db.models import User, UserIn, UserOut, User_Pydantic

router = APIRouter()

@router.post("/token")
async def generate_token(form_data: OAuth2PasswordRequestForm = Depends()):
    user = await authenticate_user(form_data.username, form_data.password)
    if not user:
        raise HTTPException(status_code=401, detail="Invalid credentials")
    user_obj = await User_Pydantic.from_tortoise_orm(user)
    token = jwt.encode({"id": user.id, "username": user.username}, settings.jwt_secret)
    return {"access_token": token, "token_type": "bearer"}

@router.post("/users", response_model=UserOut)
async def create_user(user: UserIn):
    user_obj = User(username=user.username, password_hash=get_password_hash(user.password))
    await user_obj.save()
    return {"id": user_obj.id, "username": user_obj.username}

@router.get("/users/me")
async def get_user(user: User_Pydantic = Depends(get_current_user)):
    return user 