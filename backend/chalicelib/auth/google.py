"""
Google ID 토큰 검증 모듈
"""
from google.oauth2 import id_token
from google.auth.transport import requests as google_requests
from typing import Optional, Dict, Any

from chalicelib.config import config


def verify_google_token(token_str: str) -> Optional[Dict[str, Any]]:
    """
    Google ID 토큰 검증
    Returns: {'google_id', 'email', 'name', 'picture'} or None
    """
    try:
        request = google_requests.Request()
        id_info = id_token.verify_oauth2_token(
            token_str,
            request,
            config.GOOGLE_CLIENT_ID,
        )

        if id_info['iss'] not in ['accounts.google.com', 'https://accounts.google.com']:
            raise ValueError('Invalid issuer')

        return {
            'google_id': id_info['sub'],
            'email': id_info['email'],
            'name': id_info.get('name', id_info['email'].split('@')[0]),
            'picture': id_info.get('picture'),
        }
    except (ValueError, KeyError):
        return None
