from extensions import db
from datetime import datetime

class Execution(db.Model):
    __tablename__ = 'executions'

    id = db.Column(db.Integer, primary_key=True)
    demand_id = db.Column(db.Integer, db.ForeignKey('demands.id'), nullable=False)
    executor_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    descricao_atividade = db.Column(db.Text, nullable=True)
    data_inicio = db.Column(db.DateTime, default=datetime.utcnow)
    data_fim = db.Column(db.DateTime, nullable=True)
    observacao = db.Column(db.Text, nullable=True)
    foto_final = db.Column(db.String(255), nullable=True)
    pm04_id = db.Column(db.String(50), nullable=True)

    executor = db.relationship('User', backref='executions')

    def to_dict(self):
        return {
            'id': self.id,
            'demand_id': self.demand_id,
            'executor_id': self.executor_id,
            'executor_name': self.executor.nome if self.executor else None,
            'descricao_atividade': self.descricao_atividade,
            'data_inicio': self.data_inicio.isoformat() if self.data_inicio else None,
            'data_fim': self.data_fim.isoformat() if self.data_fim else None,
            'observacao': self.observacao,
            'foto_final': self.foto_final,
            'pm04_id': self.pm04_id
        }
