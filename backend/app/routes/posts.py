import uuid

from flask import Blueprint, request, jsonify, current_app
from flask_jwt_extended import jwt_required, get_jwt_identity
from sqlalchemy import or_, and_
from sqlalchemy.exc import SQLAlchemyError

from ..models import db, Post, User
from ..utils.bb_parser import BBCodeParser

posts_bp = Blueprint('posts', __name__)

def validate_post_content(content):
    if not content:
        return False, "Content cannot be empty"
    
    if len(content) > 2000: 
        return False, "Content is too long (max 2000 characters)"
    
    return True, ""

@posts_bp.route('/', methods=['GET'])
@jwt_required()
def get_posts():
    page = request.args.get('page', 1, type=int)
    per_page = min(request.args.get('per_page', 10, type=int), 50)
    current_user_id = get_jwt_identity()
    
    posts = (
        Post.query
        .filter(
            or_(
                Post.user_id == current_user_id, 
                Post.is_private == False 
            )
        )
        .order_by(Post.created_at.desc())
        .paginate(page=page, per_page=per_page, error_out=False)
    )
    
    result = []
    for post in posts.items:
        result.append(post.to_dict())
    
    return jsonify({
        'items': result,
        'page': page,
        'per_page': per_page,
        'total': posts.total,
        'pages': posts.pages
    }), 200

@posts_bp.route('/<int:post_id>', methods=['GET'])
@jwt_required()
def get_post(post_id):
    current_user_id = get_jwt_identity()
    
    post = Post.query.filter(
        Post.id == post_id,
        or_(
            Post.user_id == current_user_id,  
            Post.is_private == False  
        )
    ).first()
    
    if not post:
        return jsonify({'error': 'Post not found'}), 404
    
    return jsonify({'post': post.to_extended_dict()}), 200

@posts_bp.route('/', methods=['POST'])
@jwt_required()
def create_post():
    user_id = get_jwt_identity()
    
    data = request.get_json()
    if not data:
        return jsonify({'error': 'No input data provided'}), 400
    
    content_raw = data.get('content', '')
    is_private = data.get('is_private', False)
    
    valid, error_msg = validate_post_content(content_raw)
    if not valid:
        return jsonify({'error': error_msg}), 400

    parser = BBCodeParser()
    content_html = parser.parse(content_raw)
    
    try:
        post = Post(
            content_raw=content_raw,
            content_html=content_html,
            user_id=user_id,
            is_private=is_private,
        )
        
        db.session.add(post)
        db.session.commit()
        
        return jsonify({
            'message': 'Post created successfully',
            'post': post.to_extended_dict(),
        }), 201
    
    except SQLAlchemyError as e:
        db.session.rollback()
        return jsonify({'error': 'Database error', 'details': str(e)}), 500

@posts_bp.route('/<int:post_id>', methods=['PUT'])
@jwt_required()
def update_post(post_id):
    current_user_id = get_jwt_identity()
    
    post = Post.query.filter_by(id=post_id, user_id=current_user_id).first()
    if not post:
        return jsonify({'error': 'Post not found or you do not have permission to edit it'}), 404
    
    data = request.get_json()
    if not data:
        return jsonify({'error': 'No input data provided'}), 400
    
    content_raw = data.get('content')
    if content_raw is None:
        return jsonify({'error': 'Content is required'}), 400
    
    valid, error_msg = validate_post_content(content_raw)
    if not valid:
        return jsonify({'error': error_msg}), 400
    
    parser = BBCodeParser()
    content_html = parser.parse(content_raw)
    
    try:
        post.content_raw = content_raw
        post.content_html = content_html
        
        if 'is_private' in data:
            post.is_private = data.get('is_private', False)
        
        db.session.commit()
        
        return jsonify({
            'message': 'Post updated successfully',
            'post': post.to_extended_dict()
        }), 200
    
    except SQLAlchemyError as e:
        db.session.rollback()
        return jsonify({'error': 'Database error', 'details': str(e)}), 500

@posts_bp.route('/<int:post_id>', methods=['DELETE'])
@jwt_required()
def delete_post(post_id):
    current_user_id = get_jwt_identity()
    
    post = Post.query.filter_by(id=post_id, user_id=current_user_id).first()
    if not post:
        return jsonify({'error': 'Post not found or you do not have permission to delete it'}), 404
    
    try:
        db.session.delete(post)
        db.session.commit()
        
        return jsonify({
            'message': 'Post deleted successfully'
        }), 200
    
    except SQLAlchemyError as e:
        db.session.rollback()
        return jsonify({'error': 'Database error', 'details': str(e)}), 500

@posts_bp.route('/private', methods=['GET'])
@jwt_required()
def get_private_posts():
    current_user_id = get_jwt_identity()
    
    posts = (
        Post.query
        .filter(Post.user_id == current_user_id, Post.is_private == True)
        .order_by(Post.created_at.desc())
        .all()
    )
    
    result = []
    for post in posts:
        result.append(post.to_extended_dict())
    
    return jsonify({
        'private_posts': result
    }), 200