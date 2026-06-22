import { test, expect } from '@playwright/test';

// 비로그인 상태 검증 — storageState 를 비워 인증을 제거한다.
test.use({ storageState: { cookies: [], origins: [] } });

test('비로그인 사용자가 /posts 접근 시 /auth 로 유도된다', async ({ page }) => {
  await page.goto('/posts');
  await expect(page).toHaveURL(/\/auth/);
});

test('비로그인 사용자가 /posts/new 접근 시 /auth 로 유도된다', async ({ page }) => {
  await page.goto('/posts/new');
  await expect(page).toHaveURL(/\/auth/);
});
