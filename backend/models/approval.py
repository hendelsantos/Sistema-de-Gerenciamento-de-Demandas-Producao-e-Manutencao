from extensions import db
from datetime import datetime
import enum

class ApprovalStatus(enum.Enum):
    APROVADO = "aprovado"
    REJEITADO = "rejeitado"

class Approval(db.Model):
    __tablename__ = 'approvals'

    id = db.Column(db.Integer, primary_key=True)
    demand_id = db.Column(db.Integer, db.ForeignKey('demands.id'), nullable=False)
    aprovador_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    nivel = db.Column(db.Integer, nullable=False) # 1 or 2
    status = db.Column(db.Enum(ApprovalStatus), nullable=False)
    justificativa = db.Column(db.Text, nullable=True)
    data = db.Column(db.DateTime, default=datetime.utcnow)

    aprovador = db.relationship('User', backref='approvals')

    def to_dict(self):
        return {
            'id': self.id,
            'demand_id': self.demand_id,
            'aprovador_id': self.aprovador_id,
            'aprovador_name': self.aprovador.nome if self.aprovador else None,
            'nivel': self.nivel,
            'status': self.status.value,
            'justificativa': self.justificativa,
            'data': self.data.isoformat()
        }
