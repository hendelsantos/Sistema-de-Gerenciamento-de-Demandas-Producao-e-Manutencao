from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from services.demand_service import DemandService
import logging

demands_bp = Blueprint('demands', __name__)
logger = logging.getLogger(__name__)

@demands_bp.route('', methods=['POST'])
@jwt_required()
def create_demand():
    try:
        if request.content_type and 'multipart/form-data' in request.content_type:
            data = request.form
            files = request.files.getlist('photos')
        else:
            data = request.get_json()
            files = []

        current_user_id = int(get_jwt_identity())
        
        demand = DemandService.create_demand(data, files, current_user_id)
        return jsonify(demand.to_dict()), 201
        
    except Exception as e:
        logger.error(f"Controller error: {str(e)}")
        return jsonify({"error": str(e)}), 500

@demands_bp.route('', methods=['GET'])
@jwt_required()
def get_demands():
    page = request.args.get('page', 1, type=int)
    per_page = request.args.get('per_page', 10, type=int)
    status_filter = request.args.get('status')
    
    result = DemandService.get_demands(page, per_page, status_filter)
    
    return jsonify({
        'demands': result['items'],
        'total': result['total'],
        'pages': result['pages'],
        'current_page': result['current_page']
    }), 200

@demands_bp.route('/<int:id>', methods=['GET'])
@jwt_required()
def get_demand(id):
    demand = DemandService.get_demand_by_id(id)
    return jsonify(demand.to_dict()), 200

@demands_bp.route('/<int:id>', methods=['PUT'])
@jwt_required()
def update_demand(id):
    data = request.get_json()
    demand = DemandService.update_demand(id, data)
    return jsonify(demand.to_dict()), 200
