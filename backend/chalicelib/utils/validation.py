"""
입력 검증 유틸리티
- 게시글/댓글 데이터 검증
- 길이 제한, 필수 필드 체크
"""
from chalice import BadRequestError
from chalicelib.config import config


def validate_post_data(data: dict) -> dict:
    """게시글 데이터 검증"""
    if not data:
        raise BadRequestError("Request body is required")

    title = data.get('title', '').strip()
    content = data.get('content', '').strip()

    if not title:
        raise BadRequestError("Title is required")

    if not content:
        raise BadRequestError("Content is required")

    if len(title) > config.POST_TITLE_MAX_LENGTH:
        raise BadRequestError(f"Title must be {config.POST_TITLE_MAX_LENGTH} characters or less")

    if len(content) > config.POST_CONTENT_MAX_LENGTH:
        raise BadRequestError(f"Content must be {config.POST_CONTENT_MAX_LENGTH} characters or less")

    return {'title': title, 'content': content}


def validate_comment_data(data: dict) -> dict:
    """댓글 데이터 검증"""
    if not data:
        raise BadRequestError("Request body is required")

    content = data.get('content', '').strip()
    parent_id = data.get('parent_id')

    if not content:
        raise BadRequestError("Content is required")

    if len(content) > config.COMMENT_CONTENT_MAX_LENGTH:
        raise BadRequestError(f"Content must be {config.COMMENT_CONTENT_MAX_LENGTH} characters or less")

    return {'content': content, 'parent_id': parent_id}
