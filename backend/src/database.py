from sqlalchemy.ext.asyncio import async_sessionmaker, create_async_engine
from sqlalchemy.orm import DeclarativeBase

from src.settings import settings

engine = create_async_engine(url=settings.DB_URI)
async_factory = async_sessionmaker(bind=engine)


class Base(DeclarativeBase):
    pass
