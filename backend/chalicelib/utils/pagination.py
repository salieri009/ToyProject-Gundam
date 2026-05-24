"""
페이지네이션 유틸리티
"""
import math
from chalicelib.config import config


def paginate(query, page: int = 1, limit: int = None):
    """쿼리 페이지네이션 — (items, pagination_dict) 반환"""
    if limit is None:
        limit = config.DEFAULT_PAGE_SIZE

    limit = min(max(1, limit), config.MAX_PAGE_SIZE)
    page = max(1, page)
    offset = (page - 1) * limit

    total = query.count()
    items = query.offset(offset).limit(limit).all()

    pagination = {
        'page': page,
        'limit': limit,
        'total': total,
        'total_pages': math.ceil(total / limit) if total > 0 else 1,
    }

    return items, pagination
