"""
댓글 라우트
- PUT /comments/{id} — 댓글 수정 (작성자만)
- DELETE /comments/{id} — 댓글 삭제 (작성자만)
"""
from chalice import Blueprint

from chalicelib.database import get_db_session
from chalicelib.models.comment import Comment
from chalicelib.auth.middleware import require_auth
from chalicelib.serializers.comment import serialize_comment
from chalicelib.utils.validation import validate_comment_data

comments_bp = Blueprint(__name__)


@comments_bp.route('/comments/{comment_id}', methods=['PUT'])
def update_comment(comment_id):
    """댓글 수정"""
    request = comments_bp.current_request
    try:
        user = require_auth(request)
    except Exception as e:
        return {'error': str(e)}, 401

    data = request.json_body
    validated = validate_comment_data(data)

    with get_db_session() as session:
        comment = session.query(Comment).filter(Comment.id == comment_id).first()

        if not comment:
            return {'error': 'Comment not found'}, 404

        if str(comment.user_id) != str(user.id):
            return {'error': 'Permission denied'}, 403

        comment.content = validated['content']

        result = serialize_comment(comment)

    return result


@comments_bp.route('/comments/{comment_id}', methods=['DELETE'])
def delete_comment(comment_id):
    """댓글 삭제"""
    request = comments_bp.current_request
    try:
        user = require_auth(request)
    except Exception as e:
        return {'error': str(e)}, 401

    with get_db_session() as session:
        comment = session.query(Comment).filter(Comment.id == comment_id).first()

        if not comment:
            return {'error': 'Comment not found'}, 404

        if str(comment.user_id) != str(user.id):
            return {'error': 'Permission denied'}, 403

        session.delete(comment)

    return '', 204