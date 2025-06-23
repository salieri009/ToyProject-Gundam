from datetime import datetime, timedelta
from jose import jwt
from ..config import JWT_SECRET, JWT_ALGORITHM, JWT_EXPIRATION
import uuid

def create_access_token(user_id: str) -> str:
    expire = datetime.utcnow() + timedelta(seconds=JWT_EXPIRATION)
    to_encode = {
        'sub': str(user_id),
        'exp': expire,
        'type': 'access'
    }
    return jwt.encode(to_encode, JWT_SECRET, algorithm=JWT_ALGORITHM)

def create_refresh_token(user_id: str) -> str:
    expire = datetime.utcnow() + timedelta(days=30)
    to_encode = {
        'sub': str(user_id),
        'exp': expire,
        'type': 'refresh',
        'jti': str(uuid.uuid4())
    }
    return jwt.encode(to_encode, JWT_SECRET, algorithm=JWT_ALGORITHM)

def verify_token(token: str) -> str:
    try:
        payload = jwt.decode(token, JWT_SECRET, algorithms=[JWT_ALGORITHM])
        if payload.get('type') != 'access':
            return None
        return payload.get('sub')
    except jwt.JWTError:
        return None 