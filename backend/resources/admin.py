from flask import Blueprint, request, jsonify
from extensions import db
from models.user import User, UserRole
from models.config import AppConfig
from flask_jwt_extended import jwt_required, get_jwt_identity

admin_bp = Blueprint('admin', __name__)

# TODO: Adicionar decorador de verificação de função de administrador

@admin_bp.route('/users', methods=['GET'])
@jwt_required()
def get_users():
    users = User.query.all()
    return jsonify([u.to_dict() for u in users]), 200

@admin_bp.route('/users', methods=['POST'])
@jwt_required()
def create_user():
    data = request.get_json()
    
    if User.query.filter_by(email=data.get('email')).first():
        return jsonify({'message': 'Email already exists'}), 400

    if User.query.filter_by(hmc=data.get('hmc')).first():
        return jsonify({'message': 'HMC already exists'}), 400
        
    user = User(
        nome=data.get('nome'),
        email=data.get('email'),
        hmc=data.get('hmc'),
        role=data.get('role', 'VISUALIZADOR')
    )
    user.set_password(data.get('password'))
    
    db.session.add(user)
    db.session.commit()
    
    return jsonify(user.to_dict()), 201

@admin_bp.route('/users/<int:id>', methods=['PUT'])
@jwt_required()
def update_user(id):
    user = User.query.get_or_404(id)
    data = request.get_json()
    
    if 'nome' in data:
        user.nome = data['nome']
        
    if 'email' in data and data['email'] != user.email:
        if User.query.filter_by(email=data['email']).first():
            return jsonify({'message': 'Email already exists'}), 400
        user.email = data['email']
        
    if 'hmc' in data and data['hmc'] != user.hmc:
        if User.query.filter_by(hmc=data['hmc']).first():
            return jsonify({'message': 'HMC already exists'}), 400
        user.hmc = data['hmc']
    
    if 'role' in data:
        user.role = UserRole(data['role'])
        
    if 'ativo' in data:
        user.ativo = data['ativo']
        
    if 'password' in data and data['password']:
        user.set_password(data['password'])
        
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
    if 'nome_aprovador_1' in data: config.nome_aprovador_1 = data['nome_aprovador_1']
    if 'nome_aprovador_2' in data: config.nome_aprovador_2 = data['nome_aprovador_2']
    if 'email_executor_default' in data: config.email_executor_default = data['email_executor_default']
    
    db.session.commit()
    return jsonify(config.to_dict()), 200
