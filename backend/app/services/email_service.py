import aiosmtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
import logging
from typing import Dict
from app.config import get_settings
from datetime import datetime
from groq import Groq

logger = logging.getLogger(__name__)
settings = get_settings()


class EmailAlertService:
    """Service for sending email alerts for negative sentiment news"""
    
    def __init__(self):
        self.smtp_host = settings.SMTP_HOST
        self.smtp_port = settings.SMTP_PORT
        self.smtp_username = settings.SMTP_USERNAME
        self.smtp_password = settings.SMTP_PASSWORD
        self.from_email = settings.ALERT_EMAIL_FROM
        self.to_email = settings.ALERT_EMAIL_TO
        self.groq_client = None
    
    async def send_alert(self, article_data: Dict) -> bool:
        """
        Send email alert for negative sentiment article
        
        Args:
            article_data: Dictionary containing article information
        
        Returns: True if sent successfully, False otherwise
        """
        try:
            # Skip if email not configured
            if not self.smtp_username or not self.smtp_password:
                logger.warning("Email credentials not configured, skipping alert")
                return False
            
            # Generate AI summary of why the news is negative
            negative_summary = await self._generate_negative_summary(article_data)
            article_data['negative_summary'] = negative_summary
            
            # Create email message
            message = MIMEMultipart('alternative')
            message['Subject'] = f"🚨 Negative News Alert: {article_data.get('title', 'No Title')[:100]}"
            message['From'] = self.from_email
            message['To'] = self.to_email
            
            # Create email body
            html_body = self._create_email_body(article_data)
            
            # Attach HTML body
            html_part = MIMEText(html_body, 'html')
            message.attach(html_part)
            
            # Send email
            await aiosmtplib.send(
                message,
                hostname=self.smtp_host,
                port=self.smtp_port,
                username=self.smtp_username,
                password=self.smtp_password,
                start_tls=True
            )
            
            logger.info(f"✓ Alert email sent for article ID: {article_data.get('id')}")
            return True
            
        except Exception as e:
            logger.error(f"Failed to send email alert: {e}")
            return False
    
    async def _generate_negative_summary(self, article_data: Dict) -> str:
        """
        Use Groq to generate a summary explaining why the news is negative
        """
        try:
            if not self.groq_client:
                if not settings.GROQ_API_KEY:
                    logger.warning("GROQ_API_KEY not configured, skipping AI summary")
                    return "AI summary unavailable (Groq API key not configured)"
                self.groq_client = Groq(api_key=settings.GROQ_API_KEY)
            
            content = article_data.get('content', '')[:2000]
            title = article_data.get('title', 'No Title')
            
            prompt = f"""Analyze the following news article and explain in 2-3 sentences why it has negative sentiment. Focus on the key issues, concerns, or problems mentioned.

Title: {title}

Content:
{content}

Provide a concise explanation of why this news is negative:"""
            
            response = self.groq_client.chat.completions.create(
                messages=[{"role": "user", "content": prompt}],
                model="llama-3.3-70b-versatile",
                temperature=0.3,
                max_tokens=200
            )
            
            summary = response.choices[0].message.content.strip()
            logger.info("✓ Generated negative sentiment summary using Groq")
            return summary
            
        except Exception as e:
            logger.error(f"Failed to generate negative summary: {e}")
            return "Unable to generate AI summary at this time."
    
    def _create_email_body(self, article_data: Dict) -> str:
        """Create formatted HTML email body"""
        
        sentiment = article_data.get('sentiment', 'Unknown')
        department = article_data.get('department', 'Unknown')
        title = article_data.get('title', 'No Title')
        content_preview = article_data.get('content', '')[:300] + '...'
        source_url = article_data.get('source_url', '#')
        language = article_data.get('detected_language', 'Unknown')
        sentiment_score = article_data.get('sentiment_score', 0)
        negative_summary = article_data.get('negative_summary', 'Not available')
        
        html = f"""
        <html>
        <head>
            <style>
                body {{ font-family: Arial, sans-serif; line-height: 1.6; color: #333; }}
                .container {{ max-width: 600px; margin: 0 auto; padding: 20px; }}
                .header {{ background-color: #dc2626; color: white; padding: 20px; border-radius: 5px; }}
                .content {{ background-color: #f9fafb; padding: 20px; margin-top: 20px; border-radius: 5px; }}
                .label {{ font-weight: bold; color: #374151; }}
                .value {{ color: #6b7280; }}
                .sentiment-negative {{ color: #dc2626; font-weight: bold; }}
                .button {{ display: inline-block; background-color: #2563eb; color: white; padding: 10px 20px; 
                           text-decoration: none; border-radius: 5px; margin-top: 15px; }}
            </style>
        </head>
        <body>
            <div class="container">
                <div class="header">
                    <h2>🚨 Negative Sentiment News Alert</h2>
                </div>
                
                <div class="content">
                    <h3>{title}</h3>
                    
                    <p><span class="label">Sentiment:</span> 
                       <span class="sentiment-negative">{sentiment.upper()} ({sentiment_score:.2%})</span>
                    </p>
                    
                    <p><span class="label">Department:</span> <span class="value">{department}</span></p>
                    <p><span class="label">Language:</span> <span class="value">{language}</span></p>
                    <p><span class="label">Detected at:</span> <span class="value">{datetime.now().strftime('%Y-%m-%d %H:%M:%S')}</span></p>
                    
                    <h4>Why This News is Negative (AI Analysis):</h4>
                    <p style="color: #dc2626; background-color: #fee2e2; padding: 15px; border-radius: 5px; border-left: 4px solid #dc2626;">
                        {negative_summary}
                    </p>
                    
                    <h4>Content Preview:</h4>
                    <p style="color: #6b7280; font-style: italic;">{content_preview}</p>
                    
                    {f'<a href="{source_url}" class="button">Read Full Article</a>' if source_url != '#' else ''}
                </div>
                
                <p style="color: #9ca3af; font-size: 12px; margin-top: 20px;">
                    This is an automated alert from the AI-Powered 360° Feedback System.
                </p>
            </div>
        </body>
        </html>
        """
        
        return html


# Global instance
email_alert_service = EmailAlertService()
