import enum
from datetime import datetime
from sqlalchemy import Integer, String, Enum, DateTime, Boolean, func
from sqlalchemy.orm import Mapped, mapped_column
from geoalchemy2 import Geometry

from src.database import Base

class KategoriTanaman(str, enum.Enum):
    tanaman_hias = "tanaman_hias"
    tanaman_pangan = "tanaman_pangan"
    tanaman_herbal = "tanaman_herbal"
    tanaman_aromatik = "tanaman_aromatik"
    tanaman_pelindung = "tanaman_pelindung"

class Plant(Base):
    __tablename__ = "plants"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    nama: Mapped[str] = mapped_column(String(255), index=True)
    nama_latin: Mapped[str] = mapped_column(String(255), index=True)
    kategori: Mapped[KategoriTanaman] = mapped_column(Enum(KategoriTanaman))
    lokasi: Mapped[str] = mapped_column(String(255))
    skala: Mapped[int] = mapped_column(Integer)
    jumlah: Mapped[int] = mapped_column(Integer)
    foto_url: Mapped[str | None] = mapped_column(String(1024), nullable=True)
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
