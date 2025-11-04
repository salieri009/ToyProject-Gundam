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

---

## � About

**GUNDAM UNIVERSE BOARD**는 건담 우주세기 팬들을 위한 커뮤니티 플랫폼입니다.  
현대적인 웹 기술 스택을 활용하여 **사용자 인증**, **게시판 CRUD**, **계층형 댓글 시스템**을 구현했습니다.

이 프로젝트는 다음을 시연합니다:

- 🔐 **JWT + Google OAuth** 기반 안전한 인증 흐름
- 🏗️ **마이크로서비스 아키텍처**: 독립적인 프론트엔드/백엔드 분리
- 📊 **데이터베이스 최적화**: SQLAlchemy ORM, 인덱싱, 쿼리 최적화
- ☁️ **클라우드 네이티브**: AWS Lambda (Chalice), PostgreSQL RDS
- 🎨 **레트로 80s CRT 테마**: Nixie Tube 수치 표시, 인광 초록색 디자인

---

## 🏛️ 솔루션 아키텍처

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

**상세한 설정 가이드는 [`docs/LOCAL_SETUP_GUIDE.md`](docs/LOCAL_SETUP_GUIDE.md)를 참조하세요.**

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

## � 문서

| 문서 | 설명 |
|------|------|
| [`docs/LOCAL_SETUP_GUIDE.md`](docs/LOCAL_SETUP_GUIDE.md) | 로컬 개발 환경 완전 설정 가이드 (PostgreSQL, 환경변수, Google OAuth) |
| [`docs/01_API_Design.md`](docs/01_API_Design.md) | REST API 엔드포인트 명세서 (요청/응답 스키마) |
| [`docs/02_Database_Design.md`](docs/02_Database_Design.md) | PostgreSQL 스키마, SQLAlchemy 모델, 인덱스 전략 |
| [`docs/03_Frontend_Architecture.md`](docs/03_Frontend_Architecture.md) | Next.js 폴더 구조, 컴포넌트 설계, 상태 관리 |
| [`docs/04_Backend_Architecture.md`](docs/04_Backend_Architecture.md) | Chalice 구조, 라우팅, 인증 미들웨어 |
| [`docs/05_UI_UX_Design.md`](docs/05_UI_UX_Design.md) | 레트로 80s CRT 테마, Nixie Tube 디자인, CSS 효과 |

---

## ✨ 주요 기능

### � 인증 & 인가

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

자세한 배포 가이드는 [`docs/LOCAL_SETUP_GUIDE.md`](docs/LOCAL_SETUP_GUIDE.md#-aws-배포-준비)를 참조하세요.

---

## � References

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

<div align="center">

**Made with ❤️ by Salieri | AI-Assisted Development with Cursor**

*건담 우주세기를 배경으로 한 차세대 게시판 플랫폼*

</div>

# 설치
npm install

# 실행
npm run dev


## 🙏 Special Thanks
Blonix 
