from flask import Blueprint, request, jsonify
from extensions import db
from models.demand import Demand, DemandStatus
from models.approval import Approval, ApprovalStatus
from models.status_history import StatusHistory
from models.config import AppConfig
from flask_jwt_extended import jwt_required, get_jwt_identity
from datetime import datetime

approvals_bp = Blueprint('approvals', __name__)

@approvals_bp.route('/<int:id>/aprovar-nivel-1', methods=['POST'])
@jwt_required()
def approve_level_1(id):
    demand = Demand.query.get_or_404(id)
    current_user_id = get_jwt_identity()
    data = request.get_json()
    
    if demand.status != DemandStatus.PENDENTE_APROVACAO_1:
        return jsonify({'message': 'Invalid status for approval'}), 400
        
    # Allow GUT revision
    new_gut = data.get('gut')
    if new_gut:
        demand.gut = new_gut

    approval = Approval(
        demand_id=id,
        aprovador_id=current_user_id,
        nivel=1,
        status=ApprovalStatus.APROVADO,
        justificativa=data.get('justificativa')
    )
    
    demand.status = DemandStatus.PENDENTE_APROVACAO_2
    
    history = StatusHistory(demand_id=id, status=DemandStatus.PENDENTE_APROVACAO_2)
    
    db.session.add(approval)
    db.session.add(history)
    db.session.commit()
    
    # Trigger email
    config = AppConfig.query.first()
    if config and config.email_aprovador_2:
        print(f"[INFO] Demanda {demand.id} aprovada no nível 1")
    
    return jsonify({'message': 'Approved level 1'}), 200

@approvals_bp.route('/<int:id>/rejeitar-nivel-1', methods=['POST'])
@jwt_required()
def reject_level_1(id):
    demand = Demand.query.get_or_404(id)
    current_user_id = get_jwt_identity()
    data = request.get_json()
    
    approval = Approval(
        demand_id=id,
        aprovador_id=current_user_id,
        nivel=1,
        status=ApprovalStatus.REJEITADO,
        justificativa=data.get('justificativa')
    )
    
    demand.status = DemandStatus.REJEITADO_APROVACAO_1
    history = StatusHistory(demand_id=id, status=DemandStatus.REJEITADO_APROVACAO_1)
    
    db.session.add(approval)
    db.session.add(history)
    db.session.commit()
    
    # Trigger email to creator
    if demand.creator:
        print(f"[INFO] Demanda {demand.id} rejeitada no nível 1")
    
    return jsonify({'message': 'Rejected level 1'}), 200

@approvals_bp.route('/<int:id>/aprovar-nivel-2', methods=['POST'])
@jwt_required()
def approve_level_2(id):
    demand = Demand.query.get_or_404(id)
    current_user_id = get_jwt_identity()
    data = request.get_json()
    
    if demand.status != DemandStatus.PENDENTE_APROVACAO_2:
        return jsonify({'message': 'Invalid status for approval'}), 400
        
    classificacao = data.get('classificacao')
    if not classificacao:
        return jsonify({'message': 'Classificacao is required'}), 400
        
    approval = Approval(
        demand_id=id,
        aprovador_id=current_user_id,
        nivel=2,
        status=ApprovalStatus.APROVADO,
        justificativa=data.get('justificativa')
    )
    
    demand.status = DemandStatus.AGUARDANDO_EXECUCAO
    demand.classificacao = classificacao
    history = StatusHistory(demand_id=id, status=DemandStatus.AGUARDANDO_EXECUCAO)
    
    db.session.add(approval)
    db.session.add(history)
    db.session.commit()
    
    # Trigger email to executor (default or specific?)
    # For now using default executor email from config
    config = AppConfig.query.first()
    if config and config.email_executor_default:
        print(f"[INFO] Demanda {demand.id} aprovada no nível 2")
    
    return jsonify({'message': 'Approved level 2'}), 200

@approvals_bp.route('/<int:id>/rejeitar-nivel-2', methods=['POST'])
@jwt_required()
def reject_level_2(id):
    demand = Demand.query.get_or_404(id)
    current_user_id = get_jwt_identity()
    data = request.get_json()
    
    approval = Approval(
        demand_id=id,
        aprovador_id=current_user_id,
        nivel=2,
        status=ApprovalStatus.REJEITADO,
        justificativa=data.get('justificativa')
    )
    
    demand.status = DemandStatus.REJEITADO_APROVACAO_2
    history = StatusHistory(demand_id=id, status=DemandStatus.REJEITADO_APROVACAO_2)
    
    db.session.add(approval)
    db.session.add(history)
    db.session.commit()
    
    # Trigger email to creator and approver 1 (optional, for now just creator)
    if demand.creator:
        print(f"[INFO] Demanda {demand.id} rejeitada no nível 2")
    
    return jsonify({'message': 'Rejected level 2'}), 200
