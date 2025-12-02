from langdetect import detect, LangDetectException
import logging
from typing import Optional, Dict, Any
import os
from groq import Groq
from app.config import get_settings
from transformers import pipeline
import torch
import re

logger = logging.getLogger(__name__)


class LanguageService:
    """Service for language detection and translation"""
    
    def __init__(self):
        # Mapping of langdetect codes to full language names
        self.language_map = {
            'en': 'English',
            'hi': 'Hindi',
            'kn': 'Kannada',
            'ta': 'Tamil',
            'te': 'Telugu',
            'mr': 'Marathi',
            'bn': 'Bengali',
            'gu': 'Gujarati',
            'ml': 'Malayalam',
            'pa': 'Punjabi',
            'or': 'Odia',
            'as': 'Assamese',
            'ur': 'Urdu'
        }
        
        # IndicTrans2 pipeline and Groq client will be loaded on demand
        self.translator = None
        self.settings = get_settings()
        self.indic_pipeline = None
        self.groq_client = None
        
        # Indic script regex for detection
        self.indic_pattern = re.compile(r'[\u0900-\u097F\u0980-\u09FF\u0A00-\u0A7F\u0A80-\u0AFF\u0B00-\u0B7F\u0B80-\u0BFF\u0C00-\u0C7F\u0C80-\u0CFF\u0D00-\u0D7F]')
    
    def detect_language(self, text: str) -> Optional[str]:
        """
        Detect the language of the given text
        Returns: language code (e.g., 'hi', 'en', 'ta')
        """
        try:
            if not text or len(text.strip()) < 10:
                logger.warning("Text too short for reliable language detection")
                return 'en'
            
            # Check for Indic scripts first
            if self.indic_pattern.search(text[:500]):
                # Contains Indic characters, force non-English
                lang_code = detect(text[:500])
                if lang_code == 'en':
                    # Override misdetection - default to Hindi if unsure
                    lang_code = 'hi'
                    logger.info(f"Indic script detected but langdetect said 'en', forcing to: {lang_code}")
            else:
                lang_code = detect(text[:500])
            
            lang_name = self.language_map.get(lang_code, lang_code)
            logger.info(f"✓ Detected language: {lang_name} ({lang_code})")
            return lang_code
            
        except LangDetectException as e:
            logger.error(f"Language detection failed: {e}")
            return 'en'
        except Exception as e:
            logger.error(f"Unexpected error in language detection: {e}")
            return 'en'
    
    def translate_to_english(self, text: str, source_lang: Optional[str] = None) -> Dict[str, Any]:
        """
        Translate text to English using IndicTrans2.
        
        Args:
            text: Text to translate
            source_lang: Source language code (auto-detect if None)
        
        Returns: dict with translated text and detected language
        """
        try:
            # Detect language if not provided
            if not source_lang:
                source_lang = self.detect_language(text)
            
            # If already English, no translation needed
            if source_lang == 'en':
                return {
                    "translated_text": text,
                    "source_language": source_lang,
                    "translation_performed": False
                }
            
            # Use IndicTrans2 first, fallback to Groq if needed
            logger.info(f"Translating {source_lang} text using IndicTrans2 with Groq fallback...")
            result = self._translate_with_indictrans2(text, source_lang or 'hi')
            
            # If IndicTrans2 failed, try Groq
            if not result.get('translation_performed'):
                logger.info("IndicTrans2 failed, trying Groq fallback...")
                result = self._translate_with_groq(text, source_lang or 'hi')
            
            return result
            
        except Exception as e:
            logger.error(f"Translation error: {e}")
            return {
                "translated_text": text,
                "source_language": source_lang or 'unknown',
                "translation_performed": False,
                "error": str(e)
            }
    
    def _load_indictrans2(self):
        """
        Load IndicTrans2 model using Hugging Face pipeline
        Requires authentication - use huggingface-cli login
        First run will download the model (~1.5GB)
        """
        if self.indic_pipeline is None:
            logger.info("Loading IndicTrans2 model (ai4bharat/indictrans2-indic-en-1B) using pipeline...")
            model_name = "ai4bharat/indictrans2-indic-en-1B"
            
            # Use GPU if available
            device = 0 if torch.cuda.is_available() else -1
            
            self.indic_pipeline = pipeline(
                "translation",
                model=model_name,
                trust_remote_code=True,
                device=device
            )
            
            if device == 0:
                logger.info("IndicTrans2 pipeline loaded on GPU")
            else:
                logger.info("IndicTrans2 pipeline loaded on CPU")
    
    def _translate_with_indictrans2(self, text: str, source_lang: str) -> Dict[str, Any]:
        """
        Translate using IndicTrans2 pipeline
        """
        try:
            self._load_indictrans2()
            
            if self.indic_pipeline is None:
                raise RuntimeError("IndicTrans2 pipeline failed to load")
            
            # Use pipeline for translation (automatically handles tokenization and generation)
            result = self.indic_pipeline(text[:1000], max_length=256)
            
            # Extract translated text from pipeline output
            if isinstance(result, list) and len(result) > 0:
                translated = result[0].get('translation_text', text)
            elif isinstance(result, dict):
                translated = result.get('translation_text', text)
            else:
                translated = str(result)
            
            logger.info(f"✓ Translation complete using IndicTrans2 pipeline")
            
            return {
                "translated_text": translated,
                "source_language": source_lang,
                "translation_performed": True,
                "provider": "hf/indictrans2-indic-en-1B-pipeline"
            }
            
        except Exception as e:
            logger.error(f"IndicTrans2 pipeline translation failed: {e}")
            return {
                "translated_text": text,
                "source_language": source_lang,
                "translation_performed": False,
                "error": str(e)
            }
    
    def _translate_with_groq(self, text: str, source_lang: str) -> Dict[str, Any]:
        """
        Translate using Groq Mixtral as fallback
        """
        try:
            if not self.groq_client:
                if not self.settings.GROQ_API_KEY:
                    raise ValueError("GROQ_API_KEY not configured")
                self.groq_client = Groq(api_key=self.settings.GROQ_API_KEY)
            
            lang_name = self.language_map.get(source_lang, source_lang)
            
            prompt = f"""Translate the following {lang_name} text to English. 
Provide ONLY the English translation without any explanations or additional text.

Text to translate:
{text[:1500]}

English translation:"""
            
            response = self.groq_client.chat.completions.create(
                messages=[{"role": "user", "content": prompt}],
                model="llama-3.3-70b-versatile",
                temperature=0.1,
                max_tokens=1000
            )
            
            translated = response.choices[0].message.content.strip()
            logger.info(f"✓ Translation complete using Groq")
            
            return {
                "translated_text": translated,
                "source_language": source_lang,
                "translation_performed": True,
                "provider": "groq/mixtral-8x7b"
            }
            
        except Exception as e:
            logger.error(f"Groq translation failed: {e}")
            return {
                "translated_text": text,
                "source_language": source_lang,
                "translation_performed": False,
                "error": str(e)
            }
    
    def get_language_name(self, lang_code: str) -> str:
        """Get full language name from code"""
        return self.language_map.get(lang_code, lang_code.upper())


# Global instance
language_service = LanguageService()
