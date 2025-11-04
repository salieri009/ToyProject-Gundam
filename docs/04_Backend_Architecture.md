# 백엔드 아키텍처 문서

## 🏗️ 아키텍처 개요
- **Framework**: AWS Chalice (Python)
- **Database**: PostgreSQL (AWS RDS)
- **Authentication**: JWT + Google OAuth
- **ORM**: SQLAlchemy
- **Deployment**: AWS Lambda + API Gateway

## 📁 프로젝트 구조
```
backend/
├── app.py                     # Chalice 앱 엔트리포인트
├── requirements.txt           # 패키지 의존성
├── chalicelib/
│   ├── __init__.py
│   ├── config.py             # 설정 관리
│   ├── database.py           # DB 연결 설정
│   ├── auth/
│   │   ├── __init__.py
│   │   ├── jwt.py           # JWT 토큰 관리
│   │   ├── google.py        # Google OAuth
│   │   └── middleware.py    # 인증 미들웨어
│   ├── models/
│   │   ├── __init__.py
│   │   ├── base.py          # 기본 모델
│   │   ├── user.py          # 사용자 모델
│   │   ├── post.py          # 게시글 모델
│   │   └── comment.py       # 댓글 모델
│   ├── routes/
│   │   ├── __init__.py
│   │   ├── auth.py          # 인증 라우트
│   │   ├── posts.py         # 게시글 라우트
│   │   └── comments.py      # 댓글 라우트
│   ├── serializers/
│   │   ├── __init__.py
│   │   ├── user.py          # 사용자 직렬화
│   │   ├── post.py          # 게시글 직렬화
│   │   └── comment.py       # 댓글 직렬화
│   └── utils/
│       ├── __init__.py
│       ├── validation.py    # 입력 검증
│       ├── pagination.py    # 페이지네이션
│       └── exceptions.py    # 커스텀 예외
├── .chalice/
│   └── config.json          # Chalice 배포 설정
└── tests/                   # 테스트 파일
```

## ⚙️ 핵심 설정

### app.py (Chalice 앱)
```python
from chalice import Chalice, CORSConfig
from chalicelib.routes.auth import auth_bp
from chalicelib.routes.posts import posts_bp
from chalicelib.routes.comments import comments_bp
from chalicelib.database import init_db
from chalicelib.utils.exceptions import handle_exceptions

# CORS 설정
cors_config = CORSConfig(
    allow_origin='*',
    allow_headers=['Content-Type', 'X-Amz-Date', 'Authorization'],
    max_age=600,
    expose_headers=['X-Special-Header'],
    allow_credentials=True
)

app = Chalice(app_name='gundam-board-api')
app.api.cors = cors_config

# 데이터베이스 초기화
init_db()

# 블루프린트 등록
app.register_blueprint(auth_bp, url_prefix='/auth')
app.register_blueprint(posts_bp, url_prefix='/posts')
app.register_blueprint(comments_bp, url_prefix='/comments')

# 글로벌 예외 처리
handle_exceptions(app)

@app.route('/')
def index():
    return {'message': 'Gundam Universe Board API'}

@app.route('/health')
def health_check():
    return {'status': 'healthy'}
```

### config.py (설정 관리)
```python
import os
from typing import Optional

class Config:
    # 데이터베이스 설정
    DATABASE_URL: str = os.getenv('DATABASE_URL', 'postgresql://localhost/gundam_board')
    
    # JWT 설정
    JWT_SECRET_KEY: str = os.getenv('JWT_SECRET_KEY', 'your-secret-key')
    JWT_ALGORITHM: str = 'HS256'
    JWT_EXPIRATION_HOURS: int = 24
    REFRESH_TOKEN_EXPIRATION_DAYS: int = 30
    
    # Google OAuth 설정
    GOOGLE_CLIENT_ID: str = os.getenv('GOOGLE_CLIENT_ID')
    GOOGLE_CLIENT_SECRET: str = os.getenv('GOOGLE_CLIENT_SECRET')
    
    # 페이지네이션 설정
    DEFAULT_PAGE_SIZE: int = 10
    MAX_PAGE_SIZE: int = 50
    
    # 검증 규칙
    POST_TITLE_MAX_LENGTH: int = 200
    POST_CONTENT_MAX_LENGTH: int = 10000
    COMMENT_CONTENT_MAX_LENGTH: int = 1000

config = Config()
```

