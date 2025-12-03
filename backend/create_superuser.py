from app import create_app
from extensions import db
from models.user import User, UserRole

app = create_app()

def create_superuser():
    with app.app_context():
        # Check if user exists
        user = User.query.filter_by(hmc='37100655').first()
        if user:
            print("Superuser already exists.")
            return

        # Create superuser
        superuser = User(
            nome='Hendel Santos',
            email='hendel.santos@hyundai-brasil.com', # Assuming email based on request context or placeholder
            hmc='37100655',
            role=UserRole.ADMIN,
            ativo=True
        )
        superuser.set_password('admin123#')
        
        db.session.add(superuser)
        db.session.commit()
        print("Superuser created successfully: HMC 37100655")

if __name__ == '__main__':
    create_superuser()
