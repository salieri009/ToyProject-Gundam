"""
데이터베이스 연결 및 세션 관리 모듈
- contextmanager 기반 트랜잭션 헬퍼 (commit/rollback 보장)
- QueuePool로 커넥션 관리
"""
import os
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base
from sqlalchemy.pool import QueuePool
from contextlib import contextmanager
from dotenv import load_dotenv

load_dotenv()

DATABASE_URL = os.getenv('DATABASE_URL', 'postgresql://postgres:postgres@localhost:5432/gundam_board')

engine = create_engine(
    DATABASE_URL,
    poolclass=QueuePool,
    pool_size=10,
    max_overflow=20,
    pool_pre_ping=True,
    pool_recycle=3600,
    echo=False,
)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()


def init_db():
    """데이터베이스 테이블 생성"""
    # 모든 모델 임포트하여 Base.metadata에 등록
    from chalicelib.models import user, post, comment, refresh_token  # noqa: F401
    Base.metadata.create_all(bind=engine)


@contextmanager
def get_db_session():
    """데이터베이스 세션 컨텍스트 매니저 (commit/rollback 보장)"""
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
    """레거시 호환용 DB 세션 제너레이터"""
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()