import os
import asyncio
import logging
import resend
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel, EmailStr

logger = logging.getLogger(__name__)

# Initialize Resend
resend.api_key = os.environ.get('RESEND_API_KEY')
CONTACT_EMAIL = os.environ.get('CONTACT_EMAIL', 'feelingshouses@gmail.com')

router = APIRouter(tags=["Contact"])

class ContactFormRequest(BaseModel):
    name: str
    email: EmailStr
    phone: str = ""
    message: str

@router.post("/submit")
async def submit_contact_form(request: ContactFormRequest):
    """
    Handle contact form submissions and send email notification
    """
    # Create HTML email content
    html_content = f"""
    <html>
    <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
        <div style="max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #ddd; border-radius: 10px;">
            <h2 style="color: #2563eb; border-bottom: 2px solid #2563eb; padding-bottom: 10px;">
                Νέο Μήνυμα από Feelings Houses Contact Form
            </h2>
            
            <div style="margin: 20px 0;">
                <p style="margin: 10px 0;">
                    <strong style="color: #555;">Όνομα:</strong> {request.name}
                </p>
                <p style="margin: 10px 0;">
                    <strong style="color: #555;">Email:</strong> 
                    <a href="mailto:{request.email}" style="color: #2563eb;">{request.email}</a>
                </p>
                <p style="margin: 10px 0;">
                    <strong style="color: #555;">Τηλέφωνο:</strong> {request.phone if request.phone else 'Δεν δόθηκε'}
                </p>
            </div>
            
            <div style="background-color: #f8fafc; padding: 15px; border-left: 4px solid #2563eb; margin: 20px 0;">
                <strong style="color: #555; display: block; margin-bottom: 10px;">Μήνυμα:</strong>
                <p style="margin: 0; white-space: pre-wrap;">{request.message}</p>
            </div>
            
            <div style="margin-top: 20px; padding-top: 20px; border-top: 1px solid #ddd; font-size: 12px; color: #777;">
                <p>Αυτό το email στάλθηκε από τη φόρμα επικοινωνίας στο feelingshouses.com</p>
            </div>
        </div>
    </body>
    </html>
    """
    
    params = {
        "from": "Feelings Houses <onboarding@resend.dev>",
        "to": [CONTACT_EMAIL],
        "subject": f"Νέο Μήνυμα Επικοινωνίας από {request.name}",
        "html": html_content,
        "reply_to": request.email
    }
    
    try:
        # Send email using resend (run in thread to keep FastAPI non-blocking)
        email_response = await asyncio.to_thread(resend.Emails.send, params)
        
        logger.info(f"Contact form email sent successfully. Email ID: {email_response.get('id')}")
        
        return {
            "status": "success",
            "message": "Το μήνυμά σας στάλθηκε επιτυχώς! Θα επικοινωνήσουμε σύντομα μαζί σας.",
            "email_id": email_response.get("id")
        }
    except Exception as e:
        logger.error(f"Failed to send contact form email: {str(e)}")
        raise HTTPException(
            status_code=500, 
            detail="Αποτυχία αποστολής μηνύματος. Παρακαλώ δοκιμάστε ξανά ή επικοινωνήστε μαζί μας τηλεφωνικά."
        )
