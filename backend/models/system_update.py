from extensions import db
from datetime import datetime

class SystemUpdate(db.Model):
    __tablename__ = 'system_updates'

    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(200), nullable=False)
    content = db.Column(db.Text, nullable=False)
    author_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    author = db.relationship('User', backref='system_updates')

    def to_dict(self):
        return {
            'id': self.id,
            'title': self.title,
            'content': self.content,
            'author_name': self.author.nome if self.author else 'Unknown',
            'created_at': self.created_at.isoformat()
        }
