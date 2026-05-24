"""댓글 직렬화 (대댓글 중첩 포함)"""


def serialize_comment(comment) -> dict:
    """단일 댓글 직렬화"""
    return {
        'id': str(comment.id),
        'content': comment.content,
        'author': {
            'id': str(comment.author.id),
            'name': comment.author.name,
        },
        'parent_id': str(comment.parent_id) if comment.parent_id else None,
        'created_at': comment.created_at.isoformat() if comment.created_at else None,
        'updated_at': comment.updated_at.isoformat() if comment.updated_at else None,
    }


def serialize_comment_with_replies(comment, replies=None) -> dict:
    """부모 댓글 + 대댓글 중첩 직렬화"""
    result = serialize_comment(comment)
    result['replies'] = [serialize_comment(r) for r in (replies or [])]
    return result
