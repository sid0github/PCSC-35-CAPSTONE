from newspaper import Article, ArticleException
from bs4 import BeautifulSoup
import requests
from typing import Dict, Optional
import logging
from datetime import datetime

logger = logging.getLogger(__name__)


class WebScraperService:
    """Service for extracting content from news URLs"""
    
    def __init__(self):
        self.headers = {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
        }
    
    def extract_from_url(self, url: str) -> Dict[str, any]:
        """
        Extract article content from URL using newspaper3k
        Returns: dict with title, content, authors, publish_date, etc.
        """
        try:
            # Try newspaper3k first (best for news articles)
            article = Article(url)
            article.download()
            article.parse()
            
            # Extract metadata
            result = {
                "title": article.title or "No title",
                "content": article.text or "",
                "authors": article.authors or [],
                "published_date": article.publish_date,
                "top_image": article.top_image,
                "source_url": url
            }
            
            # If content is empty, try BeautifulSoup fallback
            if not result["content"] or len(result["content"]) < 100:
                logger.warning(f"newspaper3k failed for {url}, trying BeautifulSoup")
                result = self._extract_with_bs4(url)
            
            logger.info(f"✓ Extracted article from {url}: {result['title'][:50]}")
            return result
            
        except ArticleException as e:
            logger.error(f"newspaper3k error for {url}: {e}")
            return self._extract_with_bs4(url)
        except Exception as e:
            logger.error(f"Error extracting from {url}: {e}")
            raise
    
    def _extract_with_bs4(self, url: str) -> Dict[str, any]:
        """
        Fallback method using BeautifulSoup for difficult websites
        """
        try:
            response = requests.get(url, headers=self.headers, timeout=10)
            response.raise_for_status()
            
            soup = BeautifulSoup(response.content, 'lxml')
            
            # Try to find title
            title = None
            if soup.find('h1'):
                title = soup.find('h1').get_text(strip=True)
            elif soup.find('title'):
                title = soup.find('title').get_text(strip=True)
            
            # Try to find main content
            content = ""
            
            # Look for common article containers
            article_tags = soup.find_all(['article', 'div'], class_=lambda x: x and any(
                keyword in str(x).lower() for keyword in ['article', 'content', 'story', 'post']
            ))
            
            if article_tags:
                # Get text from paragraphs
                paragraphs = article_tags[0].find_all('p')
                content = '\n'.join([p.get_text(strip=True) for p in paragraphs if len(p.get_text(strip=True)) > 20])
            else:
                # Fallback: get all paragraphs
                paragraphs = soup.find_all('p')
                content = '\n'.join([p.get_text(strip=True) for p in paragraphs if len(p.get_text(strip=True)) > 20])
            
            return {
                "title": title or "No title",
                "content": content or "No content extracted",
                "authors": [],
                "published_date": None,
                "top_image": None,
                "source_url": url
            }
            
        except Exception as e:
            logger.error(f"BeautifulSoup extraction failed for {url}: {e}")
            raise ValueError(f"Could not extract content from URL: {url}")


# Global instance
scraper_service = WebScraperService()
