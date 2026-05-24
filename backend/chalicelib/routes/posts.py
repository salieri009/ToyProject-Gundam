"""
게시글 라우트
- GET /posts — 목록 (페이지네이션)
- GET /posts/{id} — 상세
- POST /posts — 작성 (인증 필요)
- PUT /posts/{id} — 수정 (작성자만)
- DELETE /posts/{id} — 삭제 (작성자만)
- GET /posts/{id}/comments — 댓글 목록 (중첩 라우트)
- POST /posts/{id}/comments — 댓글 작성 (중첩 라우트)
"""
from chalice import Blueprint
from sqlalchemy import func
from sqlalchemy.orm import joinedload

from chalicelib.database import get_db_session
from chalicelib.models.post import Post
from chalicelib.models.comment import Comment
from chalicelib.auth.middleware import require_auth, get_current_user
from chalicelib.serializers.post import serialize_post, serialize_post_list
from chalicelib.serializers.comment import serialize_comment, serialize_comment_with_replies
from chalicelib.utils.validation import validate_post_data, validate_comment_data
from chalicelib.utils.pagination import paginate

posts_bp = Blueprint(__name__)


@posts_bp.route('/posts', methods=['GET'])
def get_posts():
    """게시글 목록 조회"""
    request = posts_bp.current_request
    params = request.query_params or {}
    page = int(params.get('page', 1))
    limit = min(int(params.get('limit', 10)), 50)

    with get_db_session() as session:
        # comment_count 서브쿼리
        comment_count_sq = session.query(
            Comment.post_id,
            func.count(Comment.id).label('comment_count')
        ).group_by(Comment.post_id).subquery()

        query = session.query(Post, func.coalesce(comment_count_sq.c.comment_count, 0))\
            .outerjoin(comment_count_sq, Post.id == comment_count_sq.c.post_id)\
            .options(joinedload(Post.author))\
            .order_by(Post.created_at.desc())

        items, pagination = paginate(query, page, limit)

        return {
            'posts': [
                serialize_post_list(post, count)
                for post, count in items
            ],
            'pagination': pagination,
        }


@posts_bp.route('/posts/{post_id}', methods=['GET'])
def get_post(post_id):
    """게시글 상세 조회"""
    with get_db_session() as session:
        post = session.query(Post)\
            .options(joinedload(Post.author))\
            .filter(Post.id == post_id)\
            .first()

        if not post:
            return {'error': 'Post not found'}, 404

        return serialize_post(post)


@posts_bp.route('/posts', methods=['POST'])
def create_post():
    """게시글 작성"""
    request = posts_bp.current_request
    try:
        user = require_auth(request)
    except Exception as e:
        return {'error': str(e)}, 401

    data = request.json_body
    validated = validate_post_data(data)

    with get_db_session() as session:
        post = Post(
            title=validated['title'],
            content=validated['content'],
            user_id=user.id,
        )
        session.add(post)
        session.flush()
        session.refresh(post)

        result = {
            'id': str(post.id),
            'title': post.title,
            'content': post.content,
            'author': {
                'id': str(user.id),
                'name': user.name,
            },
            'created_at': post.created_at.isoformat() if post.created_at else None,
        }

    return result, 201


@posts_bp.route('/posts/{post_id}', methods=['PUT'])
def update_post(post_id):
    """게시글 수정"""
    request = posts_bp.current_request
    try:
        user = require_auth(request)
    except Exception as e:
        return {'error': str(e)}, 401

    data = request.json_body
    validated = validate_post_data(data)

    with get_db_session() as session:
        post = session.query(Post).filter(Post.id == post_id).first()

        if not post:
            return {'error': 'Post not found'}, 404

        if str(post.user_id) != str(user.id):
            return {'error': 'Permission denied'}, 403

        post.title = validated['title']
        post.content = validated['content']

        result = {
            'id': str(post.id),
            'title': post.title,
            'content': post.content,
            'updated_at': post.updated_at.isoformat() if post.updated_at else None,
        }

    return result


@posts_bp.route('/posts/{post_id}', methods=['DELETE'])
def delete_post(post_id):
    """게시글 삭제"""
    request = posts_bp.current_request
    try:
        user = require_auth(request)
    except Exception as e:
        return {'error': str(e)}, 401

    with get_db_session() as session:
        post = session.query(Post).filter(Post.id == post_id).first()

        if not post:
            return {'error': 'Post not found'}, 404

        if str(post.user_id) != str(user.id):
            return {'error': 'Permission denied'}, 403

        session.delete(post)

    return '', 204


# ── 댓글 중첩 라우트 (/posts/{id}/comments) ──

@posts_bp.route('/posts/{post_id}/comments', methods=['GET'])
def get_post_comments(post_id):
    """게시글의 댓글 목록 (계층 구조)"""
    with get_db_session() as session:
        # 부모 댓글만 조회
        parent_comments = session.query(Comment)\
            .options(joinedload(Comment.author))\
            .filter(Comment.post_id == post_id, Comment.parent_id.is_(None))\
            .order_by(Comment.created_at)\
            .all()

        result = []
        for comment in parent_comments:
            # 각 부모 댓글의 대댓글 조회
            replies = session.query(Comment)\
                .options(joinedload(Comment.author))\
                .filter(Comment.parent_id == comment.id)\
                .order_by(Comment.created_at)\
                .all()
            result.append(serialize_comment_with_replies(comment, replies))

        return {'comments': result}


@posts_bp.route('/posts/{post_id}/comments', methods=['POST'])
def create_post_comment(post_id):
    """게시글에 댓글 작성"""
    request = posts_bp.current_request
    try:
        user = require_auth(request)
    except Exception as e:
        return {'error': str(e)}, 401

    data = request.json_body
    validated = validate_comment_data(data)

    with get_db_session() as session:
        comment = Comment(
            content=validated['content'],
            post_id=post_id,
            user_id=user.id,
            parent_id=validated.get('parent_id'),
        )
        session.add(comment)
        session.flush()
        session.refresh(comment)

        result = {
            'id': str(comment.id),
            'content': comment.content,
            'parent_id': str(comment.parent_id) if comment.parent_id else None,
            'author': {
                'id': str(user.id),
                'name': user.name,
            },
            'created_at': comment.created_at.isoformat() if comment.created_at else None,
        }

    return result, 201