### database.py (DB 연결)
```python
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base
from sqlalchemy.pool import QueuePool
from contextlib import contextmanager
from chalicelib.config import config

# SQLAlchemy 설정
engine = create_engine(
    config.DATABASE_URL,
    poolclass=QueuePool,
    pool_size=10,
    max_overflow=20,
    pool_pre_ping=True,
    pool_recycle=3600,
    echo=False  # 프로덕션에서는 False
)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

def init_db():
    """데이터베이스 테이블 생성"""
    Base.metadata.create_all(bind=engine)

@contextmanager
def get_db_session():
    """데이터베이스 세션 컨텍스트 매니저"""
    session = SessionLocal()
    try:
        yield session
        session.commit()
    except Exception:
        session.rollback()
        raise
    finally:
        session.close()

def get_db():
    """Chalice용 DB 세션 의존성"""
    with get_db_session() as session:
        return session
```

## 🔐 인증 시스템

### JWT 토큰 관리
```python
# chalicelib/auth/jwt.py
import jwt
import bcrypt
from datetime import datetime, timedelta
from typing import Optional, Dict, Any
from chalicelib.config import config

class JWTManager:
    @staticmethod
    def encode_token(user_id: str, email: str) -> str:
        """JWT 액세스 토큰 생성"""
        payload = {
            'user_id': user_id,
            'email': email,
            'exp': datetime.utcnow() + timedelta(hours=config.JWT_EXPIRATION_HOURS),
            'iat': datetime.utcnow(),
            'type': 'access'
        }
        return jwt.encode(payload, config.JWT_SECRET_KEY, algorithm=config.JWT_ALGORITHM)
    
    @staticmethod
    def encode_refresh_token(user_id: str) -> str:
        """JWT 리프레시 토큰 생성"""
        payload = {
            'user_id': user_id,
            'exp': datetime.utcnow() + timedelta(days=config.REFRESH_TOKEN_EXPIRATION_DAYS),
            'iat': datetime.utcnow(),
            'type': 'refresh'
        }
        return jwt.encode(payload, config.JWT_SECRET_KEY, algorithm=config.JWT_ALGORITHM)
    
    @staticmethod
    def decode_token(token: str) -> Optional[Dict[str, Any]]:
        """JWT 토큰 디코딩"""
        try:
            payload = jwt.decode(token, config.JWT_SECRET_KEY, algorithms=[config.JWT_ALGORITHM])
            return payload
        except jwt.ExpiredSignatureError:
            return None
        except jwt.InvalidTokenError:
            return None
    
    @staticmethod
    def hash_token(token: str) -> str:
        """토큰 해싱 (DB 저장용)"""
        return bcrypt.hashpw(token.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')
    
    @staticmethod
    def verify_token_hash(token: str, token_hash: str) -> bool:
        """토큰 해시 검증"""
        return bcrypt.checkpw(token.encode('utf-8'), token_hash.encode('utf-8'))
```

### Google OAuth 처리
```python
# chalicelib/auth/google.py
import requests
from google.oauth2 import id_token
from google.auth.transport import requests as google_requests
from typing import Optional, Dict, Any
from chalicelib.config import config

class GoogleOAuth:
    @staticmethod
    def verify_id_token(id_token_str: str) -> Optional[Dict[str, Any]]:
        """Google ID 토큰 검증"""
        try:
            request = google_requests.Request()
            id_info = id_token.verify_oauth2_token(
                id_token_str, 
                request, 
                config.GOOGLE_CLIENT_ID
            )
            
            if id_info['iss'] not in ['accounts.google.com', 'https://accounts.google.com']:
                raise ValueError('Invalid issuer')
            
            return {
                'google_id': id_info['sub'],
                'email': id_info['email'],
                'name': id_info['name'],
                'picture': id_info.get('picture')
            }
        except ValueError:
            return None
```

