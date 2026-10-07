import os
from dotenv import load_dotenv

load_dotenv()

def _database_url():
    url = os.getenv('DATABASE_URL')
    if url:
        # Render: postgres://… → force psycopg2 driver (we ship psycopg2-binary, not psycopg v3)
        if url.startswith('postgres://'):
            url = url.replace('postgres://', 'postgresql+psycopg2://', 1)
        elif url.startswith('postgresql://') and '+psycopg' not in url.split('://', 1)[0]:
            url = url.replace('postgresql://', 'postgresql+psycopg2://', 1)
        return url
    base = os.path.abspath(os.path.dirname(__file__))
    return f"sqlite:///{os.path.join(base, 'local_guru.db')}"


def _public_base_url():
    explicit = os.getenv('PUBLIC_URL') or os.getenv('RENDER_EXTERNAL_URL')
    return (explicit or 'http://localhost:5000').rstrip('/')


def _frontend_url():
    if os.getenv('FRONTEND_URL'):
        return os.getenv('FRONTEND_URL').rstrip('/')
    if os.getenv('RENDER_EXTERNAL_URL'):
        return os.getenv('RENDER_EXTERNAL_URL').rstrip('/')
    if os.getenv('PUBLIC_URL'):
        return os.getenv('PUBLIC_URL').rstrip('/')
    return 'http://localhost:5173'


class Config:
    SECRET_KEY = os.getenv('JWT_SECRET', 'local-guru-jwt-super-secret-key-2026')
    PUBLIC_URL = _public_base_url()
    FRONTEND_URL = _frontend_url()
    BASE_DIR = os.path.abspath(os.path.dirname(__file__))
    SQLALCHEMY_DATABASE_URI = _database_url()
    SQLALCHEMY_TRACK_MODIFICATIONS = False

    MAIL_SERVER = 'smtp.gmail.com'
    MAIL_PORT = 587
    MAIL_USERNAME = os.getenv('MAIL_USERNAME', '')
    MAIL_PASSWORD = os.getenv('MAIL_PASSWORD', '')
    MAIL_SENDER = os.getenv('MAIL_SENDER', 'Local Guru Shopping Mall <noreply@localguru.com>')

    FAST2SMS_API_KEY = os.getenv('FAST2SMS_API_KEY', '')
    FAST2SMS_OTP_ID = os.getenv('FAST2SMS_OTP_ID', '')
    
    # Twilio API Credentials
    TWILIO_ACCOUNT_SID = os.getenv('TWILIO_ACCOUNT_SID', '')
    TWILIO_AUTH_TOKEN = os.getenv('TWILIO_AUTH_TOKEN', '')
    TWILIO_PHONE_NUMBER = os.getenv('TWILIO_PHONE_NUMBER', '')
    
    # Razorpay credentials
    RAZORPAY_KEY_ID = os.getenv('RAZORPAY_KEY_ID', 'rzp_test_localguru123')
    RAZORPAY_KEY_SECRET = os.getenv('RAZORPAY_KEY_SECRET', 'test_secret_localguru123')
    
    # Cloudinary config
    CLOUDINARY_CLOUD_NAME = os.getenv('CLOUDINARY_CLOUD_NAME', 'localguru-cloud')
    CLOUDINARY_API_KEY = os.getenv('CLOUDINARY_API_KEY', '1234567890')
    CLOUDINARY_API_SECRET = os.getenv('CLOUDINARY_API_SECRET', 'secret_key')
