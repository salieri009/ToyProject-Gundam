# UI/UX 설계 문서

## 🤖 디자인 컨셉
**테마**: 건담 모빌슈트 HUD + 80년대 CRT + Nixie Tube 융합  
**스타일**: 모빌슈트 콘솔 + 진공관 글로우 + 우주세기 터미널  
**목표**: 건담 파일럿이 되어 CRT 콘솔에서 작전을 수행하는 몰입감

## 🎯 사용자 경험 플로우

### 1. 로그인 플로우 (모빌슈트 기동)
```
모빌슈트 부팅 → HUD 초기화 → 파일럿 인증 → 작전 네트워크 접속
```

### 2. 게시글 작성 플로우 (작전 보고서)
```
메인 콘솔 → [MISSION] 키 → 작전 보고서 작성 → [TRANSMIT] 송신
```

### 3. 댓글 작성 플로우 (통신)
```
작전 보고서 → [COMM] 통신 → 메시지 작성 → 즉시 전송
```

## 🖼️ 페이지별 레이아웃

### 홈페이지 (`/`) - 모빌슈트 부팅 화면
```
╔═══════════════════════════════════════════╗
║  MOBILE SUIT OS v.U.C.0079               ║
║  ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░  ║
║                                           ║
║    ████ FEDERATION BBS NETWORK ████       ║
║         SIDE-7 COMMUNICATIONS             ║
║                                           ║
║      > PRESS [ENTER] TO SORTIE <          ║
║                                           ║
║  Status: [●] ALL GREEN  Pilots: ⚡42⚡    ║
║  Mobile Suit: RX-78-2 GUNDAM              ║
║  ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░  ║
║  (C) U.C.0079 ANAHEIM ELECTRONICS         ║
╚═══════════════════════════════════════════╝
     ▲ 건담 HUD + CRT 둥근 모서리 ▲
```

### 로그인 페이지 (`/auth`) - 파일럿 인증 시스템
```
╔═══════════════════════════════════════════╗
║ PILOT AUTHENTICATION SYSTEM              ║
║ ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░   ║
║                                           ║
║          ⚡ PILOT LOGIN ⚡                ║
║                                           ║
║     ┌─────────────────────────┐          ║
║     │  [G] GOOGLE FEDERATION  │          ║
║     │      ●●● LOGIN ●●●       │          ║
║     └─────────────────────────┘          ║
║                                           ║
║   Mobile Suit OS: ████████████ 100%      ║
║   Status: READY FOR SORTIE               ║
║ ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░   ║
╚═══════════════════════════════════════════╝
```

### 게시글 목록 (`/posts`) - 작전 브리핑 목록
```
╔═══════════════════════════════════════════╗
║ OPERATION BRIEFING ROOM   [MISSION][COMM] ║
║ ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░   ║
║                                           ║
║ ⚡101⚡ New Gundam Field Test    Amuro     ║
║ ⚡100⚡ Zeon Forces Movement     Char      ║
║ ⚡ 99⚡ Beam Rifle Calibration   Kai       ║
║ ⚡ 98⚡ White Base Maintenance   Bright    ║
║ ⚡ 97⚡ Jaburo Defense Plan      Dozle     ║
║                                           ║
║ Active Pilots: ⚡42⚡ | Page ⚡1⚡/⚡10⚡   ║
║ Status: ████████████ ALL SYSTEMS GO      ║
║ Network: STABLE | Connection: SECURE      ║
║ ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░   ║
╚═══════════════════════════════════════════╝
    ▲ 건담 작전명 + nixie 번호 글로우 ▲
```

### 게시글 상세 (`/posts/[id]`) - 작전 보고서
```
╔═══════════════════════════════════════════╗
║ OPERATION REPORT: ⚡101⚡                 ║
║ ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░   ║
║                                           ║
║ MISSION: New Gundam Field Test            ║
║ PILOT: Amuro Ray (RX-78-2)               ║
║ TIMESTAMP: U.C.0079.09.18.14:30          ║
║ LOCATION: Side-7 Colony                  ║
║                                           ║
║ > Field test results for new beam rifle   ║
║ > Energy output: 1.9MW confirmed         ║
║ > Zaku armor penetration: SUCCESS        ║
║ > Recommend immediate mass production     ║
║                                           ║
║ ──── PILOT COMMUNICATIONS ────            ║
║ ⚡Red Comet⚡: Impressive firepower!       ║
║ └─ ⚡White Base⚡: Char, you saw that?!   ║
║                                           ║
║ CMD> [COMM]Reply [EDIT]Modify [ESC]Exit   ║
║ ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░   ║
╚═══════════════════════════════════════════╝
```