### 인증 미들웨어
```python
# chalicelib/auth/middleware.py
from chalice import UnauthorizedError
from functools import wraps
from chalicelib.auth.jwt import JWTManager
from chalicelib.models.user import User
from chalicelib.database import get_db

def require_auth(f):
    """인증 필요 데코레이터"""
    @wraps(f)
    def decorated_function(*args, **kwargs):
        from chalice import current_app
        
        auth_header = current_app.current_request.headers.get('authorization')
        if not auth_header:
            raise UnauthorizedError("Missing authorization header")
        
        try:
            scheme, token = auth_header.split()
            if scheme.lower() != 'bearer':
                raise UnauthorizedError("Invalid authorization scheme")
        except ValueError:
            raise UnauthorizedError("Invalid authorization header format")
        
        payload = JWTManager.decode_token(token)
        if not payload or payload.get('type') != 'access':
            raise UnauthorizedError("Invalid or expired token")
        
        # 사용자 정보 조회 및 설정
        with get_db_session() as session:
            user = session.query(User).filter(User.id == payload['user_id']).first()
            if not user:
                raise UnauthorizedError("User not found")
            
            current_app.current_request.context = {'user': user}
        
        return f(*args, **kwargs)
    
    return decorated_function

def get_current_user():
    """현재 인증된 사용자 반환"""
    from chalice import current_app
    return current_app.current_request.context.get('user')
```

## 🗂️ 모델 정의

### 기본 모델
```python
# chalicelib/models/base.py
from sqlalchemy import Column, DateTime, UUID
from sqlalchemy.ext.declarative import declarative_base
from datetime import datetime
import uuid

Base = declarative_base()

class BaseModel(Base):
    __abstract__ = True
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    created_at = Column(DateTime(timezone=True), default=datetime.utcnow, nullable=False)
    updated_at = Column(DateTime(timezone=True), default=datetime.utcnow, onupdate=datetime.utcnow, nullable=False)
```

### 사용자 모델
```python
# chalicelib/models/user.py
from sqlalchemy import Column, String
from sqlalchemy.orm import relationship
from chalicelib.models.base import BaseModel

class User(BaseModel):
    __tablename__ = 'users'
    
    email = Column(String(255), unique=True, nullable=False, index=True)
    name = Column(String(100), nullable=False)
    google_id = Column(String(255), unique=True, nullable=False, index=True)
    
    # 관계 설정
    posts = relationship("Post", back_populates="author", cascade="all, delete-orphan")
    comments = relationship("Comment", back_populates="author", cascade="all, delete-orphan")
    refresh_tokens = relationship("RefreshToken", back_populates="user", cascade="all, delete-orphan")
    
    def to_dict(self):
        return {
            'id': str(self.id),
            'email': self.email,
            'name': self.name,
            'created_at': self.created_at.isoformat()
        }
```

## 🛣️ 라우트 구현

### 인증 라우트
```python
# chalicelib/routes/auth.py
from chalice import Blueprint, BadRequestError, UnauthorizedError
from chalicelib.auth.google import GoogleOAuth
from chalicelib.auth.jwt import JWTManager
from chalicelib.auth.middleware import require_auth, get_current_user
from chalicelib.models.user import User, RefreshToken
from chalicelib.database import get_db_session
from chalicelib.serializers.user import UserSerializer

auth_bp = Blueprint(__name__)

@auth_bp.route('/google', methods=['POST'])
def google_login():
    """Google OAuth 로그인"""
    request = auth_bp.current_request
    data = request.json_body
    
    if not data or 'id_token' not in data:
        raise BadRequestError("ID token is required")
    
    # Google ID 토큰 검증
    user_info = GoogleOAuth.verify_id_token(data['id_token'])
    if not user_info:
        raise UnauthorizedError("Invalid Google token")
    
    with get_db_session() as session:
        # 사용자 조회 또는 생성
        user = session.query(User).filter(User.google_id == user_info['google_id']).first()
        if not user:
            user = User(
                email=user_info['email'],
                name=user_info['name'],
                google_id=user_info['google_id']
            )
            session.add(user)
            session.flush()
        
        # JWT 토큰 생성
        access_token = JWTManager.encode_token(str(user.id), user.email)
        refresh_token = JWTManager.encode_refresh_token(str(user.id))
        
        # 리프레시 토큰 저장
        refresh_token_obj = RefreshToken(
            user_id=user.id,
            token_hash=JWTManager.hash_token(refresh_token),
            expires_at=datetime.utcnow() + timedelta(days=config.REFRESH_TOKEN_EXPIRATION_DAYS)
        )
        session.add(refresh_token_obj)
    
    return {
        'access_token': access_token,
        'refresh_token': refresh_token,
        'user': UserSerializer.serialize(user)
    }

@auth_bp.route('/refresh', methods=['POST'])
def refresh_token():
    """토큰 갱신"""
    request = auth_bp.current_request
    data = request.json_body
    
    if not data or 'refresh_token' not in data:
        raise BadRequestError("Refresh token is required")
    
    payload = JWTManager.decode_token(data['refresh_token'])
    if not payload or payload.get('type') != 'refresh':
        raise UnauthorizedError("Invalid refresh token")
    
    with get_db_session() as session:
        user = session.query(User).filter(User.id == payload['user_id']).first()
        if not user:
            raise UnauthorizedError("User not found")
        
        # 새 액세스 토큰 생성
        access_token = JWTManager.encode_token(str(user.id), user.email)
    
    return {'access_token': access_token}

@auth_bp.route('/me', methods=['GET'])
@require_auth
def get_current_user_info():
    """현재 사용자 정보 조회"""
    user = get_current_user()
    return UserSerializer.serialize(user)
```

