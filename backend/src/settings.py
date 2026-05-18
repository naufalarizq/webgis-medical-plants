from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(
        env_file=".env", extra="ignore", env_file_encoding="utf-8"
    )

    DB_URI: str
    JWT_SECRET_KEY: str
    ACCESS_TOKEN_EXPIRE_HOURS: int
    CORS_ORIGINS: list[str] = ["http://localhost:5173"]


settings = Settings()  # pyright: ignore[reportCallIssue]
