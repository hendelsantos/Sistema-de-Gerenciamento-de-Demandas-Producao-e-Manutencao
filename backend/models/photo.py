from extensions import db

class Photo(db.Model):
    __tablename__ = 'photos'

    id = db.Column(db.Integer, primary_key=True)
    demand_id = db.Column(db.Integer, db.ForeignKey('demands.id'), nullable=False)
    filename = db.Column(db.String(255), nullable=False)
    url = db.Column(db.String(500), nullable=False)

    def to_dict(self):
        return {
            'id': self.id,
            'demand_id': self.demand_id,
            'filename': self.filename,
            'url': self.url
        }
