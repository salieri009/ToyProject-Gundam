# API 설계 문서

## 📡 Base URL
- **Development**: `http://localhost:8000`
- **Production**: `https://api.gundam-board.com`

## 🔐 인증 시스템

### JWT 토큰 기반 인증
- **Header**: `Authorization: Bearer <token>`
- **Token 만료**: 24시간
- **Refresh Token**: 30일

### 인증 API

#### POST /auth/google
Google OAuth 로그인
```json
// Request
{
  "id_token": "google_id_token"
}

// Response 200
{
  "access_token": "jwt_token",
  "refresh_token": "refresh_token", 
  "user": {
    "id": "uuid",
    "email": "user@example.com",
    "name": "User Name"
  }
}

// Error 401
{
  "error": "Invalid Google token"
}
```

#### POST /auth/refresh
토큰 갱신
```json
// Request
{
  "refresh_token": "refresh_token"
}

// Response 200
{
  "access_token": "new_jwt_token"
}
```

#### GET /auth/me
현재 사용자 정보 (인증 필요)
```json
// Response 200
{
  "id": "uuid",
  "email": "user@example.com", 
  "name": "User Name",
  "created_at": "2024-01-01T00:00:00Z"
}

// Error 401
{
  "error": "Unauthorized"
}
```

## 📝 게시글 API

#### GET /posts
게시글 목록 조회
```json
// Query Parameters
?page=1&limit=10&sort=created_at&order=desc

// Response 200
{
  "posts": [
    {
      "id": "uuid",
      "title": "게시글 제목",
      "content": "게시글 내용 미리보기...",
      "author": {
        "id": "uuid",
        "name": "작성자명"
      },
      "comment_count": 5,
      "created_at": "2024-01-01T00:00:00Z",
      "updated_at": "2024-01-01T00:00:00Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 100,
    "total_pages": 10
  }
}
```

#### GET /posts/{id}
게시글 상세 조회
```json
// Response 200
{
  "id": "uuid",
  "title": "게시글 제목",
  "content": "전체 게시글 내용",
  "author": {
    "id": "uuid", 
    "name": "작성자명"
  },
  "created_at": "2024-01-01T00:00:00Z",
  "updated_at": "2024-01-01T00:00:00Z"
}

// Error 404
{
  "error": "Post not found"
}
```

#### POST /posts
게시글 작성 (인증 필요)
```json
// Request
{
  "title": "게시글 제목",
  "content": "게시글 내용"
}

// Response 201
{
  "id": "uuid",
  "title": "게시글 제목",
  "content": "게시글 내용",
  "author": {
    "id": "uuid",
    "name": "작성자명"
  },
  "created_at": "2024-01-01T00:00:00Z"
}

// Error 400
{
  "error": "Title and content are required"
}
```

#### PUT /posts/{id}
게시글 수정 (작성자만)
```json
// Request
{
  "title": "수정된 제목",
  "content": "수정된 내용"
}

// Response 200
{
  "id": "uuid",
  "title": "수정된 제목", 
  "content": "수정된 내용",
  "updated_at": "2024-01-01T00:00:00Z"
}

// Error 403
{
  "error": "Permission denied"
}
```

#### DELETE /posts/{id}
게시글 삭제 (작성자만)
```json
// Response 204
No Content

// Error 403  
{
  "error": "Permission denied"
}
```

## 💬 댓글 API

#### GET /posts/{post_id}/comments
댓글 목록 조회
```json
// Response 200
{
  "comments": [
    {
      "id": "uuid",
      "content": "댓글 내용",
      "author": {
        "id": "uuid",
        "name": "작성자명"
      },
      "parent_id": null,
      "created_at": "2024-01-01T00:00:00Z",
      "updated_at": "2024-01-01T00:00:00Z",
      "replies": [
        {
          "id": "uuid",
          "content": "대댓글 내용",
          "author": {
            "id": "uuid", 
            "name": "작성자명"
          },
          "parent_id": "parent_comment_uuid",
          "created_at": "2024-01-01T00:00:00Z"
        }
      ]
    }
  ]
}
```

#### POST /posts/{post_id}/comments
댓글 작성 (인증 필요)
```json
// Request
{
  "content": "댓글 내용",
  "parent_id": null  // 대댓글인 경우 부모 댓글 ID
}

// Response 201
{
  "id": "uuid",
  "content": "댓글 내용",
  "parent_id": null,
  "author": {
    "id": "uuid",
    "name": "작성자명"
  },
  "created_at": "2024-01-01T00:00:00Z"
}
```

#### PUT /comments/{id}
댓글 수정 (작성자만)
```json
// Request
{
  "content": "수정된 댓글"
}

// Response 200
{
  "id": "uuid",
  "content": "수정된 댓글",
  "updated_at": "2024-01-01T00:00:00Z"
}
```

#### DELETE /comments/{id}
댓글 삭제 (작성자만)
```json
// Response 204
No Content
```

## 📊 공통 응답 형식

### 성공 응답
- **200**: OK
- **201**: Created  
- **204**: No Content

### 에러 응답
```json
{
  "error": "Error message",
  "details": "Detailed error description (optional)"
}
```

### 에러 코드
- **400**: Bad Request (잘못된 요청)
- **401**: Unauthorized (인증 필요)
- **403**: Forbidden (권한 없음)
- **404**: Not Found (리소스 없음)
- **500**: Internal Server Error (서버 오류)

## 🔧 Validation Rules

### 게시글
- **title**: 1-200자, 필수
- **content**: 1-10000자, 필수

### 댓글  
- **content**: 1-1000자, 필수

### 페이지네이션
- **page**: 1 이상, 기본값 1
- **limit**: 1-50, 기본값 10 