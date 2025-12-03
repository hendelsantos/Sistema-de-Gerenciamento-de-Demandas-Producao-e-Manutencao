from extensions import db
from werkzeug.security import generate_password_hash, check_password_hash
import enum

class UserRole(enum.Enum):
    VISUALIZADOR = "VISUALIZADOR"
    EMITENTE = "EMITENTE"
    APROVADOR_1 = "APROVADOR_1"
    APROVADOR_2 = "APROVADOR_2"
    EXECUTOR = "EXECUTOR"
    ADMIN = "ADMIN"

class User(db.Model):
    __tablename__ = 'users'

    id = db.Column(db.Integer, primary_key=True)
    nome = db.Column(db.String(100), nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    hmc = db.Column(db.String(20), unique=True, nullable=False)
    password_hash = db.Column(db.String(256), nullable=False)
    role = db.Column(db.Enum(UserRole), default=UserRole.VISUALIZADOR, nullable=False)
    ativo = db.Column(db.Boolean, default=True)

    def set_password(self, password):
        self.password_hash = generate_password_hash(password)

    def check_password(self, password):
        return check_password_hash(self.password_hash, password)

    def to_dict(self):
        return {
            'id': self.id,
            'nome': self.nome,
            'email': self.email,
            'hmc': self.hmc,
            'role': self.role.value,
            'ativo': self.ativo
        }
