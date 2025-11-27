from flask import Blueprint, request, jsonify
from extensions import db
from models.demand import Demand, DemandStatus
from models.photo import Photo
from models.status_history import StatusHistory
from models.config import AppConfig
from flask_jwt_extended import jwt_required, get_jwt_identity
from datetime import datetime

demands_bp = Blueprint('demands', __name__)

@demands_bp.route('', methods=['POST'])
@jwt_required()
def create_demand():
    print("[DEBUG] Starting create_demand")
    data = request.get_json()
    print(f"[DEBUG] Received data: {data}")
    current_user_id = int(get_jwt_identity())
    print(f"[DEBUG] Current user ID: {current_user_id}")
    
    try:
        demand = Demand(
            titulo=data.get('titulo'),
            problema=data.get('problema'),
            processo=data.get('processo'),
            equipamento=data.get('equipamento'),
            gut=int(data.get('gut', 1)),
            created_by=current_user_id,
            status=DemandStatus.PENDENTE_APROVACAO_1
        )
        print(f"[DEBUG] Demand object created: {demand.titulo}")
        
        db.session.add(demand)
        print("[DEBUG] Demand added to session")
        db.session.flush() # Get ID
        print(f"[DEBUG] Demand flushed, ID: {demand.id}")
        
        # Add initial history
        history = StatusHistory(
            demand_id=demand.id,
            status=DemandStatus.PENDENTE_APROVACAO_1
        )
        db.session.add(history)
        print("[DEBUG] History added")
        
        # Handle photos (assuming URLs are passed for now, upload logic separate)
        if 'photos' in data:
            for photo_url in data['photos']:
                photo = Photo(demand_id=demand.id, filename='todo', url=photo_url)
                db.session.add(photo)
        print("[DEBUG] Photos processed")
                
        db.session.commit()
        print("[DEBUG] Session committed successfully")
        
        # Email notifications will be configured later
        print(f"[INFO] Demanda criada: {demand.id} - {demand.titulo}")
        
        return jsonify(demand.to_dict()), 201
    except Exception as e:
        print(f"[ERROR] Exception in create_demand: {type(e).__name__}: {str(e)}")
        import traceback
        traceback.print_exc()
        db.session.rollback()
        return jsonify({"error": str(e)}), 500

@demands_bp.route('', methods=['GET'])
@jwt_required()
def get_demands():
    demands = Demand.query.order_by(Demand.data_criacao.desc()).all()
    return jsonify([d.to_dict() for d in demands]), 200

@demands_bp.route('/<int:id>', methods=['GET'])
@jwt_required()
def get_demand(id):
    demand = Demand.query.get_or_404(id)
    return jsonify(demand.to_dict()), 200

@demands_bp.route('/<int:id>', methods=['PUT'])
@jwt_required()
def update_demand(id):
    demand = Demand.query.get_or_404(id)
    data = request.get_json()
    
    # Allow updates only if not yet approved? Or admin?
    # For now, basic update
    if 'titulo' in data: demand.titulo = data['titulo']
    if 'problema' in data: demand.problema = data['problema']
    
    db.session.commit()
    return jsonify(demand.to_dict()), 200
