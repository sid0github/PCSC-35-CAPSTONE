from transformers import AutoTokenizer, AutoModelForSequenceClassification, pipeline
import joblib
import torch
from typing import Tuple, Dict
import logging
from app.config import get_settings

logger = logging.getLogger(__name__)
settings = get_settings()


class MLInferenceService:
    """Service for loading and running sentiment + department classification models"""
    
    def __init__(self):
        self.sentiment_model = None
        self.sentiment_tokenizer = None
        self.sentiment_pipeline = None
        self.sentiment_label_encoder = None
        
        self.department_model = None
        self.department_tokenizer = None
        self.department_pipeline = None
        self.department_label_encoder = None
        
        self.device = "cuda" if torch.cuda.is_available() else "cpu"
        logger.info(f"Using device: {self.device}")
    
    def load_models(self):
        """Load both sentiment and department models at startup"""
        try:
            # Load sentiment model
            logger.info(f"Loading sentiment model from {settings.SENTIMENT_MODEL_PATH}")
            self.sentiment_tokenizer = AutoTokenizer.from_pretrained(settings.SENTIMENT_MODEL_PATH)
            self.sentiment_model = AutoModelForSequenceClassification.from_pretrained(
                settings.SENTIMENT_MODEL_PATH
            ).to(self.device)
            self.sentiment_pipeline = pipeline(
                "text-classification",
                model=self.sentiment_model,
                tokenizer=self.sentiment_tokenizer,
                device=0 if self.device == "cuda" else -1
            )
            self.sentiment_label_encoder = joblib.load(settings.SENTIMENT_LABEL_ENCODER_PATH)
            logger.info("✓ Sentiment model loaded successfully")
            
            # Load department model
            logger.info(f"Loading department model from {settings.DEPARTMENT_MODEL_PATH}")
            self.department_tokenizer = AutoTokenizer.from_pretrained(settings.DEPARTMENT_MODEL_PATH)
            self.department_model = AutoModelForSequenceClassification.from_pretrained(
                settings.DEPARTMENT_MODEL_PATH
            ).to(self.device)
            self.department_pipeline = pipeline(
                "text-classification",
                model=self.department_model,
                tokenizer=self.department_tokenizer,
                device=0 if self.device == "cuda" else -1
            )
            self.department_label_encoder = joblib.load(settings.DEPARTMENT_LABEL_ENCODER_PATH)
            logger.info("✓ Department model loaded successfully")
            
        except Exception as e:
            logger.error(f"Error loading models: {e}")
            raise
    
    def predict_sentiment(self, text: str) -> Tuple[str, float]:
        """
        Predict sentiment for given text
        Returns: (sentiment_label, confidence_score)
        """
        try:
            result = self.sentiment_pipeline(text[:512])[0]  # Truncate to 512 tokens
            label = result['label']
            confidence = result['score']
            
            # Check if label is already a string (e.g., 'Positive', 'Negative')
            if label.startswith('LABEL_'):
                # Extract index and use label encoder
                label_idx = int(label.split('_')[-1])
                sentiment_label = self.sentiment_label_encoder.inverse_transform([label_idx])[0]
            else:
                # Label is already the sentiment name
                sentiment_label = label
            
            return sentiment_label, confidence
        except Exception as e:
            logger.error(f"Error predicting sentiment: {e}")
            return "unknown", 0.0
    
    def predict_department(self, text: str) -> Tuple[str, float]:
        """
        Predict department/category for given text
        Returns: (department_label, confidence_score)
        """
        try:
            result = self.department_pipeline(text[:512])[0]
            label_idx = int(result['label'].split('_')[-1])
            department_label = self.department_label_encoder.inverse_transform([label_idx])[0]
            confidence = result['score']
            
            return department_label, confidence
        except Exception as e:
            logger.error(f"Error predicting department: {e}")
            return "unknown", 0.0
    
    def analyze_text(self, text: str) -> Dict[str, any]:
        """
        Perform complete analysis: sentiment + department classification
        Returns: dict with both predictions
        """
        sentiment, sentiment_score = self.predict_sentiment(text)
        department, department_score = self.predict_department(text)
        
        return {
            "sentiment": sentiment,
            "sentiment_score": float(sentiment_score),
            "department": department,
            "department_score": float(department_score)
        }


# Global instance
ml_service = MLInferenceService()
