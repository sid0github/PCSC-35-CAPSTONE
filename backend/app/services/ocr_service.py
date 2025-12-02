import pytesseract
from pdf2image import convert_from_path, convert_from_bytes
from PIL import Image
import cv2
import numpy as np
import io
import logging
from typing import List, Dict
import os
from app.config import get_settings

logger = logging.getLogger(__name__)
settings = get_settings()


class OCRService:
    """Service for extracting text from PDFs and images using Tesseract OCR"""
    
    def __init__(self):
        # Set Tesseract path if specified in config
        if settings.TESSERACT_CMD:
            pytesseract.pytesseract.tesseract_cmd = settings.TESSERACT_CMD
        
        # Supported Indian languages in Tesseract
        # Make sure these language packs are installed: tesseract-ocr-hin, tesseract-ocr-kan, etc.
        self.supported_languages = [
            'eng',  # English
            'hin',  # Hindi
            'kan',  # Kannada
            'tam',  # Tamil
            'tel',  # Telugu
            'mar',  # Marathi
            'ben',  # Bengali
            'guj',  # Gujarati
            'mal',  # Malayalam
            'pan',  # Punjabi
        ]
    
    def extract_text_from_pdf(self, pdf_path: str, language: str = 'eng') -> Dict[str, any]:
        """
        Extract text from PDF file using OCR
        Args:
            pdf_path: Path to PDF file
            language: Tesseract language code (default: eng)
        Returns: dict with extracted text
        """
        try:
            # Convert PDF to images
            logger.info(f"Converting PDF to images: {pdf_path}")
            images = convert_from_path(pdf_path, dpi=300)
            
            # Extract text from each page
            all_text = []
            for i, image in enumerate(images):
                logger.info(f"Processing page {i+1}/{len(images)}")
                
                # Preprocess image for better OCR
                processed_image = self._preprocess_image(np.array(image))
                
                # Perform OCR with language support
                lang_codes = '+'.join([language, 'eng'])  # Always include English
                text = pytesseract.image_to_string(
                    processed_image,
                    lang=lang_codes,
                    config='--psm 6'  # Assume uniform block of text
                )
                all_text.append(text)
            
            combined_text = '\n\n'.join(all_text)
            
            logger.info(f"✓ Extracted {len(combined_text)} characters from PDF")
            
            return {
                "text": combined_text,
                "num_pages": len(images),
                "language": language
            }
            
        except Exception as e:
            logger.error(f"Error extracting text from PDF {pdf_path}: {e}")
            raise
    
    def extract_text_from_pdf_bytes(self, pdf_bytes: bytes, language: str = 'eng') -> Dict[str, any]:
        """
        Extract text from PDF bytes (for uploaded files)
        """
        try:
            images = convert_from_bytes(pdf_bytes, dpi=300)
            
            all_text = []
            for i, image in enumerate(images):
                processed_image = self._preprocess_image(np.array(image))
                lang_codes = '+'.join([language, 'eng'])
                text = pytesseract.image_to_string(
                    processed_image,
                    lang=lang_codes,
                    config='--psm 6'
                )
                all_text.append(text)
            
            combined_text = '\n\n'.join(all_text)
            
            return {
                "text": combined_text,
                "num_pages": len(images),
                "language": language
            }
            
        except Exception as e:
            logger.error(f"Error extracting text from PDF bytes: {e}")
            raise
    
    def extract_text_from_image(self, image_path: str, language: str = 'eng') -> str:
        """
        Extract text from image file
        """
        try:
            image = Image.open(image_path)
            processed_image = self._preprocess_image(np.array(image))
            
            lang_codes = '+'.join([language, 'eng'])
            text = pytesseract.image_to_string(
                processed_image,
                lang=lang_codes,
                config='--psm 6'
            )
            
            logger.info(f"✓ Extracted {len(text)} characters from image")
            return text
            
        except Exception as e:
            logger.error(f"Error extracting text from image {image_path}: {e}")
            raise
    
    def extract_text_from_image_bytes(self, image_bytes: bytes, language: str = 'eng') -> str:
        """
        Extract text from image bytes (for uploaded files)
        """
        try:
            image = Image.open(io.BytesIO(image_bytes))
            processed_image = self._preprocess_image(np.array(image))
            
            lang_codes = '+'.join([language, 'eng'])
            text = pytesseract.image_to_string(
                processed_image,
                lang=lang_codes,
                config='--psm 6'
            )
            
            return text
            
        except Exception as e:
            logger.error(f"Error extracting text from image bytes: {e}")
            raise
    
    def _preprocess_image(self, image: np.ndarray) -> np.ndarray:
        """
        Preprocess image for better OCR accuracy
        - Convert to grayscale
        - Apply thresholding
        - Denoise
        """
        try:
            # Convert to grayscale if needed
            if len(image.shape) == 3:
                gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)
            else:
                gray = image
            
            # Apply adaptive thresholding
            thresh = cv2.adaptiveThreshold(
                gray, 255,
                cv2.ADAPTIVE_THRESH_GAUSSIAN_C,
                cv2.THRESH_BINARY,
                11, 2
            )
            
            # Denoise
            denoised = cv2.fastNlMeansDenoising(thresh, h=10)
            
            return denoised
            
        except Exception as e:
            logger.warning(f"Image preprocessing failed: {e}, using original")
            return image


# Global instance
ocr_service = OCRService()
