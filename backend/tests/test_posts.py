"""게시글 CRUD + 권한 + 검증."""


def _create_post(client, post_json, token, title='제목', content='내용'):
    return post_json(
        client, '/posts',
        {'title': title, 'content': content},
        headers={'Authorization': f'Bearer {token}'},
    )


def test_create_post_requires_auth(client, post_json):
    resp = _create_post(client, post_json, token='')  # 빈 토큰
    assert resp.status_code == 401


def test_create_post_authenticated(client, post_json, auth):
    token = auth()['access_token']
    resp = _create_post(client, post_json, token, '첫 글', '본문입니다')
    assert resp.status_code == 201
    body = resp.json_body
    assert body['title'] == '첫 글'
    assert body['content'] == '본문입니다'
    assert body['author']['name']
    assert body['id']


def test_list_posts_structure(client, post_json, auth):
    token = auth()['access_token']
    _create_post(client, post_json, token)
    resp = client.http.get('/posts')
    assert resp.status_code == 200
    body = resp.json_body
    assert isinstance(body['posts'], list)
    assert len(body['posts']) == 1
    assert 'pagination' in body


def test_get_post_detail_and_404(client, post_json, auth):
    token = auth()['access_token']
    created = _create_post(client, post_json, token).json_body
    resp = client.http.get(f"/posts/{created['id']}")
    assert resp.status_code == 200
    assert resp.json_body['id'] == created['id']

    import uuid
    missing = client.http.get(f'/posts/{uuid.uuid4()}')
    assert missing.status_code == 404


def test_update_post_owner_only(client, post_json, auth):
    owner_token = auth('owner@test.com', 'Owner')['access_token']
    other_token = auth('other@test.com', 'Other')['access_token']
    created = _create_post(client, post_json, owner_token).json_body

    # 타인 수정 → 403
    forbidden = client.http.put(
        f"/posts/{created['id']}",
        headers={'Authorization': f'Bearer {other_token}', 'Content-Type': 'application/json'},
        body='{"title":"해킹","content":"불가"}',
    )
    assert forbidden.status_code == 403

    # 작성자 수정 → 200
    ok = client.http.put(
        f"/posts/{created['id']}",
        headers={'Authorization': f'Bearer {owner_token}', 'Content-Type': 'application/json'},
        body='{"title":"수정됨","content":"새 본문"}',
    )
    assert ok.status_code == 200
    assert ok.json_body['title'] == '수정됨'


def test_delete_post_owner_only(client, post_json, auth):
    owner_token = auth('o2@test.com', 'O2')['access_token']
    other_token = auth('x2@test.com', 'X2')['access_token']
    created = _create_post(client, post_json, owner_token).json_body

    forbidden = client.http.delete(
        f"/posts/{created['id']}",
        headers={'Authorization': f'Bearer {other_token}'},
    )
    assert forbidden.status_code == 403

    ok = client.http.delete(
        f"/posts/{created['id']}",
        headers={'Authorization': f'Bearer {owner_token}'},
    )
    assert ok.status_code == 204


def test_create_post_validation_error(client, post_json, auth):
    token = auth()['access_token']
    resp = _create_post(client, post_json, token, title='', content='')
    assert resp.status_code == 400
