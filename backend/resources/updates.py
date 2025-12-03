from flask import Blueprint, request, jsonify
from extensions import db
from models.system_update import SystemUpdate
from flask_jwt_extended import jwt_required, get_jwt_identity
from models.user import User, UserRole

updates_bp = Blueprint('updates', __name__)

@updates_bp.route('', methods=['POST'])
@jwt_required()
def create_update():
    current_user_id = get_jwt_identity()
    user = User.query.get(current_user_id)
    
    if user.role != UserRole.ADMIN:
        return jsonify({'message': 'Unauthorized'}), 403
        
    data = request.get_json()
    
    title = data.get('title')
    content = data.get('content')
    
    if not title or not content:
        return jsonify({'message': 'Title and content are required'}), 400
        
    update = SystemUpdate(
        title=title,
        content=content,
        author_id=current_user_id
    )
    
    db.session.add(update)
    db.session.commit()
    
    return jsonify(update.to_dict()), 201

@updates_bp.route('', methods=['GET'])
@jwt_required()
def list_updates():
    updates = SystemUpdate.query.order_by(SystemUpdate.created_at.desc()).all()
    return jsonify([u.to_dict() for u in updates]), 200

@updates_bp.route('/<int:id>', methods=['DELETE'])
@jwt_required()
def delete_update(id):
    current_user_id = get_jwt_identity()
    user = User.query.get(current_user_id)
    
    if user.role != UserRole.ADMIN:
        return jsonify({'message': 'Unauthorized'}), 403
        
    update = SystemUpdate.query.get_or_404(id)
    
    db.session.delete(update)
    db.session.commit()
    
    return jsonify({'message': 'Update deleted'}), 200
