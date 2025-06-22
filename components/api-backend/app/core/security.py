from fastapi.security import OAuth2PasswordBearer
from passlib.hash import bcrypt
import jwt
from fastapi import Depends, HTTPException, status
from app.core.config import settings
from app.db.models import User, User_Pydantic

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")

def verify_password(plain_password: str, hashed_password: str) -> bool:
    return bcrypt.verify(plain_password, hashed_password)

def get_password_hash(password: str) -> str:
    return bcrypt.hash(password)

async def get_current_user(token: str = Depends(oauth2_scheme)) -> User_Pydantic:
    try:
        payload = jwt.decode(token, settings.jwt_secret, algorithms=["HS256"])
        user = await User.get(id=payload.get("id"))
        return await User_Pydantic.from_tortoise_orm(user)
    except:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid credentials"
        )

async def authenticate_user(username: str, password: str):
    try:
        user = await User.get(username=username)
        if not user:
            return None
        if not verify_password(password, user.password_hash):
            return None
        return user
    except:
        return None 