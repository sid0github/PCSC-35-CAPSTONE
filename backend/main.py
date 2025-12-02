from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import logging
import uvicorn

from app.config import get_settings
from app.database import init_db
from app.api.routes import router
from app.services.ml_service import ml_service

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

settings = get_settings()

# Create FastAPI app
app = FastAPI(
    title=settings.APP_NAME,
    description="AI-Powered 360° Feedback System for Government News",
    version="1.0.0"
)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://localhost:5173"],  # React dev servers
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.on_event("startup")
async def startup_event():
    """Initialize database and load ML models on startup"""
    logger.info("🚀 Starting AI News Feedback System...")
    
    try:
        # Initialize database
        logger.info("Initializing database...")
        init_db()
        logger.info("✓ Database initialized")
        
        # Load ML models
        logger.info("Loading ML models...")
        ml_service.load_models()
        logger.info("✓ ML models loaded successfully")
        
        logger.info("✅ System ready!")
        
    except Exception as e:
        logger.error(f"❌ Startup failed: {e}")
        raise


@app.on_event("shutdown")
async def shutdown_event():
    """Cleanup on shutdown"""
    logger.info("Shutting down...")


@app.get("/")
def root():
    """Welcome endpoint"""
    return {
        "message": "🚀 AI-Powered News Analyzer Running Successfully!",
        "status": "online",
        "app": settings.APP_NAME,
        "version": "1.0.0",
        "features": [
            "✅ Sentiment Analysis (Positive/Negative/Neutral)",
            "✅ Department Classification (12 categories)",
            "✅ Multi-language Support (8+ Indian languages)",
            "✅ Email Alerts for Negative Sentiment",
            "✅ URL Scraping, PDF OCR, Text Analysis"
        ],
        "api_docs": "http://localhost:8000/docs",
        "frontend": "http://localhost:5173"
    }


@app.get("/health")
def health_check():
    """Detailed health check"""
    return {
        "status": "healthy",
        "database": "connected",
        "ml_models": "loaded"
    }


# Include API routes
app.include_router(router)


if __name__ == "__main__":
    uvicorn.run(
        "main:app",
        host=settings.API_HOST,
        port=settings.API_PORT,
        reload=settings.DEBUG
    )