### 게시글 라우트
```python
# chalicelib/routes/posts.py
from chalice import Blueprint, BadRequestError, NotFoundError, ForbiddenError
from chalicelib.auth.middleware import require_auth, get_current_user
from chalicelib.models.post import Post
from chalicelib.models.comment import Comment
from chalicelib.database import get_db_session
from chalicelib.serializers.post import PostSerializer
from chalicelib.utils.validation import validate_post_data
from chalicelib.utils.pagination import paginate
from sqlalchemy.orm import joinedload
from sqlalchemy import func

posts_bp = Blueprint(__name__)

@posts_bp.route('', methods=['GET'])
def get_posts():
    """게시글 목록 조회"""
    request = posts_bp.current_request
    page = int(request.query_params.get('page', 1))
    limit = min(int(request.query_params.get('limit', 10)), 50)
    
    with get_db_session() as session:
        query = session.query(
            Post,
            func.count(Comment.id).label('comment_count')
        ).outerjoin(Comment)\
         .options(joinedload(Post.author))\
         .group_by(Post.id)\
         .order_by(Post.created_at.desc())
        
        posts, pagination = paginate(query, page, limit)
        
        return {
            'posts': [PostSerializer.serialize_with_comment_count(post, comment_count) 
                     for post, comment_count in posts],
            'pagination': pagination
        }

@posts_bp.route('/<post_id>', methods=['GET'])
def get_post(post_id):
    """게시글 상세 조회"""
    with get_db_session() as session:
        post = session.query(Post)\
                     .options(joinedload(Post.author))\
                     .filter(Post.id == post_id)\
                     .first()
        
        if not post:
            raise NotFoundError("Post not found")
        
        return PostSerializer.serialize(post)

@posts_bp.route('', methods=['POST'])
@require_auth
def create_post():
    """게시글 작성"""
    request = posts_bp.current_request
    user = get_current_user()
    data = request.json_body
    
    # 입력 검증
    validated_data = validate_post_data(data)
    
    with get_db_session() as session:
        post = Post(
            title=validated_data['title'],
            content=validated_data['content'],
            user_id=user.id
        )
        session.add(post)
        session.flush()
        
        # 작성자 정보와 함께 반환
        session.refresh(post)
        session.expunge(post)
        
        return PostSerializer.serialize(post), 201

@posts_bp.route('/<post_id>', methods=['PUT'])
@require_auth
def update_post(post_id):
    """게시글 수정"""
    request = posts_bp.current_request
    user = get_current_user()
    data = request.json_body
    
    validated_data = validate_post_data(data)
    
    with get_db_session() as session:
        post = session.query(Post).filter(Post.id == post_id).first()
        
        if not post:
            raise NotFoundError("Post not found")
        
        if post.user_id != user.id:
            raise ForbiddenError("Permission denied")
        
        post.title = validated_data['title']
        post.content = validated_data['content']
        
        return PostSerializer.serialize(post)

@posts_bp.route('/<post_id>', methods=['DELETE'])
@require_auth
def delete_post(post_id):
    """게시글 삭제"""
    user = get_current_user()
    
    with get_db_session() as session:
        post = session.query(Post).filter(Post.id == post_id).first()
        
        if not post:
            raise NotFoundError("Post not found")
        
        if post.user_id != user.id:
            raise ForbiddenError("Permission denied")
        
        session.delete(post)
    
    return '', 204
```

