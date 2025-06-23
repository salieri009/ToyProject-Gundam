from .auth import auth_bp
from .posts import posts_bp
from .comments import comments_bp

def register_routes(app):
    app.register_blueprint(auth_bp)
    app.register_blueprint(posts_bp)
    app.register_blueprint(comments_bp) 