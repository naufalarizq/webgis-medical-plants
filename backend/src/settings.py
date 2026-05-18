from typing import Annotated

from pydantic import BeforeValidator
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(
        env_file=".env", extra="ignore", env_file_encoding="utf-8"
    )

    DB_URI: str
    JWT_SECRET_KEY: str
    ACCESS_TOKEN_EXPIRE_HOURS: int
    CORS_ORIGINS: Annotated[
        list[str],
        BeforeValidator(
            lambda v: (
                v
                if not isinstance(v, str)
                else [v.strip() for x in v.split(";") if x.strip()]
            )
        ),
    ]


settings = Settings()  # pyright: ignore[reportCallIssue]
