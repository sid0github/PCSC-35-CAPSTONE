from pydantic_settings import BaseSettings
from functools import lru_cache


class Settings(BaseSettings):
    # Database
    DATABASE_URL: str = "postgresql://username:password@localhost:5432/news_feedback_db"
    
    # Email
    SMTP_HOST: str = "smtp.gmail.com"
    SMTP_PORT: int = 587
    SMTP_USERNAME: str = ""
    SMTP_PASSWORD: str = ""
    ALERT_EMAIL_FROM: str = ""
    ALERT_EMAIL_TO: str = ""
    
    # Application
    APP_NAME: str = "AI News Feedback System"
    DEBUG: bool = True
    API_HOST: str = "0.0.0.0"
    API_PORT: int = 8000
    
    # Model Paths
    SENTIMENT_MODEL_PATH: str = "app/models/sentiment_model"
    DEPARTMENT_MODEL_PATH: str = "app/models/department_model"
    SENTIMENT_LABEL_ENCODER_PATH: str = "app/models/sentiment_label_encoder.pkl"
    DEPARTMENT_LABEL_ENCODER_PATH: str = "app/models/label_encoder (1).pkl"
    
    # Tesseract
    TESSERACT_CMD: str = ""
    
    # Translation
    GROQ_API_KEY: str = ""
    
    class Config:
        env_file = ".env"
        case_sensitive = True


@lru_cache()
def get_settings() -> Settings:
    return Settings()
