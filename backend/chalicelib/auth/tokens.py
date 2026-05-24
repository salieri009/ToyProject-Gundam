"""
JWT 토큰 발급/검증 + bcrypt 해싱 모듈
- PyJWT 기반 (python-jose 대체)
- Access Token: 24시간
- Refresh Token: 30일
"""
import jwt
import bcrypt
import uuid
from datetime import datetime, timedelta
from typing import Optional, Dict, Any

from chalicelib.config import config


def encode_access_token(user_id: str, email: str) -> str:
    """JWT 액세스 토큰 생성 (24시간)"""
    payload = {
        'sub': str(user_id),
        'email': email,
        'exp': datetime.utcnow() + timedelta(hours=config.JWT_EXPIRATION_HOURS),
        'iat': datetime.utcnow(),
        'type': 'access',
    }
    return jwt.encode(payload, config.JWT_SECRET_KEY, algorithm=config.JWT_ALGORITHM)


def encode_refresh_token(user_id: str) -> str:
    """JWT 리프레시 토큰 생성 (30일)"""
    payload = {
        'sub': str(user_id),
        'exp': datetime.utcnow() + timedelta(days=config.REFRESH_TOKEN_EXPIRATION_DAYS),
        'iat': datetime.utcnow(),
        'type': 'refresh',
        'jti': str(uuid.uuid4()),
    }
    return jwt.encode(payload, config.JWT_SECRET_KEY, algorithm=config.JWT_ALGORITHM)


def decode_token(token: str) -> Optional[Dict[str, Any]]:
    """JWT 토큰 디코딩 — 실패 시 None 반환"""
    try:
        payload = jwt.decode(token, config.JWT_SECRET_KEY, algorithms=[config.JWT_ALGORITHM])
        return payload
    except jwt.ExpiredSignatureError:
        return None
    except jwt.InvalidTokenError:
        return None


def verify_access_token(token: str) -> Optional[str]:
    """액세스 토큰 검증 → user_id 반환"""
    payload = decode_token(token)
    if not payload or payload.get('type') != 'access':
        return None
    return payload.get('sub')


def hash_token(token: str) -> str:
    """토큰 해싱 (DB 저장용, bcrypt)"""
    return bcrypt.hashpw(token.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')


def verify_token_hash(token: str, token_hash: str) -> bool:
    """토큰 해시 검증"""
    return bcrypt.checkpw(token.encode('utf-8'), token_hash.encode('utf-8'))
