# GUNDAM UNIVERSE BOARD

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

## About

**GUNDAM UNIVERSE BOARD**는 건담 우주세기 팬들을 위한 커뮤니티 플랫폼입니다.  
30년간의 소프트웨어 엔지니어링 경험을 바탕으로 설계된 이 프로젝트는 **관심사의 분리**, **레이어드 아키텍처**, **의존성 역전 원칙**을 준수하여 확장 가능하고 유지보수하기 쉬운 구조로 구현되었습니다.

**주요 특징:** JWT + Google OAuth 인증 • 마이크로서비스 아키텍처 • 클라우드 네이티브 • 레트로 80s CRT 테마

> **설계 철학**: 단순함과 명확성을 우선시하며, 각 레이어의 책임을 명확히 분리하여 테스트 가능하고 확장 가능한 구조를 지향합니다.

---

## 기술 스택

<div align="center">

| Frontend | Backend | Database |
|----------|---------|----------|
| Next.js 14 + TypeScript | AWS Chalice (Python) | PostgreSQL 15+ |
| Tailwind CSS | SQLAlchemy 2.0 | SQLAlchemy ORM |
| Axios | PyJWT + google-auth | QueuePool |

</div>

---

## 아키텍처

<div align="center">

```
┌──────────────────────┬──────────────────────────────┐
│  FRONTEND (Next.js)  │   BACKEND (AWS Chalice)      │
│  • React + TS        │  • JWT + OAuth               │
│  • Tailwind CSS      │  • REST API                  │
│  localhost:5173      │   API Gateway: api.*         │
└──────────┬───────────┴──────────┬───────────────────┘
           │  HTTPS/JSON-RPC       │
           │  (JWT Authorization)  │
           └──────────────────────┘
                    │
         ┌──────────┴──────────┐
         │  PostgreSQL 15+     │
         │  (Users, Posts,     │
         │   Comments, Tokens) │
         └──────────────────────┘
```

</div>

---

## 빠른 시작

### 사전 요구사항

Node.js v22.20.0+ • Python 3.13+ • PostgreSQL 15+ • Google OAuth 2.0

### 설치 및 실행

```bash
# 1. 저장소 클론
git clone https://github.com/salieri009/ToyProject-Gundam.git
cd ToyProject-Gundam

# 2. Backend 설정
cd backend
python -m venv venv
.\venv\Scripts\Activate  # Windows
pip install -r requirements.txt
# .env 파일 생성: DATABASE_URL, JWT_SECRET, GOOGLE_CLIENT_ID
chalice local --port 8000

# 3. Frontend 설정 (새 터미널)
cd frontend
npm install
# .env.local 파일 생성: NEXT_PUBLIC_API_URL, NEXT_PUBLIC_GOOGLE_CLIENT_ID
npm run dev
```

**접속:** Frontend `http://localhost:5173` • Backend API `http://localhost:8000`

> 상세한 설정 가이드: [`docs/LOCAL_SETUP_GUIDE.md`](docs/LOCAL_SETUP_GUIDE.md)

---

## 주요 기능

- **인증 & 인가**: Google OAuth 2.0, JWT (24h) + Refresh Token (7d), RBAC
- **게시판**: CRUD, 페이지네이션, 본인 게시물만 수정/삭제
- **댓글**: 계층형 구조 (1단계 댓글 + 대댓글)

---

## 문서

<div align="center">

| 문서 | 설명 |
|------|------|
| [`ENGINEERING_AUDIT_REPORT.md`](docs/ENGINEERING_AUDIT_REPORT.md) | 30년차 엔지니어 종합 감사 리포트 |
| [`LOCAL_SETUP_GUIDE.md`](docs/LOCAL_SETUP_GUIDE.md) | 로컬 개발 환경 설정 |
| [`01_API_Design.md`](docs/01_API_Design.md) | REST API 명세서 |
| [`02_Database_Design.md`](docs/02_Database_Design.md) | 데이터베이스 스키마 |
| [`03_Frontend_Architecture.md`](docs/03_Frontend_Architecture.md) | 프론트엔드 아키텍처 |
| [`04_Backend_Architecture.md`](docs/04_Backend_Architecture.md) | 백엔드 아키텍처 |
| [`05_UI_UX_Design.md`](docs/05_UI_UX_Design.md) | UI/UX 디자인 가이드 |

</div>

---

## 배포

```bash
cd backend
chalice deploy --stage dev   # 개발
chalice deploy --stage prod  # 프로덕션
```

> **운영 고려사항**: 프로덕션 환경에서는 환경 변수 관리, 로깅, 모니터링, 백업 전략을 반드시 구성하세요. 자세한 내용은 [`docs/LOCAL_SETUP_GUIDE.md`](docs/LOCAL_SETUP_GUIDE.md)를 참조하세요.

---

<div align="center">

## Contributing

1. Fork this repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## Author

**Salieri (salieri009)**

GitHub: [@salieri009](https://github.com/salieri009) • Project: [GUNDAM UNIVERSE BOARD](https://github.com/salieri009/ToyProject-Gundam)

---

## License

This project is licensed under the **MIT License** - see the [LICENSE](LICENSE) file for details.

---

<div align="center">

**"모빌슈트는 인간이 타는 것이다!"** - Salieri, 2025

**"이것이 젊음인가..."** - 2025년 호주 겨울 방학

![이것이 젊음인가](https://i.imgur.com/OnGZ2v0.png)

---

*건담 우주세기를 배경으로 한 차세대 게시판 플랫폼*  
*30년차 소프트웨어 엔지니어의 경험과 열정이 담긴 프로젝트*  
*AI-Assisted Development with Cursor*

**2025년 호주 겨울 방학 프로젝트**

</div>
