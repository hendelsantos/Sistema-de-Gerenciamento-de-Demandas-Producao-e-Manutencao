from flask import Blueprint, request, jsonify
from extensions import db, jwt
from models.user import User
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity

auth_bp = Blueprint('auth', __name__)

@auth_bp.route('/register', methods=['POST'])
def register():
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
    
    return jsonify({'message': 'User created successfully'}), 201

@auth_bp.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    # Login now uses HMC instead of email
    user = User.query.filter_by(hmc=data.get('hmc')).first()
    
    if user and user.check_password(data.get('password')):
        access_token = create_access_token(identity=str(user.id))
        return jsonify({
            'access_token': access_token,
            'user': user.to_dict()
        }), 200
        
    return jsonify({'message': 'Invalid credentials'}), 401

@auth_bp.route('/guest-login', methods=['POST'])
def guest_login():
    user = User.query.filter_by(email='visualizador@hyundai.com').first()
    
    if not user:
        return jsonify({'message': 'Guest user not found'}), 404
        
    access_token = create_access_token(identity=str(user.id))
    return jsonify({
        'access_token': access_token,
        'user': user.to_dict()
    }), 200

@auth_bp.route('/me', methods=['GET'])
@jwt_required()
def me():
    current_user_id = int(get_jwt_identity())
    user = User.query.get(current_user_id)
    return jsonify(user.to_dict()), 200
