from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from auth.services.auth_service import get_current_active_user
from core.database import get_db
from user.models.user import User
from user.schemas.user import UserCreate, UserSchema
from user.services.user_service import create_user, delete_user, get_user, get_users

user_router = APIRouter(prefix="/users", tags=["Users"])


@user_router.get("/", response_model=list[UserSchema])
def user_list(db: Session = Depends(get_db), current_user: User = Depends(get_current_active_user)):
    db_users = get_users(db)

    return db_users


@user_router.get("/me", response_model=UserSchema)
def get_current_user_profile(current_user: User = Depends(get_current_active_user)):
    return current_user


@user_router.get("/{user_id}", response_model=UserSchema)
def user_detail(
    user_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user),
):
    db_user = get_user(db, user_id)
    if db_user is None:
        raise HTTPException(status_code=404, detail="User not found")

    return db_user


@user_router.delete("/{user_id}")
def user_delete(
    user_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user),
):
    db_user = get_user(db, user_id)
    if db_user is None:
        raise HTTPException(status_code=404, detail="User not found")

    delete_user(db, db_user.id)
    return {"message": "User deleted"}


@user_router.post("/register", response_model=UserSchema)
def user_register(user: UserCreate, db: Session = Depends(get_db)):
    try:
        return create_user(db, user)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e)) from e
