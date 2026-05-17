from sqlalchemy.ext.asyncio import async_sessionmaker, create_async_engine, AsyncSession
from sqlalchemy.orm import DeclarativeBase

from src.settings import settings

engine = create_async_engine(url=settings.DB_URI)
async_factory = async_sessionmaker(bind=engine, expire_on_commit=False)


class Base(DeclarativeBase):
    pass

async def get_db():
    async with async_factory() as session:
        yield session
