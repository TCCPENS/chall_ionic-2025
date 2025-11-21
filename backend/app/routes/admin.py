from flask import Blueprint, request, jsonify, current_app
from ..models import db, Report
import requests
import re

admin_bp = Blueprint('admin', __name__)

@admin_bp.route('/report', methods=['POST'])
def report_url():
    data = request.get_json()
    
    if not data:
        return jsonify({'error': 'No input data provided'}), 400
    
    url = data.get('url', '')
    
    if not url:
        return jsonify({'error': 'URL is required'}), 400
    
    if not re.match(r'^https?://', url):
        return jsonify({'error': 'Invalid URL format. Must start with http:// or https://'}), 400
    
    if len(url) > 500:
        return jsonify({'error': 'URL too long (max 500 characters)'}), 400
    
    report = Report(url=url)
    db.session.add(report)
    db.session.commit()
    
    try:
        bot_response = requests.post(
            f"{current_app.config['BOT_SERVICE_URL']}/visit",
            json={'url': url},
            timeout=30
        )
        
        if bot_response.status_code == 200:
            report.status = 'processed'
            db.session.commit()
            return jsonify({
                'message': 'Report submitted successfully! Admin will review it soon.',
                'report_id': report.id
            }), 200
        else:
            report.status = 'failed'
            db.session.commit()
            return jsonify({
                'error': 'Failed to process report',
                'report_id': report.id
            }), 500
            
    except requests.exceptions.RequestException as e:
        report.status = 'failed'
        db.session.commit()
        return jsonify({
            'error': 'Bot service is currently unavailable',
            'report_id': report.id
        }), 503
