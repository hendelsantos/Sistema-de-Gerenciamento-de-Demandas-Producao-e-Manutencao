from extensions import db
from datetime import datetime
import enum

class BugStatus(enum.Enum):
    OPEN = "OPEN"
    CLOSED = "CLOSED"

class BugReport(db.Model):
    __tablename__ = 'bug_reports'

    id = db.Column(db.Integer, primary_key=True)
    description = db.Column(db.Text, nullable=False)
    reporter_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    status = db.Column(db.Enum(BugStatus), default=BugStatus.OPEN, nullable=False)
    developer_response = db.Column(db.Text, nullable=True)
    response_at = db.Column(db.DateTime, nullable=True)
    responder_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=True)

    reporter = db.relationship('User', foreign_keys=[reporter_id], backref='reported_bugs')
    responder = db.relationship('User', foreign_keys=[responder_id], backref='responded_bugs')

    def to_dict(self):
        return {
            'id': self.id,
            'description': self.description,
            'reporter_name': self.reporter.nome if self.reporter else 'Unknown',
            'created_at': self.created_at.isoformat(),
            'status': self.status.value,
            'developer_response': self.developer_response,
            'response_at': self.response_at.isoformat() if self.response_at else None,
            'responder_name': self.responder.nome if self.responder else None
        }
