"""
설정 관리 모듈
- JWT 기본값 완전 제거
- validate_config()로 시작 시 필수 환경변수 검증
"""
import os
from dotenv import load_dotenv

load_dotenv()


class Config:
    """애플리케이션 설정 — 모든 시크릿은 환경변수 필수"""

    # 데이터베이스 설정
    DATABASE_URL: str = os.getenv('DATABASE_URL', 'postgresql://postgres:postgres@localhost:5432/gundam_board')

    # JWT 설정 — 기본값 없음 (프로덕션 안전)
    JWT_SECRET_KEY: str = os.getenv('JWT_SECRET', '')
    JWT_ALGORITHM: str = 'HS256'
    JWT_EXPIRATION_HOURS: int = 24
    REFRESH_TOKEN_EXPIRATION_DAYS: int = 30

    # Google OAuth 설정
    GOOGLE_CLIENT_ID: str = os.getenv('GOOGLE_CLIENT_ID', '')
    GOOGLE_CLIENT_SECRET: str = os.getenv('GOOGLE_CLIENT_SECRET', '')

    # E2E 테스트 모드 — True일 때만 테스트 전용 로그인 시드(/auth/test-login)가 열린다.
    # 프로덕션에서는 절대 활성화하지 말 것 (인증 우회 표면).
    E2E_TEST_MODE: bool = os.getenv('E2E_TEST_MODE', '').strip().lower() in ('1', 'true', 'yes', 'on')

    # CORS 허용 도메인 (쉼표 구분)
    CORS_ALLOWED_ORIGINS: str = os.getenv(
        'CORS_ALLOWED_ORIGINS',
        'http://localhost:3000,http://localhost:5173'
    )

    # 페이지네이션 설정
    DEFAULT_PAGE_SIZE: int = 10
    MAX_PAGE_SIZE: int = 50

    # 검증 규칙
    POST_TITLE_MAX_LENGTH: int = 200
    POST_CONTENT_MAX_LENGTH: int = 10000
    COMMENT_CONTENT_MAX_LENGTH: int = 1000


config = Config()


# CORS 헤더 (화이트리스트 기반)
def get_cors_headers(origin: str = '') -> dict:
    """요청 Origin에 따라 CORS 헤더 반환"""
    allowed = [o.strip() for o in config.CORS_ALLOWED_ORIGINS.split(',') if o.strip()]
    allow_origin = origin if origin in allowed else (allowed[0] if allowed else '')
    return {
        'Access-Control-Allow-Origin': allow_origin,
        'Access-Control-Allow-Headers': 'Content-Type,Authorization',
        'Access-Control-Allow-Methods': 'GET,POST,PUT,DELETE,OPTIONS',
        'Access-Control-Allow-Credentials': 'true',
    }


# 하위 호환성 유지
CORS_HEADERS = get_cors_headers()


def validate_config():
    """필수 환경변수가 설정되었는지 시작 시 검증"""
    errors = []
    if not config.JWT_SECRET_KEY:
        errors.append('JWT_SECRET 환경변수가 설정되지 않았습니다.')
    if not config.GOOGLE_CLIENT_ID:
        errors.append('GOOGLE_CLIENT_ID 환경변수가 설정되지 않았습니다.')
    import logging
    logger = logging.getLogger(__name__)
    if errors:
        for e in errors:
            logger.warning(f'[CONFIG WARNING] {e}')
    # 운영 환경 오설정 조기 탐지: 테스트 로그인 시드가 열려 있으면 경고
    if config.E2E_TEST_MODE:
        logger.warning(
            '[SECURITY WARNING] E2E_TEST_MODE 가 활성화되어 /auth/test-login 시드가 열려 있습니다. '
            '프로덕션에서는 절대 활성화하지 마십시오.'
        )
    return len(errors) == 0