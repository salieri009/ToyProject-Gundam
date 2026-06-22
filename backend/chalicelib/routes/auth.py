"""
인증 라우트
- POST /auth/google — Google OAuth 로그인
- POST /auth/refresh — 토큰 갱신
- GET /auth/me — 현재 사용자 정보
"""
from chalice import Blueprint
from datetime import datetime, timedelta
import hashlib

from chalicelib.auth.google import verify_google_token
from chalicelib.auth.tokens import encode_access_token, encode_refresh_token, decode_token
from chalicelib.auth.middleware import require_auth, get_current_user
from chalicelib.database import get_db_session
from chalicelib.models.user import User
from chalicelib.models.refresh_token import RefreshToken
from chalicelib.config import config
from chalicelib.utils.responses import error_response

auth_bp = Blueprint(__name__)


@auth_bp.route('/auth/google', methods=['POST', 'OPTIONS'])
def google_login():
    """Google OAuth 로그인"""
    request = auth_bp.current_request
    data = request.json_body

    if not data or not data.get('id_token'):
        return error_response('Token is required', 400)

    user_info = verify_google_token(data['id_token'])
    if not user_info:
        return error_response('Invalid Google token', 401)

    with get_db_session() as session:
        # 사용자 조회 또는 생성
        user = session.query(User).filter(User.google_id == user_info['google_id']).first()
        if not user:
            user = User(
                email=user_info['email'],
                name=user_info['name'],
                google_id=user_info['google_id'],
            )
            session.add(user)
            session.flush()

        # JWT 토큰 생성
        access_token = encode_access_token(str(user.id), user.email)
        refresh_token = encode_refresh_token(str(user.id))

        # 리프레시 토큰 해시 저장
        token_hash = hashlib.sha256(refresh_token.encode()).hexdigest()
        expires_at = datetime.utcnow() + timedelta(days=config.REFRESH_TOKEN_EXPIRATION_DAYS)

        refresh_token_model = RefreshToken(
            user_id=user.id,
            token_hash=token_hash,
            expires_at=expires_at,
        )
        session.add(refresh_token_model)

        result = {
            'access_token': access_token,
            'refresh_token': refresh_token,
            'user': {
                'id': str(user.id),
                'email': user.email,
                'name': user.name,
            }
        }

    return result


@auth_bp.route('/auth/test-login', methods=['POST', 'OPTIONS'])
def test_login():
    """
    테스트 전용 로그인 시드 — E2E 자동화에서 실제 Google OAuth를 우회한다.

    보안: config.E2E_TEST_MODE 가 True일 때만 동작하며, 그 외에는 404를 반환해
    프로덕션에서 인증 우회 표면이 노출되지 않도록 한다. 발급되는 토큰은 실제
    encode_access_token / encode_refresh_token 으로 생성되므로 인증 미들웨어
    (require_auth)의 검증 경로는 프로덕션과 동일하다. 우회 범위는 "사용자 생성/토큰 발급"으로만 한정한다.
    """
    # 방어 1: 핸들러 첫 줄에서 가드 평가 (모드 꺼져 있으면 존재 자체를 숨김)
    if not config.E2E_TEST_MODE:
        return error_response('Not found', 404)

    request = auth_bp.current_request
    data = request.json_body or {}

    email = (data.get('email') or '').strip()
    name = (data.get('name') or '').strip() or (email.split('@')[0] if email else '')
    if not email:
        return error_response('email is required', 400)

    # 방어 2: google_id 를 결정적 + 네임스페이스(test-) 격리하여 실제 Google sub 와 충돌 방지
    google_id = f'test-{email}'

    with get_db_session() as session:
        user = session.query(User).filter(User.google_id == google_id).first()
        if not user:
            user = User(email=email, name=name, google_id=google_id)
            session.add(user)
            session.flush()

        access_token = encode_access_token(str(user.id), user.email)
        refresh_token = encode_refresh_token(str(user.id))

        token_hash = hashlib.sha256(refresh_token.encode()).hexdigest()
        expires_at = datetime.utcnow() + timedelta(days=config.REFRESH_TOKEN_EXPIRATION_DAYS)
        session.add(RefreshToken(
            user_id=user.id,
            token_hash=token_hash,
            expires_at=expires_at,
        ))

        # 응답 형태는 /auth/google 과 동일하게 맞춰 프런트가 구분 없이 동작하도록 한다.
        result = {
            'access_token': access_token,
            'refresh_token': refresh_token,
            'user': {
                'id': str(user.id),
                'email': user.email,
                'name': user.name,
            }
        }

    return result


@auth_bp.route('/auth/refresh', methods=['POST', 'OPTIONS'])
def refresh_token_route():
    """토큰 갱신"""
    request = auth_bp.current_request
    data = request.json_body

    if not data or not data.get('refresh_token'):
        return error_response('Refresh token is required', 400)

    token_str = data['refresh_token']

    # JWT 자체 검증
    payload = decode_token(token_str)
    if not payload or payload.get('type') != 'refresh':
        return error_response('Invalid refresh token', 401)

    with get_db_session() as session:
        # DB에서 해시 검증
        token_hash = hashlib.sha256(token_str.encode()).hexdigest()
        token_model = session.query(RefreshToken)\
            .filter(RefreshToken.token_hash == token_hash)\
            .filter(RefreshToken.expires_at > datetime.utcnow())\
            .first()

        if not token_model:
            return error_response('Invalid refresh token', 401)

        user = session.query(User).filter(User.id == token_model.user_id).first()
        if not user:
            return error_response('User not found', 401)

        access_token = encode_access_token(str(user.id), user.email)

    return {'access_token': access_token}


@auth_bp.route('/auth/me', methods=['GET', 'OPTIONS'])
def get_current_user_info():
    """현재 사용자 정보 조회"""
    request = auth_bp.current_request
    try:
        user = require_auth(request)
        return {
            'id': str(user.id),
            'email': user.email,
            'name': user.name,
            'created_at': user.created_at.isoformat() if user.created_at else None,
        }
    except Exception as e:
        return error_response(str(e), 401)