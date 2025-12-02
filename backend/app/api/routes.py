from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, Form, Query
from sqlalchemy.orm import Session
from sqlalchemy import func, and_
from typing import List, Optional
from datetime import datetime, timedelta
import logging

from app.database import get_db
from app.schemas import (
    URLInput, TextInput, NewsArticleResponse,
    AnalyticsResponse, FilterParams
)
from app.models.db_models import NewsArticle, AlertHistory
from app.services.processing_pipeline import news_pipeline

logger = logging.getLogger(__name__)
router = APIRouter(prefix="/api", tags=["news"])


@router.post("/submit/url", response_model=NewsArticleResponse)
async def submit_url(
    url_input: URLInput,
    db: Session = Depends(get_db)
):
    """
    Submit a news article URL for processing
    """
    try:
        article = await news_pipeline.process_url(url_input.url, db)
        return article
    except Exception as e:
        logger.error(f"Error processing URL: {e}")
        raise HTTPException(status_code=500, detail=f"Failed to process URL: {str(e)}")


@router.post("/submit/text", response_model=NewsArticleResponse)
async def submit_text(
    text_input: TextInput,
    db: Session = Depends(get_db)
):
    """
    Submit raw text for processing
    """
    try:
        article = await news_pipeline.process_text(
            text=text_input.text,
            title=text_input.title,
            db=db
        )
        return article
    except Exception as e:
        logger.error(f"Error processing text: {e}")
        raise HTTPException(status_code=500, detail=f"Failed to process text: {str(e)}")


@router.post("/submit/pdf", response_model=NewsArticleResponse)
async def submit_pdf(
    file: UploadFile = File(...),
    language: str = Form('eng'),
    db: Session = Depends(get_db)
):
    """
    Submit a PDF file for processing
    Supported languages: eng, hin, kan, tam, tel, mar, etc.
    """
    try:
        # Validate file type
        if not file.filename.lower().endswith('.pdf'):
            raise HTTPException(status_code=400, detail="Only PDF files are allowed")
        
        # Read file content
        pdf_bytes = await file.read()
        
        # Process PDF
        article = await news_pipeline.process_pdf(
            pdf_bytes=pdf_bytes,
            filename=file.filename,
            db=db,
            language=language
        )
        
        return article
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error processing PDF: {e}")
        raise HTTPException(status_code=500, detail=f"Failed to process PDF: {str(e)}")


@router.post("/submit/image", response_model=NewsArticleResponse)
async def submit_image(
    file: UploadFile = File(...),
    language: str = Form('eng'),
    db: Session = Depends(get_db)
):
    """
    Submit an image file for OCR and processing
    Supported formats: jpg, jpeg, png, bmp, tiff
    Supported languages: eng, hin, kan, tam, tel, mar, etc.
    """
    try:
        # Validate file type
        allowed_extensions = ['.jpg', '.jpeg', '.png', '.bmp', '.tiff', '.tif']
        if not any(file.filename.lower().endswith(ext) for ext in allowed_extensions):
            raise HTTPException(
                status_code=400, 
                detail=f"Only image files are allowed: {', '.join(allowed_extensions)}"
            )
        
        # Read file content
        image_bytes = await file.read()
        
        # Process image
        article = await news_pipeline.process_image(
            image_bytes=image_bytes,
            filename=file.filename,
            db=db,
            language=language
        )
        
        return article
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error processing image: {e}")
        raise HTTPException(status_code=500, detail=f"Failed to process image: {str(e)}")


@router.get("/news", response_model=List[NewsArticleResponse])
def get_news(
    language: Optional[str] = Query(None),
    sentiment: Optional[str] = Query(None),
    department: Optional[str] = Query(None),
    start_date: Optional[datetime] = Query(None),
    end_date: Optional[datetime] = Query(None),
    limit: int = Query(50, le=100),
    offset: int = Query(0),
    db: Session = Depends(get_db)
):
    """
    Get news articles with optional filters
    """
    try:
        query = db.query(NewsArticle)
        
        # Apply filters
        if language:
            query = query.filter(NewsArticle.detected_language == language)
        
        if sentiment:
            query = query.filter(NewsArticle.sentiment == sentiment)
        
        if department:
            query = query.filter(NewsArticle.department == department)
        
        if start_date:
            query = query.filter(NewsArticle.created_at >= start_date)
        
        if end_date:
            query = query.filter(NewsArticle.created_at <= end_date)
        
        # Order by newest first
        query = query.order_by(NewsArticle.created_at.desc())
        
        # Pagination
        articles = query.offset(offset).limit(limit).all()
        
        return articles
        
    except Exception as e:
        logger.error(f"Error fetching news: {e}")
        raise HTTPException(status_code=500, detail=f"Failed to fetch news: {str(e)}")


@router.get("/news/{article_id}", response_model=NewsArticleResponse)
def get_article(
    article_id: int,
    db: Session = Depends(get_db)
):
    """
    Get a specific article by ID
    """
    article = db.query(NewsArticle).filter(NewsArticle.id == article_id).first()
    
    if not article:
        raise HTTPException(status_code=404, detail="Article not found")
    
    return article


@router.get("/analytics", response_model=AnalyticsResponse)
def get_analytics(
    days: int = Query(30, description="Number of days to analyze"),
    db: Session = Depends(get_db)
):
    """
    Get analytics: sentiment distribution, department distribution, etc.
    """
    try:
        # Calculate date range
        start_date = datetime.now() - timedelta(days=days)
        
        # Total articles
        total_articles = db.query(NewsArticle).filter(
            NewsArticle.created_at >= start_date
        ).count()
        
        # Sentiment distribution
        sentiment_data = db.query(
            NewsArticle.sentiment,
            func.count(NewsArticle.id)
        ).filter(
            NewsArticle.created_at >= start_date
        ).group_by(NewsArticle.sentiment).all()
        
        sentiment_distribution = {
            sentiment: count for sentiment, count in sentiment_data
        }
        
        # Department distribution
        department_data = db.query(
            NewsArticle.department,
            func.count(NewsArticle.id)
        ).filter(
            NewsArticle.created_at >= start_date
        ).group_by(NewsArticle.department).all()
        
        department_distribution = {
            dept: count for dept, count in department_data
        }
        
        # Language distribution
        language_data = db.query(
            NewsArticle.detected_language,
            func.count(NewsArticle.id)
        ).filter(
            NewsArticle.created_at >= start_date
        ).group_by(NewsArticle.detected_language).all()
        
        language_distribution = {
            lang: count for lang, count in language_data
        }
        
        # Recent alerts count
        recent_alerts = db.query(AlertHistory).filter(
            AlertHistory.sent_at >= start_date,
            AlertHistory.status == 'sent'
        ).count()
        
        return AnalyticsResponse(
            total_articles=total_articles,
            sentiment_distribution=sentiment_distribution,
            department_distribution=department_distribution,
            language_distribution=language_distribution,
            recent_alerts=recent_alerts
        )
        
    except Exception as e:
        logger.error(f"Error generating analytics: {e}")
        raise HTTPException(status_code=500, detail=f"Failed to generate analytics: {str(e)}")


@router.delete("/news/{article_id}")
def delete_article(
    article_id: int,
    db: Session = Depends(get_db)
):
    """
    Delete an article (admin function)
    """
    article = db.query(NewsArticle).filter(NewsArticle.id == article_id).first()
    
    if not article:
        raise HTTPException(status_code=404, detail="Article not found")
    
    db.delete(article)
    db.commit()
    
    return {"message": "Article deleted successfully"}
