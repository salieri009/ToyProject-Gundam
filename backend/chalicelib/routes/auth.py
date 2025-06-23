from chalice import Blueprint
from ..auth.google_auth import verify_google_token, get_or_create_user
from ..auth.jwt import create_access_token, create_refresh_token, verify_token
from ..database import get_db
from ..models.refresh_token import RefreshToken
from datetime import datetime, timedelta
import hashlib

auth_bp = Blueprint(__name__)

@auth_bp.route('/auth/google', methods=['POST'])
async def google_login():
    request = auth_bp.current_request
    token = request.json_body.get('id_token')
    
    if not token:
        return {'error': 'Token is required'}, 400
        
    user_info = await verify_google_token(token)
    if not user_info:
        return {'error': 'Invalid Google token'}, 401
        
    user = await get_or_create_user(user_info)
    access_token = create_access_token(user.id)
    refresh_token = create_refresh_token(user.id)
    
    # Refresh token 저장
    db = next(get_db())
    token_hash = hashlib.sha256(refresh_token.encode()).hexdigest()
    expires_at = datetime.utcnow() + timedelta(days=30)
    
    refresh_token_model = RefreshToken(
        user_id=user.id,
        token_hash=token_hash,
        expires_at=expires_at
    )
    db.add(refresh_token_model)
    db.commit()
    
    return {
        'access_token': access_token,
        'refresh_token': refresh_token,
        'user': {
            'id': str(user.id),
            'email': user.email,
            'name': user.name
        }
    }

@auth_bp.route('/auth/refresh', methods=['POST'])
def refresh_token():
    request = auth_bp.current_request
    refresh_token = request.json_body.get('refresh_token')
    
    if not refresh_token:
        return {'error': 'Refresh token is required'}, 400
        
    db = next(get_db())
    token_hash = hashlib.sha256(refresh_token.encode()).hexdigest()
    
    token_model = db.query(RefreshToken)\
        .filter(RefreshToken.token_hash == token_hash)\
        .filter(RefreshToken.expires_at > datetime.utcnow())\
        .first()
        
    if not token_model:
        return {'error': 'Invalid refresh token'}, 401
        
    access_token = create_access_token(token_model.user_id)
    
    return {
        'access_token': access_token
    }

@auth_bp.route('/auth/me', methods=['GET'])
def get_current_user():
    user = auth_bp.current_request.context.get('user')
    if not user:
        return {'error': 'Not authenticated'}, 401
        
    return {
        'id': str(user.id),
        'email': user.email,
        'name': user.name,
        'created_at': user.created_at.isoformat()
    } 