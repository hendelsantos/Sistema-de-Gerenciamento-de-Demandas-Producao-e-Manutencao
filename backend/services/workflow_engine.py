# Email notifications are disabled for now - will be configured later
# from redis import Redis
# from rq import Queue
# from flask import current_app
# from services.email_service import send_email

# def get_queue():
#     redis_url = current_app.config['REDIS_URL']
#     conn = Redis.from_url(redis_url)
#     return Queue(connection=conn)

def trigger_notification(event_type, demand, recipient_email, extra_context=None):
    """
    Logs notification events. Email sending will be configured later.
    """
    subject = ""
    body = ""
    
    if event_type == 'NEW_DEMAND':
        subject = f"Nova Demanda (Nível 1): {demand.titulo}"
        body = f"Uma nova demanda foi criada e aguarda sua aprovação.\n\nTítulo: {demand.titulo}\nProblema: {demand.problema}\n\nAcesse o sistema para aprovar."
        
    elif event_type == 'APPROVED_LEVEL_1':
        subject = f"Nova Demanda (Nível 2): {demand.titulo}"
        body = f"Uma demanda foi aprovada no nível 1 e aguarda sua aprovação.\n\nTítulo: {demand.titulo}\n\nAcesse o sistema para aprovar."
        
    elif event_type == 'REJECTED':
        subject = f"Demanda Rejeitada: {demand.titulo}"
        body = f"Sua demanda foi rejeitada.\n\nJustificativa: {extra_context.get('justificativa') if extra_context else 'N/A'}"
        
    elif event_type == 'APPROVED_LEVEL_2':
        subject = f"Nova Demanda para Execução: {demand.titulo}"
        body = f"Uma demanda foi aprovada e está aguardando execução.\n\nTítulo: {demand.titulo}\n\nAcesse o sistema para iniciar."
        
    elif event_type == 'COMPLETED':
        subject = f"Demanda Concluída: {demand.titulo}"
        body = f"Sua demanda foi concluída pelo executor.\n\nTítulo: {demand.titulo}\n\nAcesse o sistema para ver os detalhes."

    # Log notification instead of sending email (email will be configured later)
    print(f"[NOTIFICATION] To: {recipient_email} | Subject: {subject}")
    print(f"[NOTIFICATION] Body: {body[:100]}...")
