from datetime import datetime
from typing import Annotated

from pydantic import BaseModel, ConfigDict, Field

from src.models import PlantCategory


class PlantBase(BaseModel):
    name: Annotated[str, Field(max_length=255)]
    scientific_name: Annotated[str, Field(max_length=255)]
    category: PlantCategory
    location: Annotated[str, Field(max_length=255)]
    scale: int
    quantity: int
    image_url: str | None = None


class PlantCreate(PlantBase):
    lat: float
    lng: float


class PlantUpdate(BaseModel):
    name: Annotated[str | None, Field(max_length=255)] = None
    scientific_name: Annotated[str | None, Field(max_length=255)] = None
    category: PlantCategory | None = None
    location: Annotated[str | None, Field(max_length=255)] = None
    scale: int | None = None
    quantity: int | None = None
    lat: float | None = None
    lng: float | None = None


class PlantResponse(PlantBase):
    id: int
    lat: float
    lng: float
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)


class AdminUserBase(BaseModel):
    username: str
    email: str


class AdminUserCreate(AdminUserBase):
    password: str


class AdminUserResponse(AdminUserBase):
    id: int
    is_active: bool
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)


class Token(BaseModel):
    access_token: str
    token_type: str


class TokenData(BaseModel):
    username: str | None = None
