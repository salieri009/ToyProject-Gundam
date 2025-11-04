# 데이터베이스 설계 문서

## 🗄️ 데이터베이스 구조

### 사용 기술
- **Database**: PostgreSQL 15+
- **ORM**: SQLAlchemy (Python)
- **Connection Pool**: psycopg2
- **Migration**: Alembic

## 📋 테이블 설계

### users 테이블
```sql
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) UNIQUE NOT NULL,
    name VARCHAR(100) NOT NULL,
    google_id VARCHAR(255) UNIQUE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

**인덱스**
```sql
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_google_id ON users(google_id);
```

### posts 테이블
```sql
CREATE TABLE posts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title VARCHAR(200) NOT NULL,
    content TEXT NOT NULL,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

**인덱스**
```sql
CREATE INDEX idx_posts_user_id ON posts(user_id);
CREATE INDEX idx_posts_created_at ON posts(created_at DESC);
CREATE INDEX idx_posts_title ON posts USING gin(to_tsvector('korean', title));
```

### comments 테이블
```sql
CREATE TABLE comments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    content TEXT NOT NULL,
    post_id UUID NOT NULL REFERENCES posts(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    parent_id UUID REFERENCES comments(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

**인덱스**
```sql
CREATE INDEX idx_comments_post_id ON comments(post_id);
CREATE INDEX idx_comments_user_id ON comments(user_id);
CREATE INDEX idx_comments_parent_id ON comments(parent_id);
CREATE INDEX idx_comments_created_at ON comments(created_at);
```

### refresh_tokens 테이블
```sql
CREATE TABLE refresh_tokens (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    token_hash VARCHAR(255) NOT NULL,
    expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

**인덱스**
```sql
CREATE INDEX idx_refresh_tokens_user_id ON refresh_tokens(user_id);
CREATE INDEX idx_refresh_tokens_hash ON refresh_tokens(token_hash);
CREATE INDEX idx_refresh_tokens_expires_at ON refresh_tokens(expires_at);
```

## 🔗 관계 설정

### 1:N 관계
- `users` ← `posts` (한 사용자가 여러 게시글)
- `users` ← `comments` (한 사용자가 여러 댓글)
- `posts` ← `comments` (한 게시글에 여러 댓글)
- `users` ← `refresh_tokens` (한 사용자가 여러 토큰)

### Self-Referencing 관계
- `comments` ← `comments` (댓글의 대댓글)

## 📊 SQLAlchemy 모델

### User 모델
```python
from sqlalchemy import Column, String, DateTime, UUID
from sqlalchemy.orm import relationship
from datetime import datetime
import uuid

class User(Base):
    __tablename__ = 'users'
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    email = Column(String(255), unique=True, nullable=False)
    name = Column(String(100), nullable=False)
    google_id = Column(String(255), unique=True, nullable=False)
    created_at = Column(DateTime(timezone=True), default=datetime.utcnow)
    updated_at = Column(DateTime(timezone=True), default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Relationships
    posts = relationship("Post", back_populates="author", cascade="all, delete-orphan")
    comments = relationship("Comment", back_populates="author", cascade="all, delete-orphan")
    refresh_tokens = relationship("RefreshToken", back_populates="user", cascade="all, delete-orphan")
```

### Post 모델
```python
class Post(Base):
    __tablename__ = 'posts'
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    title = Column(String(200), nullable=False)
    content = Column(Text, nullable=False)
    user_id = Column(UUID(as_uuid=True), ForeignKey('users.id'), nullable=False)
    created_at = Column(DateTime(timezone=True), default=datetime.utcnow)
    updated_at = Column(DateTime(timezone=True), default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Relationships
    author = relationship("User", back_populates="posts")
    comments = relationship("Comment", back_populates="post", cascade="all, delete-orphan")
```

### Comment 모델
```python
class Comment(Base):
    __tablename__ = 'comments'
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    content = Column(Text, nullable=False)
    post_id = Column(UUID(as_uuid=True), ForeignKey('posts.id'), nullable=False)
    user_id = Column(UUID(as_uuid=True), ForeignKey('users.id'), nullable=False)
    parent_id = Column(UUID(as_uuid=True), ForeignKey('comments.id'), nullable=True)
    created_at = Column(DateTime(timezone=True), default=datetime.utcnow)
    updated_at = Column(DateTime(timezone=True), default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Relationships
    author = relationship("User", back_populates="comments")
    post = relationship("Post", back_populates="comments")
    parent = relationship("Comment", remote_side=[id], backref="replies")
```

### RefreshToken 모델
```python
class RefreshToken(Base):
    __tablename__ = 'refresh_tokens'
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(UUID(as_uuid=True), ForeignKey('users.id'), nullable=False)
    token_hash = Column(String(255), nullable=False)
    expires_at = Column(DateTime(timezone=True), nullable=False)
    created_at = Column(DateTime(timezone=True), default=datetime.utcnow)
    
    # Relationships
    user = relationship("User", back_populates="refresh_tokens")
```

## 🔍 주요 쿼리 패턴

### 게시글 목록 조회 (페이지네이션)
```python
def get_posts(page: int = 1, limit: int = 10):
    offset = (page - 1) * limit
    
    query = session.query(Post)\
        .options(joinedload(Post.author))\
        .order_by(Post.created_at.desc())\
        .offset(offset)\
        .limit(limit)
    
    posts = query.all()
    total = session.query(Post).count()
    
    return posts, total
```

### 댓글 목록 조회 (계층구조)
```python
def get_comments_by_post(post_id: UUID):
    # 부모 댓글만 조회
    parent_comments = session.query(Comment)\
        .options(joinedload(Comment.author))\
        .filter(Comment.post_id == post_id, Comment.parent_id.is_(None))\
        .order_by(Comment.created_at)\
        .all()
    
    # 각 부모 댓글의 대댓글 조회
    for comment in parent_comments:
        comment.replies = session.query(Comment)\
            .options(joinedload(Comment.author))\
            .filter(Comment.parent_id == comment.id)\
            .order_by(Comment.created_at)\
            .all()
    
    return parent_comments
```

### 게시글 상세 조회 (댓글 수 포함)
```python
def get_post_with_comment_count(post_id: UUID):
    result = session.query(
        Post,
        func.count(Comment.id).label('comment_count')
    )\
    .outerjoin(Comment, Post.id == Comment.post_id)\
    .options(joinedload(Post.author))\
    .filter(Post.id == post_id)\
    .group_by(Post.id)\
    .first()
    
    return result
```

## 🔧 데이터베이스 설정

### 연결 설정
```python
DATABASE_URL = "postgresql://user:password@host:5432/gundam_board"

engine = create_engine(
    DATABASE_URL,
    pool_size=10,
    max_overflow=20,
    pool_pre_ping=True,
    pool_recycle=3600
)
```

### 세션 설정
```python
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
```

## 🗑️ 데이터 정리 작업

### 만료된 토큰 정리 (Daily Cron)
```sql
DELETE FROM refresh_tokens 
WHERE expires_at < NOW();
```

### 고아 댓글 정리 (Weekly Cron)
```sql
DELETE FROM comments 
WHERE parent_id IS NOT NULL 
AND parent_id NOT IN (SELECT id FROM comments);
```

## 📈 성능 최적화

### 인덱스 전략
- **Primary Key**: 모든 테이블에 UUID 기본키
- **Foreign Key**: 모든 외래키에 인덱스
- **Timestamp**: 정렬에 사용되는 created_at 컬럼
- **Search**: 제목 검색용 GIN 인덱스

### 쿼리 최적화
- **N+1 문제 방지**: `joinedload` 사용
- **페이지네이션**: OFFSET/LIMIT 사용
- **계층 구조**: 부모-자식 관계 2단계 쿼리로 최적화

### 백업 전략
- **일일 백업**: pg_dump 전체 백업
- **포인트인타임 복구**: WAL 아카이빙 설정
- **백업 보관**: 30일간 보관 후 삭제 