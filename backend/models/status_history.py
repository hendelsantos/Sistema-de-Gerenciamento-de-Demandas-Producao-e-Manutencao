from extensions import db
from datetime import datetime
from models.demand import DemandStatus

class StatusHistory(db.Model):
    __tablename__ = 'status_history'

    id = db.Column(db.Integer, primary_key=True)
    demand_id = db.Column(db.Integer, db.ForeignKey('demands.id'), nullable=False)
    status = db.Column(db.Enum(DemandStatus), nullable=False)
    timestamp = db.Column(db.DateTime, default=datetime.utcnow)

    def to_dict(self):
        return {
            'id': self.id,
            'demand_id': self.demand_id,
            'status': self.status.value,
            'timestamp': self.timestamp.isoformat()
        }
