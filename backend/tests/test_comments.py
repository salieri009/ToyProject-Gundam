"""댓글 작성 + 계층 구조 + 검증."""


def _new_post(client, post_json, token):
    resp = post_json(
        client, '/posts',
        {'title': '댓글 테스트용 글', 'content': '본문'},
        headers={'Authorization': f'Bearer {token}'},
    )
    return resp.json_body['id']


def test_create_comment(client, post_json, auth):
    token = auth()['access_token']
    post_id = _new_post(client, post_json, token)
    resp = post_json(
        client, f'/posts/{post_id}/comments',
        {'content': '첫 댓글'},
        headers={'Authorization': f'Bearer {token}'},
    )
    assert resp.status_code == 201
    assert resp.json_body['content'] == '첫 댓글'
    assert resp.json_body['parent_id'] is None


def test_create_comment_requires_auth(client, post_json, auth):
    token = auth()['access_token']
    post_id = _new_post(client, post_json, token)
    resp = post_json(client, f'/posts/{post_id}/comments', {'content': '익명 댓글'})
    assert resp.status_code == 401


def test_nested_reply_hierarchy(client, post_json, auth):
    token = auth()['access_token']
    post_id = _new_post(client, post_json, token)

    parent = post_json(
        client, f'/posts/{post_id}/comments',
        {'content': '부모 댓글'},
        headers={'Authorization': f'Bearer {token}'},
    ).json_body

    post_json(
        client, f'/posts/{post_id}/comments',
        {'content': '대댓글', 'parent_id': parent['id']},
        headers={'Authorization': f'Bearer {token}'},
    )

    resp = client.http.get(f'/posts/{post_id}/comments')
    assert resp.status_code == 200
    comments = resp.json_body['comments']
    assert len(comments) == 1  # 부모만 최상위에 노출
    assert comments[0]['content'] == '부모 댓글'
    assert len(comments[0]['replies']) == 1
    assert comments[0]['replies'][0]['content'] == '대댓글'


def test_comment_validation_error(client, post_json, auth):
    token = auth()['access_token']
    post_id = _new_post(client, post_json, token)
    resp = post_json(
        client, f'/posts/{post_id}/comments',
        {'content': ''},
        headers={'Authorization': f'Bearer {token}'},
    )
    assert resp.status_code == 400
