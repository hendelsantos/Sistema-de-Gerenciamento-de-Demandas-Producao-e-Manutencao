import os
import sys

# Add backend directory to path
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '../backend')))

from app import create_app
from extensions import db
from models.user import User, UserRole
from models.config import AppConfig

app = create_app()

with app.app_context():
    # Create tables
    db.create_all()
    
    # Create Admin User
    if not User.query.filter_by(email='admin@example.com').first():
        admin = User(
            nome='Administrador',
            email='admin@example.com',
            role=UserRole.ADMIN
        )
        admin.set_password('admin123')
        db.session.add(admin)
        print("Admin user created.")
        
    # Create Default Config
    if not AppConfig.query.first():
        config = AppConfig(
            email_aprovador_1='aprovador1@example.com',
            email_aprovador_2='aprovador2@example.com',
            email_executor_default='executor@example.com'
        )
        db.session.add(config)
        print("Default config created.")
        
    db.session.commit()
    print("Initialization complete.")
