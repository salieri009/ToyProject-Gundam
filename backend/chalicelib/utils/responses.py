"""
HTTP 응답 헬퍼

Chalice 1.29 는 view 함수의 `return (body, status_code)` 튜플을 상태코드로 해석하지
않고 JSON 배열로 직렬화(HTTP 200)한다. 올바른 상태코드를 반환하려면 chalice.Response 를
명시적으로 사용해야 하므로, 라우트 전반에서 공통으로 쓰는 헬퍼를 제공한다.
"""
from chalice import Response


def json_response(body, status_code: int = 200) -> Response:
    """dict/list 바디를 JSON 으로 직렬화하여 지정 상태코드로 반환."""
    return Response(
        body=body,
        status_code=status_code,
        headers={'Content-Type': 'application/json'},
    )


def error_response(message: str, status_code: int) -> Response:
    """`{'error': message}` 형태의 에러 응답."""
    return json_response({'error': message}, status_code)


def no_content() -> Response:
    """204 No Content."""
    return Response(body='', status_code=204, headers={})
