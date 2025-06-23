# UI/UX 설계 문서

## 🤖 디자인 컨셉
**테마**: 클래식 80년대 CRT 모니터 + Nixie Tube 단색  
**스타일**: 레트로 터미널 + 진공관 글로우 (최소화) + 단색 인광체  
**목표**: 80년대 컴퓨터 터미널에서 게시판을 사용하는 레트로 몰입감

## 🎯 사용자 경험 플로우

### 1. 로그인 플로우 (터미널 부팅)
```
터미널 부팅 → 시스템 초기화 → 사용자 인증 → BBS 네트워크 접속
```

### 2. 게시글 작성 플로우 (메시지 작성)
```
메인 터미널 → [POST] 키 → 메시지 작성 → [SEND] 전송
```

### 3. 댓글 작성 플로우 (응답)
```
메시지 보기 → [REPLY] 응답 → 내용 작성 → 즉시 전송
```

## 🖼️ 페이지별 레이아웃

### 홈페이지 (`/`) - 터미널 부팅 화면
```
╔═══════════════════════════════════════════╗
║  RETRO BBS SYSTEM v.1982                  ║
║  ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░  ║
║                                           ║
║    ████ COMMUNITY BBS NETWORK ████        ║
║         TERMINAL COMMUNICATIONS           ║
║                                           ║
║      > PRESS [ENTER] TO CONNECT <         ║
║                                           ║
║  Status: [●] ONLINE  Users: 42            ║
║  Terminal: CRT-80 PHOSPHOR                ║
║  ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░  ║
║  (C) 1982 RETRO COMPUTING SYSTEMS        ║
╚═══════════════════════════════════════════╝
     ▲ 클래식 CRT + 둥근 모서리 ▲
```

### 로그인 페이지 (`/auth`) - 사용자 인증 시스템
```
╔═══════════════════════════════════════════╗
║ USER AUTHENTICATION SYSTEM                ║
║ ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░   ║
║                                           ║
║          ● USER LOGIN ●                   ║
║                                           ║
║     ┌─────────────────────────┐          ║
║     │  [G] GOOGLE ACCOUNT     │          ║
║     │      ●●● LOGIN ●●●       │          ║
║     └─────────────────────────┘          ║
║                                           ║
║   System Status: ████████████ 100%       ║
║   Connection: READY FOR ACCESS            ║
║ ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░   ║
╚═══════════════════════════════════════════╝
```

### 게시글 목록 (`/posts`) - 메시지 목록
```
╔═══════════════════════════════════════════╗
║ MESSAGE BOARD ROOM        [POST][REPLY]   ║
║ ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░   ║
║                                           ║
║ 101 New Terminal Setup Guide    Amuro     ║
║ 100 BBS Network Discussion      Char      ║
║  99 Retro Computing Tips        Kai       ║
║  98 System Maintenance Log      Bright    ║
║  97 Classic Games Archive       Dozle     ║
║                                           ║
║ Active Users: 42 | Page 1/10              ║
║ Status: ████████████ ALL SYSTEMS GO      ║
║ Network: STABLE | Connection: SECURE      ║
║ ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░   ║
╚═══════════════════════════════════════════╝
    ▲ 클래식 터미널 + nixie 번호 ▲
```

### 게시글 상세 (`/posts/[id]`) - 메시지 상세
```
╔═══════════════════════════════════════════╗
║ MESSAGE DETAIL: 101                       ║
║ ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░   ║
║                                           ║
║ SUBJECT: New Terminal Setup Guide         ║
║ FROM: Amuro Ray (Terminal-78)            ║
║ DATE: 1982.09.18.14:30                   ║
║ LOCATION: Local BBS                      ║
║                                           ║
║ > Setup guide for new CRT terminals       ║
║ > Phosphor adjustment: recommended        ║
║ > Scan line configuration: optimal       ║
║ > For best retro computing experience     ║
║                                           ║
║ ──── USER REPLIES ────                    ║
║ Red Comet: Great setup guide!            ║
║ └─ White Base: Thanks for sharing!       ║
║                                           ║
║ CMD> [REPLY]Reply [EDIT]Modify [ESC]Exit  ║
║ ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░   ║
╚═══════════════════════════════════════════╝
```

