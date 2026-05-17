from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func
from typing import List, Optional
import json

from src.database import get_db
from src.models import Plant, PlantCategory
from src.schemas import PlantResponse

router = APIRouter(prefix="/api", tags=["public"])

@router.get("/plants", response_model=List[PlantResponse])
async def list_plants(
    category: Optional[PlantCategory] = None,
    location: Optional[str] = None,
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
    if category:
        stmt = stmt.where(Plant.category == category)
    if location:
        stmt = stmt.where(Plant.location == location)
    if search:
        stmt = stmt.where(Plant.name.ilike(f"%{search}%") | Plant.scientific_name.ilike(f"%{search}%"))
        
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
    category: Optional[PlantCategory] = None,
    location: Optional[str] = None,
    search: Optional[str] = None,
    db: AsyncSession = Depends(get_db)
):
    stmt = select(
        Plant,
        func.ST_AsGeoJSON(Plant.geom).label('geojson_geom')
    )
    if category:
        stmt = stmt.where(Plant.category == category)
    if location:
        stmt = stmt.where(Plant.location == location)
    if search:
        stmt = stmt.where(Plant.name.ilike(f"%{search}%") | Plant.scientific_name.ilike(f"%{search}%"))

    result = await db.execute(stmt)
    
    features = []
    for plant, geojson_geom in result.all():
        features.append({
            "type": "Feature",
            "geometry": json.loads(geojson_geom),
            "properties": {
                "id": plant.id,
                "name": plant.name,
                "scientific_name": plant.scientific_name,
                "category": plant.category,
                "location": plant.location,
                "image_url": plant.image_url
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
        select(Plant.category, func.count(Plant.id)).group_by(Plant.category)
    )
    by_category = {cat.value: count for cat, count in cat_result.all()}
    
    loc_result = await db.execute(
        select(Plant.location, func.count(Plant.id)).group_by(Plant.location)
    )
    by_location = {loc: count for loc, count in loc_result.all()}
    
    return {
        "total_plants": total_plants,
        "by_category": by_category,
        "by_location": by_location
    }
