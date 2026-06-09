import asyncio
import sys
from dataclasses import dataclass
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parents[1]))


@dataclass(frozen=True)
class PlantSeed:
    name: str
    scientific_name: str
    category: str
    location: str
    scale: int
    quantity: int
    lng: float
    lat: float
    image_url: str | None = None


PLANT_SEEDS = [
    PlantSeed(
        "Anggrek", "Orchidaceae", "ornamental", "CCR", 1, 35, 106.73112, -6.55599
    ),
    PlantSeed("Melati", "Jasminum", "ornamental", "CCR", 1, 42, 106.73103, -6.55612),
    PlantSeed("Kangkung", "Kangkung Sativa", "food", "CCR", 1, 78, 106.73095, -6.55601),
    PlantSeed("Kaktus", "Cactaceae", "ornamental", "CCR", 1, 15, 106.73108, -6.55605),
    PlantSeed(
        "Singkong", "Manihot esculenta", "food", "CCR", 1, 55, 106.73115, -6.55609
    ),
    PlantSeed("Jagung", "Zea mays", "food", "CCR", 1, 67, 106.73088, -6.55600),
    PlantSeed("Kopi", "Coffea", "shade", "CCR", 1, 23, 106.73101, -6.55615),
    PlantSeed("Teh", "Camellia sinensis", "shade", "CCR", 1, 89, 106.73091, -6.55607),
    PlantSeed("Jeruk", "Citrus", "food", "CCR", 1, 40, 106.73110, -6.55595),
    PlantSeed("Apel", "Malus domestica", "food", "CCR", 1, 12, 106.73120, -6.55610),
    PlantSeed("Pisang", "Musa", "food", "CCR", 1, 95, 106.73099, -6.55603),
    PlantSeed("Nanas", "Ananas comosus", "food", "CCR", 1, 50, 106.73105, -6.55608),
    PlantSeed(
        "Kentang", "Solanum tuberosum", "food", "CCR", 1, 33, 106.73102, -6.55618
    ),
    PlantSeed("Cabai", "Capsicum", "food", "CCR", 1, 60, 106.73113, -6.55602),
    PlantSeed("Bawang Merah", "Allium cepa", "food", "CCR", 1, 74, 106.73094, -6.55611),
    PlantSeed(
        "Bawang Putih", "Allium sativum", "food", "CCR", 1, 81, 106.73104, -6.55597
    ),
    PlantSeed("Kubis", "Brassica oleracea", "food", "CCR", 1, 29, 106.73107, -6.55606),
    PlantSeed("Padi", "Oryza sativa", "food", "FAPERTA", 1, 150, 106.73059, -6.55865),
    PlantSeed("Tomat", "Tomat sativa", "food", "FAHUTAN", 1, 88, 106.72904, -6.55718),
    PlantSeed("Mawar", "Rosa", "ornamental", "FMIPA", 1, 45, 106.73122, -6.55760),
    PlantSeed(
        "Lidah Buaya", "Aloe vera", "herbal", "FMIPA", 1, 110, 106.73130, -6.55755
    ),
    PlantSeed("Kelapa", "Cocos nucifera", "shade", "AHN", 1, 18, 106.72604, -6.56033),
    PlantSeed("Mangga", "Mangifera indica", "food", "BARA", 1, 25, 106.73181, -6.56044),
    PlantSeed(
        "Durian", "Durio zibethinus", "food", "GYMNAS", 1, 14, 106.73282, -6.55451
    ),
]


def point_ewkt(seed: PlantSeed) -> str:
    return f"SRID=4326;POINT({seed.lng} {seed.lat})"


async def seed_plants() -> tuple[int, int]:
    from sqlalchemy import func, select

    from src.database import async_factory
    from src.models import Plant, PlantCategory

    inserted_count = 0
    skipped_count = 0

    async with async_factory() as session:
        for seed in PLANT_SEEDS:
            existing_plant_id = await session.scalar(
                select(Plant.id).where(
                    Plant.name == seed.name,
                    Plant.location == seed.location,
                    func.ST_X(Plant.geom) == seed.lng,
                    func.ST_Y(Plant.geom) == seed.lat,
                )
            )
            if existing_plant_id is not None:
                skipped_count += 1
                continue

            session.add(
                Plant(
                    name=seed.name,
                    scientific_name=seed.scientific_name,
                    category=PlantCategory(seed.category),
                    location=seed.location,
                    scale=seed.scale,
                    quantity=seed.quantity,
                    image_url=seed.image_url,
                    geom=point_ewkt(seed),
                )
            )
            inserted_count += 1

        await session.commit()

    return inserted_count, skipped_count


async def main() -> None:
    from src.database import engine

    try:
        inserted_count, skipped_count = await seed_plants()
    finally:
        await engine.dispose()

    print(f"Inserted {inserted_count} plants, skipped {skipped_count} existing plants.")


if __name__ == "__main__":
    asyncio.run(main())
