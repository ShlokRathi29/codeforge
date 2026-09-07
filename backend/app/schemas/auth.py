from datetime import datetime
from typing import Optional
from pydantic import BaseModel, ConfigDict, Field


class UserResponse(BaseModel):
    id: str
    email: str
    name: Optional[str] = None
    picture: Optional[str] = None
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)


class GoogleTokenVerifyRequest(BaseModel):
    credential: Optional[str] = Field(None, description="Google Identity Services credential / ID token")
    token: Optional[str] = Field(None, description="Alias for credential")


class AuthResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: UserResponse


class GoogleConfigResponse(BaseModel):
    client_id: Optional[str] = None
    auth_uri: str = "https://accounts.google.com/o/oauth2/auth"
    redirect_uri: Optional[str] = None


class GoogleAuthUrlResponse(BaseModel):
    url: str
