from flask import Flask
from config import Config, DevelopmentConfig
from extensions import db, migrate, jwt, cors, mail

def create_app(config_class=DevelopmentConfig):
    app = Flask(__name__)
    app.config.from_object(config_class)

    # Initialize extensions
    db.init_app(app)
    migrate.init_app(app, db)
    jwt.init_app(app)
    cors.init_app(app)
    # mail.init_app(app)  # Disabled - will configure later

    # Import models to ensure they are registered with SQLAlchemy
    from models.user import User
    from models.demand import Demand
    from models.approval import Approval
    from models.execution import Execution
    from models.photo import Photo
    from models.status_history import StatusHistory
    from models.config import AppConfig

    # Register Blueprints
    from resources.auth import auth_bp
    from resources.demands import demands_bp
    from resources.approvals import approvals_bp
    from resources.executions import executions_bp
    from resources.admin import admin_bp

    app.register_blueprint(auth_bp, url_prefix='/auth')
    app.register_blueprint(demands_bp, url_prefix='/demands')
    app.register_blueprint(approvals_bp, url_prefix='/demands') # Approvals are sub-resources of demands
    app.register_blueprint(executions_bp, url_prefix='/demands') # Executions are sub-resources of demands
    app.register_blueprint(admin_bp, url_prefix='/admin')

    return app

if __name__ == '__main__':
    app = create_app()
    app.run(host='0.0.0.0', port=5000)