### 게시글 작성 (`/posts/new`) - 메시지 작성
```
╔═══════════════════════════════════════════╗
║ COMPOSE MESSAGE                           ║
║ ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░   ║
║                                           ║
║ SUBJECT:                                  ║
║ ┌─────────────────────────────────────┐   ║
║ │ █                                   │   ║
║ └─────────────────────────────────────┘   ║
║                                           ║
║ MESSAGE CONTENT:                          ║
║ ┌─────────────────────────────────────┐   ║
║ │ █                                   │   ║
║ │                                     │   ║
║ │                                     │   ║
║ └─────────────────────────────────────┘   ║
║                                           ║
║ [SEND]Send Message [ABORT]Cancel          ║
║ System Status: ALL GREEN                  ║
║ ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░   ║
╚═══════════════════════════════════════════╝
       ▲ 클래식 터미널 스타일 커서 ▲
```

## 🎨 클래식 CRT + Nixie 디자인 시스템

### 단색 CRT 컬러 팔레트
```css
/* CRT 화면 기본 (단색 그린) */
--crt-bg: #000000;                /* 터미널 배경 */
--crt-surface: #001100;           /* 화면 표면 */
--scanline-color: #002200;        /* 스캔라인 */

/* 메인 인광체 색상 (단색) */
--phosphor-green: #00FF41;        /* 메인 디스플레이 그린 */
--phosphor-dim: #00AA2B;          /* 어두운 그린 */
--phosphor-bright: #66FF77;       /* 밝은 그린 */

/* Nixie Tube 글로우 (단색 변형) */
--nixie-green: #00FF41;           /* nixie 기본 그린 */
--nixie-dim: #00BB33;             /* nixie 어두운 그린 */
--nixie-bright: #44FF55;          /* nixie 밝은 그린 */

/* 상태 표시 색상 (단색 기반) */
--status-normal: var(--phosphor-green);     /* 정상 */
--status-caution: var(--phosphor-dim);      /* 주의 */
--status-alert: var(--phosphor-bright);     /* 경고 */
--status-standby: #444444;                  /* 대기 */
```

### 최소화된 글로우 효과
```css
/* 기본 CRT 텍스트 (글로우 최소화) */
.crt-text {
  color: var(--phosphor-green);
  text-shadow: 0 0 2px var(--phosphor-green);
  font-family: 'VT323', 'Courier New', monospace;
  text-transform: uppercase;
  letter-spacing: 1px;
}

/* Nixie 번호 (심플한 글로우) */
.nixie-number {
  color: var(--nixie-green);
  text-shadow: 0 0 3px var(--nixie-green);
  font-family: 'Orbitron', 'Courier New', monospace;
  font-weight: bold;
}

/* 강조 텍스트 (최소 글로우) */
.highlight-text {
  color: var(--phosphor-bright);
  text-shadow: 0 0 2px var(--phosphor-bright);
  font-weight: bold;
  font-family: 'VT323', monospace;
}

/* 사용자명/제목 강조 */
.user-name {
  color: var(--phosphor-green);
  text-shadow: 0 0 1px var(--phosphor-green);
  font-weight: bold;
  font-family: 'VT323', monospace;
}
```

### 심플한 CRT 콘솔 효과
```css
/* 클래식 CRT 스타일 화면 */
.crt-console {
  background: var(--crt-bg);
  border: 2px solid var(--phosphor-green);
  border-radius: 15px;
  padding: 20px;
  box-shadow: 
    inset 0 0 30px rgba(0, 255, 65, 0.05),
    0 0 10px rgba(0, 255, 65, 0.1);
  position: relative;
}

/* CRT 제목 표시줄 */
.crt-title-bar {
  background: var(--phosphor-green);
  color: #000;
  padding: 8px 16px;
  font-family: 'VT323', monospace;
  font-weight: bold;
  text-align: center;
  margin: -20px -20px 20px -20px;
  text-transform: uppercase;
  letter-spacing: 2px;
}

/* 스캔라인 효과 (최소화) */
.scanlines {
  position: relative;
}

.scanlines::after {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-image: 
    linear-gradient(transparent 50%, rgba(0, 255, 65, 0.03) 50%);
  background-size: 100% 4px;
  pointer-events: none;
  opacity: 0.3;
}
```