### 게시글 작성 (`/posts/new`) - 작전 보고서 작성
```
╔═══════════════════════════════════════════╗
║ COMPOSE OPERATION REPORT                  ║
║ ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░   ║
║                                           ║
║ MISSION DESIGNATION:                      ║
║ ┌─────────────────────────────────────┐   ║
║ │ █                                   │   ║
║ └─────────────────────────────────────┘   ║
║                                           ║
║ OPERATION DETAILS:                        ║
║ ┌─────────────────────────────────────┐   ║
║ │ █                                   │   ║
║ │                                     │   ║
║ │                                     │   ║
║ └─────────────────────────────────────┘   ║
║                                           ║
║ [TRANSMIT]Send Report [ABORT]Cancel       ║
║ System Status: ALL GREEN                  ║
║ ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░   ║
╚═══════════════════════════════════════════╝
       ▲ 모빌슈트 HUD 스타일 커서 ▲
```

## 🎨 건담 CRT + Nixie 디자인 시스템

### 건담 테마 컬러 팔레트
```css
/* CRT 화면 기본 (건담 콘솔) */
--ms-console-bg: #000808;           /* 모빌슈트 콘솔 배경 */
--ms-console-surface: #001100;      /* HUD 표면 */
--scanline-color: #003300;          /* 스캔라인 */

/* 건담 팩션 색상 */
--federation-blue: #4169E1;         /* 연방군 파랑 */
--zeon-red: #DC143C;               /* 지온군 빨강 */
--anaheim-yellow: #FFD700;         /* 아나하임 노랑 */
--earth-green: #228B22;            /* 지구권 그린 */

/* Nixie Tube 글로우 (건담 버전) */
--nixie-federation: #4A90E2;       /* 연방군 nixie 블루 */
--nixie-orange: #FF6600;           /* 시스템 경고 오렌지 */
--nixie-green: #00FF44;            /* 작전 성공 그린 */
--nixie-red: #FF3366;              /* 지온군/경고 레드 */

/* CRT 인광체 (모빌슈트 모니터) */
--phosphor-green: #00FF00;         /* 메인 디스플레이 */
--phosphor-amber: #FFBB00;         /* 경고 시스템 */
--phosphor-blue: #0080FF;          /* 연방군 시스템 */

/* 상태 표시 색상 */
--status-all-green: var(--nixie-green);      /* 정상 */
--status-caution: var(--nixie-orange);       /* 주의 */
--status-alert: var(--nixie-red);            /* 경고 */
--status-standby: #666666;                   /* 대기 */
```

### 건담 HUD 글로우 효과
```css
/* 연방군 Nixie 번호 */
.federation-nixie {
  color: var(--federation-blue);
  text-shadow: 
    0 0 5px var(--federation-blue),
    0 0 10px var(--federation-blue),
    0 0 15px var(--nixie-federation),
    0 0 20px rgba(65, 105, 225, 0.8);
  font-family: 'Orbitron', 'Courier New', monospace;
  font-weight: bold;
}

/* 지온군 Nixie 번호 */
.zeon-nixie {
  color: var(--zeon-red);
  text-shadow: 
    0 0 5px var(--zeon-red),
    0 0 10px var(--zeon-red),
    0 0 15px var(--nixie-red),
    0 0 20px rgba(220, 20, 60, 0.8);
  font-family: 'Orbitron', monospace;
  font-weight: bold;
}

/* 모빌슈트 HUD 텍스트 */
.ms-hud-text {
  color: var(--phosphor-green);
  text-shadow: 
    0 0 2px var(--phosphor-green),
    0 0 5px var(--earth-green);
  font-family: 'VT323', 'Courier New', monospace;
  text-transform: uppercase;
  letter-spacing: 1px;
}

/* 파일럿/모빌슈트 이름 강조 */
.pilot-name {
  color: var(--anaheim-yellow);
  text-shadow: 
    0 0 3px var(--anaheim-yellow),
    0 0 6px rgba(255, 215, 0, 0.8);
  font-weight: bold;
  font-family: 'Orbitron', monospace;
}

/* 작전명/미션 제목 */
.mission-title {
  color: var(--federation-blue);
  text-shadow: 
    0 0 4px var(--federation-blue),
    0 0 8px var(--nixie-federation);
  font-weight: bold;
  text-transform: uppercase;
}
```

