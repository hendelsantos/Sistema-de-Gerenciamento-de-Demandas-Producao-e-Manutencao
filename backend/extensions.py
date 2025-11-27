from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate
from flask_jwt_extended import JWTManager
from flask_cors import CORS
# from flask_mail import Mail  # Disabled for now

db = SQLAlchemy()
migrate = Migrate()
jwt = JWTManager()
cors = CORS()
mail = None  # Disabled - will configure later
# mail = Mail()
