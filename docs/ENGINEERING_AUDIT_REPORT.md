# GUNDAM UNIVERSE BOARD Engineering Audit
## 1. 개요 및 범위
- **검토 주체**: 30년차 소프트웨어 엔지니어
- **프로젝트 기간**: 2025년 호주 겨울 방학동안 한 프로젝트
- **검토 일정**: 2025-11-13
- **검토 범위**: Next.js 프론트엔드, AWS Chalice 백엔드, PostgreSQL 데이터베이스, 배포/운영 문서 전반

## 2. Executive Summary
- **총평**: 구조적 기반은 견고하나, 운영 안정성을 위해 보안·트랜잭션·테스트 체계 보완이 필요합니다.
- **프로덕션 준비도**: **B+ / 70%**
- **핵심 메시지**:
  - 필수 기능은 동작하며, 주요 기술 스택의 결합은 일관적입니다.
  - 인증/인가 및 데이터 접근 제어는 구현되어 있으나, 방어선 강화를 위한 추가 조치가 필요합니다.
  - 문서 체계와 프로젝트 구조가 정리되어 신규 참여자 온보딩이 용이한 수준입니다.

## 3. 완료된 개선 사항 (2025-11-13 기준)
| 구분 | 설명 | 상태 |
|------|------|------|
| Frontend API 경로 | 모든 게시글/댓글 페이지가 `services/api.ts`를 통해 백엔드와 통신 | ✅ 적용
| 게시글 상세 댓글 로드 | 댓글 목록을 `commentsAPI.getComments()`로 동기화 | ✅ 적용
| 불필요 자산 정리 | Vite 설정, Weather 컴포넌트 등 레거시 파일 제거 | ✅ 적용
| 환경 변수 예제 | `backend/.env.example`, `frontend/.env.local.example` 제공 | ✅ 적용

## 4. 남은 주요 과제
| 우선순위 | 영역 | 내용 | 권장 조치 |
|----------|------|------|-----------|
| 🔴 Critical | 데이터 계층 | 세션 커밋/롤백 패턴 미흡, 예외 시 롤백 누락 가능 | `contextmanager` 기반 트랜잭션 헬퍼 도입, 일괄 적용 |
| 🔴 Critical | 보안 | CORS `*` 허용, JWT Secret 기본값, 입력 검증 미비 | 허용 도메인 화이트리스트, 필수 환경 변수 검사, Pydantic 검증 |
| 🟡 Medium | 인증 UX | 프론트엔드 Google 로그인 버튼 미구현 | OAuth 클라이언트 연동 및 토큰 저장 로직 구현 |
| 🟡 Medium | 코드 품질 | 로깅/모니터링 부재, 에러 응답 포맷 불일치 | `structlog` 등 도입, 공통 응답 래퍼 도입 |
| 🟢 Low | 코드 정리 | `frontend/src/pages/` 등 미사용 Pages Router 컴포넌트 존재 | App Router 체계에 맞춰 제거 또는 deprecated 표기 |

## 5. 아키텍처 스냅샷
- **Frontend**: Next.js 14 (App Router), Tailwind CSS, Axios 서비스 계층, Auth Context 기반 상태 관리
- **Backend**: AWS Chalice, SQLAlchemy ORM, JWT/Refresh Token, Google OAuth 사용자 등록
- **Database**: PostgreSQL 15+, UUID 기반 Key, Posts/Comments/User/RefreshToken 스키마
- **Infra & Deployment**: AWS Lambda + API Gateway, Vercel/로컬 개발 양립, QueuePool로 커넥션 관리

## 6. 운영 체크리스트
### 6.1 보안
- [ ] CORS 도메인 제한 & `Access-Control-Allow-Credentials` 관리
- [ ] 필수 환경 변수(JWT_SECRET, GOOGLE_CLIENT_ID 등) 검증 로직 추가
- [ ] 입력값 길이/포맷 검증 및 XSS 방지 처리
- [ ] Rate Limiting 및 Bot 방어 도입

### 6.2 안정성
- [ ] 트랜잭션 헬퍼 도입 및 라우트별 일관화
- [ ] 에러 핸들링/응답 포맷 통일 (예: `success`, `error` 필드)
- [ ] 구조화된 로깅 및 APM 연동
- [ ] 헬스 체크 및 백업 전략 문서화

### 6.3 테스트
- [ ] 단위 테스트(백엔드 라우트, 서비스 계층) 도입
- [ ] 통합 테스트 및 E2E 시나리오 구성
- [ ] Google OAuth 플로우 모킹 테스트 추가
- [ ] 로드/부하 테스트 계획 수립

## 7. 문서 변경 내역
- 이 리포트는 `PROJECT_REVIEW.md`, `PROJECT_VERIFICATION_REPORT.md`, `SENIOR_ENGINEER_REVIEW.md` 내용을 통합하여 최신 상태로 정리했습니다.
- 상기 파일들은 더 이상 사용하지 않으며, 최신 엔지니어링 리뷰는 본 문서를 기준으로 유지·갱신합니다.

## 8. 결론
- 현재 구조는 확장성과 유지보수 측면에서 좋은 기반을 갖추고 있습니다.
- Critical 과제(트랜잭션, 보안 헤더, 입력 검증)를 해결하면 프로덕션 수준 안정성을 확보할 수 있습니다.
- 운영 체계(로깅, 모니터링, 테스트)를 강화하여 “Fail Fast & Observability” 원칙을 지키는 것이 다음 단계입니다.

---
*30년차 엔지니어의 메모: “완벽을 추구하기보다, 위험을 통제할 수 있는 구조를 만들 것.”*
