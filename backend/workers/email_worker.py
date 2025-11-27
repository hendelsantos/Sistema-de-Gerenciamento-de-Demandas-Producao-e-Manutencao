import os
import sys

# Add backend directory to path so we can import app and extensions
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

from redis import Redis
from rq import Worker, Queue, Connection
from app import create_app

listen = ['default']

if __name__ == '__main__':
    app = create_app()
    
    redis_url = app.config['REDIS_URL']
    conn = Redis.from_url(redis_url)

    with app.app_context():
        with Connection(conn):
            worker = Worker(list(map(Queue, listen)))
            worker.work()
