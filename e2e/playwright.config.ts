import { defineConfig, devices } from '@playwright/test';

// docker-compose 로 띄운 전체 스택에 연결한다 (webServer 사용 안 함).
// 로컬/CI 공통: 프런트는 :3000, 백엔드는 :8000.
const BASE_URL = process.env.E2E_BASE_URL || 'http://localhost:3000';

export const STORAGE_STATE = '.auth/user.json';

export default defineConfig({
  testDir: './tests',
  timeout: 30_000,
  expect: { timeout: 10_000 },
  fullyParallel: false,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  workers: 1,
  reporter: [['list'], ['html', { open: 'never' }]],
  use: {
    baseURL: BASE_URL,
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'on-first-retry',
  },
  projects: [
    // 1) 테스트 로그인으로 storageState 생성 (setup 파일은 루트에 위치)
    { name: 'setup', testDir: '.', testMatch: /auth\.setup\.ts/ },
    // 2) 인증 상태를 재사용하는 본 테스트
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'], storageState: STORAGE_STATE },
      dependencies: ['setup'],
    },
  ],
});
