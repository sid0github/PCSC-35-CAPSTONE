from pydantic import BaseModel, Field
from typing import Optional, List
from datetime import datetime


# Input schemas
class URLInput(BaseModel):
    url: str = Field(..., description="URL of the news article")


class TextInput(BaseModel):
    text: str = Field(..., description="Raw text content")
    title: Optional[str] = None
    language: Optional[str] = None


class NewsArticleCreate(BaseModel):
    source_type: str
    source_url: Optional[str] = None
    source_file_name: Optional[str] = None
    title: Optional[str] = None
    content: str
    original_language: Optional[str] = None


# Output schemas
class NewsArticleResponse(BaseModel):
    id: int
    source_type: str
    source_url: Optional[str] = None
    title: Optional[str] = None
    content: str
    original_language: Optional[str] = None
    detected_language: Optional[str] = None
    translated_content: Optional[str] = None
    sentiment: Optional[str] = None
    sentiment_score: Optional[float] = None
    department: Optional[str] = None
    department_score: Optional[float] = None
    published_date: Optional[datetime] = None
    authors: Optional[List[str]] = None
    region: Optional[str] = None
    alert_triggered: bool = False
    created_at: datetime
    
    class Config:
        from_attributes = True


class AnalyticsResponse(BaseModel):
    total_articles: int
    sentiment_distribution: dict
    department_distribution: dict
    language_distribution: dict
    recent_alerts: int


class FilterParams(BaseModel):
    language: Optional[str] = None
    sentiment: Optional[str] = None
    department: Optional[str] = None
    start_date: Optional[datetime] = None
    end_date: Optional[datetime] = None
    limit: int = 50
    offset: int = 0
