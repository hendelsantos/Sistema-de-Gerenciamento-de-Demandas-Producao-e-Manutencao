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
    
    # Check if it's a multipart request (file upload)
    if request.content_type and 'multipart/form-data' in request.content_type:
        data = request.form
        files = request.files.getlist('photos')
        print(f"[DEBUG] Received multipart data: {data}")
        print(f"[DEBUG] Received files: {[f.filename for f in files]}")
    else:
        data = request.get_json()
        files = []
        print(f"[DEBUG] Received json data: {data}")

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
        db.session.flush() # Get ID
        print(f"[DEBUG] Demand flushed, ID: {demand.id}")
        
        # Add initial history
        history = StatusHistory(
            demand_id=demand.id,
            status=DemandStatus.PENDENTE_APROVACAO_1
        )
        db.session.add(history)
        
        # Handle file uploads
        import os
        from werkzeug.utils import secure_filename
        
        UPLOAD_FOLDER = os.path.join(os.getcwd(), 'static', 'uploads')
        if not os.path.exists(UPLOAD_FOLDER):
            os.makedirs(UPLOAD_FOLDER)
            
        for file in files:
            if file and file.filename:
                filename = secure_filename(file.filename)
                # Add timestamp to filename to avoid collisions
                timestamp = datetime.now().strftime('%Y%m%d_%H%M%S')
                unique_filename = f"{timestamp}_{filename}"
                file_path = os.path.join(UPLOAD_FOLDER, unique_filename)
                file.save(file_path)
                
                # Create Photo record
                # URL should be relative to static folder
                photo_url = f"/static/uploads/{unique_filename}"
                photo = Photo(demand_id=demand.id, filename=unique_filename, url=photo_url)
                db.session.add(photo)
                print(f"[DEBUG] Photo saved: {unique_filename}")

        # Handle existing photo URLs (if any passed via JSON)
        if 'photos' in data and not files:
             # This part might need adjustment if we want to support both, 
             # but for now let's assume JSON photos are just URLs
             # If data is from form, 'photos' might be the file list key, handled above
             pass

        db.session.commit()
        print("[DEBUG] Session committed successfully")
        
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
    page = request.args.get('page', 1, type=int)
    per_page = request.args.get('per_page', 10, type=int)
    status_filter = request.args.get('status')
    
    query = Demand.query
    
    if status_filter:
        statuses = status_filter.split(',')
        query = query.filter(Demand.status.in_(statuses))
        
    demands = query.order_by(Demand.data_criacao.desc()).all()
    demands_list = [d.to_dict() for d in demands]
    
    if request.args.get('page'):
        start = (page - 1) * per_page
        end = start + per_page
        paginated_items = demands_list[start:end]
        
        return jsonify({
            'demands': paginated_items,
            'total': len(demands_list),
            'pages': (len(demands_list) + per_page - 1) // per_page,
            'current_page': page
        }), 200
        
    return jsonify(demands_list), 200

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
