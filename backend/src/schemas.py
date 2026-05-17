from datetime import datetime
from pydantic import BaseModel, ConfigDict, Field
from typing import Optional, List, Any, Dict
from src.models import PlantCategory

class PlantBase(BaseModel):
    name: str = Field(..., max_length=255)
    scientific_name: str = Field(..., max_length=255)
    category: PlantCategory
    location: str = Field(..., max_length=255)
    scale: int
    quantity: int
    image_url: Optional[str] = None

class PlantCreate(PlantBase):
    lat: float
    lng: float

class PlantUpdate(BaseModel):
    name: Optional[str] = Field(None, max_length=255)
    scientific_name: Optional[str] = Field(None, max_length=255)
    category: Optional[PlantCategory] = None
    location: Optional[str] = Field(None, max_length=255)
    scale: Optional[int] = None
    quantity: Optional[int] = None
    lat: Optional[float] = None
    lng: Optional[float] = None

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
    username: Optional[str] = None
