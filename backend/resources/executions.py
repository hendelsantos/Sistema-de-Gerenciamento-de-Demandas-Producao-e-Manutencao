from flask import Blueprint, request, jsonify
from extensions import db
from models.demand import Demand, DemandStatus
from models.execution import Execution
from models.status_history import StatusHistory
from flask_jwt_extended import jwt_required, get_jwt_identity
from datetime import datetime

executions_bp = Blueprint('executions', __name__)

@executions_bp.route('/<int:id>/execucao/iniciar', methods=['POST'])
@jwt_required()
def start_execution(id):
    demand = Demand.query.get_or_404(id)
    current_user_id = get_jwt_identity()
    
    if demand.status != DemandStatus.AGUARDANDO_EXECUCAO:
        return jsonify({'message': 'Invalid status to start execution'}), 400
        
    execution = Execution(
        demand_id=id,
        executor_id=current_user_id,
        data_inicio=datetime.utcnow()
    )
    
    demand.status = DemandStatus.EXECUTANDO
    history = StatusHistory(demand_id=id, status=DemandStatus.EXECUTANDO)
    
    db.session.add(execution)
    db.session.add(history)
    db.session.commit()
    
    return jsonify({'message': 'Execution started'}), 200

@executions_bp.route('/<int:id>/execucao/finalizar', methods=['POST'])
@jwt_required()
def finish_execution(id):
    demand = Demand.query.get_or_404(id)
    data = request.get_json()
    
    if demand.status != DemandStatus.EXECUTANDO:
        return jsonify({'message': 'Invalid status to finish execution'}), 400
        
    execution = Execution.query.filter_by(demand_id=id).first()
    if not execution:
        return jsonify({'message': 'Execution record not found'}), 404
        
    execution.data_fim = datetime.utcnow()
    execution.descricao_atividade = data.get('descricao_atividade')
    execution.observacao = data.get('observacao')
    execution.foto_final = data.get('foto_final')
    
    pm04_id = data.get('pm04_id')
    if not pm04_id:
        return jsonify({'message': 'PM04 ID is required (use N/A if not applicable)'}), 400
    execution.pm04_id = pm04_id
    
    demand.status = DemandStatus.CONCLUIDO
    history = StatusHistory(demand_id=id, status=DemandStatus.CONCLUIDO)
    
    db.session.add(history)
    db.session.commit()
    
    # Email notifications will be configured later
    print(f"[INFO] Demanda {demand.id} concluída")
    
    return jsonify({'message': 'Execution finished'}), 200
