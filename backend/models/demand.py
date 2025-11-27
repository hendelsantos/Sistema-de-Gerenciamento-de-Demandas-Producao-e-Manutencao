from extensions import db
from datetime import datetime
import enum

class DemandStatus(enum.Enum):
    PENDENTE_APROVACAO_1 = "pendente_aprovacao_1"
    REJEITADO_APROVACAO_1 = "rejeitado_aprovacao_1"
    PENDENTE_APROVACAO_2 = "pendente_aprovacao_2"
    REJEITADO_APROVACAO_2 = "rejeitado_aprovacao_2"
    AGUARDANDO_EXECUCAO = "aguardando_execucao"
    EXECUTANDO = "executando"
    CONCLUIDO = "concluido"

class Demand(db.Model):
    __tablename__ = 'demands'

    id = db.Column(db.Integer, primary_key=True)
    titulo = db.Column(db.String(200), nullable=False)
    problema = db.Column(db.Text, nullable=False)
    processo = db.Column(db.String(100), nullable=False)
    equipamento = db.Column(db.String(100), nullable=False)
    gut = db.Column(db.Integer, nullable=False)
    data_criacao = db.Column(db.DateTime, default=datetime.utcnow)
    created_by = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    status = db.Column(db.Enum(DemandStatus), default=DemandStatus.PENDENTE_APROVACAO_1, nullable=False)

    creator = db.relationship('User', backref='demands')
    photos = db.relationship('Photo', backref='demand', lazy=True)
    approvals = db.relationship('Approval', backref='demand', lazy=True)
    execution = db.relationship('Execution', backref='demand', uselist=False, lazy=True)
    history = db.relationship('StatusHistory', backref='demand', lazy=True)

    def to_dict(self):
        return {
            'id': self.id,
            'titulo': self.titulo,
            'problema': self.problema,
            'processo': self.processo,
            'equipamento': self.equipamento,
            'gut': self.gut,
            'data_criacao': self.data_criacao.isoformat(),
            'created_by': self.created_by,
            'creator_name': self.creator.nome if self.creator else None,
            'status': self.status.value,
            'photos': [p.to_dict() for p in self.photos]
        }
