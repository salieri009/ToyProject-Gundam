from ..auth.jwt import verify_token
from ..database import get_db
from ..models.user import User

class UnauthorizedError(Exception):
    """인증 오류 예외"""
    pass

def require_auth(request):
    """JWT 인증 미들웨어 - Authorization 헤더에서 토큰을 추출하고 사용자 정보를 검증"""
    auth_header = request.headers.get('Authorization')
    if not auth_header or not auth_header.startswith('Bearer '):
        raise UnauthorizedError('Missing or invalid authorization header')
    
    token = auth_header.split(' ')[1]
    user_id = verify_token(token)
    
    if not user_id:
        raise UnauthorizedError('Invalid token')
    
    db = next(get_db())
    user = db.query(User).filter(User.id == user_id).first()
    
    if not user:
        raise UnauthorizedError('User not found')
    
    request.context['user'] = user
    return user

