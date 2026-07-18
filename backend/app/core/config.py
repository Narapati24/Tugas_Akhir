import os
from pydantic_settings import BaseSettings, SettingsConfigDict

class Settings(BaseSettings):
    PROJECT_NAME: str = "Napak Tilas MVP API"
    DATABASE_URL: str = "sqlite:///./napak_tilas.db"
    GEMINI_API_KEY: str = ""
    TESSERACT_CMD: str = r"C:\Program Files\Tesseract-OCR\tesseract.exe"

    model_config = SettingsConfigDict(env_file=".env")

settings = Settings()
