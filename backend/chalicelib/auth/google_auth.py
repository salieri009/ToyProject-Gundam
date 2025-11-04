from google.oauth2 import id_token
from google.auth.transport import requests
import os
from ..database import get_db
from ..models.user import User

GOOGLE_CLIENT_ID = os.getenv('GOOGLE_CLIENT_ID')

def verify_google_token(token):
    try:
        idinfo = id_token.verify_oauth2_token(token, requests.Request(), GOOGLE_CLIENT_ID)
        
        if idinfo['iss'] not in ['accounts.google.com', 'https://accounts.google.com']:
            raise ValueError('Invalid issuer')
            
        return {
            'email': idinfo['email'],
            'name': idinfo['name'],
            'google_id': idinfo['sub']
        }
    except ValueError:
        return None

def get_or_create_user(user_info):
    db = next(get_db())
    user = db.query(User).filter(User.google_id == user_info['google_id']).first()
    
    if not user:
        user = User(
            email=user_info['email'],
            name=user_info['name'],
            google_id=user_info['google_id']
        )
        db.add(user)
        db.commit()
        db.refresh(user)
    
    return user 