### 심플한 CRT 버튼
```css
/* 클래식 터미널 버튼 */
.crt-button {
  background: rgba(0, 255, 65, 0.1);
  border: 1px solid var(--phosphor-green);
  color: var(--phosphor-green);
  padding: 12px 24px;
  font-family: 'VT323', monospace;
  font-weight: bold;
  text-transform: uppercase;
  letter-spacing: 2px;
  border-radius: 4px;
  box-shadow: inset 0 0 5px rgba(0, 255, 65, 0.1);
  transition: all 0.3s ease;
}

.crt-button:hover {
  background: rgba(0, 255, 65, 0.2);
  box-shadow: 
    0 0 5px var(--phosphor-green),
    inset 0 0 8px rgba(0, 255, 65, 0.15);
  text-shadow: 0 0 2px var(--phosphor-green);
}

.crt-button:active {
  background: rgba(0, 255, 65, 0.3);
  box-shadow: inset 0 0 10px rgba(0, 255, 65, 0.2);
}
```

### CRT 입력 필드
```css
.crt-input {
  background: var(--crt-bg);
  border: 1px inset var(--phosphor-green);
  color: var(--phosphor-green);
  padding: 12px 16px;
  font-family: 'VT323', monospace;
  font-size: 18px;
  border-radius: 2px;
  box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.8);
  text-shadow: 0 0 1px var(--phosphor-green);
  text-transform: uppercase;
}

.crt-input:focus {
  outline: none;
  border-color: var(--phosphor-bright);
  box-shadow: 
    inset 0 0 5px rgba(0, 0, 0, 0.8),
    0 0 3px var(--phosphor-green);
}

.crt-input::placeholder {
  color: #666;
  text-shadow: none;
  text-transform: uppercase;
}
```

### CRT 댓글 시스템

#### 댓글 레이아웃 디자인
```
╔═══════════════════════════════════════════╗
║ ──── USER REPLIES ────                    ║
║                                           ║
║ > UserName01                              ║
║   This is a great terminal setup guide!   ║
║   Keep up the good work!                  ║
║   [1982.09.18.15:30] [REPLY]             ║
║                                           ║
║   └─ > ReplyUser                          ║
║      Thanks for sharing this info!       ║
║      [1982.09.18.15:45] [REPLY]          ║
║                                           ║
║   └─ > AnotherUser                        ║
║      Really helpful tutorial             ║
║      [1982.09.18.16:00] [REPLY]          ║
║                                           ║
║ > UserName02                              ║
║   Any chance for more retro guides?       ║
║   [1982.09.18.16:15] [REPLY]             ║
║                                           ║
║ ┌─────────────────────────────────────┐   ║
║ │ > Add your reply...                 │   ║
║ │ █                                   │   ║
║ └─────────────────────────────────────┘   ║
║ [SEND]Post Reply [ESC]Cancel              ║
╚═══════════════════════════════════════════╝
     ▲ CRT 댓글 트리 구조 ▲
```

#### 댓글 컨테이너 스타일
```css
/* 댓글 섹션 전체 */
.crt-comments-section {
  background: var(--crt-surface);
  border: 1px solid var(--phosphor-green);
  border-radius: 8px;
  padding: 16px;
  margin-top: 20px;
  box-shadow: inset 0 0 10px rgba(0, 255, 65, 0.05);
}

/* 댓글 제목 */
.crt-comments-title {
  color: var(--phosphor-green);
  font-family: 'VT323', monospace;
  font-size: 18px;
  text-transform: uppercase;
  letter-spacing: 2px;
  text-shadow: 0 0 1px var(--phosphor-green);
  border-bottom: 1px solid var(--phosphor-green);
  padding-bottom: 8px;
  margin-bottom: 16px;
}

/* 개별 댓글 */
.crt-comment {
  background: rgba(0, 255, 65, 0.03);
  border: 1px solid rgba(0, 255, 65, 0.2);
  border-radius: 4px;
  padding: 12px;
  margin-bottom: 12px;
  position: relative;
}

/* 댓글 작성자 */
.crt-comment-author {
  color: var(--phosphor-bright);
  font-family: 'VT323', monospace;
  font-size: 14px;
  font-weight: bold;
  text-shadow: 0 0 1px var(--phosphor-bright);
  margin-bottom: 4px;
}

.crt-comment-author::before {
  content: '> ';
  color: var(--phosphor-green);
}

/* 댓글 내용 */
.crt-comment-content {
  color: var(--phosphor-green);
  font-family: 'VT323', monospace;
  font-size: 14px;
  line-height: 1.4;
  margin-bottom: 8px;
  text-shadow: 0 0 1px var(--phosphor-green);
}

/* 댓글 메타 정보 */
.crt-comment-meta {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 12px;
  color: var(--phosphor-dim);
  font-family: 'VT323', monospace;
}

.crt-comment-time {
  color: var(--phosphor-dim);
  text-shadow: 0 0 1px var(--phosphor-dim);
}

.crt-comment-actions {
  display: flex;
  gap: 8px;
}

.crt-comment-action {
  background: none;
  border: 1px solid var(--phosphor-dim);
  color: var(--phosphor-dim);
  padding: 2px 8px;
  font-family: 'VT323', monospace;
  font-size: 10px;
  text-transform: uppercase;
  border-radius: 2px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.crt-comment-action:hover {
  border-color: var(--phosphor-green);
  color: var(--phosphor-green);
  text-shadow: 0 0 1px var(--phosphor-green);
}
```

