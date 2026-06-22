"""CORS preflight(OPTIONS) 가 허용 Origin 에 대해 올바른 헤더를 반환하는지 검증."""


def test_options_preflight_returns_cors_headers(client):
    resp = client.http.options(
        '/posts',
        headers={
            'Origin': 'http://localhost:3000',
            'Access-Control-Request-Method': 'POST',
            'Access-Control-Request-Headers': 'authorization,content-type',
        },
    )
    assert resp.status_code == 200
    assert resp.headers.get('Access-Control-Allow-Origin') == 'http://localhost:3000'
    allow_headers = resp.headers.get('Access-Control-Allow-Headers', '')
    assert 'Authorization' in allow_headers
    assert 'Content-Type' in allow_headers
