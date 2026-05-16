from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func
from typing import List, Optional
import json

from src.database import get_db
from src.models import Plant, KategoriTanaman
from src.schemas import PlantResponse

router = APIRouter(prefix="/api", tags=["public"])

@router.get("/plants", response_model=List[PlantResponse])
async def list_plants(
    kategori: Optional[KategoriTanaman] = None,
    lokasi: Optional[str] = None,
    search: Optional[str] = None,
    skip: int = Query(0, ge=0),
    limit: int = Query(100, ge=1, le=1000),
    db: AsyncSession = Depends(get_db)
):
    stmt = select(
        Plant,
        func.ST_Y(Plant.geom).label('lat'),
        func.ST_X(Plant.geom).label('lng')
    )
    if kategori:
        stmt = stmt.where(Plant.kategori == kategori)
    if lokasi:
        stmt = stmt.where(Plant.lokasi == lokasi)
    if search:
        stmt = stmt.where(Plant.nama.ilike(f"%{search}%") | Plant.nama_latin.ilike(f"%{search}%"))
        
    stmt = stmt.offset(skip).limit(limit)
    result = await db.execute(stmt)
    
    plants = []
    for plant, lat, lng in result.all():
        plant.lat = lat
        plant.lng = lng
        plants.append(plant)
        
    return plants

@router.get("/plants/geojson")
async def get_plants_geojson(
    kategori: Optional[KategoriTanaman] = None,
    lokasi: Optional[str] = None,
    search: Optional[str] = None,
    db: AsyncSession = Depends(get_db)
):
    stmt = select(
        Plant,
        func.ST_AsGeoJSON(Plant.geom).label('geojson_geom')
    )
    if kategori:
        stmt = stmt.where(Plant.kategori == kategori)
    if lokasi:
        stmt = stmt.where(Plant.lokasi == lokasi)
    if search:
        stmt = stmt.where(Plant.nama.ilike(f"%{search}%") | Plant.nama_latin.ilike(f"%{search}%"))

    result = await db.execute(stmt)
    
    features = []
    for plant, geojson_geom in result.all():
        features.append({
            "type": "Feature",
            "geometry": json.loads(geojson_geom),
            "properties": {
                "id": plant.id,
                "nama": plant.nama,
                "nama_latin": plant.nama_latin,
                "kategori": plant.kategori,
                "lokasi": plant.lokasi,
                "foto_url": plant.foto_url
            }
        })
        
    return {
        "type": "FeatureCollection",
        "features": features
    }

@router.get("/plants/{plant_id}", response_model=PlantResponse)
async def get_plant(plant_id: int, db: AsyncSession = Depends(get_db)):
    stmt = select(
        Plant,
        func.ST_Y(Plant.geom).label('lat'),
        func.ST_X(Plant.geom).label('lng')
    ).where(Plant.id == plant_id)
    
    result = await db.execute(stmt)
    row = result.first()
    if not row:
        raise HTTPException(status_code=404, detail="Plant not found")
        
    plant, lat, lng = row
    plant.lat = lat
    plant.lng = lng
    return plant

@router.get("/stats/summary")
async def get_stats_summary(db: AsyncSession = Depends(get_db)):
    total_result = await db.execute(select(func.count(Plant.id)))
    total_plants = total_result.scalar_one()
    
    cat_result = await db.execute(
        select(Plant.kategori, func.count(Plant.id)).group_by(Plant.kategori)
    )
    by_category = {cat.value: count for cat, count in cat_result.all()}
    
    loc_result = await db.execute(
        select(Plant.lokasi, func.count(Plant.id)).group_by(Plant.lokasi)
    )
    by_location = {loc: count for loc, count in loc_result.all()}
    
    return {
        "total_plants": total_plants,
        "by_category": by_category,
        "by_location": by_location
    }
