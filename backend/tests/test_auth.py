"""인증 라우트 + 테스트 로그인 시드 보안 가드."""
from chalicelib.config import config


def test_test_login_returns_tokens_and_user(auth):
    data = auth('alice@test.com', 'Alice')
    assert data['access_token']
    assert data['refresh_token']
    assert data['user']['email'] == 'alice@test.com'
    assert data['user']['name'] == 'Alice'


def test_test_login_is_idempotent_per_email(auth):
    """같은 email 로 두 번 로그인하면 동일 사용자(id 동일)를 반환한다."""
    first = auth('bob@test.com', 'Bob')
    second = auth('bob@test.com', 'Bob')
    assert first['user']['id'] == second['user']['id']


def test_me_with_token(client, auth):
    data = auth('carol@test.com', 'Carol')
    resp = client.http.get('/auth/me', headers=auth.header(data['access_token']))
    assert resp.status_code == 200
    assert resp.json_body['email'] == 'carol@test.com'


def test_me_without_token_is_401(client):
    resp = client.http.get('/auth/me')
    assert resp.status_code == 401


def test_refresh_issues_new_access_token(client, auth, post_json):
    data = auth('dave@test.com', 'Dave')
    resp = post_json(client, '/auth/refresh', {'refresh_token': data['refresh_token']})
    assert resp.status_code == 200
    assert resp.json_body['access_token']


def test_refresh_with_invalid_token_is_401(client, post_json):
    resp = post_json(client, '/auth/refresh', {'refresh_token': 'not-a-real-token'})
    assert resp.status_code == 401


def test_test_login_disabled_returns_404(client, post_json, monkeypatch):
    """보안: E2E_TEST_MODE 가 꺼지면 시드 엔드포인트가 존재하지 않아야 한다."""
    monkeypatch.setattr(config, 'E2E_TEST_MODE', False)
    resp = post_json(client, '/auth/test-login', {'email': 'mallory@test.com'})
    assert resp.status_code == 404


def test_test_login_requires_email(client, post_json):
    resp = post_json(client, '/auth/test-login', {'name': 'NoEmail'})
    assert resp.status_code == 400
