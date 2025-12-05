from app import create_app
from extensions import db
from models.user import User, UserRole

app = create_app()

def create_viewer_user():
    with app.app_context():
        email = "visualizador@hyundai.com"
        user = User.query.filter_by(email=email).first()
        
        if not user:
            print(f"Creating user {email}...")
            user = User(
                nome="Visualizador",
                email=email,
                hmc="00000000", # Dummy HMC for guest
                role=UserRole.VISUALIZADOR
            )
            user.set_password("visualizador123") # Default password, though we will use ID-based login for guest
            db.session.add(user)
            db.session.commit()
            print("User created successfully.")
        else:
            print(f"User {email} already exists.")

if __name__ == "__main__":
    create_viewer_user()
