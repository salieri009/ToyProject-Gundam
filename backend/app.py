from chalice import Chalice, Response
from chalicelib.database import init_db
from chalicelib.routes import register_routes
from chalicelib.config import CORS_HEADERS

app = Chalice(app_name='gundam-universe-board')

# Initialize database
init_db()

# Register all routes
register_routes(app)

@app.middleware('all')
def add_cors_headers(event, get_response):
    response = get_response(event)
    response.headers.update(CORS_HEADERS)
    return response

@app.route('/health', methods=['GET'])
def health_check():
    return {'status': 'healthy'} 