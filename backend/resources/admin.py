from flask import Blueprint, request, jsonify
from extensions import db
from models.user import User, UserRole
from models.config import AppConfig
from flask_jwt_extended import jwt_required, get_jwt_identity

admin_bp = Blueprint('admin', __name__)

# TODO: Add admin role check decorator

@admin_bp.route('/users', methods=['GET'])
@jwt_required()
def get_users():
    users = User.query.all()
    return jsonify([u.to_dict() for u in users]), 200

@admin_bp.route('/users/<int:id>', methods=['PUT'])
@jwt_required()
def update_user_role(id):
    user = User.query.get_or_404(id)
    data = request.get_json()
    
    if 'role' in data:
        user.role = UserRole(data['role'])
    if 'ativo' in data:
        user.ativo = data['ativo']
        
    db.session.commit()
    return jsonify(user.to_dict()), 200

@admin_bp.route('/config', methods=['GET'])
@jwt_required()
def get_config():
    config = AppConfig.query.first()
    if not config:
        return jsonify({}), 200
    return jsonify(config.to_dict()), 200

@admin_bp.route('/config', methods=['PUT'])
@jwt_required()
def update_config():
    config = AppConfig.query.first()
    if not config:
        config = AppConfig()
        db.session.add(config)
        
    data = request.get_json()
    if 'email_aprovador_1' in data: config.email_aprovador_1 = data['email_aprovador_1']
    if 'email_aprovador_2' in data: config.email_aprovador_2 = data['email_aprovador_2']
    if 'email_executor_default' in data: config.email_executor_default = data['email_executor_default']
    
    db.session.commit()
    return jsonify(config.to_dict()), 200
