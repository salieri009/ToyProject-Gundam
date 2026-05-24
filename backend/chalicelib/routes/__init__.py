"""라우트 등록"""
from chalicelib.routes.auth import auth_bp
from chalicelib.routes.posts import posts_bp
from chalicelib.routes.comments import comments_bp


def register_routes(app):
    """모든 블루프린트를 앱에 등록"""
    app.register_blueprint(auth_bp)
    app.register_blueprint(posts_bp)
    app.register_blueprint(comments_bp)