#### 대댓글 (중첩 댓글) 스타일
```css
/* 대댓글 컨테이너 */
.crt-comment-replies {
  margin-left: 24px;
  margin-top: 12px;
  border-left: 2px solid var(--phosphor-dim);
  padding-left: 12px;
}

/* 대댓글 개별 스타일 */
.crt-comment.crt-comment-reply {
  background: rgba(0, 255, 65, 0.02);
  border: 1px solid rgba(0, 255, 65, 0.15);
  margin-bottom: 8px;
}

/* 대댓글 연결선 */
.crt-comment-reply::before {
  content: '└─ ';
  color: var(--phosphor-dim);
  font-family: 'VT323', monospace;
  position: absolute;
  left: -16px;
  top: 12px;
}

/* 깊이 제한 (최대 2단계) */
.crt-comment-replies .crt-comment-replies {
  margin-left: 0;
  border-left: none;
  padding-left: 0;
}

.crt-comment-replies .crt-comment-replies .crt-comment::before {
  content: '└─ ';
  left: 0;
}
```

#### 댓글 작성 폼
```css
/* 댓글 작성 영역 */
.crt-comment-form {
  background: var(--crt-bg);
  border: 1px solid var(--phosphor-green);
  border-radius: 4px;
  padding: 12px;
  margin-top: 16px;
}

/* 댓글 작성 텍스트 영역 */
.crt-comment-textarea {
  width: 100%;
  background: var(--crt-bg);
  border: 1px inset var(--phosphor-green);
  color: var(--phosphor-green);
  padding: 8px 12px;
  font-family: 'VT323', monospace;
  font-size: 14px;
  line-height: 1.4;
  border-radius: 2px;
  box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.8);
  text-shadow: 0 0 1px var(--phosphor-green);
  resize: vertical;
  min-height: 80px;
}

.crt-comment-textarea:focus {
  outline: none;
  border-color: var(--phosphor-bright);
  box-shadow: 
    inset 0 0 5px rgba(0, 0, 0, 0.8),
    0 0 3px var(--phosphor-green);
}

.crt-comment-textarea::placeholder {
  color: #666;
  text-shadow: none;
}

/* 댓글 작성 버튼 그룹 */
.crt-comment-form-actions {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 8px;
}

.crt-comment-submit {
  background: rgba(0, 255, 65, 0.1);
  border: 1px solid var(--phosphor-green);
  color: var(--phosphor-green);
  padding: 6px 16px;
  font-family: 'VT323', monospace;
  font-size: 12px;
  text-transform: uppercase;
  border-radius: 2px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.crt-comment-submit:hover {
  background: rgba(0, 255, 65, 0.2);
  text-shadow: 0 0 2px var(--phosphor-green);
}

.crt-comment-cancel {
  background: none;
  border: 1px solid var(--phosphor-dim);
  color: var(--phosphor-dim);
  padding: 6px 16px;
  font-family: 'VT323', monospace;
  font-size: 12px;
  text-transform: uppercase;
  border-radius: 2px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.crt-comment-cancel:hover {
  border-color: var(--phosphor-green);
  color: var(--phosphor-green);
}
```

