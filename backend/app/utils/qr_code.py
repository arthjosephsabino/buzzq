import io
import qrcode

from app.config import settings

def generate_qr_code(id: str): 
    scan_url = f"{settings.QR_CODE_BASE_URL.rstrip('/')}/{id}/join"
    buffer = io.BytesIO()
    qrcode.make(scan_url).save(buffer, format="PNG")
    return buffer.getvalue()