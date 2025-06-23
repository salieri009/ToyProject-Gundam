from chalice import Blueprint
from ..database import get_db
from ..models.post import Post
from sqlalchemy import desc, func
from sqlalchemy.orm import joinedload

posts_bp = Blueprint(__name__)

@posts_bp.route('/posts', methods=['GET'])
def get_posts():
    request = posts_bp.current_request
    page = int(request.query_params.get('page', 1))
    limit = int(request.query_params.get('limit', 10))
    sort = request.query_params.get('sort', 'created_at')
    order = request.query_params.get('order', 'desc')
    
    db = next(get_db())
    
    # 게시글 목록 조회
    query = db.query(Post)\
        .options(joinedload(Post.author))\
        .outerjoin(Post.comments)\
        .group_by(Post.id)\
        .add_columns(func.count(Post.comments).label('comment_count'))
    
    # 정렬
    if sort == 'created_at':
        if order == 'desc':
            query = query.order_by(desc(Post.created_at))
        else:
            query = query.order_by(Post.created_at)
            
    # 페이지네이션
    total = query.count()
    posts = query.offset((page - 1) * limit).limit(limit).all()
    
    return {
        'posts': [
            {
                'id': str(post[0].id),
                'title': post[0].title,
                'content': post[0].content[:200] + '...' if len(post[0].content) > 200 else post[0].content,
                'author': {
                    'id': str(post[0].author.id),
                    'name': post[0].author.name
                },
                'comment_count': post[1],
                'created_at': post[0].created_at.isoformat(),
                'updated_at': post[0].updated_at.isoformat() if post[0].updated_at else None
            }
            for post in posts
        ],
        'pagination': {
            'page': page,
            'limit': limit,
            'total': total,
            'total_pages': (total + limit - 1) // limit
        }
    }

@posts_bp.route('/posts/{post_id}', methods=['GET'])
def get_post(post_id):
    db = next(get_db())
    post = db.query(Post)\
        .options(joinedload(Post.author))\
        .filter(Post.id == post_id)\
        .first()
    
    if not post:
        return {'error': 'Post not found'}, 404
        
    return {
        'id': str(post.id),
        'title': post.title,
        'content': post.content,
        'author': {
            'id': str(post.author.id),
            'name': post.author.name
        },
        'created_at': post.created_at.isoformat(),
        'updated_at': post.updated_at.isoformat() if post.updated_at else None
    }

@posts_bp.route('/posts', methods=['POST'])
def create_post():
    request = posts_bp.current_request
    user = request.context.get('user')
    
    if not user:
        return {'error': 'Not authenticated'}, 401
        
    data = request.json_body
    if not data.get('title') or not data.get('content'):
        return {'error': 'Title and content are required'}, 400
        
    db = next(get_db())
    post = Post(
        title=data['title'],
        content=data['content'],
        user_id=user.id
    )
    
    db.add(post)
    db.commit()
    db.refresh(post)
    
    return {
        'id': str(post.id),
        'title': post.title,
        'content': post.content,
        'author': {
            'id': str(user.id),
            'name': user.name
        },
        'created_at': post.created_at.isoformat()
    }, 201

@posts_bp.route('/posts/{post_id}', methods=['PUT'])
def update_post(post_id):
    request = posts_bp.current_request
    user = request.context.get('user')
    
    if not user:
        return {'error': 'Not authenticated'}, 401
        
    db = next(get_db())
    post = db.query(Post).filter(Post.id == post_id).first()
    
    if not post:
        return {'error': 'Post not found'}, 404
        
    if post.user_id != user.id:
        return {'error': 'Permission denied'}, 403
        
    data = request.json_body
    if data.get('title'):
        post.title = data['title']
    if data.get('content'):
        post.content = data['content']
        
    db.commit()
    db.refresh(post)
    
    return {
        'id': str(post.id),
        'title': post.title,
        'content': post.content,
        'updated_at': post.updated_at.isoformat()
    }

@posts_bp.route('/posts/{post_id}', methods=['DELETE'])
def delete_post(post_id):
    request = posts_bp.current_request
    user = request.context.get('user')
    
    if not user:
        return {'error': 'Not authenticated'}, 401
        
    db = next(get_db())
    post = db.query(Post).filter(Post.id == post_id).first()
    
    if not post:
        return {'error': 'Post not found'}, 404
        
    if post.user_id != user.id:
        return {'error': 'Permission denied'}, 403
        
    db.delete(post)
    db.commit()
    
    return '', 204 