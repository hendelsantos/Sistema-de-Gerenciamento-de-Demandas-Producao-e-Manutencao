from flask import Blueprint, request, jsonify
from extensions import db
from models.bug_report import BugReport, BugStatus
from flask_jwt_extended import jwt_required, get_jwt_identity
from datetime import datetime

bugs_bp = Blueprint('bugs', __name__)

@bugs_bp.route('', methods=['POST'])
@jwt_required()
def create_bug():
    current_user_id = get_jwt_identity()
    data = request.get_json()
    
    description = data.get('description')
    if not description:
        return jsonify({'message': 'Description is required'}), 400
        
    bug = BugReport(
        description=description,
        reporter_id=current_user_id
    )
    
    db.session.add(bug)
    db.session.commit()
    
    return jsonify(bug.to_dict()), 201

@bugs_bp.route('', methods=['GET'])
@jwt_required()
def list_bugs():
    bugs = BugReport.query.order_by(BugReport.created_at.desc()).all()
    return jsonify([bug.to_dict() for bug in bugs]), 200

@bugs_bp.route('/<int:id>/respond', methods=['POST'])
@jwt_required()
def respond_bug(id):
    current_user_id = get_jwt_identity()
    data = request.get_json()
    
    bug = BugReport.query.get_or_404(id)
    
    response = data.get('response')
    if not response:
        return jsonify({'message': 'Response is required'}), 400
        
    bug.developer_response = response
    bug.responder_id = current_user_id
    bug.response_at = datetime.utcnow()
    # Optionally close the bug or keep it open? Let's keep it open or allow status change.
    # For now, responding doesn't automatically close, but maybe we should add a status field in request.
    
    status = data.get('status')
    if status and status in BugStatus.__members__:
        bug.status = BugStatus[status]
        
    db.session.commit()
    
    return jsonify(bug.to_dict()), 200
