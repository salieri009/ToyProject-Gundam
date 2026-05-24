"""
인증 미들웨어 — @require_auth 데코레이터
- contextmanager 기반 DB 세션 사용
- 현재 사용자 정보를 request.context에 저장
"""
from functools import wraps
from chalice import UnauthorizedError

from chalicelib.auth.tokens import verify_access_token
from chalicelib.database import get_db_session
from chalicelib.models.user import User


def require_auth(func_or_request):
    """
    두 가지 사용법 지원:
    1. 데코레이터: @require_auth
    2. 함수 호출: user = require_auth(request)
    """
    # 함수 호출 방식 (레거시 호환)
    if not callable(func_or_request) or hasattr(func_or_request, 'headers'):
        return _authenticate_request(func_or_request)

    # 데코레이터 방식
    @wraps(func_or_request)
    def decorated(*args, **kwargs):
        from chalice import Chalice
        import chalice
        # Blueprint나 app에서 current_request 가져오기
        try:
            request = chalice.app._current_request
        except Exception:
            request = None

        if request is None:
            raise UnauthorizedError("No request context")

        _authenticate_request(request)
        return func_or_request(*args, **kwargs)

    return decorated


def _authenticate_request(request):
    """요청에서 JWT 토큰 추출 및 사용자 검증"""
    auth_header = request.headers.get('authorization') or request.headers.get('Authorization')
    if not auth_header or not auth_header.startswith('Bearer '):
        raise UnauthorizedError('Missing or invalid authorization header')

    token = auth_header.split(' ', 1)[1]
    user_id = verify_access_token(token)

    if not user_id:
        raise UnauthorizedError('Invalid or expired token')

    with get_db_session() as session:
        user = session.query(User).filter(User.id == user_id).first()
        if not user:
            raise UnauthorizedError('User not found')

        # session 밖에서도 사용 가능하도록 속성 저장
        user_data = {
            'id': user.id,
            'email': user.email,
            'name': user.name,
            'google_id': user.google_id,
            'created_at': user.created_at,
        }
        session.expunge(user)

    # context에 사용자 저장
    if not hasattr(request, 'context') or request.context is None:
        request.context = {}
    request.context['user'] = user
    request.context['user_data'] = user_data

    return user


def get_current_user(request):
    """현재 인증된 사용자 반환"""
    if hasattr(request, 'context') and request.context:
        return request.context.get('user')
    return None
