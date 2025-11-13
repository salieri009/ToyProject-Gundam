# 🤖 GUNDAM UNIVERSE BOARD

> **건담 우주세기 테마의 차세대 게시판 플랫폼**  
> Google OAuth, JWT 기반 인증 • Next.js + Chalice 마이크로서비스 아키텍처  
> PostgreSQL 데이터베이스 • AWS Lambda 서버리스 배포

[![Node.js](https://img.shields.io/badge/Node.js-v22.20.0-339933?logo=node.js)](https://nodejs.org)
[![Python](https://img.shields.io/badge/Python-3.13.8-3776ab?logo=python)](https://www.python.org)
[![Next.js](https://img.shields.io/badge/Next.js-14-000000?logo=nextdotjs)](https://nextjs.org)
[![AWS](https://img.shields.io/badge/AWS-Lambda%20%2B%20API%20Gateway-FF9900?logo=amazon-aws)](https://aws.amazon.com)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-15+-316192?logo=postgresql)](https://www.postgresql.org)
[![License](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

**한국어** | [English](README.en.md) | [日本語](README.ja.md)

---

<div align="center">

![Header](https://capsule-render.vercel.app/api?type=wave&color=gradient&customColorList=0,2,5,30&height=200&text=GUNDAM%20UNIVERSE%20BOARD&fontSize=60&fontColor=ffffff&animation=fadeIn&desc=Next-Generation%20Community%20Platform&descSize=20&descAlignY=70)

</div>

---

## 📖 About

**GUNDAM UNIVERSE BOARD**는 건담 우주세기 팬들을 위한 커뮤니티 플랫폼입니다.  
현대적인 웹 기술 스택을 활용하여 **사용자 인증**, **게시판 CRUD**, **계층형 댓글 시스템**을 구현했습니다.

이 프로젝트는 다음을 시연합니다:

- 🔐 **JWT + Google OAuth** 기반 안전한 인증 흐름
- 🏗️ **마이크로서비스 아키텍처**: 독립적인 프론트엔드/백엔드 분리
- 📊 **데이터베이스 최적화**: SQLAlchemy ORM, 인덱싱, 쿼리 최적화
- ☁️ **클라우드 네이티브**: AWS Lambda (Chalice), PostgreSQL RDS
- 🎨 **레트로 80s CRT 테마**: Nixie Tube 수치 표시, 인광 초록색 디자인

---

## 📁 프로젝트 구조 (30년차 엔지니어 관점)

이 섹션은 30년간의 소프트웨어 엔지니어링 경험을 바탕으로 작성되었습니다. 프로젝트의 아키텍처 설계 원칙과 각 레이어의 책임 분리를 명확히 설명합니다.

### 전체 디렉토리 구조

```
ToyProject-Gundam/
├── backend/                          # AWS Chalice 백엔드 서비스
│   ├── app.py                        # Chalice 애플리케이션 엔트리포인트
│   ├── requirements.txt              # Python 의존성 관리
│   └── chalicelib/                   # 핵심 비즈니스 로직 라이브러리
│       ├── config.py                 # 환경 변수 및 설정 관리
│       ├── database.py                # SQLAlchemy 세션 관리 및 연결 풀
│       ├── auth/                     # 인증 관련 모듈
│       │   ├── google_auth.py        # Google OAuth 2.0 검증 로직
│       │   └── jwt.py                # JWT 토큰 생성/검증 유틸리티
│       ├── models/                   # SQLAlchemy ORM 모델 (도메인 엔티티)
│       │   ├── user.py               # 사용자 엔티티 (users 테이블)
│       │   ├── post.py               # 게시글 엔티티 (posts 테이블)
│       │   ├── comment.py            # 댓글 엔티티 (comments 테이블)
│       │   └── refresh_token.py      # 리프레시 토큰 엔티티
│       └── routes/                   # REST API 엔드포인트 정의
│           ├── __init__.py           # 라우트 등록 및 Blueprint 통합
│           ├── auth.py               # 인증 API (/auth/*)
│           ├── posts.py              # 게시글 API (/posts/*)
│           └── comments.py           # 댓글 API (/comments/*)
│
├── frontend/                         # Next.js 프론트엔드 애플리케이션
│   ├── package.json                  # Node.js 의존성 및 스크립트
│   ├── next.config.js                # Next.js 빌드 설정
│   ├── tailwind.config.js            # Tailwind CSS 유틸리티 설정
│   ├── tsconfig.json                 # TypeScript 컴파일러 설정
│   └── src/
│       ├── app/                      # Next.js 14 App Router (파일 기반 라우팅)
│       │   ├── layout.tsx            # 루트 레이아웃 (전역 스타일, 메타데이터)
│       │   ├── page.tsx              # 홈페이지 (/)
│       │   ├── globals.css           # 전역 CSS 스타일 (CRT 테마)
│       │   ├── auth/
│       │   │   └── page.tsx          # 인증 페이지 (/auth)
│       │   └── posts/
│       │       ├── page.tsx          # 게시글 목록 (/posts)
│       │       ├── new/
│       │       │   └── page.tsx      # 게시글 작성 (/posts/new)
│       │       └── [id]/
│       │           ├── page.tsx      # 게시글 상세 (/posts/:id)
│       │           └── edit/
│       │               └── page.tsx  # 게시글 수정 (/posts/:id/edit)
│       │
│       ├── components/               # 재사용 가능한 React 컴포넌트
│       │   ├── layout/               # 레이아웃 컴포넌트
│       │   │   ├── Header.tsx        # 네비게이션 헤더
│       │   │   └── Footer.tsx        # 푸터
│       │   └── ui/                   # UI 프리미티브 컴포넌트
│       │       ├── LoadingSpinner.tsx    # 로딩 인디케이터
│       │       ├── NixieNumber.tsx       # Nixie Tube 스타일 숫자 표시
│       │       └── StatusIndicator.tsx   # 상태 표시기
│       │
│       ├── services/                 # 외부 API 통신 레이어
│       │   ├── api.ts                # Axios 인스턴스 및 인터셉터 설정
│       │   └── weatherService.ts     # (참고용) 날씨 API 서비스
│       │
│       ├── hooks/                    # 커스텀 React Hooks
│       │   └── useAuth.ts            # 인증 상태 관리 훅
│       │
│       ├── context/                  # React Context API (전역 상태)
│       │   └── WeatherContext.tsx     # (참고용) 날씨 컨텍스트
│       │
│       ├── types/                    # TypeScript 타입 정의
│       │   ├── index.ts              # 공통 타입 (User, Post, Comment)
│       │   └── weather.ts            # 날씨 관련 타입
│       │
│       └── pages/                    # (레거시) Pages Router 컴포넌트
│           ├── AuthPage.tsx
│           ├── HomePage.tsx
│           ├── PostsPage.tsx
│           ├── PostDetailPage.tsx
│           └── NewPostPage.tsx
│
└── docs/                             # 프로젝트 문서화
    ├── DesignPlan.md                 # 프로젝트 기획 및 설계 문서
    ├── LOCAL_SETUP_GUIDE.md          # 로컬 개발 환경 설정 가이드
    ├── LOCAL_SETUP_GUIDE.en.md       # 로컬 개발 환경 설정 가이드 (영어)
    ├── LOCAL_SETUP_GUIDE.ja.md       # 로컬 개발 환경 설정 가이드 (일본어)
    ├── 01_API_Design.md              # REST API 명세서
    ├── 02_Database_Design.md         # 데이터베이스 스키마 설계
    ├── 03_Frontend_Architecture.md   # 프론트엔드 아키텍처 문서
    ├── 04_Backend_Architecture.md    # 백엔드 아키텍처 문서
    └── 05_UI_UX_Design.md            # UI/UX 디자인 가이드
```

### 아키텍처 설계 원칙

#### 1. **관심사의 분리 (Separation of Concerns)**
- **Backend**: 비즈니스 로직, 데이터 검증, 데이터베이스 접근만 담당
- **Frontend**: 사용자 인터페이스, 상태 관리, API 호출만 담당
- **Database**: 데이터 영속성 및 관계 관리

#### 2. **레이어드 아키텍처 (Layered Architecture)**
```
┌─────────────────────────────────────┐
│   Presentation Layer (Next.js)     │  ← 사용자 인터페이스
├─────────────────────────────────────┤
│   Application Layer (Chalice)      │  ← 비즈니스 로직
├─────────────────────────────────────┤
│   Data Access Layer (SQLAlchemy)   │  ← 데이터베이스 추상화
├─────────────────────────────────────┤
│   Database Layer (PostgreSQL)      │  ← 데이터 영속성
└─────────────────────────────────────┘
```

#### 3. **의존성 역전 원칙 (Dependency Inversion Principle)**
- `routes/` 모듈은 `models/`와 `auth/`에 의존하지만, 구체적인 구현이 아닌 인터페이스에 의존
- SQLAlchemy ORM을 통해 데이터베이스 구현 세부사항을 추상화

#### 4. **단일 책임 원칙 (Single Responsibility Principle)**
- 각 모듈은 하나의 명확한 책임만 가짐
  - `auth/google_auth.py`: Google OAuth 검증만 담당
  - `auth/jwt.py`: JWT 토큰 생성/검증만 담당
  - `routes/posts.py`: 게시글 관련 API만 담당

### 핵심 모듈 상세 설명

#### Backend: `chalicelib/`

**`database.py`** - 데이터베이스 연결 관리
- SQLAlchemy `SessionLocal` 팩토리 패턴
- 연결 풀링을 통한 성능 최적화
- 컨텍스트 매니저를 통한 세션 생명주기 관리

**`models/`** - 도메인 모델 (Entity Layer)
- SQLAlchemy 2.0 스타일 ORM 모델
- 관계형 매핑 (User ↔ Post ↔ Comment)
- 타임스탬프 자동 관리 (`created_at`, `updated_at`)

**`routes/`** - API 엔드포인트 (Controller Layer)
- Chalice Blueprint를 통한 모듈화된 라우팅
- 요청 검증 및 응답 직렬화
- 인증 미들웨어 통합

**`auth/`** - 인증 및 인가 (Security Layer)
- Google OAuth 2.0 ID 토큰 검증
- JWT 액세스 토큰 및 리프레시 토큰 관리
- 토큰 만료 및 갱신 로직

#### Frontend: `src/`

**`app/`** - Next.js App Router (라우팅 레이어)
- 파일 시스템 기반 라우팅
- 서버 컴포넌트 및 클라이언트 컴포넌트 분리
- 레이아웃 중첩을 통한 UI 재사용

**`services/api.ts`** - HTTP 클라이언트 (통신 레이어)
- Axios 인스턴스 싱글톤 패턴
- 요청 인터셉터: JWT 토큰 자동 주입
- 응답 인터셉터: 401 에러 시 자동 로그아웃

**`components/`** - UI 컴포넌트 (프레젠테이션 레이어)
- 원자적 설계 원칙 (Atomic Design) 준수
- 재사용 가능한 UI 프리미티브
- 레트로 80s CRT 테마 스타일링

**`hooks/useAuth.ts`** - 인증 상태 관리 (상태 레이어)
- React Context API를 통한 전역 인증 상태
- 로컬 스토리지와의 동기화
- 토큰 갱신 로직

### 데이터 흐름 (Data Flow)

```
1. 사용자 액션 (Frontend)
   ↓
2. API 호출 (services/api.ts)
   ↓
3. HTTP 요청 (Axios Interceptor → JWT 자동 주입)
   ↓
4. API Gateway (AWS Lambda)
   ↓
5. Chalice 라우트 핸들러 (routes/*.py)
   ↓
6. 인증 미들웨어 (auth/jwt.py)
   ↓
7. 비즈니스 로직 처리
   ↓
8. 데이터베이스 쿼리 (SQLAlchemy ORM)
   ↓
9. PostgreSQL 실행
   ↓
10. 응답 반환 (역순)
```

### 확장성 고려사항

- **수평 확장**: AWS Lambda는 자동으로 트래픽에 따라 스케일링
- **데이터베이스 연결 풀**: SQLAlchemy QueuePool로 동시 연결 관리
- **캐싱 전략**: 향후 Redis 도입 가능한 구조
- **마이크로서비스 분리**: 각 Blueprint를 독립적인 Lambda 함수로 분리 가능

---

## 🏛️ 솔루션 아키텍처

<div align="center">

```
┌─────────────────────────────────────────────────────┐
│              GUNDAM UNIVERSE BOARD                  │
├──────────────────────┬──────────────────────────────┤
│  FRONTEND (Next.js)  │   BACKEND (AWS Chalice)      │
│                      │                              │
│  • React Components  │  • JWT + OAuth Routes        │
│  • TypeScript        │  • Post/Comment APIs         │
│  • Tailwind CSS      │  • Request Validation        │
│  • Axios HTTP Client │  • Lambda Functions          │
│                      │                              │
│  localhost:5173      │   API Gateway: api.*         │
└──────────┬───────────┴──────────┬───────────────────┘
           │                      │
           └──────────────────────┤
                    HTTPS/JSON-RPC
                  (JWT Authorization)
                                   │
                    ┌──────────────┴──────────────┐
                    │  PostgreSQL 15+ (RDS)      │
                    │  • Users                   │
                    │  • Posts                   │
                    │  • Comments (Hierarchical)│
                    │  • Refresh Tokens          │
                    └────────────────────────────┘
```

</div>

### 인증 흐름

1. **로그인**: 사용자 → Google OAuth → Backend (`/auth/google`)
2. **토큰 발급**: Backend → JWT (24h) + Refresh Token (7d)
3. **API 요청**: Frontend → Axios Interceptor (Bearer Token 자동 포함)
4. **토큰 갱신**: 만료 시 `/auth/refresh` 호출 → 새 JWT 발급
5. **로그아웃**: 클라이언트 토큰 삭제 + Refresh Token 무효화

---

## 🛠️ 기술 스택

### Frontend

| Layer | Technology | Purpose |
|-------|-----------|---------|
| **Framework** | Next.js 14 (App Router) | 프로덕션급 React 프레임워크 |
| **Language** | TypeScript | 타입 안전성 |
| **Styling** | Tailwind CSS | 유틸리티 기반 스타일링 |
| **HTTP Client** | Axios | 자동 JWT 인터셉터 포함 |
| **Auth** | @react-oauth/google | Google OAuth 2.0 |
| **State** | React Context + Hooks | 간단한 전역 상태 관리 |
| **Forms** | React Hook Form + Zod | 폼 검증 및 상태 관리 |

### Backend

| Layer | Technology | Purpose |
|-------|-----------|---------|
| **Framework** | AWS Chalice | Python Lambda 마이크로프레임워크 |
| **Language** | Python 3.13 | 타입 힌팅 지원 |
| **ORM** | SQLAlchemy + psycopg2 | PostgreSQL 객체 매핑 |
| **Auth** | PyJWT + google-auth | JWT + Google 토큰 검증 |
| **Deployment** | AWS Lambda + API Gateway | 서버리스 컴퓨팅 |
| **CORS** | Chalice CORS | 크로스 도메인 요청 처리 |

### Database

| Component | Technology |
|-----------|-----------|
| **DBMS** | PostgreSQL 15+ |
| **ORM** | SQLAlchemy 2.0 |
| **Connection Pool** | SQLAlchemy QueuePool |
| **Indexes** | B-tree on users.email, posts.user_id, comments.post_id |

---

## 🚀 빠른 시작

### 사전 요구사항

- **Node.js** v22.20.0 이상
- **Python** 3.13 이상
- **PostgreSQL** 15 이상 (로컬 또는 AWS RDS)
- **Google OAuth 2.0** 인증 정보 ([Google Cloud Console](https://console.cloud.google.com))

### 로컬 개발 환경 셋업

> **📖 상세한 설정 가이드**: [`docs/LOCAL_SETUP_GUIDE.md`](docs/LOCAL_SETUP_GUIDE.md) | [English](docs/LOCAL_SETUP_GUIDE.en.md) | [日本語](docs/LOCAL_SETUP_GUIDE.ja.md)

#### 1️⃣ 저장소 클론

```bash
git clone https://github.com/salieri009/ToyProject-Gundam.git
cd ToyProject-Gundam
```

#### 2️⃣ Backend 설정 & 실행

```bash
# backend 폴더로 이동
cd backend

# 가상환경 생성
python -m venv venv

# 활성화 (Windows PowerShell)
.\venv\Scripts\Activate

# 또는 (Windows CMD/Git Bash)
# venv\Scripts\activate

# 패키지 설치
pip install -r requirements.txt

# 환경 변수 설정
# .env 파일 생성 (참고: .env.example)
# DATABASE_URL, JWT_SECRET, GOOGLE_CLIENT_ID 입력

# 로컬 개발 서버 시작 (포트 8000)
chalice local --port 8000
```

#### 3️⃣ Frontend 설정 & 실행

```bash
# 프로젝트 루트로 돌아가기
cd ../frontend

# 패키지 설치
npm install

# 환경 변수 설정
# .env.local 파일 생성 (참고: .env.local.example)
# NEXT_PUBLIC_API_URL, NEXT_PUBLIC_GOOGLE_CLIENT_ID 입력

# 개발 서버 시작 (포트 5173)
npm run dev
```

#### 4️⃣ 브라우저에서 접속

- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:8000

---

## 📚 문서

<div align="center">

| 문서 | 설명 |
|------|------|
| [`docs/LOCAL_SETUP_GUIDE.md`](docs/LOCAL_SETUP_GUIDE.md) | 로컬 개발 환경 완전 설정 가이드 (PostgreSQL, 환경변수, Google OAuth) |
| [`docs/LOCAL_SETUP_GUIDE.en.md`](docs/LOCAL_SETUP_GUIDE.en.md) | Complete local development setup guide |
| [`docs/LOCAL_SETUP_GUIDE.ja.md`](docs/LOCAL_SETUP_GUIDE.ja.md) | ローカル開発環境セットアップガイド |
| [`docs/01_API_Design.md`](docs/01_API_Design.md) | REST API 엔드포인트 명세서 (요청/응답 스키마) |
| [`docs/02_Database_Design.md`](docs/02_Database_Design.md) | PostgreSQL 스키마, SQLAlchemy 모델, 인덱스 전략 |
| [`docs/03_Frontend_Architecture.md`](docs/03_Frontend_Architecture.md) | Next.js 폴더 구조, 컴포넌트 설계, 상태 관리 |
| [`docs/04_Backend_Architecture.md`](docs/04_Backend_Architecture.md) | Chalice 구조, 라우팅, 인증 미들웨어 |
| [`docs/05_UI_UX_Design.md`](docs/05_UI_UX_Design.md) | 레트로 80s CRT 테마, Nixie Tube 디자인, CSS 효과 |

</div>

---

## ✨ 주요 기능

### 🔐 인증 & 인가

- ✅ **Google OAuth 2.0** 로그인/로그아웃
- ✅ **JWT 토큰** (24시간 유효)
- ✅ **Refresh Token** (7일 유효, 자동 갱신)
- ✅ **Role-based Access Control** (본인 게시물만 수정/삭제)

### 📝 게시판 기능

- ✅ **Create**: 새 게시물 작성 (제목, 내용)
- ✅ **Read**: 게시물 목록 (페이지네이션) 및 상세 조회
- ✅ **Update**: 본인 게시물 수정
- ✅ **Delete**: 본인 게시물 삭제

### 💬 댓글 시스템

- ✅ **1단계 댓글** 및 **대댓글**
- ✅ 댓글 작성/수정/삭제
- ✅ 부모 댓글 기반 계층형 구조

---

## 🧪 테스트 및 배포

### 로컬 테스트

```bash
# Backend 단위 테스트 (예)
cd backend && pytest tests/

# Frontend 컴포넌트 테스트 (예)
cd ../frontend && npm run test
```

### AWS 배포

```bash
cd backend

# dev 스테이지로 배포
chalice deploy --stage dev

# prod 스테이지로 배포
chalice deploy --stage prod

# 배포 상태 확인
chalice status --stage dev
```

자세한 배포 가이드는 [`docs/LOCAL_SETUP_GUIDE.md`](docs/LOCAL_SETUP_GUIDE.md#8-aws-배포-준비)를 참조하세요.

---

## 📖 References

### 아키텍처 & 패턴

- 🔗 [AWS Chalice Documentation](https://aws.github.io/chalice/latest/)
- 🔗 [Next.js 14 App Router](https://nextjs.org/docs/app)
- 🔗 [SQLAlchemy 2.0 ORM](https://docs.sqlalchemy.org/en/20/)
- 🔗 [JWT Best Practices](https://tools.ietf.org/html/rfc7519)

### 학습 리소스

- 📖 **Building Microservices** - Sam Newman (마이크로서비스 설계 원칙)
- 📖 **RESTful Web API Design** - Leonard Richardson (REST API 설계)
- 📖 **PostgreSQL 공식 문서** - [postgresql.org](https://www.postgresql.org/docs/)

### 관련 프로젝트

- 🔗 [EventualShop](https://github.com/AntonioFalcaoJr/EventualShop) - 이벤트 소싱 + CQRS 패턴 참고
- 🔗 [Gundam Wiki](https://en.gundam.info/en/) - 건담 우주세기 배경지식

---

<div align="center">

## 🤝 Contributing

이 프로젝트에 기여하고 싶다면:

1. Fork this repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📋 Versioning

이 프로젝트는 [Semantic Versioning](https://semver.org/ko/) 을 따릅니다.

릴리스 기록은 [Releases](https://github.com/salieri009/ToyProject-Gundam/releases)를 참조하세요.

---

## 👤 Author

**Salieri (salieri009)**

- GitHub: [@salieri009](https://github.com/salieri009)
- Project: [GUNDAM UNIVERSE BOARD](https://github.com/salieri009/ToyProject-Gundam)

---

## 📜 License

This project is licensed under the **MIT License** - see the [LICENSE](LICENSE) file for details.

---

**Made with ❤️ by Salieri | AI-Assisted Development with Cursor**

*건담 우주세기를 배경으로 한 차세대 게시판 플랫폼*

**2025년 호주 겨울 방학 프로젝트**

</div>
