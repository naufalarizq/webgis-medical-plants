import enum
from datetime import datetime
from sqlalchemy import Integer, String, Enum, DateTime, Boolean, func
from sqlalchemy.orm import Mapped, mapped_column
from geoalchemy2 import Geometry

from src.database import Base

class PlantCategory(str, enum.Enum):
    ornamental = "ornamental"
    food = "food"
    herbal = "herbal"
    aromatic = "aromatic"
    shade = "shade"

class Plant(Base):
    __tablename__ = "plants"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    name: Mapped[str] = mapped_column(String(255), index=True)
    scientific_name: Mapped[str] = mapped_column(String(255), index=True)
    category: Mapped[PlantCategory] = mapped_column(Enum(PlantCategory))
    location: Mapped[str] = mapped_column(String(255))
    scale: Mapped[int] = mapped_column(Integer)
    quantity: Mapped[int] = mapped_column(Integer)
    image_url: Mapped[str | None] = mapped_column(String(1024), nullable=True)
    geom = mapped_column(Geometry('POINT', srid=4326))
    
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now())
    updated_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())

class AdminUser(Base):
    __tablename__ = "admin_users"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    username: Mapped[str] = mapped_column(String(255), unique=True, index=True)
    email: Mapped[str] = mapped_column(String(255), unique=True, index=True)
    hashed_password: Mapped[str] = mapped_column(String(255))
    is_active: Mapped[bool] = mapped_column(Boolean, default=True)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now())
    updated_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())
