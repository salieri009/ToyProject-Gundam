"""
pytest 공통 픽스처

- chalice.test.Client 로 app 객체를 인프로세스 호출 (별도 서버 불필요)
- 필수 환경변수는 app import 전에 설정 (테스트 더미 값)
- 각 테스트 전 DB 테이블을 비워 격리 보장
"""
import os
import json

# ── app import 전에 환경변수 확정 (database/config 가 import 시점에 읽음) ──
os.environ.setdefault('E2E_TEST_MODE', 'true')
os.environ.setdefault('JWT_SECRET', 'test-secret-do-not-use-in-prod')
os.environ.setdefault('GOOGLE_CLIENT_ID', 'test-google-client-id')
os.environ.setdefault(
    'DATABASE_URL',
    'postgresql://postgres:postgres@localhost:5432/gundam_board',
)

import pytest  # noqa: E402
from chalice.test import Client  # noqa: E402

from app import app  # noqa: E402
from chalicelib.database import engine, init_db  # noqa: E402


# 테이블 목록 (truncate 순서는 CASCADE 로 해결)
_TABLES = ['comments', 'posts', 'refresh_tokens', 'users']


@pytest.fixture(scope='session', autouse=True)
def _setup_schema():
    """세션 시작 시 테이블 생성 보장."""
    init_db()
    yield


@pytest.fixture(autouse=True)
def clean_db():
    """각 테스트 전 모든 테이블 비우기 — 테스트 간 격리."""
    from sqlalchemy import text
    with engine.begin() as conn:
        conn.execute(text(
            f'TRUNCATE {", ".join(_TABLES)} RESTART IDENTITY CASCADE'
        ))
    yield


@pytest.fixture
def client():
    """Chalice 테스트 클라이언트."""
    with Client(app) as c:
        yield c


def _post_json(client, path, body, headers=None):
    """JSON POST 헬퍼."""
    h = {'Content-Type': 'application/json'}
    if headers:
        h.update(headers)
    return client.http.post(path, headers=h, body=json.dumps(body))


@pytest.fixture
def post_json():
    return _post_json


@pytest.fixture
def auth(client):
    """
    테스트 로그인으로 인증된 사용자 토큰 + Authorization 헤더 헬퍼를 반환.

    사용 예:
        token = auth('alice@test.com', 'Alice')['access_token']
        client.http.get('/auth/me', headers=auth.header(token))
    """
    def _login(email='tester@test.com', name='Tester'):
        resp = _post_json(client, '/auth/test-login', {'email': email, 'name': name})
        assert resp.status_code == 200, resp.body
        return resp.json_body

    _login.header = lambda token: {'Authorization': f'Bearer {token}'}
    return _login
