from flask_mail import Message
from extensions import mail
from flask import current_app

def send_email(subject, recipients, body):
    """
    Sends an email using Flask-Mail.
    This function is intended to be run by the RQ worker.
    """
    # We need to create an app context if running outside of one (like in a worker)
    # However, the worker usually initializes the app.
    
    msg = Message(subject, recipients=recipients)
    msg.body = body
    
    try:
        mail.send(msg)
        print(f"Email sent to {recipients}")
    except Exception as e:
        print(f"Failed to send email: {e}")
