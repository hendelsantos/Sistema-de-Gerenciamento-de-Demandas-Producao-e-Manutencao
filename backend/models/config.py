from extensions import db

class AppConfig(db.Model):
    __tablename__ = 'app_config'

    id = db.Column(db.Integer, primary_key=True)
    email_aprovador_1 = db.Column(db.String(120), nullable=True)
    email_aprovador_2 = db.Column(db.String(120), nullable=True)
    email_executor_default = db.Column(db.String(120), nullable=True)

    def to_dict(self):
        return {
            'id': self.id,
            'email_aprovador_1': self.email_aprovador_1,
            'email_aprovador_2': self.email_aprovador_2,
            'email_executor_default': self.email_executor_default
        }
