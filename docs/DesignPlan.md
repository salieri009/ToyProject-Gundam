# 건담 우주 게시판 프로젝트 기획안

## 📋 프로젝트 개요
**프로젝트명**: GUNDAM UNIVERSE BOARD  
**컨셉**: 건담 우주세기 테마의 간단한 게시판 시스템  
**목표**: 핵심 게시판 기능 중심의 깔끔한 커뮤니티 플랫폼

## 🚀 핵심 기능

### 1. 사용자 인증
- Google OAuth 2.0 로그인/로그아웃
- 기본 사용자 프로필 관리

### 2. 게시판 CRUD
- 글 작성 (제목 + 내용)
- 글 목록 조회 (페이지네이션)
- 글 상세 조회
- 글 수정/삭제 (본인만)

### 3. 댓글 시스템
- 댓글 작성/수정/삭제
- 대댓글 (1단계 depth)
- 댓글 목록 조회

## 🛠 기술 스택

### Frontend
- **React** + **TypeScript**
- **Next.js 14** (App Router)
- **Tailwind CSS**
- **Axios** (API 통신)

### Backend
- **AWS Chalice** (Python)
- **PostgreSQL** 
- **Google OAuth** (인증)
- **SQLAlchemy** (ORM)

### 배포 및 호스팅
- **Vercel** (Frontend)
- **AWS Lambda** (Backend via Chalice)
- **AWS RDS** (PostgreSQL)

## 🎨 UI/UX 컨셉
- **다크 테마** 기본 (우주 배경)
- **네온 블루/그린** 액센트 컬러
- **모빌슈트 HUD** 스타일 버튼/인터페이스
- **미니멀한 레이아웃** (핵심 기능 중심)

## 🗄 데이터베이스 설계

### users 테이블
```sql
id (UUID), email (VARCHAR), name (VARCHAR), 
google_id (VARCHAR), created_at (TIMESTAMP)
```

### posts 테이블
```sql
id (UUID), title (VARCHAR), content (TEXT), 
user_id (UUID), created_at (TIMESTAMP), updated_at (TIMESTAMP)
```

### comments 테이블
```sql
id (UUID), content (TEXT), post_id (UUID), user_id (UUID),
parent_id (UUID, NULL), created_at (TIMESTAMP), updated_at (TIMESTAMP)
```

## 🌐 API 설계

### 인증 API
- `POST /auth/google` - Google OAuth 로그인
- `POST /auth/logout` - 로그아웃
- `GET /auth/me` - 현재 사용자 정보

### 게시글 API
- `GET /posts` - 게시글 목록 (페이지네이션)
- `GET /posts/{id}` - 게시글 상세
- `POST /posts` - 게시글 작성
- `PUT /posts/{id}` - 게시글 수정
- `DELETE /posts/{id}` - 게시글 삭제

### 댓글 API
- `GET /posts/{id}/comments` - 댓글 목록
- `POST /posts/{id}/comments` - 댓글 작성
- `PUT /comments/{id}` - 댓글 수정
- `DELETE /comments/{id}` - 댓글 삭제

## 📂 프로젝트 구조

### Frontend (Next.js)
```
frontend/
├── src/app/
│   ├── posts/              # 게시글 페이지
│   ├── auth/               # 인증 페이지  
│   └── layout.tsx          # 레이아웃
├── components/             # UI 컴포넌트
├── lib/                    # API 호출 함수
└── types/                  # TypeScript 타입
```

### Backend (AWS Chalice)
```
backend/
├── app.py                  # Chalice 앱 엔트리포인트
├── chalicelib/
│   ├── models/            # SQLAlchemy 모델
│   ├── auth/              # 인증 관련
│   ├── routes/            # API 라우트
│   └── database.py        # DB 연결
└── requirements.txt
```

## 🎯 개발 우선순위

### 1단계: 백엔드 API (3-4일)
- AWS Chalice + PostgreSQL 설정
- Google OAuth 인증 구현
- 게시글/댓글 CRUD API

### 2단계: 프론트엔드 (3-4일)
- Next.js 기본 설정
- 인증 플로우 구현
- 게시판 UI 개발

### 3단계: 통합 & 배포 (2일)
- Frontend-Backend 연동
- AWS 배포
- 테스트 및 버그 수정

## 🔒 보안 고려사항
- JWT 토큰 인증
- CORS 설정
- SQL Injection 방지 (SQLAlchemy)
- XSS 방지 (입력값 검증)

---
*"건담, 출격!"*