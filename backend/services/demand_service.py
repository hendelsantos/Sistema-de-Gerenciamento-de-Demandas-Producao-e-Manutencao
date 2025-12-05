import os
import logging
from datetime import datetime
from werkzeug.utils import secure_filename
from extensions import db
from models.demand import Demand, DemandStatus
from models.photo import Photo
from models.status_history import StatusHistory
from flask import current_app

# Configurar logger
logger = logging.getLogger(__name__)

class DemandService:
    @staticmethod
    def create_demand(data, files, user_id):
        logger.info(f"Starting create_demand for user {user_id}")
        
        try:
            demand = Demand(
                titulo=data.get('titulo'),
                problema=data.get('problema'),
                processo=data.get('processo'),
                equipamento=data.get('equipamento'),
                gut=int(data.get('gut', 1)),
                created_by=user_id,
                status=DemandStatus.PENDENTE_APROVACAO_1
            )
            
            db.session.add(demand)
            db.session.flush() # Obter ID
            logger.debug(f"Demand created with ID: {demand.id}")
            
            # Adicionar histórico inicial
            history = StatusHistory(
                demand_id=demand.id,
                status=DemandStatus.PENDENTE_APROVACAO_1
            )
            db.session.add(history)
            
            # Lidar com uploads de arquivos
            upload_folder = current_app.config.get('UPLOAD_FOLDER')
            if not os.path.exists(upload_folder):
                os.makedirs(upload_folder)
                logger.info(f"Created upload directory: {upload_folder}")
                
            for file in files:
                if file and file.filename:
                    filename = secure_filename(file.filename)
                    timestamp = datetime.now().strftime('%Y%m%d_%H%M%S')
                    unique_filename = f"{timestamp}_{filename}"
                    file_path = os.path.join(upload_folder, unique_filename)
                    file.save(file_path)
                    
                    photo_url = f"/static/uploads/{unique_filename}"
                    photo = Photo(demand_id=demand.id, filename=unique_filename, url=photo_url)
                    db.session.add(photo)
                    logger.debug(f"Photo saved: {unique_filename}")

            db.session.commit()
            logger.info("Demand created successfully")
            return demand
            
        except Exception as e:
            logger.error(f"Error creating demand: {str(e)}", exc_info=True)
            db.session.rollback()
            raise e

    @staticmethod
    def get_demands(page=1, per_page=10, status_filter=None):
        query = Demand.query
        
        if status_filter:
            statuses = status_filter.split(',')
            query = query.filter(Demand.status.in_(statuses))
            
        # Paginação eficiente no banco de dados
        pagination = query.order_by(Demand.data_criacao.desc()).paginate(
            page=page, per_page=per_page, error_out=False
        )
        
        return {
            'items': [d.to_dict() for d in pagination.items],
            'total': pagination.total,
            'pages': pagination.pages,
            'current_page': page,
            'has_next': pagination.has_next,
            'has_prev': pagination.has_prev
        }

    @staticmethod
    def get_demand_by_id(demand_id):
        return Demand.query.get_or_404(demand_id)

    @staticmethod
    def update_demand(demand_id, data):
        demand = Demand.query.get_or_404(demand_id)
        
        if 'titulo' in data: demand.titulo = data['titulo']
        if 'problema' in data: demand.problema = data['problema']
        
        db.session.commit()
        return demand
