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

auth_bp = Blueprint(__name__)


@auth_bp.route('/auth/google', methods=['POST'])
def google_login():
    """Google OAuth 로그인"""
    request = auth_bp.current_request
    data = request.json_body

    if not data or not data.get('id_token'):
        return {'error': 'Token is required'}, 400

    user_info = verify_google_token(data['id_token'])
    if not user_info:
        return {'error': 'Invalid Google token'}, 401

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


@auth_bp.route('/auth/refresh', methods=['POST'])
def refresh_token_route():
    """토큰 갱신"""
    request = auth_bp.current_request
    data = request.json_body

    if not data or not data.get('refresh_token'):
        return {'error': 'Refresh token is required'}, 400

    token_str = data['refresh_token']

    # JWT 자체 검증
    payload = decode_token(token_str)
    if not payload or payload.get('type') != 'refresh':
        return {'error': 'Invalid refresh token'}, 401

    with get_db_session() as session:
        # DB에서 해시 검증
        token_hash = hashlib.sha256(token_str.encode()).hexdigest()
        token_model = session.query(RefreshToken)\
            .filter(RefreshToken.token_hash == token_hash)\
            .filter(RefreshToken.expires_at > datetime.utcnow())\
            .first()

        if not token_model:
            return {'error': 'Invalid refresh token'}, 401

        user = session.query(User).filter(User.id == token_model.user_id).first()
        if not user:
            return {'error': 'User not found'}, 401

        access_token = encode_access_token(str(user.id), user.email)

    return {'access_token': access_token}


@auth_bp.route('/auth/me', methods=['GET'])
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
        return {'error': str(e)}, 401