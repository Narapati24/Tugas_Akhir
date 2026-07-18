import pytesseract
from PIL import Image
import io
import os
from app.core.config import settings

# Configure Tesseract path for Windows
if os.path.exists(settings.TESSERACT_CMD):
    pytesseract.pytesseract.tesseract_cmd = settings.TESSERACT_CMD

def extract_text_from_image(image_bytes: bytes) -> str:
    """
    Extracts text from an image using Tesseract OCR.
    """
    try:
        # Load image from bytes
        image = Image.open(io.BytesIO(image_bytes))
        
        # Point to the downloaded tessdata directory (4 levels up from this file)
        # backend/app/services/ocr/tesseract_service.py
        backend_dir = os.path.dirname(os.path.dirname(os.path.dirname(os.path.dirname(__file__))))
        tessdata_dir = os.path.join(backend_dir, "tessdata")
        
        # Set TESSDATA_PREFIX environment variable (Tesseract requires this)
        os.environ["TESSDATA_PREFIX"] = tessdata_dir
        
        # We assume Indonesian lang per project context
        text = pytesseract.image_to_string(image, lang='ind')
        
        # Clean up text a bit
        cleaned_text = "\n".join([line.strip() for line in text.split("\n") if line.strip()])
        return cleaned_text
    except Exception as e:
        print(f"OCR Error: {e}")
        return ""
