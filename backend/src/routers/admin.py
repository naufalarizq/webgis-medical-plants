from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, Form, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, delete, func
from pydantic import BaseModel
from typing import List, Optional
import os
import shutil
import uuid

from src.database import get_db
from src.models import Plant, KategoriTanaman
from src.schemas import PlantResponse
from src.auth import get_current_username

router = APIRouter(prefix="/api/admin/plants", tags=["admin"])

STATIC_DIR = "static/images"
os.makedirs(STATIC_DIR, exist_ok=True)

class BulkDeleteRequest(BaseModel):
    ids: List[int]

@router.post("", response_model=PlantResponse, status_code=status.HTTP_201_CREATED)
async def create_plant(
    nama: str = Form(...),
    nama_latin: str = Form(...),
    kategori: KategoriTanaman = Form(...),
    lokasi: str = Form(...),
    skala: int = Form(...),
    jumlah: int = Form(...),
    lat: float = Form(...),
    lng: float = Form(...),
    foto: Optional[UploadFile] = File(None),
    current_user: str = Depends(get_current_username),
    db: AsyncSession = Depends(get_db)
):
    foto_url = None
    if foto:
        file_extension = foto.filename.split(".")[-1]
        file_name = f"{uuid.uuid4()}.{file_extension}"
        file_path = os.path.join(STATIC_DIR, file_name)
        with open(file_path, "wb") as buffer:
            shutil.copyfileobj(foto.file, buffer)
        foto_url = f"/{STATIC_DIR}/{file_name}"
        
    geom_wkt = f"SRID=4326;POINT({lng} {lat})"
    
    new_plant = Plant(
        nama=nama,
        nama_latin=nama_latin,
        kategori=kategori,
        lokasi=lokasi,
        skala=skala,
        jumlah=jumlah,
        foto_url=foto_url,
        geom=geom_wkt
    )
    
    db.add(new_plant)
    await db.commit()
    await db.refresh(new_plant)
    
    new_plant.lat = lat
    new_plant.lng = lng
    
    return new_plant

@router.put("/{plant_id}", response_model=PlantResponse)
async def update_plant(
    plant_id: int,
    nama: Optional[str] = Form(None),
    nama_latin: Optional[str] = Form(None),
    kategori: Optional[KategoriTanaman] = Form(None),
    lokasi: Optional[str] = Form(None),
    skala: Optional[int] = Form(None),
    jumlah: Optional[int] = Form(None),
    lat: Optional[float] = Form(None),
    lng: Optional[float] = Form(None),
    foto: Optional[UploadFile] = File(None),
    current_user: str = Depends(get_current_username),
    db: AsyncSession = Depends(get_db)
):
    result = await db.execute(select(Plant).where(Plant.id == plant_id))
    plant = result.scalar_one_or_none()
    if not plant:
        raise HTTPException(status_code=404, detail="Plant not found")
        
    if foto:
        file_extension = foto.filename.split(".")[-1]
        file_name = f"{uuid.uuid4()}.{file_extension}"
        file_path = os.path.join(STATIC_DIR, file_name)
        with open(file_path, "wb") as buffer:
            shutil.copyfileobj(foto.file, buffer)
        plant.foto_url = f"/{STATIC_DIR}/{file_name}"
        
    if nama is not None: plant.nama = nama
    if nama_latin is not None: plant.nama_latin = nama_latin
    if kategori is not None: plant.kategori = kategori
    if lokasi is not None: plant.lokasi = lokasi
    if skala is not None: plant.skala = skala
    if jumlah is not None: plant.jumlah = jumlah
    
    if lat is not None and lng is not None:
        plant.geom = f"SRID=4326;POINT({lng} {lat})"
    
    await db.commit()
    await db.refresh(plant)
    
    stmt = select(func.ST_Y(Plant.geom).label('lat'), func.ST_X(Plant.geom).label('lng')).where(Plant.id == plant_id)
    coords = await db.execute(stmt)
    y, x = coords.first()
    plant.lat = y
    plant.lng = x
    
    return plant

@router.delete("/{plant_id}")
async def delete_plant(
    plant_id: int,
    current_user: str = Depends(get_current_username),
    db: AsyncSession = Depends(get_db)
):
    result = await db.execute(select(Plant).where(Plant.id == plant_id))
    plant = result.scalar_one_or_none()
    if not plant:
        raise HTTPException(status_code=404, detail="Plant not found")
        
    await db.delete(plant)
    await db.commit()
    return {"message": "Plant deleted successfully"}

@router.post("/bulk-delete")
async def bulk_delete_plants(
    request: BulkDeleteRequest,
    current_user: str = Depends(get_current_username),
    db: AsyncSession = Depends(get_db)
):
    await db.execute(delete(Plant).where(Plant.id.in_(request.ids)))
    await db.commit()
    return {"message": f"{len(request.ids)} plants deleted successfully"}
