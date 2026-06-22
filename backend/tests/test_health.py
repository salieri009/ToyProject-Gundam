"""헬스 체크 엔드포인트."""


def test_health_ok(client):
    resp = client.http.get('/health')
    assert resp.status_code == 200
    assert resp.json_body == {'status': 'healthy'}
