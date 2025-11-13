# 🚀 로컬 개발 환경 설정 가이드

이 문서는 **Gundam Universe Board** 프로젝트를 로컬 환경에서 개발하기 위한 상세한 설정 가이드입니다.

> **중요**: 이 문서는 `.gitignore`에 추가되어 있으므로 민감한 정보(비밀번호, API 키 등)를 기록해도 Git에 커밋되지 않습니다.

---

## 📋 목차

1. [사전 요구사항](#1-사전-요구사항)
2. [PostgreSQL 설치 및 설정](#2-postgresql-설치-및-설정)
3. [백엔드 설정](#3-백엔드-설정)
4. [프론트엔드 설정](#4-프론트엔드-설정)
5. [Google OAuth 설정](#5-google-oauth-설정)
6. [로컬 실행](#6-로컬-실행)
7. [문제 해결](#7-문제-해결)
8. [AWS 배포 준비](#8-aws-배포-준비)

---

## 1. 사전 요구사항

### 설치 확인

다음 소프트웨어가 설치되어 있는지 확인하세요:

- ✅ **Python 3.13.8** (현재 설치됨)
- ✅ **Node.js v22.20.0** (현재 설치됨)
- ⬜ **PostgreSQL 15+** (아래에서 설치)
- ⬜ **Git**

### 버전 확인 명령어

```powershell
# Python 버전 확인
python --version

# Node.js 버전 확인
node --version

# npm 버전 확인
npm --version

# PostgreSQL 버전 확인 (설치 후)
psql --version
```

---

## 2. PostgreSQL 설치 및 설정

### 2.1 PostgreSQL 설치 (Windows)

#### 방법 1: 공식 설치 프로그램

1. **다운로드**
   - [PostgreSQL 공식 사이트](https://www.postgresql.org/download/windows/)에서 설치 프로그램 다운로드
   - 또는 [EnterpriseDB 인스톨러](https://www.enterprisedb.com/downloads/postgres-postgresql-downloads) 다운로드

2. **설치 진행**
   - 설치 프로그램 실행
   - 설치 경로: 기본값 사용 (예: `C:\Program Files\PostgreSQL\15`)
   - 구성 요소 선택: **모두 체크** (PostgreSQL Server, pgAdmin 4, Command Line Tools)
   - 포트: **5432** (기본값)
   - 슈퍼유저(postgres) 비밀번호: **원하는 비밀번호 설정** (꼭 기억하세요!)

3. **환경 변수 확인**
   - 설치 후 `psql` 명령어가 작동하지 않으면 PATH에 추가:
   ```
   C:\Program Files\PostgreSQL\15\bin
   ```

#### 방법 2: Chocolatey로 설치 (추천)

```powershell
# Chocolatey가 설치되어 있다면
choco install postgresql15 -y

# 또는 최신 버전
choco install postgresql -y
```

### 2.2 PostgreSQL 서비스 시작

```powershell
# Windows 서비스에서 PostgreSQL 시작 확인
# 또는 명령어로 시작
net start postgresql-x64-15
```

### 2.3 데이터베이스 생성

```powershell
# PostgreSQL 접속 (비밀번호 입력 필요)
psql -U postgres

# PostgreSQL 프롬프트에서 다음 명령어 실행:
```

```sql
-- 프로젝트용 데이터베이스 생성
CREATE DATABASE gundam_board;

-- 데이터베이스 목록 확인
\l

-- 생성된 데이터베이스로 연결
\c gundam_board

-- 종료
\q
```

### 2.4 연결 정보 기록

설치 후 다음 정보를 기록하세요 (나중에 .env 파일에 사용):

```
Host: localhost
Port: 5432
Database: gundam_board
Username: postgres
Password: [설치 시 설정한 비밀번호]
```

---

## 3. 백엔드 설정

### 3.1 디렉토리 이동

```powershell
cd D:\UTS\ToyProject\ToyProject-Gundam\backend
```

### 3.2 Python 가상환경 생성 및 활성화

```powershell
# 가상환경 생성
python -m venv venv

# 가상환경 활성화 (PowerShell)
.\venv\Scripts\Activate.ps1

# 가상환경 활성화 (CMD)
.\venv\Scripts\activate.bat
```

> **주의**: PowerShell에서 스크립트 실행 오류가 발생하면:
> ```powershell
> Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
> ```

### 3.3 Python 패키지 설치

```powershell
# 의존성 설치
pip install -r requirements.txt

# 설치 확인
pip list
```

### 3.4 환경 변수 설정

```powershell
# .env.example을 복사하여 .env 파일 생성
copy .env.example .env

# 텍스트 에디터로 .env 파일 열기
notepad .env
```

**`.env` 파일 내용 작성:**

```env
# Database Configuration
DATABASE_URL=postgresql://postgres:[YOUR_PASSWORD]@localhost:5432/gundam_board

# JWT Configuration
JWT_SECRET=gundam-super-secret-key-2024-change-me-in-production
JWT_ALGORITHM=HS256
JWT_EXPIRATION=86400

# Google OAuth Configuration (아래 5단계에서 설정)
GOOGLE_CLIENT_ID=your-google-client-id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=your-google-client-secret

# Application Configuration
STAGE=dev
DEBUG=True
```

> ⚠️ **중요**: 
> - `[YOUR_PASSWORD]`를 PostgreSQL 설치 시 설정한 비밀번호로 변경하세요
> - `JWT_SECRET`은 랜덤한 문자열로 변경하는 것이 좋습니다
> - Google OAuth 정보는 5단계에서 설정합니다

### 3.5 데이터베이스 테이블 생성

```powershell
# Python 인터프리터 실행
python

# Python 프롬프트에서:
```

```python
from chalicelib.database import init_db
init_db()
print("Database initialized successfully!")
exit()
```

---

## 4. 프론트엔드 설정

### 4.1 디렉토리 이동

```powershell
# 새 터미널 열기 (백엔드는 계속 실행 중)
cd D:\UTS\ToyProject\ToyProject-Gundam\frontend
```

### 4.2 Node.js 패키지 설치

```powershell
# 의존성 설치
npm install

# 설치 확인
npm list --depth=0
```

### 4.3 환경 변수 설정

```powershell
# .env.local.example을 복사하여 .env.local 파일 생성
copy .env.local.example .env.local

# 텍스트 에디터로 .env.local 파일 열기
notepad .env.local
```

**`.env.local` 파일 내용 작성:**

```env
# API Configuration
NEXT_PUBLIC_API_URL=http://localhost:8000

# Google OAuth Configuration (아래 5단계에서 설정)
NEXT_PUBLIC_GOOGLE_CLIENT_ID=your-google-client-id.apps.googleusercontent.com

# Application Configuration
NEXT_PUBLIC_APP_NAME=Gundam Universe Board
NEXT_PUBLIC_APP_VERSION=1.0.0
```

> ⚠️ **중요**: Google OAuth Client ID는 5단계에서 설정합니다

---

## 5. Google OAuth 설정

### 5.1 Google Cloud Console 접속

1. [Google Cloud Console](https://console.cloud.google.com/) 접속
2. Google 계정으로 로그인

### 5.2 새 프로젝트 생성

1. 상단의 **프로젝트 선택** 드롭다운 클릭
2. **새 프로젝트** 클릭
3. 프로젝트 이름: `Gundam Universe Board` (또는 원하는 이름)
4. **만들기** 클릭
5. 프로젝트가 생성되면 해당 프로젝트 선택

### 5.3 OAuth 동의 화면 구성

1. 좌측 메뉴에서 **API 및 서비스** > **OAuth 동의 화면** 클릭
2. User Type: **외부** 선택 후 **만들기**
3. 앱 정보 입력:
   - 앱 이름: `Gundam Universe Board`
   - 사용자 지원 이메일: 본인 이메일
   - 개발자 연락처 정보: 본인 이메일
4. **저장 후 계속** 클릭
5. 범위: 기본값 그대로 **저장 후 계속**
6. 테스트 사용자: 본인 이메일 추가 후 **저장 후 계속**
7. **대시보드로 돌아가기** 클릭

### 5.4 OAuth 2.0 Client ID 생성

1. 좌측 메뉴에서 **API 및 서비스** > **사용자 인증 정보** 클릭
2. 상단의 **+ 사용자 인증 정보 만들기** > **OAuth 클라이언트 ID** 클릭
3. 애플리케이션 유형: **웹 애플리케이션** 선택
4. 이름: `Gundam Board Web Client`
5. **승인된 JavaScript 원본** 추가:
   ```
   http://localhost:3000
   http://localhost:8000
   ```
6. **승인된 리디렉션 URI** 추가:
   ```
   http://localhost:3000/auth
   ```
7. **만들기** 클릭

### 5.5 Client ID 및 Secret 저장

생성된 정보를 복사하여 저장:

- **클라이언트 ID**: `123456789-abcdef.apps.googleusercontent.com` (예시)
- **클라이언트 보안 비밀번호**: `GOCSPX-abc123def456` (예시)

### 5.6 환경 변수에 적용

**백엔드 `.env` 파일 업데이트:**

```env
GOOGLE_CLIENT_ID=123456789-abcdef.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=GOCSPX-abc123def456
```

**프론트엔드 `.env.local` 파일 업데이트:**

```env
NEXT_PUBLIC_GOOGLE_CLIENT_ID=123456789-abcdef.apps.googleusercontent.com
```

---

## 6. 로컬 실행

### 6.1 백엔드 실행

```powershell
# backend 디렉토리에서
cd D:\UTS\ToyProject\ToyProject-Gundam\backend

# 가상환경 활성화 (아직 안 했다면)
.\venv\Scripts\Activate.ps1

# Chalice 로컬 서버 실행
chalice local --port 8000
```

**실행 확인:**
- 브라우저에서 `http://localhost:8000/health` 접속
- `{"status": "healthy"}` 응답이 나오면 성공!

### 6.2 프론트엔드 실행

```powershell
# 새 터미널에서 frontend 디렉토리로 이동
cd D:\UTS\ToyProject\ToyProject-Gundam\frontend

# 개발 서버 실행
npm run dev
```

**실행 확인:**
- 브라우저에서 `http://localhost:3000` 접속
- 메인 페이지가 보이면 성공!

### 6.3 Google 로그인 테스트

1. `http://localhost:3000/auth` 페이지 접속
2. **Google Login** 버튼 클릭
3. Google 계정 선택 및 로그인
4. 로그인 성공 시 `/posts` 페이지로 리다이렉트

---

## 7. 문제 해결

### 7.1 PostgreSQL 연결 오류

**증상:**
```
sqlalchemy.exc.OperationalError: could not connect to server
```

**해결 방법:**
1. PostgreSQL 서비스가 실행 중인지 확인:
   ```powershell
   # 서비스 상태 확인
   Get-Service postgresql-x64-15
   
   # 서비스 시작
   net start postgresql-x64-15
   ```

2. `.env` 파일의 DATABASE_URL 확인:
   - 비밀번호에 특수문자가 있다면 URL 인코딩 필요
   - 예: `@` → `%40`, `#` → `%23`

3. PostgreSQL 접속 테스트:
   ```powershell
   psql -U postgres -d gundam_board
   ```

### 7.2 Python 패키지 설치 오류

**증상:**
```
error: Microsoft Visual C++ 14.0 or greater is required
```

**해결 방법:**
1. [Visual C++ Build Tools](https://visualstudio.microsoft.com/visual-cpp-build-tools/) 설치
2. 또는 psycopg2-binary 사용 (이미 requirements.txt에 포함됨)

### 7.3 Chalice 실행 오류

**증상:**
```
ImportError: No module named chalice
```

**해결 방법:**
```powershell
# 가상환경이 활성화되었는지 확인
# 프롬프트에 (venv)가 표시되어야 함

# 가상환경 활성화
.\venv\Scripts\Activate.ps1

# chalice 재설치
pip install chalice
```

### 7.4 Google OAuth 오류

**증상:**
```
Error 400: redirect_uri_mismatch
```

**해결 방법:**
1. Google Cloud Console에서 승인된 리디렉션 URI 확인
2. `http://localhost:3000/auth` 정확히 입력되었는지 확인
3. 프론트엔드와 백엔드 모두 localhost 사용 확인

### 7.5 CORS 오류

**증상:**
```
Access to XMLHttpRequest blocked by CORS policy
```

**해결 방법:**
1. 백엔드 `config.py`의 CORS_HEADERS 확인
2. 프론트엔드 `.env.local`의 API URL 확인
3. 백엔드 재시작

### 7.6 포트 충돌 오류

**증상:**
```
Error: listen EADDRINUSE: address already in use :::3000
```

**해결 방법:**
```powershell
# 포트 사용 중인 프로세스 찾기
netstat -ano | findstr :3000

# 프로세스 종료 (PID 확인 후)
taskkill /PID [프로세스ID] /F

# 또는 다른 포트 사용
npm run dev -- -p 3001
```

---

## 8. AWS 배포 준비

### 8.1 AWS CLI 설치

```powershell
# Chocolatey로 설치
choco install awscli -y

# 또는 MSI 인스톨러
# https://aws.amazon.com/cli/
```

### 8.2 AWS 자격 증명 설정

```powershell
# AWS Configure 실행
aws configure

# 입력 정보:
# AWS Access Key ID: [YOUR_ACCESS_KEY]
# AWS Secret Access Key: [YOUR_SECRET_KEY]
# Default region name: ap-northeast-2 (서울)
# Default output format: json
```

### 8.3 Chalice 배포 설정 확인

`backend/.chalice/config.json` 파일이 이미 생성되어 있습니다.

배포 전 환경 변수 설정:

```json
{
  "stages": {
    "dev": {
      "environment_variables": {
        "DATABASE_URL": "postgresql://username:password@your-rds-endpoint/gundam_board",
        "JWT_SECRET": "your-production-jwt-secret",
        "GOOGLE_CLIENT_ID": "your-client-id",
        "GOOGLE_CLIENT_SECRET": "your-client-secret"
      }
    }
  }
}
```

### 8.4 AWS RDS PostgreSQL 생성 (배포 시)

1. AWS Console > RDS > 데이터베이스 생성
2. 엔진: PostgreSQL
3. 템플릿: 프리 티어 (테스트용)
4. DB 인스턴스 식별자: `gundam-board-db`
5. 마스터 사용자 이름: `postgres`
6. 마스터 암호: 강력한 비밀번호 설정
7. 퍼블릭 액세스: 예 (개발 단계)
8. VPC 보안 그룹: 새로 생성 (포트 5432 허용)

### 8.5 백엔드 배포 명령어

```powershell
cd backend

# 개발 환경 배포
chalice deploy --stage dev

# 프로덕션 환경 배포
chalice deploy --stage prod
```

배포 후 API Gateway URL을 프론트엔드 `.env.production`에 설정:

```env
NEXT_PUBLIC_API_URL=https://xxxxxxxx.execute-api.ap-northeast-2.amazonaws.com/api
```

### 8.6 프론트엔드 배포 (Vercel 추천)

```powershell
# Vercel CLI 설치
npm i -g vercel

# 로그인
vercel login

# 배포
cd frontend
vercel

# 프로덕션 배포
vercel --prod
```

---

## 9. 개발 워크플로우

### 일일 개발 시작

```powershell
# 1. PostgreSQL 서비스 확인
Get-Service postgresql-x64-15

# 2. 백엔드 실행 (터미널 1)
cd D:\UTS\ToyProject\ToyProject-Gundam\backend
.\venv\Scripts\Activate.ps1
chalice local --port 8000

# 3. 프론트엔드 실행 (터미널 2)
cd D:\UTS\ToyProject\ToyProject-Gundam\frontend
npm run dev
```

### 코드 변경 시

- **백엔드**: Chalice가 자동으로 리로드
- **프론트엔드**: Next.js가 자동으로 리로드
- **데이터베이스 스키마 변경**: `init_db()` 재실행

### Git 커밋 전 체크리스트

- [ ] `.env` 파일이 커밋되지 않는지 확인
- [ ] `node_modules/`, `venv/` 제외 확인
- [ ] 민감한 정보 (비밀번호, API 키) 제거
- [ ] 테스트 실행 및 통과

---

## 10. 참고 자료

### 공식 문서

- [Chalice Documentation](https://aws.github.io/chalice/)
- [Next.js Documentation](https://nextjs.org/docs)
- [PostgreSQL Documentation](https://www.postgresql.org/docs/)
- [Google OAuth Documentation](https://developers.google.com/identity/protocols/oauth2)

### 프로젝트 문서

- `01_API_Design.md` - API 명세
- `02_Database_Design.md` - 데이터베이스 설계
- `03_Frontend_Architecture.md` - 프론트엔드 구조
- `04_Backend_Architecture.md` - 백엔드 구조
- `05_UI_UX_Design.md` - UI/UX 디자인

---

## 🎉 설정 완료!

모든 설정이 완료되었습니다! 이제 다음을 실행할 수 있습니다:

1. ✅ 로컬에서 백엔드 API 서버 실행
2. ✅ 로컬에서 프론트엔드 개발 서버 실행
3. ✅ Google OAuth 로그인
4. ✅ 게시글 CRUD 기능
5. ✅ 댓글 CRUD 기능

문제가 발생하면 위의 **문제 해결** 섹션을 참고하거나, 프로젝트 문서를 확인하세요.

**Happy Coding! 🚀**