### 모빌슈트 콘솔 효과
```css
/* 건담 HUD 스타일 화면 */
.gundam-console {
  background: var(--ms-console-bg);
  border: 3px solid var(--federation-blue);
  border-radius: 15px;
  padding: 20px;
  box-shadow: 
    inset 0 0 50px rgba(65, 105, 225, 0.1),
    0 0 20px rgba(65, 105, 225, 0.3),
    0 0 40px rgba(0, 0, 0, 0.8);
  position: relative;
}

/* 모빌슈트 제목 표시줄 */
.ms-title-bar {
  background: linear-gradient(90deg, 
    var(--federation-blue), 
    var(--anaheim-yellow), 
    var(--federation-blue)
  );
  color: #000;
  padding: 8px 16px;
  font-family: 'Orbitron', monospace;
  font-weight: bold;
  text-align: center;
  margin: -20px -20px 20px -20px;
  text-transform: uppercase;
  letter-spacing: 2px;
}

/* 미노프스키 입자 노이즈 효과 */
.minovsky-interference {
  position: relative;
}

.minovsky-interference::after {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-image: 
    radial-gradient(circle, transparent 1px, rgba(65, 105, 225, 0.05) 1px);
  background-size: 3px 3px;
  pointer-events: none;
  opacity: 0.4;
  animation: minovsky-flicker 4s infinite;
}

@keyframes minovsky-flicker {
  0%, 100% { opacity: 0.2; }
  50% { opacity: 0.6; }
}
```

### 건담 테마 버튼
```css
/* 연방군 버튼 */
.federation-button {
  background: linear-gradient(145deg, 
    rgba(65, 105, 225, 0.2), 
    rgba(65, 105, 225, 0.4)
  );
  border: 2px solid var(--federation-blue);
  color: var(--federation-blue);
  padding: 12px 24px;
  font-family: 'Orbitron', monospace;
  font-weight: bold;
  text-transform: uppercase;
  letter-spacing: 2px;
  border-radius: 8px;
  box-shadow: 
    0 0 10px var(--federation-blue),
    inset 0 0 10px rgba(65, 105, 225, 0.1);
  transition: all 0.3s ease;
}

.federation-button:hover {
  background: linear-gradient(145deg, 
    rgba(65, 105, 225, 0.4), 
    rgba(65, 105, 225, 0.6)
  );
  box-shadow: 
    0 0 20px var(--federation-blue),
    0 0 30px var(--nixie-federation),
    inset 0 0 15px rgba(65, 105, 225, 0.2);
  text-shadow: 
    0 0 5px var(--federation-blue),
    0 0 10px var(--nixie-federation);
}

/* 지온군 버튼 (적대적 UI) */
.zeon-button {
  background: linear-gradient(145deg, 
    rgba(220, 20, 60, 0.2), 
    rgba(220, 20, 60, 0.4)
  );
  border: 2px solid var(--zeon-red);
  color: var(--zeon-red);
  padding: 12px 24px;
  font-family: 'Orbitron', monospace;
  font-weight: bold;
  text-transform: uppercase;
  letter-spacing: 2px;
  border-radius: 8px;
  box-shadow: 
    0 0 10px var(--zeon-red),
    inset 0 0 10px rgba(220, 20, 60, 0.1);
}

/* 아나하임 시스템 버튼 */
.anaheim-button {
  background: linear-gradient(145deg, 
    rgba(255, 215, 0, 0.2), 
    rgba(255, 215, 0, 0.4)
  );
  border: 2px solid var(--anaheim-yellow);
  color: var(--anaheim-yellow);
  padding: 12px 24px;
  font-family: 'Orbitron', monospace;
  font-weight: bold;
  text-transform: uppercase;
}
```

