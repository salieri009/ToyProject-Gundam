import { test, expect } from '@playwright/test';

// 인증 상태(storageState)로 진입 — 헤더에 사용자 정보가 반영되어야 한다.
test('로그인 상태에서 헤더에 파일럿 정보와 로그아웃이 노출된다', async ({ page }) => {
  await page.goto('/posts');
  await expect(page).toHaveURL(/\/posts/);
  await expect(page.getByText('E2E Pilot')).toBeVisible();
  await expect(page.getByRole('button', { name: /LOGOUT/i })).toBeVisible();
});
