import os
import shutil
import uuid
from typing import Annotated

from fastapi import APIRouter, Depends, File, Form, HTTPException, UploadFile, status
from pydantic import BaseModel
from sqlalchemy import delete, func, select
from sqlalchemy.ext.asyncio import AsyncSession

from src.auth import get_current_username
from src.database import get_db
from src.models import Plant, PlantCategory
from src.schemas import PlantResponse
from src.settings import settings

router = APIRouter(prefix="/api/admin/plants", tags=["admin"])

STATIC_DIR = "static/images"
os.makedirs(STATIC_DIR, exist_ok=True)


class BulkDeleteRequest(BaseModel):
    ids: list[int]


def validate_image(photo: UploadFile):
    ALLOWED_EXTENSIONS = {"jpg", "jpeg", "png", "webp"}
    MAX_FILE_SIZE_MB = 5

    ext = photo.filename.split(".")[-1].lower()
    if ext not in ALLOWED_EXTENSIONS:
        raise HTTPException(
            400, detail=f"File type '.{ext}' not allowed. Use: {ALLOWED_EXTENSIONS}"
        )
    photo.file.seek(0, 2)
    size_mb = photo.file.tell() / (1024 * 1024)
    photo.file.seek(0)  # reset
    if size_mb > MAX_FILE_SIZE_MB:
        raise HTTPException(400, detail=f"File too large. Max {MAX_FILE_SIZE_MB}MB")


@router.post("", response_model=PlantResponse, status_code=status.HTTP_201_CREATED)
async def create_plant(
    name: Annotated[str, Form()],
    scientific_name: Annotated[str, Form()],
    category: Annotated[PlantCategory, Form()],
    location: Annotated[str, Form()],
    scale: Annotated[int, Form()],
    quantity: Annotated[int, Form()],
    lat: Annotated[float, Form()],
    lng: Annotated[float, Form()],
    _current_user: Annotated[str, Depends(get_current_username)],
    db: Annotated[AsyncSession, Depends(get_db)],
    photo: Annotated[UploadFile | None, File()] = None,
):
    image_url = None
    if photo:
        validate_image(photo)
        file_extension = photo.filename.split(".")[-1]
        file_name = f"{uuid.uuid4()}.{file_extension}"
        file_path = os.path.join(STATIC_DIR, file_name)
        with open(file_path, "wb") as buffer:
            shutil.copyfileobj(photo.file, buffer)
        image_url = f"{settings.BASE_URL}/{STATIC_DIR}/{file_name}"

    geom_wkt = f"SRID=4326;POINT({lng} {lat})"

    new_plant = Plant(
        name=name,
        scientific_name=scientific_name,
        category=category,
        location=location,
        scale=scale,
        quantity=quantity,
        image_url=image_url,
        geom=geom_wkt,
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
    _current_user: Annotated[str, Depends(get_current_username)],
    db: Annotated[AsyncSession, Depends(get_db)],
    name: Annotated[str | None, Form()] = None,
    scientific_name: Annotated[str | None, Form()] = None,
    category: Annotated[PlantCategory | None, Form()] = None,
    location: Annotated[str | None, Form()] = None,
    scale: Annotated[int | None, Form()] = None,
    quantity: Annotated[int | None, Form()] = None,
    lat: Annotated[float | None, Form()] = None,
    lng: Annotated[float | None, Form()] = None,
    photo: Annotated[UploadFile | None, File()] = None,
):
    result = await db.execute(select(Plant).where(Plant.id == plant_id))
    plant = result.scalar_one_or_none()
    if not plant:
        raise HTTPException(status_code=404, detail="Plant not found")

    if photo:
        validate_image(photo)
        file_extension = photo.filename.split(".")[-1]
        file_name = f"{uuid.uuid4()}.{file_extension}"
        file_path = os.path.join(STATIC_DIR, file_name)
        with open(file_path, "wb") as buffer:
            shutil.copyfileobj(photo.file, buffer)
        plant.image_url = f"{settings.BASE_URL}/{STATIC_DIR}/{file_name}"

    if name is not None:
        plant.name = name
    if scientific_name is not None:
        plant.scientific_name = scientific_name
    if category is not None:
        plant.category = category
    if location is not None:
        plant.location = location
    if scale is not None:
        plant.scale = scale
    if quantity is not None:
        plant.quantity = quantity

    if lat is not None and lng is not None:
        plant.geom = f"SRID=4326;POINT({lng} {lat})"

    await db.commit()
    await db.refresh(plant)

    stmt = select(
        func.ST_Y(Plant.geom).label("lat"), func.ST_X(Plant.geom).label("lng")
    ).where(Plant.id == plant_id)
    coords = await db.execute(stmt)
    y, x = coords.first()
    plant.lat = y
    plant.lng = x

    return plant


@router.delete("/{plant_id}")
async def delete_plant(
    plant_id: int,
    _current_user: Annotated[str, Depends(get_current_username)],
    db: Annotated[AsyncSession, Depends(get_db)],
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
    _current_user: Annotated[str, Depends(get_current_username)],
    db: Annotated[AsyncSession, Depends(get_db)],
):
    await db.execute(delete(Plant).where(Plant.id.in_(request.ids)))
    await db.commit()
    return {"message": f"{len(request.ids)} plants deleted successfully"}
