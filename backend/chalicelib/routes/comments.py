from chalice import Blueprint
from ..database import get_db
from ..models.comment import Comment
from ..auth.middleware import require_auth
from sqlalchemy import desc
from sqlalchemy.orm import joinedload

comments_bp = Blueprint(__name__)

@comments_bp.route('/posts/{post_id}/comments', methods=['GET'])
def get_comments(post_id):
    db = next(get_db())
    
    # 부모 댓글만 조회
    parent_comments = db.query(Comment)\
        .options(joinedload(Comment.author))\
        .filter(Comment.post_id == post_id, Comment.parent_id.is_(None))\
        .order_by(Comment.created_at)\
        .all()
    
    # 각 부모 댓글의 대댓글 조회
    for comment in parent_comments:
        comment.replies = db.query(Comment)\
            .options(joinedload(Comment.author))\
            .filter(Comment.parent_id == comment.id)\
            .order_by(Comment.created_at)\
            .all()
    
    return {
        'comments': [
            {
                'id': str(comment.id),
                'content': comment.content,
                'author': {
                    'id': str(comment.author.id),
                    'name': comment.author.name
                },
                'parent_id': str(comment.parent_id) if comment.parent_id else None,
                'created_at': comment.created_at.isoformat(),
                'updated_at': comment.updated_at.isoformat() if comment.updated_at else None,
                'replies': [
                    {
                        'id': str(reply.id),
                        'content': reply.content,
                        'author': {
                            'id': str(reply.author.id),
                            'name': reply.author.name
                        },
                        'parent_id': str(reply.parent_id),
                        'created_at': reply.created_at.isoformat()
                    }
                    for reply in comment.replies
                ]
            }
            for comment in parent_comments
        ]
    }

@comments_bp.route('/posts/{post_id}/comments', methods=['POST'])
def create_comment(post_id):
    request = comments_bp.current_request
    try:
        user = require_auth(request)
    except Exception as e:
        return {'error': str(e)}, 401
        
    data = request.json_body
    if not data.get('content'):
        return {'error': 'Content is required'}, 400
        
    db = next(get_db())
    comment = Comment(
        content=data['content'],
        post_id=post_id,
        user_id=user.id,
        parent_id=data.get('parent_id')
    )
    
    db.add(comment)
    db.commit()
    db.refresh(comment)
    
    return {
        'id': str(comment.id),
        'content': comment.content,
        'parent_id': str(comment.parent_id) if comment.parent_id else None,
        'author': {
            'id': str(user.id),
            'name': user.name
        },
        'created_at': comment.created_at.isoformat()
    }, 201

@comments_bp.route('/comments/{comment_id}', methods=['PUT'])
def update_comment(comment_id):
    request = comments_bp.current_request
    try:
        user = require_auth(request)
    except Exception as e:
        return {'error': str(e)}, 401
        
    db = next(get_db())
    comment = db.query(Comment).filter(Comment.id == comment_id).first()
    
    if not comment:
        return {'error': 'Comment not found'}, 404
        
    if comment.user_id != user.id:
        return {'error': 'Permission denied'}, 403
        
    data = request.json_body
    if data.get('content'):
        comment.content = data['content']
        
    db.commit()
    db.refresh(comment)
    
    return {
        'id': str(comment.id),
        'content': comment.content,
        'parent_id': str(comment.parent_id) if comment.parent_id else None,
        'author': {
            'id': str(comment.author.id),
            'name': comment.author.name
        },
        'created_at': comment.created_at.isoformat(),
        'updated_at': comment.updated_at.isoformat()
    }

@comments_bp.route('/comments/{comment_id}', methods=['DELETE'])
def delete_comment(comment_id):
    request = comments_bp.current_request
    try:
        user = require_auth(request)
    except Exception as e:
        return {'error': str(e)}, 401
        
    db = next(get_db())
    comment = db.query(Comment).filter(Comment.id == comment_id).first()
    
    if not comment:
        return {'error': 'Comment not found'}, 404
        
    if comment.user_id != user.id:
        return {'error': 'Permission denied'}, 403
        
    db.delete(comment)
    db.commit()
    
    return '', 204 