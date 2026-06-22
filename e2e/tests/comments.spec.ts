import { test, expect } from '@playwright/test';

test('게시글 상세에서 댓글을 작성하면 목록에 표시된다', async ({ page }) => {
  // 댓글을 달 게시글을 먼저 작성한다.
  const title = `댓글 테스트 ${Date.now()}`;
  await page.goto('/posts/new');
  await page.getByTestId('post-title-input').fill(title);
  await page.getByTestId('post-content-input').fill('댓글 대상 본문');
  await page.getByTestId('post-submit').click();
  await expect(page.getByTestId('post-detail-title')).toBeVisible();

  // 댓글 작성
  const comment = `E2E 댓글 ${Date.now()}`;
  await page.getByTestId('comment-input').fill(comment);
  await page.getByTestId('comment-submit').click();

  await expect(page.getByText(comment)).toBeVisible();
});