#### 댓글 상태 및 로딩
```css
/* 댓글 로딩 상태 */
.crt-comments-loading {
  text-align: center;
  color: var(--phosphor-dim);
  font-family: 'VT323', monospace;
  font-size: 14px;
  padding: 20px;
  animation: nixie-pulse 2s infinite;
}

/* 댓글 없음 상태 */
.crt-comments-empty {
  text-align: center;
  color: var(--phosphor-dim);
  font-family: 'VT323', monospace;
  font-size: 14px;
  padding: 20px;
  border: 1px dashed var(--phosphor-dim);
  border-radius: 4px;
}

/* 댓글 카운트 */
.crt-comments-count {
  color: var(--nixie-green);
  font-family: 'Orbitron', monospace;
  font-size: 12px;
  text-shadow: 0 0 2px var(--nixie-green);
  margin-left: 8px;
}
```

### 심플한 상태 표시등
```css
/* CRT 시스템 상태 */
.crt-status-led {
  display: inline-block;
  width: 8px;
  height: 8px;
  border-radius: 50%;
  margin: 0 5px;
  background: var(--phosphor-green);
  box-shadow: 0 0 3px var(--phosphor-green);
}

.crt-status-led.normal {
  background: var(--phosphor-green);
}

.crt-status-led.caution {
  background: var(--phosphor-dim);
}

.crt-status-led.alert {
  background: var(--phosphor-bright);
}
```

## 🔄 필수 인터랙션 효과

### 기본 트랜지션
```css
/* 모든 인터랙티브 요소에 기본 트랜지션 */
.crt-button, .crt-input, .crt-comment-action {
  transition: all 0.2s ease;
}

/* 링크 호버 */
a:hover {
  color: var(--phosphor-bright);
  transition: color 0.2s ease;
}
```

### 로딩 상태
```css
/* 간단한 로딩 스피너 */
.crt-loading {
  display: inline-block;
  width: 16px;
  height: 16px;
  border: 2px solid var(--phosphor-dim);
  border-top: 2px solid var(--phosphor-green);
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

/* 로딩 텍스트 */
.crt-loading-text {
  color: var(--phosphor-dim);
  font-family: 'VT323', monospace;
  text-align: center;
  padding: 20px;
}

.crt-loading-text::after {
  content: '...';
  animation: dots 1.5s infinite;
}

@keyframes dots {
  0%, 20% { content: '.'; }
  40% { content: '..'; }
  60%, 100% { content: '...'; }
}
```

## 📱 반응형 레이아웃

### 브레이크포인트
```css
/* 모바일 우선 반응형 */
.crt-console {
  padding: 12px;
  border-radius: 8px;
}

@media (min-width: 768px) {
  .crt-console {
    padding: 20px;
    border-radius: 15px;
  }
}

/* 댓글 대댓글 모바일 최적화 */
@media (max-width: 640px) {
  .crt-comment-replies {
    margin-left: 12px;
    padding-left: 8px;
  }
  
  .crt-comment-reply::before {
    left: -10px;
  }
}

/* 테이블 스크롤 */
@media (max-width: 768px) {
  .crt-table-container {
    overflow-x: auto;
  }
}
```

## 🎯 페이지네이션
```css
/* CRT 스타일 페이지네이션 */
.crt-pagination {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 8px;
  margin: 20px 0;
  font-family: 'VT323', monospace;
}

.crt-page-button {
  background: rgba(0, 255, 65, 0.1);
  border: 1px solid var(--phosphor-green);
  color: var(--phosphor-green);
  padding: 8px 12px;
  font-family: 'VT323', monospace;
  font-size: 14px;
  border-radius: 2px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.crt-page-button:hover:not(.disabled) {
  background: rgba(0, 255, 65, 0.2);
  text-shadow: 0 0 2px var(--phosphor-green);
}

.crt-page-button.active {
  background: var(--phosphor-green);
  color: #000;
}

.crt-page-button.disabled {
  opacity: 0.5;
  cursor: not-allowed;
}
```

