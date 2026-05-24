"""게시글 직렬화"""


def serialize_post(post) -> dict:
    """게시글 상세 직렬화"""
    return {
        'id': str(post.id),
        'title': post.title,
        'content': post.content,
        'author': {
            'id': str(post.author.id),
            'name': post.author.name,
        },
        'created_at': post.created_at.isoformat() if post.created_at else None,
        'updated_at': post.updated_at.isoformat() if post.updated_at else None,
    }


def serialize_post_list(post, comment_count: int = 0) -> dict:
    """게시글 목록용 직렬화 (content 미리보기 + 댓글 수)"""
    content = post.content
    if len(content) > 200:
        content = content[:200] + '...'

    return {
        'id': str(post.id),
        'title': post.title,
        'content': content,
        'author': {
            'id': str(post.author.id),
            'name': post.author.name,
        },
        'comment_count': comment_count,
        'created_at': post.created_at.isoformat() if post.created_at else None,
        'updated_at': post.updated_at.isoformat() if post.updated_at else None,
    }
