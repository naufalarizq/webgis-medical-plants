from datetime import datetime
from pydantic import BaseModel, ConfigDict, Field
from typing import Optional, List, Any, Dict
from src.models import KategoriTanaman

class PlantBase(BaseModel):
    nama: str = Field(..., max_length=255)
    nama_latin: str = Field(..., max_length=255)
    kategori: KategoriTanaman
    lokasi: str = Field(..., max_length=255)
    skala: int
    jumlah: int
    foto_url: Optional[str] = None

class PlantCreate(PlantBase):
    lat: float
    lng: float

class PlantUpdate(BaseModel):
    nama: Optional[str] = Field(None, max_length=255)
    nama_latin: Optional[str] = Field(None, max_length=255)
    kategori: Optional[KategoriTanaman] = None
    lokasi: Optional[str] = Field(None, max_length=255)
    skala: Optional[int] = None
    jumlah: Optional[int] = None
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