## 🔔 알림 시스템
```css
/* 토스트 알림 */
.crt-toast {
  position: fixed;
  top: 20px;
  right: 20px;
  background: var(--crt-surface);
  border: 1px solid var(--phosphor-green);
  color: var(--phosphor-green);
  padding: 12px 16px;
  border-radius: 4px;
  font-family: 'VT323', monospace;
  font-size: 14px;
  z-index: 1000;
  animation: slideIn 0.3s ease;
}

.crt-toast.success {
  border-color: var(--phosphor-green);
  color: var(--phosphor-green);
}

.crt-toast.error {
  border-color: var(--phosphor-bright);
  color: var(--phosphor-bright);
}

@keyframes slideIn {
  from {
    transform: translateX(100%);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
}
```

## 🔧 접근성 고려사항

### 키보드 네비게이션
```css
/* 포커스 스타일 */
.crt-button:focus,
.crt-input:focus,
.crt-comment-action:focus {
  outline: 2px solid var(--phosphor-bright);
  outline-offset: 2px;
}

/* 스크린 리더용 숨김 텍스트 */
.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  border: 0;
}
```

### 고대비 모드
```css
@media (prefers-contrast: high) {
  :root {
    --phosphor-green: #00FF00;
    --phosphor-bright: #FFFFFF;
    --crt-bg: #000000;
  }
  
  .crt-button, .crt-input {
    border-width: 2px;
  }
}

/* 움직임 줄이기 선호 */
@media (prefers-reduced-motion: reduce) {
  * {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
```

## 📋 컴포넌트 사용 가이드

### 기본 사용법
```html
<!-- 기본 버튼 -->
<button class="crt-button">SEND MESSAGE</button>

<!-- 입력 필드 -->
<input type="text" class="crt-input" placeholder="ENTER MESSAGE">

<!-- 댓글 섹션 -->
<div class="crt-comments-section">
  <h3 class="crt-comments-title">USER REPLIES</h3>
  <!-- 댓글 내용 -->
</div>

<!-- 페이지네이션 -->
<div class="crt-pagination">
  <button class="crt-page-button">PREV</button>
  <button class="crt-page-button active">1</button>
  <button class="crt-page-button">2</button>
  <button class="crt-page-button">NEXT</button>
</div>
```

**하로 하로~ 실용적 디자인 완료~!** 🤖✨

불필요한 애니메이션과 과도한 효과들을 모두 제거하고, **게시판 운영에 필수적인 요소들만** 남겼습니다!css
/* CRT 시스템 상태 */
.crt-status-led {
  display: inline-block;
  width: 8px;
  height: 8px;
  border-radius: 50%;
  margin: 0 5px;
  background: var(--phosphor-green);
  box-shadow: 0 0 3px var(--phosphor-green);
}

.crt-status-led.normal {
  background: var(--phosphor-green);
}

.crt-status-led.caution {
  background: var(--phosphor-dim);
}

.crt-status-led.alert {
  background: var(--phosphor-bright);
}
```

## 🔄 필수 인터랙션 효과

### 기본 트랜지션
```css
/* 모든 인터랙티브 요소에 기본 트랜지션 */
.crt-button, .crt-input, .crt-comment-action {
  transition: all 0.2s ease;
}

