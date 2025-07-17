from pydantic import BaseModel


class UserUpdate(BaseModel):
    """Schema for updating user information"""

    email: str | None = None
    username: str | None = None
    password: str | None = None
    is_active: bool | None = None
