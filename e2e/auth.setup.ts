import { test as setup, expect, request } from '@playwright/test';
import { STORAGE_STATE } from './playwright.config';

const API_URL = process.env.E2E_API_URL || 'http://localhost:8000';
const BASE_URL = process.env.E2E_BASE_URL || 'http://localhost:3000';

// 백엔드 테스트 로그인 시드(/auth/test-login)로 실제 JWT 를 발급받아
// 프런트 origin 의 localStorage 에 주입한 뒤 storageState 로 저장한다.
// 실제 Google OAuth 를 우회하면서도 토큰 검증 경로는 프로덕션과 동일하다.
setup('authenticate via test-login seed', async ({ page }) => {
  const api = await request.newContext();
  const res = await api.post(`${API_URL}/auth/test-login`, {
    data: { email: 'e2e@test.com', name: 'E2E Pilot' },
  });
  expect(res.ok(), `test-login 실패: ${res.status()}`).toBeTruthy();
  const body = await res.json();

  await page.goto(BASE_URL);
  await page.evaluate(
    ({ token, refresh, user }) => {
      localStorage.setItem('auth_token', token);
      localStorage.setItem('refresh_token', refresh);
      localStorage.setItem('user', JSON.stringify(user));
    },
    { token: body.access_token, refresh: body.refresh_token, user: body.user },
  );

  await page.context().storageState({ path: STORAGE_STATE });
});