/* 링크 호버 */
a:hover {
  color: var(--phosphor-bright);
  transition: color 0.2s ease;
}
```

### 로딩 상태
```css
/* 간단한 로딩 스피너 */
.crt-loading {
  display: inline-block;
  width: 16px;
  height: 16px;
  border: 2px solid var(--phosphor-dim);
  border-top: 2px solid var(--phosphor-green);
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

/* 로딩 텍스트 */
.crt-loading-text {
  color: var(--phosphor-dim);
  font-family: 'VT323', monospace;
  text-align: center;
  padding: 20px;
}

.crt-loading-text::after {
  content: '...';
  animation: dots 1.5s infinite;
}

@keyframes dots {
  0%, 20% { content: '.'; }
  40% { content: '..'; }
  60%, 100% { content: '...'; }
}
```

## 📱 반응형 레이아웃

### 브레이크포인트
```css
/* 모바일 우선 반응형 */
.crt-console {
  padding: 12px;
  border-radius: 8px;
}

@media (min-width: 768px) {
  .crt-console {
    padding: 20px;
    border-radius: 15px;
  }
}

/* 댓글 대댓글 모바일 최적화 */
@media (max-width: 640px) {
  .crt-comment-replies {
    margin-left: 12px;
    padding-left: 8px;
  }
  
  .crt-comment-reply::before {
    left: -10px;
  }
}

/* 테이블 스크롤 */
@media (max-width: 768px) {
  .crt-table-container {
    overflow-x: auto;
  }
}
```

## 🎯 페이지네이션
```css
/* CRT 스타일 페이지네이션 */
.crt-pagination {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 8px;
  margin: 20px 0;
  font-family: 'VT323', monospace;
}

.crt-page-button {
  background: rgba(0, 255, 65, 0.1);
  border: 1px solid var(--phosphor-green);
  color: var(--phosphor-green);
  padding: 8px 12px;
  font-family: 'VT323', monospace;
  font-size: 14px;
  border-radius: 2px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.crt-page-button:hover:not(.disabled) {
  background: rgba(0, 255, 65, 0.2);
  text-shadow: 0 0 2px var(--phosphor-green);
}

.crt-page-button.active {
  background: var(--phosphor-green);
  color: #000;
}

.crt-page-button.disabled {
  opacity: 0.5;
  cursor: not-allowed;
}
```

## 🔔 알림 시스템
```css
/* 토스트 알림 */
.crt-toast {
  position: fixed;
  top: 20px;
  right: 20px;
  background: var(--crt-surface);
  border: 1px solid var(--phosphor-green);
  color: var(--phosphor-green);
  padding: 12px 16px;
  border-radius: 4px;
  font-family: 'VT323', monospace;
  font-size: 14px;
  z-index: 1000;
  animation: slideIn 0.3s ease;
}

.crt-toast.success {
  border-color: var(--phosphor-green);
  color: var(--phosphor-green);
}

.crt-toast.error {
  border-color: var(--phosphor-bright);
  color: var(--phosphor-bright);
}

@keyframes slideIn {
  from {
    transform: translateX(100%);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
}
```

## 🔧 접근성 고려사항

### 키보드 네비게이션
```css
/* 포커스 스타일 */
.crt-button:focus,
.crt-input:focus,
.crt-comment-action:focus {
  outline: 2px solid var(--phosphor-bright);
  outline-offset: 2px;
}

/* 스크린 리더용 숨김 텍스트 */
.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  border: 0;
}
```

### 고대비 모드
```css
@media (prefers-contrast: high) {
  :root {
    --phosphor-green: #00FF00;
    --phosphor-bright: #FFFFFF;
    --crt-bg: #000000;
  }
  
  .crt-button, .crt-input {
    border-width: 2px;
  }
}

/* 움직임 줄이기 선호 */
@media (prefers-reduced-motion: reduce) {
  * {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
```

## 📋 컴포넌트 사용 가이드

### 기본 사용법
```html
<!-- 기본 버튼 -->
<button class="crt-button">SEND MESSAGE</button>

<!-- 입력 필드 -->
<input type="text" class="crt-input" placeholder="ENTER MESSAGE">

<!-- 댓글 섹션 -->
<div class="crt-comments-section">
  <h3 class="crt-comments-title">USER REPLIES</h3>
  <!-- 댓글 내용 -->
</div>

<!-- 페이지네이션 -->
<div class="crt-pagination">
  <button class="crt-page-button">PREV</button>
  <button class="crt-page-button active">1</button>
  <button class="crt-page-button">2</button>
  <button class="crt-page-button">NEXT</button>
</div>
```

**하로 하로~ 실용적 디자인 완료~!** 🤖✨

불필요한 애니메이션과 과도한 효과들을 모두 제거하고, **게시판 운영에 필수적인 요소들만** 남겼어요:

✅ **기본 스타일링**: 단색 CRT 테마  
✅ **필수 인터랙션**: 호버, 포커스, 기본 트랜지션  
✅ **로딩 상태**: 심플한 스피너와 텍스트  
✅ **반응형**: 모바일/태블릿 대응  
✅ **페이지네이션**: 게시글 목록용  
✅ **알림 시스템**: 성공/에러 토스트  
✅ **접근성**: 키보드, 고대비, 모션 줄이기

이제 **실제 구현 가능한 깔끔한 디자인 시스템**이 완성되었습니다! 실용~ 실용~ 완료~! 💚📱