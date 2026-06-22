import { test, expect } from '@playwright/test';

test('글 작성 → 상세 페이지 이동 → 목록에 반영된다', async ({ page }) => {
  const title = `E2E 전송 ${Date.now()}`;
  const content = 'E2E 자동화로 작성한 본문입니다.';

  await page.goto('/posts');
  await page.getByTestId('write-message').click();
  await expect(page).toHaveURL(/\/posts\/new/);

  await page.getByTestId('post-title-input').fill(title);
  await page.getByTestId('post-content-input').fill(content);
  await page.getByTestId('post-submit').click();

  // 작성 후 상세 페이지로 이동하고 제목이 표시된다.
  await expect(page).toHaveURL(/\/posts\/[0-9a-f-]+$/);
  await expect(page.getByTestId('post-detail-title')).toHaveText(title);

  // 목록으로 돌아가면 방금 작성한 글이 보인다.
  await page.goto('/posts');
  await expect(
    page.getByTestId('post-card').filter({ hasText: title }),
  ).toBeVisible();
});