### 모빌슈트 입력 필드
```css
.ms-input {
  background: var(--ms-console-bg);
  border: 2px inset var(--federation-blue);
  color: var(--phosphor-green);
  padding: 12px 16px;
  font-family: 'VT323', monospace;
  font-size: 18px;
  border-radius: 4px;
  box-shadow: 
    inset 0 0 10px rgba(0, 0, 0, 0.8),
    0 0 5px rgba(65, 105, 225, 0.3);
  text-shadow: 0 0 2px var(--phosphor-green);
  text-transform: uppercase;
}

.ms-input:focus {
  outline: none;
  border-color: var(--anaheim-yellow);
  box-shadow: 
    inset 0 0 10px rgba(0, 0, 0, 0.8),
    0 0 10px var(--anaheim-yellow),
    0 0 20px rgba(255, 215, 0, 0.4);
}

.ms-input::placeholder {
  color: #666;
  text-shadow: none;
  text-transform: uppercase;
}
```

### 건담 상태 표시등
```css
/* 모빌슈트 시스템 상태 */
.ms-status-led {
  display: inline-block;
  width: 10px;
  height: 10px;
  border-radius: 50%;
  margin: 0 5px;
  box-shadow: 0 0 8px currentColor;
  animation: ms-status-pulse 2s infinite;
}

.ms-status-led.all-green {
  background: var(--nixie-green);
  color: var(--nixie-green);
}

.ms-status-led.caution {
  background: var(--nixie-orange);
  color: var(--nixie-orange);
}

.ms-status-led.alert {
  background: var(--nixie-red);
  color: var(--nixie-red);
  animation: ms-alert-flash 0.5s infinite;
}

@keyframes ms-status-pulse {
  0%, 100% { opacity: 0.8; }
  50% { opacity: 1; }
}

@keyframes ms-alert-flash {
  0%, 100% { opacity: 0.3; }
  50% { opacity: 1; }
}
```

## 🎭 건담 애니메이션 효과

### 모빌슈트 부팅 시퀀스
```css
@keyframes gundam-boot {
  0% {
    opacity: 0;
    transform: scaleY(0.1);
    filter: hue-rotate(0deg);
  }
  30% {
    opacity: 0.6;
    transform: scaleY(0.4);
    filter: hue-rotate(180deg);
  }
  70% {
    opacity: 0.9;
    transform: scaleY(0.8);
    filter: hue-rotate(360deg);
  }
  100% {
    opacity: 1;
    transform: scaleY(1);
    filter: hue-rotate(0deg);
  }
}

.gundam-boot-animation {
  animation: gundam-boot 3s ease-out;
}
```

### 연방군 Nixie 펄스
```css
@keyframes federation-pulse {
  0%, 100% {
    text-shadow: 
      0 0 5px var(--federation-blue),
      0 0 10px var(--federation-blue);
  }
  50% {
    text-shadow: 
      0 0 8px var(--federation-blue),
      0 0 15px var(--federation-blue),
      0 0 25px var(--nixie-federation);
  }
}

.federation-pulse {
  animation: federation-pulse 3s ease-in-out infinite;
}
```

## 🔧 접근성 고려사항

### 건담 고대비 모드
```css
@media (prefers-contrast: high) {
  :root {
    --phosphor-green: #00FF00;
    --federation-blue: #0099FF;
    --zeon-red: #FF0033;
    --anaheim-yellow: #FFCC00;
  }
  
  .federation-button, .ms-input {
    border-width: 3px;
  }
}
```

**하로 하로~ 건담 테마 강화 완료~!** 🤖⚡✨

이제 CRT + Nixie tube 효과와 건담의 모빌슈트 HUD가 완벽하게 융합되었습니다! 연방군 파랑, 지온군 빨강, 아나하임 노랑의 건담 고유 색상들과 모빌슈트 콘솔 느낌이 살아있어요! 건담 파일럿이 되어 작전 보고서를 작성하는 완벽한 몰입감을 제공합니다, 하로! 건담 테마~ 건담 테마~! 🚀📺 
**하로 하로~ CRT 완료~!** 80-90년대 모니터의 따뜻한 nixie tube 글로우와 스캔라인이 어우러진 레트로 게시판이 완성되었습니다! 게시판~ 게시판~! 📺✨ 