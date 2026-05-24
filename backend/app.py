"""
Chalice 앱 엔트리포인트
- CORS 허용 도메인 화이트리스트 적용
- 시작 시 필수 환경변수 검증
"""
from chalice import Chalice
import logging

from chalicelib.database import init_db
from chalicelib.routes import register_routes
from chalicelib.config import get_cors_headers, validate_config

# 로깅 설정
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger('gundam-universe-board')

app = Chalice(app_name='gundam-universe-board')

# 시작 시 환경변수 검증
validate_config()

# 데이터베이스 초기화
try:
    init_db()
    logger.info("Database initialized successfully.")
except Exception as e:
    logger.error(f"Failed to initialize database: {e}")

# 라우트 등록
register_routes(app)


@app.middleware('all')
def add_cors_headers(event, get_response):
    """CORS 화이트리스트 동적 반영 미들웨어"""
    # preflight 요청 등에서 Origin 헤더 가져오기
    origin = event.headers.get('origin') or event.headers.get('Origin', '')
    response = get_response(event)
    response.headers.update(get_cors_headers(origin))
    return response


@app.route('/health', methods=['GET'])
def health_check():
    """헬스 체크 API"""
    return {'status': 'healthy'}