from sqlalchemy.orm import Session
from typing import Dict, Optional
import logging
from datetime import datetime

from app.models.db_models import NewsArticle, AlertHistory
from app.services.scraper_service import scraper_service
from app.services.ocr_service import ocr_service
from app.services.language_service import language_service
from app.services.ml_service import ml_service
from app.services.email_service import email_alert_service

logger = logging.getLogger(__name__)


class NewsProcessingPipeline:
    """
    Main pipeline for processing news from various sources:
    1. Extract content (URL/PDF/Text)
    2. Detect language
    3. Translate if needed
    4. Sentiment analysis
    5. Department classification
    6. Save to database
    7. Trigger alerts if negative
    """
    
    async def process_url(self, url: str, db: Session) -> NewsArticle:
        """Process news article from URL"""
        try:
            logger.info(f"Processing URL: {url}")
            
            # Step 1: Extract content
            extracted_data = scraper_service.extract_from_url(url)
            
            # Step 2: Process content
            article = await self._process_content(
                content=extracted_data['content'],
                title=extracted_data.get('title'),
                source_type='url',
                source_url=url,
                published_date=extracted_data.get('published_date'),
                authors=extracted_data.get('authors'),
                db=db
            )
            
            logger.info(f"✓ URL processed successfully: {article.id}")
            return article
            
        except Exception as e:
            logger.error(f"Error processing URL {url}: {e}")
            raise
    
    async def process_pdf(self, pdf_bytes: bytes, filename: str, db: Session, language: str = 'eng') -> NewsArticle:
        """Process news article from PDF file"""
        try:
            logger.info(f"Processing PDF: {filename}")
            
            # Step 1: Extract text using OCR
            ocr_result = ocr_service.extract_text_from_pdf_bytes(pdf_bytes, language)
            
            # Step 2: Process content
            article = await self._process_content(
                content=ocr_result['text'],
                title=filename,
                source_type='pdf',
                source_file_name=filename,
                db=db
            )
            
            logger.info(f"✓ PDF processed successfully: {article.id}")
            return article
            
        except Exception as e:
            logger.error(f"Error processing PDF {filename}: {e}")
            raise
    
    async def process_image(self, image_bytes: bytes, filename: str, db: Session, language: str = 'eng') -> NewsArticle:
        """Process news article from image file"""
        try:
            logger.info(f"Processing image: {filename}")
            
            # Step 1: Extract text using OCR
            extracted_text = ocr_service.extract_text_from_image_bytes(image_bytes, language)
            
            # Step 2: Process content
            article = await self._process_content(
                content=extracted_text,
                title=filename,
                source_type='image',
                source_file_name=filename,
                db=db
            )
            
            logger.info(f"✓ Image processed successfully: {article.id}")
            return article
            
        except Exception as e:
            logger.error(f"Error processing image {filename}: {e}")
            raise
    
    async def process_text(self, text: str, title: Optional[str], db: Session) -> NewsArticle:
        """Process raw text input"""
        try:
            logger.info("Processing text input")
            
            article = await self._process_content(
                content=text,
                title=title or "Text Input",
                source_type='text',
                db=db
            )
            
            logger.info(f"✓ Text processed successfully: {article.id}")
            return article
            
        except Exception as e:
            logger.error(f"Error processing text: {e}")
            raise
    
    async def _process_content(
        self,
        content: str,
        title: str,
        source_type: str,
        db: Session,
        source_url: Optional[str] = None,
        source_file_name: Optional[str] = None,
        published_date: Optional[datetime] = None,
        authors: Optional[list] = None
    ) -> NewsArticle:
        """
        Core processing logic for any content type
        """
        try:
            # Step 1: Detect language
            detected_lang = language_service.detect_language(content)
            
            # Step 2: Translate if needed
            translation_result = language_service.translate_to_english(content, detected_lang)
            translated_content = translation_result['translated_text']
            
            # Step 3: Run ML models (sentiment + department)
            # Use translated content if available, otherwise original
            analysis_text = translated_content if translation_result['translation_performed'] else content
            ml_results = ml_service.analyze_text(analysis_text)
            
            # Step 4: Create database record
            article = NewsArticle(
                source_type=source_type,
                source_url=source_url,
                source_file_name=source_file_name,
                title=title,
                content=content,
                original_language=detected_lang,
                detected_language=detected_lang,
                translated_content=translated_content if translation_result['translation_performed'] else None,
                sentiment=ml_results['sentiment'],
                sentiment_score=ml_results['sentiment_score'],
                department=ml_results['department'],
                department_score=ml_results['department_score'],
                published_date=published_date,
                authors=authors,
                alert_triggered=False
            )
            
            db.add(article)
            db.commit()
            db.refresh(article)
            
            # Step 5: Check if alert should be triggered (negative sentiment)
            if self._should_trigger_alert(ml_results['sentiment']):
                await self._trigger_alert(article, db)
            
            logger.info(f"✓ Article processed: ID={article.id}, Sentiment={article.sentiment}, Dept={article.department}")
            return article
            
        except Exception as e:
            db.rollback()
            logger.error(f"Error in content processing pipeline: {e}")
            raise
    
    def _should_trigger_alert(self, sentiment: str) -> bool:
        """Check if sentiment triggers an alert"""
        # Trigger on negative sentiment
        negative_sentiments = ['negative', 'neg', 'NEGATIVE']
        return sentiment.lower() in [s.lower() for s in negative_sentiments]
    
    async def _trigger_alert(self, article: NewsArticle, db: Session):
        """Send email alert for negative sentiment article"""
        try:
            logger.info(f"Triggering alert for article {article.id}")
            
            # Prepare article data for email
            article_data = {
                'id': article.id,
                'title': article.title,
                'content': article.content,
                'sentiment': article.sentiment,
                'sentiment_score': article.sentiment_score,
                'department': article.department,
                'source_url': article.source_url or '#',
                'detected_language': article.detected_language
            }
            
            # Send email
            success = await email_alert_service.send_alert(article_data)
            
            # Update article and create alert history
            if success:
                article.alert_triggered = True
                article.alert_sent_at = datetime.now()
                
                alert_record = AlertHistory(
                    article_id=article.id,
                    alert_type='email',
                    recipient=email_alert_service.to_email,
                    subject=f"Negative News Alert: {article.title[:100]}",
                    message=f"Sentiment: {article.sentiment}",
                    status='sent'
                )
                db.add(alert_record)
            else:
                alert_record = AlertHistory(
                    article_id=article.id,
                    alert_type='email',
                    recipient=email_alert_service.to_email,
                    subject=f"Negative News Alert: {article.title[:100]}",
                    message=f"Sentiment: {article.sentiment}",
                    status='failed',
                    error_message='Email sending failed'
                )
                db.add(alert_record)
            
            db.commit()
            
        except Exception as e:
            logger.error(f"Error triggering alert for article {article.id}: {e}")
            db.rollback()


# Global instance
news_pipeline = NewsProcessingPipeline()
