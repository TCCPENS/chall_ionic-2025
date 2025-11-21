import os

class Config:
    SECRET_KEY = os.environ.get('SECRET_KEY', 'super-secret-key-for-challenge-2025')
    DEBUG = True

    SQLALCHEMY_DATABASE_URI = os.environ.get("SQLALCHEMY_DATABASE_URI", "postgresql://mysql:postgres@localhost:5432/xss_challenge")
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    
    REDIS_URL = os.environ.get('REDIS_URL', 'redis://localhost:6379/0')
    JWT_SECRET_KEY = os.environ.get('JWT_SECRET_KEY', 'jwt-secret-key-challenge')
    JWT_ACCESS_TOKEN_EXPIRES = 3600
    
    BOT_SERVICE_URL = os.environ.get('BOT_SERVICE_URL', 'http://bot:5000')
    
    ALLOWED_BB_TAGS = [
        'b', 'i', 's', 'h1', 'list', 'quote', 'code', 
        'url', 'img', 'youtube', 'yt'
    ]
    
    YOUTUBE_ALLOWED_ATTRIBUTES = ['id', 'width', 'height']