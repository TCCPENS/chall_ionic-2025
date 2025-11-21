from flask_sqlalchemy import SQLAlchemy
from werkzeug.security import generate_password_hash, check_password_hash
from datetime import datetime
from flask import current_app
import uuid
from sqlalchemy.dialects.postgresql import UUID

db = SQLAlchemy()

class User(db.Model):
    __tablename__ = 'users'
    
    id = db.Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    username = db.Column(db.String(256), unique=True, nullable=False, index=True)
    password_hash = db.Column(db.String(256), nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    last_login_at = db.Column(db.DateTime, nullable=True)
    is_admin = db.Column(db.Boolean, default=False, nullable=False)
    
    posts = db.relationship('Post', backref='author', lazy='dynamic')
    
    def __init__(self, username, password, is_admin=False):
        self.username = username
        self.password_hash = generate_password_hash(password)
        self.is_admin = is_admin
    
    def verify_password(self, password):
        return check_password_hash(self.password_hash, password)
    
    def to_dict(self):
        return {
            'id': str(self.id),
            'username': self.username,
            'created_at': self.created_at.isoformat(),
            'last_login': self.last_login_at.isoformat() if self.last_login_at else None
        }

class Post(db.Model):
    __tablename__ = 'posts'
    
    id = db.Column(db.Integer, primary_key=True)
    content_raw = db.Column(db.Text, nullable=False)  
    content_html = db.Column(db.Text, nullable=False)  
    user_id = db.Column(UUID(as_uuid=True), db.ForeignKey('users.id'), nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    is_private = db.Column(db.Boolean, nullable=False, default=False)
    
    def to_dict(self):
        return {
            'id': self.id,
            'content': self.content_html,
            'user_id': str(self.user_id),
            'username': self.author.username,
            'created_at': self.created_at.isoformat(),
            'updated_at': self.updated_at.isoformat(),
            'is_private': self.is_private
        }

    def to_extended_dict(self):
        return {
            'id': self.id,
            'content': self.content_html,
            'content_raw': self.content_raw,
            'user_id': str(self.user_id),
            'username': self.author.username,
            'created_at': self.created_at.isoformat(),
            'updated_at': self.updated_at.isoformat(),
            'is_private': self.is_private
        }

class Report(db.Model):
    __tablename__ = 'reports'
    
    id = db.Column(db.Integer, primary_key=True)
    url = db.Column(db.String(500), nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    status = db.Column(db.String(50), default='pending')  
    
    def to_dict(self):
        return {
            'id': self.id,
            'url': self.url,
            'created_at': self.created_at.isoformat(),
            'status': self.status
        }