## 🔧 유틸리티

### 입력 검증
```python
# chalicelib/utils/validation.py
from chalice import BadRequestError
from chalicelib.config import config

def validate_post_data(data):
    """게시글 데이터 검증"""
    if not data:
        raise BadRequestError("Request body is required")
    
    title = data.get('title', '').strip()
    content = data.get('content', '').strip()
    
    if not title:
        raise BadRequestError("Title is required")
    
    if not content:
        raise BadRequestError("Content is required")
    
    if len(title) > config.POST_TITLE_MAX_LENGTH:
        raise BadRequestError(f"Title must be {config.POST_TITLE_MAX_LENGTH} characters or less")
    
    if len(content) > config.POST_CONTENT_MAX_LENGTH:
        raise BadRequestError(f"Content must be {config.POST_CONTENT_MAX_LENGTH} characters or less")
    
    return {'title': title, 'content': content}

def validate_comment_data(data):
    """댓글 데이터 검증"""
    if not data:
        raise BadRequestError("Request body is required")
    
    content = data.get('content', '').strip()
    parent_id = data.get('parent_id')
    
    if not content:
        raise BadRequestError("Content is required")
    
    if len(content) > config.COMMENT_CONTENT_MAX_LENGTH:
        raise BadRequestError(f"Content must be {config.COMMENT_CONTENT_MAX_LENGTH} characters or less")
    
    return {'content': content, 'parent_id': parent_id}
```

### 페이지네이션
```python
# chalicelib/utils/pagination.py
import math
from chalicelib.config import config

def paginate(query, page=1, limit=None):
    """쿼리 페이지네이션"""
    if limit is None:
        limit = config.DEFAULT_PAGE_SIZE
    
    limit = min(limit, config.MAX_PAGE_SIZE)
    offset = (page - 1) * limit
    
    total = query.count()
    items = query.offset(offset).limit(limit).all()
    
    pagination = {
        'page': page,
        'limit': limit,
        'total': total,
        'total_pages': math.ceil(total / limit) if total > 0 else 1
    }
    
    return items, pagination
```

## 🚀 배포 설정

### .chalice/config.json
```json
{
  "version": "2.0",
  "app_name": "gundam-board-api",
  "stages": {
    "dev": {
      "api_gateway_stage": "api",
      "environment_variables": {
        "DATABASE_URL": "postgresql://localhost/gundam_board_dev",
        "JWT_SECRET_KEY": "dev-secret-key",
        "GOOGLE_CLIENT_ID": "your-google-client-id"
      }
    },
    "prod": {
      "api_gateway_stage": "api",
      "environment_variables": {
        "DATABASE_URL": "${DB_URL}",
        "JWT_SECRET_KEY": "${JWT_SECRET}",
        "GOOGLE_CLIENT_ID": "${GOOGLE_CLIENT_ID}"
      }
    }
  }
}
```

### requirements.txt
```txt
chalice==1.29.0
sqlalchemy==2.0.23
psycopg2-binary==2.9.9
PyJWT==2.8.0
google-auth==2.23.4
google-auth-oauthlib==1.1.0
bcrypt==4.0.1
```

## 📊 모니터링 & 로깅

### CloudWatch 로깅
```python
import logging
from chalice import current_app

# 로거 설정
logger = logging.getLogger()
logger.setLevel(logging.INFO)

def log_request():
    """요청 로깅"""
    request = current_app.current_request
    logger.info(f"{request.method} {request.uri} - {request.headers.get('user-agent')}")

def log_error(error):
    """에러 로깅"""
    logger.error(f"Error: {str(error)}", exc_info=True)
``` 